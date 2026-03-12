from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timezone
import uuid
import logging
import os

from database.db import db
from models.schemas import ChatMessage, RaffleEntry
from utils.helpers import get_current_user, require_auth, require_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

# AI Chat
chat_histories = {}
openai_client = None
try:
    from openai import OpenAI
    api_key = os.environ.get('OPENAI_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
    if api_key:
        openai_client = OpenAI(api_key=api_key)
except ImportError:
    pass

SUPPORT_MSG = """You are the AI customer support assistant for EuroMatchTickets, Europe's #1 ticket marketplace for football matches and concerts.
Help customers find tickets, answer questions about orders/payments, explain refund policy (full refund if cancelled, 48h window).
Mention: Champions League, Premier League, La Liga, Bundesliga, World Cup 2026, major concerts.
Keep responses concise. Direct unknowns to support@euromatchtickets.com"""


@router.post("/chat/support")
async def chat_support(chat_msg: ChatMessage):
    try:
        if not openai_client:
            return {"response": "AI support is currently unavailable. Please email support@euromatchtickets.com"}
        sid = chat_msg.session_id
        if sid not in chat_histories:
            chat_histories[sid] = []
        chat_histories[sid].append({"role": "user", "content": chat_msg.message})
        messages = [{"role": "system", "content": SUPPORT_MSG}] + chat_histories[sid][-10:]
        response = openai_client.chat.completions.create(model="gpt-4o", messages=messages, max_tokens=500)
        ai_resp = response.choices[0].message.content
        chat_histories[sid].append({"role": "assistant", "content": ai_resp})
        await db.chat_logs.insert_one({"session_id": sid, "user_message": chat_msg.message, "ai_response": ai_resp, "timestamp": datetime.now(timezone.utc).isoformat()})
        return {"response": ai_resp}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return {"response": "I'm having trouble. Please email support@euromatchtickets.com"}


# Raffle
@router.post("/raffle/checkout")
async def create_raffle_checkout(entry: RaffleEntry, request: Request):
    import stripe
    from config.settings import STRIPE_API_KEY, FRONTEND_URL
    stripe.api_key = STRIPE_API_KEY
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Please sign in")
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{'price_data': {'currency': 'eur', 'unit_amount': int(entry.price * 100), 'product_data': {'name': 'World Cup 2026 VIP Raffle Entry', 'description': 'Win an all-inclusive trip for 2 to FIFA World Cup 2026!'}}, 'quantity': entry.entries}],
        mode='payment',
        success_url=f'{FRONTEND_URL}/raffle/success?session_id={{CHECKOUT_SESSION_ID}}',
        cancel_url=f'{FRONTEND_URL}/world-cup-raffle',
        metadata={'type': 'raffle', 'user_id': user.user_id, 'user_email': user.email}
    )
    entry_doc = {"entry_id": str(uuid.uuid4())[:12], "user_id": user.user_id, "user_email": user.email, "raffle_type": entry.raffle_type, "price": entry.price, "entries": entry.entries, "stripe_session_id": checkout_session.id, "status": "pending", "created_at": datetime.now(timezone.utc).isoformat()}
    await db.raffle_entries.insert_one(entry_doc)
    return {"checkout_url": checkout_session.url}


@router.get("/raffle/entries")
async def get_raffle_entries(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return await db.raffle_entries.find({"user_id": user.user_id}, {"_id": 0}).to_list(100)


@router.get("/raffle/stats")
async def get_raffle_stats():
    total = await db.raffle_entries.count_documents({"status": "completed"})
    return {"total_entries": total, "max_entries": 500, "entries_remaining": 500 - total, "draw_date": "2026-05-01"}


# Marketing
@router.get("/marketing/referral/{user_id}")
async def get_user_referral(user_id: str):
    existing = await db.referrals.find_one({"user_id": user_id}, {"_id": 0})
    if existing:
        return existing
    code = f"EMT{user_id[-6:].upper()}"
    doc = {"user_id": user_id, "referral_code": code, "total_referrals": 0, "total_earnings": 0, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.referrals.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.post("/marketing/track-referral")
async def track_referral(request: Request):
    body = await request.json()
    code = body.get("referral_code")
    ref = await db.referrals.find_one({"referral_code": code}, {"_id": 0})
    if not ref:
        raise HTTPException(status_code=404, detail="Invalid referral code")
    await db.referrals.update_one({"referral_code": code}, {"$inc": {"total_referrals": 1}})
    return {"success": True}


@router.get("/marketing/social-posts")
async def generate_social_media_posts():
    events = await db.events.find({"status": {"$ne": "cancelled"}, "featured": True}, {"_id": 0, "title": 1, "venue": 1, "city": 1, "event_date": 1}).to_list(5)
    posts = []
    for e in events:
        posts.append({"platform": "twitter", "text": f"Get tickets for {e['title']} at {e['venue']}, {e['city']}! Best prices at euromatchtickets.com", "hashtags": "#tickets #live #football #concerts"})
        posts.append({"platform": "instagram", "text": f"Don't miss {e['title']}! Book your seats now at euromatchtickets.com | Link in bio", "hashtags": "#euromatchtickets #liveevents"})
    return posts


@router.get("/marketing/growth-plan")
async def get_growth_plan():
    return {"phases": [{"phase": 1, "name": "Launch", "duration": "Month 1", "goals": ["100 social followers", "50 email subscribers"]}, {"phase": 2, "name": "Growth", "duration": "Month 2-3", "goals": ["1000 followers", "500 subscribers"]}, {"phase": 3, "name": "Scale", "duration": "Month 4-6", "goals": ["10k followers", "5k subscribers"]}]}
