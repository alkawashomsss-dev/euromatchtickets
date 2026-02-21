from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
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
import qrcode
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
PLATFORM_COMMISSION = 0.10  # 10% commission

# Create the main app
app = FastAPI(title="FanPass - European Football Ticket Marketplace")

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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Match(BaseModel):
    model_config = ConfigDict(extra="ignore")
    match_id: str = Field(default_factory=lambda: f"match_{uuid.uuid4().hex[:12]}")
    home_team: str
    away_team: str
    home_logo: str
    away_logo: str
    league: str  # champions_league, premier_league, la_liga
    league_logo: str
    stadium: str
    city: str
    country: str
    match_date: datetime
    status: str = "upcoming"  # upcoming, live, completed
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MatchCreate(BaseModel):
    home_team: str
    away_team: str
    home_logo: str
    away_logo: str
    league: str
    league_logo: str
    stadium: str
    city: str
    country: str
    match_date: datetime
    featured: bool = False

class Ticket(BaseModel):
    model_config = ConfigDict(extra="ignore")
    ticket_id: str = Field(default_factory=lambda: f"ticket_{uuid.uuid4().hex[:12]}")
    match_id: str
    seller_id: str
    seller_name: str
    category: str  # vip, cat1, cat2, cat3
    section: str
    row: str
    seat: str
    price: float
    original_price: float
    currency: str = "EUR"
    status: str = "available"  # available, reserved, sold
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TicketCreate(BaseModel):
    match_id: str
    category: str
    section: str
    row: str
    seat: str
    price: float
    original_price: float
    currency: str = "EUR"

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str = Field(default_factory=lambda: f"order_{uuid.uuid4().hex[:12]}")
    buyer_id: str
    buyer_email: str
    ticket_id: str
    match_id: str
    seller_id: str
    ticket_price: float
    commission: float
    total_amount: float
    currency: str = "EUR"
    status: str = "pending"  # pending, paid, completed, cancelled, refunded
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

