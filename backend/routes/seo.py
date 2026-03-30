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
BING_API_KEY = os.environ.get("BING_WEBMASTER_API_KEY", "")
SITE_URL = "https://euromatchtickets.com"


# Serve IndexNow key file from backend (bypasses Cloudflare frontend protection)
@router.get(f"/{INDEXNOW_KEY}.txt")
async def serve_indexnow_key():
    return Response(content=INDEXNOW_KEY, media_type="text/plain")



@router.get("/sitemap.xml")
async def get_sitemap():
    """Main comprehensive sitemap - includes all active URLs"""
    return await _build_full_sitemap()


@router.get("/seo/sitemap.xml")
async def get_seo_sitemap():
    """Alias for main sitemap - this is the URL submitted to Google Search Console"""
    return await _build_full_sitemap()


async def _build_full_sitemap():
    base_url = FRONTEND_URL
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    xml_items = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_items.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

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
        ("/reviews", "0.7", "weekly"), ("/faq", "0.7", "monthly"),
        ("/about", "0.6", "monthly"), ("/contact", "0.6", "monthly"),
        ("/buyer-protection", "0.7", "monthly"), ("/terms", "0.5", "monthly"),
        # Spanish SEO pages
        ("/es/comprar-entradas", "0.90", "weekly"),
        ("/es/entradas-champions-league", "0.85", "weekly"),
        ("/es/entradas-f1", "0.85", "weekly"),
        ("/es/entradas-conciertos", "0.85", "weekly"),
        ("/es/entradas-copa-del-mundo-2026", "0.90", "weekly"),
        # German SEO pages
        ("/de/tickets-kaufen", "0.90", "weekly"),
        ("/de/champions-league-tickets", "0.85", "weekly"),
        ("/de/formel-1-tickets", "0.85", "weekly"),
        ("/de/bundesliga-tickets", "0.85", "weekly"),
        ("/de/konzert-tickets", "0.85", "weekly"),
        ("/de/wm-2026-tickets", "0.90", "weekly"),
    ]
    for path, prio, freq in static_pages:
        xml_items.append(f'  <url>\n    <loc>{base_url}{path}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>\n  </url>')

    events = await db.events.find({"status": {"$nin": ["cancelled", "past_event", "expired"]}, "event_date": {"$gte": today}}, {"_id": 0, "event_id": 1, "slug": 1, "event_date": 1, "event_type": 1}).to_list(1000)
    for event in events:
        slug = event.get("slug", event["event_id"])
        xml_items.append(f'  <url>\n    <loc>{base_url}/event/{slug}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>')

    articles = await db.articles.find({}, {"_id": 0, "slug": 1, "date_generated": 1}).to_list(5000)
    for a in articles:
        d = a.get("date_generated", "")
        lm = d.strftime('%Y-%m-%d') if isinstance(d, datetime) else today
        xml_items.append(f'  <url>\n    <loc>{base_url}/blog/{a["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.70</priority>\n  </url>')

    seo_pages = await db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1, "updated_at": 1, "priority": 1}).to_list(50000)
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
    categories = ["pages", "f1", "football", "concerts", "worldcup", "cities"]
    # Only include articles sitemap if articles exist in the database
    articles_count = await db.articles.count_documents({})
    if articles_count > 0:
        categories.append("articles")
    for cat in categories:
        xml += f'  <sitemap>\n    <loc>{api_base}/sitemaps/{cat}.xml</loc>\n    <lastmod>{today}</lastmod>\n  </sitemap>\n'
    xml += '</sitemapindex>'
    return Response(content=xml, media_type="application/xml", headers={"Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600"})


