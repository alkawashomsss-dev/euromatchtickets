"""
Lead Capture Routes
===================
Handles email capture for "Coming Soon" / unconfirmed artist pages.
Stores each signup in `event_leads` collection + logs demand signal.

Endpoints:
  POST /api/leads/capture  → save email for an upcoming/unconfirmed event
  GET  /api/leads/count    → public count of leads for a given slug (social proof)
  GET  /api/leads/demand   → (admin) aggregated demand report
"""

import re
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr, Field

from database.db import db

router = APIRouter(prefix="/api/leads", tags=["leads"])


class LeadCaptureIn(BaseModel):
    email: EmailStr
    event_slug: str = Field(..., min_length=1, max_length=200)
    event_name: Optional[str] = Field(default=None, max_length=200)
    artist: Optional[str] = Field(default=None, max_length=120)
    city: Optional[str] = Field(default=None, max_length=120)
    source: Optional[str] = Field(default="coming_soon", max_length=60)


EVENT_SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9\-_/]{0,199}$", re.IGNORECASE)


@router.post("/capture")
async def capture_lead(payload: LeadCaptureIn, request: Request):
    if not EVENT_SLUG_RE.match(payload.event_slug):
        raise HTTPException(status_code=400, detail="invalid_slug")

    email = payload.email.lower().strip()
    slug = payload.event_slug.lower().strip().lstrip("/")

    now = datetime.now(timezone.utc)
    ip = request.client.host if request.client else ""
    ua = request.headers.get("user-agent", "")[:300]

    # Upsert one document per (email, slug) — on first-ever insert we
    # bump the aggregate demand counter, on duplicates we just refresh
    # last_seen_at / touch_count.
    lead_result = await db.event_leads.update_one(
        {"email": email, "event_slug": slug},
        {
            "$setOnInsert": {
                "email": email,
                "event_slug": slug,
                "event_name": payload.event_name,
                "artist": payload.artist,
                "city": payload.city,
                "source": payload.source or "coming_soon",
                "created_at": now,
                "ip": ip,
                "user_agent": ua,
                "status": "subscribed",
            },
            "$set": {"last_seen_at": now},
            "$inc": {"touch_count": 1},
        },
        upsert=True,
    )

    # Only increment demand lead_count on a TRUE new insert — not on
    # duplicate re-submissions by the same email.
    is_new_lead = bool(lead_result.upserted_id)

    demand_update = {
        "$setOnInsert": {
            "event_slug": slug,
            "artist": payload.artist,
            "city": payload.city,
            "first_signal_at": now,
        },
        "$set": {"last_signal_at": now},
    }
    if is_new_lead:
        demand_update["$inc"] = {"lead_count": 1}

    await db.event_demand.update_one(
        {"event_slug": slug},
        demand_update,
        upsert=True,
    )

    count = await db.event_leads.count_documents({"event_slug": slug})
    return {"status": "ok", "subscribed": True, "total_signups": count}


@router.get("/count")
async def lead_count(event_slug: str):
    slug = event_slug.lower().strip().lstrip("/")
    if not EVENT_SLUG_RE.match(slug):
        raise HTTPException(status_code=400, detail="invalid_slug")
    c = await db.event_leads.count_documents({"event_slug": slug})
    return {"event_slug": slug, "total_signups": c}


ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")


@router.get("/demand")
async def demand_report(request: Request, limit: int = 50):
    # Light auth: admin token in header
    if ADMIN_TOKEN:
        token = request.headers.get("x-admin-token", "")
        if token != ADMIN_TOKEN:
            raise HTTPException(status_code=401, detail="unauthorized")

    limit = max(1, min(int(limit or 50), 500))
    cursor = db.event_demand.find({}, {"_id": 0}).sort("lead_count", -1).limit(limit)
    rows = await cursor.to_list(length=limit)
    return {"count": len(rows), "rows": rows}
