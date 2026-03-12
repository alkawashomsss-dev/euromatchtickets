from fastapi import APIRouter, HTTPException, Request
from typing import Optional
from datetime import datetime, timezone
import logging

from database.db import db
from models.schemas import Event, EventCreate
from utils.helpers import require_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.get("/events")
async def get_events(
    event_type: Optional[str] = None, league: Optional[str] = None,
    genre: Optional[str] = None, city: Optional[str] = None,
    country: Optional[str] = None, date_from: Optional[str] = None,
    date_to: Optional[str] = None, featured: Optional[bool] = None,
    search: Optional[str] = None
):
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

    if events:
        event_ids = [e["event_id"] for e in events]
        pipeline = [
            {"$match": {"event_id": {"$in": event_ids}, "status": "available"}},
            {"$group": {"_id": "$event_id", "ticket_count": {"$sum": 1}, "lowest_price": {"$min": "$price"}}}
        ]
        ticket_stats = await db.tickets.aggregate(pipeline).to_list(None)
        stats_map = {s["_id"]: s for s in ticket_stats}
        for event in events:
            stats = stats_map.get(event["event_id"], {})
            event["available_tickets"] = stats.get("ticket_count", 0)
            event["lowest_price"] = stats.get("lowest_price")

    return events


@router.get("/events/{event_id}")
async def get_event(event_id: str):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    tickets = await db.tickets.find({"event_id": event_id, "status": "available"}, {"_id": 0}).to_list(500)
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


@router.post("/events")
async def create_event(event_data: EventCreate, request: Request):
    user = await require_admin(request)
    event = Event(**event_data.model_dump())
    event_doc = event.model_dump()
    event_doc['event_date'] = event_doc['event_date'].isoformat()
    event_doc['created_at'] = event_doc['created_at'].isoformat()
    await db.events.insert_one(event_doc)
    return {"success": True, "event_id": event.event_id}


@router.put("/events/{event_id}")
async def update_event(event_id: str, event_data: dict, request: Request):
    user = await require_admin(request)
    if "event_date" in event_data and isinstance(event_data["event_date"], datetime):
        event_data["event_date"] = event_data["event_date"].isoformat()
    result = await db.events.update_one({"event_id": event_id}, {"$set": event_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"success": True}


@router.delete("/events/{event_id}")
async def delete_event(event_id: str, request: Request):
    user = await require_admin(request)
    result = await db.events.delete_one({"event_id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"success": True}
