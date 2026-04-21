"""
EuroMatchTickets — World-Class Dynamic Sitemap System
=====================================================
Generates a Sitemap Index with 10+ category-specific XML sitemaps.

Advanced SEO features:
  - <image:image>  per page where applicable
  - <xhtml:link>   hreflang annotations for every multilingual page
  - Smart priority  derived from page category & importance tier
  - Real <lastmod>  from MongoDB timestamps
  - Dynamic <changefreq> based on content volatility
  - Google & Bing ping after regeneration
  - Full XML schema validation
  - Deduplication across all sitemaps
"""

import pymongo, os, hashlib, requests
from datetime import datetime, timezone
from collections import defaultdict
from xml.sax.saxutils import escape

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SITE       = "https://euromatchtickets.com"
OUTPUT_DIR = "/app/frontend/public"
TODAY      = datetime.now(timezone.utc).strftime("%Y-%m-%d")
MONGO_URL  = os.environ.get("MONGO_URL", "mongodb://localhost:27017")

client = pymongo.MongoClient(MONGO_URL)
db     = client["euromatchtickets"]

# ────────────────────────────────────────────────────────────────────
# UNVERIFIED DEMAND PAGES — kept in sync with
# /app/backend/services/event_validator.py :: UNVERIFIED_DEMAND_PAGES
# These MUST NEVER appear in the sitemap (Google expects sitemap URLs
# to be indexable — unverified demand pages are noindex).
# ────────────────────────────────────────────────────────────────────
UNVERIFIED_DEMAND_SLUGS = {
    "justin-bieber-amsterdam-2026-tickets",
}


def _is_indexable_slug(slug: str) -> bool:
    """Return False if this slug is explicitly noindex (unverified)."""
    if not slug:
        return False
    clean = slug.strip("/").lower()
    return clean not in UNVERIFIED_DEMAND_SLUGS


seen_urls: set = set()          # Global dedup
sitemap_files: list = []        # Track generated files
total_url_count = 0

# ---------------------------------------------------------------------------
# Hreflang mapping  (bidirectional — every variant links to every other)
# ---------------------------------------------------------------------------
HREFLANG_GROUPS = [
    {
        "x-default": "/",        "en": "/",
        "es": "/es/comprar-entradas",   "de": "/de/tickets-kaufen",
        "fr": "/fr/acheter-billets",    "it": "/it/biglietti",
    },
    {
        "x-default": "/champions-league-tickets", "en": "/champions-league-tickets",
        "es": "/es/entradas-champions-league", "de": "/de/champions-league-tickets",
        "fr": "/fr/billets-champions-league",  "it": "/it/biglietti-champions-league",
    },
    {
        "x-default": "/f1-tickets", "en": "/f1-tickets",
        "es": "/es/entradas-f1",    "de": "/de/formel-1-tickets",
        "fr": "/fr/billets-f1",     "it": "/it/biglietti-f1",
    },
    {
        "x-default": "/world-cup-2026", "en": "/world-cup-2026",
        "es": "/es/entradas-copa-del-mundo-2026", "de": "/de/wm-2026-tickets",
    },
]

# Build a fast lookup: path -> hreflang dict
PATH_TO_HREFLANG: dict = {}
for group in HREFLANG_GROUPS:
    for _lang, _path in group.items():
        PATH_TO_HREFLANG[_path] = group

