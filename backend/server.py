from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import base64
import io
import httpx
import stripe

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# AI Chat Support - with error handling
try:
    from openai import OpenAI
    AI_CHAT_AVAILABLE = True
except ImportError as e:
    logger.warning(f"OpenAI not available: {e}")
    AI_CHAT_AVAILABLE = False
    OpenAI = None

# QR Code - with error handling
try:
    import qrcode
    QR_AVAILABLE = True
except ImportError:
    logger.warning("QR code library not available")
    QR_AVAILABLE = False
    qrcode = None

# Email Service - with error handling
try:
    from email_service import (
        send_order_confirmation, send_seller_notification, 
        send_price_drop_alert, send_welcome
    )
    EMAIL_SERVICE_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Email service not available: {e}")
    EMAIL_SERVICE_AVAILABLE = False
    async def send_order_confirmation(*args, **kwargs): pass
    async def send_seller_notification(*args, **kwargs): pass
    async def send_price_drop_alert(*args, **kwargs): pass
    async def send_welcome(*args, **kwargs): pass

# MongoDB connection - will be initialized on startup
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'euromatchtickets')
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=30000, connectTimeoutMS=30000)
db = client[db_name]

# Stripe configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
PLATFORM_COMMISSION = 0.10  # 10% commission
stripe.api_key = STRIPE_API_KEY
STRIPE_AVAILABLE = True

# Create the main app
app = FastAPI(title="EuroMatchTickets - Events & Tickets Marketplace")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Server starting up...")
    logger.info(f"📊 MongoDB URL: {mongo_url[:30]}...")
    logger.info(f"📊 Database: {db_name}")
    # Don't block startup on DB ping - let it connect lazily
    logger.info("✅ Server ready to accept connections")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Server shutting down...")
    try:
        client.close()
    except:
        pass

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "buyer"  # buyer, seller, admin
    rating: float = 5.0
    total_sales: int = 0
    kyc_status: str = "pending"  # pending, submitted, verified, rejected
    kyc_documents: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str = Field(default_factory=lambda: f"event_{uuid.uuid4().hex[:12]}")
    event_type: str  # match, concert
    title: str
    subtitle: Optional[str] = None  # e.g., "World Tour 2025" for concerts
    description: Optional[str] = None  # SEO description 150-300 words
    # For matches
    home_team: Optional[str] = None
    away_team: Optional[str] = None
    home_logo: Optional[str] = None
    away_logo: Optional[str] = None
    league: Optional[str] = None
    league_logo: Optional[str] = None
    # For concerts
    artist: Optional[str] = None
    artist_image: Optional[str] = None
    genre: Optional[str] = None
    # Common fields
    venue: str
    city: str
    country: str
    event_date: datetime
    event_image: Optional[str] = None
    status: str = "upcoming"  # upcoming, live, completed, cancelled
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    event_type: str
    title: str
    subtitle: Optional[str] = None
    home_team: Optional[str] = None
    away_team: Optional[str] = None
    home_logo: Optional[str] = None
    away_logo: Optional[str] = None
    league: Optional[str] = None
    league_logo: Optional[str] = None
    artist: Optional[str] = None
    artist_image: Optional[str] = None
    genre: Optional[str] = None
    venue: str
    city: str
    country: str
    event_date: datetime
    event_image: Optional[str] = None
    featured: bool = False

class Ticket(BaseModel):
    model_config = ConfigDict(extra="ignore")
    ticket_id: str = Field(default_factory=lambda: f"ticket_{uuid.uuid4().hex[:12]}")
    event_id: str
    seller_id: str
    seller_name: str
    category: str  # vip, cat1, cat2, cat3, standing, floor
    section: str
    row: Optional[str] = None
    seat: Optional[str] = None
    price: float
    original_price: float
    currency: str = "EUR"
    status: str = "available"  # available, reserved, sold
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TicketCreate(BaseModel):
    event_id: str
    category: str
    section: str
    row: Optional[str] = None
    seat: Optional[str] = None
    price: float
    original_price: float
    currency: str = "EUR"

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str = Field(default_factory=lambda: f"order_{uuid.uuid4().hex[:12]}")
    buyer_id: str
    buyer_email: str
    ticket_id: str
    event_id: str
    seller_id: str
    ticket_price: float
    commission: float
    total_amount: float
    currency: str = "EUR"
    status: str = "pending"  # pending, paid, completed, cancelled, refunded, disputed
    stripe_session_id: Optional[str] = None
    qr_code: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Rating(BaseModel):
    model_config = ConfigDict(extra="ignore")
    rating_id: str = Field(default_factory=lambda: f"rating_{uuid.uuid4().hex[:12]}")
    order_id: str
    seller_id: str
    buyer_id: str
    rating: int  # 1-5
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RatingCreate(BaseModel):
    order_id: str
    rating: int
    comment: Optional[str] = None

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    transaction_id: str = Field(default_factory=lambda: f"txn_{uuid.uuid4().hex[:12]}")
    order_id: str
    session_id: str
    amount: float
    currency: str
    status: str = "initiated"  # initiated, paid, failed, expired
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Dispute(BaseModel):
    model_config = ConfigDict(extra="ignore")
    dispute_id: str = Field(default_factory=lambda: f"dispute_{uuid.uuid4().hex[:12]}")
    order_id: str
    buyer_id: str
    seller_id: str
    reason: str
    description: str
    status: str = "open"  # open, investigating, resolved, closed
    resolution: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class KYCSubmission(BaseModel):
    full_name: str
    date_of_birth: str
    address: str
    country: str
    id_type: str  # passport, national_id, drivers_license
    id_number: str

class PriceAlert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    alert_id: str = Field(default_factory=lambda: f"alert_{uuid.uuid4().hex[:12]}")
    user_id: str
    user_email: str
    event_id: str
    target_price: float
    current_lowest: Optional[float] = None
    status: str = "active"  # active, triggered, cancelled
    language: str = "en"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PriceAlertCreate(BaseModel):
    event_id: str
    target_price: float

class SellerPayout(BaseModel):
    model_config = ConfigDict(extra="ignore")
    payout_id: str = Field(default_factory=lambda: f"payout_{uuid.uuid4().hex[:12]}")
    seller_id: str
    order_id: str
    ticket_id: str
    gross_amount: float  # Total ticket price
    commission: float  # Platform fee
    net_amount: float  # What seller receives
    currency: str = "EUR"
    status: str = "pending"  # pending, processing, completed, failed
    payout_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============== AUTH HELPERS ==============

# Health check endpoint for Kubernetes
@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes liveness/readiness probes"""
    try:
        # Quick DB check
        await db.command('ping')
        return {"status": "healthy", "service": "euromatchtickets-api", "db": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "healthy", "service": "euromatchtickets-api", "db": "error"}

@app.get("/api/health")
async def api_health_check():
    """API Health check endpoint"""
    return {"status": "healthy", "service": "euromatchtickets-api"}

async def get_current_user(request: Request) -> Optional[User]:
    """Get current user from session token"""
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
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_auth(request: Request) -> User:
    """Require authentication"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_seller(request: Request) -> User:
    """Require seller or admin role"""
    user = await require_auth(request)
    if user.role not in ["seller", "admin"]:
        raise HTTPException(status_code=403, detail="Seller access required")
    return user

async def require_admin(request: Request) -> User:
    """Require admin role"""
    user = await require_auth(request)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ============== AUTH ENDPOINTS ==============

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id from Emergent Auth for session_token"""
    logger.info("🔐 Auth session exchange started")
    try:
        body = await request.json()
        session_id = body.get("session_id")
        logger.info(f"📝 Session ID received: {session_id[:20] if session_id else 'None'}...")
        
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id required")
        
        logger.info("🌐 Calling Emergent Auth API...")
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            auth_response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
        
        logger.info(f"📨 Auth API response: {auth_response.status_code}")
        
        if auth_response.status_code != 200:
            logger.error(f"❌ Auth failed: {auth_response.status_code} - {auth_response.text}")
            raise HTTPException(status_code=401, detail="Invalid session")
        
        auth_data = auth_response.json()
        email = auth_data.get("email")
        name = auth_data.get("name", "User")
        picture = auth_data.get("picture")
        session_token = auth_data.get("session_token")
        
        logger.info(f"👤 User email: {email}")
        
        if not email or not session_token:
            logger.error("❌ Missing email or session_token in auth response")
            raise HTTPException(status_code=401, detail="Invalid auth data")
        
        logger.info("🔍 Checking for existing user...")
        existing_user = await db.users.find_one({"email": email}, {"_id": 0})
        
        if existing_user:
            user_id = existing_user["user_id"]
            logger.info(f"✅ Existing user found: {user_id}")
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {"name": name, "picture": picture}}
            )
        else:
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            logger.info(f"🆕 Creating new user: {user_id}")
            new_user = User(
                user_id=user_id,
                email=email,
                name=name,
                picture=picture,
                role="buyer"
            )
            user_doc = new_user.model_dump()
            user_doc['created_at'] = user_doc['created_at'].isoformat()
            await db.users.insert_one(user_doc)
        
        logger.info("💾 Creating session...")
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        session_doc = {
            "session_id": str(uuid.uuid4()),
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.user_sessions.delete_many({"user_id": user_id})
        await db.user_sessions.insert_one(session_doc)
        logger.info("✅ Session created successfully")
        
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
        logger.info(f"🎉 Auth complete for user: {user_id}")
        
        return {"success": True, "user": user_doc}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Auth session error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user"""
    try:
        user = await get_current_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return user.model_dump()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Auth/me error: {str(e)}")
        raise HTTPException(status_code=401, detail="Not authenticated")

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"success": True}

@api_router.post("/auth/become-seller")
async def become_seller(request: Request):
    """Upgrade user to seller"""
    user = await require_auth(request)
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"role": "seller"}}
    )
    return {"success": True, "role": "seller"}

@api_router.post("/auth/kyc")
async def submit_kyc(kyc_data: KYCSubmission, request: Request):
    """Submit KYC documents"""
    user = await require_auth(request)
    
    kyc_doc = {
        "full_name": kyc_data.full_name,
        "date_of_birth": kyc_data.date_of_birth,
        "address": kyc_data.address,
        "country": kyc_data.country,
        "id_type": kyc_data.id_type,
        "id_number": kyc_data.id_number,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"kyc_status": "submitted", "kyc_documents": kyc_doc}}
    )
    
    return {"success": True, "status": "submitted"}

# ============== EVENTS ENDPOINTS ==============

@api_router.get("/events")
async def get_events(
    event_type: Optional[str] = None,
    league: Optional[str] = None,
    genre: Optional[str] = None,
    city: Optional[str] = None,
    country: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None
):
    """Get events with filters"""
    query = {"status": {"$ne": "cancelled"}}
    
    if event_type and event_type != "all":
        query["event_type"] = event_type
    if league:
        query["league"] = league
    if genre:
        query["genre"] = genre
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if country:
        query["country"] = {"$regex": country, "$options": "i"}
    if featured is not None:
        query["featured"] = featured
    if date_from:
        query["event_date"] = {"$gte": date_from}
    if date_to:
        if "event_date" in query:
            query["event_date"]["$lte"] = date_to
        else:
            query["event_date"] = {"$lte": date_to}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"artist": {"$regex": search, "$options": "i"}},
            {"home_team": {"$regex": search, "$options": "i"}},
            {"away_team": {"$regex": search, "$options": "i"}},
            {"venue": {"$regex": search, "$options": "i"}},
            {"city": {"$regex": search, "$options": "i"}}
        ]
    
    events = await db.events.find(query, {"_id": 0}).sort("event_date", 1).to_list(100)
    
    # Batch fetch ticket info using aggregation to avoid N+1 queries
    if events:
        event_ids = [e["event_id"] for e in events]
        
        # Aggregate ticket counts and lowest prices in one query
        pipeline = [
            {"$match": {"event_id": {"$in": event_ids}, "status": "available"}},
            {"$group": {
                "_id": "$event_id",
                "ticket_count": {"$sum": 1},
                "lowest_price": {"$min": "$price"}
            }}
        ]
        ticket_stats = await db.tickets.aggregate(pipeline).to_list(None)
        
        # Create lookup dict
        stats_map = {s["_id"]: s for s in ticket_stats}
        
        # Apply stats to events
        for event in events:
            stats = stats_map.get(event["event_id"], {})
            event["available_tickets"] = stats.get("ticket_count", 0)
            event["lowest_price"] = stats.get("lowest_price")
    
    return events

