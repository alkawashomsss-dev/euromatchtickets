"""
Regenerate ALL static sitemaps from MongoDB.

Writes XML files directly to /app/frontend/public/:
  • sitemap.xml           (index of all sitemaps)
  • sitemap-core.xml      (home, about, FAQ, guides, comparisons)
  • sitemap-events.xml    (every event: 259+ URLs, absolute image URLs)
  • sitemap-worldcup.xml  (all 104 FIFA World Cup 2026 matches)
  • sitemap-f1-motorsport.xml  (F1, MotoGP, Isle of Man TT)
  • sitemap-football.xml  (Premier League, Bundesliga, La Liga, UCL matches)
  • sitemap-concerts.xml  (all concerts, festivals)

Run:  cd /app/backend && python3 seed_sitemaps.py
"""
import os
import pathlib
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

SITE = "https://euromatchtickets.com"
PUBLIC = pathlib.Path("/app/frontend/public")
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")


def xml_header():
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
    )


def abs_img(path: str) -> str:
    if not path:
        return f"{SITE}/og-image.jpg"
    return path if path.startswith("http") else f"{SITE}{path}"


def url_entry(loc, lastmod, changefreq, priority, img_url, img_title):
    return (
        "  <url>\n"
        f"    <loc>{loc}</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority:.2f}</priority>\n"
        "    <image:image>\n"
        f"      <image:loc>{img_url}</image:loc>\n"
        f"      <image:title>{xml_escape(img_title)}</image:title>\n"
        "    </image:image>\n"
        "  </url>\n"
    )


def xml_escape(s: str) -> str:
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;")


# ─────────────────────────────────────────────────────────────
# 1. EVENTS SITEMAP (ALL 259 events)
# ─────────────────────────────────────────────────────────────
def build_events_sitemap():
    xml = xml_header()
    events = list(db.events.find(
        {},
        {"_id": 0, "event_id": 1, "slug": 1, "title": 1, "event_type": 1, "image_url": 1, "event_date": 1}
    ))
    for e in events:
        slug = e.get("slug") or e["event_id"]
        loc = f"{SITE}/event/{slug}"
        ed = e.get("event_date")
        lastmod = ed.strftime("%Y-%m-%d") if isinstance(ed, datetime) else TODAY
        img = abs_img(e.get("image_url"))
        title = e.get("title", "Tickets")
        xml += url_entry(loc, lastmod, "daily", 0.85, img, f"{title} Tickets")
    xml += "</urlset>\n"
    (PUBLIC / "sitemap-events.xml").write_text(xml)
    return len(events)


# ─────────────────────────────────────────────────────────────
# 2. WORLD CUP SITEMAP — 104 matches + landing pages
# ─────────────────────────────────────────────────────────────
def build_worldcup_sitemap():
    xml = xml_header()
    # Landing pages first
    landing = [
        ("/world-cup-2026-tickets", 1.0, "daily"),
        ("/world-cup-2026", 0.95, "daily"),
        ("/world-cup-2026-schedule", 0.9, "weekly"),
        ("/world-cup-2026-final-tickets", 0.95, "daily"),
        ("/world-cup-2026-venues", 0.9, "weekly"),
        ("/world-cup-2026-group-stage", 0.85, "weekly"),
        ("/world-cup-2026-knockout-stage", 0.85, "weekly"),
        # Host-city landing pages (major demand clusters)
        ("/world-cup-2026-new-york-new-jersey-tickets", 0.92, "daily"),
        ("/world-cup-2026-los-angeles-tickets", 0.92, "daily"),
        ("/world-cup-2026-miami-tickets", 0.90, "daily"),
        ("/world-cup-2026-dallas-tickets", 0.90, "daily"),
        ("/world-cup-2026-mexico-city-tickets", 0.90, "daily"),
        ("/world-cup-2026-toronto-tickets", 0.88, "daily"),
        ("/world-cup-2026-vancouver-tickets", 0.88, "daily"),
    ]
    wc_hero = f"{SITE}/images/heroes/worldcup-trophy-lg.webp"
    for path, prio, freq in landing:
        xml += url_entry(
            f"{SITE}{path}", TODAY, freq, prio, wc_hero,
            path.strip("/").replace("-", " ").title(),
        )

    # Every one of the 104 match pages
    matches = list(db.events.find(
        {"event_type": "worldcup"},
        {"_id": 0, "slug": 1, "event_id": 1, "title": 1, "image_url": 1, "event_date": 1, "venue": 1}
    ).sort("match_number", 1))
    for m in matches:
        slug = m.get("slug") or m["event_id"]
        loc = f"{SITE}/event/{slug}"
        ed = m.get("event_date")
        lastmod = ed.strftime("%Y-%m-%d") if isinstance(ed, datetime) else TODAY
        img = abs_img(m.get("image_url"))
        title = m.get("title", "FIFA World Cup 2026")
        xml += url_entry(loc, lastmod, "daily", 0.90, img, f"{title} - {m.get('venue','')}")
    xml += "</urlset>\n"
    (PUBLIC / "sitemap-worldcup.xml").write_text(xml)
    return len(landing) + len(matches)


