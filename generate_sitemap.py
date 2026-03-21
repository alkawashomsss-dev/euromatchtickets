"""
Generate static sitemap.xml files in frontend/public/ 
so they work on ANY production deployment without API routing.
"""
from pymongo import MongoClient
from datetime import datetime, timezone
import os

client = MongoClient('mongodb://localhost:27017')
db = client['euromatchtickets']

BASE_URL = "https://euromatchtickets.com"
PUBLIC_DIR = "/app/frontend/public"
today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

# Collect ALL URLs
urls = []

# 1. Static pages
static_pages = [
    ("/", "1.0", "daily"), ("/events", "0.9", "hourly"), ("/blog", "0.8", "daily"),
    ("/world-cup-2026", "0.95", "daily"), ("/f1-tickets", "0.95", "daily"),
    ("/champions-league-tickets", "0.95", "daily"), ("/motogp-tickets", "0.9", "daily"),
    ("/super-bowl-2026-tickets", "0.95", "daily"),
    ("/taylor-swift-wembley-2026-tickets", "0.95", "daily"),
    ("/taylor-swift-london-tickets", "0.95", "daily"),
    ("/bayern-vs-real-madrid-tickets", "0.95", "daily"),
    ("/bahrain-world-cup-tickets-2026", "0.95", "daily"),
    ("/world-athletics-2026-tickets", "0.90", "daily"),
    ("/el-clasico-tickets", "0.90", "daily"),
    ("/monaco-grand-prix-tickets", "0.90", "daily"),
    ("/f1-bahrain-grand-prix-tickets", "0.95", "daily"),
    ("/f1-tickets-2026", "0.95", "daily"),
    ("/f1-schedule-2026", "0.90", "daily"),
    ("/football-tickets", "0.90", "daily"),
    ("/concerts", "0.90", "daily"),
    ("/sell-tickets", "0.80", "daily"),
    ("/reviews", "0.7", "weekly"), ("/faq", "0.7", "monthly"),
    ("/about", "0.6", "monthly"), ("/contact", "0.6", "monthly"),
    ("/buyer-protection", "0.7", "monthly"), ("/terms", "0.5", "monthly"),
    # Spanish
    ("/es/comprar-entradas", "0.90", "weekly"),
    ("/es/entradas-champions-league", "0.85", "weekly"),
    ("/es/entradas-f1", "0.85", "weekly"),
    ("/es/entradas-conciertos", "0.85", "weekly"),
    ("/es/entradas-copa-del-mundo-2026", "0.90", "weekly"),
    # German
    ("/de/tickets-kaufen", "0.90", "weekly"),
    ("/de/champions-league-tickets", "0.85", "weekly"),
    ("/de/formel-1-tickets", "0.85", "weekly"),
    ("/de/bundesliga-tickets", "0.85", "weekly"),
    ("/de/konzert-tickets", "0.85", "weekly"),
    ("/de/wm-2026-tickets", "0.90", "weekly"),
]

for path, prio, freq in static_pages:
    urls.append({"loc": f"{BASE_URL}{path}", "lastmod": today, "changefreq": freq, "priority": prio})

# 2. Active SEO pages only
seo_pages = list(db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1, "priority": 1}))
for p in seo_pages:
    urls.append({
        "loc": f"{BASE_URL}/{p['slug']}",
        "lastmod": today,
        "changefreq": "weekly",
        "priority": str(p.get("priority", 80) / 100) if p.get("priority", 0) > 1 else str(p.get("priority", 0.80))
    })

# 3. Events
events = list(db.events.find(
    {"event_date": {"$gte": today}},
    {"_id": 0, "event_id": 1, "slug": 1}
))
for e in events:
    slug = e.get("slug", e["event_id"])
    urls.append({"loc": f"{BASE_URL}/event/{slug}", "lastmod": today, "changefreq": "daily", "priority": "0.85"})

# 4. Blog articles
articles = list(db.articles.find({}, {"_id": 0, "slug": 1}))
for a in articles:
    urls.append({"loc": f"{BASE_URL}/blog/{a['slug']}", "lastmod": today, "changefreq": "monthly", "priority": "0.70"})

print(f"Total URLs: {len(urls)}")

# Generate sitemap.xml
xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
for u in urls:
    xml_lines.append(f'  <url>')
    xml_lines.append(f'    <loc>{u["loc"]}</loc>')
    xml_lines.append(f'    <lastmod>{u["lastmod"]}</lastmod>')
    xml_lines.append(f'    <changefreq>{u["changefreq"]}</changefreq>')
    xml_lines.append(f'    <priority>{u["priority"]}</priority>')
    xml_lines.append(f'  </url>')
xml_lines.append('</urlset>')

sitemap_content = '\n'.join(xml_lines)

# Write to public/sitemap.xml
with open(f"{PUBLIC_DIR}/sitemap.xml", "w") as f:
    f.write(sitemap_content)
print(f"Written: public/sitemap.xml ({len(urls)} URLs)")

# Also write as sitemap-index.xml for backwards compatibility
with open(f"{PUBLIC_DIR}/sitemap-index.xml", "w") as f:
    f.write(sitemap_content)
print(f"Written: public/sitemap-index.xml ({len(urls)} URLs)")

# Update robots.txt
robots = f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /owner
Disallow: /seller
Disallow: /api/
Disallow: /auth/
Disallow: /marketing

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

Sitemap: {BASE_URL}/sitemap.xml
"""

with open(f"{PUBLIC_DIR}/robots.txt", "w") as f:
    f.write(robots)
print("Updated: public/robots.txt")

print(f"\nDone! Sitemap with {len(urls)} URLs ready for Google & Bing")
