from fastapi import APIRouter, HTTPException, Request, Response
from datetime import datetime, timezone
import os
import logging
import httpx

from database.db import db
from config.settings import FRONTEND_URL

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

INDEXNOW_KEY = "e33676fbaf3c0bd0b243f4f76213d267"


@router.get("/sitemap.xml")
async def get_sitemap():
    base_url = FRONTEND_URL
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    xml_items = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_items.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    static_pages = [
        ("/", "1.0", "daily"), ("/events", "0.9", "hourly"), ("/blog", "0.8", "daily"),
        ("/world-cup-2026", "0.95", "daily"), ("/f1-tickets", "0.95", "daily"),
        ("/champions-league-tickets", "0.95", "daily"), ("/motogp-tickets", "0.9", "daily"),
        ("/reviews", "0.7", "weekly"), ("/faq", "0.7", "monthly"),
        ("/about", "0.6", "monthly"), ("/contact", "0.6", "monthly"),
        ("/buyer-protection", "0.7", "monthly"), ("/terms", "0.5", "monthly"),
    ]
    for path, prio, freq in static_pages:
        xml_items.append(f'  <url>\n    <loc>{base_url}{path}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>\n  </url>')

    events = await db.events.find({"status": {"$ne": "cancelled"}}, {"_id": 0, "event_id": 1, "event_date": 1, "event_type": 1}).to_list(1000)
    for event in events:
        xml_items.append(f'  <url>\n    <loc>{base_url}/event/{event["event_id"]}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>')

    articles = await db.articles.find({}, {"_id": 0, "slug": 1, "date_generated": 1}).to_list(5000)
    for a in articles:
        d = a.get("date_generated", "")
        lm = d.strftime('%Y-%m-%d') if isinstance(d, datetime) else today
        xml_items.append(f'  <url>\n    <loc>{base_url}/blog/{a["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.70</priority>\n  </url>')

    seo_pages = await db.seo_pages.find({}, {"_id": 0, "slug": 1, "updated_at": 1, "priority": 1}).to_list(50000)
    for p in seo_pages:
        lm = p.get("updated_at", "")
        lm = lm.strftime('%Y-%m-%d') if isinstance(lm, datetime) else today
        xml_items.append(f'  <url>\n    <loc>{base_url}/{p["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{p.get("priority", 0.80)}</priority>\n  </url>')

    xml_items.append('</urlset>')
    return Response(content='\n'.join(xml_items), media_type="application/xml", headers={"Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600"})


@router.get("/sitemap-index.xml")
async def get_sitemap_index():
    base_url = FRONTEND_URL
    api_base = f"{base_url}/api"
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for cat in ["pages", "f1", "football", "concerts", "worldcup", "cities", "articles"]:
        xml += f'  <sitemap>\n    <loc>{api_base}/sitemaps/{cat}.xml</loc>\n    <lastmod>{today}</lastmod>\n  </sitemap>\n'
    xml += '</sitemapindex>'
    return Response(content=xml, media_type="application/xml", headers={"Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600"})


