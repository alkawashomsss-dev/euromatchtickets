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


@router.post("/seo/fix-duplicate-products")
async def fix_duplicate_products():
    """Set redirect_to on SEO pages that overlap with dedicated landing pages."""
    redirects = {
        "spa-francorchamps": "f1-belgian-grand-prix-spa-tickets",
        "belgian-grand-prix": "f1-belgian-grand-prix-spa-tickets",
        "spa-f1": "f1-belgian-grand-prix-spa-tickets",
        "belgian-gp": "f1-belgian-grand-prix-spa-tickets",
        "monaco-grand-prix": "f1-monaco-grand-prix-tickets",
        "monaco-gp": "f1-monaco-grand-prix-tickets",
        "justin-bieber-amsterdam": "justin-bieber-amsterdam-2026-tickets",
        "bieber-amsterdam": "justin-bieber-amsterdam-2026-tickets",
        "el-clasico": "el-clasico-tickets",
        "taylor-swift-london": "taylor-swift-london-tickets",
        "taylor-swift-wembley": "taylor-swift-london-tickets",
        "champions-league-final": "champions-league-tickets",
    }
    pages = await db.seo_pages.find({"active": True}, {"_id": 1, "slug": 1}).to_list(3000)
    updated = 0
    for p in pages:
        slug = p.get("slug", "")
        for prefix, target in redirects.items():
            if slug.startswith(prefix) and slug != target:
                await db.seo_pages.update_one({"_id": p["_id"]}, {"$set": {"redirect_to": target}})
                updated += 1
                break
    return {"updated": updated}




@router.post("/seo/bulk-import")
async def bulk_import_seo_pages(request: Request):
    """Import SEO pages in bulk - used to sync preview DB to production."""
    try:
        data = await request.json()
        pages = data.get("pages", [])
        if not pages:
            return {"status": "error", "message": "No pages provided"}
        
        imported = 0
        for page in pages:
            slug = page.get("slug")
            if not slug:
                continue
            # Upsert - update if exists, insert if not
            await db.seo_pages.update_one(
                {"slug": slug},
                {"$set": page},
                upsert=True
            )
            imported += 1
        
        total = await db.seo_pages.count_documents({})
        return {"status": "success", "imported": imported, "total_in_db": total}
    except Exception as e:
        logger.error(f"Bulk import error: {e}")
        return {"status": "error", "message": str(e)}



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
    xml_items.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')

    # Image mapping for automatic image assignment
    def _get_image(path):
        p = path.lower()
        if any(x in p for x in ["f1", "grand-prix", "gp-", "formula", "silverstone", "monza", "monaco", "spa-", "zandvoort", "bahrain-gp", "miami-gp"]):
            return f"{base_url}/images/heroes/f1-red-lg.webp"
        if any(x in p for x in ["motogp", "isle-of-man", "mugello"]):
            return f"{base_url}/images/heroes/motogp-lg.webp"
        if any(x in p for x in ["world-cup", "worldcup", "fifa", "wm-2026"]):
            return f"{base_url}/images/heroes/worldcup-trophy-lg.webp"
        if any(x in p for x in ["concert", "tour-2026", "bieber", "swift", "weeknd", "bruno", "coldplay", "metallica", "harry-styles", "bad-bunny", "maroon", "guns-n-roses", "legend", "acl-festival"]):
            return f"{base_url}/images/heroes/concert-purple-lg.webp"
        if any(x in p for x in ["champions", "clasico", "premier", "super-bowl", "team/", "football", "united", "chelsea", "arsenal", "liverpool", "barcelona", "madrid", "bayern", "juventus", "psg"]):
            return f"{base_url}/images/heroes/football-stadium-lg.webp"
        return f"{base_url}/og-image.jpg"

    def _url_with_image(loc, lastmod, freq, prio, title_hint=""):
        img = _get_image(loc)
        title = title_hint or loc.split("/")[-1].replace("-", " ").title()
        return f'  <url>\n    <loc>{loc}</loc>\n    <lastmod>{lastmod}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>\n    <image:image>\n      <image:loc>{img}</image:loc>\n      <image:title>{title}</image:title>\n    </image:image>\n  </url>'

    static_pages = [
        ("/", "1.0", "daily"), ("/events", "0.9", "hourly"), ("/blog", "0.8", "daily"),
        ("/f1-tickets", "0.95", "daily"), ("/f1-tickets-2026", "0.95", "daily"),
        ("/f1-schedule-2026", "0.90", "daily"),
        ("/f1-belgian-grand-prix-spa-tickets", "0.98", "daily"),
        ("/f1-monaco-grand-prix-tickets", "0.95", "daily"),
        ("/f1-british-grand-prix-silverstone-tickets", "0.95", "daily"),
        ("/f1-singapore-grand-prix-tickets", "0.95", "daily"),
        ("/f1-las-vegas-grand-prix-tickets", "0.95", "daily"),
        ("/f1-dutch-grand-prix-zandvoort-tickets", "0.95", "daily"),
        ("/f1-miami-grand-prix-tickets", "0.95", "daily"),
        ("/f1-japanese-grand-prix-suzuka-tickets", "0.95", "daily"),
        ("/f1-australian-grand-prix-melbourne-tickets", "0.95", "daily"),
        ("/f1-bahrain-grand-prix-tickets", "0.95", "daily"),
        ("/f1-saudi-arabian-grand-prix-jeddah-tickets", "0.95", "daily"),
        ("/f1-spanish-grand-prix-barcelona-tickets", "0.95", "daily"),
        ("/f1-hungarian-grand-prix-budapest-tickets", "0.95", "daily"),
        ("/f1-austrian-grand-prix-red-bull-ring-tickets", "0.95", "daily"),
        ("/f1-abu-dhabi-grand-prix-tickets", "0.95", "daily"),
        ("/f1-italian-grand-prix-monza-tickets", "0.95", "daily"),
        ("/f1-mexico-grand-prix-tickets", "0.90", "daily"),
        ("/champions-league-tickets", "0.95", "daily"),
        ("/el-clasico-tickets", "0.95", "daily"),
        ("/bayern-munich-vs-real-madrid-tickets", "0.95", "daily"),
        ("/super-bowl-2026-tickets", "0.95", "daily"),
        ("/premier-league-tickets", "0.90", "daily"),
        ("/world-cup-2026-tickets", "0.95", "daily"),
        ("/world-cup-2026", "0.95", "daily"),
        ("/justin-bieber-amsterdam-2026-tickets", "0.98", "daily"),
        ("/taylor-swift-london-tickets", "0.95", "daily"),
        ("/the-weeknd-tour-2026", "0.95", "daily"),
        ("/bruno-mars-tour-2026", "0.95", "daily"),
        ("/bad-bunny-london-2026", "0.90", "daily"),
        ("/coldplay-tour-2026", "0.90", "daily"),
        ("/guns-n-roses-tour-2026", "0.90", "daily"),
        ("/metallica-sphere-las-vegas-tickets", "0.90", "daily"),
        ("/harry-styles-tickets", "0.90", "daily"),
        ("/maroon-5-tour-2026", "0.85", "daily"),
        ("/john-legend-tour-2026", "0.85", "daily"),
        ("/motogp-tickets", "0.90", "daily"),
        ("/isle-of-man-tt-tickets", "0.90", "daily"),
        ("/motogp-schedule-2026", "0.85", "daily"),
        ("/world-athletics-2026-tickets", "0.90", "daily"),
        ("/bahrain-world-cup-tickets-2026", "0.90", "daily"),
        ("/acl-festival-2026", "0.85", "daily"),
        ("/monaco-grand-prix-tickets", "0.90", "daily"),
        ("/team/real-madrid", "0.85", "daily"),
        ("/team/barcelona", "0.85", "daily"),
        ("/team/manchester-city", "0.85", "daily"),
        ("/team/liverpool", "0.85", "daily"),
        ("/team/arsenal", "0.85", "daily"),
        ("/team/bayern-munich", "0.85", "daily"),
        ("/team/psg", "0.85", "daily"),
        ("/team/juventus", "0.85", "daily"),
        ("/best-f1-races-europe", "0.75", "weekly"),
        ("/how-to-buy-f1-tickets", "0.75", "weekly"),
        ("/f1-ticket-prices-guide", "0.75", "weekly"),
        ("/events-this-weekend", "0.80", "daily"),
        ("/reviews", "0.7", "weekly"), ("/faq", "0.7", "monthly"),
        ("/about", "0.6", "monthly"), ("/contact", "0.6", "monthly"),
        ("/buyer-protection", "0.7", "monthly"), ("/terms", "0.5", "monthly"),
        ("/sell", "0.7", "weekly"), ("/prices", "0.7", "weekly"),
        ("/es/comprar-entradas", "0.90", "weekly"),
        ("/es/entradas-champions-league", "0.85", "weekly"),
        ("/es/entradas-f1", "0.85", "weekly"),
        ("/es/entradas-conciertos", "0.85", "weekly"),
        ("/es/entradas-copa-del-mundo-2026", "0.90", "weekly"),
        ("/de/tickets-kaufen", "0.90", "weekly"),
        ("/de/champions-league-tickets", "0.85", "weekly"),
        ("/de/formel-1-tickets", "0.85", "weekly"),
        ("/de/bundesliga-tickets", "0.85", "weekly"),
        ("/de/konzert-tickets", "0.85", "weekly"),
        ("/de/wm-2026-tickets", "0.90", "weekly"),
    ]
    for path, prio, freq in static_pages:
        xml_items.append(_url_with_image(f"{base_url}{path}", today, freq, prio))

    today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    today_dt = datetime.now(timezone.utc)

    # TOP 10 HIGH-DEMAND SLUGS — boosted priority & crawl frequency
    TOP10_HIGH_DEMAND = {
        "el-clasico-real-madrid-vs-barcelona-2026-tickets",
        "fifa-world-cup-2026-final-match-104",
        "monaco-grand-prix-2026-tickets",
        "uefa-champions-league-final-2026-munich-tickets",
        "coldplay-tour-2026-tickets",
        "taylor-swift-eras-tour-2026-london-tickets",
        "miami-grand-prix-2026-tickets",
        "british-grand-prix-2026-tickets",
        "spanish-motogp-2026-jerez-tickets",
        "roland-garros-2026-final-paris-2026-tickets",
    }

    events = await db.events.find({"status": {"$nin": ["cancelled", "past_event", "expired"]}, "event_date": {"$gte": today_dt}}, {"_id": 0, "event_id": 1, "slug": 1, "title": 1, "event_type": 1, "image_url": 1}).to_list(1000)
    for event in events:
        slug = event.get("slug", event["event_id"])
        loc = f"{base_url}/event/{slug}"
        # Prefer unique event image; fallback to category hero
        ev_img = event.get("image_url")
        if ev_img:
            # Make image URL absolute for Google
            img = ev_img if ev_img.startswith("http") else f"{base_url}{ev_img}"
        else:
            et = event.get("event_type", "")
            if et == "f1":
                img = f"{base_url}/images/heroes/f1-red-lg.webp"
            elif et in ("match", "football"):
                img = f"{base_url}/images/heroes/football-stadium-lg.webp"
            elif et == "concert":
                img = f"{base_url}/images/heroes/concert-purple-lg.webp"
            else:
                img = f"{base_url}/og-image.jpg"
        title = event.get("title", slug.replace("-", " ").title())
        # Boost TOP 10 high-demand events: priority 1.0 + hourly crawl
        if slug in TOP10_HIGH_DEMAND:
            priority = "1.0"
            freq = "hourly"
        else:
            priority = "0.85"
            freq = "daily"
        xml_items.append(f'  <url>\n    <loc>{loc}</loc>\n    <lastmod>{today_str}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{priority}</priority>\n    <image:image>\n      <image:loc>{img}</image:loc>\n      <image:title>{title}</image:title>\n    </image:image>\n  </url>')

    articles = await db.articles.find({}, {"_id": 0, "slug": 1, "date_generated": 1, "title": 1}).to_list(5000)
    for a in articles:
        d = a.get("date_generated", "")
        lm = d.strftime('%Y-%m-%d') if isinstance(d, datetime) else today
        title = a.get("title", a["slug"].replace("-", " ").title())
        xml_items.append(f'  <url>\n    <loc>{base_url}/blog/{a["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.70</priority>\n    <image:image>\n      <image:loc>{base_url}/og-image.jpg</image:loc>\n      <image:title>{title}</image:title>\n    </image:image>\n  </url>')

    seo_pages = await db.seo_pages.find({"active": True, "redirect_to": {"$exists": False}}, {"_id": 0, "slug": 1, "title": 1, "category": 1, "updated_at": 1, "priority": 1}).to_list(50000)
    cat_imgs = {"f1": "f1-red-lg.webp", "football": "football-stadium-lg.webp", "concert": "concert-purple-lg.webp", "worldcup": "worldcup-trophy-lg.webp", "motorsport": "motogp-lg.webp", "motogp": "motogp-lg.webp"}
    for p in seo_pages:
        lm = p.get("updated_at", "")
        lm = lm.strftime('%Y-%m-%d') if isinstance(lm, datetime) else today
        cat = p.get("category", "other")
        img_file = cat_imgs.get(cat, "football-stadium-lg.webp")
        title = (p.get("title", "") or "").split("|")[0].strip() or p["slug"].replace("-", " ").title()
        xml_items.append(f'  <url>\n    <loc>{base_url}/{p["slug"]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{p.get("priority", 0.80)}</priority>\n    <image:image>\n      <image:loc>{base_url}/images/heroes/{img_file}</image:loc>\n      <image:title>{title}</image:title>\n    </image:image>\n  </url>')

    xml_items.append('</urlset>')
    return Response(content='\n'.join(xml_items), media_type="application/xml", headers={"Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600"})