# ─────────────────────────────────────────────────────────────
# 3. F1 / MOTORSPORT SITEMAP
# ─────────────────────────────────────────────────────────────
def build_f1_sitemap():
    xml = xml_header()
    landing = [
        ("/f1-tickets", 1.0, "daily"),
        ("/f1-tickets-2026", 0.95, "daily"),
        ("/f1-2026-schedule", 0.90, "weekly"),
        ("/f1-ticket-prices-2026", 0.85, "weekly"),
        ("/f1-ticket-prices-guide", 0.80, "weekly"),
        ("/how-to-buy-f1-tickets", 0.75, "monthly"),
        ("/best-f1-races-europe", 0.75, "monthly"),
        ("/motogp-tickets", 0.92, "daily"),
        ("/motogp-2026-schedule", 0.88, "weekly"),
        ("/isle-of-man-tt-tickets", 0.85, "weekly"),
        # Each GP landing
        ("/f1-monaco-grand-prix-tickets", 0.95, "daily"),
        ("/f1-british-grand-prix-silverstone-tickets", 0.95, "daily"),
        ("/f1-belgian-grand-prix-spa-tickets", 0.95, "daily"),
        ("/f1-italian-grand-prix-monza-tickets", 0.95, "daily"),
        ("/f1-singapore-grand-prix-tickets", 0.92, "daily"),
        ("/f1-las-vegas-grand-prix-tickets", 0.92, "daily"),
        ("/f1-miami-grand-prix-tickets", 0.92, "daily"),
        ("/f1-abu-dhabi-grand-prix-tickets", 0.90, "daily"),
        ("/f1-dutch-grand-prix-zandvoort-tickets", 0.90, "daily"),
        ("/f1-japanese-grand-prix-suzuka-tickets", 0.90, "daily"),
        ("/f1-australian-grand-prix-melbourne-tickets", 0.90, "daily"),
        ("/f1-bahrain-grand-prix-tickets", 0.90, "daily"),
        ("/f1-saudi-arabian-grand-prix-jeddah-tickets", 0.88, "daily"),
        ("/f1-spanish-grand-prix-barcelona-tickets", 0.88, "daily"),
        ("/f1-hungarian-grand-prix-budapest-tickets", 0.88, "daily"),
        ("/f1-austrian-grand-prix-red-bull-ring-tickets", 0.88, "daily"),
    ]
    f1_hero = f"{SITE}/images/heroes/f1-red-lg.webp"
    for path, prio, freq in landing:
        xml += url_entry(f"{SITE}{path}", TODAY, freq, prio, f1_hero, path.strip("/").replace("-", " ").title())

    # Every motorsport event
    events = list(db.events.find(
        {"event_type": {"$in": ["f1", "motogp", "isle_of_man_tt"]}},
        {"_id": 0, "slug": 1, "event_id": 1, "title": 1, "image_url": 1, "event_date": 1, "venue": 1}
    ).sort("event_date", 1))
    for e in events:
        slug = e.get("slug") or e["event_id"]
        loc = f"{SITE}/event/{slug}"
        ed = e.get("event_date")
        lastmod = ed.strftime("%Y-%m-%d") if isinstance(ed, datetime) else TODAY
        xml += url_entry(loc, lastmod, "daily", 0.88, abs_img(e.get("image_url")), f"{e.get('title','')} Tickets")
    xml += "</urlset>\n"
    (PUBLIC / "sitemap-f1-motorsport.xml").write_text(xml)
    return len(landing) + len(events)


