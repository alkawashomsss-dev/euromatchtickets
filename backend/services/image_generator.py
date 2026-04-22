"""
Event Image Generator (Nano Banana)
====================================
Generates a unique, photorealistic cinematic image per event using Gemini
Nano Banana via the Emergent universal LLM key, stores under
/app/backend/static/event_images/{slug}.jpg, and updates the `events`
collection's `image_url` to the public `/event-images/{slug}.jpg` path.

Run manually:
    python -m services.image_generator --limit 5          # dry-run 5 events
    python -m services.image_generator --all              # regenerate all
    python -m services.image_generator --slug <slug>      # single event
    python -m services.image_generator --duplicates-only  # only re-gen
                                                            events that share
                                                            an image with ≥1
                                                            other event

Safe: skips any event whose `image_url` already points at
`/event-images/...` (i.e. already has a unique generated image).
"""
import asyncio
import argparse
import base64
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

# Allow running from /app/backend directly
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API_KEY = os.environ.get("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"  # Nano Banana latest

OUT_DIR = Path(__file__).resolve().parent.parent / "static" / "event_images"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PUBLIC_PREFIX = "/event-images"  # Mounted as StaticFiles in server.py


# ────────────────────────────────────────────────────────────────────
# Prompt engineering — STRICTLY photorealistic, cinematic, no text/logos
# ────────────────────────────────────────────────────────────────────
BASE_NEGATIVE = (
    "Strictly NO text, NO logos, NO watermarks, NO crowds of people with "
    "visible faces, NO trademarked branding. Cinematic 35mm film look, "
    "ultra-sharp focus, dramatic lighting, golden-hour when outdoor. "
    "16:9 aspect ratio, 1600x900 resolution."
)


def build_prompt(event: dict) -> str:
    """Construct an event-type-aware, venue-aware cinematic prompt."""
    et = (event.get("event_type") or "").lower()
    title = event.get("title", "").strip()
    venue = event.get("venue", "").strip()
    city = event.get("city", "").strip()
    artist = event.get("artist", "").strip()

    if et in ("f1", "formula1"):
        base = (
            f"Cinematic aerial drone shot of {venue or title} Formula 1 racing "
            f"circuit in {city}, morning golden light across the asphalt, racing "
            f"kerbs in vibrant red-and-white, empty main straight at race-weekend "
            f"readiness, distant grandstand silhouettes, subtle mist over the "
            f"track, photo-realistic, film-grade colour grade."
        )
    elif et == "motogp":
        base = (
            f"Low-angle ground cinematic shot of {venue or title} MotoGP circuit "
            f"in {city}, main straight at sunrise, tyre-marks visible on asphalt, "
            f"painted blue-and-white kerbs, safety catch-fencing blurred in "
            f"background, warm amber light, photo-realistic 35mm film."
        )
    elif et == "isle_of_man_tt":
        base = (
            f"Cinematic shot of the Isle of Man TT mountain course, rural road "
            f"winding through Snaefell hills, dramatic clouds, stone walls, "
            f"empty road at dawn, photo-realistic."
        )
    elif et in ("match", "football", "worldcup"):
        base = (
            f"Cinematic interior of {venue or title} football stadium in {city}, "
            f"shot from mid-tier seating toward the pitch, floodlights on, empty "
            f"green pitch at dusk, dramatic architectural lighting on the "
            f"cantilever roof, moody shadows, photo-realistic 35mm film."
        )
    elif et in ("tennis",):
        base = (
            f"Cinematic low-angle shot of {venue or title} tennis court in "
            f"{city}, clay or grass court pristine and empty, stadium lighting, "
            f"blurred branded sponsor boards (no readable text), dramatic "
            f"shadows, photo-realistic."
        )
    elif et == "athletics":
        base = (
            f"Cinematic ground-level shot of {venue or title} athletics stadium "
            f"in {city}, red running track at sunrise, empty grandstand, lane "
            f"markings sharp, photo-realistic film grade."
        )
    elif et == "concert":
        performer = artist or title
        base = (
            f"Cinematic wide shot of a packed concert arena for {performer} at "
            f"{venue or city}, stage bathed in deep purple and red lasers, silhouettes "
            f"of the crowd with arms raised, smoke effects, spot-lights beaming "
            f"through haze, photo-realistic concert film look (no faces or "
            f"logos legible)."
        )
    elif et == "festival":
        base = (
            f"Cinematic aerial twilight shot of {title} festival in {city}, "
            f"main-stage light pillars piercing smoke, silhouetted crowd, "
            f"distant landscape, photo-realistic film."
        )
    elif et == "attraction":
        base = (
            f"Cinematic travel-photography shot of {title} in {city}, golden "
            f"hour warm light, empty of tourists in frame, architectural detail "
            f"sharp, photo-realistic landscape composition."
        )
    else:
        base = (
            f"Cinematic photo of {title} at {venue or city}, dramatic lighting, "
            f"photo-realistic film grade, no people in foreground."
        )

    return f"{base} {BASE_NEGATIVE}"


# ────────────────────────────────────────────────────────────────────
# Core generator
# ────────────────────────────────────────────────────────────────────
async def generate_for_event(event: dict, force: bool = False) -> str | None:
    slug = event.get("slug") or event.get("event_id")
    if not slug:
        return None

    # Sanitize slug → filename
    safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in slug)[:80]
    out_path = OUT_DIR / f"{safe}.jpg"

    if out_path.exists() and not force:
        return f"{PUBLIC_PREFIX}/{safe}.jpg"

    prompt = build_prompt(event)
    session_id = f"img-{safe}-{int(time.time())}"

    chat = (
        LlmChat(
            api_key=API_KEY,
            session_id=session_id,
            system_message="You are a cinematic photography AI. Generate one photorealistic image only, 16:9 aspect.",
        )
        .with_model("gemini", MODEL)
        .with_params(modalities=["image", "text"])
    )

    try:
        _text, images = await chat.send_message_multimodal_response(
            UserMessage(text=prompt)
        )
    except Exception as e:
        print(f"  ✗ {slug}: generation failed — {type(e).__name__}: {str(e)[:180]}")
        return None

    if not images:
        print(f"  ✗ {slug}: no image returned")
        return None

    img = images[0]
    try:
        img_bytes = base64.b64decode(img["data"])
    except Exception:
        print(f"  ✗ {slug}: could not decode base64")
        return None

    out_path.write_bytes(img_bytes)
    size_kb = len(img_bytes) // 1024
    print(f"  ✓ {slug}: {size_kb}kb → {out_path.name}")
    return f"{PUBLIC_PREFIX}/{safe}.jpg"