# ============================================================
# GOOGLE MERCHANT CENTER PRODUCT FEED
# ============================================================

# Category-specific images for product feed
CATEGORY_IMAGES = {
    "f1": "/images/heroes/f1-red-lg.webp",
    "football": "/images/heroes/football-stadium-lg.webp",
    "concert": "/images/heroes/concert-purple-lg.webp",
    "worldcup": "/images/heroes/football-stadium-lg.webp",
    "motorsport": "/images/heroes/motogp-lg.webp",
    "motogp": "/images/heroes/motogp-lg.webp",
}

# Google product category taxonomy for event tickets
GOOGLE_PRODUCT_CATEGORIES = {
    "f1": "Arts & Entertainment > Event Tickets > Sporting Event Tickets",
    "football": "Arts & Entertainment > Event Tickets > Sporting Event Tickets",
    "concert": "Arts & Entertainment > Event Tickets > Concert & Music Festival Tickets",
    "worldcup": "Arts & Entertainment > Event Tickets > Sporting Event Tickets",
    "motorsport": "Arts & Entertainment > Event Tickets > Sporting Event Tickets",
    "motogp": "Arts & Entertainment > Event Tickets > Sporting Event Tickets",
}

def _xml_escape(text):
    """Escape special XML characters."""
    if not text:
        return ""
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;")


def _build_clean_gmc_description(title, category, city, venue, year):
    """Generate a clean, factual description for Google Merchant Center.
    ONLY product info - no marketplace mentions, no promotional text."""
    import re as _re
    clean_name = _re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', title, flags=_re.IGNORECASE).strip()
    clean_name = _re.sub(r'\s*\|\s*.*$', '', clean_name).strip()
    clean_name = _re.sub(r'\s*[\u2013\u2014–—-]+\s*(Verified|UEFA|FIFA|F1|Seller).*$', '', clean_name, flags=_re.IGNORECASE).strip()
    clean_name = _re.sub(r'^(Buy|Get|Order|Book|How to Buy|How to Get|How to Book)\s+', '', clean_name, flags=_re.IGNORECASE).strip()
    clean_name = _re.sub(r'\b(Cheap|Cheapest|Best|Top|Ranked|Verified)\b', '', clean_name, flags=_re.IGNORECASE).strip()
    clean_name = _re.sub(r'\s*Tickets?\s*$', '', clean_name, flags=_re.IGNORECASE).strip()
    clean_name = _re.sub(r'\s*Tickets?\s+', ' ', clean_name, flags=_re.IGNORECASE).strip()
    
    venue_text = f" at {venue}" if venue and venue != city and venue != "Europe" else ""
    city_text = f", {city}" if city and city != "Europe" else ""
    
    if category == "f1":
        return f"Ticket for {clean_name}{venue_text}{city_text}. Formula 1 {year} season race. Includes circuit access and seated grandstand."
    elif category == "football":
        return f"Ticket for {clean_name}{venue_text}{city_text}. {year} season football match. Includes stadium entry and allocated seat."
    elif category == "concert":
        return f"Ticket for {clean_name}{venue_text}{city_text}. Live concert, {year}. Includes venue entry and seat allocation."
    elif category == "worldcup":
        return f"Ticket for {clean_name}{venue_text}{city_text}. FIFA World Cup {year} match. Includes stadium entry and allocated seat."
    elif category in ("motorsport", "motogp"):
        return f"Ticket for {clean_name}{venue_text}{city_text}. Motorsport race, {year} season. Includes circuit access and grandstand seat."
    else:
        return f"Ticket for {clean_name}{venue_text}{city_text}. Event in {year}. Includes venue entry and seat allocation."