# ============== AUTH HELPERS ==============

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
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get user data
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
    
    if auth_response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    auth_data = auth_response.json()
    email = auth_data.get("email")
    name = auth_data.get("name")
    picture = auth_data.get("picture")
    session_token = auth_data.get("session_token")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}}
        )
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
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
    
    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_doc = {
        "session_id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Remove old sessions for this user
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    # Get user data
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {"success": True, "user": user_doc}

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user.model_dump()

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

# ============== MATCHES ENDPOINTS ==============

@api_router.get("/matches")
async def get_matches(
    league: Optional[str] = None,
    city: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    featured: Optional[bool] = None
):
    """Get matches with filters"""
    query = {}
    
    if league:
        query["league"] = league
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if featured is not None:
        query["featured"] = featured
    if date_from:
        query["match_date"] = {"$gte": date_from}
    if date_to:
        if "match_date" in query:
            query["match_date"]["$lte"] = date_to
        else:
            query["match_date"] = {"$lte": date_to}
    
    matches = await db.matches.find(query, {"_id": 0}).sort("match_date", 1).to_list(100)
    
    # Get ticket counts for each match
    for match in matches:
        ticket_count = await db.tickets.count_documents({
            "match_id": match["match_id"],
            "status": "available"
        })
        match["available_tickets"] = ticket_count
        
        # Get lowest price
        lowest_ticket = await db.tickets.find_one(
            {"match_id": match["match_id"], "status": "available"},
            {"_id": 0, "price": 1},
            sort=[("price", 1)]
        )
        match["lowest_price"] = lowest_ticket["price"] if lowest_ticket else None
    
    return matches

@api_router.get("/matches/{match_id}")
async def get_match(match_id: str):
    """Get match details"""
    match = await db.matches.find_one({"match_id": match_id}, {"_id": 0})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Get available tickets grouped by category
    tickets = await db.tickets.find(
        {"match_id": match_id, "status": "available"},
        {"_id": 0}
    ).to_list(500)
    
    match["tickets"] = tickets
    match["ticket_count"] = len(tickets)
    
    # Group by category
    categories = {}
    for ticket in tickets:
        cat = ticket["category"]
        if cat not in categories:
            categories[cat] = {"count": 0, "lowest_price": float('inf')}
        categories[cat]["count"] += 1
        if ticket["price"] < categories[cat]["lowest_price"]:
            categories[cat]["lowest_price"] = ticket["price"]
    
    match["categories"] = categories
    
    return match

@api_router.post("/matches")
async def create_match(match_data: MatchCreate, request: Request):
    """Create a new match (admin only)"""
    user = await require_admin(request)
    
    match = Match(**match_data.model_dump())
    match_doc = match.model_dump()
    match_doc['match_date'] = match_doc['match_date'].isoformat()
    match_doc['created_at'] = match_doc['created_at'].isoformat()
    
    await db.matches.insert_one(match_doc)
    return {"success": True, "match_id": match.match_id}

@api_router.put("/matches/{match_id}")
async def update_match(match_id: str, match_data: dict, request: Request):
    """Update a match (admin only)"""
    user = await require_admin(request)
    
    if "match_date" in match_data and isinstance(match_data["match_date"], datetime):
        match_data["match_date"] = match_data["match_date"].isoformat()
    
    result = await db.matches.update_one(
        {"match_id": match_id},
        {"$set": match_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Match not found")
    
    return {"success": True}

@api_router.delete("/matches/{match_id}")
async def delete_match(match_id: str, request: Request):
    """Delete a match (admin only)"""
    user = await require_admin(request)
    
    result = await db.matches.delete_one({"match_id": match_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Match not found")
    
    return {"success": True}

# ============== TICKETS ENDPOINTS ==============

@api_router.get("/tickets")
async def get_tickets(
    match_id: Optional[str] = None,
    category: Optional[str] = None,
    seller_id: Optional[str] = None,
    status: str = "available"
):
    """Get tickets with filters"""
    query = {"status": status}
    
    if match_id:
        query["match_id"] = match_id
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
    
    # Verify match exists
    match = await db.matches.find_one({"match_id": ticket_data.match_id}, {"_id": 0})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
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
    
    # Get match info for each ticket
    for ticket in tickets:
        match = await db.matches.find_one({"match_id": ticket["match_id"]}, {"_id": 0})
        if match:
            ticket["match"] = match
    
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
    
    # Get ticket
    ticket = await db.tickets.find_one({"ticket_id": ticket_id, "status": "available"}, {"_id": 0})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not available")
    
    # Get match
    match = await db.matches.find_one({"match_id": ticket["match_id"]}, {"_id": 0})
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Calculate amounts
    ticket_price = float(ticket["price"])
    commission = round(ticket_price * PLATFORM_COMMISSION, 2)
    total_amount = round(ticket_price + commission, 2)
    
    # Create order
    order = Order(
        buyer_id=user.user_id,
        buyer_email=user.email,
        ticket_id=ticket_id,
        match_id=ticket["match_id"],
        seller_id=ticket["seller_id"],
        ticket_price=ticket_price,
        commission=commission,
        total_amount=total_amount,
        currency=ticket["currency"]
    )
    
    order_doc = order.model_dump()
    order_doc['created_at'] = order_doc['created_at'].isoformat()
    
    # Reserve ticket
    await db.tickets.update_one(
        {"ticket_id": ticket_id},
        {"$set": {"status": "reserved"}}
    )
    
    # Create Stripe checkout
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{origin_url}/order/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/match/{ticket['match_id']}"
    
    checkout_request = CheckoutSessionRequest(
        amount=total_amount,
        currency=ticket["currency"].lower(),
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "order_id": order.order_id,
            "ticket_id": ticket_id,
            "buyer_id": user.user_id,
            "match": f"{match['home_team']} vs {match['away_team']}"
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Update order with session ID
    order_doc["stripe_session_id"] = session.session_id
    await db.orders.insert_one(order_doc)
    
    # Create payment transaction
    transaction = PaymentTransaction(
        order_id=order.order_id,
        session_id=session.session_id,
        amount=total_amount,
        currency=ticket["currency"],
        status="initiated",
        metadata=checkout_request.metadata
    )
    txn_doc = transaction.model_dump()
    txn_doc['created_at'] = txn_doc['created_at'].isoformat()
    await db.payment_transactions.insert_one(txn_doc)
    
    return {
        "url": session.url,
        "session_id": session.session_id,
        "order_id": order.order_id
    }

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    """Get checkout status and complete order if paid"""
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Get order
    order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Update payment transaction
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {"status": status.payment_status}}
    )
    
    # If paid and not already completed
    if status.payment_status == "paid" and order["status"] != "completed":
        # Generate QR code
        qr_data = f"FANPASS-{order['order_id']}-{order['ticket_id']}"
        qr_code = generate_qr_code(qr_data)
        
        # Update order
        await db.orders.update_one(
            {"order_id": order["order_id"]},
            {"$set": {"status": "completed", "qr_code": qr_code}}
        )
        
        # Mark ticket as sold
        await db.tickets.update_one(
            {"ticket_id": order["ticket_id"]},
            {"$set": {"status": "sold"}}
        )
        
        # Update seller stats
        await db.users.update_one(
            {"user_id": order["seller_id"]},
            {"$inc": {"total_sales": 1}}
        )
        
        order["status"] = "completed"
        order["qr_code"] = qr_code
    
    return {
        "payment_status": status.payment_status,
        "status": status.status,
        "order": order
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            order = await db.orders.find_one(
                {"stripe_session_id": webhook_response.session_id},
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
    
    # Get match and ticket info
    for order in orders:
        match = await db.matches.find_one({"match_id": order["match_id"]}, {"_id": 0})
        ticket = await db.tickets.find_one({"ticket_id": order["ticket_id"]}, {"_id": 0})
        order["match"] = match
        order["ticket"] = ticket
    
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
    
    match = await db.matches.find_one({"match_id": order["match_id"]}, {"_id": 0})
    ticket = await db.tickets.find_one({"ticket_id": order["ticket_id"]}, {"_id": 0})
    
    order["match"] = match
    order["ticket"] = ticket
    
    return order

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
    
    # Check if already rated
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
    
    # Update seller average rating
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
    total_matches = await db.matches.count_documents({})
    total_tickets = await db.tickets.count_documents({})
    available_tickets = await db.tickets.count_documents({"status": "available"})
    sold_tickets = await db.tickets.count_documents({"status": "sold"})
    
    # Calculate revenue
    completed_orders = await db.orders.find(
        {"status": "completed"},
        {"_id": 0, "total_amount": 1, "commission": 1}
    ).to_list(10000)
    
    total_revenue = sum(o["total_amount"] for o in completed_orders)
    total_commission = sum(o["commission"] for o in completed_orders)
    
    return {
        "total_users": total_users,
        "total_sellers": total_sellers,
        "total_matches": total_matches,
        "total_tickets": total_tickets,
        "available_tickets": available_tickets,
        "sold_tickets": sold_tickets,
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

@api_router.get("/admin/orders")
async def get_admin_orders(request: Request):
    """Get all orders (admin only)"""
    user = await require_admin(request)
    
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

# ============== SEED DATA ==============

@api_router.post("/seed")
async def seed_data():
    """Seed demo data"""
    # Check if already seeded
    existing = await db.matches.count_documents({})
    if existing > 0:
        return {"message": "Already seeded"}
    
    # League logos
    leagues = {
        "champions_league": "https://upload.wikimedia.org/wikipedia/commons/e/e9/UEFA_Champions_League_logo_2.svg",
        "premier_league": "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
        "la_liga": "https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg"
    }
    
    # Team logos
    teams = {
        "Real Madrid": "https://crests.football-data.org/86.svg",
        "Barcelona": "https://crests.football-data.org/81.svg",
        "Manchester City": "https://crests.football-data.org/65.svg",
        "Liverpool": "https://crests.football-data.org/64.svg",
        "Arsenal": "https://crests.football-data.org/57.svg",
        "Bayern Munich": "https://crests.football-data.org/5.svg",
        "PSG": "https://crests.football-data.org/524.svg",
        "Chelsea": "https://crests.football-data.org/61.svg",
        "Atletico Madrid": "https://crests.football-data.org/78.svg",
        "Juventus": "https://crests.football-data.org/109.svg",
        "Inter Milan": "https://crests.football-data.org/108.svg",
        "AC Milan": "https://crests.football-data.org/98.svg"
    }
    
    matches_data = [
        # Champions League
        {
            "home_team": "Real Madrid", "away_team": "Manchester City",
            "league": "champions_league", "stadium": "Santiago Bernabéu",
            "city": "Madrid", "country": "Spain",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            "featured": True
        },
        {
            "home_team": "Bayern Munich", "away_team": "PSG",
            "league": "champions_league", "stadium": "Allianz Arena",
            "city": "Munich", "country": "Germany",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
            "featured": True
        },
        {
            "home_team": "Barcelona", "away_team": "Inter Milan",
            "league": "champions_league", "stadium": "Camp Nou",
            "city": "Barcelona", "country": "Spain",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=21)).isoformat(),
            "featured": False
        },
        # Premier League
        {
            "home_team": "Liverpool", "away_team": "Arsenal",
            "league": "premier_league", "stadium": "Anfield",
            "city": "Liverpool", "country": "England",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=3)).isoformat(),
            "featured": True
        },
        {
            "home_team": "Manchester City", "away_team": "Chelsea",
            "league": "premier_league", "stadium": "Etihad Stadium",
            "city": "Manchester", "country": "England",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=10)).isoformat(),
            "featured": False
        },
        {
            "home_team": "Arsenal", "away_team": "Liverpool",
            "league": "premier_league", "stadium": "Emirates Stadium",
            "city": "London", "country": "England",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=17)).isoformat(),
            "featured": False
        },
        # La Liga
        {
            "home_team": "Barcelona", "away_team": "Real Madrid",
            "league": "la_liga", "stadium": "Camp Nou",
            "city": "Barcelona", "country": "Spain",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=5)).isoformat(),
            "featured": True
        },
        {
            "home_team": "Atletico Madrid", "away_team": "Barcelona",
            "league": "la_liga", "stadium": "Metropolitano",
            "city": "Madrid", "country": "Spain",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=12)).isoformat(),
            "featured": False
        },
        {
            "home_team": "Real Madrid", "away_team": "Atletico Madrid",
            "league": "la_liga", "stadium": "Santiago Bernabéu",
            "city": "Madrid", "country": "Spain",
            "match_date": (datetime.now(timezone.utc) + timedelta(days=19)).isoformat(),
            "featured": False
        }
    ]
    
    for match_data in matches_data:
        match = Match(
            home_team=match_data["home_team"],
            away_team=match_data["away_team"],
            home_logo=teams.get(match_data["home_team"], ""),
            away_logo=teams.get(match_data["away_team"], ""),
            league=match_data["league"],
            league_logo=leagues[match_data["league"]],
            stadium=match_data["stadium"],
            city=match_data["city"],
            country=match_data["country"],
            match_date=datetime.fromisoformat(match_data["match_date"]),
            featured=match_data["featured"]
        )
        
        match_doc = match.model_dump()
        match_doc['match_date'] = match_doc['match_date'].isoformat()
        match_doc['created_at'] = match_doc['created_at'].isoformat()
        await db.matches.insert_one(match_doc)
    
    # Create demo admin user
    admin_user = User(
        user_id="admin_001",
        email="admin@fanpass.com",
        name="FanPass Admin",
        role="admin"
    )
    admin_doc = admin_user.model_dump()
    admin_doc['created_at'] = admin_doc['created_at'].isoformat()
    await db.users.insert_one(admin_doc)
    
    # Create demo seller with tickets
    seller_user = User(
        user_id="seller_demo",
        email="seller@fanpass.com",
        name="John's Tickets",
        role="seller",
        rating=4.8,
        total_sales=127
    )
    seller_doc = seller_user.model_dump()
    seller_doc['created_at'] = seller_doc['created_at'].isoformat()
    await db.users.insert_one(seller_doc)
    
    # Add demo tickets
    all_matches = await db.matches.find({}, {"_id": 0}).to_list(100)
    
    categories = [
        {"name": "vip", "base_price": 450, "sections": ["VIP-A", "VIP-B"]},
        {"name": "cat1", "base_price": 280, "sections": ["101", "102", "103"]},
        {"name": "cat2", "base_price": 180, "sections": ["201", "202", "203", "204"]},
        {"name": "cat3", "base_price": 95, "sections": ["301", "302", "303", "304", "305"]}
    ]
    
    import random
    
    for match in all_matches:
        for cat in categories:
            for section in cat["sections"]:
                for _ in range(random.randint(2, 5)):
                    price_variation = random.uniform(0.9, 1.3)
                    price = round(cat["base_price"] * price_variation, 2)
                    
                    ticket = Ticket(
                        match_id=match["match_id"],
                        seller_id="seller_demo",
                        seller_name="John's Tickets",
                        category=cat["name"],
                        section=section,
                        row=str(random.randint(1, 20)),
                        seat=str(random.randint(1, 30)),
                        price=price,
                        original_price=cat["base_price"]
                    )
                    
                    ticket_doc = ticket.model_dump()
                    ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
                    await db.tickets.insert_one(ticket_doc)
    
    return {"message": "Seeded successfully", "matches": len(matches_data)}

@api_router.get("/")
async def root():
    return {"message": "FanPass API - European Football Ticket Marketplace"}

# Include the router in the main app
app.include_router(api_router)

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