@router.get("/sitemaps/{category}.xml")
async def get_category_sitemap(category: str):
    base_url = FRONTEND_URL
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    xml_items = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']

    # Image mapping for categories
    cat_images = {
        "f1": f"{base_url}/images/heroes/f1-red-lg.webp",
        "football": f"{base_url}/images/heroes/football-stadium-lg.webp",
        "concert": f"{base_url}/images/heroes/concert-purple-lg.webp",
        "concerts": f"{base_url}/images/heroes/concert-purple-lg.webp",
        "worldcup": f"{base_url}/images/heroes/worldcup-trophy-lg.webp",
        "motogp": f"{base_url}/images/heroes/motogp-orange-lg.webp",
        "sports": f"{base_url}/images/heroes/football-match-lg.webp",
    }

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
            # Determine image for this page
            img_cat = "football"
            path_lower = path.lower()
            if "/f1" in path_lower or "grand-prix" in path_lower or "silverstone" in path_lower or "monaco" in path_lower: img_cat = "f1"
            elif any(x in path_lower for x in ["weeknd", "bruno", "guns", "harry", "maroon", "metallica", "bad-bunny", "acl", "legend", "concert"]): img_cat = "concert"
            elif "motogp" in path_lower or "isle-of-man" in path_lower: img_cat = "motogp"
            elif "world-cup" in path_lower: img_cat = "worldcup"
            img_url = cat_images.get(img_cat, cat_images["football"])
            page_title = path.strip("/").replace("-", " ").title() if path != "/" else "EuroMatchTickets Home"
            img_tag = f'\n    <image:image>\n      <image:loc>{img_url}</image:loc>\n      <image:title>{page_title}</image:title>\n    </image:image>'
            xml_items.append(f'  <url>\n    <loc>{base_url}{path}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>{img_tag}\n  </url>')
    elif category == "articles":
        articles = await db.articles.find({}, {"_id": 0, "slug": 1, "date_generated": 1}).to_list(5000)
        for a in articles:
            d = a.get("date_generated", "")
            lm = d.strftime('%Y-%m-%d') if isinstance(d, datetime) else today
            xml_items.append(f'  <url>\n    <loc>{base_url}/blog/{a["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.70</priority>\n  </url>')
    elif category == "cities":
        city_img = f"{base_url}/images/heroes/football-stadium-lg.webp"
        pages = await db.seo_pages.find({"page_type": "city_category", "active": True}, {"_id": 0, "slug": 1, "title": 1, "priority": 1, "updated_at": 1}).to_list(50000)
        for p in pages:
            lm = p.get("updated_at", "")
            lm = lm.strftime('%Y-%m-%d') if isinstance(lm, datetime) else today
            title_clean = (p.get("title", "").split("|")[0].strip() or p["slug"].replace("-", " ").title())
            img_tag = f'\n    <image:image>\n      <image:loc>{city_img}</image:loc>\n      <image:title>{title_clean}</image:title>\n    </image:image>'
            xml_items.append(f'  <url>\n    <loc>{base_url}/{p["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{p.get("priority", 0.75)}</priority>{img_tag}\n  </url>')
    else:
        cat_map = {"f1": "f1", "football": "football", "concerts": "concert", "worldcup": "worldcup"}
        db_cat = cat_map.get(category, category)
        img_url = cat_images.get(db_cat, cat_images.get(category, f"{base_url}/og-image.jpg"))
        pages = await db.seo_pages.find({"category": db_cat, "active": True}, {"_id": 0, "slug": 1, "title": 1, "priority": 1, "updated_at": 1}).to_list(50000)
        for p in pages:
            lm = p.get("updated_at", "")
            lm = lm.strftime('%Y-%m-%d') if isinstance(lm, datetime) else today
            title_clean = (p.get("title", "").split("|")[0].strip() or p["slug"].replace("-", " ").title())
            img_tag = f'\n    <image:image>\n      <image:loc>{img_url}</image:loc>\n      <image:title>{title_clean}</image:title>\n    </image:image>'
            xml_items.append(f'  <url>\n    <loc>{base_url}/{p["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{p.get("priority", 0.80)}</priority>{img_tag}\n  </url>')

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

# Allow images for Google Image Search
Allow: /images/

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

Sitemap: {base_url}/api/sitemap-index.xml
Sitemap: {base_url}/api/sitemap.xml
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
    # Return 410 Gone for inactive pages - tells Google to REMOVE from index
    if not page.get("active", False):
        raise HTTPException(status_code=410, detail="Page removed")
    return page


@router.post("/seo/activate-batch")
async def activate_next_batch(count: int = 100):
    """Activate the next batch of highest-priority inactive pages"""
    # Find top inactive pages sorted by SEO value
    inactive = await db.seo_pages.find(
        {"active": {"$ne": True}, "slug": {"$regex": "2026"}},
        {"_id": 1, "slug": 1, "category": 1}
    ).sort("slug", 1).limit(count).to_list(count)
    
    if not inactive:
        return {"message": "No more inactive 2026 pages to activate", "activated": 0}
    
    ids = [p["_id"] for p in inactive]
    result = await db.seo_pages.update_many(
        {"_id": {"$in": ids}},
        {"$set": {"active": True, "priority": 75}}
    )
    
    active_total = await db.seo_pages.count_documents({"active": True})
    inactive_total = await db.seo_pages.count_documents({"active": {"$ne": True}})
    
    return {
        "activated": result.modified_count,
        "total_active": active_total,
        "total_inactive": inactive_total,
        "sample_activated": [p["slug"] for p in inactive[:5]]
    }

