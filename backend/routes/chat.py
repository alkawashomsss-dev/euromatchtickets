"""
AI Chat Assistant for EuroMatchTickets
Smart chatbot that knows all events, tickets, and prices.
"""
from fastapi import APIRouter, Request
from pydantic import BaseModel
from datetime import datetime, timezone
from database.db import db
import os
import uuid

router = APIRouter(prefix="/api")

EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

SYSTEM_PROMPT = """You are the EuroMatchTickets AI Assistant - a friendly, expert ticket concierge for Europe's largest ticket marketplace.

ABOUT EUROMATCHTICKETS:
- Europe's cheapest verified ticket marketplace
- 4.8/5 rating from 12,000+ buyers
- Instant QR e-ticket delivery (no shipping needed)
- FanProtect money-back guarantee on every purchase
- No membership required - anyone can buy

WHAT WE SELL:
- Formula 1 tickets (all Grand Prix races) from €59
- Football tickets (Champions League, Premier League, La Liga, Bundesliga, Serie A, Ligue 1) from €35
- Concert tickets (Taylor Swift, Coldplay, The Weeknd, and more) from €59
- World Cup 2026 tickets (all host cities in USA, Canada, Mexico) from €75
- MotoGP tickets from €45
- Isle of Man TT tickets from €49

KEY PRICES (cheapest in Europe):
- Bahrain GP: from €59 (cheapest F1 race)
- Monza GP: from €69
- Silverstone GP: from €95
- Monaco GP: from €195
- Champions League group stage: from €49
- Champions League Final: from €295
- Premier League: from €45
- El Clasico: from €195
- Taylor Swift Eras Tour: from €79
- Coldplay Tour: from €69
- World Cup Group Stage: from €75

HOW TO BUY:
1. Find your event on euromatchtickets.com
2. Select your seats/category
3. Pay securely with credit card
4. Receive QR e-tickets instantly by email
5. Show QR code at the venue - done!

GUARANTEES:
- FanProtect: Full refund if event is cancelled
- Verified sellers only
- Prices up to 40% below competitors
- 24/7 customer support

RULES:
- Always be helpful, friendly, and concise
- Recommend specific events based on user interests
- Mention prices to show value
- If asked about availability, always say "Yes! We have tickets available"
- Support English, Arabic, German, Spanish, French, Italian
- Never make up events that don't exist
- If unsure about specific details, suggest checking the website
- Keep responses under 150 words
- Use occasional emojis but don't overdo it"""


class ChatMessage(BaseModel):
    message: str
    session_id: str = ""


@router.post("/chat/message")
async def chat_message(msg: ChatMessage):
    """Send a message to the AI assistant."""

    if not msg.session_id:
        msg.session_id = str(uuid.uuid4())

    # Get chat history for this session (last 10 messages)
    history = await db.chat_history.find(
        {"session_id": msg.session_id},
        {"_id": 0, "role": 1, "content": 1}
    ).sort("created_at", -1).to_list(10)
    history.reverse()

    # Store user message
    await db.chat_history.insert_one({
        "session_id": msg.session_id,
        "role": "user",
        "content": msg.message,
        "created_at": datetime.now(timezone.utc)
    })

    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage

        chat = LlmChat(
            api_key=EMERGENT_KEY,
            session_id=msg.session_id,
            system_message=SYSTEM_PROMPT
        ).with_model("openai", "gpt-4.1-mini")

        # Build context with chat history
        for h in history:
            if h["role"] == "user":
                await chat.send_message(UserMessage(text=h["content"]))

        # Send current message
        response = await chat.send_message(UserMessage(text=msg.message))

        # Store assistant response
        await db.chat_history.insert_one({
            "session_id": msg.session_id,
            "role": "assistant",
            "content": response,
            "created_at": datetime.now(timezone.utc)
        })

        return {
            "response": response,
            "session_id": msg.session_id,
        }

    except Exception as e:
        error_msg = str(e)
        # Fallback responses for common questions
        lower = msg.message.lower()
        if any(w in lower for w in ["price", "cost", "cheap", "سعر", "كم"]):
            fallback = "Our tickets start from €35 for football, €59 for F1, €59 for concerts, and €75 for World Cup 2026. We guarantee the cheapest prices in Europe - up to 40% below competitors! Check euromatchtickets.com for exact prices."
        elif any(w in lower for w in ["f1", "formula", "grand prix"]):
            fallback = "We have F1 tickets for all 24 Grand Prix races in 2026! Cheapest: Bahrain GP from €59. Most popular: Monza from €69, Monaco from €195. All with instant QR delivery!"
        elif any(w in lower for w in ["football", "soccer", "champions", "كرة"]):
            fallback = "Champions League tickets from €49, Premier League from €45, La Liga from €39, Bundesliga from €35! UCL Final 2026 at San Siro from €295. FanProtect guarantee included!"
        elif any(w in lower for w in ["concert", "taylor", "coldplay", "حفل"]):
            fallback = "Concert tickets: Taylor Swift Eras Tour from €79, Coldplay from €69, and many more! All European dates available. Instant QR delivery!"
        elif any(w in lower for w in ["world cup", "كأس العالم"]):
            fallback = "FIFA World Cup 2026 tickets available for all host cities: New York, LA, Miami, Dallas, Toronto, Mexico City! Group stage from €75. Book now before they sell out!"
        else:
            fallback = "Welcome to EuroMatchTickets! We offer the cheapest verified tickets for F1, football, concerts, and World Cup 2026 across Europe. How can I help you find tickets?"

        await db.chat_history.insert_one({
            "session_id": msg.session_id,
            "role": "assistant",
            "content": fallback,
            "created_at": datetime.now(timezone.utc)
        })

        return {
            "response": fallback,
            "session_id": msg.session_id,
        }
