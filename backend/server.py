"""
EuroMatchTickets Backend - Modular FastAPI Application
Refactored from monolith into clean module structure
"""
import os
import sys
import asyncio
import logging

from fastapi import FastAPI, Request
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

# Legacy seed routes - imported from old server to preserve seed data endpoints
from routes.seed import router as seed_router

app = FastAPI(title="EuroMatchTickets API", version="2.0")

# GZip Compression for faster response times
app.add_middleware(GZipMiddleware, minimum_size=500)

# Cache control middleware for API responses
from starlette.middleware.base import BaseHTTPMiddleware

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
]
react_url = os.environ.get('REACT_APP_BACKEND_URL', '')
if react_url:
    ALLOWED_ORIGINS.append(react_url)
preview_url = os.environ.get('PREVIEW_URL', '')
if preview_url:
    ALLOWED_ORIGINS.append(preview_url)
ALLOWED_ORIGINS.append("*")

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
app.include_router(seed_router)

# Serve uploaded files
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pathlib
uploads_dir = pathlib.Path(__file__).parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Serve frontend build (for production on Render)
static_dir = pathlib.Path(__file__).parent / "static"
has_frontend_build = (static_dir / "index.html").exists()
if has_frontend_build:
    # Serve static assets (JS, CSS, images, etc.)
    static_assets = static_dir / "static"
    if static_assets.exists():
        app.mount("/static", StaticFiles(directory=str(static_assets)), name="frontend_static")
    # Serve images from the build
    images_dir = static_dir / "images"
    if images_dir.exists():
        app.mount("/images", StaticFiles(directory=str(images_dir)), name="frontend_images")
    # Serve logo
    logo_dir = static_dir / "logo"
    if logo_dir.exists():
        app.mount("/logo", StaticFiles(directory=str(logo_dir)), name="frontend_logo")
    # Serve sitemaps
    sitemaps_dir = static_dir / "sitemaps"
    if sitemaps_dir.exists():
        app.mount("/sitemaps", StaticFiles(directory=str(sitemaps_dir)), name="frontend_sitemaps")

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.get("/api")
@app.get("/api/")
async def api_root():
    return {"status": "EuroMatchTickets API v2.0", "version": "2.0"}

# Catch-all: Serve React SPA for any non-API route (production)
if has_frontend_build:
    @app.get("/")
    async def serve_spa_root():
        return FileResponse(str(static_dir / "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # NEVER intercept API routes - let FastAPI routers handle them
        if full_path.startswith("api/") or full_path.startswith("api") or full_path == "uploads":
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        # Try to serve the exact file first
        file_path = static_dir / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        # Otherwise serve index.html for SPA routing (including /auth/callback, /events, etc.)
        return FileResponse(str(static_dir / "index.html"))
else:
    @app.get("/")
    async def root():
        return {"status": "EuroMatchTickets API v2.0 - Modular Architecture", "endpoints": "/api/..."}


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


@app.on_event("startup")
async def startup():
    asyncio.create_task(cleanup_expired_events())
    logger.info("Cleanup Bot started - runs daily")


@app.on_event("shutdown")
async def shutdown():
    client.close()