@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    """Get event details"""
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    tickets = await db.tickets.find(
        {"event_id": event_id, "status": "available"},
        {"_id": 0}
    ).to_list(500)
    
    event["tickets"] = tickets
    event["ticket_count"] = len(tickets)
    
    categories = {}
    for ticket in tickets:
        cat = ticket["category"]
        if cat not in categories:
            categories[cat] = {"count": 0, "lowest_price": float('inf')}
        categories[cat]["count"] += 1
        if ticket["price"] < categories[cat]["lowest_price"]:
            categories[cat]["lowest_price"] = ticket["price"]
    
    event["categories"] = categories
    
    return event

@api_router.post("/events")
async def create_event(event_data: EventCreate, request: Request):
    """Create a new event (admin only)"""
    user = await require_admin(request)
    
    event = Event(**event_data.model_dump())
    event_doc = event.model_dump()
    event_doc['event_date'] = event_doc['event_date'].isoformat()
    event_doc['created_at'] = event_doc['created_at'].isoformat()
    
    await db.events.insert_one(event_doc)
    return {"success": True, "event_id": event.event_id}

@api_router.put("/events/{event_id}")
async def update_event(event_id: str, event_data: dict, request: Request):
    """Update an event (admin only)"""
    user = await require_admin(request)
    
    if "event_date" in event_data and isinstance(event_data["event_date"], datetime):
        event_data["event_date"] = event_data["event_date"].isoformat()
    
    result = await db.events.update_one(
        {"event_id": event_id},
        {"$set": event_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"success": True}

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, request: Request):
    """Delete an event (admin only)"""
    user = await require_admin(request)
    
    result = await db.events.delete_one({"event_id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"success": True}

# ============== TICKETS ENDPOINTS ==============

@api_router.get("/tickets")
async def get_tickets(
    event_id: Optional[str] = None,
    category: Optional[str] = None,
    seller_id: Optional[str] = None,
    status: str = "available"
):
    """Get tickets with filters"""
    query = {"status": status}
    
    if event_id:
        query["event_id"] = event_id
    if category:
        query["category"] = category
    if seller_id:
        query["seller_id"] = seller_id
    
    tickets = await db.tickets.find(query, {"_id": 0}).to_list(500)
    return tickets

@api_router.post("/tickets")
async def create_ticket(ticket_data: TicketCreate, request: Request):
    """Create a ticket listing (seller only)"""
    user = await require_seller(request)
    
    event = await db.events.find_one({"event_id": ticket_data.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    ticket = Ticket(
        **ticket_data.model_dump(),
        seller_id=user.user_id,
        seller_name=user.name
    )
    
    ticket_doc = ticket.model_dump()
    ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
    
    await db.tickets.insert_one(ticket_doc)
    return {"success": True, "ticket_id": ticket.ticket_id}

@api_router.get("/seller/tickets")
async def get_seller_tickets(request: Request):
    """Get seller's tickets"""
    user = await require_seller(request)
    
    tickets = await db.tickets.find(
        {"seller_id": user.user_id},
        {"_id": 0}
    ).to_list(500)
    
    # Batch fetch events to avoid N+1 queries
    if tickets:
        event_ids = list(set(t["event_id"] for t in tickets))
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        events_map = {e["event_id"]: e for e in events}
        
        for ticket in tickets:
            ticket["event"] = events_map.get(ticket["event_id"])
    
    return tickets

@api_router.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: str, request: Request):
    """Delete a ticket (seller only)"""
    user = await require_seller(request)
    
    ticket = await db.tickets.find_one({"ticket_id": ticket_id}, {"_id": 0})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if ticket["seller_id"] != user.user_id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if ticket["status"] != "available":
        raise HTTPException(status_code=400, detail="Cannot delete sold ticket")
    
    await db.tickets.delete_one({"ticket_id": ticket_id})
    return {"success": True}

# ============== PRICE ALERTS ENDPOINTS ==============

@api_router.post("/price-alerts")
async def create_price_alert(alert_data: PriceAlertCreate, request: Request):
    """Create a price drop alert"""
    user = await require_auth(request)
    
    # Check if event exists
    event = await db.events.find_one({"event_id": alert_data.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Get current lowest price
    lowest_ticket = await db.tickets.find_one(
        {"event_id": alert_data.event_id, "status": "available"},
        {"_id": 0, "price": 1},
        sort=[("price", 1)]
    )
    current_lowest = lowest_ticket["price"] if lowest_ticket else None
    
    # Check if alert already exists
    existing = await db.price_alerts.find_one({
        "user_id": user.user_id,
        "event_id": alert_data.event_id,
        "status": "active"
    }, {"_id": 0})
    
    if existing:
        # Update existing alert
        await db.price_alerts.update_one(
            {"alert_id": existing["alert_id"]},
            {"$set": {"target_price": alert_data.target_price, "current_lowest": current_lowest}}
        )
        return {"success": True, "alert_id": existing["alert_id"], "updated": True}
    
    alert = PriceAlert(
        user_id=user.user_id,
        user_email=user.email,
        event_id=alert_data.event_id,
        target_price=alert_data.target_price,
        current_lowest=current_lowest
    )
    
    alert_doc = alert.model_dump()
    alert_doc['created_at'] = alert_doc['created_at'].isoformat()
    await db.price_alerts.insert_one(alert_doc)
    
    return {"success": True, "alert_id": alert.alert_id}

@api_router.get("/price-alerts")
async def get_my_alerts(request: Request):
    """Get user's price alerts"""
    user = await require_auth(request)
    
    alerts = await db.price_alerts.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    if alerts:
        # Batch fetch events
        event_ids = list(set(a["event_id"] for a in alerts))
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        events_map = {e["event_id"]: e for e in events}
        
        # Batch fetch lowest prices using aggregation
        pipeline = [
            {"$match": {"event_id": {"$in": event_ids}, "status": "available"}},
            {"$group": {"_id": "$event_id", "lowest_price": {"$min": "$price"}}}
        ]
        lowest_prices = await db.tickets.aggregate(pipeline).to_list(None)
        prices_map = {p["_id"]: p["lowest_price"] for p in lowest_prices}
        
        for alert in alerts:
            alert["event"] = events_map.get(alert["event_id"])
            alert["current_lowest"] = prices_map.get(alert["event_id"])
    
    return alerts

@api_router.delete("/price-alerts/{alert_id}")
async def delete_price_alert(alert_id: str, request: Request):
    """Delete a price alert"""
    user = await require_auth(request)
    
    alert = await db.price_alerts.find_one({"alert_id": alert_id}, {"_id": 0})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    if alert["user_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.price_alerts.delete_one({"alert_id": alert_id})
    return {"success": True}

async def check_and_trigger_price_alerts(event_id: str, new_price: float):
    """Check if any price alerts should be triggered"""
    # Find all active alerts for this event where target price >= new price
    alerts = await db.price_alerts.find({
        "event_id": event_id,
        "status": "active",
        "target_price": {"$gte": new_price}
    }, {"_id": 0}).to_list(1000)
    
    if not alerts:
        return
    
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        return
    
    for alert in alerts:
        old_price = alert.get("current_lowest", new_price + 50)
        
        # Send email notification
        await send_price_drop_alert(
            event=event,
            old_price=old_price,
            new_price=new_price,
            user_email=alert["user_email"],
            lang=alert.get("language", "en")
        )
        
        # Update alert status
        await db.price_alerts.update_one(
            {"alert_id": alert["alert_id"]},
            {"$set": {"status": "triggered", "current_lowest": new_price}}
        )

# ============== SELLER PAYOUTS ENDPOINTS ==============

@api_router.get("/seller/payouts")
async def get_seller_payouts(request: Request):
    """Get seller's payout history"""
    user = await require_seller(request)
    
    payouts = await db.seller_payouts.find(
        {"seller_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(500)
    
    # Calculate totals
    total_gross = sum(p.get("gross_amount", 0) for p in payouts)
    total_commission = sum(p.get("commission", 0) for p in payouts)
    total_net = sum(p.get("net_amount", 0) for p in payouts)
    pending_amount = sum(p.get("net_amount", 0) for p in payouts if p.get("status") == "pending")
    completed_amount = sum(p.get("net_amount", 0) for p in payouts if p.get("status") == "completed")
    
    # Batch fetch orders and events
    if payouts:
        order_ids = list(set(p["order_id"] for p in payouts))
        orders = await db.orders.find({"order_id": {"$in": order_ids}}, {"_id": 0}).to_list(None)
        orders_map = {o["order_id"]: o for o in orders}
        
        event_ids = list(set(o.get("event_id") for o in orders if o.get("event_id")))
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        events_map = {e["event_id"]: e for e in events}
        
        for payout in payouts:
            order = orders_map.get(payout["order_id"])
            payout["order"] = order
            payout["event"] = events_map.get(order["event_id"]) if order else None
    
    return {
        "payouts": payouts,
        "summary": {
            "total_gross": round(total_gross, 2),
            "total_commission": round(total_commission, 2),
            "total_net": round(total_net, 2),
            "pending_amount": round(pending_amount, 2),
            "completed_amount": round(completed_amount, 2),
            "total_sales": len(payouts)
        }
    }

@api_router.get("/seller/dashboard-stats")
async def get_seller_dashboard_stats(request: Request):
    """Get comprehensive seller dashboard statistics"""
    user = await require_seller(request)
    
    # Get all payouts
    payouts = await db.seller_payouts.find(
        {"seller_id": user.user_id},
        {"_id": 0}
    ).to_list(1000)
    
    # Get active tickets
    active_tickets = await db.tickets.count_documents({
        "seller_id": user.user_id,
        "status": "available"
    })
    
    # Get sold tickets
    sold_tickets = await db.tickets.count_documents({
        "seller_id": user.user_id,
        "status": "sold"
    })
    
    # Calculate earnings
    total_earnings = sum(p.get("net_amount", 0) for p in payouts)
    pending_earnings = sum(p.get("net_amount", 0) for p in payouts if p.get("status") == "pending")
    
    # Monthly earnings (current month)
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_payouts = [p for p in payouts if p.get("created_at", "") >= month_start.isoformat()]
    monthly_earnings = sum(p.get("net_amount", 0) for p in monthly_payouts)
    
    return {
        "active_listings": active_tickets,
        "sold_tickets": sold_tickets,
        "total_earnings": round(total_earnings, 2),
        "pending_earnings": round(pending_earnings, 2),
        "monthly_earnings": round(monthly_earnings, 2),
        "rating": user.rating,
        "kyc_status": user.kyc_status
    }

# ============== PAYMENT ENDPOINTS ==============

def generate_qr_code(data: str) -> str:
    """Generate QR code as base64 string"""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

@api_router.post("/checkout/create")
async def create_checkout(request: Request):
    """Create Stripe checkout session"""
    user = await require_auth(request)
    body = await request.json()
    
    ticket_id = body.get("ticket_id")
    origin_url = body.get("origin_url")
    
    if not ticket_id or not origin_url:
        raise HTTPException(status_code=400, detail="ticket_id and origin_url required")
    
    ticket = await db.tickets.find_one({"ticket_id": ticket_id, "status": "available"}, {"_id": 0})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not available")
    
    event = await db.events.find_one({"event_id": ticket["event_id"]}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    ticket_price = float(ticket["price"])
    commission = round(ticket_price * PLATFORM_COMMISSION, 2)
    total_amount = round(ticket_price + commission, 2)
    
    order = Order(
        buyer_id=user.user_id,
        buyer_email=user.email,
        ticket_id=ticket_id,
        event_id=ticket["event_id"],
        seller_id=ticket["seller_id"],
        ticket_price=ticket_price,
        commission=commission,
        total_amount=total_amount,
        currency=ticket["currency"]
    )
    
    order_doc = order.model_dump()
    order_doc['created_at'] = order_doc['created_at'].isoformat()
    
    await db.tickets.update_one(
        {"ticket_id": ticket_id},
        {"$set": {"status": "reserved"}}
    )
    
    success_url = f"{origin_url}/order/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/event/{ticket['event_id']}"
    
    # Create Stripe Checkout Session using official Stripe SDK
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': ticket["currency"].lower(),
                'unit_amount': int(total_amount * 100),  # Stripe uses cents
                'product_data': {
                    'name': f"Ticket for {event['title']}",
                    'description': f"{ticket.get('category', 'Standard')} - {ticket.get('section', 'General')}",
                },
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "order_id": order.order_id,
            "ticket_id": ticket_id,
            "buyer_id": user.user_id,
            "event": event['title']
        }
    )
    
    order_doc["stripe_session_id"] = checkout_session.id
    await db.orders.insert_one(order_doc)
    
    transaction = PaymentTransaction(
        order_id=order.order_id,
        session_id=checkout_session.id,
        amount=total_amount,
        currency=ticket["currency"],
        status="initiated",
        metadata={
            "order_id": order.order_id,
            "ticket_id": ticket_id,
            "buyer_id": user.user_id,
            "event": event['title']
        }
    )
    txn_doc = transaction.model_dump()
    txn_doc['created_at'] = txn_doc['created_at'].isoformat()
    await db.payment_transactions.insert_one(txn_doc)
    
    return {
        "url": checkout_session.url,
        "session_id": checkout_session.id,
        "order_id": order.order_id
    }

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    """Get checkout status and complete order if paid"""
    # Get session from Stripe
    session = stripe.checkout.Session.retrieve(session_id)
    payment_status = session.payment_status  # 'paid', 'unpaid', 'no_payment_required'
    
    order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {"status": payment_status}}
    )
    
    if payment_status == "paid" and order["status"] != "completed":
        qr_data = f"FANPASS-{order['order_id']}-{order['ticket_id']}"
        qr_code = generate_qr_code(qr_data)
        
        await db.orders.update_one(
            {"order_id": order["order_id"]},
            {"$set": {"status": "completed", "qr_code": qr_code}}
        )
        
        await db.tickets.update_one(
            {"ticket_id": order["ticket_id"]},
            {"$set": {"status": "sold"}}
        )
        
        await db.users.update_one(
            {"user_id": order["seller_id"]},
            {"$inc": {"total_sales": 1}}
        )
        
        order["status"] = "completed"
        order["qr_code"] = qr_code
        
        # Get event and ticket for emails
        event = await db.events.find_one({"event_id": order["event_id"]}, {"_id": 0})
        ticket = await db.tickets.find_one({"ticket_id": order["ticket_id"]}, {"_id": 0})
        
        # Create seller payout record
        payout = SellerPayout(
            seller_id=order["seller_id"],
            order_id=order["order_id"],
            ticket_id=order["ticket_id"],
            gross_amount=order["total_amount"],
            commission=order["commission"],
            net_amount=order["ticket_price"]
        )
        payout_doc = payout.model_dump()
        payout_doc['created_at'] = payout_doc['created_at'].isoformat()
        await db.seller_payouts.insert_one(payout_doc)
        
        # Send order confirmation email to buyer
        try:
            await send_order_confirmation(order, event, ticket, order["buyer_email"])
        except Exception as e:
            logger.error(f"Failed to send buyer email: {e}")
        
        # Send sale notification to seller
        try:
            seller = await db.users.find_one({"user_id": order["seller_id"]}, {"_id": 0})
            if seller:
                await send_seller_notification(order, event, ticket, seller["email"])
        except Exception as e:
            logger.error(f"Failed to send seller email: {e}")
    
    return {
        "payment_status": payment_status,
        "status": session.status,
        "order": order
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
    
    try:
        if endpoint_secret:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        else:
            # For testing without webhook secret
            data = await request.json()
            event = stripe.Event.construct_from(data, stripe.api_key)
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            session_id = session['id']
            payment_status = session.get('payment_status', '')
            
            if payment_status == "paid":
                order = await db.orders.find_one(
                    {"stripe_session_id": session_id},
                    {"_id": 0}
                )
                
                if order and order["status"] != "completed":
                    qr_data = f"FANPASS-{order['order_id']}-{order['ticket_id']}"
                    qr_code = generate_qr_code(qr_data)
                    
                    await db.orders.update_one(
                        {"order_id": order["order_id"]},
                        {"$set": {"status": "completed", "qr_code": qr_code}}
                    )
                    
                    await db.tickets.update_one(
                        {"ticket_id": order["ticket_id"]},
                        {"$set": {"status": "sold"}}
                    )
                    
                    await db.users.update_one(
                        {"user_id": order["seller_id"]},
                        {"$inc": {"total_sales": 1}}
                    )
        
        return {"received": True}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        return {"received": True}

# ============== ORDERS ENDPOINTS ==============

@api_router.get("/orders")
async def get_orders(request: Request):
    """Get user's orders"""
    user = await require_auth(request)
    
    orders = await db.orders.find(
        {"buyer_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    if orders:
        # Batch fetch events and tickets
        event_ids = list(set(o["event_id"] for o in orders))
        ticket_ids = list(set(o["ticket_id"] for o in orders))
        
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        tickets = await db.tickets.find({"ticket_id": {"$in": ticket_ids}}, {"_id": 0}).to_list(None)
        
        events_map = {e["event_id"]: e for e in events}
        tickets_map = {t["ticket_id"]: t for t in tickets}
        
        for order in orders:
            order["event"] = events_map.get(order["event_id"])
            order["ticket"] = tickets_map.get(order["ticket_id"])
    
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, request: Request):
    """Get order details"""
    user = await require_auth(request)
    
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["buyer_id"] != user.user_id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    event = await db.events.find_one({"event_id": order["event_id"]}, {"_id": 0})
    ticket = await db.tickets.find_one({"ticket_id": order["ticket_id"]}, {"_id": 0})
    
    order["event"] = event
    order["ticket"] = ticket
    
    return order

# ============== DISPUTES ENDPOINTS ==============

@api_router.post("/disputes")
async def create_dispute(request: Request):
    """Create a dispute"""
    user = await require_auth(request)
    body = await request.json()
    
    order_id = body.get("order_id")
    reason = body.get("reason")
    description = body.get("description")
    
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["buyer_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    dispute = Dispute(
        order_id=order_id,
        buyer_id=user.user_id,
        seller_id=order["seller_id"],
        reason=reason,
        description=description
    )
    
    dispute_doc = dispute.model_dump()
    dispute_doc['created_at'] = dispute_doc['created_at'].isoformat()
    await db.disputes.insert_one(dispute_doc)
    
    await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"status": "disputed"}}
    )
    
    return {"success": True, "dispute_id": dispute.dispute_id}

@api_router.get("/admin/disputes")
async def get_disputes(request: Request):
    """Get all disputes (admin only)"""
    user = await require_admin(request)
    
    disputes = await db.disputes.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for dispute in disputes:
        order = await db.orders.find_one({"order_id": dispute["order_id"]}, {"_id": 0})
        buyer = await db.users.find_one({"user_id": dispute["buyer_id"]}, {"_id": 0})
        seller = await db.users.find_one({"user_id": dispute["seller_id"]}, {"_id": 0})
        dispute["order"] = order
        dispute["buyer"] = buyer
        dispute["seller"] = seller
    
    return disputes

@api_router.put("/admin/disputes/{dispute_id}")
async def resolve_dispute(dispute_id: str, request: Request):
    """Resolve a dispute (admin only)"""
    user = await require_admin(request)
    body = await request.json()
    
    status = body.get("status")
    resolution = body.get("resolution")
    
    result = await db.disputes.update_one(
        {"dispute_id": dispute_id},
        {"$set": {"status": status, "resolution": resolution}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Dispute not found")
    
    return {"success": True}

# ============== RATINGS ENDPOINTS ==============

@api_router.post("/ratings")
async def create_rating(rating_data: RatingCreate, request: Request):
    """Create a seller rating"""
    user = await require_auth(request)
    
    order = await db.orders.find_one({"order_id": rating_data.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["buyer_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if order["status"] != "completed":
        raise HTTPException(status_code=400, detail="Order not completed")
    
    existing = await db.ratings.find_one({"order_id": rating_data.order_id}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Already rated")
    
    rating = Rating(
        order_id=rating_data.order_id,
        seller_id=order["seller_id"],
        buyer_id=user.user_id,
        rating=rating_data.rating,
        comment=rating_data.comment
    )
    
    rating_doc = rating.model_dump()
    rating_doc['created_at'] = rating_doc['created_at'].isoformat()
    await db.ratings.insert_one(rating_doc)
    
    seller_ratings = await db.ratings.find(
        {"seller_id": order["seller_id"]},
        {"_id": 0, "rating": 1}
    ).to_list(1000)
    
    avg_rating = sum(r["rating"] for r in seller_ratings) / len(seller_ratings)
    await db.users.update_one(
        {"user_id": order["seller_id"]},
        {"$set": {"rating": round(avg_rating, 1)}}
    )
    
    return {"success": True}

@api_router.get("/sellers/{seller_id}/ratings")
async def get_seller_ratings(seller_id: str):
    """Get seller ratings"""
    ratings = await db.ratings.find(
        {"seller_id": seller_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return ratings

# ============== ADMIN ENDPOINTS ==============

@api_router.get("/admin/stats")
async def get_admin_stats(request: Request):
    """Get admin statistics"""
    user = await require_admin(request)
    
    total_users = await db.users.count_documents({})
    total_sellers = await db.users.count_documents({"role": "seller"})
    verified_sellers = await db.users.count_documents({"role": "seller", "kyc_status": "verified"})
    total_events = await db.events.count_documents({})
    total_matches = await db.events.count_documents({"event_type": "match"})
    total_concerts = await db.events.count_documents({"event_type": "concert"})
    total_tickets = await db.tickets.count_documents({})
    available_tickets = await db.tickets.count_documents({"status": "available"})
    sold_tickets = await db.tickets.count_documents({"status": "sold"})
    open_disputes = await db.disputes.count_documents({"status": "open"})
    
    completed_orders = await db.orders.find(
        {"status": "completed"},
        {"_id": 0, "total_amount": 1, "commission": 1}
    ).to_list(10000)
    
    total_revenue = sum(o["total_amount"] for o in completed_orders)
    total_commission = sum(o["commission"] for o in completed_orders)
    
    return {
        "total_users": total_users,
        "total_sellers": total_sellers,
        "verified_sellers": verified_sellers,
        "total_events": total_events,
        "total_matches": total_matches,
        "total_concerts": total_concerts,
        "total_tickets": total_tickets,
        "available_tickets": available_tickets,
        "sold_tickets": sold_tickets,
        "open_disputes": open_disputes,
        "total_revenue": round(total_revenue, 2),
        "total_commission": round(total_commission, 2)
    }

@api_router.get("/admin/users")
async def get_admin_users(request: Request):
    """Get all users (admin only)"""
    user = await require_admin(request)
    
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    return users

@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, request: Request):
    """Update user role (admin only)"""
    admin = await require_admin(request)
    body = await request.json()
    role = body.get("role")
    
    if role not in ["buyer", "seller", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"role": role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True}

@api_router.put("/admin/users/{user_id}/kyc")
async def update_kyc_status(user_id: str, request: Request):
    """Update user KYC status (admin only)"""
    admin = await require_admin(request)
    body = await request.json()
    status = body.get("status")
    
    if status not in ["pending", "submitted", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"kyc_status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True}

@api_router.get("/admin/orders")
async def get_admin_orders(request: Request):
    """Get all orders (admin only)"""
    user = await require_admin(request)
    
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

# ============== OWNER DASHBOARD (Revenue & Payouts) ==============

@api_router.get("/owner/dashboard")
async def get_owner_dashboard(request: Request):
    """Get owner dashboard with revenue stats"""
    user = await require_admin(request)
    
    # Get all completed orders
    orders = await db.orders.find(
        {"status": "completed"},
        {"_id": 0}
    ).to_list(1000)
    
    # Calculate totals
    total_revenue = sum(order.get("total_amount", 0) for order in orders)
    total_commission = sum(order.get("commission", 0) for order in orders)
    total_seller_amount = total_revenue - total_commission
    
    # Get pending payouts
    pending_payouts = await db.payouts.find(
        {"status": "pending"},
        {"_id": 0}
    ).to_list(100)
    
    pending_payout_amount = sum(p.get("amount", 0) for p in pending_payouts)
    
    # Get completed payouts
    completed_payouts = await db.payouts.find(
        {"status": "completed"},
        {"_id": 0}
    ).to_list(100)
    
    total_paid_out = sum(p.get("amount", 0) for p in completed_payouts)
    
    # Orders by status
    orders_pending = await db.orders.count_documents({"status": "pending"})
    orders_completed = await db.orders.count_documents({"status": "completed"})
    orders_cancelled = await db.orders.count_documents({"status": "cancelled"})
    
    # Recent orders (last 10)
    recent_orders = await db.orders.find(
        {},
        {"_id": 0}
    ).sort("created_at", -1).to_list(10)
    
    # Enrich recent orders
    for order in recent_orders:
        event = await db.events.find_one({"event_id": order.get("event_id")}, {"_id": 0, "title": 1})
        order["event_title"] = event.get("title") if event else "Unknown"
    
    return {
        "revenue": {
            "total": round(total_revenue, 2),
            "commission": round(total_commission, 2),
            "seller_amount": round(total_seller_amount, 2)
        },
        "payouts": {
            "pending_count": len(pending_payouts),
            "pending_amount": round(pending_payout_amount, 2),
            "total_paid": round(total_paid_out, 2)
        },
        "orders": {
            "pending": orders_pending,
            "completed": orders_completed,
            "cancelled": orders_cancelled,
            "total": orders_pending + orders_completed + orders_cancelled
        },
        "recent_orders": recent_orders
    }

@api_router.get("/owner/sellers")
async def get_sellers_with_balance(request: Request):
    """Get all sellers with their pending balances"""
    user = await require_admin(request)
    
    # Get all sellers
    sellers = await db.users.find(
        {"role": "seller"},
        {"_id": 0, "user_id": 1, "name": 1, "email": 1, "kyc_status": 1}
    ).to_list(100)
    
    for seller in sellers:
        # Calculate pending balance (completed orders not yet paid out)
        orders = await db.orders.find(
            {"seller_id": seller["user_id"], "status": "completed"},
            {"_id": 0, "total_amount": 1, "commission": 1}
        ).to_list(100)
        
        total_sales = sum(o.get("total_amount", 0) for o in orders)
        total_commission = sum(o.get("commission", 0) for o in orders)
        seller_earnings = total_sales - total_commission
        
        # Get already paid out
        payouts = await db.payouts.find(
            {"seller_id": seller["user_id"], "status": "completed"},
            {"_id": 0, "amount": 1}
        ).to_list(100)
        
        total_paid = sum(p.get("amount", 0) for p in payouts)
        
        seller["total_sales"] = round(total_sales, 2)
        seller["total_commission"] = round(total_commission, 2)
        seller["total_earnings"] = round(seller_earnings, 2)
        seller["total_paid"] = round(total_paid, 2)
        seller["pending_balance"] = round(seller_earnings - total_paid, 2)
        seller["orders_count"] = len(orders)
    
    return sellers

@api_router.post("/owner/payouts")
async def create_payout(request: Request):
    """Create a payout record for a seller"""
    user = await require_admin(request)
    body = await request.json()
    
    seller_id = body.get("seller_id")
    amount = body.get("amount")
    payment_method = body.get("payment_method", "bank_transfer")
    notes = body.get("notes", "")
    
    if not seller_id or not amount:
        raise HTTPException(status_code=400, detail="seller_id and amount required")
    
    seller = await db.users.find_one({"user_id": seller_id}, {"_id": 0})
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    payout = {
        "payout_id": f"payout_{uuid.uuid4().hex[:12]}",
        "seller_id": seller_id,
        "seller_name": seller.get("name"),
        "seller_email": seller.get("email"),
        "amount": amount,
        "payment_method": payment_method,
        "status": "pending",  # pending, processing, completed, failed
        "notes": notes,
        "created_at": datetime.now(timezone.utc),
        "completed_at": None
    }
    
    await db.payouts.insert_one(payout)
    payout.pop("_id", None)
    
    return payout

@api_router.put("/owner/payouts/{payout_id}/complete")
async def complete_payout(payout_id: str, request: Request):
    """Mark a payout as completed"""
    user = await require_admin(request)
    
    result = await db.payouts.update_one(
        {"payout_id": payout_id},
        {"$set": {
            "status": "completed",
            "completed_at": datetime.now(timezone.utc)
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payout not found")
    
    return {"success": True}

@api_router.get("/owner/payouts")
async def get_all_payouts(request: Request):
    """Get all payouts"""
    user = await require_admin(request)
    
    payouts = await db.payouts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return payouts

# ============== RAFFLE SYSTEM ==============

class RaffleEntry(BaseModel):
    raffle_type: str
    price: float = 100
    entries: int = 1

@api_router.post("/raffle/checkout")
async def create_raffle_checkout(entry: RaffleEntry, request: Request):
    """Create Stripe checkout for raffle entry"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Please sign in to enter the raffle")
    
    try:
        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'unit_amount': int(entry.price * 100),  # Stripe uses cents
                    'product_data': {
                        'name': 'World Cup 2026 VIP Raffle Entry',
                        'description': 'Enter for a chance to win an all-inclusive trip for 2 to FIFA World Cup 2026!',
                        'images': ['https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg'],
                    },
                },
                'quantity': entry.entries,
            }],
            mode='payment',
            success_url=f'{os.environ.get("FRONTEND_URL")}/raffle/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{os.environ.get("FRONTEND_URL")}/world-cup-raffle',
            metadata={
                'type': 'raffle',
                'raffle_type': entry.raffle_type,
                'user_id': user.user_id,
                'user_email': user.email
            }
        )
        
        # Save raffle entry to database
        raffle_entry = {
            "entry_id": str(uuid.uuid4())[:12],
            "user_id": user.user_id,
            "user_email": user.email,
            "user_name": user.name if user.name else '',
            "raffle_type": entry.raffle_type,
            "price": entry.price,
            "entries": entry.entries,
            "stripe_session_id": checkout_session.id,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.raffle_entries.insert_one(raffle_entry)
        
        return {"checkout_url": checkout_session.url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/raffle/entries")
async def get_raffle_entries(request: Request):
    """Get raffle entries for current user"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    entries = await db.raffle_entries.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    
    return entries

@api_router.get("/raffle/stats")
async def get_raffle_stats():
    """Get raffle statistics"""
    total_entries = await db.raffle_entries.count_documents({"status": "completed"})
    max_entries = 500
    
    return {
        "total_entries": total_entries,
        "max_entries": max_entries,
        "entries_remaining": max_entries - total_entries,
        "draw_date": "2026-05-01"
    }

# ============== AI CHAT SUPPORT ==============

class ChatMessage(BaseModel):
    message: str
    session_id: str

# Store chat history in memory (for simplicity - could use DB for persistence)
chat_histories: Dict[str, list] = {}

# Initialize OpenAI client
openai_client = None
if AI_CHAT_AVAILABLE:
    openai_api_key = os.environ.get('OPENAI_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
    if openai_api_key:
        openai_client = OpenAI(api_key=openai_api_key)

SUPPORT_SYSTEM_MESSAGE = """You are the AI customer support assistant for EuroMatchTickets, Europe's #1 ticket marketplace for football matches and concerts.

Your role:
- Help customers find tickets for events
- Answer questions about orders and payments
- Explain the refund policy (full refund if event cancelled, 48-hour refund window for change of mind)
- Provide information about ticket delivery (instant QR code)
- Be friendly, helpful, and professional

Key information:
- We sell verified tickets for Champions League, Premier League, La Liga, Bundesliga, and major concerts
- Payment is 100% secure via Stripe
- All tickets are verified and guaranteed
- 10% commission on sales
- Instant QR code delivery after purchase
- 24/7 customer support

Popular events we cover:
- FIFA World Cup 2026
- UEFA Champions League
- Bruno Mars Tour 2026
- The Weeknd Tour 2026
- Bad Bunny London 2026
- Guns N' Roses Tour 2026

Keep responses concise and helpful. If you don't know something specific, direct them to email support@euromatchtickets.com"""

@api_router.post("/chat/support")
async def chat_support(chat_msg: ChatMessage):
    """AI-powered customer support chat"""
    try:
        if not openai_client:
            return {
                "response": "AI support is currently unavailable. Please email us at support@euromatchtickets.com for assistance."
            }
        
        session_id = chat_msg.session_id
        
        # Get or create chat history
        if session_id not in chat_histories:
            chat_histories[session_id] = []
        
        # Add user message to history
        chat_histories[session_id].append({
            "role": "user",
            "content": chat_msg.message
        })
        
        # Build messages for OpenAI
        messages = [{"role": "system", "content": SUPPORT_SYSTEM_MESSAGE}]
        messages.extend(chat_histories[session_id][-10:])  # Keep last 10 messages
        
        # Call OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=500
        )
        
        ai_response = response.choices[0].message.content
        
        # Add AI response to history
        chat_histories[session_id].append({
            "role": "assistant",
            "content": ai_response
        })
        
        # Save to database for analytics
        await db.chat_logs.insert_one({
            "session_id": session_id,
            "user_message": chat_msg.message,
            "ai_response": ai_response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        return {"response": ai_response}
        
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        return {
            "response": "I'm having trouble connecting right now. Please try again or email us at support@euromatchtickets.com for assistance."
        }

# ============== SEED DATA ==============

@api_router.post("/cleanup-categories")
async def cleanup_categories():
    """Remove unwanted event categories (trains, attractions, festivals, f1, tennis)"""
    unwanted_types = ["train", "attraction", "festival", "f1", "tennis"]
    
    # Get events to delete
    events_to_delete = await db.events.find(
        {"event_type": {"$in": unwanted_types}},
        {"_id": 0, "event_id": 1}
    ).to_list(1000)
    
    event_ids = [e["event_id"] for e in events_to_delete]
    
    # Delete tickets for these events
    tickets_result = await db.tickets.delete_many({"event_id": {"$in": event_ids}})
    
    # Delete the events
    events_result = await db.events.delete_many({"event_type": {"$in": unwanted_types}})
    
    return {
        "message": "Cleanup completed",
        "events_deleted": events_result.deleted_count,
        "tickets_deleted": tickets_result.deleted_count,
        "removed_categories": unwanted_types
    }

@api_router.post("/fix-tickets-seller")
async def fix_tickets_seller():
    """Add seller_id to all tickets that don't have one"""
    result = await db.tickets.update_many(
        {"$or": [{"seller_id": {"$exists": False}}, {"seller_id": None}, {"seller_id": ""}]},
        {"$set": {
            "seller_id": "seller_euromatch",
            "seller_name": "EuroMatchTickets Official"
        }}
    )
    return {
        "message": "Tickets updated",
        "modified_count": result.modified_count
    }

@api_router.post("/add-vip-worldcup-tickets")
async def add_vip_worldcup_tickets():
    """Add premium VIP World Cup 2026 tickets with competitive prices"""
    import random
    
    # Get all World Cup events
    wc_events = await db.events.find(
        {"title": {"$regex": "FIFA World Cup 2026|World Cup", "$options": "i"}},
        {"_id": 0}
    ).to_list(100)
    
    if not wc_events:
        return {"error": "No World Cup events found"}
    
    added_tickets = 0
    
    # VIP Packages with competitive prices
    vip_packages = [
        {"category": "vip", "name": "VIP Platinum", "section": "VIP Platinum Lounge", "base_price": 1899, "description": "Best seats + Lounge access + Catering"},
        {"category": "vip", "name": "VIP Gold", "section": "VIP Gold Suite", "base_price": 1499, "description": "Premium view + Private suite"},
        {"category": "vip", "name": "VIP Silver", "section": "VIP Silver Club", "base_price": 999, "description": "Great view + Club access"},
        {"category": "cat1", "name": "Category 1 Premium", "section": "Lower Tier Central", "base_price": 649, "description": "Best non-VIP seats"},
        {"category": "cat1", "name": "Category 1", "section": "Lower Tier Side", "base_price": 449, "description": "Excellent view"},
        {"category": "cat2", "name": "Category 2", "section": "Mid Tier", "base_price": 299, "description": "Great atmosphere"},
        {"category": "cat3", "name": "Category 3", "section": "Upper Tier", "base_price": 149, "description": "Budget friendly"},
    ]
    
    for event in wc_events:
        for pkg in vip_packages:
            # Add 3-5 tickets per package per event
            for i in range(random.randint(3, 5)):
                price_variation = random.uniform(0.95, 1.15)
                price = round(pkg["base_price"] * price_variation, 2)
                
                ticket = {
                    "ticket_id": f"vip_{uuid.uuid4().hex[:12]}",
                    "event_id": event["event_id"],
                    "seller_id": "seller_euromatch",
                    "seller_name": "EuroMatchTickets Official",
                    "category": pkg["category"],
                    "section": pkg["section"],
                    "row": str(random.randint(1, 10)) if pkg["category"] != "vip" else "VIP",
                    "seat": str(random.randint(1, 30)) if pkg["category"] != "vip" else f"Suite {random.randint(1, 20)}",
                    "price": price,
                    "original_price": pkg["base_price"],
                    "currency": "EUR",
                    "status": "available",
                    "description": pkg["description"],
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.tickets.insert_one(ticket)
                added_tickets += 1
    
    return {
        "message": "VIP World Cup tickets added",
        "tickets_added": added_tickets,
        "events_updated": len(wc_events)
    }

@api_router.post("/reseed")
async def reseed_data():
    """Clear and reseed demo data"""
    await db.events.delete_many({})
    await db.tickets.delete_many({})
    return await seed_data()

@api_router.post("/seed")
async def seed_data():
    """Seed demo data"""
    existing = await db.events.count_documents({})
    if existing > 0:
        return {"message": "Already seeded"}
    
    # Team logos
    team_logos = {
        "Real Madrid": "https://crests.football-data.org/86.svg",
        "Barcelona": "https://crests.football-data.org/81.svg",
        "Manchester City": "https://crests.football-data.org/65.svg",
        "Liverpool": "https://crests.football-data.org/64.svg",
        "Arsenal": "https://crests.football-data.org/57.svg",
        "Bayern Munich": "https://crests.football-data.org/5.svg",
        "PSG": "https://crests.football-data.org/524.svg",
        "Chelsea": "https://crests.football-data.org/61.svg",
        "Atletico Madrid": "https://crests.football-data.org/78.svg",
        "Borussia Dortmund": "https://crests.football-data.org/4.svg",
        "Inter Milan": "https://crests.football-data.org/108.svg",
        "AC Milan": "https://crests.football-data.org/98.svg",
        "England": "https://crests.football-data.org/770.svg",
        "Uruguay": "https://crests.football-data.org/UY.svg",
        "Germany": "https://crests.football-data.org/759.svg",
        "France": "https://crests.football-data.org/773.svg",
        "Juventus": "https://crests.football-data.org/109.svg",
        "Napoli": "https://crests.football-data.org/113.svg",
        "Tottenham": "https://crests.football-data.org/73.svg",
        "Manchester United": "https://crests.football-data.org/66.svg"
    }
    
    leagues = {
        "champions_league": "https://upload.wikimedia.org/wikipedia/commons/e/e9/UEFA_Champions_League_logo_2.svg",
        "premier_league": "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
        "la_liga": "https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg",
        "bundesliga": "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
        "serie_a": "https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo_%282019%29.svg",
        "international": "https://upload.wikimedia.org/wikipedia/commons/a/aa/UEFA_logo.svg"
    }
    
    # Football matches - BIG EVENTS 2025
    matches_data = [
        # Featured International
        {"home": "England", "away": "Uruguay", "league": "international", "venue": "Wembley Stadium", "city": "London", "country": "England", "days": 5, "featured": True, "subtitle": "International Friendly 2025"},
        {"home": "Germany", "away": "France", "league": "international", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "days": 12, "featured": True, "subtitle": "Nations League 2025"},
        
        # Champions League
        {"home": "Real Madrid", "away": "Manchester City", "league": "champions_league", "venue": "Santiago Bernabéu", "city": "Madrid", "country": "Spain", "days": 8, "featured": True, "subtitle": "UCL Quarter-Final"},
        {"home": "Bayern Munich", "away": "PSG", "league": "champions_league", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "days": 15, "featured": True, "subtitle": "UCL Quarter-Final"},
        {"home": "Barcelona", "away": "Inter Milan", "league": "champions_league", "venue": "Camp Nou", "city": "Barcelona", "country": "Spain", "days": 22, "featured": False, "subtitle": "UCL Semi-Final"},
        {"home": "Arsenal", "away": "Borussia Dortmund", "league": "champions_league", "venue": "Emirates Stadium", "city": "London", "country": "England", "days": 29, "featured": False, "subtitle": "UCL Semi-Final"},
        
        # Premier League
        {"home": "Liverpool", "away": "Arsenal", "league": "premier_league", "venue": "Anfield", "city": "Liverpool", "country": "England", "days": 3, "featured": True, "subtitle": "Premier League Matchday 28"},
        {"home": "Manchester City", "away": "Chelsea", "league": "premier_league", "venue": "Etihad Stadium", "city": "Manchester", "country": "England", "days": 10, "featured": False, "subtitle": "Premier League Matchday 29"},
        {"home": "Tottenham", "away": "Manchester United", "league": "premier_league", "venue": "Tottenham Hotspur Stadium", "city": "London", "country": "England", "days": 17, "featured": False, "subtitle": "Premier League Matchday 30"},
        
        # La Liga - El Clasico
        {"home": "Barcelona", "away": "Real Madrid", "league": "la_liga", "venue": "Camp Nou", "city": "Barcelona", "country": "Spain", "days": 6, "featured": True, "subtitle": "El Clasico - La Liga Matchday 32"},
        {"home": "Atletico Madrid", "away": "Barcelona", "league": "la_liga", "venue": "Metropolitano", "city": "Madrid", "country": "Spain", "days": 20, "featured": False, "subtitle": "La Liga Matchday 34"},
        
        # Bundesliga
        {"home": "Borussia Dortmund", "away": "Bayern Munich", "league": "bundesliga", "venue": "Signal Iduna Park", "city": "Dortmund", "country": "Germany", "days": 9, "featured": True, "subtitle": "Der Klassiker - Bundesliga"},
        
        # Serie A
        {"home": "Juventus", "away": "Inter Milan", "league": "serie_a", "venue": "Allianz Stadium", "city": "Turin", "country": "Italy", "days": 13, "featured": False, "subtitle": "Derby d'Italia - Serie A"},
        {"home": "AC Milan", "away": "Napoli", "league": "serie_a", "venue": "San Siro", "city": "Milan", "country": "Italy", "days": 18, "featured": False, "subtitle": "Serie A Matchday 30"},
    ]
    
    for m in matches_data:
        event = Event(
            event_type="match",
            title=f"{m['home']} vs {m['away']}",
            subtitle=m.get("subtitle", ""),
            home_team=m["home"],
            away_team=m["away"],
            home_logo=team_logos.get(m["home"], ""),
            away_logo=team_logos.get(m["away"], ""),
            league=m["league"],
            league_logo=leagues.get(m["league"], ""),
            venue=m["venue"],
            city=m["city"],
            country=m["country"],
            event_date=datetime.now(timezone.utc) + timedelta(days=m["days"]),
            event_image="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
            featured=m["featured"]
        )
        event_doc = event.model_dump()
        event_doc['event_date'] = event_doc['event_date'].isoformat()
        event_doc['created_at'] = event_doc['created_at'].isoformat()
        await db.events.insert_one(event_doc)
    
    # Concert data - MAJOR TOURS 2025
    concerts_data = [
        # The Weeknd - Featured
        {"artist": "The Weeknd", "tour": "After Hours Til Dawn Tour 2025", "genre": "R&B", "venue": "Wembley Stadium", "city": "London", "country": "England", "days": 7, "featured": True, "image": "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"},
        {"artist": "The Weeknd", "tour": "After Hours Til Dawn Tour 2025", "genre": "R&B", "venue": "Stade de France", "city": "Paris", "country": "France", "days": 10, "featured": True, "image": "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"},
        {"artist": "The Weeknd", "tour": "After Hours Til Dawn Tour 2025", "genre": "R&B", "venue": "Olympiastadion", "city": "Berlin", "country": "Germany", "days": 14, "featured": False, "image": "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"},
        
        # Taylor Swift
        {"artist": "Taylor Swift", "tour": "The Eras Tour 2025", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "England", "days": 21, "featured": True, "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"},
        {"artist": "Taylor Swift", "tour": "The Eras Tour 2025", "genre": "Pop", "venue": "Olympiastadion", "city": "Munich", "country": "Germany", "days": 28, "featured": False, "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"},
        
        # Coldplay
        {"artist": "Coldplay", "tour": "Music of the Spheres World Tour", "genre": "Rock", "venue": "Olympiastadion", "city": "Berlin", "country": "Germany", "days": 18, "featured": True, "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"},
        {"artist": "Coldplay", "tour": "Music of the Spheres World Tour", "genre": "Rock", "venue": "Camp Nou", "city": "Barcelona", "country": "Spain", "days": 25, "featured": False, "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"},
        
        # Drake
        {"artist": "Drake", "tour": "Anita Max Wynn Tour 2025", "genre": "Hip-Hop", "venue": "O2 Arena", "city": "London", "country": "England", "days": 11, "featured": True, "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg"},
        {"artist": "Drake", "tour": "Anita Max Wynn Tour 2025", "genre": "Hip-Hop", "venue": "AccorHotels Arena", "city": "Paris", "country": "France", "days": 16, "featured": False, "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg"},
        
        # Ed Sheeran
        {"artist": "Ed Sheeran", "tour": "Mathematics Tour 2025", "genre": "Pop", "venue": "Amsterdam Arena", "city": "Amsterdam", "country": "Netherlands", "days": 9, "featured": True, "image": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg"},
        {"artist": "Ed Sheeran", "tour": "Mathematics Tour 2025", "genre": "Pop", "venue": "Olympiastadion", "city": "Munich", "country": "Germany", "days": 15, "featured": False, "image": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg"},
        
        # Beyoncé
        {"artist": "Beyoncé", "tour": "Renaissance World Tour 2025", "genre": "Pop", "venue": "Stade de France", "city": "Paris", "country": "France", "days": 22, "featured": True, "image": "https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg"},
        
        # Rammstein
        {"artist": "Rammstein", "tour": "Europe Stadium Tour 2025", "genre": "Metal", "venue": "Olympiastadion", "city": "Munich", "country": "Germany", "days": 30, "featured": False, "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"},
        {"artist": "Rammstein", "tour": "Europe Stadium Tour 2025", "genre": "Metal", "venue": "Stade de France", "city": "Paris", "country": "France", "days": 35, "featured": False, "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"},
        
        # Adele
        {"artist": "Adele", "tour": "Weekends with Adele 2025", "genre": "Pop", "venue": "O2 Arena", "city": "London", "country": "England", "days": 40, "featured": False, "image": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg"},
        
        # Bruno Mars
        {"artist": "Bruno Mars", "tour": "24K Magic World Tour", "genre": "Pop", "venue": "Ziggo Dome", "city": "Amsterdam", "country": "Netherlands", "days": 19, "featured": False, "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg"},
    ]
    
    for c in concerts_data:
        event = Event(
            event_type="concert",
            title=f"{c['artist']} Live",
            subtitle=c["tour"],
            artist=c["artist"],
            artist_image=c["image"],
            genre=c["genre"],
            venue=c["venue"],
            city=c["city"],
            country=c["country"],
            event_date=datetime.now(timezone.utc) + timedelta(days=c["days"]),
            event_image=c["image"],
            featured=c["featured"]
        )
        event_doc = event.model_dump()
        event_doc['event_date'] = event_doc['event_date'].isoformat()
        event_doc['created_at'] = event_doc['created_at'].isoformat()
        await db.events.insert_one(event_doc)
    
    # Create demo users
    admin_user = User(
        user_id="admin_001",
        email="admin@fanpass.com",
        name="FanPass Admin",
        role="admin",
        kyc_status="verified"
    )
    admin_doc = admin_user.model_dump()
    admin_doc['created_at'] = admin_doc['created_at'].isoformat()
    await db.users.insert_one(admin_doc)
    
    seller_user = User(
        user_id="seller_demo",
        email="seller@fanpass.com",
        name="Premium Tickets GmbH",
        role="seller",
        rating=4.8,
        total_sales=234,
        kyc_status="verified"
    )
    seller_doc = seller_user.model_dump()
    seller_doc['created_at'] = seller_doc['created_at'].isoformat()
    await db.users.insert_one(seller_doc)
    
    # Add tickets for all events
    all_events = await db.events.find({}, {"_id": 0}).to_list(100)
    
    import random
    
    match_categories = [
        {"name": "vip", "base_price": 450, "sections": ["VIP-A", "VIP-B"]},
        {"name": "cat1", "base_price": 280, "sections": ["101", "102", "103"]},
        {"name": "cat2", "base_price": 180, "sections": ["201", "202", "203", "204"]},
        {"name": "cat3", "base_price": 95, "sections": ["301", "302", "303", "304", "305"]}
    ]
    
    concert_categories = [
        {"name": "vip", "base_price": 550, "sections": ["VIP-FRONT", "VIP-SIDE"]},
        {"name": "floor", "base_price": 320, "sections": ["FLOOR-A", "FLOOR-B", "FLOOR-C"]},
        {"name": "cat1", "base_price": 220, "sections": ["LOWER-1", "LOWER-2", "LOWER-3"]},
        {"name": "cat2", "base_price": 150, "sections": ["UPPER-1", "UPPER-2", "UPPER-3"]},
        {"name": "standing", "base_price": 85, "sections": ["GA-1", "GA-2"]}
    ]
    
    for event in all_events:
        categories = concert_categories if event["event_type"] == "concert" else match_categories
        
        for cat in categories:
            for section in cat["sections"]:
                for _ in range(random.randint(3, 8)):
                    price_variation = random.uniform(0.85, 1.4)
                    price = round(cat["base_price"] * price_variation, 2)
                    
                    ticket = Ticket(
                        event_id=event["event_id"],
                        seller_id="seller_demo",
                        seller_name="Premium Tickets GmbH",
                        category=cat["name"],
                        section=section,
                        row=str(random.randint(1, 25)) if cat["name"] not in ["standing", "floor"] else None,
                        seat=str(random.randint(1, 40)) if cat["name"] not in ["standing", "floor"] else None,
                        price=price,
                        original_price=cat["base_price"]
                    )
                    
                    ticket_doc = ticket.model_dump()
                    ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
                    await db.tickets.insert_one(ticket_doc)
    
    return {"message": "Seeded successfully", "events": len(all_events)}

@api_router.post("/seed-expanded")
async def seed_expanded_categories():
    """Add trains, theme parks, F1, tennis, festivals to the marketplace"""
    import random
    
    added_events = []
    
    # ============== HIGH-SPEED TRAINS ==============
    trains_data = [
        # Eurostar
        {"title": "Eurostar London to Paris", "subtitle": "High-Speed Train - 2h 16min", "route": "London St Pancras → Paris Gare du Nord", "operator": "Eurostar", "city": "London", "country": "England", "days": 1, "featured": True, "base_price": 89, "image": "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg"},
        {"title": "Eurostar Paris to London", "subtitle": "High-Speed Train - 2h 16min", "route": "Paris Gare du Nord → London St Pancras", "operator": "Eurostar", "city": "Paris", "country": "France", "days": 1, "featured": True, "base_price": 89, "image": "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg"},
        {"title": "Eurostar London to Brussels", "subtitle": "High-Speed Train - 2h", "route": "London St Pancras → Brussels Midi", "operator": "Eurostar", "city": "London", "country": "England", "days": 2, "featured": False, "base_price": 69, "image": "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg"},
        {"title": "Eurostar London to Amsterdam", "subtitle": "High-Speed Train - 3h 52min", "route": "London St Pancras → Amsterdam Centraal", "operator": "Eurostar", "city": "London", "country": "England", "days": 3, "featured": True, "base_price": 95, "image": "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg"},
        # TGV France
        {"title": "TGV Paris to Lyon", "subtitle": "High-Speed Train - 2h", "route": "Paris Gare de Lyon → Lyon Part-Dieu", "operator": "SNCF TGV", "city": "Paris", "country": "France", "days": 1, "featured": False, "base_price": 49, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
        {"title": "TGV Paris to Marseille", "subtitle": "High-Speed Train - 3h 20min", "route": "Paris Gare de Lyon → Marseille Saint-Charles", "operator": "SNCF TGV", "city": "Paris", "country": "France", "days": 2, "featured": True, "base_price": 69, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
        {"title": "TGV Paris to Nice", "subtitle": "High-Speed Train - 5h 30min", "route": "Paris Gare de Lyon → Nice Ville", "operator": "SNCF TGV", "city": "Paris", "country": "France", "days": 3, "featured": False, "base_price": 79, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
        # ICE Germany
        {"title": "ICE Berlin to Munich", "subtitle": "High-Speed Train - 4h", "route": "Berlin Hauptbahnhof → München Hauptbahnhof", "operator": "Deutsche Bahn ICE", "city": "Berlin", "country": "Germany", "days": 1, "featured": True, "base_price": 59, "image": "https://images.pexels.com/photos/1598073/pexels-photo-1598073.jpeg"},
        {"title": "ICE Frankfurt to Berlin", "subtitle": "High-Speed Train - 4h", "route": "Frankfurt Hauptbahnhof → Berlin Hauptbahnhof", "operator": "Deutsche Bahn ICE", "city": "Frankfurt", "country": "Germany", "days": 2, "featured": False, "base_price": 49, "image": "https://images.pexels.com/photos/1598073/pexels-photo-1598073.jpeg"},
        {"title": "ICE Cologne to Frankfurt", "subtitle": "High-Speed Train - 1h 10min", "route": "Köln Hauptbahnhof → Frankfurt Hauptbahnhof", "operator": "Deutsche Bahn ICE", "city": "Cologne", "country": "Germany", "days": 1, "featured": False, "base_price": 35, "image": "https://images.pexels.com/photos/1598073/pexels-photo-1598073.jpeg"},
        # Thalys
        {"title": "Thalys Paris to Amsterdam", "subtitle": "High-Speed Train - 3h 20min", "route": "Paris Gare du Nord → Amsterdam Centraal", "operator": "Thalys", "city": "Paris", "country": "France", "days": 2, "featured": True, "base_price": 79, "image": "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg"},
        {"title": "Thalys Brussels to Paris", "subtitle": "High-Speed Train - 1h 22min", "route": "Brussels Midi → Paris Gare du Nord", "operator": "Thalys", "city": "Brussels", "country": "Belgium", "days": 1, "featured": False, "base_price": 45, "image": "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg"},
        # Italy
        {"title": "Frecciarossa Rome to Milan", "subtitle": "High-Speed Train - 2h 55min", "route": "Roma Termini → Milano Centrale", "operator": "Trenitalia Frecciarossa", "city": "Rome", "country": "Italy", "days": 1, "featured": True, "base_price": 49, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
        {"title": "Italo Rome to Florence", "subtitle": "High-Speed Train - 1h 30min", "route": "Roma Termini → Firenze Santa Maria Novella", "operator": "Italo", "city": "Rome", "country": "Italy", "days": 2, "featured": False, "base_price": 35, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
        {"title": "Frecciarossa Milan to Venice", "subtitle": "High-Speed Train - 2h 25min", "route": "Milano Centrale → Venezia Santa Lucia", "operator": "Trenitalia Frecciarossa", "city": "Milan", "country": "Italy", "days": 3, "featured": False, "base_price": 39, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
        # Spain
        {"title": "AVE Madrid to Barcelona", "subtitle": "High-Speed Train - 2h 30min", "route": "Madrid Puerta de Atocha → Barcelona Sants", "operator": "Renfe AVE", "city": "Madrid", "country": "Spain", "days": 1, "featured": True, "base_price": 55, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
        {"title": "AVE Madrid to Seville", "subtitle": "High-Speed Train - 2h 20min", "route": "Madrid Puerta de Atocha → Sevilla Santa Justa", "operator": "Renfe AVE", "city": "Madrid", "country": "Spain", "days": 2, "featured": False, "base_price": 45, "image": "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg"},
    ]
    
    for t in trains_data:
        event = Event(
            event_type="train",
            title=t["title"],
            subtitle=t["subtitle"],
            description=f"Book {t['operator']} tickets. Route: {t['route']}. Fast, comfortable, and eco-friendly travel across Europe.",
            venue=t["route"],
            city=t["city"],
            country=t["country"],
            event_date=datetime.now(timezone.utc) + timedelta(days=t["days"]),
            event_image=t["image"],
            featured=t["featured"]
        )
        event_doc = event.model_dump()
        event_doc['event_date'] = event_doc['event_date'].isoformat()
        event_doc['created_at'] = event_doc['created_at'].isoformat()
        await db.events.insert_one(event_doc)
        
        # Add train tickets
        for _ in range(random.randint(20, 50)):
            price = round(t["base_price"] * random.uniform(0.7, 2.0), 2)
            ticket = Ticket(
                event_id=event.event_id,
                seller_id="seller_demo",
                seller_name="EuroRail Tickets",
                category=random.choice(["standard", "first_class", "business"]),
                section=random.choice(["Coach A", "Coach B", "Coach C", "Coach D"]),
                price=price,
                original_price=t["base_price"]
            )
            ticket_doc = ticket.model_dump()
            ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
            await db.tickets.insert_one(ticket_doc)
        
        added_events.append(event.event_id)
    
    # ============== THEME PARKS & ATTRACTIONS ==============
    attractions_data = [
        # Disneyland Paris
        {"title": "Disneyland Paris - 1 Day Ticket", "subtitle": "Magic Kingdom & Walt Disney Studios", "venue": "Disneyland Paris", "city": "Paris", "country": "France", "days": 5, "featured": True, "base_price": 95, "image": "https://images.pexels.com/photos/1843563/pexels-photo-1843563.jpeg"},
        {"title": "Disneyland Paris - 2 Day Hopper", "subtitle": "Both Parks Access", "venue": "Disneyland Paris", "city": "Paris", "country": "France", "days": 10, "featured": True, "base_price": 169, "image": "https://images.pexels.com/photos/1843563/pexels-photo-1843563.jpeg"},
        # Europa Park
        {"title": "Europa Park - Day Pass", "subtitle": "Germany's Largest Theme Park", "venue": "Europa Park", "city": "Rust", "country": "Germany", "days": 7, "featured": True, "base_price": 62, "image": "https://images.pexels.com/photos/784916/pexels-photo-784916.jpeg"},
        # PortAventura
        {"title": "PortAventura World - 1 Day", "subtitle": "Theme Park + Ferrari Land", "venue": "PortAventura World", "city": "Salou", "country": "Spain", "days": 8, "featured": True, "base_price": 55, "image": "https://images.pexels.com/photos/784916/pexels-photo-784916.jpeg"},
        # Landmarks
        {"title": "Eiffel Tower - Summit Access", "subtitle": "Skip-the-Line Tickets", "venue": "Eiffel Tower", "city": "Paris", "country": "France", "days": 3, "featured": True, "base_price": 35, "image": "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg"},
        {"title": "Louvre Museum - Skip the Line", "subtitle": "World's Largest Art Museum", "venue": "Louvre Museum", "city": "Paris", "country": "France", "days": 4, "featured": True, "base_price": 22, "image": "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg"},
        {"title": "Colosseum & Roman Forum", "subtitle": "Priority Entrance", "venue": "Colosseum", "city": "Rome", "country": "Italy", "days": 5, "featured": True, "base_price": 24, "image": "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg"},
        {"title": "Vatican Museums & Sistine Chapel", "subtitle": "Skip-the-Line Entry", "venue": "Vatican Museums", "city": "Rome", "country": "Italy", "days": 6, "featured": True, "base_price": 29, "image": "https://images.pexels.com/photos/326709/pexels-photo-326709.jpeg"},
        {"title": "Sagrada Familia - Fast Track", "subtitle": "Gaudí's Masterpiece", "venue": "Sagrada Familia", "city": "Barcelona", "country": "Spain", "days": 4, "featured": True, "base_price": 26, "image": "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg"},
        {"title": "Anne Frank House", "subtitle": "Timed Entry Ticket", "venue": "Anne Frank House", "city": "Amsterdam", "country": "Netherlands", "days": 5, "featured": False, "base_price": 16, "image": "https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg"},
        {"title": "Tower of London", "subtitle": "Crown Jewels & History", "venue": "Tower of London", "city": "London", "country": "England", "days": 3, "featured": False, "base_price": 33, "image": "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg"},
        {"title": "London Eye - Standard Entry", "subtitle": "360° Views of London", "venue": "London Eye", "city": "London", "country": "England", "days": 2, "featured": False, "base_price": 38, "image": "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg"},
    ]
    
    for a in attractions_data:
        event = Event(
            event_type="attraction",
            title=a["title"],
            subtitle=a["subtitle"],
            venue=a["venue"],
            city=a["city"],
            country=a["country"],
            event_date=datetime.now(timezone.utc) + timedelta(days=a["days"]),
            event_image=a["image"],
            featured=a["featured"]
        )
        event_doc = event.model_dump()
        event_doc['event_date'] = event_doc['event_date'].isoformat()
        event_doc['created_at'] = event_doc['created_at'].isoformat()
        await db.events.insert_one(event_doc)
        
        # Add tickets
        for _ in range(random.randint(30, 80)):
            price = round(a["base_price"] * random.uniform(0.9, 1.5), 2)
            ticket = Ticket(
                event_id=event.event_id,
                seller_id="seller_demo",
                seller_name="EuroAttractions",
                category=random.choice(["standard", "priority", "vip"]),
                section="General",
                price=price,
                original_price=a["base_price"]
            )
            ticket_doc = ticket.model_dump()
            ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
            await db.tickets.insert_one(ticket_doc)
        
        added_events.append(event.event_id)
    
    # ============== MUSIC FESTIVALS ==============
    festivals_data = [
        {"title": "Tomorrowland 2025", "subtitle": "World's Best Electronic Music Festival", "venue": "De Schorre", "city": "Boom", "country": "Belgium", "days": 60, "featured": True, "base_price": 375, "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"},
        {"title": "Tomorrowland 2025 - Weekend 2", "subtitle": "Full Madness Pass", "venue": "De Schorre", "city": "Boom", "country": "Belgium", "days": 67, "featured": True, "base_price": 375, "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"},
        {"title": "Rock am Ring 2025", "subtitle": "Germany's Legendary Rock Festival", "venue": "Nürburgring", "city": "Nürburg", "country": "Germany", "days": 45, "featured": True, "base_price": 219, "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"},
        {"title": "Glastonbury Festival 2025", "subtitle": "UK's Biggest Music Festival", "venue": "Worthy Farm", "city": "Pilton", "country": "England", "days": 50, "featured": True, "base_price": 355, "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"},
        {"title": "Primavera Sound Barcelona 2025", "subtitle": "Indie & Alternative Festival", "venue": "Parc del Fòrum", "city": "Barcelona", "country": "Spain", "days": 55, "featured": True, "base_price": 275, "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"},
        {"title": "Oktoberfest 2025 - Beer Tent Entry", "subtitle": "World's Largest Beer Festival", "venue": "Theresienwiese", "city": "Munich", "country": "Germany", "days": 90, "featured": True, "base_price": 45, "image": "https://images.pexels.com/photos/5028742/pexels-photo-5028742.jpeg"},
        {"title": "Sziget Festival 2025", "subtitle": "Island of Freedom - Budapest", "venue": "Óbudai-sziget", "city": "Budapest", "country": "Hungary", "days": 70, "featured": True, "base_price": 299, "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"},
        {"title": "Creamfields 2025", "subtitle": "Premier Electronic Festival UK", "venue": "Daresbury", "city": "Warrington", "country": "England", "days": 65, "featured": False, "base_price": 195, "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"},
    ]
    
    for f in festivals_data:
        event = Event(
            event_type="festival",
            title=f["title"],
            subtitle=f["subtitle"],
            venue=f["venue"],
            city=f["city"],
            country=f["country"],
            event_date=datetime.now(timezone.utc) + timedelta(days=f["days"]),
            event_image=f["image"],
            featured=f["featured"]
        )
        event_doc = event.model_dump()
        event_doc['event_date'] = event_doc['event_date'].isoformat()
        event_doc['created_at'] = event_doc['created_at'].isoformat()
        await db.events.insert_one(event_doc)
        
        # Add festival tickets
        for _ in range(random.randint(15, 40)):
            price = round(f["base_price"] * random.uniform(0.9, 1.8), 2)
            ticket = Ticket(
                event_id=event.event_id,
                seller_id="seller_demo",
                seller_name="Festival Tickets Europe",
                category=random.choice(["day_pass", "weekend", "full_madness", "vip"]),
                section="General Admission",
                price=price,
                original_price=f["base_price"]
            )
            ticket_doc = ticket.model_dump()
            ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
            await db.tickets.insert_one(ticket_doc)
        
        added_events.append(event.event_id)
    
    # ============== FORMULA 1 ==============
    f1_data = [
        {"title": "Monaco Grand Prix 2025", "subtitle": "Formula 1 - Monte Carlo Street Circuit", "venue": "Circuit de Monaco", "city": "Monte Carlo", "country": "Monaco", "days": 35, "featured": True, "base_price": 450, "image": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg"},
        {"title": "British Grand Prix 2025", "subtitle": "Formula 1 - Silverstone", "venue": "Silverstone Circuit", "city": "Silverstone", "country": "England", "days": 50, "featured": True, "base_price": 295, "image": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg"},
        {"title": "Italian Grand Prix 2025", "subtitle": "Formula 1 - Temple of Speed", "venue": "Autodromo di Monza", "city": "Monza", "country": "Italy", "days": 70, "featured": True, "base_price": 265, "image": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg"},
        {"title": "Belgian Grand Prix 2025", "subtitle": "Formula 1 - Spa-Francorchamps", "venue": "Circuit de Spa-Francorchamps", "city": "Stavelot", "country": "Belgium", "days": 55, "featured": True, "base_price": 245, "image": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg"},
        {"title": "Dutch Grand Prix 2025", "subtitle": "Formula 1 - Zandvoort", "venue": "Circuit Zandvoort", "city": "Zandvoort", "country": "Netherlands", "days": 60, "featured": True, "base_price": 325, "image": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg"},
        {"title": "Spanish Grand Prix 2025", "subtitle": "Formula 1 - Barcelona", "venue": "Circuit de Barcelona-Catalunya", "city": "Barcelona", "country": "Spain", "days": 40, "featured": False, "base_price": 215, "image": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg"},
        {"title": "Hungarian Grand Prix 2025", "subtitle": "Formula 1 - Hungaroring", "venue": "Hungaroring", "city": "Budapest", "country": "Hungary", "days": 65, "featured": False, "base_price": 195, "image": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg"},
    ]
    
    for f1 in f1_data:
        event = Event(
            event_type="f1",
            title=f1["title"],
            subtitle=f1["subtitle"],
            venue=f1["venue"],
            city=f1["city"],
            country=f1["country"],
            event_date=datetime.now(timezone.utc) + timedelta(days=f1["days"]),
            event_image=f1["image"],
            featured=f1["featured"]
        )
        event_doc = event.model_dump()
        event_doc['event_date'] = event_doc['event_date'].isoformat()
        event_doc['created_at'] = event_doc['created_at'].isoformat()
        await db.events.insert_one(event_doc)
        
        # Add F1 tickets
        categories = [
            {"name": "grandstand", "base": f1["base_price"]},
            {"name": "general_admission", "base": f1["base_price"] * 0.4},
            {"name": "vip_hospitality", "base": f1["base_price"] * 3},
            {"name": "paddock_club", "base": f1["base_price"] * 5}
        ]
        for cat in categories:
            for _ in range(random.randint(5, 15)):
                price = round(cat["base"] * random.uniform(0.9, 1.5), 2)
                ticket = Ticket(
                    event_id=event.event_id,
                    seller_id="seller_demo",
                    seller_name="F1 Tickets Pro",
                    category=cat["name"],
                    section=random.choice(["Turn 1", "Main Straight", "Pit Lane", "Sector 3"]),
                    price=price,
                    original_price=cat["base"]
                )
                ticket_doc = ticket.model_dump()
                ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
                await db.tickets.insert_one(ticket_doc)
        
        added_events.append(event.event_id)
    
    # ============== TENNIS GRAND SLAMS ==============
    tennis_data = [
        {"title": "Wimbledon 2025 - Centre Court", "subtitle": "The Championships - Men's Final", "venue": "All England Club", "city": "London", "country": "England", "days": 80, "featured": True, "base_price": 550, "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg"},
        {"title": "Wimbledon 2025 - Women's Final", "subtitle": "The Championships", "venue": "All England Club", "city": "London", "country": "England", "days": 79, "featured": True, "base_price": 450, "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg"},
        {"title": "Wimbledon 2025 - Ground Pass", "subtitle": "Access to Outside Courts", "venue": "All England Club", "city": "London", "country": "England", "days": 75, "featured": False, "base_price": 85, "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg"},
        {"title": "Roland Garros 2025 - Final", "subtitle": "French Open - Men's Singles Final", "venue": "Stade Roland Garros", "city": "Paris", "country": "France", "days": 45, "featured": True, "base_price": 385, "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg"},
        {"title": "Roland Garros 2025 - Semifinals", "subtitle": "French Open", "venue": "Stade Roland Garros", "city": "Paris", "country": "France", "days": 43, "featured": True, "base_price": 275, "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg"},
        {"title": "Italian Open 2025 - Rome", "subtitle": "ATP Masters 1000", "venue": "Foro Italico", "city": "Rome", "country": "Italy", "days": 35, "featured": True, "base_price": 125, "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg"},
        {"title": "Madrid Open 2025", "subtitle": "ATP/WTA Masters", "venue": "Caja Mágica", "city": "Madrid", "country": "Spain", "days": 30, "featured": False, "base_price": 95, "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg"},
    ]
    
    for t in tennis_data:
        event = Event(
            event_type="tennis",
            title=t["title"],
            subtitle=t["subtitle"],
            venue=t["venue"],
            city=t["city"],
            country=t["country"],
            event_date=datetime.now(timezone.utc) + timedelta(days=t["days"]),
            event_image=t["image"],
            featured=t["featured"]
        )
        event_doc = event.model_dump()
        event_doc['event_date'] = event_doc['event_date'].isoformat()
        event_doc['created_at'] = event_doc['created_at'].isoformat()
        await db.events.insert_one(event_doc)
        
        # Add tennis tickets
        for _ in range(random.randint(10, 30)):
            price = round(t["base_price"] * random.uniform(0.8, 2.0), 2)
            ticket = Ticket(
                event_id=event.event_id,
                seller_id="seller_demo",
                seller_name="Tennis Tickets EU",
                category=random.choice(["centre_court", "court_1", "ground_pass", "debenture"]),
                section=random.choice(["Lower Tier", "Upper Tier", "Royal Box Area"]),
                price=price,
                original_price=t["base_price"]
            )
            ticket_doc = ticket.model_dump()
            ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
            await db.tickets.insert_one(ticket_doc)
        
        added_events.append(event.event_id)
    
    return {
        "message": "Expanded categories added successfully",
        "added_events": len(added_events),
        "categories": ["trains", "attractions", "festivals", "f1", "tennis"]
    }

@api_router.get("/")
async def root():
    return {"message": "EuroMatchTickets API - Events & Tickets Marketplace"}

# ============== SITEMAP ENDPOINT ==============

@api_router.get("/sitemap.xml")
async def get_sitemap():
    """Generate dynamic sitemap.xml for SEO"""
    from fastapi.responses import Response
    
    base_url = os.environ.get('FRONTEND_URL', 'https://euromatchtickets.com')
    
    # Static pages
    static_pages = [
        {"loc": f"{base_url}/", "priority": "1.0", "changefreq": "daily"},
        {"loc": f"{base_url}/events", "priority": "0.9", "changefreq": "hourly"},
        {"loc": f"{base_url}/events?type=match", "priority": "0.85", "changefreq": "hourly"},
        {"loc": f"{base_url}/events?type=concert", "priority": "0.85", "changefreq": "hourly"},
        # High-value landing pages - Football
        {"loc": f"{base_url}/world-cup-2026", "priority": "0.95", "changefreq": "daily"},
        {"loc": f"{base_url}/world-cup-raffle", "priority": "0.95", "changefreq": "daily"},
        {"loc": f"{base_url}/champions-league-tickets", "priority": "0.95", "changefreq": "daily"},
        # High-value landing pages - Concerts & Artists
        {"loc": f"{base_url}/bruno-mars-tour-2026", "priority": "0.95", "changefreq": "daily"},
        {"loc": f"{base_url}/guns-n-roses-tour-2026", "priority": "0.95", "changefreq": "daily"},
        {"loc": f"{base_url}/bad-bunny-london-2026", "priority": "0.95", "changefreq": "daily"},
        {"loc": f"{base_url}/the-weeknd-tour-2026", "priority": "0.95", "changefreq": "daily"},
        {"loc": f"{base_url}/blog", "priority": "0.8", "changefreq": "weekly"},
        {"loc": f"{base_url}/reviews", "priority": "0.7", "changefreq": "weekly"},
        {"loc": f"{base_url}/faq", "priority": "0.6", "changefreq": "monthly"},
        {"loc": f"{base_url}/about", "priority": "0.6", "changefreq": "monthly"},
        {"loc": f"{base_url}/contact", "priority": "0.5", "changefreq": "monthly"},
        {"loc": f"{base_url}/terms", "priority": "0.3", "changefreq": "monthly"},
        {"loc": f"{base_url}/refund-policy", "priority": "0.3", "changefreq": "monthly"},
    ]
    
    # Blog articles (hardcoded for now - could be moved to DB)
    blog_articles = [
        "best-seats-santiago-bernabeu",
        "how-to-buy-champions-league-tickets-safely",
        "is-it-safe-to-buy-resale-concert-tickets",
        "premier-league-away-days-guide",
        "taylor-swift-eras-tour-europe-2025",
        "el-clasico-atmosphere-guide"
    ]
    
    # Get all events
    events = await db.events.find(
        {"status": {"$ne": "cancelled"}},
        {"_id": 0, "event_id": 1, "event_date": 1}
    ).to_list(1000)
    
    # Build sitemap XML
    xml_items = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_items.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Add static pages
    for page in static_pages:
        xml_items.append(f"""  <url>
    <loc>{page['loc']}</loc>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
  </url>""")
    
    # Add blog articles
    for article_id in blog_articles:
        xml_items.append(f"""  <url>
    <loc>{base_url}/blog/{article_id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>""")
    
    # Add event pages
    for event in events:
        event_date = event.get('event_date', '')
        if isinstance(event_date, datetime):
            lastmod = event_date.strftime('%Y-%m-%d')
        else:
            lastmod = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        
        xml_items.append(f"""  <url>
    <loc>{base_url}/event/{event['event_id']}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>""")
    
    xml_items.append('</urlset>')
    
    return Response(
        content='\n'.join(xml_items),
        media_type="application/xml"
    )

@api_router.get("/robots.txt")
async def get_robots(request: Request):
    """Generate robots.txt for SEO"""
    from fastapi.responses import PlainTextResponse
    
    # Get domain from request or environment
    host = request.headers.get("host", "euromatchtickets.com")
    base_url = f"https://{host}"
    
    robots_content = f"""User-agent: *
Allow: /
Allow: /events
Allow: /event/
Allow: /world-cup-2026
Allow: /blog
Allow: /blog/

Disallow: /admin
Disallow: /seller
Disallow: /owner
Disallow: /my-tickets
Disallow: /alerts
Disallow: /api/

Sitemap: {base_url}/api/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1
"""
    return PlainTextResponse(content=robots_content)

# ============== AI DESCRIPTION GENERATOR ==============

@api_router.post("/events/{event_id}/generate-description")
async def generate_event_description(event_id: str, request: Request):
    """Generate SEO-optimized description for an event using AI"""
    user = await require_admin(request)
    
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        llm_key = os.environ.get('EMERGENT_LLM_KEY')
        if not llm_key:
            raise HTTPException(status_code=500, detail="LLM key not configured")
        
        chat = LlmChat(
            api_key=llm_key,
            session_id=f"seo_desc_{event_id}",
            system_message="""You are an SEO expert for a ticket marketplace. Generate compelling, 
            SEO-optimized descriptions for events. The description should be 150-250 words, 
            include relevant keywords naturally, and encourage ticket purchases. 
            Write in a professional but exciting tone. Do not use markdown formatting."""
        ).with_model("openai", "gpt-4o")
        
        is_match = event.get('event_type') == 'match'
        
        if is_match:
            prompt = f"""Write an SEO description for this football match:
            
Match: {event.get('home_team')} vs {event.get('away_team')}
Competition: {event.get('subtitle', event.get('league', 'Football Match'))}
Venue: {event.get('venue')}, {event.get('city')}, {event.get('country')}
Date: {event.get('event_date')}

Include keywords like: buy tickets, {event.get('home_team')} tickets, {event.get('away_team')} tickets, 
{event.get('city')} football, secure tickets, official tickets."""
        else:
            prompt = f"""Write an SEO description for this concert:
            
Artist: {event.get('artist')}
Tour: {event.get('subtitle', 'Live Concert')}
Genre: {event.get('genre', 'Music')}
Venue: {event.get('venue')}, {event.get('city')}, {event.get('country')}
Date: {event.get('event_date')}

Include keywords like: buy tickets, {event.get('artist')} concert tickets, {event.get('artist')} tour,
{event.get('city')} concert, live music, official tickets."""
        
        user_message = UserMessage(text=prompt)
        description = await chat.send_message(user_message)
        
        # Update event with description
        await db.events.update_one(
            {"event_id": event_id},
            {"$set": {"description": description}}
        )
        
        return {"success": True, "description": description}
        
    except ImportError:
        raise HTTPException(status_code=500, detail="LLM integration not available")
    except Exception as e:
        logger.error(f"Error generating description: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/events/generate-all-descriptions")
async def generate_all_descriptions(request: Request):
    """Generate descriptions for all events without descriptions"""
    user = await require_admin(request)
    
    events = await db.events.find(
        {"$or": [{"description": None}, {"description": ""}]},
        {"_id": 0, "event_id": 1}
    ).to_list(100)
    
    generated = 0
    errors = []
    
    for event in events:
        try:
            # Call the single event generator
            await generate_event_description(event["event_id"], request)
            generated += 1
        except Exception as e:
            errors.append({"event_id": event["event_id"], "error": str(e)})
    
    return {
        "success": True,
        "generated": generated,
        "total": len(events),
        "errors": errors
    }

# Include the router in the main app
app.include_router(api_router)

# Mount static files directory for videos and assets under /api/static
static_dir = ROOT_DIR / "static"
if static_dir.exists():
    app.mount("/api/static", StaticFiles(directory=str(static_dir)), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
