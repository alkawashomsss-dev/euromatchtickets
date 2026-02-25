from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger.info("🚀 Starting EuroMatchTickets API...")

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'euromatchtickets')
logger.info(f"📊 Connecting to MongoDB: {db_name}")

try:
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=30000)
    db = client[db_name]
    logger.info("✅ MongoDB client created")
except Exception as e:
    logger.error(f"❌ MongoDB error: {e}")
    raise

# Optional imports with fallbacks
try:
    import stripe
    stripe.api_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
    STRIPE_AVAILABLE = True
    logger.info("✅ Stripe loaded")
except ImportError:
    STRIPE_AVAILABLE = False
    stripe = None
    logger.warning("⚠️ Stripe not available")

try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    AI_CHAT_AVAILABLE = True
    logger.info("✅ AI Chat loaded")
except ImportError as e:
    AI_CHAT_AVAILABLE = False
    LlmChat = None
    UserMessage = None
    logger.warning(f"⚠️ AI Chat not available: {e}")

try:
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    STRIPE_CHECKOUT_AVAILABLE = True
    logger.info("✅ Stripe Checkout loaded")
except ImportError as e:
    STRIPE_CHECKOUT_AVAILABLE = False
    StripeCheckout = None
    logger.warning(f"⚠️ Stripe Checkout not available: {e}")

try:
    import qrcode
    QR_AVAILABLE = True
except ImportError:
    QR_AVAILABLE = False
    qrcode = None

# Create FastAPI app
app = FastAPI(title="EuroMatchTickets API")
api_router = APIRouter(prefix="/api")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("✅ FastAPI app created")

# ============== MODELS ==============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "buyer"
    created_at: datetime = datetime.now(timezone.utc)

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str
    event_type: str
    title: str
    subtitle: Optional[str] = None
    event_date: datetime
    city: str
    country: str
    venue: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    categories: List[str] = []

class Ticket(BaseModel):
    model_config = ConfigDict(extra="ignore")
    ticket_id: str
    event_id: str
    seller_id: str
    category: str
    section: Optional[str] = None
    row: Optional[str] = None
    seat: Optional[str] = None
    price: float
    currency: str = "EUR"
    status: str = "available"

# ============== HEALTH ENDPOINTS ==============

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "euromatchtickets-api"}

@api_router.get("/health")
async def api_health():
    return {"status": "healthy", "service": "euromatchtickets-api"}

# ============== AUTH HELPERS ==============

async def get_current_user(request: Request) -> Optional[User]:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        return None
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    
    return User(**user_doc)