# Brand mapping by category for Google Merchant Center
GMC_BRAND_MAP = {
    "f1": "Formula 1",
    "football": "UEFA",
    "concert": "Live Nation",
    "worldcup": "FIFA",
    "motorsport": "MotoGP",
    "motogp": "MotoGP",
}

# ============================================================
# DYNAMIC PRODUCT IMAGES FOR GOOGLE MERCHANT CENTER
# ============================================================

# Multiple base images per category for variety
CATEGORY_BASE_IMAGES = {
    "f1": ["f1-red-lg.webp", "f1-lg.webp", "f1-race-lg.webp", "f1-pitstop-lg.webp"],
    "football": ["football-stadium-lg.webp", "football-lg.webp", "football-match-lg.webp", "football-penalty-lg.webp"],
    "concert": ["concert-purple-lg.webp", "concert-lg.webp", "concert-live-lg.webp", "concert-drums-lg.webp"],
    "worldcup": ["worldcup-lg.webp", "worldcup-trophy-lg.webp", "worldcup-final-lg.webp", "football-stadium-lg.webp"],
    "motorsport": ["motogp-lg.webp", "motogp-orange-lg.webp"],
    "motogp": ["motogp-lg.webp", "motogp-orange-lg.webp"],
}

_IMAGE_CACHE_DIR = "/tmp/gmc-images"
os.makedirs(_IMAGE_CACHE_DIR, exist_ok=True)


