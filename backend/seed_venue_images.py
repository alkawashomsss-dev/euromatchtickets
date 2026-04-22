"""
Map every existing event in the DB to a real venue image under
/api/event-images/venues/<slug>.<ext>

Matches by venue name first, then falls back to event_type generic photo.
"""
import os
import pathlib
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

VENUES_DIR = pathlib.Path(__file__).resolve().parent / "static" / "event_images" / "venues"

# venue name fragment (lowercase) -> slug under /venues/
# First match wins. Order matters (more specific first).
VENUE_MATCH = [
    # ── F1 CIRCUITS ──
    ("spa", "spa-francorchamps"),
    ("stavelot", "spa-francorchamps"),
    ("silverstone", "silverstone"),
    ("monaco", "monaco-circuit"),
    ("monte carlo", "monaco-circuit"),
    ("monte-carlo", "monaco-circuit"),
    ("monza", "monza"),
    ("autodromo nazionale", "monza"),
    ("bahrain international", "bahrain-circuit"),
    ("sakhir", "bahrain-circuit"),
    ("yas marina", "yas-marina"),
    ("abu dhabi", "yas-marina"),
    ("barcelona-catalunya", "barcelona-catalunya"),
    ("montmelo", "barcelona-catalunya"),
    ("red bull ring", "red-bull-ring"),
    ("spielberg", "red-bull-ring"),
    ("hungaroring", "hungaroring"),
    ("budapest", "hungaroring"),
    ("zandvoort", "zandvoort"),
    ("suzuka", "suzuka"),
    ("interlagos", "interlagos"),
    ("são paulo", "interlagos"),
    ("sao paulo", "interlagos"),
    ("miami international autodrome", "miami-autodrome"),
    ("circuit of the americas", "cota"),
    ("cota", "cota"),
    ("austin", "cota"),
    ("jeddah", "jeddah"),
    ("baku", "baku"),
    ("losail", "lusail"),
    ("lusail", "lusail"),
    ("shanghai", "shanghai"),
    ("imola", "imola"),
    ("albert park", "albert-park"),
    ("melbourne", "albert-park"),
    ("gilles villeneuve", "gilles-villeneuve"),
    ("montreal", "gilles-villeneuve"),
    ("las vegas strip", "las-vegas-circuit"),
    ("hermanos rodríguez", "hermanos-rodriguez"),
    ("hermanos rodriguez", "hermanos-rodriguez"),
    ("mexico city", "hermanos-rodriguez"),
    ("marina bay", "marina-bay"),
    # ── MOTOGP ──
    ("mugello", "mugello"),
    ("jerez", "jerez-motogp"),
    ("circuito de jerez", "jerez-motogp"),
    ("phillip island", "phillip-island"),
    ("motorland", "motorland-aragon"),
    ("alcañiz", "motorland-aragon"),
    ("alca iz", "motorland-aragon"),
    ("sepang", "sepang"),
    ("assen", "assen"),
    ("le mans", "le-mans-bugatti"),
    ("bugatti", "le-mans-bugatti"),
    ("isle of man", "isle-of-man-course"),
    ("snaefell", "isle-of-man-course"),
    ("termas de río hondo", "termas-de-rio-hondo"),
    ("sachsenring", "sachsenring"),
    ("misano", "misano"),
    ("ricardo tormo", "valencia-ricardo-tormo"),
    # ── FOOTBALL STADIUMS ──
    ("allianz arena", "allianz-arena"),
    ("santiago bernab", "santiago-bernabeu"),
    ("camp nou", "camp-nou"),
    ("wembley", "wembley"),
    ("old trafford", "old-trafford"),
    ("emirates stadium", "emirates-stadium"),
    ("anfield", "anfield"),
    ("stamford bridge", "stamford-bridge"),
    ("etihad", "etihad-stadium"),
    ("city of manchester", "etihad-stadium"),
    ("tottenham hotspur stadium", "tottenham-stadium"),
    ("san siro", "san-siro"),
    ("giuseppe meazza", "san-siro"),
    ("stadio olimpico", "stadio-olimpico"),
    ("foro italico", "foro-italico"),
    ("juventus stadium", "juventus-stadium"),
    ("allianz stadium", "juventus-stadium"),
    ("stade de france", "stade-de-france"),
    ("parc des princes", "parc-des-princes"),
    ("signal iduna", "signal-iduna-park"),
    ("westfalenstadion", "signal-iduna-park"),
    ("dortmund", "signal-iduna-park"),
    ("red bull arena", "red-bull-arena"),
    ("leipzig", "red-bull-arena"),
    ("johan cruyff", "johan-cruyff-arena"),
    ("johan cruijff", "johan-cruyff-arena"),
    ("amsterdam arena", "johan-cruyff-arena"),
    ("de kuip", "de-kuip"),
    ("rotterdam", "de-kuip"),
    ("philips stadion", "philips-stadion"),
    ("eindhoven", "philips-stadion"),
    ("metlife", "metlife-stadium"),
    ("sofi stadium", "sofi-stadium"),
    ("estadio azteca", "estadio-azteca"),
    ("rose bowl", "rose-bowl"),
    ("lumen field", "lumen-field"),
    ("mercedes-benz stadium", "mercedes-benz-stadium"),
    ("mercedes benz stadium", "mercedes-benz-stadium"),
    ("olympiastadion", "olympiastadion-berlin"),
    ("luzhniki", "luzhniki"),
    ("vélodrome", "stade-velodrome"),
    ("velodrome", "stade-velodrome"),
    ("wanda metropolitano", "estadio-wanda"),
    ("metropolitano", "estadio-wanda"),
    ("atletico madrid", "estadio-wanda"),
    ("atlético madrid", "estadio-wanda"),
    ("estadi olímpic", "estadi-olimpic-barcelona"),
    ("estadi olimpic", "estadi-olimpic-barcelona"),
    ("lluís companys", "estadi-olimpic-barcelona"),
    # WC venues (already on worldcup events, but catch others)
    ("estadio akron", "estadio-akron"),
    ("estadio bbva", "estadio-bbva"),
    ("at&t stadium", "att-stadium"),
    ("at and t stadium", "att-stadium"),
    ("levi's stadium", "levis-stadium"),
    ("levis stadium", "levis-stadium"),
    ("bc place", "bc-place"),
    ("bmo field", "bmo-field"),
    ("nrg stadium", "nrg-stadium"),
    ("hard rock stadium", "hard-rock-stadium"),
    ("gillette stadium", "gillette-stadium"),
    ("lincoln financial", "lincoln-financial-field"),
    ("arrowhead", "arrowhead-stadium"),
    # ── CONCERT ARENAS ──
    ("o2 arena", "o2-arena-london"),
    ("the o2", "o2-arena-london"),
    ("madison square garden", "madison-square-garden"),
    ("ziggo dome", "ziggo-dome"),
    ("uber arena", "uber-arena-berlin"),
    ("mercedes-benz arena berlin", "uber-arena-berlin"),
    ("accor arena", "accor-arena-paris"),
    ("bercy", "accor-arena-paris"),
    ("mediolanum forum", "forum-assago-milan"),
    ("forum assago", "forum-assago-milan"),
    ("wizink center", "wizink-center-madrid"),
    ("movistar arena", "wizink-center-madrid"),
    ("palau sant jordi", "palau-sant-jordi-barcelona"),
    ("afas live", "afas-live-amsterdam"),
    ("lanxess arena", "lanxess-arena-cologne"),
    # ── TENNIS ──
    ("roland garros", "roland-garros"),
    ("all england", "all-england-club"),
    ("wimbledon", "all-england-club"),
    ("caja mágica", "caja-magica"),
    ("caja magica", "caja-magica"),
]