# ─────────────────────────────────────────────────────────────
# 4. FOOTBALL SITEMAP (UCL, leagues, matches)
# ─────────────────────────────────────────────────────────────
def build_football_sitemap():
    xml = xml_header()
    landing = [
        ("/champions-league-tickets", 1.0, "daily"),
        ("/champions-league-2026-final-tickets", 0.95, "daily"),
        ("/el-clasico-tickets", 0.95, "weekly"),
        ("/bayern-vs-real-madrid-tickets", 0.92, "weekly"),
        ("/football-ticket-prices-2026", 0.85, "weekly"),
        ("/premier-league-tickets-2026", 0.90, "daily"),
        ("/bundesliga-tickets-2026", 0.88, "daily"),
        ("/la-liga-tickets-2026", 0.88, "daily"),
        ("/serie-a-tickets-2026", 0.85, "daily"),
        ("/ligue-1-tickets-2026", 0.85, "daily"),
        ("/team/real-madrid", 0.85, "weekly"),
        ("/team/barcelona", 0.85, "weekly"),
        ("/team/bayern-munich", 0.85, "weekly"),
        ("/team/manchester-city", 0.85, "weekly"),
        ("/team/liverpool", 0.85, "weekly"),
        ("/team/arsenal", 0.85, "weekly"),
        ("/team/psg", 0.85, "weekly"),
        ("/team/juventus", 0.85, "weekly"),
    ]
    hero = f"{SITE}/images/heroes/football-stadium-lg.webp"
    for path, prio, freq in landing:
        xml += url_entry(f"{SITE}{path}", TODAY, freq, prio, hero, path.strip("/").replace("-", " ").title())

    events = list(db.events.find(
        {"event_type": {"$in": ["match", "football"]}},
        {"_id": 0, "slug": 1, "event_id": 1, "title": 1, "image_url": 1, "event_date": 1}
    ).sort("event_date", 1))
    for e in events:
        slug = e.get("slug") or e["event_id"]
        loc = f"{SITE}/event/{slug}"
        ed = e.get("event_date")
        lastmod = ed.strftime("%Y-%m-%d") if isinstance(ed, datetime) else TODAY
        xml += url_entry(loc, lastmod, "daily", 0.85, abs_img(e.get("image_url")), f"{e.get('title','')} Tickets")
    xml += "</urlset>\n"
    (PUBLIC / "sitemap-football.xml").write_text(xml)
    return len(landing) + len(events)


# ─────────────────────────────────────────────────────────────
# 5. CONCERTS / FESTIVALS SITEMAP
# ─────────────────────────────────────────────────────────────
def build_concerts_sitemap():
    xml = xml_header()
    landing = [
        ("/concerts-in-london-2026", 1.0, "daily"),
        ("/concerts-in-amsterdam-2026", 0.90, "daily"),
        ("/concerts-in-paris-2026", 0.90, "daily"),
        ("/concerts-in-berlin-2026", 0.88, "daily"),
        ("/concerts-in-madrid-2026", 0.88, "daily"),
        ("/concert-ticket-prices-2026", 0.85, "weekly"),
        ("/taylor-swift-london-tickets", 0.95, "daily"),
        ("/coldplay-tour-2026", 0.92, "daily"),
        ("/the-weeknd-tour-2026", 0.90, "daily"),
        ("/bruno-mars-tour-2026", 0.90, "daily"),
        ("/guns-n-roses-tour-2026", 0.88, "daily"),
        ("/bad-bunny-london-2026", 0.88, "daily"),
        ("/harry-styles-tickets", 0.88, "daily"),
        ("/maroon-5-tour-2026", 0.85, "daily"),
        ("/metallica-sphere-las-vegas-tickets", 0.88, "daily"),
        ("/acl-festival-2026", 0.82, "weekly"),
        ("/john-legend-tour-2026", 0.82, "daily"),
    ]
    hero = f"{SITE}/images/heroes/concert-purple-lg.webp"
    for path, prio, freq in landing:
        xml += url_entry(f"{SITE}{path}", TODAY, freq, prio, hero, path.strip("/").replace("-", " ").title())

    events = list(db.events.find(
        {"event_type": {"$in": ["concert", "festival"]}},
        {"_id": 0, "slug": 1, "event_id": 1, "title": 1, "image_url": 1, "event_date": 1}
    ).sort("event_date", 1))
    for e in events:
        slug = e.get("slug") or e["event_id"]
        loc = f"{SITE}/event/{slug}"
        ed = e.get("event_date")
        lastmod = ed.strftime("%Y-%m-%d") if isinstance(ed, datetime) else TODAY
        xml += url_entry(loc, lastmod, "daily", 0.85, abs_img(e.get("image_url")), f"{e.get('title','')} Tickets")
    xml += "</urlset>\n"
    (PUBLIC / "sitemap-concerts.xml").write_text(xml)
    return len(landing) + len(events)


