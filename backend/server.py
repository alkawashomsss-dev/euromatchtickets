"""
EuroMatchTickets Backend - Modular FastAPI Application
Refactored from monolith into clean module structure
"""
import os
import sys
import asyncio
import logging
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.responses import Response, FileResponse
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
from routes.emails import router as emails_router, set_db as emails_set_db
from routes.leads import router as leads_router
from routes.demand import router as demand_router

# Event validation engine (confirmed / coming_soon / expired / missing)
from services.event_validator import (
    validate_event_slug,
    is_unverified_demand_page,
    robots_tag_for_path,
    UNVERIFIED_DEMAND_PAGES,
)

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

        # CRITICAL SEO FIX: Explicitly set X-Robots-Tag
        path = request.url.path
        raw_slug = path.lstrip("/")

        # 1. 4xx / 5xx pages are never indexable
        if response.status_code in (404, 410, 451):
            response.headers["X-Robots-Tag"] = "noindex, nofollow"
        # 2. 3xx redirects should not be indexed either
        elif 300 <= response.status_code < 400:
            response.headers["X-Robots-Tag"] = "noindex, follow"
        # 3. Known unverified / speculative demand pages
        elif is_unverified_demand_page(raw_slug):
            response.headers["X-Robots-Tag"] = "noindex, follow"
        # 4. Merchant feed / sitemaps / robots are explicitly indexable
        elif path.startswith('/api/merchant/') or path.endswith('sitemap.xml') or path == '/api/robots.txt':
            response.headers["X-Robots-Tag"] = "index, follow"
        # 5. All other frontend pages
        elif not path.startswith('/api/'):
            response.headers["X-Robots-Tag"] = "index, follow"
        # 6. All other API responses are noindex by default
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
cors_origins = os.environ.get('CORS_ORIGINS', '')
if cors_origins == '*':
    ALLOWED_ORIGINS = ["*"]
elif cors_origins:
    ALLOWED_ORIGINS.extend([o.strip() for o in cors_origins.split(',')])

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
app.include_router(emails_router)
app.include_router(leads_router)
app.include_router(demand_router)

# Set DB for alerts
alerts_set_db(db)
emails_set_db(db)

# ─── Newsletter Subscribe ───
@app.post("/api/newsletter/subscribe")
async def newsletter_subscribe(data: dict):
    email = data.get("email", "").strip().lower()
    if not email or "@" not in email:
        return {"success": False, "message": "Invalid email"}
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"success": True, "message": "Already subscribed"}
    await db.newsletter.insert_one({
        "email": email,
        "source": data.get("source", "unknown"),
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "active": True
    })
    count = await db.newsletter.count_documents({"active": True})
    return {"success": True, "message": "Subscribed!", "total": count}


# ─── Core Web Vitals ingest (beacon from frontend) ───
@app.post("/api/metrics/vitals")
async def ingest_vitals(request: Request):
    try:
        data = await request.json()
    except Exception:
        return {"ok": False}
    if not isinstance(data, dict):
        return {"ok": False}
    name = str(data.get("name", ""))[:10]
    if name not in {"CLS", "LCP", "INP", "FCP", "TTFB"}:
        return {"ok": False}
    try:
        await db.web_vitals.insert_one({
            "name": name,
            "value": float(data.get("value", 0) or 0),
            "rating": str(data.get("rating", ""))[:20],
            "path": str(data.get("path", ""))[:200],
            "nav_type": str(data.get("navigation_type", ""))[:30],
            "ua": request.headers.get("user-agent", "")[:300],
            "ts": datetime.now(timezone.utc),
        })
    except Exception:
        pass
    return {"ok": True}

# Direct download endpoint for media files
@app.get("/api/download/video")
async def download_video():
    video_path = "/app/frontend/public/euromatchtickets_tiktok.mp4"
    if os.path.exists(video_path):
        return FileResponse(video_path, media_type="video/mp4", filename="EuroMatchTickets_Adrenaline.mp4")
    return {"error": "Video not found"}


