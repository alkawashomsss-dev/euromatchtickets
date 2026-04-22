"""
Free Event Image Collector (Unsplash Source)
============================================
Fetches a unique, high-resolution image for every event — 100% free,
no API key required. Uses Unsplash's `source.unsplash.com` endpoint
which returns a random photo matching the search query, and caches each
result locally under /app/backend/static/event_images/{slug}.jpg.

Strategy:
  1. For each event, build a search query from its venue + city + type
  2. Hit source.unsplash.com/1600x900/?<query> → follows redirect to an
     actual Unsplash photo
  3. Download + save locally. If the redirect URL is already used by
     another event (rare, but Unsplash caches), retry with a more
     specific query or a fallback keyword pool.
  4. Update events.image_url → /event-images/{slug}.jpg

Run:
    python -m services.image_collector --limit 5
    python -m services.image_collector --all
    python -m services.image_collector --duplicates-only
    python -m services.image_collector --missing-only
"""
import argparse
import asyncio
import hashlib
import os
import sys
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

OUT_DIR = Path(__file__).resolve().parent.parent / "static" / "event_images"
OUT_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_PREFIX = "/event-images"

# Per-event-type fallback keyword pool — used if venue+city returns
# nothing or a repeat.
TYPE_KEYWORDS = {
    "f1":        ["formula 1 circuit", "f1 grand prix", "racing track aerial", "asphalt racing", "pit lane"],
    "motogp":    ["motogp circuit", "motorcycle racing", "racing track", "grand prix", "motorbike racer"],
    "match":     ["football stadium interior", "soccer stadium night", "football pitch floodlights", "stadium crowd"],
    "football":  ["football stadium", "soccer pitch", "stadium floodlights", "stadium tunnel"],
    "worldcup":  ["world cup stadium", "fifa stadium", "soccer trophy", "stadium crowd"],
    "concert":   ["concert stage lights", "arena concert crowd", "music festival lights", "concert lasers"],
    "festival":  ["music festival crowd", "festival main stage", "outdoor concert"],
    "tennis":    ["tennis court", "tennis stadium", "grand slam court"],
    "athletics": ["athletics stadium", "running track", "olympic stadium"],
    "attraction":["landmark", "city attraction", "tourist landmark"],
    "boxing":    ["boxing ring", "boxing arena"],
    "mma":       ["mma octagon", "ufc octagon"],
    "nba":       ["basketball arena", "nba court"],
    "nfl":       ["nfl stadium", "american football field"],
    "golf":      ["golf course aerial", "golf green"],
    "rugby":     ["rugby stadium", "rugby pitch"],
}

GENERIC_FALLBACK = ["live event night", "stadium crowd", "arena lights"]


def build_queries(event: dict) -> list[str]:
    """Return a prioritised list of search queries from most → least specific."""
    et = (event.get("event_type") or "").lower()
    venue = (event.get("venue") or "").strip()
    city = (event.get("city") or "").strip()
    artist = (event.get("artist") or "").strip()
    title = (event.get("title") or "").strip()

    q = []

    if venue and city:
        q.append(f"{venue} {city}")
    if venue:
        q.append(venue)
    if artist and city:
        q.append(f"{artist} concert {city}")
    if title:
        q.append(title)
    if city and et:
        base = TYPE_KEYWORDS.get(et, [et])[0]
        q.append(f"{base} {city}")
    # Type-generic fallbacks
    for k in TYPE_KEYWORDS.get(et, GENERIC_FALLBACK):
        q.append(k)
    for k in GENERIC_FALLBACK:
        q.append(k)

    # Deduplicate while preserving order
    seen = set()
    out = []
    for s in q:
        s2 = s.lower().strip()
        if s2 and s2 not in seen:
            seen.add(s2)
            out.append(s)
    return out


