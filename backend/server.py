"""
EuroMatchTickets Backend - Modular FastAPI Application
Refactored from monolith into clean module structure
"""
import os
import sys
import asyncio
import logging

from fastapi import FastAPI, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from dotenv import load_dotenv

load_dotenv()

# Ensure backend directory is in path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.settings import MONGO_URL, FRONTEND_URL
from database.db import db, client

# Import route modules
from routes.auth import router as auth_router
from routes.events import router as events_router
from routes.tickets import router as tickets_router
from routes.seo import router as seo_router
from routes.admin import router as admin_router
from routes.marketing import router as marketing_router
from routes.alerts import router as alerts_router, set_db as alerts_set_db

# Legacy seed routes - imported from old server to preserve seed data endpoints
from routes.seed import router as seed_router
from routes.sitemap_routes import router as sitemap_router
from routes.chat import router as chat_router

app = FastAPI(title="EuroMatchTickets API", version="2.0")

# GZip Compression for faster response times
app.add_middleware(GZipMiddleware, minimum_size=500)

# Cache control middleware for API responses
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # CRITICAL SEO FIX: Explicitly set X-Robots-Tag to override any proxy-level noindex
        # This ensures Google indexes all pages correctly
        path = request.url.path
        if response.status_code == 410:
            response.headers["X-Robots-Tag"] = "noindex"
        elif path.startswith('/api/merchant/') or path.endswith('sitemap.xml') or path == '/api/robots.txt':
            # Allow Google to read merchant feed and sitemaps
            response.headers["X-Robots-Tag"] = "index, follow"
        elif not path.startswith('/api/'):
            response.headers["X-Robots-Tag"] = "index, follow"
        else:
            response.headers["X-Robots-Tag"] = "noindex"
        
        return response

app.add_middleware(SecurityHeadersMiddleware)

class CacheControlMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        path = request.url.path
        if request.method != 'GET':
            return response
        # Aggressive cache for images (1 year - immutable assets)
        if path.startswith('/images/') or path.endswith(('.webp', '.jpg', '.jpeg', '.png', '.svg', '.ico')):
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        # Aggressive cache for sitemaps
        elif path.endswith('.xml') or path.startswith('/api/sitemaps/'):
            response.headers["Cache-Control"] = "public, max-age=3600, s-maxage=7200"
        # Cache for SEO pages list
        elif '/api/seo/' in path:
            response.headers["Cache-Control"] = "public, max-age=1800, s-maxage=3600"
        # Cache for events list and event details
        elif '/api/events' in path:
            response.headers["Cache-Control"] = "public, max-age=300, s-maxage=600"
        # Cache for robots.txt
        elif path == '/api/robots.txt':
            response.headers["Cache-Control"] = "public, max-age=86400"
        # Cache for static assets (JS, CSS, fonts)
        elif path.endswith(('.js', '.css', '.woff2', '.woff', '.ttf')):
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response

app.add_middleware(CacheControlMiddleware)

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000", "http://localhost:3001",
    "https://euromatchtickets.com", "https://www.euromatchtickets.com",
    "https://euromatchtickets-frontend.onrender.com",
    "https://euromatchtickets.onrender.com",
]
react_url = os.environ.get('REACT_APP_BACKEND_URL', '')
if react_url:
    ALLOWED_ORIGINS.append(react_url)
preview_url = os.environ.get('PREVIEW_URL', '')
if preview_url:
    ALLOWED_ORIGINS.append(preview_url)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True, allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"], allow_headers=["*"],
)

# Register all route modules
app.include_router(auth_router)
app.include_router(events_router)
app.include_router(tickets_router)
app.include_router(seo_router)
app.include_router(admin_router)
app.include_router(marketing_router)
app.include_router(alerts_router)
app.include_router(seed_router)
app.include_router(sitemap_router)
app.include_router(chat_router)

# Set DB for alerts
alerts_set_db(db)

# Serve uploaded files
from fastapi.staticfiles import StaticFiles
import pathlib
uploads_dir = pathlib.Path(__file__).parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.get("/")
async def root():
    return {"status": "EuroMatchTickets API v2.0 - Modular Architecture", "endpoints": "/api/..."}

