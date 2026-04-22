"""
Expanded venue image downloader — fetches real photos from Wikipedia
articles for 80+ venues covering F1 circuits, football stadiums,
MotoGP tracks, concert arenas, and tennis venues.

Run:  python -m services.venue_image_downloader
"""
import pathlib
import time
import requests
import urllib.parse
import sys

OUT = pathlib.Path(__file__).resolve().parent.parent / "static" / "event_images" / "venues"
OUT.mkdir(parents=True, exist_ok=True)

HEADERS = {"User-Agent": "EuroMatchTickets/1.0 (contact@euromatchtickets.com)"}
SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/{title}"

# slug -> Wikipedia article title (exact)
VENUES_WIKI = {
    # ── F1 CIRCUITS ──
    "spa-francorchamps": "Circuit_de_Spa-Francorchamps",
    "silverstone": "Silverstone_Circuit",
    "monaco-circuit": "Circuit_de_Monaco",
    "monza": "Monza_Circuit",
    "bahrain-circuit": "Bahrain_International_Circuit",
    "yas-marina": "Yas_Marina_Circuit",
    "barcelona-catalunya": "Circuit_de_Barcelona-Catalunya",
    "red-bull-ring": "Red_Bull_Ring",
    "hungaroring": "Hungaroring",
    "zandvoort": "Circuit_Zandvoort",
    "suzuka": "Suzuka_International_Racing_Course",
    "interlagos": "Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace",
    "miami-autodrome": "Miami_International_Autodrome",
    "cota": "Circuit_of_the_Americas",
    "jeddah": "Jeddah_Corniche_Circuit",
    "baku": "Baku_City_Circuit",
    "lusail": "Lusail_International_Circuit",
    "shanghai": "Shanghai_International_Circuit",
    "imola": "Imola_Circuit",
    "albert-park": "Albert_Park_Circuit",
    "gilles-villeneuve": "Circuit_Gilles_Villeneuve",
    "las-vegas-circuit": "Las_Vegas_Strip_Circuit",
    "hermanos-rodriguez": "Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez",
    "marina-bay": "Marina_Bay_Street_Circuit",
    # ── MOTOGP CIRCUITS ──
    "mugello": "Mugello_Circuit",
    "jerez-motogp": "Circuito_Permanente_de_Jerez",
    "phillip-island": "Phillip_Island_Grand_Prix_Circuit",
    "motorland-aragon": "MotorLand_Arag%C3%B3n",
    "sepang": "Sepang_International_Circuit",
    "assen": "TT_Circuit_Assen",
    "le-mans-bugatti": "Bugatti_Circuit",
    "isle-of-man-course": "Snaefell_Mountain_Course",
    "termas-de-rio-hondo": "Aut%C3%B3dromo_Termas_de_R%C3%ADo_Hondo",
    "sachsenring": "Sachsenring",
    "misano": "Misano_World_Circuit_Marco_Simoncelli",
    "valencia-ricardo-tormo": "Circuit_Ricardo_Tormo",
    # ── FOOTBALL STADIUMS ──
    "allianz-arena": "Allianz_Arena",
    "santiago-bernabeu": "Santiago_Bernab%C3%A9u_Stadium",
    "camp-nou": "Camp_Nou",
    "wembley": "Wembley_Stadium",
    "old-trafford": "Old_Trafford",
    "emirates-stadium": "Emirates_Stadium",
    "anfield": "Anfield",
    "stamford-bridge": "Stamford_Bridge",
    "etihad-stadium": "City_of_Manchester_Stadium",
    "tottenham-stadium": "Tottenham_Hotspur_Stadium",
    "san-siro": "San_Siro",
    "stadio-olimpico": "Stadio_Olimpico",
    "juventus-stadium": "Allianz_Stadium_(Turin)",
    "stade-de-france": "Stade_de_France",
    "parc-des-princes": "Parc_des_Princes",
    "signal-iduna-park": "Westfalenstadion",
    "red-bull-arena": "Red_Bull_Arena_(Leipzig)",
    "johan-cruyff-arena": "Johan_Cruyff_Arena",
    "de-kuip": "De_Kuip",
    "philips-stadion": "Philips_Stadion",
    "metlife-stadium": "MetLife_Stadium",
    "sofi-stadium": "SoFi_Stadium",
    "estadio-azteca": "Estadio_Azteca",
    "rose-bowl": "Rose_Bowl_(stadium)",
    "lumen-field": "Lumen_Field",
    "mercedes-benz-stadium": "Mercedes-Benz_Stadium",
    "olympiastadion-berlin": "Olympiastadion_(Berlin)",
    "luzhniki": "Luzhniki_Stadium",
    "stade-velodrome": "Stade_V%C3%A9lodrome",
    "estadio-wanda": "C%C3%ADvitas_Metropolitano",
    "estadi-olimpic-barcelona": "Estadi_Ol%C3%ADmpic_Llu%C3%ADs_Companys",
    # ── CONCERT ARENAS ──
    "o2-arena-london": "The_O2_Arena",
    "madison-square-garden": "Madison_Square_Garden",
    "ziggo-dome": "Ziggo_Dome",
    "uber-arena-berlin": "Uber_Arena",
    "accor-arena-paris": "Accor_Arena",
    "forum-assago-milan": "Mediolanum_Forum",
    "wizink-center-madrid": "WiZink_Center",
    "palau-sant-jordi-barcelona": "Palau_Sant_Jordi",
    "afas-live-amsterdam": "AFAS_Live",
    "lanxess-arena-cologne": "Lanxess_Arena",
    "wanda-metropolitano-concert": "C%C3%ADvitas_Metropolitano",
    # ── TENNIS ──
    "foro-italico": "Foro_Italico",
    "roland-garros": "Stade_Roland_Garros",
    "all-england-club": "All_England_Lawn_Tennis_and_Croquet_Club",
    "caja-magica": "Caja_M%C3%A1gica",
    # ── SPORT ACTION PHOTOS (generic, for fallbacks) ──
    "_action-motogp": "MotoGP",  # Will pick a race photo
    "_action-formula-one": "Formula_One",
    "_action-champions-league": "UEFA_Champions_League",
    "_action-bundesliga": "Bundesliga",
    "_action-premier-league": "Premier_League",
    "_action-laliga": "La_Liga",
    "_action-fifa-worldcup": "FIFA_World_Cup",
    "_action-euro": "UEFA_European_Championship",
}