@router.get("/seo/indexing-status")
async def get_indexing_status():
    """Get current SEO indexing status"""
    active = await db.seo_pages.count_documents({"active": True})
    inactive = await db.seo_pages.count_documents({"active": {"$ne": True}})
    with_meta = await db.seo_pages.count_documents({"meta_description": {"$exists": True, "$ne": "", "$ne": None}})
    return {
        "active_pages": active,
        "inactive_pages": inactive,
        "pages_with_meta": with_meta,
        "total": active + inactive
    }


# SEO Automation
@router.api_route("/seo/ping-search-engines", methods=["GET", "POST"])
async def seo_ping_engines():
    base_url = SITE_URL
    sitemap_url = f"{base_url}/sitemap-index.xml"
    results = {}
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        # 1. Bing URL Submission API (primary - no key file verification needed)
        if BING_API_KEY:
            try:
                seo_pages = await db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1}).to_list(100)
                url_list = [f"{base_url}/{p['slug']}" for p in seo_pages[:100]]
                r = await client.post(
                    f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={BING_API_KEY}",
                    json={"siteUrl": base_url, "urlList": url_list},
                    headers={"Content-Type": "application/json; charset=utf-8"}
                )
                results["bing_api"] = {"status": r.status_code, "urls": len(url_list), "success": r.status_code == 200}
            except Exception as e:
                results["bing_api"] = {"status": "error", "detail": str(e)}

        # 2. Yandex IndexNow (works reliably)
        try:
            seo_pages = seo_pages if 'seo_pages' in dir() else await db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1}).to_list(100)
            urls = [f"{base_url}/{p['slug']}" for p in seo_pages[:100]]
            payload = {
                "host": "euromatchtickets.com",
                "key": INDEXNOW_KEY,
                "keyLocation": f"{base_url}/{INDEXNOW_KEY}.txt",
                "urlList": urls
            }
            r = await client.post("https://yandex.com/indexnow", json=payload)
            results["yandex"] = {"status": r.status_code, "urls": len(urls), "success": r.status_code in [200, 202]}
        except Exception as e:
            results["yandex"] = {"status": "error", "detail": str(e)}

    return {"sitemap_url": sitemap_url, "results": results}


async def _collect_all_urls():
    """Collect only ACTIVE site URLs for submission."""
    base_url = SITE_URL
    # Only submit active SEO pages
    seo_pages = await db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1}).to_list(5000)
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    events = await db.events.find(
        {"event_date": {"$gte": today}}, {"_id": 0, "event_id": 1, "slug": 1}
    ).to_list(500)

    urls = [f"{base_url}/{p['slug']}" for p in seo_pages]
    urls += [f"{base_url}/event/{e.get('slug') or e['event_id']}" for e in events]
    urls += [f"{base_url}/{p}" for p in [
        "", "events", "f1-tickets", "football-tickets", "concerts",
        "motogp-tickets", "world-cup-2026", "sell-tickets", "about", "faq",
        "reviews", "contact", "buyer-protection", "champions-league-tickets",
        "super-bowl-2026-tickets", "taylor-swift-wembley-2026-tickets",
        "el-clasico-tickets", "monaco-grand-prix-tickets", "blog",
        "es/comprar-entradas", "de/tickets-kaufen",
    ]]
    return list(set(urls))


@router.post("/seo/indexnow")
async def submit_indexnow(urls: list[str] = None):
    """Submit URLs via Bing URL Submission API + Yandex IndexNow."""
    if not urls:
        urls = await _collect_all_urls()

    results = {"total_urls": len(urls), "engines": {}}

    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        # 1. Bing URL Submission API (daily quota ~100 URLs, prioritize key pages first)
        if BING_API_KEY:
            bing_result = {"submitted": 0, "quota_exceeded": False}
            # Bing has a small daily quota - send in batches of 50 and stop on quota error
            for i in range(0, len(urls), 50):
                batch = urls[i:i+50]
                try:
                    r = await client.post(
                        f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={BING_API_KEY}",
                        json={"siteUrl": SITE_URL, "urlList": batch},
                        headers={"Content-Type": "application/json; charset=utf-8"}
                    )
                    if r.status_code == 200:
                        bing_result["submitted"] += len(batch)
                    else:
                        resp = r.text[:200]
                        if "Quota" in resp or "quota" in resp:
                            bing_result["quota_exceeded"] = True
                            bing_result["note"] = "Daily quota reached. Run again tomorrow."
                            break
                        bing_result["last_error"] = resp
                except Exception as e:
                    bing_result["last_error"] = str(e)[:100]
                    break
            results["engines"]["bing_api"] = bing_result
        else:
            results["engines"]["bing_api"] = {"error": "No BING_WEBMASTER_API_KEY configured"}

        # 2. Yandex IndexNow (no daily limit issues)
        yandex_result = {"submitted": 0, "errors": 0}
        for i in range(0, len(urls), 5000):
            batch = urls[i:i+5000]
            try:
                r = await client.post("https://yandex.com/indexnow", json={
                    "host": "euromatchtickets.com",
                    "key": INDEXNOW_KEY,
                    "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
                    "urlList": batch
                })
                if r.status_code in [200, 202]:
                    yandex_result["submitted"] += len(batch)
                else:
                    yandex_result["errors"] += len(batch)
            except Exception:
                yandex_result["errors"] += len(batch)
        results["engines"]["yandex"] = yandex_result

        # 3. Google Sitemap Ping
        try:
            r = await client.get(f"https://www.google.com/ping?sitemap={SITE_URL}/sitemap-index.xml")
            results["engines"]["google_ping"] = {"success": r.status_code == 200}
        except Exception:
            results["engines"]["google_ping"] = {"success": False}

    total_submitted = sum(
        v.get("submitted", 0) for v in results["engines"].values() if isinstance(v, dict)
    )
    results["total_submitted"] = total_submitted
    return {"status": "success", **results}