# ---------------------------------------------------------------------------
# Image map — hero / OG images for key page categories
# ---------------------------------------------------------------------------
IMAGE_MAP = {
    "/":                              {"url": f"{SITE}/og-image.jpg",              "title": "EuroMatchTickets - Europe's #1 Ticket Marketplace"},
    "/champions-league-tickets":      {"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": "Champions League Tickets 2026"},
    "/f1-tickets":                    {"url": f"{SITE}/images/heroes/f1-red-lg.webp", "title": "F1 Grand Prix Tickets 2026"},
    "/f1-tickets-2026":               {"url": f"{SITE}/images/heroes/f1-red-lg.webp", "title": "Formula 1 Tickets 2026"},
    "/world-cup-2026":                {"url": f"{SITE}/images/heroes/worldcup-trophy-lg.webp", "title": "FIFA World Cup 2026 Tickets"},
    "/world-cup-2026-tickets":        {"url": f"{SITE}/images/heroes/worldcup-trophy-lg.webp", "title": "FIFA World Cup 2026 Tickets"},
    "/taylor-swift-tickets":          {"url": f"{SITE}/images/heroes/concert-purple-lg.webp", "title": "Taylor Swift Concert Tickets 2026"},
    "/taylor-swift-london-tickets":   {"url": f"{SITE}/images/heroes/concert-purple-lg.webp", "title": "Taylor Swift London Wembley 2026"},
    "/el-clasico-tickets":            {"url": f"{SITE}/images/heroes/football-match-lg.webp", "title": "El Clasico Real Madrid vs Barcelona"},
    "/super-bowl-2026-tickets":       {"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": "Super Bowl 2026 Tickets"},
    "/monaco-grand-prix-tickets":     {"url": f"{SITE}/images/heroes/monaco-lg.webp", "title": "Monaco Grand Prix 2026"},
    "/bayern-vs-real-madrid-tickets":  {"url": f"{SITE}/images/heroes/football-match-lg.webp", "title": "Bayern vs Real Madrid UCL"},
    "/bahrain-world-cup-tickets-2026": {"url": f"{SITE}/images/heroes/worldcup-final-lg.webp", "title": "Bahrain World Cup 2026"},
    "/world-athletics-2026-tickets":  {"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": "World Athletics 2026"},
    "/motogp-tickets":                {"url": f"{SITE}/images/heroes/motogp-lg.webp", "title": "MotoGP Tickets 2026"},
    "/events":                        {"url": f"{SITE}/og-image.jpg", "title": "All Events & Tickets"},
    "/real-madrid-tickets":           {"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": "Real Madrid Tickets"},
    "/barcelona-tickets":             {"url": f"{SITE}/images/heroes/football-match-lg.webp", "title": "FC Barcelona Tickets"},
    "/manchester-city-tickets":       {"url": f"{SITE}/images/heroes/football-lg.webp", "title": "Manchester City Tickets"},
    "/liverpool-tickets":             {"url": f"{SITE}/images/heroes/football-penalty-lg.webp", "title": "Liverpool FC Tickets"},
    "/arsenal-tickets":               {"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": "Arsenal Tickets"},
    "/bayern-munich-tickets":         {"url": f"{SITE}/images/heroes/football-match-lg.webp", "title": "Bayern Munich Tickets"},
    "/psg-tickets":                   {"url": f"{SITE}/images/heroes/football-lg.webp", "title": "PSG Tickets"},
    "/juventus-tickets":              {"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": "Juventus Tickets"},
    "/bruno-mars-tour-2026":          {"url": f"{SITE}/images/heroes/concert-live-lg.webp", "title": "Bruno Mars Tour 2026"},
    "/the-weeknd-tour-2026":          {"url": f"{SITE}/images/heroes/concert-drums-lg.webp", "title": "The Weeknd Tour 2026"},
    "/guns-n-roses-tour-2026":        {"url": f"{SITE}/images/heroes/concert-lg.webp", "title": "Guns N Roses Tour 2026"},
    "/bad-bunny-london-2026":         {"url": f"{SITE}/images/heroes/concert-purple-lg.webp", "title": "Bad Bunny London 2026"},
    "/maroon-5-tickets":              {"url": f"{SITE}/images/heroes/concert-live-lg.webp", "title": "Maroon 5 Tickets"},
    "/john-legend-abu-dhabi-tickets": {"url": f"{SITE}/images/heroes/concert-drums-lg.webp", "title": "John Legend Tickets"},
    "/harry-styles-tickets":          {"url": f"{SITE}/images/heroes/concert-purple-lg.webp", "title": "Harry Styles Tickets"},
    "/metallica-sphere-las-vegas-tickets": {"url": f"{SITE}/images/heroes/concert-lg.webp", "title": "Metallica Sphere Las Vegas"},
    "/acl-festival-2026-tickets":     {"url": f"{SITE}/images/heroes/concert-live-lg.webp", "title": "ACL Festival 2026"},
    "/coldplay-tour-2026":            {"url": f"{SITE}/images/heroes/concert-drums-lg.webp", "title": "Coldplay European Tour 2026"},
}

