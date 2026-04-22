"""
Unique composite images for MotoGP, Tennis, Concerts, Football, Isle of Man TT.
"""
import os
import pathlib
import re
import unicodedata
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")
Image.MAX_IMAGE_PIXELS = None

BASE = pathlib.Path(__file__).resolve().parent.parent
VENUES = BASE / "static" / "event_images" / "venues"
OUT = BASE / "static" / "event_images" / "matches"
OUT.mkdir(parents=True, exist_ok=True)

client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

W, H = 1200, 630


def slugify(name: str) -> str:
    t = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def load_font(size: int, bold: bool = True):
    for p in (
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def load_bg(slug: str) -> Image.Image:
    for ext in ("jpg", "jpeg", "png"):
        p = VENUES / f"{slug}.{ext}"
        if p.exists():
            bg = Image.open(p).convert("RGB")
            ar = bg.width / bg.height
            target = W / H
            if ar > target:
                nw = int(bg.height * target)
                left = (bg.width - nw) // 2
                bg = bg.crop((left, 0, left + nw, bg.height))
            else:
                nh = int(bg.width / target)
                top = (bg.height - nh) // 2
                bg = bg.crop((0, top, bg.width, top + nh))
            return bg.resize((W, H), Image.LANCZOS)
    return Image.new("RGB", (W, H), "#15151E")


def darken(img, f=0.55):
    return Image.blend(img, Image.new("RGB", img.size, "#000"), f)


def build_text_centered(draw, text, y, font, fill):
    try:
        bb = draw.textbbox((0, 0), text, font=font)
        tw = bb[2] - bb[0]
    except Exception:
        tw = len(text) * (font.size // 2)
    draw.text(((W - tw) // 2, y), text, font=font, fill=fill)


# Venue name → slug mapping (lower-case partial match)
MATCHES_VENUE = [
    # MotoGP
    ("mugello", "mugello"), ("jerez", "jerez-motogp"), ("phillip island", "phillip-island"),
    ("motorland", "motorland-aragon"), ("sepang", "sepang"), ("assen", "assen"),
    ("le mans", "le-mans-bugatti"), ("snaefell", "isle-of-man-course"),
    ("isle of man", "isle-of-man-course"), ("sachsenring", "sachsenring"),
    ("misano", "misano"), ("termas", "termas-de-rio-hondo"),
    ("ricardo tormo", "valencia-ricardo-tormo"),
    # Football
    ("allianz arena", "allianz-arena"), ("santiago bernab", "santiago-bernabeu"),
    ("camp nou", "camp-nou"), ("wembley", "wembley"), ("old trafford", "old-trafford"),
    ("emirates", "emirates-stadium"), ("anfield", "anfield"),
    ("stamford bridge", "stamford-bridge"), ("etihad", "etihad-stadium"),
    ("tottenham", "tottenham-stadium"), ("san siro", "san-siro"),
    ("meazza", "san-siro"), ("olimpico", "stadio-olimpico"),
    ("stade de france", "stade-de-france"), ("parc des princes", "parc-des-princes"),
    ("signal iduna", "signal-iduna-park"), ("westfalen", "signal-iduna-park"),
    ("red bull arena", "red-bull-arena"), ("cruyff", "johan-cruyff-arena"),
    ("de kuip", "de-kuip"), ("philips", "philips-stadion"),
    # Tennis
    ("foro italico", "foro-italico"), ("roland garros", "roland-garros"),
    ("all england", "all-england-club"), ("wimbledon", "all-england-club"),
    ("caja magica", "caja-magica"),
    # Concerts
    ("o2 arena", "o2-arena-london"), ("madison square", "madison-square-garden"),
    ("ziggo dome", "ziggo-dome"), ("uber arena", "uber-arena-berlin"),
    ("mercedes-benz arena berlin", "uber-arena-berlin"),
    ("accor arena", "accor-arena-paris"), ("bercy", "accor-arena-paris"),
    ("mediolanum", "forum-assago-milan"), ("movistar arena", "wizink-center-madrid"),
    ("wizink", "wizink-center-madrid"), ("palau sant jordi", "palau-sant-jordi-barcelona"),
    ("afas live", "afas-live-amsterdam"), ("lanxess", "lanxess-arena-cologne"),
    ("metropolitano", "estadio-wanda"), ("estadio olimpic", "estadi-olimpic-barcelona"),
    ("olympiastadion", "olympiastadion-berlin"),
]

TYPE_COLORS = {
    "motogp":         ("#FF6B00", "MOTOGP"),
    "isle_of_man_tt": ("#FACC15", "ISLE OF MAN TT"),
    "football":       ("#15803D", "FOOTBALL"),
    "match":          ("#15803D", "FOOTBALL"),
    "concert":        ("#A855F7", "CONCERT"),
    "festival":       ("#EC4899", "FESTIVAL"),
    "tennis":         ("#0EA5E9", "TENNIS"),
    "athletics":      ("#10B981", "ATHLETICS"),
    "attraction":     ("#FB923C", "ATTRACTION"),
}


def resolve_bg_slug(event) -> str:
    haystack = " ".join([
        str(event.get("venue", "") or ""),
        str(event.get("city", "") or ""),
        str(event.get("title", "") or ""),
    ]).lower()
    for needle, slug in MATCHES_VENUE:
        if needle in haystack:
            p = VENUES / f"{slug}.jpg"
            if p.exists() or (VENUES / f"{slug}.png").exists():
                return slug
    # fallback by event_type
    t = event.get("event_type")
    fallback = {
        "motogp": "_action-motogp", "isle_of_man_tt": "isle-of-man-course",
        "football": "_action-premier-league", "match": "_action-champions-league",
        "concert": "o2-arena-london", "festival": "palau-sant-jordi-barcelona",
        "tennis": "foro-italico", "athletics": "olympiastadion-berlin",
        "attraction": "o2-arena-london",
    }
    return fallback.get(t, "_action-fifa-worldcup")


def build_image(event) -> pathlib.Path | None:
    slug_bg = resolve_bg_slug(event)
    bg = darken(load_bg(slug_bg), 0.6)
    draw = ImageDraw.Draw(bg)

    # Accent bars
    accent_color, type_label = TYPE_COLORS.get(event.get("event_type"), ("#E10600", "EVENT"))
    draw.rectangle([0, 0, W, 10], fill=accent_color)
    draw.rectangle([0, H - 10, W, H], fill=accent_color)

    # Top-left type badge
    f_badge = load_font(28, bold=True)
    try:
        bb = draw.textbbox((0, 0), type_label, font=f_badge)
        tw = bb[2] - bb[0] + 30
    except Exception:
        tw = len(type_label) * 16
    draw.rectangle([40, 40, 40 + tw, 95], fill=accent_color)
    draw.text((55, 50), type_label, font=f_badge, fill="#FFFFFF")

    # Title (centered middle)
    title = event.get("title", "Event").upper()
    # Break long titles into 2 lines if > 20 chars
    if len(title) > 22 and " " in title:
        mid = len(title) // 2
        split = title.rfind(" ", 0, mid + 8)
        if split == -1 or split < mid - 8:
            split = title.find(" ", mid)
        if split > 0:
            line1, line2 = title[:split], title[split + 1:]
        else:
            line1, line2 = title, ""
    else:
        line1, line2 = title, ""

    size = 78 if len(line1) <= 18 else (62 if len(line1) <= 24 else 48)
    f_title = load_font(size, bold=True)
    base_y = 220 if line2 else 255
    build_text_centered(draw, line1, base_y, f_title, "#FFFFFF")
    if line2:
        build_text_centered(draw, line2, base_y + size + 8, f_title, "#FFFFFF")

    # Subtitle / league
    sub = event.get("subtitle") or event.get("league") or "2026 SEASON"
    f_sub = load_font(28, bold=True)
    build_text_centered(draw, sub.upper()[:50], base_y + (size * (2 if line2 else 1)) + 45, f_sub, accent_color)

    # Bottom: venue / date
    venue = event.get("venue", "")
    city = event.get("city", "")
    ev_date = event.get("event_date")
    date_str = ev_date.strftime("%a, %b %d, %Y") if isinstance(ev_date, datetime) else str(ev_date or "")

    f_bot1 = load_font(26, bold=True)
    f_bot2 = load_font(20, bold=False)
    draw.text((40, H - 85), venue[:60], font=f_bot1, fill="#FFFFFF")
    draw.text((40, H - 50), city, font=f_bot2, fill="#BBBBBB")
    try:
        bb = draw.textbbox((0, 0), date_str, font=f_bot1)
        tw = bb[2] - bb[0]
    except Exception:
        tw = len(date_str) * 13
    draw.text((W - 40 - tw, H - 85), date_str, font=f_bot1, fill="#FACC15")

    out_path = OUT / f"{event['event_type']}_{slugify(event.get('slug') or event['title'])}.jpg"
    bg.save(out_path, "JPEG", quality=82, optimize=True)
    return out_path


def main():
    # Skip worldcup and f1 (already handled)
    events = list(db.events.find(
        {"event_type": {"$nin": ["worldcup", "f1"]}},
        {"_id": 0}
    ))
    print(f"Generating unique images for {len(events)} events…")
    ok = fail = 0
    for e in events:
        try:
            p = build_image(e)
            if p:
                db.events.update_one(
                    {"event_id": e["event_id"]},
                    {"$set": {"image_url": f"/api/event-images/matches/{p.name}"}},
                )
                ok += 1
        except Exception as ex:
            print(f"  FAIL {e.get('title')} ({e.get('event_type')}): {ex}")
            fail += 1
    print(f"\nDone. ok={ok} fail={fail}")


if __name__ == "__main__":
    main()
