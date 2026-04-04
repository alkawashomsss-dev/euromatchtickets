"""Generate unique static JPEG product images for Google Merchant Center."""
import os
import sys
import hashlib
import asyncio
from PIL import Image, ImageDraw, ImageFont
from motor.motor_asyncio import AsyncIOMotorClient
import re

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "euromatchtickets")
OUTPUT_DIR = "/app/frontend/public/product-images"
HEROES_DIR = "/app/frontend/public/images/heroes"

CATEGORY_BASE_IMAGES = {
    "f1": ["f1-red-lg.webp", "f1-lg.webp", "f1-race-lg.webp", "f1-pitstop-lg.webp"],
    "football": ["football-stadium-lg.webp", "football-lg.webp", "football-match-lg.webp", "football-penalty-lg.webp"],
    "concert": ["concert-purple-lg.webp", "concert-lg.webp", "concert-live-lg.webp", "concert-drums-lg.webp"],
    "worldcup": ["worldcup-lg.webp", "worldcup-trophy-lg.webp", "worldcup-final-lg.webp", "football-stadium-lg.webp"],
    "motorsport": ["motogp-lg.webp", "motogp-orange-lg.webp"],
    "motogp": ["motogp-lg.webp", "motogp-orange-lg.webp"],
}

font_title = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSansBold.ttf", 42)
font_sub = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSans.ttf", 28)
font_brand = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSansBold.ttf", 20)


def clean_title(title):
    t = title.split("|")[0].strip()
    for s in ["| EuroMatchTickets", "| EMT"]:
        t = t.replace(s, "").strip()
    t = re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'\s*€\d+[\d,.]*', '', t).strip()
    t = re.sub(r'^(Buy|Get|Order|Book|Grab|Shop)\s+', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'\b(Cheap|Cheapest|Best|Top|Ranked)\b', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'\s{2,}', ' ', t).strip().rstrip(' \u2013\u2014-!.')
    return t


def generate_image(slug, title, cat, city, venue):
    base_images = CATEGORY_BASE_IMAGES.get(cat, ["football-stadium-lg.webp"])
    img_index = int(hashlib.md5(slug.encode()).hexdigest(), 16) % len(base_images)
    base_img_name = base_images[img_index]
    base_img_path = os.path.join(HEROES_DIR, base_img_name)

    if not os.path.exists(base_img_path):
        base_img_path = os.path.join(HEROES_DIR, "football-stadium-lg.webp")

    img = Image.open(base_img_path).convert("RGB")
    img = img.resize((1200, 628), Image.LANCZOS)

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([(0, img.height - 200), (img.width, img.height)], fill=(0, 0, 0, 180))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    ct = clean_title(title)
    title_y = img.height - 170
    draw.text((50, title_y), ct, font=font_title, fill=(255, 255, 255))

    location = venue if venue and venue != city else city
    if location and location != "Europe":
        draw.text((50, title_y + 55), location, font=font_sub, fill=(200, 200, 200))

    draw.text((50, img.height - 45), "EUROMATCHTICKETS.COM", font=font_brand, fill=(255, 200, 50))

    out_path = os.path.join(OUTPUT_DIR, f"{slug}.jpg")
    img.save(out_path, format="JPEG", quality=80, optimize=True)
    return out_path


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    pages = await db.seo_pages.find(
        {"active": True, "price_low": {"$gt": 0}},
        {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "venue": 1}
    ).to_list(length=5000)

    print(f"Generating {len(pages)} product images...")
    count = 0
    for page in pages:
        slug = page.get("slug", "")
        if not slug:
            continue
        title = page.get("title", slug)
        cat = page.get("category", "other")
        city = page.get("city", "Europe")
        venue = page.get("venue", "")
        generate_image(slug, title, cat, city, venue)
        count += 1
        if count % 100 == 0:
            print(f"  {count}/{len(pages)} done...")

    print(f"Done! Generated {count} images in {OUTPUT_DIR}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
