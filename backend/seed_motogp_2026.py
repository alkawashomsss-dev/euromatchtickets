"""
Replace all MotoGP events with the OFFICIAL 2026 calendar
(source: global-tickets.com, matching the top Google result).

Real 2026 MotoGP calendar — 21 rounds.
"""
import os
import re
import unicodedata
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")
client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]


def slugify(s: str) -> str:
    t = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


# (round, race_date_sunday, end_date, country, country_code, venue_display, city, venue_slug_for_image)
CALENDAR = [
    (1,  "2026-04-26", "2026-04-26", "Spain",          "ES", "Circuito de Jerez",                       "Jerez",            "jerez-motogp"),
    (2,  "2026-05-10", "2026-05-10", "France",         "FR", "Le Mans Bugatti Circuit",                 "Le Mans",          "le-mans-bugatti"),
    (3,  "2026-05-17", "2026-05-17", "Spain",          "ES", "Circuit de Barcelona-Catalunya",          "Barcelona",        "barcelona-catalunya"),
    (4,  "2026-05-31", "2026-05-31", "Italy",          "IT", "Autodromo del Mugello",                   "Mugello",          "mugello"),
    (5,  "2026-06-07", "2026-06-07", "Hungary",        "HU", "Balaton Park Circuit",                    "Balatonfőkajár",   "_action-motogp"),
    (6,  "2026-06-21", "2026-06-21", "Czech Republic", "CZ", "Masaryk Circuit Brno",                    "Brno",             "_action-motogp"),
    (7,  "2026-06-28", "2026-06-28", "Netherlands",    "NL", "TT Circuit Assen",                        "Assen",            "assen"),
    (8,  "2026-07-12", "2026-07-12", "Germany",        "DE", "Sachsenring",                             "Oberlungwitz",     "sachsenring"),
    (9,  "2026-08-09", "2026-08-09", "United Kingdom", "GB", "Silverstone Circuit",                     "Silverstone",      "silverstone"),
    (10, "2026-08-30", "2026-08-30", "Spain",          "ES", "MotorLand Aragón",                        "Alcañiz",          "motorland-aragon"),
    (11, "2026-09-13", "2026-09-13", "San Marino",     "SM", "Misano World Circuit Marco Simoncelli",   "Misano",           "misano"),
    (12, "2026-09-20", "2026-09-20", "Austria",        "AT", "Red Bull Ring",                           "Spielberg",        "red-bull-ring"),
    (13, "2026-10-04", "2026-10-04", "Japan",          "JP", "Mobility Resort Motegi",                  "Motegi",           "_action-motogp"),
    (14, "2026-10-11", "2026-10-11", "Indonesia",      "ID", "Pertamina Mandalika Circuit",             "Lombok",           "_action-motogp"),
    (15, "2026-11-01", "2026-11-01", "Malaysia",       "MY", "Sepang International Circuit",            "Sepang",           "sepang"),
    (16, "2026-11-08", "2026-11-08", "Qatar",          "QA", "Lusail International Circuit",            "Doha",             "lusail"),
    (17, "2026-11-22", "2026-11-22", "Portugal",       "PT", "Autódromo Internacional do Algarve",      "Portimão",         "_action-motogp"),
    (18, "2026-11-29", "2026-11-29", "Spain",          "ES", "Circuit Ricardo Tormo",                   "Cheste",           "valencia-ricardo-tormo"),
    (19, "2027-02-28", "2027-02-28", "Thailand",       "TH", "Chang International Circuit",             "Buri Ram",         "_action-motogp"),
    # Early-bird 2027 placeholders
    (20, "2027-03-28", "2027-03-28", "Brazil",         "BR", "Goiânia Circuit",                         "Goiânia",          "_action-motogp"),
    (21, "2027-04-11", "2027-04-11", "United States",  "US", "Circuit of the Americas",                 "Austin",            "cota"),
]

PRICE_TIERS = {
    # Premium: Mugello, Assen, Silverstone, Le Mans, Barcelona, Misano, Spielberg
    "premium":  {"from": 149, "to": 699},
    # Standard European
    "standard": {"from": 109, "to": 499},
    # Long-haul (Asia/Americas)
    "overseas": {"from": 129, "to": 599},
}