@router.get("/sitemaps/{category}.xml")
async def get_category_sitemap(category: str):
    base_url = FRONTEND_URL
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    xml_items = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    if category == "pages":
        static = [
            ("/", "1.0", "daily"), ("/events", "0.9", "hourly"), ("/blog", "0.8", "daily"),
            ("/world-cup-2026", "0.95", "daily"), ("/f1-tickets", "0.95", "daily"),
            ("/champions-league-tickets", "0.95", "daily"), ("/motogp-tickets", "0.9", "daily"),
            ("/reviews", "0.7", "weekly"), ("/faq", "0.7", "monthly"),
            ("/about", "0.6", "monthly"), ("/contact", "0.6", "monthly"),
            ("/buyer-protection", "0.7", "monthly"), ("/terms", "0.5", "monthly"),
            ("/privacy-policy", "0.5", "monthly"), ("/refund-policy", "0.5", "monthly"),
            ("/sell-tickets", "0.8", "monthly"),
            # F1 GP Pages
            ("/f1-monaco-grand-prix-tickets", "0.95", "weekly"),
            ("/f1-british-grand-prix-silverstone-tickets", "0.95", "weekly"),
            ("/f1-italian-grand-prix-monza-tickets", "0.95", "weekly"),
            ("/f1-singapore-grand-prix-tickets", "0.95", "weekly"),
            ("/f1-las-vegas-grand-prix-tickets", "0.95", "weekly"),
            ("/f1-miami-grand-prix-tickets", "0.95", "weekly"),
            ("/f1-belgian-grand-prix-spa-tickets", "0.95", "weekly"),
            ("/f1-abu-dhabi-grand-prix-tickets", "0.95", "weekly"),
            ("/f1-dutch-grand-prix-zandvoort-tickets", "0.90", "weekly"),
            ("/f1-japanese-grand-prix-suzuka-tickets", "0.90", "weekly"),
            ("/f1-australian-grand-prix-melbourne-tickets", "0.90", "weekly"),
            ("/f1-bahrain-grand-prix-tickets", "0.90", "weekly"),
            ("/f1-saudi-arabian-grand-prix-jeddah-tickets", "0.90", "weekly"),
            ("/f1-spanish-grand-prix-barcelona-tickets", "0.90", "weekly"),
            ("/f1-hungarian-grand-prix-budapest-tickets", "0.90", "weekly"),
            ("/f1-austrian-grand-prix-red-bull-ring-tickets", "0.90", "weekly"),
            ("/f1-2026-schedule", "0.90", "weekly"),
            ("/f1-ticket-prices-2026", "0.85", "weekly"),
            ("/f1-ticket-prices-guide", "0.85", "weekly"),
            ("/f1-tickets-2026", "0.90", "weekly"),
            ("/how-to-buy-f1-tickets", "0.80", "monthly"),
            ("/best-f1-races-europe", "0.80", "monthly"),
            ("/monaco-grand-prix-tickets", "0.90", "weekly"),
            # MotoGP Pages
            ("/motogp-mugello-tickets", "0.85", "weekly"),
            ("/motogp-2026-schedule", "0.85", "weekly"),
            ("/motogp-ticket-prices-2026", "0.85", "weekly"),
            ("/isle-of-man-tt-tickets", "0.80", "weekly"),
            # Football Pages
            ("/el-clasico-tickets", "0.90", "weekly"),
            ("/football-ticket-prices-2026", "0.85", "weekly"),
            # Concert Pages
            ("/the-weeknd-tour-2026", "0.90", "weekly"),
            ("/bruno-mars-tour-2026", "0.90", "weekly"),
            ("/guns-n-roses-tour-2026", "0.85", "weekly"),
            ("/bad-bunny-london-2026", "0.85", "weekly"),
            ("/harry-styles-tickets", "0.85", "weekly"),
            ("/maroon-5-tickets", "0.85", "weekly"),
            ("/john-legend-abu-dhabi-tickets", "0.80", "weekly"),
            ("/metallica-sphere-las-vegas-tickets", "0.85", "weekly"),
            ("/acl-festival-2026-tickets", "0.85", "weekly"),
            ("/concert-ticket-prices-2026", "0.85", "weekly"),
            # World Cup Pages
            ("/world-cup-2026-tickets", "0.95", "weekly"),
            ("/world-cup-raffle", "0.75", "weekly"),
            # Comparison Pages
            ("/euromatchtickets-vs-stubhub", "0.80", "monthly"),
            ("/euromatchtickets-vs-viagogo", "0.80", "monthly"),
            ("/euromatchtickets-vs-ticketmaster", "0.80", "monthly"),
            ("/euromatchtickets-vs-seatgeek", "0.80", "monthly"),
            # Monthly Events Pages
            ("/events-january-2026", "0.70", "monthly"),
            ("/events-february-2026", "0.70", "monthly"),
            ("/events-march-2026", "0.75", "monthly"),
            ("/events-april-2026", "0.75", "monthly"),
            ("/events-may-2026", "0.75", "monthly"),
            ("/events-june-2026", "0.75", "monthly"),
            ("/events-july-2026", "0.75", "monthly"),
            ("/events-august-2026", "0.75", "monthly"),
            ("/events-september-2026", "0.70", "monthly"),
            ("/events-october-2026", "0.70", "monthly"),
            ("/events-november-2026", "0.70", "monthly"),
            ("/events-december-2026", "0.70", "monthly"),
            ("/events-this-weekend", "0.80", "daily"),
            # Trust & Info Pages
            ("/fan-protect", "0.60", "monthly"),
            ("/payment-info", "0.55", "monthly"),
            ("/impressum", "0.40", "monthly"),
        ]
        for path, prio, freq in static:
            xml_items.append(f'  <url>\n    <loc>{base_url}{path}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>\n  </url>')
    elif category == "articles":
        articles = await db.articles.find({}, {"_id": 0, "slug": 1, "date_generated": 1}).to_list(5000)
        for a in articles:
            d = a.get("date_generated", "")
            lm = d.strftime('%Y-%m-%d') if isinstance(d, datetime) else today
            xml_items.append(f'  <url>\n    <loc>{base_url}/blog/{a["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.70</priority>\n  </url>')
    elif category == "cities":
        pages = await db.seo_pages.find({"page_type": "city_category"}, {"_id": 0, "slug": 1, "priority": 1, "updated_at": 1}).to_list(50000)
        for p in pages:
            lm = p.get("updated_at", "")
            lm = lm.strftime('%Y-%m-%d') if isinstance(lm, datetime) else today
            xml_items.append(f'  <url>\n    <loc>{base_url}/{p["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{p.get("priority", 0.75)}</priority>\n  </url>')
    else:
        cat_map = {"f1": "f1", "football": "football", "concerts": "concert", "worldcup": "worldcup"}
        db_cat = cat_map.get(category, category)
        pages = await db.seo_pages.find({"category": db_cat}, {"_id": 0, "slug": 1, "priority": 1, "updated_at": 1}).to_list(50000)
        for p in pages:
            lm = p.get("updated_at", "")
            lm = lm.strftime('%Y-%m-%d') if isinstance(lm, datetime) else today
            xml_items.append(f'  <url>\n    <loc>{base_url}/{p["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{p.get("priority", 0.80)}</priority>\n  </url>')

    xml_items.append('</urlset>')
    return Response(content='\n'.join(xml_items), media_type="application/xml", headers={"Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600"})


