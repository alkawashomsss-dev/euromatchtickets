"""
Email Automation Routes - Price Drop Alert Email Flow
Day 0: Welcome / Alert Active
Day 1: Tickets Selling Fast
Day 2: Price Increased
Day 3: Last Chance
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
import asyncio
import os
import resend
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

# Resend setup
resend.api_key = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "tickets@euromatchtickets.com")
BASE_URL = "https://euromatchtickets.com"

# MongoDB will be set from server.py
db = None

def set_db(database):
    global db
    db = database


def build_email_html(subject_line, headline, body_lines, cta_text, cta_url, event_name, unsubscribe_url):
    """Build a professional HTML email with inline CSS."""
    body_html = ""
    for line in body_lines:
        body_html += f'<p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">{line}</p>'

    return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

<!-- Header -->
<tr><td style="background-color:#0f172a;padding:24px 32px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">EuroMatchTickets</h1>
<p style="margin:4px 0 0;color:#94a3b8;font-size:12px;">Europe's Cheapest Ticket Marketplace</p>
</td></tr>

<!-- Event Badge -->
<tr><td style="padding:24px 32px 0;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:12px 16px;">
<p style="margin:0;color:#065f46;font-size:13px;font-weight:600;">&#127903; {event_name}</p>
</td></tr>
</table>
</td></tr>

<!-- Headline -->
<tr><td style="padding:20px 32px 0;">
<h2 style="margin:0;color:#111827;font-size:22px;font-weight:700;line-height:1.3;">{headline}</h2>
</td></tr>

<!-- Body -->
<tr><td style="padding:16px 32px 0;">
{body_html}
</td></tr>

<!-- CTA Button -->
<tr><td style="padding:20px 32px;">
<table cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="background-color:#059669;border-radius:8px;">
<a href="{cta_url}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
{cta_text} &rarr;
</a>
</td></tr>
</table>
</td></tr>

<!-- Trust Row -->
<tr><td style="padding:0 32px 20px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;padding:12px;">
<tr>
<td style="text-align:center;padding:4px;"><span style="color:#6b7280;font-size:11px;">&#10003; 100% Verified</span></td>
<td style="text-align:center;padding:4px;"><span style="color:#6b7280;font-size:11px;">&#10003; Instant QR Delivery</span></td>
<td style="text-align:center;padding:4px;"><span style="color:#6b7280;font-size:11px;">&#10003; Money-Back Guarantee</span></td>
</tr>
</table>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#f8fafc;padding:16px 32px;border-top:1px solid #e5e7eb;">
<p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
You received this email because you subscribed to price alerts on EuroMatchTickets.<br>
<a href="{unsubscribe_url}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


# Email templates for each day
EMAIL_TEMPLATES = {
    0: {
        "subject": "Your ticket alert is active \U0001F3AB",
        "headline": "You're all set! \U0001F514",
        "body": [
            "We'll notify you instantly when ticket prices drop for <strong>{event_name}</strong>.",
            "\u26a0\ufe0f Prices are already increasing due to high demand.",
            "\U0001F3AB Prices usually increase as availability drops. Booking earlier gives you better prices.",
        ],
        "cta": "View Tickets",
    },
    1: {
        "subject": "Tickets are selling fast \u26a0\ufe0f",
        "headline": "Demand is rising quickly",
        "body": [
            "Tickets for <strong>{event_name}</strong> are selling fast and some sections are almost sold out.",
            "\U0001F3AB Prices usually increase as availability drops.",
            "\U0001F449 Secure your ticket now before prices go higher.",
        ],
        "cta": "Secure Your Ticket Now",
    },
    2: {
        "subject": "Price update: Tickets increased \U0001F4C8",
        "headline": "Ticket prices have increased",
        "body": [
            "Due to high demand, prices for <strong>{event_name}</strong> have increased.",
            "\U0001F4A1 Booking earlier always gives you better prices.",
            "\U0001F449 Check the updated prices and availability before they go higher.",
        ],
        "cta": "Check Updated Prices",
    },
    3: {
        "subject": "Last chance for best prices \u23f3",
        "headline": "This is your last chance",
        "body": [
            "Availability for <strong>{event_name}</strong> is now very limited and may sell out soon.",
            "\U0001F3AB This is your last chance before prices go even higher.",
            "\U0001F525 Don't miss out \u2013 once they're gone, they're gone.",
        ],
        "cta": "View Remaining Tickets",
    },
}


async def send_single_email(to_email, event_name, event_slug, day):
    """Send a single drip email for a specific day."""
    template = EMAIL_TEMPLATES.get(day)
    if not template:
        return False

    event_url = f"{BASE_URL}/{event_slug}"
    unsubscribe_url = f"{BASE_URL}/api/emails/unsubscribe?email={to_email}&slug={event_slug}"

    subject = template["subject"].replace("{event_name}", event_name)
    headline = template["headline"]
    body = [line.replace("{event_name}", event_name) for line in template["body"]]
    cta = template["cta"]

    html = build_email_html(subject, headline, body, cta, event_url, event_name, unsubscribe_url)

    try:
        params = {
            "from": f"EuroMatchTickets <{SENDER_EMAIL}>",
            "to": [to_email],
            "subject": subject,
            "html": html,
            "headers": {
                "X-Entity-Ref-ID": f"{event_slug}-day{day}-{to_email}",
            },
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        email_id = result.get("id") if isinstance(result, dict) else getattr(result, "id", None)
        logger.info(f"Email sent: day={day}, to={to_email}, event={event_slug}, id={email_id}")
        return email_id
    except Exception as e:
        logger.error(f"Email send failed: day={day}, to={to_email}, error={str(e)}")
        return None


@router.post("/emails/send-welcome")
async def send_welcome_email(email: str, event_slug: str, event_name: str):
    """Send Day 0 welcome email immediately after subscription."""
    email_id = await send_single_email(email, event_name, event_slug, day=0)
    if email_id:
        # Record email sent
        await db.email_log.insert_one({
            "email": email,
            "event_slug": event_slug,
            "event_name": event_name,
            "day": 0,
            "email_id": email_id,
            "sent_at": datetime.now(timezone.utc).isoformat(),
            "status": "sent",
        })
        return {"status": "sent", "email_id": email_id}
    raise HTTPException(status_code=500, detail="Failed to send email")


@router.post("/emails/process-drip")
async def process_drip_emails():
    """Process all pending drip emails. Run this via cron or manual trigger."""
    now = datetime.now(timezone.utc)
    results = {"day_1": 0, "day_2": 0, "day_3": 0, "errors": 0, "skipped": 0}

    # Get all active subscribers
    subscribers = []
    async for sub in db.price_alerts.find({"active": True}, {"_id": 0}):
        subscribers.append(sub)

    for sub in subscribers:
        email = sub.get("email")
        event_slug = sub.get("event_slug")
        event_name = sub.get("event_name", "Event Tickets")
        subscribed_at = sub.get("subscribed_at")

        if not email or not event_slug or not subscribed_at:
            results["skipped"] += 1
            continue

        try:
            sub_time = datetime.fromisoformat(subscribed_at.replace("Z", "+00:00"))
        except (ValueError, TypeError):
            results["skipped"] += 1
            continue

        days_since = (now - sub_time).days

        # Determine which day email to send
        for day in [1, 2, 3]:
            if days_since >= day:
                # Check if already sent for this day
                already_sent = await db.email_log.find_one({
                    "email": email,
                    "event_slug": event_slug,
                    "day": day,
                })
                if already_sent:
                    continue

                # Send email
                email_id = await send_single_email(email, event_name, event_slug, day)
                if email_id:
                    await db.email_log.insert_one({
                        "email": email,
                        "event_slug": event_slug,
                        "event_name": event_name,
                        "day": day,
                        "email_id": email_id,
                        "sent_at": now.isoformat(),
                        "status": "sent",
                    })
                    results[f"day_{day}"] += 1
                else:
                    results["errors"] += 1

    return {"status": "processed", "results": results, "total_subscribers": len(subscribers)}


@router.get("/emails/stats")
async def get_email_stats():
    """Get email sending statistics."""
    total_sent = await db.email_log.count_documents({})

    # Breakdown by day
    pipeline = [
        {"$group": {"_id": "$day", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    day_breakdown = {}
    async for doc in db.email_log.aggregate(pipeline):
        day_breakdown[f"day_{doc['_id']}"] = doc["count"]

    # Recent emails
    recent = []
    async for doc in db.email_log.find({}, {"_id": 0}).sort("sent_at", -1).limit(10):
        recent.append(doc)

    total_subs = await db.price_alerts.count_documents({"active": True})

    return {
        "total_emails_sent": total_sent,
        "total_active_subscribers": total_subs,
        "breakdown": day_breakdown,
        "recent_emails": recent,
    }


@router.get("/emails/unsubscribe")
async def unsubscribe(email: str, slug: str = ""):
    """Unsubscribe from price alerts."""
    email = email.strip().lower()
    if slug:
        await db.price_alerts.update_one(
            {"email": email, "event_slug": slug},
            {"$set": {"active": False}}
        )
    else:
        await db.price_alerts.update_many(
            {"email": email},
            {"$set": {"active": False}}
        )
    return {"status": "unsubscribed", "message": "You have been unsubscribed from price alerts."}