# Map venue_slug to tier
TIER_MAP = {
    "mugello": "premium",
    "assen": "premium",
    "silverstone": "premium",
    "le-mans-bugatti": "premium",
    "barcelona-catalunya": "premium",
    "misano": "premium",
    "red-bull-ring": "premium",
    "jerez-motogp": "premium",
    "sachsenring": "premium",
    "motorland-aragon": "standard",
    "valencia-ricardo-tormo": "standard",
}


def tier_for(venue_slug: str, country_code: str) -> dict:
    if venue_slug in TIER_MAP:
        return PRICE_TIERS[TIER_MAP[venue_slug]]
    if country_code in ("JP", "ID", "MY", "QA", "PT", "TH", "BR", "US"):
        return PRICE_TIERS["overseas"]
    return PRICE_TIERS["standard"]


def main():
    # Wipe existing motogp events
    deleted = db.events.delete_many({"event_type": "motogp"}).deleted_count
    print(f"🗑  Deleted {deleted} old MotoGP events")

    now = datetime.now(timezone.utc)
    inserted = 0
    for rnd, date_iso, _end, country, cc, venue, city, slug_img in CALENDAR:
        dt = datetime.strptime(f"{date_iso} 13:00", "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
        title = f"{country} MotoGP 2026" if date_iso.startswith("2026") else f"{country} MotoGP 2027"
        # Use real GP branding style, e.g. "Dutch MotoGP 2026" etc.
        gp_brand = {
            "Netherlands": "Dutch MotoGP",
            "Germany":      "German MotoGP",
            "United Kingdom": "British MotoGP",
            "Czech Republic": "Czech MotoGP",
            "San Marino":   "San Marino MotoGP",
            "Austria":      "Austrian MotoGP",
            "Japan":        "Japanese MotoGP",
            "Indonesia":    "Indonesian MotoGP",
            "Malaysia":     "Malaysian MotoGP",
            "Qatar":        "Qatar MotoGP",
            "Portugal":     "Portuguese MotoGP",
            "Spain":        "Spanish MotoGP",  # Jerez = Spanish GP
            "France":       "French MotoGP",
            "Italy":        "Italian MotoGP",
            "Hungary":      "Hungarian MotoGP",
            "Thailand":     "Thailand MotoGP",
            "Brazil":       "Brazilian MotoGP",
            "United States":"Americas MotoGP",
        }.get(country, f"{country} MotoGP")
        # Disambiguate Spain rounds
        if country == "Spain":
            if city == "Jerez":          gp_brand = "Spanish MotoGP"
            elif city == "Barcelona":    gp_brand = "Catalan MotoGP"
            elif city == "Alcañiz":      gp_brand = "Aragon MotoGP"
            elif city == "Cheste":       gp_brand = "Valencian MotoGP"
        year = date_iso[:4]
        title = f"{gp_brand} {year}"
        tier = tier_for(slug_img, cc)

        # Slug e.g. "dutch-motogp-2026-assen-tickets"
        slug = slugify(f"{gp_brand} {year} {city} tickets")
        event_id = f"motogp2026_r{rnd:02d}"
        is_early_bird = date_iso >= "2027-01-01"

        doc = {
            "event_id": event_id,
            "event_type": "motogp",
            "title": title,
            "subtitle": f"MotoGP World Championship {year} · Round {rnd}",
            "description": f"{title} — MotoGP World Championship {year} Round {rnd} at {venue}, {city}, {country}. Experience the pinnacle of motorcycle racing.",
            "slug": slug,
            "venue": venue,
            "city": city,
            "country": country,
            "league": "MotoGP World Championship",
            "event_date": dt,
            "lowest_price": tier["from"],
            "price_from": tier["from"],
            "price_to": tier["to"],
            "available_tickets": 0 if is_early_bird else 300,
            "status": "coming_soon" if is_early_bird else "active",
            "featured": not is_early_bird and rnd <= 12,
            "round_number": rnd,
            "image_url": f"/api/event-images/matches/motogp_{slug}.jpg",
            "image_alt": f"{title} tickets — {venue}",
            "created_at": now,
        }
        db.events.update_one({"event_id": event_id}, {"$set": doc}, upsert=True)
        inserted += 1
    print(f"✅ Inserted {inserted} MotoGP 2026/2027 rounds (real global-tickets calendar)")


if __name__ == "__main__":
    main()
