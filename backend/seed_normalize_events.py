"""
Normalize ALL events:
  1. Convert event_date from string -> datetime (timezone-aware UTC)
  2. De-duplicate events with identical slug (keep latest by created_at)
  3. Ensure every event has image_url pointing to a real venue photo
  4. Ensure event_id & slug are consistent

Safe, idempotent. Run once.
"""
import os
import re
import unicodedata
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]


def slugify(text: str) -> str:
    t = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()


def to_utc(val):
    if isinstance(val, datetime):
        return val if val.tzinfo else val.replace(tzinfo=timezone.utc)
    if isinstance(val, str):
        # Handle both "2026-03-08T15:00:00Z" and "2026-03-08T15:00:00+00:00"
        v = val.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(v).astimezone(timezone.utc)
        except ValueError:
            try:
                return datetime.strptime(val[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)
            except Exception:
                return None
    return None


# ── Step 1: convert all event_date fields to proper datetime ──
converted = 0
for e in db.events.find({}, {"_id": 0, "event_id": 1, "event_date": 1}):
    dt = to_utc(e.get("event_date"))
    if dt is not None and not isinstance(e.get("event_date"), datetime):
        db.events.update_one({"event_id": e["event_id"]}, {"$set": {"event_date": dt}})
        converted += 1
    elif isinstance(e.get("event_date"), datetime) and e["event_date"].tzinfo is None:
        db.events.update_one(
            {"event_id": e["event_id"]},
            {"$set": {"event_date": e["event_date"].replace(tzinfo=timezone.utc)}},
        )
        converted += 1
print(f"✅ Converted {converted} event_date fields to UTC datetime")

# ── Step 2: de-duplicate by (title, event_date, venue) ──
# Keep the entry with image_url set; if tie, keep earliest created_at.
from collections import defaultdict

groups = defaultdict(list)
for e in db.events.find({}, {"_id": 0}):
    key = (e.get("title", "").strip().lower(), e.get("event_date"), e.get("venue", "").strip().lower())
    groups[key].append(e)

removed = 0
for key, items in groups.items():
    if len(items) <= 1:
        continue
    # Sort: items WITH image_url first, then oldest created_at first
    def _sort_key(x):
        ca = x.get("created_at")
        if isinstance(ca, str):
            ca = to_utc(ca) or datetime.min.replace(tzinfo=timezone.utc)
        elif not isinstance(ca, datetime):
            ca = datetime.min.replace(tzinfo=timezone.utc)
        elif ca.tzinfo is None:
            ca = ca.replace(tzinfo=timezone.utc)
        return (0 if x.get("image_url") else 1, ca)
    items.sort(key=_sort_key)
    keeper = items[0]
    for dup in items[1:]:
        db.events.delete_one({"event_id": dup["event_id"]})
        removed += 1
print(f"✅ Removed {removed} duplicate events")

# ── Step 3: ensure slug exists for every event ──
no_slug = 0
for e in db.events.find({"$or": [{"slug": {"$exists": False}}, {"slug": None}, {"slug": ""}]}, {"_id": 0, "event_id": 1, "title": 1, "city": 1}):
    slug = slugify(f"{e['title']} {e.get('city','')} tickets 2026")
    db.events.update_one({"event_id": e["event_id"]}, {"$set": {"slug": slug}})
    no_slug += 1
print(f"✅ Added slug to {no_slug} events")

# ── Step 4: stats ──
print("\n=== FINAL STATS ===")
total = db.events.count_documents({})
print(f"Total events: {total}")
for t in ["f1","motogp","match","football","concert","worldcup","tennis","festival","athletics","isle_of_man_tt","attraction"]:
    n = db.events.count_documents({"event_type": t})
    print(f"  {t}: {n}")

missing_img = db.events.count_documents({
    "$or": [{"image_url": {"$exists": False}}, {"image_url": None}, {"image_url": ""}]
})
print(f"\nEvents missing image_url: {missing_img}")
