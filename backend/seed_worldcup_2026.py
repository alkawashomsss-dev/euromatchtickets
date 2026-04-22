"""
Seed all 104 FIFA World Cup 2026 matches into MongoDB.

Source: Official FIFA schedule (USA/Canada/Mexico, 11 Jun - 19 Jul 2026).
Venue images are served from /api/event-images/venues/<slug>.<ext>
(downloaded by services/venue_image_downloader.py).

Run:  cd /app/backend && python3 seed_worldcup_2026.py
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

# ─────────────────────────────────────────────────────────────
# VENUE → (image_slug, city, country)
# ─────────────────────────────────────────────────────────────
VENUE_INFO = {
    "Estadio Azteca":        ("estadio-azteca",            "Mexico City",    "Mexico"),
    "Estadio Akron":         ("estadio-akron",             "Zapopan",        "Mexico"),
    "Estadio BBVA":          ("estadio-bbva",              "Monterrey",      "Mexico"),
    "SoFi Stadium":          ("sofi-stadium",              "Inglewood",      "USA"),
    "MetLife Stadium":       ("metlife-stadium",           "East Rutherford","USA"),
    "AT&T Stadium":          ("att-stadium",               "Arlington",      "USA"),
    "Levi's Stadium":        ("levis-stadium",             "Santa Clara",    "USA"),
    "BC Place":              ("bc-place",                  "Vancouver",      "Canada"),
    "BMO Field":             ("bmo-field",                 "Toronto",        "Canada"),
    "Lumen Field":           ("lumen-field",               "Seattle",        "USA"),
    "Mercedes-Benz Stadium": ("mercedes-benz-stadium",     "Atlanta",        "USA"),
    "NRG Stadium":           ("nrg-stadium",               "Houston",        "USA"),
    "Hard Rock Stadium":     ("hard-rock-stadium",         "Miami",          "USA"),
    "Gillette Stadium":      ("gillette-stadium",          "Foxborough",     "USA"),
    "Lincoln Financial Field":("lincoln-financial-field",  "Philadelphia",   "USA"),
    "Arrowhead Stadium":     ("arrowhead-stadium",         "Kansas City",    "USA"),
}

# ─────────────────────────────────────────────────────────────
# 104 MATCHES — (date_iso, time_hhmm, home, away, match_no, group, venue)
# group = "A".."L" for group stage; "R32","R16","QF","SF","3P","F"
# ─────────────────────────────────────────────────────────────
MATCHES = [
    # ── GROUP STAGE — MATCHDAY 1 ──
    ("2026-06-11","14:00","Mexico","South Africa",       1,"A","Estadio Azteca"),
    ("2026-06-11","21:00","South Korea","Czech Republic",2,"A","Estadio Akron"),
    ("2026-06-12","15:00","Canada","Bosnia",             3,"B","BMO Field"),
    ("2026-06-12","18:00","United States","Paraguay",    4,"D","SoFi Stadium"),
    ("2026-06-13","12:00","Qatar","Switzerland",         8,"B","Levi's Stadium"),
    ("2026-06-13","18:00","Brazil","Morocco",            7,"C","MetLife Stadium"),
    ("2026-06-13","21:00","Australia","Turkey",          6,"D","BC Place"),
    ("2026-06-13","21:00","Haiti","Scotland",            5,"C","Gillette Stadium"),
    ("2026-06-14","12:00","Germany","Curaçao",          10,"E","NRG Stadium"),
    ("2026-06-14","15:00","Netherlands","Japan",        11,"F","AT&T Stadium"),
    ("2026-06-14","19:00","Ivory Coast","Ecuador",       9,"E","Lincoln Financial Field"),
    ("2026-06-14","21:00","Sweden","Tunisia",           12,"F","Estadio BBVA"),
    ("2026-06-15","12:00","Belgium","Egypt",            16,"G","Lumen Field"),
    ("2026-06-15","12:00","Spain","Cape Verde",         14,"H","Mercedes-Benz Stadium"),
    ("2026-06-15","18:00","Iran","New Zealand",         15,"G","SoFi Stadium"),
    ("2026-06-15","18:00","Saudi Arabia","Uruguay",     13,"H","Hard Rock Stadium"),
    ("2026-06-16","15:00","France","Senegal",           17,"I","MetLife Stadium"),
    ("2026-06-16","18:00","Iraq","Norway",              18,"I","Gillette Stadium"),
    ("2026-06-16","20:00","Argentina","Algeria",        19,"J","Arrowhead Stadium"),
    ("2026-06-16","21:00","Austria","Jordan",           20,"J","Levi's Stadium"),
    ("2026-06-17","12:00","Portugal","DR Congo",        23,"K","NRG Stadium"),
    ("2026-06-17","15:00","England","Croatia",          22,"L","AT&T Stadium"),
    ("2026-06-17","19:00","Ghana","Panama",             21,"L","BMO Field"),
    ("2026-06-17","21:00","Uzbekistan","Colombia",      24,"K","Estadio Azteca"),
    # ── MATCHDAY 2 ──
    ("2026-06-18","12:00","Switzerland","Bosnia",       26,"B","SoFi Stadium"),
    ("2026-06-18","12:00","Czech Republic","South Africa",25,"A","Mercedes-Benz Stadium"),
    ("2026-06-18","15:00","Canada","Qatar",             27,"B","BC Place"),
    ("2026-06-18","20:00","Mexico","South Korea",       28,"A","Estadio Akron"),
    ("2026-06-19","12:00","United States","Australia",  32,"D","Lumen Field"),
    ("2026-06-19","18:00","Scotland","Morocco",         30,"C","Gillette Stadium"),
    ("2026-06-19","21:00","Turkey","Paraguay",          31,"D","Levi's Stadium"),
    ("2026-06-19","21:00","Brazil","Haiti",             29,"C","Lincoln Financial Field"),
    ("2026-06-20","12:00","Netherlands","Sweden",       35,"F","NRG Stadium"),
    ("2026-06-20","16:00","Germany","Ivory Coast",      33,"E","BMO Field"),
    ("2026-06-20","19:00","Ecuador","Curaçao",         34,"E","Arrowhead Stadium"),
    ("2026-06-20","23:00","Tunisia","Japan",            36,"F","Estadio BBVA"),
    ("2026-06-21","12:00","Belgium","Iran",             39,"G","SoFi Stadium"),
    ("2026-06-21","12:00","Spain","Saudi Arabia",       38,"H","Mercedes-Benz Stadium"),
    ("2026-06-21","18:00","Uruguay","Cape Verde",       37,"H","Hard Rock Stadium"),
    ("2026-06-21","18:00","New Zealand","Egypt",        40,"G","BC Place"),
    ("2026-06-22","12:00","Argentina","Austria",        43,"J","AT&T Stadium"),
    ("2026-06-22","17:00","France","Iraq",              42,"I","Lincoln Financial Field"),
    ("2026-06-22","20:00","Jordan","Algeria",           44,"J","Levi's Stadium"),
    ("2026-06-22","20:00","Norway","Senegal",           41,"I","MetLife Stadium"),
    ("2026-06-23","12:00","Portugal","Uzbekistan",      47,"K","NRG Stadium"),
    ("2026-06-23","16:00","England","Ghana",            45,"L","Gillette Stadium"),
    ("2026-06-23","19:00","Panama","Croatia",           46,"L","BMO Field"),
    ("2026-06-23","21:00","Colombia","DR Congo",        48,"K","Estadio Akron"),
    # ── MATCHDAY 3 ──
    ("2026-06-24","12:00","Switzerland","Canada",       51,"B","BC Place"),
    ("2026-06-24","12:00","Bosnia","Qatar",             52,"B","Lumen Field"),
    ("2026-06-24","18:00","Morocco","Haiti",            50,"C","Mercedes-Benz Stadium"),
    ("2026-06-24","18:00","Scotland","Brazil",          49,"C","Hard Rock Stadium"),
    ("2026-06-24","20:00","South Africa","South Korea", 54,"A","Estadio BBVA"),
    ("2026-06-24","20:00","Czech Republic","Mexico",    53,"A","Estadio Azteca"),
    ("2026-06-25","16:00","Curaçao","Ivory Coast",     55,"E","Lincoln Financial Field"),
    ("2026-06-25","16:00","Ecuador","Germany",          56,"E","MetLife Stadium"),
    ("2026-06-25","18:00","Japan","Sweden",             57,"F","AT&T Stadium"),
    ("2026-06-25","18:00","Tunisia","Netherlands",      58,"F","Arrowhead Stadium"),
    ("2026-06-25","19:00","Paraguay","Australia",       60,"D","Levi's Stadium"),
    ("2026-06-25","19:00","Turkey","United States",     59,"D","SoFi Stadium"),
    ("2026-06-26","15:00","Senegal","Iraq",             62,"I","BMO Field"),
    ("2026-06-26","15:00","Norway","France",            61,"I","Gillette Stadium"),
    ("2026-06-26","19:00","Cape Verde","Saudi Arabia",  65,"H","NRG Stadium"),
    ("2026-06-26","19:00","Uruguay","Spain",            66,"H","Estadio Akron"),
    ("2026-06-26","20:00","New Zealand","Belgium",      64,"G","BC Place"),
    ("2026-06-26","20:00","Egypt","Iran",               63,"G","Lumen Field"),
    ("2026-06-27","17:00","Croatia","Ghana",            68,"L","Lincoln Financial Field"),
    ("2026-06-27","17:00","Panama","England",           67,"L","MetLife Stadium"),
    ("2026-06-27","19:30","DR Congo","Uzbekistan",      72,"K","Mercedes-Benz Stadium"),
    ("2026-06-27","19:30","Colombia","Portugal",        71,"K","Hard Rock Stadium"),
    ("2026-06-27","21:00","Jordan","Argentina",         70,"J","AT&T Stadium"),
    ("2026-06-27","21:00","Algeria","Austria",          69,"J","Arrowhead Stadium"),
    # ── ROUND OF 32 (Sechzehntelfinale) — TBD ──
    ("2026-06-28","12:00","TBD","TBD",73,"R32","SoFi Stadium"),
    ("2026-06-29","12:00","TBD","TBD",76,"R32","NRG Stadium"),
    ("2026-06-29","16:30","TBD","TBD",74,"R32","Gillette Stadium"),
    ("2026-06-29","20:00","TBD","TBD",75,"R32","Estadio BBVA"),
    ("2026-06-30","12:00","TBD","TBD",78,"R32","AT&T Stadium"),
    ("2026-06-30","17:00","TBD","TBD",77,"R32","MetLife Stadium"),
    ("2026-06-30","20:00","TBD","TBD",79,"R32","Estadio Azteca"),
    ("2026-07-01","12:00","TBD","TBD",80,"R32","Mercedes-Benz Stadium"),
    ("2026-07-01","13:00","TBD","TBD",82,"R32","Lumen Field"),
    ("2026-07-01","17:00","TBD","TBD",81,"R32","Levi's Stadium"),
    ("2026-07-02","12:00","TBD","TBD",84,"R32","SoFi Stadium"),
    ("2026-07-02","19:00","TBD","TBD",83,"R32","BMO Field"),
    ("2026-07-02","20:00","TBD","TBD",85,"R32","BC Place"),
    ("2026-07-03","13:00","TBD","TBD",88,"R32","AT&T Stadium"),
    ("2026-07-03","18:00","TBD","TBD",86,"R32","Hard Rock Stadium"),
    ("2026-07-03","20:30","TBD","TBD",87,"R32","Arrowhead Stadium"),
    # ── ROUND OF 16 (Achtelfinale) ──
    ("2026-07-04","12:00","TBD","TBD",90,"R16","NRG Stadium"),
    ("2026-07-04","17:00","TBD","TBD",89,"R16","Lincoln Financial Field"),
    ("2026-07-05","16:00","TBD","TBD",91,"R16","MetLife Stadium"),
    ("2026-07-05","19:00","TBD","TBD",92,"R16","Estadio Azteca"),
    ("2026-07-06","14:00","TBD","TBD",93,"R16","AT&T Stadium"),
    ("2026-07-06","17:00","TBD","TBD",94,"R16","Lumen Field"),
    ("2026-07-07","12:00","TBD","TBD",95,"R16","Mercedes-Benz Stadium"),
    ("2026-07-07","13:00","TBD","TBD",96,"R16","BC Place"),
    # ── QUARTER-FINALS (Viertelfinale) ──
    ("2026-07-09","16:00","TBD","TBD",97,"QF","Gillette Stadium"),
    ("2026-07-10","12:00","TBD","TBD",98,"QF","SoFi Stadium"),
    ("2026-07-11","17:00","TBD","TBD",99,"QF","Hard Rock Stadium"),
    ("2026-07-11","20:00","TBD","TBD",100,"QF","Arrowhead Stadium"),
    # ── SEMI-FINALS (Halbfinale) ──
    ("2026-07-14","14:00","TBD","TBD",101,"SF","AT&T Stadium"),
    ("2026-07-15","15:00","TBD","TBD",102,"SF","Mercedes-Benz Stadium"),
    # ── THIRD PLACE (Spiel um Platz 3) ──
    ("2026-07-18","17:00","TBD","TBD",103,"3P","Hard Rock Stadium"),
    # ── FINAL ──
    ("2026-07-19","15:00","TBD","TBD",104,"F","MetLife Stadium"),
]

ROUND_LABELS = {
    "R32": "Round of 32", "R16": "Round of 16",
    "QF": "Quarter-Final", "SF": "Semi-Final",
    "3P": "Third Place Play-off", "F": "Final",
}


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text


def venue_image(slug: str) -> str:
    """Return best-available /api/event-images/venues/<slug>.<ext> URL."""
    import pathlib
    base = pathlib.Path(__file__).resolve().parent / "static" / "event_images" / "venues"
    for ext in ("jpg", "jpeg", "png"):
        if (base / f"{slug}.{ext}").exists():
            return f"/api/event-images/venues/{slug}.{ext}"
    # fallback: fifa-worldcup action shot
    return "/api/event-images/venues/_action-fifa-worldcup.jpg"


def featured_for(round_code: str, match_no: int) -> bool:
    # Feature all knockouts + opening match (#1) + iconic finals venues
    if round_code in ("R32", "R16", "QF", "SF", "3P", "F"):
        return True
    if match_no == 1:  # opening match
        return True
    return False


def main():
    # Wipe out old 'worldcup' placeholder events first
    deleted = db.events.delete_many({"event_type": "worldcup"}).deleted_count
    print(f"Deleted {deleted} old worldcup events")

    inserted = 0
    for date_iso, time_hhmm, home, away, match_no, group, venue in MATCHES:
        info = VENUE_INFO[venue]
        venue_slug, city, country = info

        # Parse date + time as UTC
        dt = datetime.strptime(f"{date_iso} {time_hhmm}", "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)

        is_knockout = group in ROUND_LABELS
        if is_knockout and home == "TBD":
            title = f"{ROUND_LABELS[group]} - Match {match_no}"
            subtitle = f"FIFA World Cup 2026 · {ROUND_LABELS[group]}"
            slug = f"fifa-world-cup-2026-{slugify(ROUND_LABELS[group])}-match-{match_no}"
        else:
            title = f"{home} vs {away}"
            subtitle = f"FIFA World Cup 2026 · Group {group} · Match {match_no}"
            slug = f"fifa-world-cup-2026-{slugify(home)}-vs-{slugify(away)}-{slugify(city)}"

        base_price = {
            "F": 900, "3P": 450, "SF": 600,
            "QF": 350, "R16": 220, "R32": 150,
        }.get(group, 95)

        event_id = f"wc2026_match_{match_no:03d}"
        doc = {
            "event_id": event_id,
            "event_type": "worldcup",
            "title": title,
            "subtitle": subtitle,
            "description": f"FIFA World Cup 2026 — {title} at {venue}, {city}. Kickoff: {dt.strftime('%b %d, %Y %H:%M UTC')}.",
            "slug": slug,
            "home_team": None if home == "TBD" else home,
            "away_team": None if away == "TBD" else away,
            "league": "FIFA World Cup 2026",
            "venue": venue,
            "city": city,
            "country": country,
            "event_date": dt,
            "image_url": venue_image(venue_slug),
            "image_alt": f"{title} tickets — {venue}, {city}",
            "lowest_price": base_price,
            "price_from": base_price,
            "price_to": base_price * 6,
            "available_tickets": 250 if group in ("F","3P","SF") else 500,
            "status": "active",
            "featured": featured_for(group, match_no),
            "match_number": match_no,
            "group_or_round": group,
            "created_at": datetime.now(timezone.utc),
        }

        db.events.update_one(
            {"event_id": event_id},
            {"$set": doc},
            upsert=True,
        )
        inserted += 1

    print(f"Upserted {inserted} FIFA World Cup 2026 matches.")


if __name__ == "__main__":
    main()