# ─────────────────────────────────────────────────────────────
# 6. CORE / STATIC PAGES SITEMAP
# ─────────────────────────────────────────────────────────────
def build_core_sitemap():
    xml = xml_header()
    core = [
        ("/", 1.0, "hourly"),
        ("/events", 0.95, "hourly"),
        ("/blog", 0.80, "daily"),
        ("/about", 0.60, "monthly"),
        ("/contact", 0.60, "monthly"),
        ("/faq", 0.75, "monthly"),
        ("/reviews", 0.75, "weekly"),
        ("/buyer-protection", 0.70, "monthly"),
        ("/fan-protect", 0.65, "monthly"),
        ("/sell", 0.80, "monthly"),
        ("/terms", 0.50, "monthly"),
        ("/privacy-policy", 0.50, "monthly"),
        ("/refund-policy", 0.50, "monthly"),
        ("/payment-info", 0.55, "monthly"),
        ("/impressum", 0.40, "monthly"),
        # Monthly event landing
        ("/events-this-weekend", 0.85, "daily"),
        ("/events-january-2026", 0.70, "monthly"),
        ("/events-february-2026", 0.70, "monthly"),
        ("/events-march-2026", 0.75, "monthly"),
        ("/events-april-2026", 0.75, "monthly"),
        ("/events-may-2026", 0.75, "monthly"),
        ("/events-june-2026", 0.80, "monthly"),  # WC month
        ("/events-july-2026", 0.80, "monthly"),  # WC month
        ("/events-august-2026", 0.75, "monthly"),
        ("/events-september-2026", 0.70, "monthly"),
        ("/events-october-2026", 0.70, "monthly"),
        ("/events-november-2026", 0.70, "monthly"),
        ("/events-december-2026", 0.70, "monthly"),
        # Comparisons (competitor intercept)
        ("/euromatchtickets-vs-viagogo", 0.80, "monthly"),
        ("/euromatchtickets-vs-stubhub", 0.80, "monthly"),
        ("/euromatchtickets-vs-ticketmaster", 0.80, "monthly"),
        ("/euromatchtickets-vs-seatgeek", 0.80, "monthly"),
    ]
    default_img = f"{SITE}/og-image.jpg"
    for path, prio, freq in core:
        xml += url_entry(f"{SITE}{path}", TODAY, freq, prio, default_img, path.strip("/").replace("-", " ").title() or "EuroMatchTickets")
    xml += "</urlset>\n"
    (PUBLIC / "sitemap-core.xml").write_text(xml)
    return len(core)


# ─────────────────────────────────────────────────────────────
# 7. SITEMAP INDEX
# ─────────────────────────────────────────────────────────────
def build_sitemap_index():
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    )
    for name in (
        "sitemap-core.xml",
        "sitemap-f1-motorsport.xml",
        "sitemap-football.xml",
        "sitemap-concerts.xml",
        "sitemap-worldcup.xml",
        "sitemap-events.xml",
        "sitemap-city-regional.xml",
        "sitemap-international.xml",
        "sitemap-guides.xml",
    ):
        xml += f"  <sitemap>\n    <loc>{SITE}/{name}</loc>\n    <lastmod>{TODAY}</lastmod>\n  </sitemap>\n"
    xml += "</sitemapindex>\n"
    (PUBLIC / "sitemap.xml").write_text(xml)


def main():
    print("Regenerating sitemaps from MongoDB…\n")
    print(f"  sitemap-events.xml    → {build_events_sitemap()} URLs")
    print(f"  sitemap-worldcup.xml  → {build_worldcup_sitemap()} URLs")
    print(f"  sitemap-f1-motorsport.xml → {build_f1_sitemap()} URLs")
    print(f"  sitemap-football.xml  → {build_football_sitemap()} URLs")
    print(f"  sitemap-concerts.xml  → {build_concerts_sitemap()} URLs")
    print(f"  sitemap-core.xml      → {build_core_sitemap()} URLs")
    build_sitemap_index()
    print("  sitemap.xml (index)   → written\n")
    print("✅ All sitemaps regenerated. Every event now has an absolute image URL.")


if __name__ == "__main__":
    main()
