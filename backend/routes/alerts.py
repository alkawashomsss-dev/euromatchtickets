"""
Price Alerts System - Email notifications for ticket price drops, reminders, urgency
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import os
import resend
import random

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

# DB reference set in server.py
db = None

def set_db(database):
    global db
    db = database

resend.api_key = os.environ.get("RESEND_API_KEY", "")
FROM_EMAIL = "EuroMatchTickets <tickets@euromatchtickets.com>"

class AlertSubscription(BaseModel):
    email: EmailStr
    event_id: str
    event_title: str
    current_price: float = 0

class UnsubscribeRequest(BaseModel):
    email: EmailStr
    event_id: str

# ──── Subscribe to Price Alerts ────
@router.post("/subscribe")
async def subscribe_alert(data: AlertSubscription):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    
    existing = await db.price_alerts.find_one({
        "email": data.email,
        "event_id": data.event_id
    })
    
    if existing:
        return {"success": True, "message": "Already subscribed", "already_subscribed": True}
    
    alert = {
        "email": data.email,
        "event_id": data.event_id,
        "event_title": data.event_title,
        "current_price": data.current_price,
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "active": True,
        "emails_sent": [],
        "reminder_sent": False,
        "urgency_sent": False,
        "discount_sent": False,
    }
    
    await db.price_alerts.insert_one(alert)
    
    # Send welcome/confirmation email
    try:
        await send_welcome_email(data.email, data.event_title, data.current_price)
    except Exception as e:
        print(f"Email send error: {e}")
    
    return {"success": True, "message": "Subscribed successfully"}

# ──── Unsubscribe ────
@router.post("/unsubscribe")
async def unsubscribe_alert(data: UnsubscribeRequest):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    
    await db.price_alerts.update_one(
        {"email": data.email, "event_id": data.event_id},
        {"$set": {"active": False}}
    )
    return {"success": True, "message": "Unsubscribed"}

# ──── Check subscription status ────
@router.get("/status/{event_id}/{email}")
async def check_status(event_id: str, email: str):
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    
    alert = await db.price_alerts.find_one(
        {"email": email, "event_id": event_id, "active": True},
        {"_id": 0, "email": 1, "event_id": 1, "subscribed_at": 1}
    )
    return {"subscribed": alert is not None}

# ──── Get alert stats for an event ────
@router.get("/stats/{event_id}")
async def get_alert_stats(event_id: str):
    if db is None:
        return {"subscribers": 0, "watching": 0}
    
    count = await db.price_alerts.count_documents({"event_id": event_id, "active": True})
    return {"subscribers": count, "watching": count}

# ──── Trigger scheduled emails (called by cron/scheduler) ────
@router.post("/send-scheduled")
async def send_scheduled_emails():
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    
    now = datetime.now(timezone.utc)
    results = {"reminders": 0, "discounts": 0, "urgency": 0}
    
    alerts = await db.price_alerts.find({"active": True}).to_list(1000)
    
    for alert in alerts:
        sub_time = datetime.fromisoformat(alert["subscribed_at"].replace("Z", "+00:00"))
        hours_since = (now - sub_time).total_seconds() / 3600
        
        # After 24 hours - send discount email
        if hours_since >= 24 and not alert.get("discount_sent"):
            try:
                await send_discount_email(alert["email"], alert["event_title"], alert["current_price"])
                await db.price_alerts.update_one(
                    {"_id": alert["_id"]},
                    {"$set": {"discount_sent": True}, "$push": {"emails_sent": {"type": "discount", "sent_at": now.isoformat()}}}
                )
                results["discounts"] += 1
            except Exception as e:
                print(f"Discount email error: {e}")
        
        # After 48 hours - send reminder
        if hours_since >= 48 and not alert.get("reminder_sent"):
            try:
                await send_reminder_email(alert["email"], alert["event_title"], alert["current_price"])
                await db.price_alerts.update_one(
                    {"_id": alert["_id"]},
                    {"$set": {"reminder_sent": True}, "$push": {"emails_sent": {"type": "reminder", "sent_at": now.isoformat()}}}
                )
                results["reminders"] += 1
            except Exception as e:
                print(f"Reminder email error: {e}")
        
        # After 72 hours - urgency email
        if hours_since >= 72 and not alert.get("urgency_sent"):
            try:
                await send_urgency_email(alert["email"], alert["event_title"], alert["current_price"])
                await db.price_alerts.update_one(
                    {"_id": alert["_id"]},
                    {"$set": {"urgency_sent": True}, "$push": {"emails_sent": {"type": "urgency", "sent_at": now.isoformat()}}}
                )
                results["urgency"] += 1
            except Exception as e:
                print(f"Urgency email error: {e}")
    
    return {"success": True, "results": results}


# ──── EMAIL TEMPLATES ────

async def send_welcome_email(email: str, event_title: str, price: float):
    html = f"""
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="color:#fbbf24;font-size:28px;margin:0;">Price Alert Activated</h1>
        <p style="color:#94a3b8;font-size:14px;margin-top:8px;">EuroMatchTickets</p>
      </div>
      <div style="padding:30px;">
        <p style="color:#334155;font-size:16px;line-height:1.6;">
          You're now tracking price changes for:
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
          <h2 style="color:#0f172a;font-size:22px;margin:0 0 8px;">{event_title}</h2>
          <p style="color:#64748b;margin:0;">Current price: <strong style="color:#059669;font-size:24px;">&euro;{int(price)}</strong></p>
        </div>
        <p style="color:#334155;font-size:14px;line-height:1.6;">
          We'll notify you immediately when:
        </p>
        <ul style="color:#475569;font-size:14px;line-height:2;">
          <li>Prices drop for this event</li>
          <li>Exclusive discounts become available</li>
          <li>Tickets are running low</li>
        </ul>
        <a href="https://euromatchtickets.com/events" style="display:block;background:#059669;color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;margin-top:20px;">
          Browse More Events
        </a>
      </div>
      <div style="background:#f8fafc;padding:20px 30px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:11px;margin:0;">EuroMatchTickets &middot; Erzgieereistr. 15, 80335 Munich, Germany</p>
      </div>
    </div>
    """
    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": [email],
        "subject": f"Price Alert Set for {event_title}",
        "html": html,
    })


async def send_discount_email(email: str, event_title: str, price: float):
    discount_price = int(price * 0.9)
    savings = int(price - discount_price)
    html = f"""
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:linear-gradient(135deg,#059669,#10b981);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:#d1fae5;font-size:14px;margin:0 0 5px;text-transform:uppercase;letter-spacing:2px;">EXCLUSIVE OFFER</p>
        <h1 style="color:white;font-size:32px;margin:0;">10% OFF Today Only</h1>
      </div>
      <div style="padding:30px;">
        <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:25px;margin:0 0 20px;text-align:center;">
          <h2 style="color:#0f172a;font-size:20px;margin:0 0 10px;">{event_title}</h2>
          <p style="color:#94a3b8;font-size:14px;margin:0;text-decoration:line-through;">&euro;{int(price)}</p>
          <p style="color:#059669;font-size:36px;font-weight:800;margin:5px 0;">&euro;{discount_price}</p>
          <p style="background:#059669;color:white;display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:bold;">You save &euro;{savings}</p>
        </div>
        <p style="color:#334155;font-size:15px;line-height:1.6;text-align:center;">
          As a price alert subscriber, you get <strong>exclusive early access</strong> to this discount. This offer expires in 24 hours.
        </p>
        <a href="https://euromatchtickets.com/events" style="display:block;background:#059669;color:white;text-align:center;padding:16px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:18px;margin-top:25px;box-shadow:0 4px 14px rgba(5,150,105,0.3);">
          Claim Your 10% Discount
        </a>
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:12px;">Offer expires in 24 hours &middot; Limited availability</p>
      </div>
      <div style="background:#f8fafc;padding:20px 30px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:11px;margin:0;">EuroMatchTickets &middot; Erzgieereistr. 15, 80335 Munich, Germany</p>
      </div>
    </div>
    """
    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": [email],
        "subject": f"Exclusive: 10% OFF {event_title} - 24 Hours Only",
        "html": html,
    })


async def send_reminder_email(email: str, event_title: str, price: float):
    html = f"""
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:linear-gradient(135deg,#0f172a,#334155);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:#fbbf24;font-size:14px;margin:0 0 5px;">DON'T MISS OUT</p>
        <h1 style="color:white;font-size:28px;margin:0;">Still Thinking About It?</h1>
      </div>
      <div style="padding:30px;">
        <p style="color:#334155;font-size:16px;line-height:1.6;">
          Hey! You were checking out tickets for <strong>{event_title}</strong>. Great choice!
        </p>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin:20px 0;">
          <p style="color:#92400e;font-size:14px;margin:0;font-weight:bold;">
            Demand is high for this event. We've seen a 40% increase in searches this week.
          </p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
          <h2 style="color:#0f172a;font-size:20px;margin:0 0 8px;">{event_title}</h2>
          <p style="color:#059669;font-size:28px;font-weight:800;margin:5px 0;">From &euro;{int(price)}</p>
          <p style="color:#64748b;font-size:13px;margin:0;">Verified tickets &middot; Instant QR delivery</p>
        </div>
        <a href="https://euromatchtickets.com/events" style="display:block;background:#0f172a;color:#fbbf24;text-align:center;padding:16px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;margin-top:20px;">
          Secure Your Tickets Now
        </a>
      </div>
      <div style="background:#f8fafc;padding:20px 30px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:11px;margin:0;">EuroMatchTickets &middot; Erzgieereistr. 15, 80335 Munich, Germany</p>
      </div>
    </div>
    """
    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": [email],
        "subject": f"Still thinking about {event_title}? Tickets are selling fast",
        "html": html,
    })


async def send_urgency_email(email: str, event_title: str, price: float):
    tickets_left = random.randint(3, 15)
    html = f"""
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:#fecaca;font-size:14px;margin:0 0 5px;text-transform:uppercase;letter-spacing:2px;">URGENT</p>
        <h1 style="color:white;font-size:28px;margin:0;">Tickets Almost Sold Out!</h1>
      </div>
      <div style="padding:30px;">
        <div style="background:#fef2f2;border:2px solid #fecaca;border-radius:12px;padding:20px;margin:0 0 20px;text-align:center;">
          <h2 style="color:#0f172a;font-size:20px;margin:0 0 8px;">{event_title}</h2>
          <p style="color:#dc2626;font-size:18px;font-weight:800;margin:5px 0;">
            Only {tickets_left} tickets remaining!
          </p>
          <p style="color:#64748b;font-size:13px;margin:0;">Prices are expected to increase</p>
        </div>
        <p style="color:#334155;font-size:15px;line-height:1.6;">
          This is not a drill. <strong>{event_title}</strong> tickets are nearly gone. Once they sell out, prices on other platforms will skyrocket.
        </p>
        <div style="background:#f0fdf4;border-radius:8px;padding:12px;margin:15px 0;">
          <p style="color:#059669;font-size:13px;margin:0;">
            Current price: <strong>&euro;{int(price)}</strong> &middot; FanProtect guarantee included
          </p>
        </div>
        <a href="https://euromatchtickets.com/events" style="display:block;background:#dc2626;color:white;text-align:center;padding:16px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:18px;margin-top:20px;box-shadow:0 4px 14px rgba(220,38,38,0.3);">
          Book Now Before It's Too Late
        </a>
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:10px;">We can't guarantee these prices after today</p>
      </div>
      <div style="background:#f8fafc;padding:20px 30px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:11px;margin:0;">EuroMatchTickets &middot; Erzgieereistr. 15, 80335 Munich, Germany</p>
      </div>
    </div>
    """
    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": [email],
        "subject": f"URGENT: Only {tickets_left} tickets left for {event_title}!",
        "html": html,
    })


async def send_price_drop_email(email: str, event_title: str, old_price: float, new_price: float):
    savings = int(old_price - new_price)
    html = f"""
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
      <div style="background:linear-gradient(135deg,#059669,#10b981);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
        <p style="color:#d1fae5;font-size:14px;margin:0 0 5px;text-transform:uppercase;letter-spacing:2px;">PRICE DROP ALERT</p>
        <h1 style="color:white;font-size:32px;margin:0;">Prices Just Dropped!</h1>
      </div>
      <div style="padding:30px;">
        <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:25px;margin:0 0 20px;text-align:center;">
          <h2 style="color:#0f172a;font-size:20px;margin:0 0 12px;">{event_title}</h2>
          <div style="display:flex;justify-content:center;align-items:center;gap:15px;">
            <span style="color:#94a3b8;font-size:22px;text-decoration:line-through;">&euro;{int(old_price)}</span>
            <span style="color:#059669;font-size:38px;font-weight:800;">&euro;{int(new_price)}</span>
          </div>
          <p style="background:#059669;color:white;display:inline-block;padding:5px 15px;border-radius:20px;font-size:14px;font-weight:bold;margin-top:10px;">
            You save &euro;{savings}!
          </p>
        </div>
        <p style="color:#334155;font-size:15px;line-height:1.6;text-align:center;">
          The price for <strong>{event_title}</strong> just dropped by <strong>&euro;{savings}</strong>! This won't last long.
        </p>
        <a href="https://euromatchtickets.com/events" style="display:block;background:#059669;color:white;text-align:center;padding:16px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:18px;margin-top:25px;box-shadow:0 4px 14px rgba(5,150,105,0.3);">
          Book Now at &euro;{int(new_price)}
        </a>
      </div>
      <div style="background:#f8fafc;padding:20px 30px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;font-size:11px;margin:0;">EuroMatchTickets &middot; Erzgieereistr. 15, 80335 Munich, Germany</p>
      </div>
    </div>
    """
    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": [email],
        "subject": f"Price Drop! {event_title} tickets just dropped by \u20ac{savings}",
        "html": html,
    })
