from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
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
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

logger.info("Starting server...")

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# MongoDB
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'euromatchtickets')
logger.info(f"MongoDB: {db_name}")

client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=30000)
db = client[db_name]

# Stripe (optional)
try:
    import stripe
    stripe.api_key = os.environ.get('STRIPE_API_KEY', '')
    logger.info("Stripe OK")
except:
    stripe = None
    logger.warning("Stripe not available")

# Create app
app = FastAPI(title="EuroMatchTickets")
api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "buyer"
    created_at: datetime = datetime.now(timezone.utc)

# Health
@app.get("/health")
async def health():
    return {"status": "healthy"}

@api_router.get("/health")
async def api_health():
    return {"status": "healthy"}

# Auth helper
async def get_current_user(request: Request) -> Optional[User]:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            session_token = auth[7:]
    if not session_token:
        return None
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        return None
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        return None
    return User(**user)

# Auth endpoints
@api_router.post("/auth/session")
async def auth_session(request: Request, response: Response):
    try:
        body = await request.json()
        session_id = body.get("session_id")
        if not session_id:
            raise HTTPException(400, "session_id required")
        
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
        
        if r.status_code != 200:
            raise HTTPException(401, "Invalid session")
        
        data = r.json()
        email = data.get("email")
        name = data.get("name", "User")
        picture = data.get("picture")
        token = data.get("session_token")
        
        if not email or not token:
            raise HTTPException(401, "Invalid data")
        
        user = await db.users.find_one({"email": email}, {"_id": 0})
        if user:
            user_id = user["user_id"]
            await db.users.update_one({"user_id": user_id}, {"$set": {"name": name, "picture": picture}})
        else:
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            await db.users.insert_one({
                "user_id": user_id, "email": email, "name": name,
                "picture": picture, "role": "buyer",
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        
        await db.user_sessions.delete_many({"user_id": user_id})
        await db.user_sessions.insert_one({
            "session_id": str(uuid.uuid4()), "user_id": user_id,
            "session_token": token,
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        })
        
        response.set_cookie("session_token", token, httponly=True, secure=True, samesite="none", max_age=604800)
        user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return {"success": True, "user": user_doc}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Auth error: {e}")
        raise HTTPException(500, str(e))

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(401, "Not authenticated")
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_many({"session_token": token})
    response.delete_cookie("session_token")
    return {"success": True}

# Events
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
            {"city": {"$regex": search, "$options": "i"}}
        ]
    
    events = await db.events.find(query, {"_id": 0}).sort("event_date", 1).to_list(100)
    
    if events:
        ids = [e["event_id"] for e in events]
        stats = await db.tickets.aggregate([
            {"$match": {"event_id": {"$in": ids}, "status": "available"}},
            {"$group": {"_id": "$event_id", "count": {"$sum": 1}, "min": {"$min": "$price"}}}
        ]).to_list(None)
        stats_map = {s["_id"]: s for s in stats}
        for e in events:
            s = stats_map.get(e["event_id"], {})
            e["available_tickets"] = s.get("count", 0)
            e["lowest_price"] = s.get("min")
    
    return events

@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(404, "Event not found")
    event["tickets"] = await db.tickets.find({"event_id": event_id, "status": "available"}, {"_id": 0}).to_list(500)
    return event

# Tickets
@api_router.get("/tickets")
async def get_tickets(event_id: Optional[str] = None):
    query = {"status": "available"}
    if event_id:
        query["event_id"] = event_id
    return await db.tickets.find(query, {"_id": 0}).to_list(500)

# Seed
@api_router.post("/seed")
async def seed():
    if await db.events.count_documents({}) > 0:
        return {"message": "Already seeded"}
    
    events = [
        {"event_id": f"e_{uuid.uuid4().hex[:8]}", "event_type": "match", "title": "Liverpool vs Arsenal",
         "event_date": "2026-03-15T15:00:00Z", "city": "Liverpool", "country": "England", "venue": "Anfield",
         "image_url": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800", "categories": ["football"]},
        {"event_id": f"e_{uuid.uuid4().hex[:8]}", "event_type": "match", "title": "Real Madrid vs Barcelona",
         "event_date": "2026-04-10T20:00:00Z", "city": "Madrid", "country": "Spain", "venue": "Bernabeu",
         "image_url": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800", "categories": ["football"]},
        {"event_id": f"e_{uuid.uuid4().hex[:8]}", "event_type": "concert", "title": "Coldplay",
         "event_date": "2026-05-20T20:00:00Z", "city": "Berlin", "country": "Germany", "venue": "Olympiastadion",
         "image_url": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800", "categories": ["concert"]}
    ]
    await db.events.insert_many(events)
    
    for ev in events:
        tickets = [{"ticket_id": f"t_{uuid.uuid4().hex[:8]}", "event_id": ev["event_id"], "seller_id": "system",
                    "category": ["Standard", "Premium", "VIP"][i%3], "price": 50 + i*15, "currency": "EUR",
                    "status": "available"} for i in range(20)]
        await db.tickets.insert_many(tickets)
    
    return {"message": "Seeded", "events": len(events)}

app.include_router(api_router)
logger.info("Server ready")