async def fetch_wikipedia_image(client: httpx.AsyncClient, query: str, used_hashes: set) -> tuple[bytes | None, str | None]:
    """
    Fetch the lead photo for a Wikipedia page matching `query`.
    Truly free, no API key, works for every major stadium / F1 track /
    landmark because they all have Wikipedia articles.
    Strategy: search → get top page → fetch `pageimages` original.
    """
    try:
        # Step 1: search
        srch = await client.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query", "list": "search", "srsearch": query,
                "format": "json", "srlimit": 3, "origin": "*",
            }, timeout=15.0,
        )
        if srch.status_code != 200:
            return None, None
        hits = srch.json().get("query", {}).get("search", [])
        if not hits:
            return None, None

        for hit in hits:
            title = hit.get("title")
            if not title:
                continue
            # Step 2: pageimages original
            info = await client.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "query", "titles": title, "prop": "pageimages",
                    "format": "json", "pithumbsize": 1600, "origin": "*",
                }, timeout=15.0,
            )
            if info.status_code != 200:
                continue
            pages = info.json().get("query", {}).get("pages", {})
            for _pid, page in pages.items():
                thumb = page.get("thumbnail", {}).get("source")
                if not thumb:
                    continue
                # Step 3: download
                img = await client.get(thumb, timeout=20.0, follow_redirects=True)
                if img.status_code != 200 or len(img.content) < 5_000:
                    continue
                h = hashlib.sha256(img.content).hexdigest()
                if h in used_hashes:
                    continue
                used_hashes.add(h)
                return img.content, h
    except httpx.RequestError:
        pass
    return None, None


async def fetch_image(client: httpx.AsyncClient, query: str, used_hashes: set) -> tuple[bytes | None, str | None]:
    """
    Primary pipeline:
      1. Wikipedia pageimages (free, no key, high quality)
      2. Pexels (if PEXELS_API_KEY set)
      3. Unsplash (if UNSPLASH_ACCESS_KEY set)
    """
    img, h = await fetch_wikipedia_image(client, query, used_hashes)
    if img:
        return img, h
    img, h = await fetch_pexels(client, query, used_hashes)
    if img:
        return img, h
    img, h = await fetch_unsplash(client, query, used_hashes)
    if img:
        return img, h
    return None, None