# ============== AUTH ENDPOINTS ==============

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id from Emergent Auth for session_token"""
    try:
        body = await request.json()
        session_id = body.get("session_id")
        
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id required")
        
        logger.info(f"🔐 Auth exchange for session: {session_id[:20]}...")
        
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            auth_response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
        
        if auth_response.status_code != 200:
            logger.error(f"❌ Auth failed: {auth_response.status_code}")
            raise HTTPException(status_code=401, detail="Invalid session")
        
        auth_data = auth_response.json()
        email = auth_data.get("email")
        name = auth_data.get("name", "User")
        picture = auth_data.get("picture")
        session_token = auth_data.get("session_token")
        
        if not email or not session_token:
            raise HTTPException(status_code=401, detail="Invalid auth data")
        
        existing_user = await db.users.find_one({"email": email}, {"_id": 0})
        
        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one({"user_id": user_id}, {"$set": {"name": name, "picture": picture}})
        else:
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            user_doc = {
                "user_id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "role": "buyer",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(user_doc)
        
        session_doc = {
            "session_id": str(uuid.uuid4()),
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.user_sessions.delete_many({"user_id": user_id})
        await db.user_sessions.insert_one(session_doc)
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7 * 24 * 60 * 60
        )
        
        user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        logger.info(f"✅ Auth success for: {email}")
        
        return {"success": True, "user": user_doc}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Auth error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    response.delete_cookie("session_token")
    return {"success": True}

# ============== EVENTS ENDPOINTS ==============

@api_router.get("/events")
async def get_events(event_type: Optional[str] = None, city: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if event_type:
        query["event_type"] = event_type
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"city": {"$regex": search, "$options": "i"}},
            {"venue": {"$regex": search, "$options": "i"}}
        ]
    
    events = await db.events.find(query, {"_id": 0}).sort("event_date", 1).to_list(100)
    
    # Get ticket stats
    event_ids = [e["event_id"] for e in events]
    if event_ids:
        pipeline = [
            {"$match": {"event_id": {"$in": event_ids}, "status": "available"}},
            {"$group": {"_id": "$event_id", "count": {"$sum": 1}, "min_price": {"$min": "$price"}}}
        ]
        ticket_stats = await db.tickets.aggregate(pipeline).to_list(None)
        stats_map = {s["_id"]: s for s in ticket_stats}
        
        for event in events:
            stats = stats_map.get(event["event_id"], {"count": 0, "min_price": None})
            event["available_tickets"] = stats["count"]
            event["lowest_price"] = stats["min_price"]
    
    return events

@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    tickets = await db.tickets.find({"event_id": event_id, "status": "available"}, {"_id": 0}).to_list(500)
    event["tickets"] = tickets
    return event

# ============== TICKETS ENDPOINTS ==============

@api_router.get("/tickets")
async def get_tickets(event_id: Optional[str] = None):
    query = {"status": "available"}
    if event_id:
        query["event_id"] = event_id
    tickets = await db.tickets.find(query, {"_id": 0}).to_list(500)
    return tickets

# ============== SEED ENDPOINT ==============

@api_router.post("/seed")
async def seed_database():
    """Seed database with initial data"""
    # Check if already seeded
    event_count = await db.events.count_documents({})
    if event_count > 0:
        return {"message": "Database already seeded", "events": event_count}
    
    # Sample events
    events = [
        {
            "event_id": f"event_{uuid.uuid4().hex[:12]}",
            "event_type": "match",
            "title": "Liverpool vs Arsenal",
            "subtitle": "Premier League",
            "event_date": datetime(2026, 3, 15, 15, 0, tzinfo=timezone.utc).isoformat(),
            "city": "Liverpool",
            "country": "England",
            "venue": "Anfield",
            "image_url": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
            "description": "Premier League match",
            "categories": ["football", "premier-league"]
        },
        {
            "event_id": f"event_{uuid.uuid4().hex[:12]}",
            "event_type": "match",
            "title": "Real Madrid vs Barcelona",
            "subtitle": "El Clasico - La Liga",
            "event_date": datetime(2026, 4, 10, 20, 0, tzinfo=timezone.utc).isoformat(),
            "city": "Madrid",
            "country": "Spain",
            "venue": "Santiago Bernabeu",
            "image_url": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
            "description": "El Clasico",
            "categories": ["football", "la-liga"]
        },
        {
            "event_id": f"event_{uuid.uuid4().hex[:12]}",
            "event_type": "concert",
            "title": "Coldplay",
            "subtitle": "Music of the Spheres Tour",
            "event_date": datetime(2026, 5, 20, 20, 0, tzinfo=timezone.utc).isoformat(),
            "city": "Berlin",
            "country": "Germany",
            "venue": "Olympiastadion",
            "image_url": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
            "description": "World Tour Concert",
            "categories": ["concert", "rock"]
        }
    ]
    
    await db.events.insert_many(events)
    
    # Create sample tickets for each event
    for event in events:
        tickets = []
        for i in range(20):
            tickets.append({
                "ticket_id": f"ticket_{uuid.uuid4().hex[:12]}",
                "event_id": event["event_id"],
                "seller_id": "system",
                "category": ["Standard", "Premium", "VIP"][i % 3],
                "section": f"Section {chr(65 + (i % 5))}",
                "row": str((i % 10) + 1),
                "seat": str((i % 20) + 1),
                "price": round(50 + (i * 10) + (i % 3) * 50, 2),
                "currency": "EUR",
                "status": "available",
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        await db.tickets.insert_many(tickets)
    
    return {"message": "Database seeded successfully", "events": len(events)}

# Include router
app.include_router(api_router)

logger.info("✅ All routes registered")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