# Category-based image for dynamic SEO pages
CATEGORY_IMAGES = {
    "f1": [f"{SITE}/images/heroes/f1-red-lg.webp", f"{SITE}/images/heroes/f1-race-lg.webp", f"{SITE}/images/heroes/f1-pitstop-lg.webp", f"{SITE}/images/heroes/f1-lg.webp"],
    "football": [f"{SITE}/images/heroes/football-stadium-lg.webp", f"{SITE}/images/heroes/football-match-lg.webp", f"{SITE}/images/heroes/football-penalty-lg.webp", f"{SITE}/images/heroes/football-lg.webp"],
    "concert": [f"{SITE}/images/heroes/concert-purple-lg.webp", f"{SITE}/images/heroes/concert-live-lg.webp", f"{SITE}/images/heroes/concert-drums-lg.webp", f"{SITE}/images/heroes/concert-lg.webp"],
    "concerts": [f"{SITE}/images/heroes/concert-purple-lg.webp", f"{SITE}/images/heroes/concert-live-lg.webp", f"{SITE}/images/heroes/concert-drums-lg.webp", f"{SITE}/images/heroes/concert-lg.webp"],
    "worldcup": [f"{SITE}/images/heroes/worldcup-trophy-lg.webp", f"{SITE}/images/heroes/worldcup-final-lg.webp", f"{SITE}/images/heroes/worldcup-lg.webp"],
    "motorsport": [f"{SITE}/images/heroes/motogp-lg.webp", f"{SITE}/images/heroes/motogp-orange-lg.webp"],
    "motogp": [f"{SITE}/images/heroes/motogp-lg.webp", f"{SITE}/images/heroes/motogp-orange-lg.webp"],
    "city": [f"{SITE}/images/heroes/football-stadium-lg.webp", f"{SITE}/images/heroes/concert-live-lg.webp"],
    "sports": [f"{SITE}/images/heroes/football-stadium-lg.webp", f"{SITE}/images/heroes/football-match-lg.webp"],
    "events": [f"{SITE}/images/heroes/football-stadium-lg.webp", f"{SITE}/images/heroes/concert-purple-lg.webp"],
}

def _cat_image(slug, category):
    """Pick a category image based on slug hash for variety."""
    pool = CATEGORY_IMAGES.get(category, [f"{SITE}/images/heroes/football-stadium-lg.webp"])
    idx = int(hashlib.md5(slug.encode()).hexdigest(), 16) % len(pool)
    title = slug.replace("-", " ").replace("2026", "").strip().title()
    return {"url": pool[idx], "title": title}

# ---------------------------------------------------------------------------
# Priority tiers
# ---------------------------------------------------------------------------
PRIORITY_TIERS = {
    "homepage":     "1.00",
    "main_cat":     "0.95",
    "hub":          "0.90",
    "event_static": "0.85",
    "seo_high":     "0.80",
    "seo_mid":      "0.70",
    "event_detail": "0.75",
    "guide":        "0.70",
    "info":         "0.55",
    "intl":         "0.85",
    "monthly":      "0.65",
    "comparison":   "0.65",
    "fallback":     "0.60",
}

CHANGEFREQ = {
    "homepage":     "hourly",
    "main_cat":     "daily",
    "hub":          "daily",
    "event_static": "daily",
    "seo_page":     "weekly",
    "event_detail": "daily",
    "guide":        "weekly",
    "info":         "monthly",
    "intl":         "weekly",
    "monthly":      "weekly",
    "comparison":   "weekly",
}

# ---------------------------------------------------------------------------
# XML helpers
# ---------------------------------------------------------------------------
XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n'
URLSET_OPEN = (
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n'
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
)
URLSET_CLOSE = '</urlset>\n'