# IndexNow key verification file
INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "dd91242c079d4538a9ae74378aaad957")

@app.get(f"/{INDEXNOW_KEY}.txt")
async def indexnow_key_file():
    return Response(content=INDEXNOW_KEY, media_type="text/plain")

@app.get("/api")
@app.get("/api/")
async def api_root():
    return {"status": "EuroMatchTickets API v2.0", "version": "2.0"}


from datetime import datetime, timezone

# Background tasks
async def cleanup_expired_events():
    while True:
        try:
            logger.info("Cleanup Bot: Starting daily cleanup...")
            now = datetime.now(timezone.utc)
            today = now.replace(hour=0, minute=0, second=0, microsecond=0)
            expired = await db.events.find({"event_date": {"$lt": today}, "status": {"$nin": ["past_event", "expired"]}}).to_list(1000)
            if expired:
                for event in expired:
                    et = event.get("event_type", "")
                    next_ev = await db.events.find_one({"event_type": et, "event_date": {"$gte": today}, "status": {"$nin": ["past_event", "expired"]}}, {"_id": 0, "event_id": 1, "title": 1}, sort=[("event_date", 1)])
                    similar = await db.events.find({"event_type": et, "event_date": {"$gte": today}, "status": {"$nin": ["past_event", "expired"]}}, {"_id": 0, "event_id": 1, "title": 1}).limit(5).to_list(5)
                    await db.events.update_one({"_id": event["_id"]}, {"$set": {"status": "past_event", "updated_at": now, "next_event": next_ev, "similar_events": similar}})
                    await db.tickets.update_many({"event_id": event.get("event_id")}, {"$set": {"status": "past_event", "updated_at": now}})
                logger.info(f"Cleanup Bot: Marked {len(expired)} events as past_event")
            else:
                logger.info("Cleanup Bot: No expired events found")
            await asyncio.sleep(24 * 60 * 60)
        except Exception as e:
            logger.error(f"Cleanup Bot Error: {e}")
            await asyncio.sleep(60 * 60)