def fetch_lead(title: str):
    r = requests.get(SUMMARY.format(title=title), headers=HEADERS, timeout=15)
    if r.status_code != 200:
        return None
    data = r.json()
    img = (data.get("originalimage") or {}).get("source") or (data.get("thumbnail") or {}).get("source")
    return img


def download_one(slug: str, url: str) -> bool:
    ext = url.rsplit(".", 1)[-1].lower().split("?")[0]
    if ext not in ("jpg", "jpeg", "png"):
        ext = "jpg"
    out = OUT / f"{slug}.{ext}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
    except Exception as e:
        print(f"FAIL {slug}: {e}")
        return False
    if r.status_code == 200 and len(r.content) > 3000:
        out.write_bytes(r.content)
        # Clean up any other extensions for the same slug to keep only one
        for other_ext in ("jpg", "jpeg", "png"):
            if other_ext != ext:
                other = OUT / f"{slug}.{other_ext}"
                if other.exists():
                    other.unlink()
        return True
    return False


def run():
    ok, fail = 0, 0
    for slug, title in VENUES_WIKI.items():
        # Skip if already downloaded (any extension)
        if any((OUT / f"{slug}.{e}").exists() for e in ("jpg", "jpeg", "png")):
            print(f"SKIP {slug}")
            ok += 1
            continue
        img = fetch_lead(title)
        if img and download_one(slug, img):
            size_kb = (OUT / f"{slug}.{img.rsplit('.',1)[-1].lower().split('?')[0] if img.rsplit('.',1)[-1].lower().split('?')[0] in ('jpg','jpeg','png') else 'jpg'}").stat().st_size // 1024 if any((OUT / f"{slug}.{e}").exists() for e in ("jpg","jpeg","png")) else 0
            print(f"OK   {slug} ({size_kb} KB)")
            ok += 1
        else:
            print(f"FAIL {slug} -> {title}")
            fail += 1
        time.sleep(0.3)
    print(f"\nTotal: ok={ok}, fail={fail}")


if __name__ == "__main__":
    run()