@router.get("/seo/indexing-progress")
async def get_indexing_progress():
    """Check daily Bing indexing progress and history."""
    # Get total URLs
    seo_count = await db.seo_pages.count_documents({})
    today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    event_count = await db.events.count_documents({"event_date": {"$gte": today_str}})
    static_pages = 18
    total_urls = seo_count + event_count + static_pages

    # Get submitted count
    submitted_count = await db.bing_submitted_urls.count_documents({})

    # Get recent logs
    logs = await db.bing_indexing_logs.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(14)

    remaining = max(0, total_urls - submitted_count)
    days_left = max(1, (remaining + 99) // 100) if remaining > 0 else 0

    return {
        "total_urls": total_urls,
        "submitted_to_bing": submitted_count,
        "remaining": remaining,
        "progress_pct": round(submitted_count / total_urls * 100) if total_urls > 0 else 0,
        "estimated_days_left": days_left,
        "daily_quota": 100,
        "recent_logs": logs
    }



@router.post("/seo/submit-url")
async def submit_single_url(url: str):
    """Submit a single URL to Bing API + Yandex IndexNow + Google ping."""
    full_url = url if url.startswith("http") else f"{SITE_URL}/{url.lstrip('/')}"
    
    results = {}
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        # 1. Bing URL Submission API (primary)
        if BING_API_KEY:
            try:
                r = await client.post(
                    f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey={BING_API_KEY}",
                    json={"siteUrl": SITE_URL, "url": full_url},
                    headers={"Content-Type": "application/json; charset=utf-8"}
                )
                results["bing_api"] = {"status": r.status_code, "success": r.status_code == 200}
            except Exception as e:
                results["bing_api"] = {"status": "error", "detail": str(e)}

        # 2. Yandex IndexNow
        try:
            r = await client.post("https://yandex.com/indexnow", json={
                "host": "euromatchtickets.com",
                "key": INDEXNOW_KEY,
                "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
                "urlList": [full_url]
            })
            results["yandex"] = {"status": r.status_code, "success": r.status_code in [200, 202]}
        except Exception as e:
            results["yandex"] = {"status": "error", "detail": str(e)}
        
        # 3. Google ping
        try:
            r = await client.get(f"https://www.google.com/ping?sitemap={SITE_URL}/sitemap-index.xml")
            results["google"] = {"status": r.status_code, "success": r.status_code == 200}
        except Exception:
            results["google"] = {"status": "error"}
    
    return {"url": full_url, "results": results}


@router.get("/seo/audit")
async def seo_audit_page(url: str = ""):
    return {"status": "audit_available", "message": "Use Google Search Console for detailed audits"}


@router.get("/seo/page-meta")
async def get_seo_page_meta(path: str = ""):
    """Return title, description, and canonical for dynamic SPA meta tag injection."""
    STATIC_META = {
        "/": {"title": "Buy Tickets | Champions League, F1, Concerts | EuroMatchTickets", "description": "Buy Champions League tickets from \u20ac85, Taylor Swift from \u20ac89, F1 from \u20ac89. Verified sellers, instant QR delivery."},
        "/champions-league-tickets": {"title": "Champions League Tickets 2026 | From \u20ac85", "description": "Buy UEFA Champions League tickets from \u20ac85. Semi-finals, final & all matches. Verified sellers, instant QR delivery."},
        "/f1-tickets": {"title": "F1 Tickets 2026 | All Grand Prix Races | EuroMatchTickets", "description": "Buy Formula 1 tickets from \u20ac89. Monaco, Silverstone, Monza & all 2026 races. Verified tickets, instant delivery."},
        "/world-cup-2026": {"title": "FIFA World Cup 2026 Tickets | From \u20ac95", "description": "Buy FIFA World Cup 2026 tickets. Group stage from \u20ac95, knockout rounds available. Verified sellers."},
        "/motogp-tickets": {"title": "MotoGP Tickets 2026 | All Races | EuroMatchTickets", "description": "Buy MotoGP tickets from \u20ac69. Mugello, Valencia & all 2026 races. Instant delivery."},
        "/taylor-swift-tickets": {"title": "Taylor Swift Tickets 2026 | London | EuroMatchTickets", "description": "Buy Taylor Swift tickets from \u20ac89. Wembley Stadium London. Verified sellers, instant QR delivery."},
        "/taylor-swift-london-tickets": {"title": "Taylor Swift London Tickets | Wembley 2026", "description": "Buy Taylor Swift London tickets from \u20ac89. All Wembley dates. Verified, instant delivery."},
        "/taylor-swift-wembley-2026-tickets": {"title": "Taylor Swift Wembley 2026 Tickets | From \u20ac89", "description": "Buy Taylor Swift Wembley 2026 tickets. Multiple dates. Verified, instant QR."},
        "/el-clasico-tickets": {"title": "El Clasico Tickets | Real Madrid vs Barcelona", "description": "Buy El Clasico tickets. Real Madrid vs Barcelona. Verified sellers, cheapest prices."},
        "/super-bowl-2026-tickets": {"title": "Super Bowl 2026 Tickets | Buy Now | EuroMatchTickets", "description": "Buy Super Bowl LXI 2026 tickets. Premium seats. Verified sellers, instant QR delivery."},
        "/monaco-grand-prix-tickets": {"title": "Monaco Grand Prix Tickets 2026 | F1 Monaco", "description": "Buy Monaco GP tickets. Grandstands & hospitality. Verified tickets, instant delivery."},
        "/real-madrid-tickets": {"title": "Real Madrid Tickets 2026 | All Matches | From \u20ac75", "description": "Buy Real Madrid tickets. Bernabeu, Champions League, La Liga. From \u20ac75."},
        "/barcelona-tickets": {"title": "FC Barcelona Tickets 2026 | Camp Nou | From \u20ac70", "description": "Buy FC Barcelona tickets. Camp Nou, Champions League, La Liga. Verified sellers."},
        "/manchester-city-tickets": {"title": "Man City Tickets 2026 | Etihad | EuroMatchTickets", "description": "Buy Manchester City tickets. Etihad, Premier League, Champions League. Instant delivery."},
        "/liverpool-tickets": {"title": "Liverpool FC Tickets 2026 | Anfield | From \u20ac65", "description": "Buy Liverpool FC tickets. Anfield, Premier League, Champions League. From \u20ac65."},
        "/arsenal-tickets": {"title": "Arsenal Tickets 2026 | Emirates | EuroMatchTickets", "description": "Buy Arsenal tickets. Emirates Stadium, Premier League, Champions League."},
        "/bayern-vs-real-madrid-tickets": {"title": "Bayern vs Real Madrid Tickets | Champions League", "description": "Buy Bayern Munich vs Real Madrid Champions League tickets. Verified, instant delivery."},
        "/bahrain-world-cup-tickets-2026": {"title": "Bahrain World Cup 2026 Tickets | FIFA", "description": "Buy Bahrain FIFA World Cup 2026 tickets. Group & knockout matches. Verified sellers."},
        "/events": {"title": "Events & Tickets 2026 | Browse All | EuroMatchTickets", "description": "Browse 500+ events. Football, F1, concerts. Cheapest prices, instant QR delivery."},
        "/about": {"title": "About EuroMatchTickets | Trusted Ticket Marketplace", "description": "Europe\u2019s trusted ticket marketplace for football, F1, and concerts. FanProtect guarantee."},
        "/faq": {"title": "FAQ | EuroMatchTickets | Common Questions", "description": "Answers to common questions about buying tickets, delivery, refunds, and FanProtect."},
        "/reviews": {"title": "Reviews | EuroMatchTickets | 4.8/5 Rating", "description": "Read 12,000+ verified customer reviews. 4.8/5 rating. Trusted marketplace."},
        "/contact": {"title": "Contact Us | EuroMatchTickets | Support", "description": "Get in touch with EuroMatchTickets support. Email, phone, live chat 24/7."},
        "/blog": {"title": "Blog | EuroMatchTickets | Sports & Concert News", "description": "Latest news about football, F1, concerts, and ticket buying guides."},
        "/buyer-protection": {"title": "Buyer Protection | FanProtect | EuroMatchTickets", "description": "FanProtect. 100% money-back guarantee, verified sellers, secure payments."},
        "/sell-tickets": {"title": "Sell Tickets | EuroMatchTickets | List Yours", "description": "Sell your tickets on EuroMatchTickets. Reach millions of European buyers."},
    }

    if not path or path == "/":
        meta = STATIC_META.get("/", {})
        return {"title": meta.get("title", "EuroMatchTickets"), "description": meta.get("description", ""), "canonical": "https://euromatchtickets.com/"}
    
    clean_path = "/" + path.strip("/")
    slug = path.strip("/")
    
    # Check static meta first (for React-only routes not in DB)
    if clean_path in STATIC_META:
        meta = STATIC_META[clean_path]
        return {"title": meta["title"], "description": meta.get("description", ""), "canonical": f"https://euromatchtickets.com/{slug}"}
    
    # Check DB for dynamic SEO pages
    page = await db.seo_pages.find_one({"slug": slug}, {"_id": 0, "title": 1, "description": 1})
    if page:
        return {"title": page.get("title", f"{slug} | EuroMatchTickets"), "description": page.get("description", ""), "canonical": f"https://euromatchtickets.com/{slug}"}
    
    # Smart fallback: generate from slug
    readable = slug.replace("-", " ").title()
    return {"title": f"{readable} | EuroMatchTickets", "description": f"Buy {readable} tickets at Europe's cheapest prices. Verified sellers, instant QR delivery.", "canonical": f"https://euromatchtickets.com/{slug}"}


@router.get("/seo/internal-links/{event_type}")
async def seo_get_internal_links(event_type: str):
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    events = await db.events.find({"event_type": event_type, "status": {"$nin": ["cancelled", "past_event", "expired"]}, "event_date": {"$gte": today}}, {"_id": 0, "event_id": 1, "title": 1}).to_list(20)
    return [{"url": f"/event/{e['event_id']}", "title": e['title']} for e in events]


@router.get("/seo/related-pages")
async def get_related_pages(category: str = "", slug: str = "", city: str = "", limit: int = 8):
    """Return contextually related SEO pages for internal linking."""
    results = []
    seen_slugs = {slug}  # exclude current page

    # 1. Same category pages (different from current)
    if category:
        same_cat = await db.seo_pages.find(
            {"category": category, "slug": {"$ne": slug}},
            {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "price_low": 1, "page_type": 1}
        ).sort("priority", -1).limit(limit).to_list(limit)
        for p in same_cat:
            if p["slug"] not in seen_slugs:
                results.append({"url": f"/{p['slug']}", "title": p["title"].split("|")[0].strip(), "category": p.get("category", ""), "city": p.get("city", "")})
                seen_slugs.add(p["slug"])

    # 2. Same city, different category
    if city and len(results) < limit:
        remaining = limit - len(results)
        city_pages = await db.seo_pages.find(
            {"city": city, "slug": {"$nin": list(seen_slugs)}},
            {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "price_low": 1}
        ).sort("priority", -1).limit(remaining).to_list(remaining)
        for p in city_pages:
            if p["slug"] not in seen_slugs:
                results.append({"url": f"/{p['slug']}", "title": p["title"].split("|")[0].strip(), "category": p.get("category", ""), "city": p.get("city", "")})
                seen_slugs.add(p["slug"])

    # 3. Fill with top pages from related categories
    if len(results) < limit:
        related_map = {"f1": ["football", "concert"], "football": ["f1", "worldcup"], "concert": ["football", "f1"], "worldcup": ["f1", "football"]}
        related_cats = related_map.get(category, ["f1", "concert"])
        remaining = limit - len(results)
        cross_pages = await db.seo_pages.find(
            {"category": {"$in": related_cats}, "slug": {"$nin": list(seen_slugs)}},
            {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "price_low": 1}
        ).sort("priority", -1).limit(remaining).to_list(remaining)
        for p in cross_pages:
            if p["slug"] not in seen_slugs:
                results.append({"url": f"/{p['slug']}", "title": p["title"].split("|")[0].strip(), "category": p.get("category", ""), "city": p.get("city", "")})
                seen_slugs.add(p["slug"])

    return {"links": results[:limit]}


@router.get("/seo/full-related/{slug}")
async def get_full_related(slug: str):
    """Return comprehensive related content for internal linking sections."""
    page = await db.seo_pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        return {"related_events": [], "similar_pages": [], "upcoming_events": [], "city_events": []}

    category = page.get("category", "")
    city = page.get("city", "")
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    seen = {slug}

    def fmt_seo(p):
        return {"url": f"/{p['slug']}", "title": p["title"].split("|")[0].strip(), 
                "category": p.get("category", ""), "city": p.get("city", ""),
                "price_low": p.get("price_low"), "venue": p.get("venue", "")}

    def fmt_event(e):
        return {"url": f"/event/{e['event_id']}", "title": e["title"],
                "category": e.get("event_type", ""), "city": e.get("city", ""),
                "date": e.get("event_date", ""), "venue": e.get("venue", "")}

    # 1. Same category SEO pages
    same_cat = await db.seo_pages.find(
        {"category": category, "slug": {"$nin": list(seen)}},
        {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "price_low": 1, "venue": 1}
    ).limit(6).to_list(6)
    related_pages = [fmt_seo(p) for p in same_cat if p["slug"] not in seen]
    seen.update(p["slug"] for p in same_cat)

    # 2. Same city events (cross-category)
    city_pages = []
    if city:
        cp = await db.seo_pages.find(
            {"city": city, "slug": {"$nin": list(seen)}},
            {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "price_low": 1, "venue": 1}
        ).limit(6).to_list(6)
        city_pages = [fmt_seo(p) for p in cp if p["slug"] not in seen]

    # 3. Upcoming real events (same type)
    event_type_map = {"f1": "f1", "football": "match", "concert": "concert", "worldcup": "match"}
    etype = event_type_map.get(category, "match")
    upcoming_raw = await db.events.find(
        {"event_type": etype, "event_date": {"$gte": today}},
        {"_id": 0, "event_id": 1, "title": 1, "event_type": 1, "city": 1, "event_date": 1, "venue": 1}
    ).sort("event_date", 1).limit(6).to_list(6)
    upcoming = [fmt_event(e) for e in upcoming_raw]

    # 4. Cross-category popular pages
    cross_cats = {"f1": ["football", "concert"], "football": ["f1", "concert", "worldcup"],
                  "concert": ["football", "f1"], "worldcup": ["football", "f1"]}
    similar = []
    for cc in cross_cats.get(category, ["f1", "concert"]):
        sp = await db.seo_pages.find(
            {"category": cc, "slug": {"$nin": list(seen)}},
            {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "price_low": 1, "venue": 1}
        ).limit(3).to_list(3)
        similar.extend(fmt_seo(p) for p in sp if p["slug"] not in seen)
        seen.update(p["slug"] for p in sp)

    return {
        "related_pages": related_pages[:6],
        "city_events": city_pages[:6],
        "upcoming_events": upcoming[:6],
        "similar_pages": similar[:6],
    }


# ─── Content Generation Endpoints ─────────────────────────────────────

@router.post("/seo/generate-content")
async def generate_content_endpoint(batch_size: int = 5):
    """Generate AI content for a batch of SEO pages that still have template content."""
    try:
        from services.content_generator import generate_content_batch
        result = await generate_content_batch(batch_size=batch_size)
        return {"status": "success", **result}
    except Exception as e:
        logger.error(f"Content generation error: {e}")
        import traceback
        return {"status": "error", "message": str(e), "traceback": traceback.format_exc()}


@router.get("/seo/content-stats")
async def content_stats_endpoint():
    """Get content generation progress statistics."""
    try:
        from services.content_generator import get_content_stats
        stats = await get_content_stats()
        return {"status": "success", **stats}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.post("/seo/generate-content-single/{slug}")
async def generate_content_single(slug: str):
    """Generate AI content for a specific SEO page by slug."""
    page = await db.seo_pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    try:
        from services.content_generator import generate_content_for_page
        content = await generate_content_for_page(page)
        if content and len(content) > 200:
            await db.seo_pages.update_one(
                {"slug": slug},
                {"$set": {
                    "content": content,
                    "content_generated_at": datetime.now(timezone.utc).isoformat(),
                    "content_quality": "ai_generated",
                    "updated_at": datetime.now(timezone.utc),
                }},
            )
            return {"status": "success", "slug": slug, "content_length": len(content), "preview": content[:300]}
        return {"status": "error", "message": "Generated content was too short or empty"}
    except Exception as e:
        logger.error(f"Single content generation error for {slug}: {e}")
        return {"status": "error", "message": str(e)}


# Background job state
_content_job = {"running": False, "generated": 0, "errors": 0, "total": 0, "started_at": None}

@router.post("/seo/generate-content-bulk")
async def generate_content_bulk(batch_size: int = 5):
    """Start bulk content generation as a background task."""
    import asyncio
    from services.content_generator import generate_content_for_page, get_content_stats

    if _content_job["running"]:
        return {"status": "already_running", **_content_job}

    stats = await get_content_stats()
    remaining = stats["template_only"]
    if remaining == 0:
        return {"status": "complete", "message": "All pages already have AI content", **stats}

    _content_job["running"] = True
    _content_job["generated"] = 0
    _content_job["errors"] = 0
    _content_job["total"] = remaining
    _content_job["started_at"] = datetime.now(timezone.utc).isoformat()

    async def _run_bulk():
        try:
            while True:
                pages = await db.seo_pages.find(
                    {"content_generated_at": {"$exists": False}},
                    {"_id": 0},
                ).limit(batch_size).to_list(batch_size)
                if not pages:
                    break
                for page in pages:
                    try:
                        content = await generate_content_for_page(page)
                        if content and len(content) > 200:
                            await db.seo_pages.update_one(
                                {"slug": page["slug"]},
                                {"$set": {
                                    "content": content,
                                    "content_generated_at": datetime.now(timezone.utc).isoformat(),
                                    "content_quality": "ai_generated",
                                    "updated_at": datetime.now(timezone.utc),
                                }},
                            )
                            _content_job["generated"] += 1
                        else:
                            _content_job["errors"] += 1
                    except RuntimeError as re:
                        if "BUDGET_EXCEEDED" in str(re):
                            _content_job["running"] = False
                            _content_job["stopped_reason"] = "budget_exceeded"
                            logger.warning("Bulk generation stopped: LLM budget exceeded")
                            return
                        _content_job["errors"] += 1
                    except Exception as e:
                        logger.error(f"Bulk gen error for {page.get('slug')}: {e}")
                        _content_job["errors"] += 1
                        await asyncio.sleep(2)
                # Brief pause between batches to avoid rate limiting
                await asyncio.sleep(1)
        except Exception as e:
            logger.error(f"Bulk generation stopped: {e}")
        finally:
            _content_job["running"] = False

    asyncio.create_task(_run_bulk())
    return {"status": "started", "total_to_generate": remaining, "batch_size": batch_size}


@router.get("/seo/generate-content-status")
async def content_generation_status():
    """Check the status of the bulk content generation job."""
    from services.content_generator import get_content_stats
    stats = await get_content_stats()
    return {"job": _content_job, "stats": stats}


@router.post("/seo/generate-template-content")
async def generate_template_content_endpoint():
    """Generate smart template content for ALL pages without AI content. Free, instant, no API needed."""
    try:
        from services.template_generator import generate_all_template_content
        result = await generate_all_template_content()
        return {"status": "success", **result}
    except Exception as e:
        logger.error(f"Template generation error: {e}")
        import traceback
        return {"status": "error", "message": str(e), "traceback": traceback.format_exc()}


@router.post("/seo/force-index-all")
async def force_index_all():
    """Submit ALL URLs via Bing API + Yandex IndexNow + Google Ping. Maximum indexing push."""
    urls = await _collect_all_urls()
    results = {"total_urls": len(urls), "engines": {}}
    
    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        # 1. Bing URL Submission API (respects daily quota ~100 URLs)
        if BING_API_KEY:
            bing_submitted = 0
            for i in range(0, len(urls), 50):
                batch = urls[i:i+50]
                try:
                    r = await client.post(
                        f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={BING_API_KEY}",
                        json={"siteUrl": SITE_URL, "urlList": batch},
                        headers={"Content-Type": "application/json; charset=utf-8"}
                    )
                    if r.status_code == 200:
                        bing_submitted += len(batch)
                    elif "Quota" in r.text or "quota" in r.text:
                        break
                except Exception:
                    break
            results["engines"]["bing_api"] = bing_submitted

        # 2. Yandex IndexNow (no quota issues)
        yandex_submitted = 0
        for i in range(0, len(urls), 5000):
            batch = urls[i:i+5000]
            try:
                r = await client.post("https://yandex.com/indexnow", json={
                    "host": "euromatchtickets.com",
                    "key": INDEXNOW_KEY,
                    "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
                    "urlList": batch
                })
                if r.status_code in [200, 202]:
                    yandex_submitted += len(batch)
            except Exception:
                pass
        results["engines"]["yandex"] = yandex_submitted
        
        # 3. Google Sitemap Pings
        google_pings = 0
        for sitemap in ["sitemap-index.xml", "sitemap.xml"]:
            try:
                r = await client.get(f"https://www.google.com/ping?sitemap={SITE_URL}/{sitemap}")
                if r.status_code == 200:
                    google_pings += 1
            except Exception:
                pass
        results["engines"]["google_sitemap_pings"] = google_pings
    
    return {"status": "success", **results}
