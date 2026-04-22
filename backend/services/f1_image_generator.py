"""
Generate UNIQUE composite images for every F1 Grand Prix race.

Each F1 race gets its own 1200x630 image with:
  • The circuit/track photo (darkened) as background
  • "FORMULA 1" red badge
  • Grand Prix name + year
  • Round number + date + venue
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


VENUE_SLUGS = {
    "Bahrain International Circuit":     "bahrain-circuit",
    "Jeddah Corniche Circuit":           "jeddah",
    "Albert Park Circuit":               "albert-park",
    "Suzuka International Racing Course":"suzuka",
    "Shanghai International Circuit":    "shanghai",
    "Miami International Autodrome":     "miami-autodrome",
    "Autodromo Enzo e Dino Ferrari":     "imola",
    "Circuit de Monaco":                 "monaco-circuit",
    "Circuit de Barcelona-Catalunya":    "barcelona-catalunya",
    "Circuit Gilles Villeneuve":         "gilles-villeneuve",
    "Red Bull Ring":                     "red-bull-ring",
    "Silverstone Circuit":               "silverstone",
    "Hungaroring":                       "hungaroring",
    "Circuit de Spa-Francorchamps":      "spa-francorchamps",
    "Circuit Zandvoort":                 "zandvoort",
    "Autodromo Nazionale Monza":         "monza",
    "Autodromo di Monza":                "monza",
    "Baku City Circuit":                 "baku",
    "Marina Bay Street Circuit":         "marina-bay",
    "Circuit of the Americas":           "cota",
    "Autodromo Hermanos Rodriguez":      "hermanos-rodriguez",
    "Autódromo Hermanos Rodríguez":      "hermanos-rodriguez",
    "Interlagos":                        "interlagos",
    "Autódromo José Carlos Pace":        "interlagos",
    "Las Vegas Strip Circuit":           "las-vegas-circuit",
    "Lusail International Circuit":      "lusail",
    "Yas Marina Circuit":                "yas-marina",
}

GP_ROUND = {
    "Bahrain Grand Prix 2026":           1,
    "Saudi Arabian Grand Prix 2026":     2,
    "Australian Grand Prix 2026":        3,
    "Japanese Grand Prix 2026":          4,
    "Chinese Grand Prix 2026":           5,
    "Miami Grand Prix 2026":             6,
    "Emilia Romagna Grand Prix 2026":    7,
    "Monaco Grand Prix 2026":            8,
    "Spanish Grand Prix 2026":           9,
    "Canadian Grand Prix 2026":         10,
    "Austrian Grand Prix 2026":         11,
    "British Grand Prix 2026":          12,
    "Hungarian Grand Prix 2026":        13,
    "Belgian Grand Prix 2026":          14,
    "Dutch Grand Prix 2026":            15,
    "Italian Grand Prix 2026":          16,
    "Azerbaijan Grand Prix 2026":       17,
    "Singapore Grand Prix 2026":        18,
    "United States Grand Prix 2026":    19,
    "Mexico City Grand Prix 2026":      20,
    "Brazilian Grand Prix 2026":        21,
    "Las Vegas Grand Prix 2026":        22,
    "Qatar Grand Prix 2026":            23,
    "Abu Dhabi Grand Prix 2026":        24,
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


# Disable PIL decompression bomb check for legitimate large Wikipedia images
Image.MAX_IMAGE_PIXELS = None


def load_bg(venue_slug: str) -> Image.Image:
    for ext in ("jpg", "jpeg", "png"):
        p = VENUES / f"{venue_slug}.{ext}"
        if p.exists():
            bg = Image.open(p).convert("RGB")
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
            return bg.resize((W, H), Image.LANCZOS)
    return Image.new("RGB", (W, H), "#15151E")


def darken(img: Image.Image, factor: float = 0.5) -> Image.Image:
    black = Image.new("RGB", img.size, "#000")
    return Image.blend(img, black, factor)


def build_f1_image(event) -> pathlib.Path | None:
    title = event.get("title", "F1 Race")
    round_no = GP_ROUND.get(title, 0)
    venue = event.get("venue", "")
    venue_slug = VENUE_SLUGS.get(venue, slugify(venue))

    bg = darken(load_bg(venue_slug), 0.6)
    draw = ImageDraw.Draw(bg)

    # Red top + bottom bars
    draw.rectangle([0, 0, W, 10], fill="#E10600")
    draw.rectangle([0, H - 10, W, H], fill="#E10600")

    # F1 badge (top left)
    draw.rectangle([40, 40, 220, 105], fill="#E10600")
    f_badge = load_font(34, bold=True)
    draw.text((60, 50), "FORMULA 1", font=f_badge, fill="#FFFFFF")

    # Round badge (top right)
    if round_no:
        draw.rectangle([W - 220, 40, W - 40, 105], outline="#FACC15", width=4)
        f_round = load_font(26, bold=True)
        draw.text((W - 200, 55), f"ROUND  {round_no:02d}", font=f_round, fill="#FACC15")

    # Main title (centered, middle)
    short = title.replace(" Grand Prix 2026", "").replace(" Grand Prix", "").upper()
    f_title = load_font(110, bold=True)
    try:
        bbox = draw.textbbox((0, 0), short, font=f_title)
        tw = bbox[2] - bbox[0]
    except Exception:
        tw = len(short) * 60
    draw.text(((W - tw) // 2, 200), short, font=f_title, fill="#FFFFFF")

    f_sub = load_font(46, bold=True)
    sub = "GRAND PRIX 2026"
    try:
        bbox = draw.textbbox((0, 0), sub, font=f_sub)
        tw2 = bbox[2] - bbox[0]
    except Exception:
        tw2 = len(sub) * 25
    draw.text(((W - tw2) // 2, 330), sub, font=f_sub, fill="#E10600")

    # Bottom: venue + date
    ev_date = event.get("event_date")
    if isinstance(ev_date, datetime):
        date_str = ev_date.strftime("%a, %b %d, %Y")
    else:
        date_str = str(ev_date or "")

    f_bot1 = load_font(28, bold=True)
    f_bot2 = load_font(22, bold=False)
    draw.text((40, H - 90), venue, font=f_bot1, fill="#FFFFFF")
    draw.text((40, H - 55), f"{event.get('city','')}, {event.get('country','')}", font=f_bot2, fill="#BBBBBB")

    try:
        bbox = draw.textbbox((0, 0), date_str, font=f_bot1)
        tw3 = bbox[2] - bbox[0]
    except Exception:
        tw3 = len(date_str) * 15
    draw.text((W - 40 - tw3, H - 90), date_str, font=f_bot1, fill="#FACC15")

    out_path = OUT / f"f1_{slugify(title)}.jpg"
    bg.save(out_path, "JPEG", quality=82, optimize=True)
    return out_path


def main():
    events = list(db.events.find({"event_type": "f1"}, {"_id": 0}).sort("event_date", 1))
    print(f"Generating unique images for {len(events)} F1 events…")
    ok = fail = 0
    for e in events:
        try:
            p = build_f1_image(e)
            if p:
                url = f"/api/event-images/matches/{p.name}"
                db.events.update_one(
                    {"event_id": e["event_id"]},
                    {"$set": {"image_url": url}},
                )
                print(f"  OK {e['title']} -> {p.name}")
                ok += 1
        except Exception as ex:
            print(f"  FAIL {e.get('title')}: {ex}")
            fail += 1
    print(f"\nDone. ok={ok} fail={fail}")


if __name__ == "__main__":
    main()
