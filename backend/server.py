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

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.get("/")
async def root():
    return {"status": "EuroMatchTickets API v2.0 - Modular Architecture", "endpoints": "/api/..."}

@app.get("/api")
@app.get("/api/")
async def api_root():
    return {"status": "EuroMatchTickets API v2.0", "version": "2.0"}


# SEO Bot imports
SEO_BOT_AVAILABLE = False
seo_bot = None

# Create a temporary api_router for bot compatibility
from fastapi import APIRouter as _APIRouter
_bot_router = _APIRouter(prefix="/api")

try:
    from seo_bot import seo_bot as _seo_bot, get_seo_bot_routes
    seo_bot = _seo_bot
    seo_bot_router = get_seo_bot_routes(_bot_router)
    if seo_bot_router:
        app.include_router(seo_bot_router)
    SEO_BOT_AVAILABLE = True
    logger.info("SEO Bot routes registered")
except (ImportError, Exception) as e:
    logger.info(f"SEO Bot not available: {e}")

try:
    from super_seo_bot import super_seo_bot, get_super_seo_routes
    super_router = get_super_seo_routes(_bot_router)
    if super_router:
        app.include_router(super_router)
    logger.info("Super SEO Bot routes registered")
except (ImportError, Exception) as e:
    logger.info(f"Super SEO Bot not available: {e}")

try:
    from ultra_seo_bot import ultra_seo_bot, get_ultra_seo_routes
    ultra_router = get_ultra_seo_routes(_bot_router)
    if ultra_router:
        app.include_router(ultra_router)
    logger.info("Ultra SEO Bot routes registered")
except (ImportError, Exception) as e:
    logger.info(f"Ultra SEO Bot not available: {e}")


# Background tasks
async def seo_bot_scheduler():
    while True:
        try:
            if SEO_BOT_AVAILABLE and seo_bot:
                logger.info("SEO Bot: Starting optimization cycle...")
                results = await seo_bot.run_optimization_cycle()
                logger.info(f"SEO Bot: Cycle completed. Actions: {len(results.get('actions', []))}")
            await asyncio.sleep(6 * 60 * 60)
        except Exception as e:
            logger.error(f"SEO Bot Error: {e}")
            await asyncio.sleep(60 * 60)


from datetime import datetime, timezone

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
    if SEO_BOT_AVAILABLE:
        asyncio.create_task(seo_bot_scheduler())
        logger.info("SEO Bot Scheduler started")
    asyncio.create_task(cleanup_expired_events())
    logger.info("Cleanup Bot started - runs daily")


@app.on_event("shutdown")
async def shutdown():
    client.close()