async def run(args):
    from motor.motor_asyncio import AsyncIOMotorClient
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ.get("DB_NAME", "euromatchtickets")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    # Collect target events
    query = {}
    if args.slug:
        query["$or"] = [{"slug": args.slug}, {"event_id": args.slug}]
    elif args.duplicates_only:
        # Find image_urls used by >1 event
        pipeline = [
            {"$match": {"image_url": {"$ne": None, "$ne": ""}}},
            {"$group": {"_id": "$image_url", "ids": {"$push": "$event_id"}, "n": {"$sum": 1}}},
            {"$match": {"n": {"$gt": 1}}},
        ]
        dup_rows = await db.events.aggregate(pipeline).to_list(None)
        dup_ids = [eid for r in dup_rows for eid in r["ids"]]
        query["event_id"] = {"$in": dup_ids}

    projection = {
        "_id": 0, "event_id": 1, "slug": 1, "title": 1,
        "venue": 1, "city": 1, "event_type": 1, "artist": 1, "image_url": 1,
    }
    cursor = db.events.find(query, projection)
    if args.limit:
        cursor = cursor.limit(args.limit)
    events = await cursor.to_list(length=None)

    if args.skip_generated and not args.force:
        events = [e for e in events if not (e.get("image_url") or "").startswith(PUBLIC_PREFIX)]

    print(f"Target: {len(events)} events. Output dir: {OUT_DIR}")
    if not events:
        return

    # Generate sequentially to avoid rate limits; 2–3 req/s is safe
    success = 0
    for i, ev in enumerate(events, 1):
        print(f"[{i}/{len(events)}] {ev.get('title','?')[:60]}")
        url = await generate_for_event(ev, force=args.force)
        if url:
            await db.events.update_one(
                {"event_id": ev["event_id"]},
                {"$set": {"image_url": url}},
            )
            success += 1
        await asyncio.sleep(1.2)  # gentle pacing

    print(f"\nDone. {success}/{len(events)} images written + DB updated.")
    client.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", type=str, help="Single event slug or event_id")
    parser.add_argument("--limit", type=int, default=0, help="Max events to process")
    parser.add_argument("--all", action="store_true", help="Process all events")
    parser.add_argument("--duplicates-only", action="store_true", help="Only events with duplicate image_url")
    parser.add_argument("--force", action="store_true", help="Regenerate even if file exists")
    parser.add_argument("--skip-generated", action="store_true", default=True)
    args = parser.parse_args()

    if not (args.slug or args.all or args.limit or args.duplicates_only):
        parser.error("Choose one: --slug / --all / --limit / --duplicates-only")

    asyncio.run(run(args))


if __name__ == "__main__":
    main()