async def bing_daily_indexing():
    """Daily cron: submit next 100 unsubmitted URLs to Bing URL Submission API."""
    import httpx

    BING_KEY = os.environ.get("BING_WEBMASTER_API_KEY", "")
    INDEXNOW_KEY = "e33676fbaf3c0bd0b243f4f76213d267"
    SITE = "https://euromatchtickets.com"

    if not BING_KEY:
        logger.warning("Bing Indexing Bot: No BING_WEBMASTER_API_KEY, skipping")
        return

    # Wait 30s after startup to let everything initialize
    await asyncio.sleep(30)

    while True:
        try:
            logger.info("Bing Indexing Bot: Starting daily submission...")

            # Collect all URLs
            seo_pages = await db.seo_pages.find({"active": True}, {"_id": 0, "slug": 1}).to_list(5000)
            today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')
            events = await db.events.find(
                {"event_date": {"$gte": today_str}},
                {"_id": 0, "event_id": 1, "slug": 1}
            ).to_list(500)

            all_urls = set()
            # Priority 1: Key static pages
            for p in ["", "events", "f1-tickets", "football-tickets", "concerts",
                       "motogp-tickets", "world-cup-2026", "sell-tickets", "about",
                       "faq", "reviews", "contact", "buyer-protection",
                       "champions-league-tickets", "super-bowl-2026-tickets",
                       "taylor-swift-wembley-2026-tickets", "el-clasico-tickets",
                       "monaco-grand-prix-tickets", "blog"]:
                all_urls.add(f"{SITE}/{p}")
            # Priority 2: SEO pages
            for p in seo_pages:
                all_urls.add(f"{SITE}/{p['slug']}")
            # Priority 3: Event pages
            for e in events:
                all_urls.add(f"{SITE}/event/{e.get('slug') or e['event_id']}")

            # Get already submitted URLs from DB
            submitted_docs = await db.bing_submitted_urls.find(
                {}, {"_id": 0, "url": 1}
            ).to_list(10000)
            submitted_set = {d["url"] for d in submitted_docs}

            # Find unsubmitted URLs
            pending = [u for u in all_urls if u not in submitted_set]

            if not pending:
                logger.info("Bing Indexing Bot: All URLs already submitted! Resetting for re-submission...")
                await db.bing_submitted_urls.delete_many({})
                pending = list(all_urls)

            # Take next batch (up to 100 for daily quota)
            batch = pending[:100]
            logger.info(f"Bing Indexing Bot: Submitting {len(batch)} of {len(pending)} pending URLs")

            bing_ok = 0
            yandex_ok = 0
            now = datetime.now(timezone.utc)

            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                # Submit to Bing in chunks of 50
                for i in range(0, len(batch), 50):
                    chunk = batch[i:i+50]
                    try:
                        r = await client.post(
                            f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={BING_KEY}",
                            json={"siteUrl": SITE, "urlList": chunk},
                            headers={"Content-Type": "application/json; charset=utf-8"}
                        )
                        if r.status_code == 200:
                            bing_ok += len(chunk)
                            # Record submitted URLs
                            await db.bing_submitted_urls.insert_many(
                                [{"url": u, "submitted_at": now, "engine": "bing"} for u in chunk]
                            )
                        else:
                            if "Quota" in r.text:
                                logger.warning(f"Bing Indexing Bot: Daily quota reached after {bing_ok} URLs")
                                break
                            logger.warning(f"Bing Indexing Bot: Batch error {r.status_code}: {r.text[:100]}")
                    except Exception as e:
                        logger.error(f"Bing Indexing Bot: Request error: {e}")
                        break

                # Also submit to Yandex (no quota limit)
                try:
                    r = await client.post("https://yandex.com/indexnow", json={
                        "host": "euromatchtickets.com",
                        "key": INDEXNOW_KEY,
                        "keyLocation": f"{SITE}/{INDEXNOW_KEY}.txt",
                        "urlList": batch
                    })
                    if r.status_code in [200, 202]:
                        yandex_ok = len(batch)
                except Exception:
                    pass

            # Log summary
            total_submitted = len(submitted_set) + bing_ok
            total_all = len(all_urls)
            logger.info(
                f"Bing Indexing Bot: Done! Bing={bing_ok}, Yandex={yandex_ok}. "
                f"Progress: {total_submitted}/{total_all} URLs indexed "
                f"({round(total_submitted/total_all*100)}%)"
            )

            # Store daily report
            await db.bing_indexing_logs.insert_one({
                "date": now.strftime("%Y-%m-%d"),
                "bing_submitted": bing_ok,
                "yandex_submitted": yandex_ok,
                "total_progress": total_submitted,
                "total_urls": total_all,
                "created_at": now
            })

            # Sleep 24 hours
            await asyncio.sleep(24 * 60 * 60)

        except Exception as e:
            logger.error(f"Bing Indexing Bot Error: {e}")
            await asyncio.sleep(60 * 60)


async def auto_reindex_loop():
    """Background task: regenerate sitemaps + submit to IndexNow every 6 hours."""
    from services.auto_indexer import full_reindex
    # Wait 60 seconds after startup before first run
    await asyncio.sleep(60)
    while True:
        try:
            logger.info("Auto-Index Bot: Starting scheduled reindex...")
            result = full_reindex()
            if result.get("success"):
                logger.info(f"Auto-Index Bot: Done! {result.get('urls_count', 0)} URLs indexed")
                # Store the result in DB
                await db.auto_index_logs.insert_one({
                    "urls_count": result.get("urls_count", 0),
                    "indexnow": result.get("indexnow", {}),
                    "ping": result.get("ping", {}),
                    "duration": result.get("duration_seconds", 0),
                    "created_at": datetime.now(timezone.utc)
                })
            else:
                logger.error(f"Auto-Index Bot: Failed - {result.get('error', 'Unknown')}")
            # Run every 6 hours
            await asyncio.sleep(6 * 60 * 60)
        except Exception as e:
            logger.error(f"Auto-Index Bot Error: {e}")
            await asyncio.sleep(30 * 60)


