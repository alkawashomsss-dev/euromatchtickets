"""
Generate a UNIQUE composite image for every FIFA World Cup 2026 match.

Layout (1200x630, OpenGraph aspect):
  • Background: stadium photo (darkened)
  • Top:   big "FIFA WORLD CUP 2026" title
  • Center: [home flag]  VS  [away flag]
  • Bottom: Venue name · City · Date

Saved to: /app/backend/static/event_images/matches/wc2026_match_<NNN>.jpg
Served at: /api/event-images/matches/wc2026_match_<NNN>.jpg
"""
import os
import pathlib
import re
import unicodedata
from datetime import datetime, timezone
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

BASE = pathlib.Path(__file__).resolve().parent.parent
FLAGS = BASE / "static" / "event_images" / "flags"
VENUES = BASE / "static" / "event_images" / "venues"
OUT = BASE / "static" / "event_images" / "matches"
OUT.mkdir(parents=True, exist_ok=True)

client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

W, H = 1200, 630


def slugify(name: str) -> str:
    t = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


VENUE_SLUGS = {
    "Estadio Azteca":         "estadio-azteca",
    "Estadio Akron":          "estadio-akron",
    "Estadio BBVA":           "estadio-bbva",
    "SoFi Stadium":           "sofi-stadium",
    "MetLife Stadium":        "metlife-stadium",
    "AT&T Stadium":           "att-stadium",
    "Levi's Stadium":         "levis-stadium",
    "BC Place":               "bc-place",
    "BMO Field":              "bmo-field",
    "Lumen Field":            "lumen-field",
    "Mercedes-Benz Stadium":  "mercedes-benz-stadium",
    "NRG Stadium":            "nrg-stadium",
    "Hard Rock Stadium":      "hard-rock-stadium",
    "Gillette Stadium":       "gillette-stadium",
    "Lincoln Financial Field":"lincoln-financial-field",
    "Arrowhead Stadium":      "arrowhead-stadium",
}