# Generic fallback by event_type
TYPE_FALLBACK = {
    "f1": "_action-formula-one",     # may not exist -> double fallback
    "motogp": "_action-motogp",
    "isle_of_man_tt": "isle-of-man-course",
    "football": "_action-premier-league",
    "match": "_action-champions-league",
    "concert": "o2-arena-london",
    "festival": "palau-sant-jordi-barcelona",
    "tennis": "foro-italico",
    "athletics": "olympiastadion-berlin",
    "worldcup": "_action-fifa-worldcup",
    "attraction": "_action-fifa-worldcup",
}


def find_image_file(slug: str):
    for ext in ("jpg", "jpeg", "png"):
        p = VENUES_DIR / f"{slug}.{ext}"
        if p.exists():
            return f"/api/event-images/venues/{slug}.{ext}"
    return None


def match_venue(event) -> str | None:
    haystack = " ".join([
        (event.get("venue") or ""),
        (event.get("city") or ""),
        (event.get("title") or ""),
    ]).lower()
    for needle, slug in VENUE_MATCH:
        if needle in haystack:
            path = find_image_file(slug)
            if path:
                return path
    return None


def main():
    updated = matched_by_venue = matched_by_type = missing = 0
    # Skip events that already point to /api/event-images/venues/
    cursor = db.events.find({
        "$or": [
            {"image_url": {"$exists": False}},
            {"image_url": None},
            {"image_url": {"$not": {"$regex": "^/api/event-images/venues/"}}},
        ]
    }, {"_id": 0})

    for ev in cursor:
        url = match_venue(ev)
        if url:
            matched_by_venue += 1
        else:
            slug = TYPE_FALLBACK.get(ev.get("event_type"), "_action-fifa-worldcup")
            url = find_image_file(slug) or find_image_file("_action-fifa-worldcup")
            if url:
                matched_by_type += 1
            else:
                missing += 1
                continue
        db.events.update_one(
            {"event_id": ev["event_id"]},
            {"$set": {"image_url": url}},
        )
        updated += 1

    print(f"Updated {updated} events:")
    print(f"  by venue name : {matched_by_venue}")
    print(f"  by type fallback: {matched_by_type}")
    print(f"  missing         : {missing}")


if __name__ == "__main__":
    main()