# Serve uploaded files
from fastapi.staticfiles import StaticFiles
import pathlib
uploads_dir = pathlib.Path(__file__).parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Generated event images (Gemini Nano Banana outputs)
event_images_dir = pathlib.Path(__file__).parent / "static" / "event_images"
event_images_dir.mkdir(parents=True, exist_ok=True)
app.mount("/event-images", StaticFiles(directory=str(event_images_dir)), name="event-images")

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


async def email_drip_scheduler():
    """Background task: process drip emails every 12 hours (10am and 10pm UTC)."""
    from routes.emails import send_single_email
    # Wait 2 minutes after startup
    await asyncio.sleep(120)

    while True:
        try:
            now = datetime.now(timezone.utc)
            logger.info("Email Drip Bot: Processing pending drip emails...")

            subscribers = await db.price_alerts.find({"active": True}, {"_id": 0}).to_list(10000)
            sent_count = {"day_1": 0, "day_2": 0, "day_3": 0}
            errors = 0

            for sub in subscribers:
                email = sub.get("email")
                event_slug = sub.get("event_slug")
                event_name = sub.get("event_name", "Event Tickets")
                subscribed_at = sub.get("subscribed_at")

                if not email or not event_slug or not subscribed_at:
                    continue

                try:
                    sub_time = datetime.fromisoformat(subscribed_at.replace("Z", "+00:00"))
                except (ValueError, TypeError):
                    continue

                days_since = (now - sub_time).days

                for day in [1, 2, 3]:
                    if days_since >= day:
                        already_sent = await db.email_log.find_one({
                            "email": email, "event_slug": event_slug, "day": day,
                        })
                        if already_sent:
                            continue

                        email_id = await send_single_email(email, event_name, event_slug, day)
                        if email_id:
                            await db.email_log.insert_one({
                                "email": email, "event_slug": event_slug,
                                "event_name": event_name, "day": day,
                                "email_id": email_id,
                                "sent_at": now.isoformat(), "status": "sent",
                            })
                            sent_count[f"day_{day}"] += 1
                        else:
                            errors += 1

            total_sent = sum(sent_count.values())
            logger.info(f"Email Drip Bot: Done! Sent {total_sent} emails (D1:{sent_count['day_1']}, D2:{sent_count['day_2']}, D3:{sent_count['day_3']}), Errors: {errors}")

            # Store log
            await db.email_drip_logs.insert_one({
                "sent": sent_count, "errors": errors,
                "total_subscribers": len(subscribers),
                "run_at": now.isoformat(),
            })

            # Run every 12 hours
            await asyncio.sleep(12 * 60 * 60)
        except Exception as e:
            logger.error(f"Email Drip Bot Error: {e}")
            await asyncio.sleep(60 * 60)


@app.on_event("startup")
async def startup():
    asyncio.create_task(cleanup_expired_events())
    logger.info("Cleanup Bot started - runs daily")
    asyncio.create_task(bing_daily_indexing())
    logger.info("Bing Indexing Bot started - submits 100 URLs/day")
    asyncio.create_task(auto_reindex_loop())
    logger.info("Auto-Indexing Bot started - reindexes every 6 hours")
    asyncio.create_task(email_drip_scheduler())
    logger.info("Email Drip Bot started - processes emails every 12 hours")
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


@app.get("/api/download-feed")
async def download_feed_page():
    """Download page with XML and TSV options - works on mobile"""
    html = """<!DOCTYPE html><html><head><title>Download Merchant Feed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
    async function downloadFile(format) {
        const btn = document.getElementById('btn-' + format);
        const orig = btn.innerText;
        btn.innerText = 'Downloading...';
        btn.style.background = '#666';
        try {
            const res = await fetch('/api/merchant/feed.' + format);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merchant-feed.' + format;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            btn.innerText = 'Done!';
            btn.style.background = '#16a34a';
        } catch(e) {
            btn.innerText = 'Error - try again';
            btn.style.background = '#dc2626';
        }
    }
    </script>
    </head><body style="font-family:Arial;text-align:center;padding:40px 20px;background:#111;color:white">
    <h1 style="font-size:24px">Merchant Feed Download</h1>
    <p style="color:#aaa;margin:10px 0 30px">1,200 products | EUR only (Global Setup) | 33 countries</p>
    <button id="btn-xml" onclick="downloadFile('xml')" style="display:block;width:100%;max-width:400px;margin:10px auto;padding:18px 30px;background:#2563eb;color:white;border:none;border-radius:10px;font-size:18px;cursor:pointer">Download XML Feed (3.8 MB)</button>
    <button id="btn-tsv" onclick="downloadFile('tsv')" style="display:block;width:100%;max-width:400px;margin:10px auto;padding:18px 30px;background:#7c3aed;color:white;border:none;border-radius:10px;font-size:18px;cursor:pointer">Download TSV Feed (900 KB)</button>
    <p style="color:#888;margin-top:30px;font-size:14px">Upload to Google Merchant Center &rarr; Products &rarr; Feeds &rarr; Upload file</p>
    </body></html>"""
    return Response(content=html, media_type="text/html")