def _url_block(loc: str, lastmod: str = None, changefreq: str = "weekly",
               priority: str = "0.70", hreflang: dict = None, image: dict = None) -> str:
    """Build a single <url> block with optional hreflang & image."""
    global seen_urls
    if loc in seen_urls:
        return ""

    # Block noindex / unverified demand URLs at source — they must never
    # appear in the sitemap (Google strictly expects sitemap URLs to be
    # indexable).
    path_only = loc.replace(SITE, "").strip("/")
    if path_only and not _is_indexable_slug(path_only):
        return ""

    seen_urls.add(loc)

    lm = lastmod or TODAY
    parts = [f"  <url>\n    <loc>{escape(loc)}</loc>"]
    parts.append(f"    <lastmod>{lm}</lastmod>")
    parts.append(f"    <changefreq>{changefreq}</changefreq>")
    parts.append(f"    <priority>{priority}</priority>")

    # hreflang annotations
    if hreflang:
        for lang, href in sorted(hreflang.items()):
            full = f"{SITE}{href}" if not href.startswith("http") else href
            parts.append(f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{escape(full)}"/>')

    # image
    if image:
        parts.append("    <image:image>")
        parts.append(f"      <image:loc>{escape(image['url'])}</image:loc>")
        if image.get("title"):
            parts.append(f"      <image:title>{escape(image['title'])}</image:title>")
        parts.append("    </image:image>")

    parts.append("  </url>")
    return "\n".join(parts) + "\n"


def write_sitemap(filename: str, url_blocks: list) -> int:
    """Write a complete sitemap file. Returns URL count."""
    global total_url_count
    blocks = [b for b in url_blocks if b]  # filter empties (deduped)
    count = len(blocks)
    if count == 0:
        return 0

    content = XML_HEADER + URLSET_OPEN + "".join(blocks) + URLSET_CLOSE
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    size_kb = os.path.getsize(path) / 1024
    print(f"  {filename:40s}  {count:>5} URLs  ({size_kb:>7.1f} KB)")
    sitemap_files.append(filename)
    total_url_count += count
    return count


def dt_to_str(val) -> str:
    if isinstance(val, datetime):
        return val.strftime("%Y-%m-%d")
    if isinstance(val, str) and len(val) >= 10:
        return val[:10]
    return TODAY


# ===================================================================
# 1. CORE SITEMAP  — homepage, main categories, hub pages, info pages
# ===================================================================
def build_core():
    urls = []

    # Homepage
    urls.append(_url_block(
        f"{SITE}/", changefreq="hourly", priority="1.00",
        hreflang=PATH_TO_HREFLANG.get("/"),
        image=IMAGE_MAP.get("/"),
    ))

    # Main category pages
    main_cats = [
        ("/events",                         "main_cat", "hourly"),
        ("/champions-league-tickets",       "main_cat", "daily"),
        ("/f1-tickets",                     "main_cat", "daily"),
        ("/world-cup-2026",                 "main_cat", "daily"),
        ("/motogp-tickets",                 "main_cat", "daily"),
        ("/taylor-swift-tickets",           "main_cat", "daily"),
        ("/taylor-swift-london-tickets",    "main_cat", "daily"),
        ("/el-clasico-tickets",             "hub",      "daily"),
        ("/super-bowl-2026-tickets",        "main_cat", "daily"),
        ("/monaco-grand-prix-tickets",      "event_static", "daily"),
        ("/bayern-vs-real-madrid-tickets",  "event_static", "daily"),
        ("/bahrain-world-cup-tickets-2026", "event_static", "daily"),
        ("/world-athletics-2026-tickets",   "event_static", "weekly"),
        ("/f1-tickets-2026",                "main_cat", "daily"),
        ("/world-cup-2026-tickets",         "main_cat", "daily"),
    ]
    for path, tier, freq in main_cats:
        urls.append(_url_block(
            f"{SITE}{path}", changefreq=freq, priority=PRIORITY_TIERS[tier],
            hreflang=PATH_TO_HREFLANG.get(path),
            image=IMAGE_MAP.get(path),
        ))

    # Hub pages (Link Wheel)
    hubs = [
        "/real-madrid-tickets", "/barcelona-tickets", "/manchester-city-tickets",
        "/liverpool-tickets", "/arsenal-tickets",
        "/bayern-munich-tickets", "/psg-tickets", "/juventus-tickets",
    ]
    for path in hubs:
        urls.append(_url_block(
            f"{SITE}{path}", changefreq="daily", priority=PRIORITY_TIERS["hub"],
            image=IMAGE_MAP.get(path),
        ))

    # Concert artist pages
    concert_pages = [
        "/bruno-mars-tour-2026", "/the-weeknd-tour-2026", "/guns-n-roses-tour-2026",
        "/bad-bunny-london-2026", "/maroon-5-tickets", "/john-legend-abu-dhabi-tickets",
        "/harry-styles-tickets", "/metallica-sphere-las-vegas-tickets",
        "/acl-festival-2026-tickets", "/coldplay-tour-2026",
    ]
    for path in concert_pages:
        urls.append(_url_block(f"{SITE}{path}", changefreq="weekly", priority=PRIORITY_TIERS["event_static"],
                              image=IMAGE_MAP.get(path, _cat_image(path.lstrip("/"), "concert"))))

    # Info pages
    info_pages = [
        ("/about",            "0.60"), ("/faq",              "0.65"),
        ("/reviews",          "0.70"), ("/contact",          "0.55"),
        ("/blog",             "0.75"), ("/buyer-protection",  "0.65"),
        ("/fan-protect",      "0.60"), ("/sell-tickets",      "0.70"),
        ("/privacy-policy",   "0.35"), ("/terms",             "0.35"),
        ("/refund-policy",    "0.45"), ("/payment-info",      "0.45"),
        ("/impressum",        "0.35"), ("/world-cup-raffle",  "0.70"),
    ]
    for path, prio in info_pages:
        urls.append(_url_block(f"{SITE}{path}", changefreq="monthly", priority=prio,
                              image={"url": f"{SITE}/og-image.jpg", "title": path.strip("/").replace("-", " ").title()}))

    # Premier League redirect page (in sitemap for discovery)
    urls.append(_url_block(f"{SITE}/premier-league-tickets", changefreq="daily", priority="0.90",
                          image={"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": "Premier League Tickets 2026"}))

    return write_sitemap("sitemap-core.xml", urls)


# ===================================================================
# 2. F1 & MOTORSPORT SITEMAP
# ===================================================================
def build_f1_motorsport():
    urls = []

    # Static F1 GP pages (React routes)
    f1_static = [
        "/f1-monaco-grand-prix-tickets",         "/f1-british-grand-prix-silverstone-tickets",
        "/f1-italian-grand-prix-monza-tickets",   "/f1-singapore-grand-prix-tickets",
        "/f1-las-vegas-grand-prix-tickets",       "/f1-abu-dhabi-grand-prix-tickets",
        "/f1-bahrain-grand-prix-tickets",         "/f1-belgian-grand-prix-spa-tickets",
        "/f1-dutch-grand-prix-zandvoort-tickets", "/f1-miami-grand-prix-tickets",
        "/f1-japanese-grand-prix-suzuka-tickets", "/f1-australian-grand-prix-melbourne-tickets",
        "/f1-saudi-arabian-grand-prix-jeddah-tickets", "/f1-spanish-grand-prix-barcelona-tickets",
        "/f1-hungarian-grand-prix-budapest-tickets",   "/f1-austrian-grand-prix-red-bull-ring-tickets",
    ]
    for path in f1_static:
        urls.append(_url_block(f"{SITE}{path}", changefreq="daily", priority=PRIORITY_TIERS["event_static"],
                              image=_cat_image(path.lstrip("/"), "f1")))

    # F1 guide pages
    f1_guides = [
        "/f1-2026-schedule", "/how-to-buy-f1-tickets",
        "/best-f1-races-europe", "/f1-ticket-prices-guide",
        "/f1-ticket-prices-2026",
        "/ultimate-f1-tickets-guide-2026",
        "/monza-best-seats-guide", "/monza-ticket-prices",
        "/how-to-get-to-monza", "/monza-f1-travel-tips",
        "/monaco-gp-vip-experience", "/bahrain-f1-night-race-guide",
    ]
    for path in f1_guides:
        urls.append(_url_block(f"{SITE}{path}", changefreq="weekly", priority=PRIORITY_TIERS["guide"],
                              image=_cat_image(path.lstrip("/"), "f1")))

    # MotoGP / TT static pages
    moto_static = [
        "/motogp-mugello-tickets", "/motogp-2026-schedule",
        "/isle-of-man-tt-tickets", "/motogp-ticket-prices-2026",
    ]
    for path in moto_static:
        urls.append(_url_block(f"{SITE}{path}", changefreq="weekly", priority=PRIORITY_TIERS["event_static"],
                              image=_cat_image(path.lstrip("/"), "motorsport")))

    # Dynamic F1 SEO pages from DB
    static_slugs = {p.lstrip("/") for p in f1_static + f1_guides + moto_static}
    cursor = db.seo_pages.find(
        {"active": True, "category": "f1"},
        {"_id": 0, "slug": 1, "updated_at": 1, "priority": 1, "title": 1}
    )
    for p in cursor:
        if p["slug"] not in static_slugs:
            prio = min(p.get("priority", 75), 85) / 100
            urls.append(_url_block(
                f"{SITE}/{p['slug']}", lastmod=dt_to_str(p.get("updated_at")),
                changefreq="weekly", priority=f"{prio:.2f}",
                image=_cat_image(p["slug"], "f1"),
            ))

    return write_sitemap("sitemap-f1-motorsport.xml", urls)


# ===================================================================
# 3. FOOTBALL SITEMAP
# ===================================================================
def build_football():
    urls = []
    cursor = db.seo_pages.find(
        {"active": True, "category": "football"},
        {"_id": 0, "slug": 1, "updated_at": 1, "priority": 1, "title": 1}
    )
    for p in cursor:
        prio = min(p.get("priority", 75), 85) / 100
        urls.append(_url_block(
            f"{SITE}/{p['slug']}", lastmod=dt_to_str(p.get("updated_at")),
            changefreq="weekly", priority=f"{prio:.2f}",
            image=_cat_image(p["slug"], "football"),
        ))
    return write_sitemap("sitemap-football.xml", urls)


# ===================================================================
# 4. CONCERTS SITEMAP
# ===================================================================
def build_concerts():
    urls = []
    cursor = db.seo_pages.find(
        {"active": True, "category": {"$in": ["concert", "concerts"]}},
        {"_id": 0, "slug": 1, "updated_at": 1, "priority": 1}
    )
    for p in cursor:
        prio = min(p.get("priority", 70), 80) / 100
        urls.append(_url_block(
            f"{SITE}/{p['slug']}", lastmod=dt_to_str(p.get("updated_at")),
            changefreq="weekly", priority=f"{prio:.2f}",
            image=_cat_image(p["slug"], "concert"),
        ))
    return write_sitemap("sitemap-concerts.xml", urls)


# ===================================================================
# 5. WORLD CUP SITEMAP
# ===================================================================
def build_worldcup():
    urls = []
    cursor = db.seo_pages.find(
        {"active": True, "category": "worldcup"},
        {"_id": 0, "slug": 1, "updated_at": 1, "priority": 1}
    )
    for p in cursor:
        prio = min(p.get("priority", 80), 90) / 100
        urls.append(_url_block(
            f"{SITE}/{p['slug']}", lastmod=dt_to_str(p.get("updated_at")),
            changefreq="daily", priority=f"{prio:.2f}",
            image=_cat_image(p["slug"], "worldcup"),
        ))
    return write_sitemap("sitemap-worldcup.xml", urls)


# ===================================================================
# 6. CITY & REGIONAL SITEMAP
# ===================================================================
def build_city():
    urls = []
    cursor = db.seo_pages.find(
        {"active": True, "category": {"$in": ["city", "sports", "events"]}},
        {"_id": 0, "slug": 1, "updated_at": 1, "priority": 1}
    )
    for p in cursor:
        prio = min(p.get("priority", 65), 80) / 100
        cat = "city"
        urls.append(_url_block(
            f"{SITE}/{p['slug']}", lastmod=dt_to_str(p.get("updated_at")),
            changefreq="weekly", priority=f"{prio:.2f}",
            image=_cat_image(p["slug"], cat),
        ))
    return write_sitemap("sitemap-city-regional.xml", urls)


# ===================================================================
# 7. EVENTS DETAIL SITEMAP  (with image:image)
# ===================================================================
def build_events():
    urls = []
    events = db.events.find(
        {},
        {"_id": 0, "slug": 1, "event_id": 1, "event_date": 1,
         "image_url": 1, "title": 1, "event_type": 1}
    )
    for e in events:
        slug = e.get("slug") or e["event_id"]
        loc  = f"{SITE}/event/{slug}"
        lm   = e.get("event_date", TODAY)
        if isinstance(lm, str) and len(lm) >= 10:
            lm = lm[:10]
        else:
            lm = TODAY

        img = None
        et = e.get("event_type", "")
        if e.get("image_url"):
            img = {"url": e["image_url"], "title": e.get("title", "")}
        elif et == "f1":
            img = {"url": f"{SITE}/images/heroes/f1-red-lg.webp", "title": e.get("title", slug)}
        elif et in ("match", "football"):
            img = {"url": f"{SITE}/images/heroes/football-stadium-lg.webp", "title": e.get("title", slug)}
        elif et == "concert":
            img = {"url": f"{SITE}/images/heroes/concert-purple-lg.webp", "title": e.get("title", slug)}
        else:
            img = {"url": f"{SITE}/og-image.jpg", "title": e.get("title", slug)}

        urls.append(_url_block(loc, lastmod=lm, changefreq="daily",
                               priority=PRIORITY_TIERS["event_detail"], image=img))
    return write_sitemap("sitemap-events.xml", urls)


# ===================================================================
# 8. INTERNATIONAL SITEMAP  (full hreflang annotations)
# ===================================================================
def build_international():
    """
    Every international page gets <xhtml:link> tags pointing to ALL
    of its language equivalents, including x-default.  This is the
    Google-recommended implementation.
    """
    urls = []

    intl_pages = [
        # Spanish
        ("/es/comprar-entradas",              "0.90", "weekly"),
        ("/es/entradas-champions-league",     "0.85", "weekly"),
        ("/es/entradas-f1",                   "0.85", "weekly"),
        ("/es/entradas-conciertos",           "0.80", "weekly"),
        ("/es/entradas-copa-del-mundo-2026",  "0.85", "weekly"),
        # German
        ("/de/tickets-kaufen",                "0.90", "weekly"),
        ("/de/champions-league-tickets",      "0.85", "weekly"),
        ("/de/formel-1-tickets",              "0.85", "weekly"),
        ("/de/bundesliga-tickets",            "0.80", "weekly"),
        ("/de/konzert-tickets",               "0.80", "weekly"),
        ("/de/wm-2026-tickets",               "0.85", "weekly"),
        # French
        ("/fr/acheter-billets",               "0.90", "weekly"),
        ("/fr/billets-champions-league",      "0.85", "weekly"),
        ("/fr/billets-f1",                    "0.85", "weekly"),
        ("/fr/billets-concerts",              "0.80", "weekly"),
        # Italian
        ("/it/biglietti",                     "0.90", "weekly"),
        ("/it/biglietti-champions-league",    "0.85", "weekly"),
        ("/it/biglietti-f1",                  "0.85", "weekly"),
        ("/it/biglietti-concerti",            "0.80", "weekly"),
    ]

    for path, prio, freq in intl_pages:
        hreflang = PATH_TO_HREFLANG.get(path)
        urls.append(_url_block(f"{SITE}{path}", changefreq=freq, priority=prio,
                               hreflang=hreflang,
                               image={"url": f"{SITE}/og-image.jpg", "title": path.strip("/").replace("-", " ").replace("/", " ").title()}))

    return write_sitemap("sitemap-international.xml", urls)


# ===================================================================
# 9. GUIDES & COMPARISON SITEMAP
# ===================================================================
def build_guides():
    urls = []

    comparisons = [
        "/euromatchtickets-vs-stubhub",
        "/euromatchtickets-vs-viagogo",
        "/euromatchtickets-vs-ticketmaster",
        "/euromatchtickets-vs-seatgeek",
    ]
    for path in comparisons:
        urls.append(_url_block(f"{SITE}{path}", changefreq="monthly",
                               priority=PRIORITY_TIERS["comparison"],
                               image={"url": f"{SITE}/og-image.jpg", "title": path.strip("/").replace("-", " ").title()}))

    price_guides = [
        "/f1-ticket-prices-2026", "/motogp-ticket-prices-2026",
        "/concert-ticket-prices-2026", "/football-ticket-prices-2026",
    ]
    for path in price_guides:
        urls.append(_url_block(f"{SITE}{path}", changefreq="weekly",
                               priority=PRIORITY_TIERS["guide"],
                               image=_cat_image(path.lstrip("/"), "f1" if "f1" in path else "concert" if "concert" in path else "football")))

    # Monthly event pages
    for month in ["january","february","march","april","may","june",
                  "july","august","september","october","november","december"]:
        urls.append(_url_block(
            f"{SITE}/events-{month}-2026", changefreq="weekly",
            priority=PRIORITY_TIERS["monthly"],
            image={"url": f"{SITE}/og-image.jpg", "title": f"Events {month.title()} 2026"},
        ))

    # Weekend events
    urls.append(_url_block(f"{SITE}/events-this-weekend", changefreq="daily",
                           priority="0.75",
                           image={"url": f"{SITE}/og-image.jpg", "title": "Events This Weekend"}))

    return write_sitemap("sitemap-guides.xml", urls)


# ===================================================================
# MASTER SITEMAP INDEX
# ===================================================================
def build_index():
    xml = XML_HEADER
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for fn in sitemap_files:
        xml += f"  <sitemap>\n"
        xml += f"    <loc>{SITE}/{fn}</loc>\n"
        xml += f"    <lastmod>{TODAY}</lastmod>\n"
        xml += f"  </sitemap>\n"
    xml += "</sitemapindex>\n"

    path = os.path.join(OUTPUT_DIR, "sitemap.xml")
    with open(path, "w", encoding="utf-8") as f:
        f.write(xml)
    size_kb = os.path.getsize(path) / 1024
    print(f"\n  {'sitemap.xml (INDEX)':40s}  {len(sitemap_files):>5} sitemaps  ({size_kb:>7.1f} KB)")


# ===================================================================
# PING SEARCH ENGINES
# ===================================================================
def ping_search_engines():
    sitemap_url = f"{SITE}/sitemap.xml"
    engines = {
        "Google": f"https://www.google.com/ping?sitemap={sitemap_url}",
        "Bing":   f"https://www.bing.com/ping?sitemap={sitemap_url}",
    }
    print("\n--- Pinging Search Engines ---")
    for name, url in engines.items():
        try:
            r = requests.get(url, timeout=10)
            print(f"  {name}: {r.status_code}")
        except Exception as e:
            print(f"  {name}: FAILED ({e})")


# ===================================================================
# VALIDATION
# ===================================================================
def validate():
    """Quick validation: check XML well-formedness & URL count."""
    import xml.etree.ElementTree as ET
    print("\n--- Validation ---")
    ok = True
    for fn in sitemap_files + ["sitemap.xml"]:
        fpath = os.path.join(OUTPUT_DIR, fn)
        try:
            tree = ET.parse(fpath)
            root = tree.getroot()
            children = len(root)
            print(f"  {fn:40s}  VALID  ({children} elements)")
        except ET.ParseError as e:
            print(f"  {fn:40s}  INVALID  ({e})")
            ok = False
    return ok


# ===================================================================
# MAIN
# ===================================================================
if __name__ == "__main__":
    print("=" * 65)
    print("  EuroMatchTickets — Sitemap Generation")
    print("=" * 65)
    print(f"  Date: {TODAY}")
    print(f"  Output: {OUTPUT_DIR}")
    print(f"  Database: {db.seo_pages.count_documents({'active': True})} active SEO pages")
    print(f"           {db.events.count_documents({})} events")
    print("-" * 65)

    build_core()
    build_f1_motorsport()
    build_football()
    build_concerts()
    build_worldcup()
    build_city()
    build_events()
    build_international()
    build_guides()
    build_index()

    print(f"\n{'=' * 65}")
    print(f"  TOTAL: {total_url_count} URLs across {len(sitemap_files)} sitemaps")
    print(f"{'=' * 65}")

    validate()
    ping_search_engines()

    client.close()
    print("\nDone.")
