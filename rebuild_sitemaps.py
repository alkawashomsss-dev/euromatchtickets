"""
Regenerate ALL static sitemap files with the latest pages from the database
"""
import pymongo
import os
from datetime import datetime, timezone

client = pymongo.MongoClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME', 'euromatchtickets')]

SITE = "https://euromatchtickets.com"
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")
PUBLIC = "/app/frontend/public"

def xml_header():
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

def xml_url(loc, priority="0.8", changefreq="weekly"):
    return f'  <url>\n    <loc>{loc}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>{changefreq}</changefreq>\n    <priority>{priority}</priority>\n  </url>\n'

def xml_footer():
    return '</urlset>\n'

# ── Core pages (static routes) ──
core_urls = [
    (f"{SITE}/", "1.0", "daily"),
    (f"{SITE}/events", "0.9", "hourly"),
    (f"{SITE}/blog", "0.8", "daily"),
    (f"{SITE}/world-cup-2026", "0.95", "daily"),
    (f"{SITE}/f1-tickets", "0.95", "daily"),
    (f"{SITE}/champions-league-tickets", "0.9", "daily"),
    (f"{SITE}/about", "0.5", "monthly"),
    (f"{SITE}/contact", "0.5", "monthly"),
    (f"{SITE}/terms", "0.3", "monthly"),
    (f"{SITE}/privacy-policy", "0.3", "monthly"),
    (f"{SITE}/refund-policy", "0.4", "monthly"),
    (f"{SITE}/buyer-protection", "0.6", "monthly"),
    (f"{SITE}/faq", "0.6", "weekly"),
    (f"{SITE}/reviews", "0.7", "weekly"),
    (f"{SITE}/payment-info", "0.4", "monthly"),
    (f"{SITE}/impressum", "0.3", "monthly"),
    (f"{SITE}/es/comprar-entradas", "0.8", "weekly"),
    (f"{SITE}/de/tickets-kaufen", "0.8", "weekly"),
]

# ── Build sitemaps by category ──
all_pages = list(db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1, "category": 1, "priority": 1, "page_type": 1}))

categories = {
    "f1": [],
    "football": [],
    "concert": [],
    "worldcup": [],
    "city": [],
    "guide": [],
    "other": [],
}

for p in all_pages:
    cat = p.get("category", "other")
    if cat in categories:
        categories[cat].append(p)
    else:
        categories["other"].append(p)

sitemap_files = {}

# Core sitemap
content = xml_header()
for url, pri, freq in core_urls:
    content += xml_url(url, pri, freq)
content += xml_footer()
sitemap_files["sitemap-core.xml"] = content

# Category sitemaps
cat_map = {
    "f1": "sitemap-f1-motorsport.xml",
    "football": "sitemap-football.xml",
    "concert": "sitemap-concerts.xml",
    "worldcup": "sitemap-worldcup.xml",
    "city": "sitemap-city-regional.xml",
    "guide": "sitemap-guides.xml",
    "other": "sitemap-other.xml",
}

for cat, filename in cat_map.items():
    pages = categories.get(cat, [])
    if not pages:
        continue
    content = xml_header()
    for p in pages:
        pri = str(min(p.get("priority", 80), 100) / 100)
        content += xml_url(f"{SITE}/{p['slug']}", pri, "weekly")
    content += xml_footer()
    sitemap_files[filename] = content

# Events sitemap (from events collection)
events = list(db.events.find({}, {"_id": 0, "event_id": 1}))
content = xml_header()
for e in events:
    content += xml_url(f"{SITE}/event/{e['event_id']}", "0.7", "daily")
content += xml_footer()
sitemap_files["sitemap-events.xml"] = content

# International sitemap
content = xml_header()
content += xml_url(f"{SITE}/es/comprar-entradas", "0.8", "weekly")
content += xml_url(f"{SITE}/de/tickets-kaufen", "0.8", "weekly")
content += xml_footer()
sitemap_files["sitemap-international.xml"] = content

# Write all sitemaps
total_urls = 0
for filename, content in sitemap_files.items():
    filepath = os.path.join(PUBLIC, filename)
    with open(filepath, 'w') as f:
        f.write(content)
    url_count = content.count('<url>')
    total_urls += url_count
    print(f"  {filename}: {url_count} URLs")

# Write sitemap index
index_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
index_content += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for filename in sorted(sitemap_files.keys()):
    index_content += f'  <sitemap>\n    <loc>{SITE}/{filename}</loc>\n    <lastmod>{TODAY}</lastmod>\n  </sitemap>\n'
index_content += '</sitemapindex>\n'

with open(os.path.join(PUBLIC, "sitemap.xml"), 'w') as f:
    f.write(index_content)

print(f"\nSitemap index: {len(sitemap_files)} child sitemaps")
print(f"Total URLs across all sitemaps: {total_urls}")
print("DONE!")
