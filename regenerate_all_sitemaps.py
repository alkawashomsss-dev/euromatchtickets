#!/usr/bin/env python3
"""Regenerate ALL static sitemaps including new pages"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["euromatchtickets"]

BASE = "https://euromatchtickets.com"
TODAY = datetime.now(timezone.utc).strftime('%Y-%m-%d')

def make_sitemap(urls):
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url, priority, freq in urls:
        xml += f'  <url>\n    <loc>{url}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{priority}</priority>\n  </url>\n'
    xml += '</urlset>'
    return xml

def make_index(sitemaps):
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for name in sitemaps:
        xml += f'  <sitemap>\n    <loc>{BASE}/{name}</loc>\n    <lastmod>{TODAY}</lastmod>\n  </sitemap>\n'
    xml += '</sitemapindex>'
    return xml

async def generate():
    pages = await db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1, "category": 1, "priority": 1}).to_list(5000)
    
    # Categorize pages
    cats = {
        'core': [], 'f1-motorsport': [], 'football': [], 'concerts': [],
        'worldcup': [], 'city-regional': [], 'events': [], 'guides': [],
        'international': []
    }
    
    for p in pages:
        slug = p['slug']
        cat = p.get('category', '')
        pri = min(p.get('priority', 70) / 100, 1.0)
        url = f"{BASE}/{slug}"
        
        # International pages
        if slug.startswith(('fr/', 'it/', 'es/', 'de/')):
            cats['international'].append((url, str(pri), 'weekly'))
        elif cat == 'f1':
            cats['f1-motorsport'].append((url, str(pri), 'weekly'))
        elif cat in ('football',):
            cats['football'].append((url, str(pri), 'weekly'))
        elif cat in ('concert', 'concerts'):
            cats['concerts'].append((url, str(pri), 'weekly'))
        elif cat == 'worldcup':
            cats['worldcup'].append((url, str(pri), 'weekly'))
        elif cat == 'city':
            cats['city-regional'].append((url, str(pri), 'weekly'))
        elif cat in ('sports', 'events'):
            cats['events'].append((url, str(pri), 'weekly'))
        else:
            cats['events'].append((url, str(pri), 'weekly'))
    
    # Add core static pages
    cats['core'].extend([
        (f"{BASE}/", "1.0", "daily"),
        (f"{BASE}/events", "0.9", "daily"),
        (f"{BASE}/blog", "0.8", "weekly"),
        (f"{BASE}/f1-tickets", "0.95", "daily"),
        (f"{BASE}/champions-league-tickets", "0.95", "daily"),
        (f"{BASE}/taylor-swift-tickets", "0.9", "daily"),
        (f"{BASE}/world-cup-2026", "0.95", "daily"),
        (f"{BASE}/real-madrid-tickets", "0.9", "daily"),
        (f"{BASE}/barcelona-tickets", "0.9", "daily"),
    ])
    
    # Add guide pages to guides
    guide_slugs = [p for p in pages if 'how-to' in p['slug'] or 'cheapest' in p['slug'] or 'guide' in p['slug']]
    for p in guide_slugs:
        url = f"{BASE}/{p['slug']}"
        # Remove from events if already there
        cats['events'] = [(u, pr, f) for u, pr, f in cats['events'] if u != url]
        cats['guides'].append((url, str(min(p.get('priority', 70) / 100, 1.0)), 'weekly'))
    
    # Remove duplicates from core pages that might be in other categories
    core_urls = {u for u, _, _ in cats['core']}
    for cat in cats:
        if cat != 'core':
            cats[cat] = [(u, p, f) for u, p, f in cats[cat] if u not in core_urls]
    
    # Write sitemaps
    sitemap_files = []
    total_urls = 0
    for name, urls in cats.items():
        if not urls:
            continue
        # Deduplicate
        seen = set()
        unique_urls = []
        for u in urls:
            if u[0] not in seen:
                seen.add(u[0])
                unique_urls.append(u)
        
        fname = f"sitemap-{name}.xml"
        filepath = f"/app/frontend/public/{fname}"
        with open(filepath, 'w') as f:
            f.write(make_sitemap(unique_urls))
        sitemap_files.append(fname)
        total_urls += len(unique_urls)
        print(f"  {fname}: {len(unique_urls)} URLs")
    
    # Write sitemap index
    with open("/app/frontend/public/sitemap.xml", 'w') as f:
        f.write(make_index(sitemap_files))
    
    print(f"\n=== Total: {total_urls} URLs across {len(sitemap_files)} sitemaps ===")
    print(f"Sitemap index: sitemap.xml ({len(sitemap_files)} sitemaps)")

asyncio.run(generate())