@app.on_event("startup")
async def startup():
    asyncio.create_task(cleanup_expired_events())
    logger.info("Cleanup Bot started - runs daily")
    asyncio.create_task(bing_daily_indexing())
    logger.info("Bing Indexing Bot started - submits 100 URLs/day")
    asyncio.create_task(auto_reindex_loop())
    logger.info("Auto-Indexing Bot started - reindexes every 6 hours")
    # Auto-seed new events if they don't exist
    count = await db.events.count_documents({"title": {"$regex": "Super Bowl LXI", "$options": "i"}})
    if count == 0:
        logger.info("Seeding new events...")
        from routes.seed import seed_new_events
        await seed_new_events()
        logger.info("New events seeded successfully")
    # Auto-seed mega premium events if they don't exist
    mega_count = await db.events.count_documents({"title": {"$regex": "Fury.*Usyk|Club World Cup 2025 Final", "$options": "i"}})
    if mega_count == 0:
        logger.info("Seeding mega premium events...")
        from routes.seed import seed_mega_premium_events
        await seed_mega_premium_events()
        logger.info("Mega premium events seeded successfully")


@app.on_event("shutdown")
async def shutdown():
    client.close()



# ─── MERCHANT FEED: Direct XML route (MUST be before catch-all) ────────────
@app.get("/merchant-feed.xml")
@app.get("/feed.xml")
async def serve_merchant_feed_direct():
    """Serve Google Merchant Center feed as XML - bypasses all SPA routing"""
    from routes.seo import google_merchant_feed
    return await google_merchant_feed()


@app.get("/download-feed")
async def download_feed_page():
    """Simple page with download button for merchant feed"""
    html = """<!DOCTYPE html><html><head><title>Download Feed</title></head><body style="font-family:Arial;text-align:center;padding:50px">
    <h1>Merchant Feed Download</h1>
    <p>30,000 products | 25 currencies | 33 countries</p>
    <a href="/api/merchant/feed.xml" download="merchant-feed.xml" style="display:inline-block;padding:20px 40px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-size:20px">Download merchant-feed.xml</a>
    <br><br><p style="color:gray">After download, upload this file to Google Merchant Center</p>
    </body></html>"""
    return Response(content=html, media_type="text/html")


# ─── Production: Serve React Frontend with 410 for old pages ────────────────
# This catch-all MUST be after all API routes so they take priority
static_build_dir = pathlib.Path(__file__).parent / "static"

if static_build_dir.exists():
    # Serve React build static assets (JS, CSS, media)
    static_assets = static_build_dir / "static"
    if static_assets.exists():
        app.mount("/static", StaticFiles(directory=str(static_assets)), name="frontend-assets")

    # Serve files in build root (manifest.json, favicon, images, etc.)
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str, request: Request):
        # Return HTTP 410 Gone for old 2025 pages - Google will permanently de-index
        if "2025" in full_path and not full_path.startswith("api/"):
            html_410 = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Page Removed | EuroMatchTickets</title></head><body><h1>Page Permanently Removed</h1><p>This event page has been permanently removed. <a href="https://euromatchtickets.com/events">Browse current events</a>.</p></body></html>'
            return Response(content=html_410, media_type="text/html", status_code=410)

        # Return HTTP 410 Gone for old /event/* detail pages with hash IDs
        # These are internal pages that should not be indexed
        if full_path.startswith("event/") and not full_path.startswith("events"):
            event_id = full_path.replace("event/", "")
            event_exists = await db.events.find_one({"event_id": event_id})
            if not event_exists:
                html_410 = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Event Removed | EuroMatchTickets</title></head><body><h1>Event Removed</h1><p>This event is no longer available. <a href="https://euromatchtickets.com/events">Browse current events</a>.</p></body></html>'
                return Response(content=html_410, media_type="text/html", status_code=410)

        # Try to serve static file (images, manifest, etc.) from build root
        file_path = static_build_dir / full_path
        if full_path and file_path.exists() and file_path.is_file():
            import mimetypes
            content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
            return Response(content=file_path.read_bytes(), media_type=content_type)

        # SPA catch-all: serve index.html for all React routes
        index_file = static_build_dir / "index.html"
        if index_file.exists():
            return Response(content=index_file.read_text(), media_type="text/html")
        return Response(content="Not Found", status_code=404)
