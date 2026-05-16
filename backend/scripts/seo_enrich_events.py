"""
Generate SEO-friendly descriptions and image_alt for events that lack them.
Run: cd /app/backend && python3 scripts/seo_enrich_events.py

Rules (Honesty Layer):
  - 130–160 char descriptions
  - Use real venue, city, country, date
  - Marketplace tone: "Compare verified listings"
  - image_alt: descriptive, 80-120 chars
"""
import os, sys
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
load_dotenv("/app/backend/.env")
db = MongoClient(os.environ["MONGO_URL"])[os.environ["DB_NAME"]]

CAT_LABELS = {
    "f1": "Formula 1",
    "motogp": "MotoGP",
    "concert": "concert",
    "match": "football match",
    "football": "football match",
    "worldcup": "FIFA World Cup 2026 match",
    "festival": "festival",
    "tennis": "tennis match",
    "athletics": "athletics event",
    "isle_of_man_tt": "Isle of Man TT race",
    "attraction": "experience",
}


def make_description(ev):
    title = (ev.get("title") or "").strip()
    venue = (ev.get("venue") or "").strip()
    city = (ev.get("city") or "").strip()
    country = (ev.get("country") or "").strip()
    et = ev.get("event_type") or ""
    cat = CAT_LABELS.get(et, "event")
    ed = ev.get("event_date")
    if isinstance(ed, datetime):
        date_str = ed.strftime("%B %d, %Y")
    else:
        date_str = ""
    price = ev.get("lowest_price")
    where = ""
    if venue and city:
        where = f" at {venue}, {city}"
    elif venue:
        where = f" at {venue}"
    elif city:
        where = f" in {city}"
    if country and country.lower() not in where.lower():
        where += f", {country}"
    when = f" on {date_str}" if date_str else ""
    pricing = (
        f" Tickets from €{int(price)}. Market pricing may vary."
        if isinstance(price, (int, float)) and price > 0
        else " Compare verified-seller listings — market pricing may vary."
    )
    desc = f"{title} — {cat}{where}{when}. {pricing.strip()} Secure QR delivery + buyer protection."
    # Trim to 160 chars max
    if len(desc) > 160:
        desc = desc[:157].rsplit(" ", 1)[0] + "…"
    return desc


def make_image_alt(ev):
    title = (ev.get("title") or "").strip()
    venue = (ev.get("venue") or "").strip()
    city = (ev.get("city") or "").strip()
    et = ev.get("event_type") or ""
    cat = CAT_LABELS.get(et, "event")
    parts = [title, cat]
    if venue:
        parts.append(venue)
    if city and city.lower() not in venue.lower():
        parts.append(city)
    parts.append("tickets")
    alt = " — ".join(parts)
    if len(alt) > 120:
        alt = alt[:117] + "…"
    return alt


def main():
    desc_fixed = 0
    alt_fixed = 0
    cursor = db.events.find({"seo_indexable": {"$ne": False}})
    for ev in cursor:
        updates = {}
        if not ev.get("description"):
            updates["description"] = make_description(ev)
            desc_fixed += 1
        if not ev.get("image_alt"):
            updates["image_alt"] = make_image_alt(ev)
            alt_fixed += 1
        if updates:
            db.events.update_one({"_id": ev["_id"]}, {"$set": updates})
    print(f"description filled: {desc_fixed}")
    print(f"image_alt filled:   {alt_fixed}")

    # Verify
    print("\n--- Final check ---")
    print("Indexable missing description:", db.events.count_documents({"seo_indexable":{"$ne":False},"$or":[{"description":""},{"description":None},{"description":{"$exists":False}}]}))
    print("Indexable missing image_alt:  ", db.events.count_documents({"seo_indexable":{"$ne":False},"$or":[{"image_alt":""},{"image_alt":None},{"image_alt":{"$exists":False}}]}))


if __name__ == "__main__":
    main()