def load_font(size: int, bold: bool = True):
    candidates = [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


Image.MAX_IMAGE_PIXELS = None


def load_venue_bg(venue_slug: str) -> Image.Image:
    for ext in ("jpg", "jpeg", "png"):
        p = VENUES / f"{venue_slug}.{ext}"
        if p.exists():
            bg = Image.open(p).convert("RGB")
            # cover fit to 1200x630
            ar = bg.width / bg.height
            target_ar = W / H
            if ar > target_ar:
                new_w = int(bg.height * target_ar)
                left = (bg.width - new_w) // 2
                bg = bg.crop((left, 0, left + new_w, bg.height))
            else:
                new_h = int(bg.width / target_ar)
                top = (bg.height - new_h) // 2
                bg = bg.crop((0, top, bg.width, top + new_h))
            bg = bg.resize((W, H), Image.LANCZOS)
            return bg
    # fallback: solid dark green
    return Image.new("RGB", (W, H), "#003300")


def darken(img: Image.Image, factor: float = 0.45) -> Image.Image:
    """Darken by compositing with black."""
    black = Image.new("RGB", img.size, "#000")
    return Image.blend(img, black, factor)


def load_flag(team_name: str) -> Image.Image | None:
    if not team_name or team_name == "TBD":
        return None
    slug = slugify(team_name)
    p = FLAGS / f"{slug}.png"
    if p.exists():
        return Image.open(p).convert("RGB")
    return None


def paste_flag(bg: Image.Image, flag: Image.Image, cx: int, cy: int, target_h: int = 190):
    """Paste a flag centered at (cx, cy), resized to target height, with subtle border."""
    ar = flag.width / flag.height
    new_w = int(target_h * ar)
    flag = flag.resize((new_w, target_h), Image.LANCZOS)
    # draw black border on a slightly larger canvas
    border = 5
    frame = Image.new("RGB", (new_w + border * 2, target_h + border * 2), "#000")
    frame.paste(flag, (border, border))
    bg.paste(frame, (cx - frame.width // 2, cy - frame.height // 2))


def text_centered(draw: ImageDraw.ImageDraw, xy, text, font, fill):
    # measure
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    except AttributeError:
        tw, th = font.getsize(text)
    x, y = xy
    draw.text((x - tw // 2, y - th // 2), text, font=font, fill=fill)


ROUND_LABEL = {
    "A": "Group Stage", "B": "Group Stage", "C": "Group Stage", "D": "Group Stage",
    "E": "Group Stage", "F": "Group Stage", "G": "Group Stage", "H": "Group Stage",
    "I": "Group Stage", "J": "Group Stage", "K": "Group Stage", "L": "Group Stage",
    "R32": "Round of 32", "R16": "Round of 16",
    "QF": "Quarter-Final", "SF": "Semi-Final",
    "3P": "Third Place", "F": "Final",
}


def build_match_image(event) -> pathlib.Path | None:
    match_no = event.get("match_number")
    if not match_no:
        return None
    round_code = event.get("group_or_round", "")
    venue = event.get("venue", "")
    venue_slug = VENUE_SLUGS.get(venue, slugify(venue))

    bg = darken(load_venue_bg(venue_slug), 0.55)
    draw = ImageDraw.Draw(bg)

    # Red accent bar
    draw.rectangle([0, 0, W, 8], fill="#E10600")
    draw.rectangle([0, H - 8, W, H], fill="#E10600")

    # Top strip — event label
    f_small = load_font(22, bold=True)
    f_title = load_font(46, bold=True)
    f_vs    = load_font(72, bold=True)
    f_team  = load_font(36, bold=True)
    f_mid   = load_font(28, bold=True)
    f_bot   = load_font(20, bold=False)

    draw.text((40, 30), "FIFA WORLD CUP 2026", font=f_title, fill="#FFFFFF")
    label = ROUND_LABEL.get(round_code, round_code)
    draw.text((40, 86), f"{label} · Match {match_no:02d}" + (f" · Group {round_code}" if len(round_code) == 1 else ""),
              font=f_small, fill="#E10600")

    home = event.get("home_team")
    away = event.get("away_team")
    home_flag = load_flag(home) if home else None
    away_flag = load_flag(away) if away else None

    cy_middle = H // 2 + 25

    if home_flag and away_flag:
        # Flags side by side with "VS"
        paste_flag(bg, home_flag, W // 2 - 260, cy_middle, 180)
        paste_flag(bg, away_flag, W // 2 + 260, cy_middle, 180)
        text_centered(draw, (W // 2, cy_middle), "VS", f_vs, "#E10600")
        # Team names under flags
        text_centered(draw, (W // 2 - 260, cy_middle + 125), home.upper(), f_team, "#FFFFFF")
        text_centered(draw, (W // 2 + 260, cy_middle + 125), away.upper(), f_team, "#FFFFFF")
    else:
        # TBD knockout match — show big round label centered
        text_centered(draw, (W // 2, cy_middle - 30), ROUND_LABEL.get(round_code, round_code).upper(),
                      f_vs, "#FFFFFF")
        text_centered(draw, (W // 2, cy_middle + 50), f"MATCH {match_no}", f_team, "#E10600")

    # Bottom strip — venue + date
    event_date = event.get("event_date")
    if isinstance(event_date, datetime):
        date_str = event_date.strftime("%a, %b %d · %H:%M UTC")
    else:
        date_str = str(event_date or "")
    city = event.get("city", "")

    # Left bottom: venue · city
    draw.text((40, H - 70), f"{venue} · {city}", font=f_mid, fill="#FFFFFF")
    # Right bottom: date
    try:
        bbox = draw.textbbox((0, 0), date_str, font=f_bot)
        tw = bbox[2] - bbox[0]
    except Exception:
        tw = 0
    draw.text((W - 40 - tw, H - 60), date_str, font=f_bot, fill="#FACC15")

    out_path = OUT / f"wc2026_match_{int(match_no):03d}.jpg"
    bg.save(out_path, "JPEG", quality=82, optimize=True)
    return out_path


def main():
    events = list(db.events.find({"event_type": "worldcup"}, {"_id": 0}).sort("match_number", 1))
    print(f"Generating images for {len(events)} World Cup matches…")
    ok = fail = 0
    for e in events:
        try:
            p = build_match_image(e)
            if p:
                url = f"/api/event-images/matches/{p.name}"
                db.events.update_one(
                    {"event_id": e["event_id"]},
                    {"$set": {"image_url": url}},
                )
                ok += 1
            else:
                fail += 1
        except Exception as ex:
            print(f"  FAIL match {e.get('match_number')}: {ex}")
            fail += 1
    print(f"\nDone. ok={ok} fail={fail}")


if __name__ == "__main__":
    main()