# ─── Production: Serve React Frontend with 410 for old pages ────────────────
# This catch-all MUST be after all API routes so they take priority
static_build_dir = pathlib.Path(__file__).parent / "static"


def _render_404_html(path: str) -> str:
    """Branded 404 page — noindex + links back to healthy hubs.

    Returned with HTTP 404 so Googlebot sees a TRUE 404, not a Soft 404.
    """
    safe = (path or "").replace("<", "&lt;").replace(">", "&gt;")[:200]
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<title>Page Not Found | EuroMatchTickets</title>
<link rel="canonical" href="https://euromatchtickets.com/"/>
<style>
  body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#0b0b0b; color:#eee; margin:0; padding:48px 20px; }}
  main {{ max-width: 720px; margin: 0 auto; }}
  h1 {{ font-size: 2.2rem; margin: 0 0 8px; }}
  p  {{ color:#aaa; line-height: 1.6; }}
  code {{ background:#1a1a1a; padding:2px 6px; border-radius:4px; color:#ffb86c; }}
  .cta {{ display:inline-block; margin-top:18px; padding:12px 22px; background:#9c27b0; color:#fff; text-decoration:none; border-radius:6px; font-weight:600; }}
  ul {{ margin-top: 28px; padding:0; list-style:none; }}
  li a {{ color:#8ab4ff; text-decoration:none; }}
  li {{ margin: 6px 0; }}
</style>
</head>
<body>
<main>
  <h1>404 — Event Not Found</h1>
  <p>The page <code>/{safe}</code> is no longer available. It may have been removed, renamed, or never existed.</p>
  <a class="cta" href="/">Back to EuroMatchTickets</a>
  <ul>
    <li><a href="/f1-tickets">Formula 1 Tickets 2026</a></li>
    <li><a href="/champions-league-tickets">Champions League Tickets</a></li>
    <li><a href="/events">Browse All Events</a></li>
    <li><a href="/world-cup-2026-tickets">FIFA World Cup 2026</a></li>
  </ul>
</main>
</body>
</html>"""

if static_build_dir.exists():
    # Serve React build static assets (JS, CSS, media)
    static_assets = static_build_dir / "static"
    if static_assets.exists():
        app.mount("/static", StaticFiles(directory=str(static_assets)), name="frontend-assets")

    # Serve files in build root (manifest.json, favicon, images, etc.)
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str, request: Request):
        from fastapi.responses import RedirectResponse

        # ── 301 Redirect: old 2025 pages → 2026 equivalent ──
        if "2025" in full_path and not full_path.startswith("api/"):
            new_path = full_path.replace("-2025", "-2026").replace("2025", "2026")
            return RedirectResponse(
                url=f"https://euromatchtickets.com/{new_path}",
                status_code=301
            )

        # ── 301 Redirect: Spa F1 keyword variations → canonical ──
        spa_redirects = [
            "spa-f1-tickets", "spa-f1-tickets-2026", "spa-francorchamps-tickets",
            "spa-francorchamps-f1-tickets", "f1-spa-tickets", "spa-grand-prix-tickets",
            "spa-gp-tickets", "belgium-f1-tickets", "belgian-grand-prix-tickets",
            "belgian-gp-tickets", "belgium-grand-prix-tickets", "f1-tickets-spa",
            "f1-tickets-spa-2026", "tickets-spa-f1", "ticket-f1-spa", "spa-tickets-f1",
            "spa-ticket-f1", "belgian-f1-tickets", "formula-1-spa-tickets",
            "formula-1-belgium-tickets", "f1-belgien-tickets", "formel-1-spa-tickets",
            "formule-1-spa-tickets", "gp-spa-tickets", "gp-belgie-tickets",
            "spa-francorchamps-grand-prix-tickets", "belgian-grand-prix-2026-tickets",
            "spa-grand-prix-2026", "spa-paddock-club-tickets", "f1-spa-francorchamps-tickets",
            "belgium-gp-tickets", "f1-belgie-tickets", "f1-kaarten-spa",
            "grand-prix-spa-tickets", "grand-prix-belgie-tickets",
        ]
        if full_path in spa_redirects:
            return RedirectResponse(url="https://euromatchtickets.com/f1-belgian-grand-prix-spa-tickets", status_code=301)

        # ── 301 Redirect: User-requested keyword variants → canonical ──
        keyword_redirects = {
            "formula-1-tickets": "f1-tickets",
            "formula-1-tickets-2026": "f1-tickets",
            "coldplay-tour-2026-tickets": "coldplay-tour-2026",
            "fifa-world-cup-2026-tickets": "world-cup-2026-tickets",
            "monaco-grand-prix-2026-tickets": "f1-monaco-grand-prix-tickets",
            "premier-league-tickets": "champions-league-tickets",
        }
        if full_path in keyword_redirects:
            return RedirectResponse(url=f"https://euromatchtickets.com/{keyword_redirects[full_path]}", status_code=301)

        # ── 301 Redirect: Taylor Swift variations → canonical ──
        ts_redirects = [
            "taylor-swift-tickets-london", "taylor-swift-tickets", "taylor-swift-tickets-wembley",
            "taylor-swift-wembley-tickets", "taylor-swift-concert-london",
            "taylor-swift-eras-tour-london", "taylor-swift-wembley-2026-tickets",
        ]
        if full_path in ts_redirects:
            return RedirectResponse(url="https://euromatchtickets.com/taylor-swift-london-tickets", status_code=301)

        # ── 301 Redirect: ugly event IDs → clean slug URLs OR HARD 404 ──
        if full_path.startswith("event/") and not full_path.startswith("events"):
            event_id = full_path.replace("event/", "")
            # Clean slugs get resolved by the DB path below; here we only
            # intercept UGLY legacy IDs (underscore pattern or hex-only).
            if "_" in event_id or (len(event_id) > 8 and "-" not in event_id):
                event = await db.events.find_one({"event_id": event_id}, {"_id": 0, "slug": 1})
                if event and event.get("slug"):
                    return RedirectResponse(
                        url=f"https://euromatchtickets.com/event/{event['slug']}",
                        status_code=301
                    )
                # Partial match fallback
                event = await db.events.find_one(
                    {"event_id": {"$regex": event_id}},
                    {"_id": 0, "slug": 1}
                )
                if event and event.get("slug"):
                    return RedirectResponse(
                        url=f"https://euromatchtickets.com/event/{event['slug']}",
                        status_code=301
                    )
                # True 404 — old ugly event ID permanently gone
                return Response(
                    content=_render_404_html(full_path),
                    status_code=404,
                    media_type="text/html",
                )

            # Clean slug — verify it exists in DB; HARD 404 if not
            status, event_doc = await validate_event_slug(db, event_id)
            if status == "missing":
                return Response(
                    content=_render_404_html(full_path),
                    status_code=404,
                    media_type="text/html",
                )
            if status == "expired":
                # Soft-redirect expired events to the category hub, 301
                et = (event_doc or {}).get("event_type", "")
                hub = {
                    "f1": "/f1-tickets",
                    "motogp": "/motogp-tickets",
                    "concert": "/events",
                    "match": "/champions-league-tickets",
                    "football": "/champions-league-tickets",
                }.get(et, "/events")
                return RedirectResponse(
                    url=f"https://euromatchtickets.com{hub}",
                    status_code=301,
                )

        # ── HARD 404 for stray event_xxx at root level (not under /event/) ──
        # Example: /event_c773d81aa66a  → 404 (never indexable)
        if full_path.startswith("event_"):
            return Response(
                content=_render_404_html(full_path),
                status_code=404,
                media_type="text/html",
            )

        # ── noindex for checkout/order pages (but still serve the React app) ──
        # These pages should work for users but not be indexed by Google

        # Try to serve static file (images, manifest, etc.) from build root
        file_path = static_build_dir / full_path
        if full_path and file_path.exists() and file_path.is_file():
            import mimetypes
            content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
            return Response(content=file_path.read_bytes(), media_type=content_type)

        # SPA catch-all: serve index.html with SSR meta injection for SEO
        index_file = static_build_dir / "index.html"
        if index_file.exists():
            html = index_file.read_text()

            # SSR Meta injection - inject real <title>, description, canonical, og tags
            # into raw HTML so Google sees them WITHOUT JavaScript execution
            seo_meta = await _get_page_seo(full_path)

            # Decide robots directive for this URL (overrides React Helmet so
            # Google never sees an "index" meta for unverified pages).
            robots_override = None
            if is_unverified_demand_page(full_path):
                robots_override = "noindex, follow"
            elif full_path.startswith("event/"):
                slug = full_path[len("event/"):]
                status, _ev = await validate_event_slug(db, slug)
                if status in ("coming_soon",):
                    robots_override = "noindex, follow"
                elif status in ("expired", "missing"):
                    robots_override = "noindex, nofollow"

            if seo_meta:
                t, d, img = seo_meta["title"], seo_meta["desc"], seo_meta.get("image", "")
                canon = f"https://euromatchtickets.com/{full_path.lstrip('/')}" if full_path else "https://euromatchtickets.com"
                
                # Escape quotes in title/description for HTML attributes
                t_safe = t.replace('"', '&quot;')
                d_safe = d.replace('"', '&quot;')
                
                # Replace default meta description with page-specific
                # Try both self-closing and non-self-closing variants
                for old_desc in [
                    '<meta name="description" content="Europe\'s cheapest event ticket shop! Buy verified tickets for Champions League from €49, F1 from €59, Taylor Swift from €79. Instant QR delivery, FanProtect guarantee!" />',
                    '<meta name="description" content="Europe\'s cheapest event ticket shop! Buy verified tickets for Champions League from €49, F1 from €59, Taylor Swift from €79. Instant QR delivery, FanProtect guarantee!"/>',
                    '<meta name="description" content="Europe&#x27;s cheapest event ticket shop! Buy verified tickets for Champions League from €49, F1 from €59, Taylor Swift from €79. Instant QR delivery, FanProtect guarantee!"/>',
                ]:
                    if old_desc in html:
                        html = html.replace(old_desc, f'<meta name="description" content="{d_safe}"/>')
                        break
                
                # Build injection block
                inject = f'<title>{t}</title>'
                inject += f'<link rel="canonical" href="{canon}"/>'
                if robots_override:
                    inject += f'<meta name="robots" content="{robots_override}"/>'
                inject += f'<meta property="og:title" content="{t_safe}"/>'
                inject += f'<meta property="og:description" content="{d_safe}"/>'
                inject += f'<meta property="og:url" content="{canon}"/>'
                inject += '<meta property="og:type" content="website"/>'
                inject += '<meta property="og:site_name" content="EuroMatchTickets"/>'
                if img:
                    inject += f'<meta property="og:image" content="{img}"/>'
                    inject += f'<meta name="twitter:image" content="{img}"/>'
                inject += '<meta name="twitter:card" content="summary_large_image"/>'
                inject += f'<meta name="twitter:title" content="{t_safe}"/>'
                
                # Strategy 1: Replace the HTML comment (dev mode)
                if '<!-- canonical set dynamically by pre-hydration script -->' in html:
                    html = html.replace('<!-- canonical set dynamically by pre-hydration script -->', inject)
                # Strategy 2: Inject before </head> (production build - comments stripped)
                elif '</head>' in html:
                    html = html.replace('</head>', inject + '</head>')
            elif robots_override and '</head>' in html:
                # No SEO meta but still need to flag this URL as noindex
                html = html.replace(
                    '</head>',
                    f'<meta name="robots" content="{robots_override}"/></head>',
                )

            return Response(content=html, media_type="text/html")
        return Response(content="Not Found", status_code=404)


# SEO metadata lookup for SSR injection
async def _get_page_seo(path: str):
    """Get SEO metadata for a page path - used for server-side meta injection."""
    
    # Static page SEO map - most important pages
    STATIC_SEO = {
        # ━━━ TOP 10 PRIORITY PAGES ━━━
        "justin-bieber-amsterdam-2026-tickets": {"title": "Justin Bieber Amsterdam 2026 \u2014 No Dates Confirmed Yet | Get Notified", "desc": "Justin Bieber has not officially announced a 2026 Amsterdam show. Be the first to know when Johan Cruijff ArenA dates drop \u2014 join the free notify list.", "image": "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1200"},
        # Growth Engine — demand & authority hubs
        "concerts-in-amsterdam-2026": {"title": "Concerts in Amsterdam 2026 \u2014 Full Schedule & Cheap Tickets | EuroMatchTickets", "desc": "Every confirmed Amsterdam concert 2026: Johan Cruijff ArenA, Ziggo Dome, Paradiso. Live prices from \u20ac49, venue guides, notify list for unannounced tours. Updated daily.", "image": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200"},
        "concerts-in-london-2026": {"title": "Concerts in London 2026 \u2014 Full Schedule & Cheap Tickets | EuroMatchTickets", "desc": "Every confirmed London concert 2026: Wembley, Tottenham Stadium, The O2, Alexandra Palace. Live prices from \u00a345, venue guides, notify list. Updated daily.", "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200"},
        "europe-tours-2026": {"title": "Europe Tours 2026 \u2014 Master Concert Calendar | EuroMatchTickets", "desc": "Every confirmed 2026 European tour in one calendar: 180+ multi-city runs across 47 cities. Live prices, city-by-city dates, notify list.", "image": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200"},
        "most-wanted-concerts-2026": {"title": "Most Wanted Concerts 2026 \u2014 Live Fan Demand Ranking | EuroMatchTickets", "desc": "The top 30 most-wanted concerts of 2026, ranked live by fan demand. Updated every 24h. See which tours are selling out first.", "image": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200"},
        "f1-belgian-grand-prix-spa-tickets": {"title": "Buy Spa F1 Tickets 2026 | Belgian Grand Prix From \u20ac109 | Spa-Francorchamps", "desc": "Buy Belgian Grand Prix 2026 tickets from \u20ac109. Eau Rouge Grandstand & Paddock Club VIP. Selling Fast \u2014 limited availability. 100% Money-Back Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200"},
        "f1-monaco-grand-prix-tickets": {"title": "Buy Monaco Grand Prix Tickets 2026 | F1 From \u20ac249 | Monte Carlo", "desc": "Buy Monaco GP 2026 tickets from \u20ac249. Circuit de Monaco harbour views & VIP hospitality. Only 89 tickets left. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=1200"},
        "champions-league-tickets": {"title": "Buy Champions League Tickets 2026 | UCL Final From \u20ac85 | Munich", "desc": "Buy UEFA Champions League 2026 tickets from \u20ac85. Semi-finals & Final in Munich. 90% Sold \u2014 limited seats remaining. 100% Money-Back Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200"},
        "el-clasico-tickets": {"title": "Buy El Clasico Tickets 2026 | Real Madrid vs Barcelona From \u20ac89", "desc": "Buy El Clasico 2026 tickets from \u20ac89. Real Madrid vs Barcelona, Santiago Bernab\u00e9u. Only 23 tickets left. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200"},
        "taylor-swift-london-tickets": {"title": "Taylor Swift London \u2014 No 2026 Dates Confirmed Yet | Get Notified", "desc": "The Eras Tour officially ended 8 Dec 2024. Taylor Swift has not announced a 2026 London tour. Join the free notify list \u2014 be first when Wembley dates drop.", "image": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200"},
        "coldplay-tour-2026": {"title": "Buy Coldplay Tour Tickets 2026 | Europe Concerts From \u20ac69 | Barcelona", "desc": "Buy Coldplay Music of the Spheres 2026 tickets from \u20ac69. Barcelona, Berlin, London. Selling Fast. 100% Money-Back Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200"},
        "world-cup-2026-tickets": {"title": "Buy FIFA World Cup 2026 Tickets | From \u20ac65 | USA, Mexico, Canada", "desc": "Buy World Cup 2026 tickets from \u20ac65. Group stage to Final across USA, Mexico, Canada. Limited availability. 100% Money-Back Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200"},
        "world-cup-2026": {"title": "Buy FIFA World Cup 2026 Tickets | From \u20ac65 | USA, Mexico, Canada", "desc": "Buy World Cup 2026 tickets from \u20ac65. All matches USA, Mexico, Canada. Verified sellers. 100% Money-Back Guarantee.", "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200"},
        "f1-tickets": {"title": "Buy Formula 1 Tickets 2026 | All 24 Grand Prix From \u20ac79", "desc": "Buy F1 2026 tickets from \u20ac79. Monaco, Spa, Monza, Silverstone & all 24 races. 42% cheaper than F1.com. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200"},
        "f1-tickets-2026": {"title": "Buy Formula 1 Tickets 2026 | All Grand Prix From \u20ac79", "desc": "Buy F1 2026 tickets from \u20ac79. All 24 Grand Prix races. Monaco, Spa, Monza. 42% cheaper. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200"},
        # ━━━ OTHER KEY PAGES ━━━
        "the-weeknd-tour-2026": {"title": "Buy The Weeknd Tour Tickets 2026 | Europe From \u20ac79", "desc": "Buy The Weeknd After Hours Til Dawn 2026 tickets from \u20ac79. European concerts. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200"},
        "bruno-mars-tour-2026": {"title": "Buy Bruno Mars Tour Tickets 2026 | London & Europe From \u20ac89", "desc": "Buy Bruno Mars 2026 tickets from \u20ac89. London Wembley & European dates. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200"},
        "bad-bunny-london-2026": {"title": "Buy Bad Bunny London Tickets 2026 | Tottenham Stadium From \u20ac79", "desc": "Buy Bad Bunny London 2026 tickets from \u20ac79. Tottenham Hotspur Stadium. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200"},
        "motogp-tickets": {"title": "Buy MotoGP Tickets 2026 | All 21 Races From \u20ac45", "desc": "Buy MotoGP 2026 tickets from \u20ac45. Mugello, Valencia, Silverstone. 30% cheaper. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200"},
        "isle-of-man-tt-tickets": {"title": "Buy Isle of Man TT Tickets 2026 | Race Passes From \u20ac79", "desc": "Buy Isle of Man TT 2026 tickets from \u20ac79. Superbike, Senior TT, Full Week Pass. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200"},
        "super-bowl-2026-tickets": {"title": "Buy Super Bowl Tickets 2027 | VIP From \u20ac2,499", "desc": "Buy Super Bowl LXI 2027 tickets. VIP packages & best seats. SoFi Stadium. 100% Money-Back Guarantee.", "image": "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200"},
        "f1-british-grand-prix-silverstone-tickets": {"title": "Buy Silverstone F1 Tickets 2026 | British Grand Prix From \u20ac149", "desc": "Buy British Grand Prix 2026 tickets from \u20ac149. Silverstone grandstands & Paddock Club. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200"},
        "f1-singapore-grand-prix-tickets": {"title": "Buy Singapore GP Tickets 2026 | F1 Night Race From \u20ac189", "desc": "Buy Singapore Grand Prix 2026 tickets from \u20ac189. Marina Bay night race. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=1200"},
        "f1-las-vegas-grand-prix-tickets": {"title": "Buy Las Vegas GP Tickets 2026 | F1 Night Race From \u20ac249", "desc": "Buy Las Vegas Grand Prix 2026 tickets from \u20ac249. The Strip Circuit night race. VIP available. Instant QR.", "image": "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1200"},
        "bayern-munich-vs-real-madrid-tickets": {"title": "Buy Bayern vs Real Madrid Tickets 2026 | UCL From \u20ac129", "desc": "Buy Bayern Munich vs Real Madrid UCL 2026 tickets from \u20ac129. Allianz Arena. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200"},
        "bayern-munich-tickets": {"title": "Buy Bayern Munich Tickets 2026 | Allianz Arena From \u20ac49", "desc": "Buy Bayern Munich tickets. Bundesliga & Champions League. Allianz Arena from \u20ac49. Instant delivery.", "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200"},
        "world-athletics-2026-tickets": {"title": "Buy World Athletics Tickets 2026 | Championships From \u20ac49", "desc": "Buy World Athletics 2026 tickets from \u20ac49. 100m Final, Marathon & all events. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=1200"},
        "harry-styles-tickets": {"title": "Buy Harry Styles Tour Tickets 2026 | London From \u20ac79", "desc": "Buy Harry Styles Love On Tour 2026 tickets from \u20ac79. Wembley London. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200"},
        "metallica-sphere-las-vegas-tickets": {"title": "Buy Metallica Sphere Las Vegas Tickets 2026 | From \u20ac99", "desc": "Buy Metallica at The Sphere Las Vegas 2026 from \u20ac99. Immersive 360 experience. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=1200"},
        "f1-dutch-grand-prix-zandvoort-tickets": {"title": "Buy Dutch GP Tickets 2026 | Zandvoort F1 From \u20ac149", "desc": "Buy Dutch Grand Prix 2026 tickets from \u20ac149. Circuit Zandvoort. All grandstands. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=1200"},
        "f1-miami-grand-prix-tickets": {"title": "Buy Miami GP Tickets 2026 | F1 From \u20ac229", "desc": "Buy Miami Grand Prix 2026 tickets from \u20ac229. Hard Rock Stadium. VIP available. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1200"},
        "f1-bahrain-grand-prix-tickets": {"title": "Buy Bahrain GP Tickets 2026 | F1 Night Race From \u20ac149", "desc": "Buy Bahrain Grand Prix 2026 tickets from \u20ac149. Sakhir International Circuit. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200"},
        "f1-italian-grand-prix-monza-tickets": {"title": "Buy Monza F1 Tickets 2026 | Italian Grand Prix From \u20ac89", "desc": "Buy Italian Grand Prix 2026 tickets from \u20ac89. Autodromo Nazionale di Monza. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200"},
        "guns-n-roses-tour-2026": {"title": "Buy Guns N' Roses Tour Tickets 2026 | Europe From \u20ac89", "desc": "Buy Guns N' Roses European Stadium Tour 2026 from \u20ac89. 100% Guarantee. Instant QR delivery.", "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200"},
        "monaco-grand-prix-tickets": {"title": "Buy Monaco Grand Prix Tickets 2026 | F1 From \u20ac249 | Monte Carlo", "desc": "Buy Monaco GP 2026 tickets from \u20ac249. Circuit de Monaco. Harbour views & VIP. 100% Guarantee. Instant QR.", "image": "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=1200"},
    }
    
    seo = STATIC_SEO.get(path)
    if seo:
        return seo
    
    # Homepage
    if not path or path == "/":
        return {"title": "Buy Tickets | Champions League, F1, Concerts | EuroMatchTickets", "desc": "Buy Champions League tickets from €85, F1 from €79, Taylor Swift from €79. Verified sellers, instant QR delivery. 100% Money-Back Guarantee.", "image": "https://euromatchtickets.com/og-image.jpg"}
    
    # Check if it's an event page
    if path.startswith("event/"):
        slug = path.replace("event/", "")
        event = await db.events.find_one({"slug": slug}, {"_id": 0, "title": 1, "venue": 1, "city": 1, "image_url": 1, "price_from": 1})
        if event:
            price = event.get("price_from", 99)
            return {
                "title": f"Buy {event['title']} Tickets | From €{price}",
                "desc": f"{event['title']} tickets from €{price}. {event.get('venue', '')}, {event.get('city', '')}. Verified sellers, instant QR delivery. FanProtect guarantee.",
                "image": event.get("image_url", "")
            }
    
    # Check SEO pages DB
    seo_page = await db.seo_pages.find_one({"slug": path, "active": True}, {"_id": 0, "title": 1, "meta_description": 1, "image": 1})
    if seo_page:
        return {
            "title": seo_page.get("title", ""),
            "desc": seo_page.get("meta_description", ""),
            "image": seo_page.get("image", "")
        }
    
    return None