@router.get("/robots.txt")
async def get_robots(request: Request):
    base_url = FRONTEND_URL
    content = f"""User-agent: *
Allow: /

# Allow sitemaps (critical for indexing)
Allow: /api/sitemap-index.xml
Allow: /api/sitemap.xml
Allow: /api/sitemaps/

# Block private areas only
Disallow: /admin
Disallow: /seller
Disallow: /owner
Disallow: /my-tickets
Disallow: /auth/
Disallow: /order/
Disallow: /alerts

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /
Crawl-delay: 1

Sitemap: {base_url}/sitemap-index.xml
Sitemap: {base_url}/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")


# SEO Page Endpoints
@router.post("/seo/mega-generate")
async def generate_mega_seo_pages_endpoint():
    try:
        from mega_seo_generator import generate_mega_seo_pages
        result = await generate_mega_seo_pages()
        return {"status": "success", "result": result, "message": f"Generated {result['total_generated']} unique SEO pages!", "timestamp": datetime.now(timezone.utc).isoformat()}
    except Exception as e:
        logger.error(f"Error in mega SEO generation: {e}")
        import traceback
        return {"status": "error", "message": str(e), "traceback": traceback.format_exc()}


@router.post("/seo/generate-pages")
async def generate_seo_landing_pages():
    try:
        from seo_page_generator import generate_seo_pages
        result = await generate_seo_pages()
        return {"status": "success", "result": result}
    except Exception as e:
        logger.error(f"Error: {e}")
        return {"status": "error", "message": str(e)}


@router.get("/seo/pages")
async def get_seo_pages(category: str = None, page_type: str = None, page: int = 1, limit: int = 50):
    query = {}
    if category:
        query["category"] = category
    if page_type:
        query["page_type"] = page_type
    skip = (page - 1) * limit
    total = await db.seo_pages.count_documents(query)
    pages = await db.seo_pages.find(query, {"_id": 0, "slug": 1, "title": 1, "description": 1, "category": 1, "page_type": 1, "image": 1, "price_low": 1, "price_high": 1, "city": 1, "year": 1, "priority": 1}).sort("priority", -1).skip(skip).limit(limit).to_list(limit)
    return {"total": total, "page": page, "limit": limit, "total_pages": (total + limit - 1) // limit, "pages": pages}


@router.get("/seo/stats")
async def get_seo_stats():
    total = await db.seo_pages.count_documents({})
    by_cat = await db.seo_pages.aggregate([{"$group": {"_id": "$category", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]).to_list(100)
    by_type = await db.seo_pages.aggregate([{"$group": {"_id": "$page_type", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]).to_list(100)
    return {"total_pages": total, "by_category": {r["_id"]: r["count"] for r in by_cat}, "by_type": {r["_id"]: r["count"] for r in by_type}}


@router.get("/seo/page/{slug}")
async def get_seo_page(slug: str):
    page = await db.seo_pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


# SEO Automation
@router.api_route("/seo/ping-search-engines", methods=["GET", "POST"])
async def seo_ping_engines():
    base_url = FRONTEND_URL
    sitemap_url = f"{base_url}/sitemap-index.xml"
    results = {}
    async with httpx.AsyncClient(timeout=10.0) as client:
        # IndexNow (replaces deprecated Google/Bing ping)
        try:
            seo_pages = await db.seo_pages.find({}, {"_id": 0, "slug": 1}).to_list(100)
            urls = [f"{base_url}/{p['slug']}" for p in seo_pages[:100]]
            payload = {
                "host": "euromatchtickets.com",
                "key": INDEXNOW_KEY,
                "keyLocation": f"{base_url}/{INDEXNOW_KEY}.txt",
                "urlList": urls
            }
            r = await client.post("https://api.indexnow.org/indexnow", json=payload)
            results["indexnow"] = {"status": r.status_code, "urls": len(urls), "success": r.status_code in [200, 202]}
        except Exception as e:
            results["indexnow"] = {"status": "error", "detail": str(e)}
    return {"sitemap_url": sitemap_url, "results": results}


@router.post("/seo/indexnow")
async def submit_indexnow(urls: list[str] = None):
    """Submit URLs to IndexNow for instant indexing by Bing, Yandex, and partners."""
    base_url = FRONTEND_URL
    
    if not urls:
        # Submit all SEO pages
        seo_pages = await db.seo_pages.find({}, {"_id": 0, "slug": 1}).to_list(5000)
        urls = [f"{base_url}/{p['slug']}" for p in seo_pages]
    
    # IndexNow accepts max 10,000 URLs per request
    results = {"submitted": 0, "errors": 0, "batches": 0}
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for i in range(0, len(urls), 10000):
            batch = urls[i:i+10000]
            payload = {
                "host": "euromatchtickets.com",
                "key": INDEXNOW_KEY,
                "keyLocation": f"{base_url}/{INDEXNOW_KEY}.txt",
                "urlList": batch
            }
            try:
                r = await client.post(
                    "https://api.indexnow.org/indexnow",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                if r.status_code in [200, 202]:
                    results["submitted"] += len(batch)
                else:
                    results["errors"] += len(batch)
                    logger.warning(f"IndexNow batch error: {r.status_code} - {r.text}")
                results["batches"] += 1
            except Exception as e:
                results["errors"] += len(batch)
                logger.error(f"IndexNow error: {e}")
    
    # Also ping Google
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.get(f"https://www.google.com/ping?sitemap={base_url}/sitemap-index.xml")
            results["google_ping"] = True
    except Exception:
        results["google_ping"] = False
    
    return {"status": "success", "total_urls": len(urls), **results}


@router.post("/seo/submit-url")
async def submit_single_url(url: str):
    """Submit a single URL to IndexNow + Google ping."""
    base_url = FRONTEND_URL
    full_url = url if url.startswith("http") else f"{base_url}/{url.lstrip('/')}"
    
    results = {}
    async with httpx.AsyncClient(timeout=15.0) as client:
        # IndexNow
        try:
            payload = {
                "host": "euromatchtickets.com",
                "key": INDEXNOW_KEY,
                "keyLocation": f"{base_url}/{INDEXNOW_KEY}.txt",
                "urlList": [full_url]
            }
            r = await client.post("https://api.indexnow.org/indexnow", json=payload)
            results["indexnow"] = {"status": r.status_code, "success": r.status_code in [200, 202]}
        except Exception as e:
            results["indexnow"] = {"status": "error", "detail": str(e)}
        
        # Google ping
        try:
            r = await client.get(f"https://www.google.com/ping?sitemap={base_url}/sitemap-index.xml")
            results["google"] = {"status": r.status_code, "success": r.status_code == 200}
        except Exception:
            results["google"] = {"status": "error"}
    
    return {"url": full_url, "results": results}


@router.get("/seo/audit")
async def seo_audit_page(url: str = ""):
    return {"status": "audit_available", "message": "Use Google Search Console for detailed audits"}


@router.get("/seo/internal-links/{event_type}")
async def seo_get_internal_links(event_type: str):
    events = await db.events.find({"event_type": event_type, "status": {"$ne": "cancelled"}}, {"_id": 0, "event_id": 1, "title": 1}).to_list(20)
    return [{"url": f"/event/{e['event_id']}", "title": e['title']} for e in events]



@router.get("/prerender/{slug:path}")
async def prerender_seo_page(slug: str):
    """Serve pre-rendered HTML with proper meta tags for SEO crawlers.
    Use this on production: reverse proxy SEO pages to this endpoint for Googlebot."""
    page = await db.seo_pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    base_url = FRONTEND_URL
    title = page.get("title", "EuroMatchTickets")
    description = page.get("description", "")[:160]
    content = page.get("content", "")
    canonical = f"https://euromatchtickets.com/{slug}"
    image = page.get("image", "https://euromatchtickets.com/logo.png")
    keywords = page.get("keywords", "")
    
    # Build structured data
    event_schema = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": page.get("event_name", title.split("|")[0].strip()),
        "description": description,
        "image": image,
        "url": canonical,
        "startDate": page.get("event_date", "2026-06-01"),
        "endDate": page.get("end_date", page.get("event_date", "2026-12-31")),
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": page.get("venue", page.get("city", "Europe")),
            "address": {
                "@type": "PostalAddress",
                "addressLocality": page.get("city", "Europe"),
                "addressCountry": page.get("country", "EU")
            }
        },
        "organizer": {"@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com"}
    }
    if page.get("price_low"):
        event_schema["offers"] = {
            "@type": "AggregateOffer",
            "lowPrice": str(page["price_low"]),
            "highPrice": str(page.get("price_high", page["price_low"] * 10)),
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": canonical,
            "validFrom": "2025-01-01"
        }
    
    import json
    schema_json = json.dumps(event_schema)
    
    # Convert markdown content to basic HTML
    content_html = content.replace("# ", "<h1>").replace("## ", "<h2>").replace("### ", "<h3>")
    content_html = content_html.replace("\n\n", "</p><p>").replace("\n", "<br>")
    content_html = f"<p>{content_html}</p>"
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="keywords" content="{keywords}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:url" content="{canonical}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{image}">
<meta property="og:site_name" content="EuroMatchTickets">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{image}">
<script type="application/ld+json">{schema_json}</script>
</head>
<body>
<header><h1>{title}</h1></header>
<main>
<article>{content_html}</article>
<p><a href="{canonical}">Buy tickets at EuroMatchTickets</a></p>
</main>
<footer><p>EuroMatchTickets - Europe's Trusted Ticket Marketplace</p></footer>
<script>window.location.href="{canonical}";</script>
</body>
</html>"""
    
    return Response(content=html, media_type="text/html; charset=utf-8")
