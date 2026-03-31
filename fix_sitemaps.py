"""
Fix all sitemaps: 
1. Remove 2027 pages completely
2. Set all 2026 pages to priority 0.85
3. Add new keyword-optimized pages
4. Remove priority=0.00 pages or fix their priority
"""
import re
import os
from datetime import datetime

SITEMAP_DIR = "/app/frontend/public"
TODAY = datetime.now().strftime("%Y-%m-%d")
BASE = "https://euromatchtickets.com"

# New keyword-optimized pages to add to sitemaps
NEW_F1_PAGES = [
    "monza-f1-tickets",
    "italian-grand-prix-tickets", 
    "italy-f1-tickets",
    "bahrain-gp-tickets",
    "f1-tickets-bahrain",
    "belgian-grand-prix-tickets",
    "spa-francorchamps-tickets",
    "f1-2026-tickets",
]

NEW_CONCERT_PAGES = [
    "taylor-swift-tickets-2026",
]

NEW_FOOTBALL_PAGES = [
    "champions-league-knockout-stage-tickets",
]

NEW_MOTORSPORT_PAGES = [
    "motogp-tickets-2026",
]

def make_url_entry(slug, priority="0.85", changefreq="daily"):
    return f"""  <url>
    <loc>{BASE}/{slug}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>"""

def fix_sitemap(filename):
    filepath = os.path.join(SITEMAP_DIR, filename)
    if not os.path.exists(filepath):
        return
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Parse all URL entries
    url_pattern = re.compile(r'<url>\s*<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>\s*<changefreq>(.*?)</changefreq>\s*<priority>(.*?)</priority>\s*</url>', re.DOTALL)
    
    urls_to_keep = []
    removed_2027 = 0
    fixed_priority = 0
    
    for match in url_pattern.finditer(content):
        loc, lastmod, changefreq, priority = match.groups()
        slug = loc.replace(BASE + "/", "")
        
        # Remove 2027 pages entirely
        if "2027" in slug:
            removed_2027 += 1
            continue
        
        # Fix priority for ALL 2026 pages
        if priority == "0.00":
            if "general-admission" in slug or "grandstand" in slug or "premium" in slug or "vip-hospitality" in slug or "paddock-club" in slug or "grid-walk" in slug:
                priority = "0.75"  # Sub-category pages
            else:
                priority = "0.85"  # Main pages
            fixed_priority += 1
        
        # Update lastmod to today
        urls_to_keep.append(make_url_entry(slug, priority, "daily"))
    
    # Add existing URLs as set to avoid duplicates
    existing_slugs = set()
    for match in url_pattern.finditer(content):
        loc = match.group(1)
        existing_slugs.add(loc.replace(BASE + "/", ""))
    
    # Add new pages based on sitemap type
    new_pages = []
    if "f1-motorsport" in filename:
        new_pages = NEW_F1_PAGES + NEW_MOTORSPORT_PAGES
    elif "concerts" in filename:
        new_pages = NEW_CONCERT_PAGES
    elif "football" in filename:
        new_pages = NEW_FOOTBALL_PAGES
    
    added = 0
    for slug in new_pages:
        if slug not in existing_slugs:
            urls_to_keep.append(make_url_entry(slug, "0.90", "daily"))
            added += 1
    
    # Rebuild sitemap
    header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    footer = '</urlset>'
    
    new_content = header + "\n" + "\n".join(urls_to_keep) + "\n" + footer
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    # Also update the build version
    build_path = filepath.replace("/public/", "/build/")
    if os.path.exists(os.path.dirname(build_path)):
        with open(build_path, 'w') as f:
            f.write(new_content)
    
    print(f"{filename}: {len(urls_to_keep)} URLs kept, {removed_2027} 2027-removed, {fixed_priority} priorities-fixed, {added} new-added")

# Fix all sitemaps
for filename in [
    "sitemap-f1-motorsport.xml",
    "sitemap-football.xml", 
    "sitemap-concerts.xml",
    "sitemap-city-regional.xml",
    "sitemap-events.xml",
    "sitemap-worldcup.xml",
    "sitemap-guides.xml",
    "sitemap-international.xml",
    "sitemap-core.xml",
]:
    fix_sitemap(filename)

# Update sitemap index with today's date
index_path = os.path.join(SITEMAP_DIR, "sitemap.xml")
with open(index_path, 'r') as f:
    index_content = f.read()

index_content = re.sub(r'<lastmod>.*?</lastmod>', f'<lastmod>{TODAY}</lastmod>', index_content)
with open(index_path, 'w') as f:
    f.write(index_content)

# Also update build
build_index = index_path.replace("/public/", "/build/")
if os.path.exists(os.path.dirname(build_index)):
    with open(build_index, 'w') as f:
        f.write(index_content)

print(f"\nSitemap index updated with date: {TODAY}")
print("Done!")
