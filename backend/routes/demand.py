"""
Demand Engine Routes
====================
Powers Most-Wanted, City Demand, and Artist Authority pages.

Reads from:
  - events        (confirmed, upcoming tickets we actually sell)
  - event_demand  (aggregated lead counts per slug)
  - event_leads   (raw lead capture records — admin only)

Endpoints:
  GET /api/demand/most-wanted?limit=20
  GET /api/demand/by-city?city=amsterdam
  GET /api/demand/by-artist?artist=justin-bieber
"""

import re
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Query, HTTPException

from database.db import db

router = APIRouter(prefix="/api/demand", tags=["demand"])


SAFE_STR = re.compile(r"^[a-z0-9\- ]{1,80}$", re.IGNORECASE)


def _clean_event(ev: dict) -> dict:
    """Remove Mongo _id and normalize event rows for public API."""
    ev.pop("_id", None)
    return ev


@router.get("/most-wanted")
async def most_wanted(limit: int = Query(20, ge=1, le=100)):
    """
    Return the top-N most-wanted speculative events, ranked by lead_count.
    Also returns a bucket of CONFIRMED events (from the `events` collection)
    so the frontend can blend them into a single "Buy now vs join notify"
    ranked list.
    """
    demand_cursor = (
        db.event_demand
        .find({}, {"_id": 0})
        .sort([("lead_count", -1), ("last_signal_at", -1)])
        .limit(limit)
    )
    demand_rows = await demand_cursor.to_list(length=limit)

    # Enrich each demand row with total lead count and friendly metadata.
    for row in demand_rows:
        row["status"] = "coming_soon"
        # Best-effort city/artist/event_name fall-back from slug
        if not row.get("artist"):
            slug = row.get("event_slug", "")
            row["artist"] = slug.replace("-", " ").title()[:60]

    # Also fetch top confirmed events so the list isn't empty when demand
    # data is still small.
    today = datetime.now(timezone.utc).isoformat()
    confirmed_cursor = (
        db.events
        .find(
            {"event_date": {"$gte": today}, "status": {"$nin": ["past_event", "expired", "cancelled"]}},
            {
                "_id": 0, "slug": 1, "event_id": 1, "title": 1,
                "city": 1, "venue": 1, "event_date": 1, "event_type": 1,
                "price_from": 1, "image_url": 1, "artist": 1,
            },
        )
        .sort("event_date", 1)
        .limit(limit)
    )
    confirmed_rows = await confirmed_cursor.to_list(length=limit)
    for r in confirmed_rows:
        r["status"] = "confirmed"
        r["href"] = f"/event/{r.get('slug') or r.get('event_id')}"

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "coming_soon": demand_rows,
        "confirmed": confirmed_rows,
        "total_leads_tracked": sum(r.get("lead_count", 0) for r in demand_rows),
    }


@router.get("/by-city")
async def by_city(city: str = Query(..., min_length=2, max_length=60)):
    """
    Return all confirmed events in a city (upcoming) + aggregated lead
    demand rows that mention the same city. Used by City Demand pages
    like `/concerts-in-amsterdam-2026`.
    """
    if not SAFE_STR.match(city):
        raise HTTPException(status_code=400, detail="invalid_city")

    city_lc = city.strip().lower()
    today = datetime.now(timezone.utc).isoformat()

    confirmed = await (
        db.events.find(
            {
                "city": {"$regex": f"^{re.escape(city_lc)}$", "$options": "i"},
                "event_date": {"$gte": today},
                "status": {"$nin": ["past_event", "expired", "cancelled"]},
            },
            {
                "_id": 0, "slug": 1, "event_id": 1, "title": 1, "subtitle": 1,
                "city": 1, "venue": 1, "event_date": 1, "event_type": 1,
                "price_from": 1, "image_url": 1, "artist": 1,
            },
        )
        .sort("event_date", 1)
        .limit(60)
        .to_list(length=60)
    )
    for e in confirmed:
        e["href"] = f"/event/{e.get('slug') or e.get('event_id')}"

    demand = await (
        db.event_demand.find(
            {"city": {"$regex": f"^{re.escape(city_lc)}$", "$options": "i"}},
            {"_id": 0},
        )
        .sort("lead_count", -1)
        .limit(30)
        .to_list(length=30)
    )

    return {
        "city": city_lc,
        "confirmed_count": len(confirmed),
        "demand_count": len(demand),
        "confirmed": confirmed,
        "coming_soon": demand,
    }


@router.get("/by-artist")
async def by_artist(artist: str = Query(..., min_length=2, max_length=80)):
    """Return confirmed events for an artist + their demand signal."""
    if not SAFE_STR.match(artist):
        raise HTTPException(status_code=400, detail="invalid_artist")

    artist_lc = artist.strip().lower()
    today = datetime.now(timezone.utc).isoformat()

    confirmed = await (
        db.events.find(
            {
                "$or": [
                    {"artist": {"$regex": re.escape(artist_lc), "$options": "i"}},
                    {"title": {"$regex": re.escape(artist_lc), "$options": "i"}},
                ],
                "event_date": {"$gte": today},
                "status": {"$nin": ["past_event", "expired", "cancelled"]},
            },
            {
                "_id": 0, "slug": 1, "event_id": 1, "title": 1, "subtitle": 1,
                "city": 1, "venue": 1, "event_date": 1, "event_type": 1,
                "price_from": 1, "image_url": 1, "artist": 1,
            },
        )
        .sort("event_date", 1)
        .limit(40)
        .to_list(length=40)
    )
    for e in confirmed:
        e["href"] = f"/event/{e.get('slug') or e.get('event_id')}"

    demand = await (
        db.event_demand.find(
            {"artist": {"$regex": re.escape(artist_lc), "$options": "i"}},
            {"_id": 0},
        )
        .sort("lead_count", -1)
        .limit(20)
        .to_list(length=20)
    )

    return {
        "artist": artist_lc,
        "confirmed": confirmed,
        "coming_soon": demand,
    }