async def fetch_unsplash(client: httpx.AsyncClient, query: str, used_hashes: set) -> tuple[bytes | None, str | None]:
    """Unsplash full API — needs UNSPLASH_ACCESS_KEY."""
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:
        return None, None
    try:
        r = await client.get(
            "https://api.unsplash.com/search/photos",
            params={"query": query, "per_page": 5, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {key}"},
            timeout=15.0,
        )
        if r.status_code != 200:
            return None, None
        photos = r.json().get("results") or []
        for photo in photos:
            src = photo.get("urls", {}).get("regular")
            if not src:
                continue
            img = await client.get(src, timeout=20.0)
            if img.status_code != 200 or len(img.content) < 5_000:
                continue
            h = hashlib.sha256(img.content).hexdigest()
            if h in used_hashes:
                continue
            used_hashes.add(h)
            return img.content, h
    except httpx.RequestError:
        pass
    return None, None


async def fetch_pexels(client: httpx.AsyncClient, query: str, used_hashes: set) -> tuple[bytes | None, str | None]:
    """
    Fallback: Pexels curated image via their public API key (optional).
    If PEXELS_API_KEY env var is set, we use it for higher quality
    matches; otherwise this function is a no-op.
    """
    api_key = os.environ.get("PEXELS_API_KEY")
    if not api_key:
        return None, None
    try:
        r = await client.get(
            "https://api.pexels.com/v1/search",
            params={"query": query, "per_page": 5, "orientation": "landscape"},
            headers={"Authorization": api_key},
            timeout=15.0,
        )
        if r.status_code != 200:
            return None, None
        photos = r.json().get("photos") or []
        for photo in photos:
            src = photo.get("src", {}).get("large2x") or photo.get("src", {}).get("large")
            if not src:
                continue
            img = await client.get(src, timeout=15.0)
            if img.status_code != 200 or len(img.content) < 5_000:
                continue
            h = hashlib.sha256(img.content).hexdigest()
            if h in used_hashes:
                continue
            used_hashes.add(h)
            return img.content, h
    except httpx.RequestError:
        pass
    return None, None


async def resolve_for_event(client: httpx.AsyncClient, event: dict, used_hashes: set) -> bytes | None:
    """Try each query in priority order until we get a unique image."""
    for q in build_queries(event):
        img, _ = await fetch_image(client, q, used_hashes)
        if img:
            return img
        await asyncio.sleep(0.3)
    return None


async def run(args):
    from motor.motor_asyncio import AsyncIOMotorClient
    mongo = os.environ["MONGO_URL"]
    db = AsyncIOMotorClient(mongo)[os.environ.get("DB_NAME", "euromatchtickets")]

    # Target selection
    query = {}
    if args.slug:
        query["$or"] = [{"slug": args.slug}, {"event_id": args.slug}]
    elif args.missing_only:
        query["$or"] = [{"image_url": {"$exists": False}}, {"image_url": ""}, {"image_url": None}]
    elif args.duplicates_only:
        pipeline = [
            {"$match": {"image_url": {"$ne": None, "$ne": ""}}},
            {"$group": {"_id": "$image_url", "ids": {"$push": "$event_id"}, "n": {"$sum": 1}}},
            {"$match": {"n": {"$gt": 1}}},
        ]
        rows = await db.events.aggregate(pipeline).to_list(None)
        ids = [eid for r in rows for eid in r["ids"]]
        query["event_id"] = {"$in": ids}

    projection = {"_id": 0, "event_id": 1, "slug": 1, "title": 1,
                  "venue": 1, "city": 1, "event_type": 1, "artist": 1, "image_url": 1}
    cursor = db.events.find(query, projection)
    if args.limit:
        cursor = cursor.limit(args.limit)
    events = await cursor.to_list(length=None)

    if args.skip_generated and not args.force:
        events = [e for e in events if not (e.get("image_url") or "").startswith(PUBLIC_PREFIX)]

    print(f"Target: {len(events)} events. Output: {OUT_DIR}")
    if not events:
        return

    # Pre-load hashes of already-saved files so we don't duplicate globally
    used_hashes: set[str] = set()
    for p in OUT_DIR.glob("*.jpg"):
        try:
            used_hashes.add(hashlib.sha256(p.read_bytes()).hexdigest())
        except Exception:
            pass
    print(f"Pre-loaded {len(used_hashes)} existing hashes for dedup.")

    success = 0
    async with httpx.AsyncClient(headers={"User-Agent": "EuroMatchTickets/1.0 (https://euromatchtickets.com; contact@euromatchtickets.com)"}) as client:
        for i, ev in enumerate(events, 1):
            slug = ev.get("slug") or ev.get("event_id")
            safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in slug)[:80]
            out = OUT_DIR / f"{safe}.jpg"

            if out.exists() and not args.force:
                print(f"[{i}/{len(events)}] {slug}: already cached")
                success += 1
                continue

            print(f"[{i}/{len(events)}] {ev.get('title','?')[:55]}")
            t0 = time.time()
            img = await resolve_for_event(client, ev, used_hashes)
            if not img:
                print(f"    ✗ no unique image found")
                continue
            out.write_bytes(img)
            kb = len(img) // 1024
            dt = time.time() - t0
            print(f"    ✓ {kb}kb in {dt:.1f}s → {out.name}")
            await db.events.update_one(
                {"event_id": ev["event_id"]},
                {"$set": {"image_url": f"{PUBLIC_PREFIX}/{safe}.jpg"}},
            )
            success += 1
            await asyncio.sleep(0.6)  # gentle rate-limiting

    print(f"\nDone. {success}/{len(events)} images collected + DB updated.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", type=str)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--duplicates-only", action="store_true")
    parser.add_argument("--missing-only", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--skip-generated", action="store_true", default=True)
    args = parser.parse_args()
    if not (args.slug or args.all or args.limit or args.duplicates_only or args.missing_only):
        parser.error("Choose one: --slug / --all / --limit / --duplicates-only / --missing-only")
    asyncio.run(run(args))


if __name__ == "__main__":
    main()