@router.get("/merchant/product-image/{slug}.jpg")
async def generate_product_image(slug: str):
    """Generate a unique product image with event name overlay for Google Merchant Center."""
    import hashlib
    from PIL import Image, ImageDraw, ImageFont
    from io import BytesIO

    # Check cache first
    cache_path = os.path.join(_IMAGE_CACHE_DIR, f"{slug}.jpg")
    if os.path.exists(cache_path):
        with open(cache_path, "rb") as f:
            return Response(content=f.read(), media_type="image/jpeg",
                          headers={"Cache-Control": "public, max-age=604800"})

    # Get product info from DB
    page = await db.seo_pages.find_one(
        {"slug": slug, "active": True},
        {"_id": 0, "title": 1, "category": 1, "city": 1, "venue": 1, "year": 1}
    )
    if not page:
        raise HTTPException(status_code=404, detail="Product not found")

    cat = page.get("category", "other")
    title = page.get("title", slug).split("|")[0].strip()
    city = page.get("city", "")
    venue = page.get("venue", "")
    year = page.get("year", 2026)

    # Clean title
    import re as _re
    clean_title = title
    for s in ["| EuroMatchTickets", "| EMT"]:
        clean_title = clean_title.replace(s, "").strip()
    clean_title = _re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', clean_title, flags=_re.IGNORECASE).strip()
    clean_title = _re.sub(r'^(Buy|Get|Order|Book|Grab|Shop|How to Buy|How to Get|How to Book)\s+', '', clean_title, flags=_re.IGNORECASE).strip()
    clean_title = _re.sub(r'\s*[\u2013\u2014–—-]+\s*(Verified|UEFA|FIFA|F1|Seller).*$', '', clean_title, flags=_re.IGNORECASE).strip()
    clean_title = _re.sub(r'\b(Cheap|Cheapest|Best|Top|Ranked|Verified)\b', '', clean_title, flags=_re.IGNORECASE).strip()
    clean_title = _re.sub(r'\s{2,}', ' ', clean_title).strip().rstrip(' \u2013\u2014\u2015\u2010-!.')

    # Pick base image based on slug hash for consistent variety
    base_images = CATEGORY_BASE_IMAGES.get(cat, ["football-stadium-lg.webp"])
    img_index = int(hashlib.md5(slug.encode()).hexdigest(), 16) % len(base_images)
    base_img_name = base_images[img_index]
    base_img_path = f"/app/frontend/public/images/heroes/{base_img_name}"

    if not os.path.exists(base_img_path):
        base_img_path = "/app/frontend/public/images/heroes/football-stadium-lg.webp"

    # Open and resize base image
    img = Image.open(base_img_path).convert("RGB")
    img = img.resize((1200, 628), Image.LANCZOS)
    draw = ImageDraw.Draw(img)

    # Add dark gradient overlay at bottom
    for y in range(img.height // 2, img.height):
        alpha = int(200 * (y - img.height // 2) / (img.height // 2))
        draw.line([(0, y), (img.width, y)], fill=(0, 0, 0, alpha))

    # Add semi-transparent overlay for text readability
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([(0, img.height - 200), (img.width, img.height)], fill=(0, 0, 0, 160))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Load fonts
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSansBold.ttf", 42)
        font_sub = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSans.ttf", 28)
        font_brand = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSansBold.ttf", 20)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = font_title
        font_brand = font_title

    # Draw event title
    title_y = img.height - 170
    draw.text((50, title_y), clean_title, font=font_title, fill=(255, 255, 255))

    # Draw city/venue info
    location_text = venue if venue and venue != city else city
    if location_text and location_text != "Europe":
        draw.text((50, title_y + 55), location_text, font=font_sub, fill=(200, 200, 200))

    # Draw brand bar
    draw.text((50, img.height - 45), "EUROMATCHTICKETS.COM", font=font_brand, fill=(255, 200, 50))

    # Save to cache and return
    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=85, optimize=True)
    img_bytes = buffer.getvalue()

    with open(cache_path, "wb") as f:
        f.write(img_bytes)

    return Response(content=img_bytes, media_type="image/jpeg",
                   headers={"Cache-Control": "public, max-age=604800"})


@router.get("/merchant/feed.xml")
async def google_merchant_feed():
    """
    Google Merchant Center Product Feed (RSS 2.0 with Google namespace).
    Serves all active ticket products for Google Shopping.
    """
    base_url = SITE_URL

    # Fetch all active SEO pages with prices
    pages = await db.seo_pages.find(
        {"active": True, "price_low": {"$gt": 0}},
        {"_id": 0, "slug": 1, "title": 1, "description": 1, "meta_description": 1,
         "category": 1, "city": 1, "country": 1, "venue": 1, "year": 1,
         "price_low": 1, "price_high": 1, "page_type": 1, "keywords": 1}
    ).to_list(5000)

    xml_parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
        '<channel>',
        f'<title>EuroMatchTickets - Event Tickets</title>',
        f'<link>{base_url}</link>',
        '<description>Independent ticket resale marketplace for football, Formula 1, concerts and sports events across Europe.</description>',
    ]

    for page in pages:
        slug = page.get("slug", "")
        title = page.get("title", "").split("|")[0].strip()
        cat = page.get("category", "other")
        city = page.get("city", "Europe")
        country = page.get("country", "EU")
        venue = page.get("venue", "")
        price_low = page.get("price_low", 0)
        price_high = page.get("price_high", 0)
        year = page.get("year", 2026)

        # Clean title - remove price, brand suffix, promotional text, and punctuation
        clean_title = title
        for suffix in ["| EuroMatchTickets", "| EMT"]:
            clean_title = clean_title.replace(suffix, "").strip()
        import re as _re
        clean_title = _re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', clean_title, flags=_re.IGNORECASE).strip()
        clean_title = _re.sub(r'\s*€\d+[\d,.]*', '', clean_title).strip()
        clean_title = _re.sub(r'^(Buy|Get|Order|Book|Grab|Shop|How to Buy|How to Get|How to Book)\s+', '', clean_title, flags=_re.IGNORECASE).strip()
        clean_title = _re.sub(r'\s*[\u2013\u2014–—-]+\s*(Verified|UEFA|FIFA|F1|Seller).*$', '', clean_title, flags=_re.IGNORECASE).strip()
        clean_title = _re.sub(r'\b(Cheap|Cheapest|Best|Top|Ranked|Verified)\b', '', clean_title, flags=_re.IGNORECASE).strip()
        clean_title = _re.sub(r'\s{2,}', ' ', clean_title).strip().rstrip(' \u2013\u2014\u2015\u2010-!.')

        # Build description - MUST be purely factual for Google Merchant Center
        desc = _build_clean_gmc_description(clean_title, cat, city, venue, year)

        # Image URL - unique static JPEG per product
        img_url = f"{base_url}/product-images/{slug}.jpg"

        # Google product category
        g_cat = GOOGLE_PRODUCT_CATEGORIES.get(cat, "Arts & Entertainment > Event Tickets")

        # Product type (custom taxonomy)
        if cat == "f1":
            product_type = f"Tickets > Motorsport > Formula 1 > {city}"
        elif cat == "football":
            product_type = f"Tickets > Football > {city}"
        elif cat == "concert":
            product_type = f"Tickets > Concerts > {city}"
        elif cat == "worldcup":
            product_type = f"Tickets > Football > FIFA World Cup 2026 > {city}"
        else:
            product_type = f"Tickets > Sports > {city}"

        # Country code mapping
        country_codes = {
            "GB": "GB", "UK": "GB", "US": "US", "USA": "US",
            "ES": "ES", "Spain": "ES", "IT": "IT", "Italy": "IT",
            "DE": "DE", "Germany": "DE", "FR": "FR", "France": "FR",
            "NL": "NL", "Netherlands": "NL", "BE": "BE", "Belgium": "BE",
            "PT": "PT", "Portugal": "PT", "AT": "AT", "Austria": "AT",
            "IE": "IE", "Ireland": "IE", "TR": "TR", "Turkey": "TR",
            "BH": "BH", "Bahrain": "BH", "CA": "CA", "Canada": "CA",
            "MX": "MX", "Mexico": "MX", "IM": "GB", "EU": "DE",
            "SG": "SG", "AE": "AE", "JP": "JP", "AU": "AU", "BR": "BR",
        }
        iso_country = country_codes.get(country, "DE")

        # Product ID - max 50 chars
        product_id = slug[:50] if len(slug) <= 50 else slug[:42] + slug[-8:]
        
        # ALL target countries - Google auto-converts EUR to local currency
        all_target_countries = [
            "AT", "FI", "FR", "GR", "IE", "IT", "NL", "ES", "PT",
            "GB", "CH", "PL", "SE", "DK", "NO", "RO", "UA", "RU", "TR",
            "CZ", "HU",
            "US", "CA", "AR", "UY", "MX",
            "AE", "SA", "KW", "LB",
            "AU", "HK", "JP",
        ]
        
        # Single currency (EUR) - Google converts automatically
        ship = ''.join(f'<g:shipping><g:country>{c}</g:country><g:price>0 EUR</g:price></g:shipping>' for c in all_target_countries)
        
        # Brand - use actual event organizer, not marketplace name
        brand = GMC_BRAND_MAP.get(cat, "EuroMatchTickets")

        xml_parts.append(
            f'<item>'
            f'<g:id>{_xml_escape(product_id)}</g:id>'
            f'<g:title>{_xml_escape(clean_title)}</g:title>'
            f'<g:description>{_xml_escape(desc[:300])}</g:description>'
            f'<g:link>{base_url}/{slug}</g:link>'
            f'<g:image_link>{img_url}</g:image_link>'
            f'<g:price>{price_low} EUR</g:price>'
            f'<g:availability>in_stock</g:availability>'
            f'<g:condition>new</g:condition>'
            f'<g:brand>{_xml_escape(brand)}</g:brand>'
            f'<g:google_product_category>499969</g:google_product_category>'
            f'<g:product_type>{_xml_escape(product_type)}</g:product_type>'
            f'<g:identifier_exists>false</g:identifier_exists>'
            f'{ship}'
            f'</item>'
        )

    xml_parts.append('</channel>')
    xml_parts.append('</rss>')

    return Response(
        content='\n'.join(xml_parts),
        media_type="application/xml",
        headers={
            "Content-Type": "application/xml; charset=utf-8",
            "Content-Disposition": "attachment; filename=merchant-feed.xml",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Robots-Tag": "noindex"
        }
    )


@router.get("/merchant/feed.tsv")
async def google_merchant_feed_tsv():
    """Google Merchant Center feed in TSV format - Global Setup: EUR only, Google auto-converts."""
    import re as _re
    base_url = SITE_URL

    all_target_countries = [
        "AT", "FI", "FR", "GR", "IE", "IT", "NL", "ES", "PT",
        "GB", "CH", "PL", "SE", "DK", "NO", "RO", "UA", "RU", "TR",
        "CZ", "HU", "US", "CA", "AR", "UY", "MX",
        "AE", "SA", "KW", "LB", "AU", "HK", "JP",
    ]

    pages = await db.seo_pages.find(
        {"active": True, "price_low": {"$gt": 0}},
        {"_id": 0, "slug": 1, "title": 1, "category": 1, "city": 1, "venue": 1, "year": 1, "price_low": 1}
    ).to_list(length=5000)

    rows = ["id\ttitle\tdescription\tlink\timage_link\tprice\tavailability\tcondition\tbrand\tgoogle_product_category\tproduct_type\tidentifier_exists\tshipping"]

    for page in pages:
        title = page.get("title", "").split("|")[0].strip()
        slug = page.get("slug", "")
        price_low = page.get("price_low", 0)
        cat = page.get("category", "events")
        city = page.get("city", "Europe")
        venue = page.get("venue", "")
        year = page.get("year", 2026)

        # Clean title - same logic as XML feed
        clean_title = title
        for s in ["| EuroMatchTickets", "| EMT"]:
            clean_title = clean_title.replace(s, "").strip()
        clean_title = _re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', clean_title, flags=_re.IGNORECASE).strip()
        clean_title = _re.sub(r'\s*€\d+[\d,.]*', '', clean_title).strip()
        clean_title = _re.sub(r'^(Buy|Get|Order|Book|Grab|Shop|How to Buy|How to Get|How to Book)\s+', '', clean_title, flags=_re.IGNORECASE).strip()
        clean_title = _re.sub(r'\b(Cheap|Cheapest|Best|Top|Ranked|Verified)\b', '', clean_title, flags=_re.IGNORECASE).strip()
        clean_title = _re.sub(r'\s{2,}', ' ', clean_title).strip().rstrip(' \u2013\u2014\u2015\u2010-!.')

        # Clean factual description - no promotional language
        desc = _build_clean_gmc_description(clean_title, cat, city, venue, year)
        desc = desc.replace('\t', ' ').replace('\n', ' ')[:300]
        clean_title = clean_title.replace('\t', ' ')

        img_url = f"{base_url}/product-images/{slug}.jpg"
        product_type = f"Event Tickets > {cat.replace('_', ' ').title()}"
        product_id = slug[:50] if len(slug) <= 50 else slug[:42] + slug[-8:]
        brand = GMC_BRAND_MAP.get(cat, "EuroMatchTickets")

        # Single currency (EUR) - Google auto-converts for target countries
        shipping = ",".join(f"{c}::0 EUR" for c in all_target_countries)

        rows.append(f"{product_id}\t{clean_title}\t{desc}\t{base_url}/{slug}\t{img_url}\t{price_low} EUR\tin_stock\tnew\t{brand}\t499969\t{product_type}\tfalse\t{shipping}")

    content = '\n'.join(rows)
    return Response(
        content=content,
        media_type="text/tab-separated-values",
        headers={
            "Content-Type": "text/tab-separated-values; charset=utf-8",
            "Content-Disposition": "attachment; filename=merchant-feed.tsv",
            "Cache-Control": "no-cache"
        }
    )


@router.get("/merchant/feed-status")
async def merchant_feed_status():
    """Check the status and stats of the Google Merchant Center feed."""
    total = await db.seo_pages.count_documents({"active": True, "price_low": {"$gt": 0}})
    by_cat = {}
    for cat in ["f1", "football", "concert", "worldcup", "motorsport", "motogp"]:
        count = await db.seo_pages.count_documents({"active": True, "price_low": {"$gt": 0}, "category": cat})
        if count > 0:
            by_cat[cat] = count

    return {
        "status": "active",
        "feed_url": f"{SITE_URL}/api/merchant/feed.xml",
        "total_products": total,
        "products_by_category": by_cat,
        "feed_format": "RSS 2.0 with Google Shopping namespace",
        "currency": "EUR",
        "shipping": "Free e-ticket delivery",
        "update_frequency": "hourly",
        "instructions": {
            "step_1": "Go to https://merchants.google.com",
            "step_2": "Add and verify your website: euromatchtickets.com",
            "step_3": f"Add feed URL: {SITE_URL}/api/merchant/feed.xml",
            "step_4": "Apply for Event Ticket Seller certification in Google Ads",
            "step_5": "Products will appear in Google Shopping within 2-5 days"
        }
    }



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

# Allow sitemaps
Allow: /api/sitemap-index.xml
Allow: /api/sitemap.xml
Allow: /api/sitemaps/
Allow: /api/merchant/feed.xml
Allow: /images/

# Block private/internal pages
Disallow: /admin
Disallow: /seller
Disallow: /owner
Disallow: /my-tickets
Disallow: /auth/
Disallow: /order/
Disallow: /alerts
Disallow: /checkout

# Block query parameter URLs (duplicate content)
Disallow: /events?city=
Disallow: /events?search=
Disallow: /events?type=
Disallow: /*?city=
Disallow: /*?search=

# Block API endpoints (except sitemaps & merchant)
Disallow: /api/
Allow: /api/sitemap
Allow: /api/sitemaps/
Allow: /api/merchant/
Allow: /api/robots.txt

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
    # Redirect for deactivated pages → find active equivalent
    if page.get("active") == False:
        if page.get("redirect_to"):
            return {"redirect_to": page["redirect_to"], "slug": slug}
        # Auto-redirect 2025 → 2026
        if "2025" in slug:
            new_slug = slug.replace("-2025", "-2026").replace("2025", "2026")
            target = await db.seo_pages.find_one({"slug": new_slug, "active": True}, {"_id": 0, "slug": 1})
            if target:
                return {"redirect_to": target["slug"], "slug": slug}
        # Find similar active page in same category
        cat = page.get("category", "other")
        related = await db.seo_pages.find(
            {"active": True, "category": cat, "slug": {"$ne": slug}},
            {"_id": 0, "slug": 1, "title": 1, "price_low": 1, "city": 1}
        ).limit(6).to_list(6)
        page["event_ended"] = True
        page["related_events"] = related
        return page
    return page


@router.post("/seo/activate-batch")
async def activate_next_batch(count: int = 100):
    """Activate the next batch of highest-priority inactive pages + auto-index them."""
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
    
    # Auto-index the newly activated pages
    try:
        from services.auto_indexer import submit_specific_urls
        new_urls = [f"{SITE_URL}/{p['slug']}" for p in inactive]
        submit_specific_urls(new_urls)
        logger.info(f"Auto-indexed {len(new_urls)} newly activated pages")
    except Exception as e:
        logger.warning(f"Auto-index after activation failed: {e}")

    return {
        "activated": result.modified_count,
        "total_active": active_total,
        "total_inactive": inactive_total,
        "auto_indexed": True,
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
    """NUCLEAR INDEX SUBMISSION - Submit ALL URLs to EVERY search engine possible."""
    if not urls:
        urls = await _collect_all_urls()

    results = {"total_urls": len(urls), "engines": {}}

    # ALL IndexNow endpoints (each one notifies different search engines)
    INDEXNOW_ENDPOINTS = [
        ("bing", "https://www.bing.com/indexnow"),
        ("yandex", "https://yandex.com/indexnow"),
        ("indexnow_api", "https://api.indexnow.org/indexnow"),
        ("seznam", "https://search.seznam.cz/indexnow"),
        ("naver", "https://searchadvisor.naver.com/indexnow"),
    ]

    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        # 1. Bing URL Submission API (daily quota ~100-500 URLs)
        if BING_API_KEY:
            bing_result = {"submitted": 0, "quota_exceeded": False}
            for i in range(0, min(len(urls), 500), 50):
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
                            bing_result["note"] = f"Daily quota reached after {bing_result['submitted']} URLs. Auto-retries tomorrow."
                            break
                        bing_result["last_error"] = resp
                except Exception as e:
                    bing_result["last_error"] = str(e)[:100]
                    break
            results["engines"]["bing_api"] = bing_result
        else:
            results["engines"]["bing_api"] = {"error": "No BING_WEBMASTER_API_KEY configured"}

        # 2. Submit to ALL IndexNow endpoints (10,000 URL limit per request)
        for engine_name, endpoint_url in INDEXNOW_ENDPOINTS:
            engine_result = {"submitted": 0, "errors": 0}
            for i in range(0, len(urls), 10000):
                batch = urls[i:i+10000]
                try:
                    r = await client.post(endpoint_url, json={
                        "host": "euromatchtickets.com",
                        "key": INDEXNOW_KEY,
                        "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
                        "urlList": batch
                    })
                    if r.status_code in [200, 202]:
                        engine_result["submitted"] += len(batch)
                    else:
                        engine_result["errors"] += len(batch)
                        engine_result["last_status"] = r.status_code
                except Exception as e:
                    engine_result["errors"] += len(batch)
                    engine_result["exception"] = str(e)[:50]
            results["engines"][f"indexnow_{engine_name}"] = engine_result

        # 3. Ping ALL individual sitemaps to Google AND Bing
        sitemap_files = [
            "sitemap.xml", "sitemap-core.xml", "sitemap-f1-motorsport.xml",
            "sitemap-football.xml", "sitemap-concerts.xml", "sitemap-worldcup.xml",
            "sitemap-city-regional.xml", "sitemap-events.xml",
            "sitemap-international.xml", "sitemap-guides.xml"
        ]
        ping_results = {"google": 0, "bing": 0, "errors": 0}
        for sm_file in sitemap_files:
            sitemap_url = f"{SITE_URL}/{sm_file}"
            for ping_url in [
                f"https://www.google.com/ping?sitemap={sitemap_url}",
                f"https://www.bing.com/ping?sitemap={sitemap_url}",
            ]:
                try:
                    r = await client.get(ping_url)
                    if r.status_code == 200:
                        if "google" in ping_url:
                            ping_results["google"] += 1
                        else:
                            ping_results["bing"] += 1
                except Exception:
                    ping_results["errors"] += 1
        results["engines"]["sitemap_pings"] = ping_results

    total_submitted = sum(
        v.get("submitted", 0) for v in results["engines"].values() if isinstance(v, dict)
    )
    results["total_submitted_across_engines"] = total_submitted
    results["engines_reached"] = len([
        k for k, v in results["engines"].items()
        if isinstance(v, dict) and v.get("submitted", 0) > 0
    ])

    # Log to DB
    try:
        await db.indexing_submissions.insert_one({
            "type": "nuclear_submit",
            "total_urls": len(urls),
            "total_submitted": total_submitted,
            "results": {k: v for k, v in results["engines"].items() if isinstance(v, dict)},
            "created_at": datetime.now(timezone.utc)
        })
    except Exception:
        pass

    return {"status": "success", **results}


@router.get("/seo/nuclear-status")
async def nuclear_indexing_status():
    """Full status of ALL indexing channels."""
    seo_count = await db.seo_pages.count_documents({"active": True})
    bing_submitted = await db.bing_submitted_urls.count_documents({})
    recent = await db.indexing_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    bing_logs = await db.bing_indexing_logs.find({}, {"_id": 0}).sort("created_at", -1).to_list(5)
    return {
        "active_seo_pages": seo_count,
        "indexing_channels": {
            "bing_api": {"status": "active", "daily_quota": 100, "submitted_total": bing_submitted, "auto_submits": "every 24h"},
            "indexnow_bing": {"status": "active", "limit": "10,000/request", "protocol": "IndexNow"},
            "indexnow_yandex": {"status": "active", "limit": "10,000/request", "protocol": "IndexNow"},
            "indexnow_seznam": {"status": "active", "limit": "10,000/request", "protocol": "IndexNow"},
            "indexnow_naver": {"status": "active", "limit": "10,000/request", "protocol": "IndexNow"},
            "indexnow_api": {"status": "active", "limit": "10,000/request", "protocol": "IndexNow (all engines)"},
            "google_sitemap_ping": {"status": "active", "sitemaps": 10, "auto_pings": "every 6h"},
            "google_indexing_api": {"status": "active" if os.path.exists("/app/backend/google-service-account.json") else "requires_setup",
                                    "quota": "200 URLs/day", "note": "Near-instant Google indexing"},
            "google_merchant_feed": {"status": "active", "products": seo_count, "feed_url": f"{SITE_URL}/api/merchant/feed.xml"},
        },
        "recent_nuclear_submissions": recent,
        "recent_bing_logs": bing_logs,
    }


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
        "/justin-bieber-amsterdam-2026-tickets": {"title": "Buy Justin Bieber Amsterdam Tickets 2026 | From \u20ac89 | Johan Cruijff ArenA", "description": "Buy Justin Bieber Amsterdam 2026 tickets from \u20ac89. Johan Cruijff ArenA, July 18. Standing, Golden Circle & VIP. Selling Fast \u2014 143 tickets left. 100% Money-Back Guarantee. Instant QR delivery."},
        "/f1-belgian-grand-prix-spa-tickets": {"title": "Buy Spa F1 Tickets 2026 | Belgian Grand Prix From \u20ac109 | Spa-Francorchamps", "description": "Buy Belgian Grand Prix 2026 tickets from \u20ac109. Eau Rouge Grandstand & Paddock Club VIP. Selling Fast \u2014 limited availability. 100% Money-Back Guarantee. Instant QR delivery."},
        "/f1-monaco-grand-prix-tickets": {"title": "Buy Monaco Grand Prix Tickets 2026 | F1 From \u20ac249 | Monte Carlo", "description": "Buy Monaco GP 2026 tickets from \u20ac249. Circuit de Monaco harbour views & VIP hospitality. Only 89 tickets left. 100% Guarantee. Instant QR delivery."},
        "/champions-league-tickets": {"title": "Buy Champions League Tickets 2026 | UCL Final From \u20ac85 | Munich", "description": "Buy UEFA Champions League 2026 tickets from \u20ac85. Semi-finals & Final in Munich. 90% Sold \u2014 limited seats remaining. 100% Money-Back Guarantee. Instant QR delivery."},
        "/el-clasico-tickets": {"title": "Buy El Clasico Tickets 2026 | Real Madrid vs Barcelona From \u20ac89", "description": "Buy El Clasico 2026 tickets from \u20ac89. Real Madrid vs Barcelona, Santiago Bernab\u00e9u. Only 23 tickets left. 100% Guarantee. Instant QR delivery."},
        "/taylor-swift-london-tickets": {"title": "Buy Taylor Swift London Tickets 2026 | Wembley From \u20ac79", "description": "Buy Taylor Swift Wembley 2026 tickets from \u20ac79. Multiple dates available. Almost sold out \u2014 40% cheaper than Ticketmaster. 100% Guarantee. Instant QR."},
        "/coldplay-tour-2026": {"title": "Buy Coldplay Tour Tickets 2026 | Europe Concerts From \u20ac69 | Barcelona", "description": "Buy Coldplay Music of the Spheres 2026 tickets from \u20ac69. Barcelona, Berlin, London. Selling Fast. 100% Money-Back Guarantee. Instant QR delivery."},
        "/world-cup-2026-tickets": {"title": "Buy FIFA World Cup 2026 Tickets | From \u20ac65 | USA, Mexico, Canada", "description": "Buy World Cup 2026 tickets from \u20ac65. Group stage to Final across USA, Mexico, Canada. Limited availability. 100% Money-Back Guarantee. Instant QR delivery."},
        "/world-cup-2026": {"title": "Buy FIFA World Cup 2026 Tickets | From \u20ac65 | USA, Mexico, Canada", "description": "Buy World Cup 2026 tickets from \u20ac65. All matches USA, Mexico, Canada. 100% Money-Back Guarantee."},
        "/f1-tickets": {"title": "Buy Formula 1 Tickets 2026 | All 24 Grand Prix From \u20ac79", "description": "Buy F1 2026 tickets from \u20ac79. Monaco, Spa, Monza, Silverstone & all 24 races. 42% cheaper than F1.com. 100% Guarantee. Instant QR delivery."},
        "/f1-tickets-2026": {"title": "Buy Formula 1 Tickets 2026 | All Grand Prix From \u20ac79", "description": "Buy F1 2026 tickets from \u20ac79. All 24 Grand Prix races. 100% Guarantee. Instant QR."},
        "/motogp-tickets": {"title": "Buy MotoGP Tickets 2026 | All 21 Races From \u20ac45", "description": "Buy MotoGP 2026 tickets from \u20ac45. Mugello, Valencia & all races. 100% Guarantee. Instant delivery."},
        "/the-weeknd-tour-2026": {"title": "Buy The Weeknd Tour Tickets 2026 | Europe From \u20ac79", "description": "Buy The Weeknd 2026 tickets from \u20ac79. European concerts. 100% Guarantee. Instant QR delivery."},
        "/bruno-mars-tour-2026": {"title": "Buy Bruno Mars Tour Tickets 2026 | London & Europe From \u20ac89", "description": "Buy Bruno Mars 2026 tickets from \u20ac89. London Wembley & European dates. 100% Guarantee. Instant QR delivery."},
        "/super-bowl-2026-tickets": {"title": "Buy Super Bowl Tickets 2027 | VIP From \u20ac2,499", "description": "Buy Super Bowl LXI 2027 tickets. VIP packages & best seats. 100% Money-Back Guarantee."},
        "/monaco-grand-prix-tickets": {"title": "Buy Monaco Grand Prix Tickets 2026 | F1 From \u20ac249 | Monte Carlo", "description": "Buy Monaco GP 2026 tickets from \u20ac249. Harbour views & VIP. 100% Guarantee. Instant QR."},
        "/real-madrid-tickets": {"title": "Real Madrid Tickets 2026 | All Matches | From \u20ac75", "description": "Buy Real Madrid tickets. Bernabeu, Champions League, La Liga. From \u20ac75."},
        "/barcelona-tickets": {"title": "FC Barcelona Tickets 2026 | Camp Nou | From \u20ac70", "description": "Buy FC Barcelona tickets. Camp Nou, Champions League, La Liga. Verified sellers."},
        "/manchester-city-tickets": {"title": "Man City Tickets 2026 | Etihad | EuroMatchTickets", "description": "Buy Manchester City tickets. Etihad, Premier League, Champions League. Instant delivery."},
        "/liverpool-tickets": {"title": "Liverpool FC Tickets 2026 | Anfield | From \u20ac65", "description": "Buy Liverpool FC tickets. Anfield, Premier League, Champions League. From \u20ac65."},
        "/arsenal-tickets": {"title": "Arsenal Tickets 2026 | Emirates | EuroMatchTickets", "description": "Buy Arsenal tickets. Emirates Stadium, Premier League, Champions League."},
        "/bayern-vs-real-madrid-tickets": {"title": "Buy Bayern vs Real Madrid Tickets 2026 | UCL From \u20ac129", "description": "Buy Bayern Munich vs Real Madrid UCL 2026 tickets from \u20ac129. Allianz Arena. 100% Guarantee. Instant QR."},
        "/bahrain-world-cup-tickets-2026": {"title": "Bahrain World Cup 2026 Tickets | FIFA", "description": "Buy Bahrain FIFA World Cup 2026 tickets. Group & knockout matches. Verified sellers."},
        "/events": {"title": "Events & Tickets 2026 | Browse All | EuroMatchTickets", "description": "Browse 500+ events. Football, F1, concerts. Cheapest prices, instant QR delivery."},
        "/about": {"title": "About EuroMatchTickets | Trusted Ticket Marketplace", "description": "Europe\u2019s trusted ticket marketplace for football, F1, and concerts. FanProtect guarantee."},
        "/faq": {"title": "FAQ | EuroMatchTickets | Common Questions", "description": "Answers to common questions about buying tickets, delivery, refunds, and FanProtect."},
        "/reviews": {"title": "Reviews | EuroMatchTickets | 4.8/5 Rating", "description": "Read 12,000+ verified customer reviews. 4.8/5 rating. Trusted marketplace."},
        "/contact": {"title": "Contact Us | EuroMatchTickets | Support", "description": "Get in touch with EuroMatchTickets support. Email, phone, live chat 24/7."},
        "/blog": {"title": "Blog | EuroMatchTickets | Sports & Concert News", "description": "Latest news about football, F1, concerts, and ticket buying guides."},
        "/buyer-protection": {"title": "Buyer Protection | FanProtect | EuroMatchTickets", "description": "FanProtect. 100% money-back guarantee, verified sellers, secure payments."},
        "/sell-tickets": {"title": "Sell Tickets | EuroMatchTickets | List Yours", "description": "Sell your tickets on EuroMatchTickets. Reach millions of European buyers."},
        "/es/comprar-entradas": {"title": "Comprar Entradas | Champions League, F1 | EuroMatchTickets", "description": "Compra entradas Champions League desde \u20ac85, F1 desde \u20ac89. Precios m\u00e1s baratos de Europa."},
        "/es/entradas-champions-league": {"title": "Entradas Champions League 2026 | EuroMatchTickets", "description": "Compra entradas UEFA Champions League desde \u20ac85. Vendedores verificados."},
        "/es/entradas-f1": {"title": "Entradas F1 2026 | Todos los GP | EuroMatchTickets", "description": "Compra entradas F1 desde \u20ac89. M\u00f3naco, Barcelona, Monza."},
        "/de/tickets-kaufen": {"title": "Tickets Kaufen | Champions League, F1 | EuroMatchTickets", "description": "Champions League ab \u20ac85, F1 ab \u20ac89. G\u00fcnstigste Preise Europas."},
        "/de/champions-league-tickets": {"title": "Champions League Tickets 2026 | Ab \u20ac85", "description": "UEFA Champions League Tickets kaufen ab \u20ac85. Verifizierte Verk\u00e4ufer."},
        "/de/formel-1-tickets": {"title": "Formel 1 Tickets 2026 | Alle Rennen", "description": "F1 Tickets kaufen ab \u20ac89. Monaco, Monza, Silverstone."},
        "/fr/acheter-billets": {"title": "Acheter Billets | Champions League, F1 | EuroMatchTickets", "description": "Billets Champions League d\u00e8s \u20ac85, F1 d\u00e8s \u20ac89. Prix les plus bas d'Europe."},
        "/fr/billets-champions-league": {"title": "Billets Champions League 2026 | EuroMatchTickets", "description": "Billets UEFA Champions League d\u00e8s \u20ac85. Vendeurs v\u00e9rifi\u00e9s."},
        "/fr/billets-f1": {"title": "Billets F1 2026 | Tous les GP | EuroMatchTickets", "description": "Billets F1 d\u00e8s \u20ac89. Monaco, Monza, Silverstone."},
        "/it/biglietti": {"title": "Biglietti | Champions League, F1 | EuroMatchTickets", "description": "Biglietti Champions League da \u20ac85, F1 da \u20ac89. Prezzi pi\u00f9 bassi d'Europa."},
        "/it/biglietti-champions-league": {"title": "Biglietti Champions League 2026 | EuroMatchTickets", "description": "Biglietti UEFA Champions League da \u20ac85. Venditori verificati."},
        "/it/biglietti-f1": {"title": "Biglietti F1 2026 | Tutti i GP | EuroMatchTickets", "description": "Biglietti F1 da \u20ac89. Monaco, Monza, Silverstone."},
    }

    if not path or path == "/":
        meta = STATIC_META.get("/", {})
        return {"title": meta.get("title", "EuroMatchTickets"), "description": meta.get("description", ""), "canonical": "https://euromatchtickets.com/"}
    
    clean_path = "/" + path.strip("/")
    slug = path.strip("/")
    
    # Also check with leading slash variants for international pages
    check_paths = [clean_path]
    if "/" in slug:
        check_paths.append("/" + slug)
    
    # Check static meta first (for React-only routes not in DB)
    for cp in check_paths:
        if cp in STATIC_META:
            meta = STATIC_META[cp]
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


# ============================================================
# PRICE DROP ALERT - Lead Capture
# ============================================================

from pydantic import BaseModel, EmailStr

# NOTE: /api/alerts/subscribe is owned by routes/alerts.py (which has full
# Resend email + drip-campaign support). Do NOT redefine it here — that
# causes a route-collision 422 "event_slug missing" error when the frontend
# sends {event_id, event_title, current_price}.

@router.get("/alerts/stats")
async def get_alert_stats():
    """Get price alert subscription stats (owner dashboard)."""
    total = await db.price_alerts.count_documents({})
    pipeline = [
        {"$group": {"_id": "$event_slug", "count": {"$sum": 1}, "event_name": {"$first": "$event_name"}}},
        {"$sort": {"count": -1}},
        {"$limit": 20}
    ]
    top_events = []
    async for doc in db.price_alerts.aggregate(pipeline):
        top_events.append({"slug": doc["_id"], "count": doc["count"], "event_name": doc.get("event_name", "")})
    
    return {"total_subscribers": total, "top_events": top_events}



# ============================================================
# NUCLEAR INDEXING ENGINE — ALL METHODS, ALL ENGINES
# ============================================================

GOOGLE_SA_PATH = "/app/backend/google-service-account.json"


async def _collect_every_url():
    """Collect EVERY indexable URL from the entire site."""
    base = SITE_URL
    urls = set()
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    # 1. All active SEO pages (biggest chunk)
    seo_pages = await db.seo_pages.find(
        {"active": True, "redirect_to": {"$exists": False}},
        {"_id": 0, "slug": 1}
    ).to_list(50000)
    for p in seo_pages:
        urls.add(f"{base}/{p['slug']}")

    # 2. All future events
    today_dt = datetime.now(timezone.utc)
    events = await db.events.find(
        {"event_date": {"$gte": today_dt}},
        {"_id": 0, "event_id": 1, "slug": 1}
    ).to_list(5000)
    for e in events:
        slug = e.get("slug") or e["event_id"]
        urls.add(f"{base}/event/{slug}")

    # 3. All articles
    articles = await db.articles.find({}, {"_id": 0, "slug": 1}).to_list(5000)
    for a in articles:
        urls.add(f"{base}/blog/{a['slug']}")

    # 4. Static core pages
    static = [
        "", "events", "blog", "f1-tickets", "f1-tickets-2026", "f1-schedule-2026",
        "champions-league-tickets", "el-clasico-tickets", "motogp-tickets",
        "world-cup-2026", "world-cup-2026-tickets", "super-bowl-2026-tickets",
        "justin-bieber-amsterdam-2026-tickets", "taylor-swift-london-tickets",
        "taylor-swift-wembley-2026-tickets", "the-weeknd-tour-2026",
        "bruno-mars-tour-2026", "coldplay-tour-2026", "bad-bunny-london-2026",
        "guns-n-roses-tour-2026", "metallica-sphere-las-vegas-tickets",
        "harry-styles-tickets", "maroon-5-tour-2026", "john-legend-tour-2026",
        "isle-of-man-tt-tickets", "world-athletics-2026-tickets",
        "acl-festival-2026", "monaco-grand-prix-tickets",
        "f1-belgian-grand-prix-spa-tickets", "f1-monaco-grand-prix-tickets",
        "f1-british-grand-prix-silverstone-tickets", "f1-singapore-grand-prix-tickets",
        "f1-las-vegas-grand-prix-tickets", "f1-dutch-grand-prix-zandvoort-tickets",
        "f1-miami-grand-prix-tickets", "f1-japanese-grand-prix-suzuka-tickets",
        "f1-australian-grand-prix-melbourne-tickets", "f1-bahrain-grand-prix-tickets",
        "f1-saudi-arabian-grand-prix-jeddah-tickets", "f1-spanish-grand-prix-barcelona-tickets",
        "f1-hungarian-grand-prix-budapest-tickets", "f1-austrian-grand-prix-red-bull-ring-tickets",
        "f1-abu-dhabi-grand-prix-tickets", "f1-italian-grand-prix-monza-tickets",
        "bayern-munich-vs-real-madrid-tickets", "reviews", "faq", "about",
        "contact", "buyer-protection", "sell", "prices", "terms",
        "privacy-policy", "refund-policy", "fan-protect", "payment-info",
        "best-f1-races-europe", "how-to-buy-f1-tickets", "f1-ticket-prices-guide",
        "events-this-weekend",
        "es/comprar-entradas", "es/entradas-champions-league", "es/entradas-f1",
        "es/entradas-conciertos", "es/entradas-copa-del-mundo-2026",
        "de/tickets-kaufen", "de/champions-league-tickets", "de/formel-1-tickets",
        "de/bundesliga-tickets", "de/konzert-tickets", "de/wm-2026-tickets",
        "team/real-madrid", "team/barcelona", "team/manchester-city",
        "team/liverpool", "team/arsenal", "team/bayern-munich", "team/psg", "team/juventus",
    ]
    for p in static:
        urls.add(f"{base}/{p}" if p else base)

    return sorted(urls)


async def _submit_google_indexing_api(urls_list):
    """Submit URLs via Google Indexing API v3 (requires service account)."""
    if not os.path.exists(GOOGLE_SA_PATH):
        return {"status": "skipped", "reason": "No Google service account JSON found"}

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        SCOPES = ["https://www.googleapis.com/auth/indexing"]
        credentials = service_account.Credentials.from_service_account_file(
            GOOGLE_SA_PATH, scopes=SCOPES
        )
        service = build("indexing", "v3", credentials=credentials)

        submitted = 0
        errors = 0
        error_details = []

        # Google allows 200 URLs/day, submit in batches
        batch_urls = urls_list[:200]
        for url in batch_urls:
            try:
                body = {"url": url, "type": "URL_UPDATED"}
                service.urlNotifications().publish(body=body).execute()
                submitted += 1
            except Exception as e:
                errors += 1
                if len(error_details) < 3:
                    error_details.append(str(e)[:100])

        return {
            "status": "success",
            "submitted": submitted,
            "errors": errors,
            "daily_quota": 200,
            "used_quota": submitted,
            "error_samples": error_details if error_details else None
        }
    except ImportError:
        return {"status": "error", "reason": "google-api-python-client not installed"}
    except Exception as e:
        return {"status": "error", "reason": str(e)[:200]}


async def _submit_google_indexing_api_batch(urls_list):
    """Submit URLs via Google Indexing API using HTTP batch requests (100 URLs per batch)."""
    if not os.path.exists(GOOGLE_SA_PATH):
        return {"status": "skipped", "reason": "No Google service account JSON found"}

    try:
        from google.oauth2 import service_account
        import google.auth.transport.requests

        SCOPES = ["https://www.googleapis.com/auth/indexing"]
        credentials = service_account.Credentials.from_service_account_file(
            GOOGLE_SA_PATH, scopes=SCOPES
        )
        request = google.auth.transport.requests.Request()
        credentials.refresh(request)
        access_token = credentials.token

        submitted = 0
        errors = 0
        batch_urls = urls_list[:200]  # Daily quota

        # Submit in batches of 100 (Google batch limit)
        async with httpx.AsyncClient(timeout=60.0) as client:
            for i in range(0, len(batch_urls), 100):
                chunk = batch_urls[i:i+100]
                # Build multipart batch request
                boundary = "===============batch_boundary=="
                body_parts = []
                for idx, url in enumerate(chunk):
                    part = (
                        f"--{boundary}\r\n"
                        f"Content-Type: application/http\r\n"
                        f"Content-ID: <item{idx}>\r\n\r\n"
                        f"POST /v3/urlNotifications:publish HTTP/1.1\r\n"
                        f"Content-Type: application/json\r\n\r\n"
                        f'{{"url": "{url}", "type": "URL_UPDATED"}}\r\n'
                    )
                    body_parts.append(part)
                body_parts.append(f"--{boundary}--")
                batch_body = "".join(body_parts)

                try:
                    r = await client.post(
                        "https://indexing.googleapis.com/batch",
                        content=batch_body,
                        headers={
                            "Content-Type": f"multipart/mixed; boundary={boundary}",
                            "Authorization": f"Bearer {access_token}"
                        }
                    )
                    if r.status_code == 200:
                        submitted += len(chunk)
                    else:
                        # Try individual submissions as fallback
                        for url in chunk:
                            try:
                                r2 = await client.post(
                                    "https://indexing.googleapis.com/v3/urlNotifications:publish",
                                    json={"url": url, "type": "URL_UPDATED"},
                                    headers={
                                        "Content-Type": "application/json",
                                        "Authorization": f"Bearer {access_token}"
                                    }
                                )
                                if r2.status_code == 200:
                                    submitted += 1
                                else:
                                    errors += 1
                            except Exception:
                                errors += 1
                except Exception:
                    errors += len(chunk)

        return {
            "status": "success",
            "submitted": submitted,
            "errors": errors,
            "daily_quota": 200,
            "method": "batch+fallback"
        }
    except Exception as e:
        return {"status": "error", "reason": str(e)[:200]}


@router.post("/seo/nuclear-index-all")
async def nuclear_index_all():
    """
    ULTIMATE NUCLEAR INDEXING — Submit EVERY URL to EVERY search engine.
    Methods: Google Indexing API + IndexNow (5 engines) + Bing API + Sitemap Pings.
    """
    start = datetime.now(timezone.utc)
    all_urls = await _collect_every_url()
    results = {
        "total_urls": len(all_urls),
        "timestamp": start.isoformat(),
        "engines": {}
    }

    # ━━━ 1. GOOGLE INDEXING API (highest priority — direct to Google) ━━━
    google_result = await _submit_google_indexing_api_batch(all_urls)
    results["engines"]["google_indexing_api"] = google_result

    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:

        # ━━━ 2. INDEXNOW — All 5 endpoints (Bing, Yandex, Seznam, Naver, API) ━━━
        INDEXNOW_ENDPOINTS = [
            ("bing", "https://www.bing.com/indexnow"),
            ("yandex", "https://yandex.com/indexnow"),
            ("api", "https://api.indexnow.org/indexnow"),
            ("seznam", "https://search.seznam.cz/indexnow"),
            ("naver", "https://searchadvisor.naver.com/indexnow"),
        ]
        for engine_name, endpoint_url in INDEXNOW_ENDPOINTS:
            engine_result = {"submitted": 0, "errors": 0}
            for i in range(0, len(all_urls), 10000):
                batch = all_urls[i:i+10000]
                try:
                    r = await client.post(endpoint_url, json={
                        "host": "euromatchtickets.com",
                        "key": INDEXNOW_KEY,
                        "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
                        "urlList": batch
                    })
                    if r.status_code in [200, 202]:
                        engine_result["submitted"] += len(batch)
                    else:
                        engine_result["errors"] += len(batch)
                        engine_result["http_status"] = r.status_code
                except Exception as e:
                    engine_result["errors"] += len(batch)
                    engine_result["exception"] = str(e)[:80]
            results["engines"][f"indexnow_{engine_name}"] = engine_result

        # ━━━ 3. BING URL SUBMISSION API (direct Bing crawl request) ━━━
        if BING_API_KEY:
            bing_result = {"submitted": 0, "quota_exceeded": False}
            for i in range(0, min(len(all_urls), 500), 50):
                batch = all_urls[i:i+50]
                try:
                    r = await client.post(
                        f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={BING_API_KEY}",
                        json={"siteUrl": SITE_URL, "urlList": batch},
                        headers={"Content-Type": "application/json; charset=utf-8"}
                    )
                    if r.status_code == 200:
                        bing_result["submitted"] += len(batch)
                    elif "quota" in r.text.lower():
                        bing_result["quota_exceeded"] = True
                        break
                except Exception:
                    break
            results["engines"]["bing_webmaster_api"] = bing_result
        else:
            results["engines"]["bing_webmaster_api"] = {"skipped": True, "reason": "No BING_WEBMASTER_API_KEY"}

        # ━━━ 4. SITEMAP PINGS — Google + Bing (all sitemaps) ━━━
        sitemaps = [
            f"{SITE_URL}/api/sitemap.xml",
            f"{SITE_URL}/api/sitemap-index.xml",
            f"{SITE_URL}/api/sitemaps/pages.xml",
            f"{SITE_URL}/api/sitemaps/f1.xml",
            f"{SITE_URL}/api/sitemaps/football.xml",
            f"{SITE_URL}/api/sitemaps/concerts.xml",
            f"{SITE_URL}/api/sitemaps/worldcup.xml",
            f"{SITE_URL}/api/sitemaps/cities.xml",
        ]
        ping_results = {"google_pings": 0, "bing_pings": 0, "errors": 0}
        for sm_url in sitemaps:
            for ping_base in ["https://www.google.com/ping?sitemap=", "https://www.bing.com/ping?sitemap="]:
                try:
                    r = await client.get(f"{ping_base}{sm_url}")
                    if r.status_code == 200:
                        if "google" in ping_base:
                            ping_results["google_pings"] += 1
                        else:
                            ping_results["bing_pings"] += 1
                except Exception:
                    ping_results["errors"] += 1
        results["engines"]["sitemap_pings"] = ping_results

    # ━━━ CALCULATE TOTALS ━━━
    duration = (datetime.now(timezone.utc) - start).total_seconds()
    total_submitted = 0
    engines_reached = 0
    for k, v in results["engines"].items():
        if isinstance(v, dict):
            s = v.get("submitted", 0)
            total_submitted += s
            if s > 0:
                engines_reached += 1

    results["total_submitted_across_engines"] = total_submitted
    results["engines_reached"] = engines_reached
    results["duration_seconds"] = round(duration, 1)

    # Log
    try:
        await db.indexing_submissions.insert_one({
            "type": "nuclear_index_all",
            "total_urls": len(all_urls),
            "total_submitted": total_submitted,
            "engines_reached": engines_reached,
            "duration": duration,
            "results": {k: v for k, v in results["engines"].items() if isinstance(v, dict)},
            "created_at": datetime.now(timezone.utc)
        })
    except Exception:
        pass

    return {"status": "success", **results}


@router.post("/seo/setup-google-indexing")
async def setup_google_indexing(request: Request):
    """Upload Google Service Account JSON for Indexing API access."""
    try:
        data = await request.json()
        sa_json = data.get("service_account_json")
        if not sa_json:
            return {"status": "error", "message": "Provide 'service_account_json' field with the full JSON content"}

        import json
        if isinstance(sa_json, str):
            sa_data = json.loads(sa_json)
        else:
            sa_data = sa_json

        # Validate it has required fields
        required = ["type", "project_id", "private_key", "client_email"]
        missing = [f for f in required if f not in sa_data]
        if missing:
            return {"status": "error", "message": f"Missing fields: {missing}"}

        # Save to file
        with open(GOOGLE_SA_PATH, "w") as f:
            json.dump(sa_data, f)

        return {
            "status": "success",
            "message": "Google Service Account saved. Google Indexing API is now active.",
            "service_account_email": sa_data.get("client_email"),
            "next_step": f"Make sure {sa_data.get('client_email')} is added as Owner in Google Search Console for euromatchtickets.com"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/seo/indexing-report")
async def indexing_report():
    """Full report of all indexing submissions with totals."""
    seo_count = await db.seo_pages.count_documents({"active": True})
    events_count = await db.events.count_documents({"event_date": {"$gte": datetime.now(timezone.utc).strftime('%Y-%m-%d')}})

    # Recent submissions
    submissions = await db.indexing_submissions.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(20)

    total_submitted_all_time = 0
    for s in submissions:
        total_submitted_all_time += s.get("total_submitted", 0)

    google_api_ready = os.path.exists(GOOGLE_SA_PATH)

    return {
        "site_stats": {
            "active_seo_pages": seo_count,
            "active_events": events_count,
            "estimated_total_urls": seo_count + events_count + 80,
        },
        "google_indexing_api": {
            "ready": google_api_ready,
            "quota_per_day": 200,
            "setup_url": "https://console.cloud.google.com/apis/library/indexing.googleapis.com" if not google_api_ready else None,
        },
        "indexnow": {
            "engines": ["Bing", "Yandex", "Seznam", "Naver", "IndexNow API (all)"],
            "max_per_request": 10000,
            "key_verified": True,
        },
        "total_submissions_recorded": len(submissions),
        "total_urls_submitted_all_time": total_submitted_all_time,
        "recent_submissions": submissions[:10],
    }
