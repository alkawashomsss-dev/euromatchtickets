from fastapi import APIRouter, HTTPException, Request, Response
from datetime import datetime, timezone
import os
import logging

from database.db import db
from config.settings import FRONTEND_URL

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


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
Disallow: /admin
Disallow: /api/
Allow: /api/sitemap.xml
Allow: /api/sitemap-index.xml
Allow: /api/sitemaps/
Allow: /api/robots.txt

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
    return page


# SEO Automation
@router.api_route("/seo/ping-search-engines", methods=["GET", "POST"])
async def seo_ping_engines():
    import httpx
    base_url = FRONTEND_URL
    sitemap_url = f"{base_url}/api/sitemap.xml"
    results = {}
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(f"https://www.google.com/ping?sitemap={sitemap_url}")
            results["google"] = {"status": r.status_code, "success": r.status_code == 200}
        except Exception:
            results["google"] = {"status": "error"}
        try:
            r = await client.get(f"https://www.bing.com/ping?sitemap={sitemap_url}")
            results["bing"] = {"status": r.status_code, "success": r.status_code == 200}
        except Exception:
            results["bing"] = {"status": "error"}
    return {"sitemap_url": sitemap_url, "results": results}


@router.get("/seo/audit")
async def seo_audit_page(url: str = ""):
    return {"status": "audit_available", "message": "Use Google Search Console for detailed audits"}


@router.get("/seo/internal-links/{event_type}")
async def seo_get_internal_links(event_type: str):
    events = await db.events.find({"event_type": event_type, "status": {"$ne": "cancelled"}}, {"_id": 0, "event_id": 1, "title": 1}).to_list(20)
    return [{"url": f"/event/{e['event_id']}", "title": e['title']} for e in events]
