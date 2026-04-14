from fastapi import APIRouter, HTTPException, Request
from typing import Optional
from datetime import datetime, timezone
import logging
import re

from database.db import db
from models.schemas import Event, EventCreate
from utils.helpers import require_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


def generate_event_slug(title: str, event_type: str, city: str, event_date: str) -> str:
    """Generate SEO-friendly slug from event details."""
    year = ""
    if event_date:
        try:
            year = str(datetime.fromisoformat(event_date.replace('Z', '+00:00')).year)
        except Exception:
            year = "2026"
    
    type_prefix = {"f1": "f1", "motogp": "motogp", "concert": "", "match": "", "worldcup": "world-cup"}.get(event_type, "")
    
    parts = []
    if type_prefix:
        parts.append(type_prefix)
    
    # Clean title
    clean_title = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    clean_title = re.sub(r'\s+', '-', clean_title.strip())
    parts.append(clean_title)
    
    if city and city.lower() not in clean_title:
        parts.append(re.sub(r'[^a-z0-9]', '-', city.lower()))
    if year and year not in clean_title:
        parts.append(year)
    parts.append("tickets")
    
    slug = '-'.join(parts)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug


@router.get("/events")
async def get_events(
    event_type: Optional[str] = None, league: Optional[str] = None,
    genre: Optional[str] = None, city: Optional[str] = None,
    country: Optional[str] = None, date_from: Optional[str] = None,
    date_to: Optional[str] = None, featured: Optional[bool] = None,
    search: Optional[str] = None, limit: Optional[int] = 100
):
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    query = {"status": {"$nin": ["cancelled", "past_event", "expired"]}, "event_date": {"$gte": today}}
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
        query["event_date"]["$gte"] = date_from
    if date_to:
        query["event_date"]["$lte"] = date_to
    if search:
        words = [w for w in search.strip().split() if len(w) >= 2]
        field_list = ["title", "artist", "home_team", "away_team", "venue", "city", "event_type", "league", "subtitle"]
        if len(words) > 1:
            # Each word must appear in at least one field (AND logic)
            word_conditions = []
            for word in words:
                word_conditions.append({"$or": [{f: {"$regex": word, "$options": "i"}} for f in field_list]})
            strict_query = {**query, "$and": word_conditions}
            # Try strict AND first
            strict_results = await db.events.find(strict_query, {"_id": 0, "description": 0}).sort("event_date", 1).limit(min(limit, 200)).to_list(min(limit, 200))
            if strict_results:
                events_raw = strict_results
            else:
                # Fallback: any word matches (OR)
                query["$or"] = [{f: {"$regex": word, "$options": "i"}} for word in words for f in field_list]
                events_raw = None
        else:
            query["$or"] = [{f: {"$regex": search, "$options": "i"}} for f in field_list]
            events_raw = None
    else:
        events_raw = None

    # Lightweight projection for list views
    projection = {"_id": 0, "description": 0}

    if events_raw is None:
        events = await db.events.find(query, projection).sort("event_date", 1).limit(min(limit, 200)).to_list(min(limit, 200))
    else:
        events = events_raw

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
async def get_event(event_id: str, request: Request):
    from fastapi.responses import RedirectResponse
    # Try by event_id first, then by slug
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        event = await db.events.find_one({"slug": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # If accessed by ugly event_id and has a slug, return slug info for client redirect
    slug = event.get("slug")
    if slug and event_id != slug and event_id == event.get("event_id"):
        event["_redirect_to_slug"] = slug

    eid = event["event_id"]
    tickets = await db.tickets.find({"event_id": eid, "status": "available"}, {"_id": 0}).to_list(500)
    event["tickets"] = tickets
    event["ticket_count"] = len(tickets)

    # Group by category
    categories = {}
    for ticket in tickets:
        cat = ticket.get("category", ticket.get("section", "General"))
        if cat not in categories:
            categories[cat] = {"count": 0, "lowest_price": float('inf')}
        categories[cat]["count"] += 1
        if ticket["price"] < categories[cat]["lowest_price"]:
            categories[cat]["lowest_price"] = ticket["price"]
    event["categories"] = categories

    # Group by section for StubHub-style display
    sections = {}
    for ticket in tickets:
        section = ticket.get("section", "General")
        cat = ticket.get("category", "standard")
        key = f"{cat}|{section}"
        if key not in sections:
            sections[key] = {
                "category": cat,
                "section": section,
                "count": 0,
                "lowest_price": float('inf'),
                "highest_price": 0,
                "tickets": []
            }
        sections[key]["count"] += 1
        p = ticket["price"]
        if p < sections[key]["lowest_price"]:
            sections[key]["lowest_price"] = p
        if p > sections[key]["highest_price"]:
            sections[key]["highest_price"] = p
        sections[key]["tickets"].append({
            "ticket_id": ticket["ticket_id"],
            "price": ticket["price"],
            "section": section,
            "category": cat,
            "currency": ticket.get("currency", "EUR"),
        })

    # Sort sections by price and convert to list
    section_list = sorted(sections.values(), key=lambda s: s["lowest_price"])
    event["grouped_sections"] = section_list

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



@router.post("/events/generate-slugs")
async def generate_all_slugs():
    """Generate SEO-friendly slugs for all events that don't have one."""
    events = await db.events.find(
        {"slug": {"$exists": False}},
        {"_id": 0, "event_id": 1, "title": 1, "event_type": 1, "city": 1, "event_date": 1}
    ).to_list(500)
    
    existing_slugs = set()
    # Get all existing slugs to avoid duplicates
    existing = await db.events.find({"slug": {"$exists": True}}, {"_id": 0, "slug": 1}).to_list(500)
    existing_slugs = {e["slug"] for e in existing}
    
    generated = 0
    for event in events:
        slug = generate_event_slug(
            event.get("title", ""),
            event.get("event_type", ""),
            event.get("city", ""),
            event.get("event_date", "")
        )
        # Ensure uniqueness
        base_slug = slug
        counter = 1
        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        existing_slugs.add(slug)
        await db.events.update_one(
            {"event_id": event["event_id"]},
            {"$set": {"slug": slug}}
        )
        generated += 1
    
    return {"generated": generated, "total_events": len(events) + len(existing)}


@router.get("/events/resolve/{slug_or_id}")
async def resolve_event(slug_or_id: str):
    """Resolve an event by slug or event_id, return the canonical info."""
    event = await db.events.find_one(
        {"$or": [{"event_id": slug_or_id}, {"slug": slug_or_id}]},
        {"_id": 0, "event_id": 1, "slug": 1, "title": 1}
    )
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/events/cleanup-duplicates")
async def cleanup_duplicates():
    """Remove duplicate events keeping the one with most tickets or best slug.
    Also fixes event dates with script-generated timestamps."""
    from collections import defaultdict
    
    events = await db.events.find({}, {"_id": 1, "event_id": 1, "title": 1, "slug": 1, "event_type": 1, "event_date": 1}).to_list(1000)
    
    # Group by normalized title
    groups = defaultdict(list)
    for e in events:
        title = (e.get("title") or "").strip().lower()
        key = title.replace(" - ", " ").replace("2026", "").replace("2027", "").strip()
        groups[key].append(e)
    
    deleted_ids = []
    for key, group in groups.items():
        if len(group) <= 1:
            continue
        # Keep the one with cleanest slug (shortest, has dashes, no ugly IDs)
        def score(e):
            slug = e.get("slug", "")
            eid = e.get("event_id", "")
            s = 0
            if slug and "-" in slug:
                s += 10
            if "event_" in eid or "premium_" in eid:
                s -= 5
            # Prefer shorter slugs
            s -= len(slug) / 100
            # Check tickets count
            return s
        
        group.sort(key=score, reverse=True)
        keep = group[0]
        for dup in group[1:]:
            deleted_ids.append(dup["_id"])
    
    # Delete duplicates
    deleted_count = 0
    for _id in deleted_ids:
        result = await db.events.delete_one({"_id": _id})
        deleted_count += result.deleted_count
    
    # Fix script-generated timestamps
    type_times = {
        "f1": "14:00:00Z", "motogp": "14:00:00Z",
        "match": "21:00:00Z", "football": "21:00:00Z",
        "concert": "20:00:00Z", "festival": "12:00:00Z",
        "tennis": "11:00:00Z", "attraction": "10:00:00Z",
        "worldcup": "21:00:00Z",
    }
    
    all_events = await db.events.find({}, {"_id": 1, "event_date": 1, "event_type": 1}).to_list(1000)
    fixed_dates = 0
    for e in all_events:
        d = str(e.get("event_date", ""))
        needs_fix = any(bad in d for bad in ["T05:32", "T09:55", "T22:20", "T06:", "T18:21"])
        if needs_fix:
            date_part = d.split("T")[0]
            time_part = type_times.get(e.get("event_type", "match"), "20:00:00Z")
            new_date = f"{date_part}T{time_part}"
            await db.events.update_one({"_id": e["_id"]}, {"$set": {"event_date": new_date}})
            fixed_dates += 1
        elif d and "T" not in d and len(d) == 10:
            time_part = type_times.get(e.get("event_type", "match"), "20:00:00Z")
            await db.events.update_one({"_id": e["_id"]}, {"$set": {"event_date": f"{d}T{time_part}"}})
            fixed_dates += 1
    
    remaining = await db.events.count_documents({})
    return {
        "deleted_duplicates": deleted_count,
        "fixed_dates": fixed_dates,
        "remaining_events": remaining
    }


@router.post("/events/seed-justin-bieber")
async def seed_justin_bieber():
    """Seed Justin Bieber Amsterdam event + tickets for production."""
    import random
    
    event = {
        "event_id": "justin_bieber_amsterdam_2026",
        "title": "Justin Bieber World Tour 2026",
        "artist": "Justin Bieber",
        "event_type": "concert",
        "venue": "Johan Cruijff ArenA",
        "city": "Amsterdam",
        "country": "Netherlands",
        "event_date": "2026-07-18T20:00:00Z",
        "slug": "justin-bieber-amsterdam-2026-tickets",
        "subtitle": "Justin Bieber Live in Amsterdam - World Tour 2026",
        "genre": "Pop",
        "status": "active",
        "featured": True,
        "price_from": 89,
        "price_to": 2499,
        "currency": "EUR",
        "image_url": "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1200",
        "capacity": 55000,
        "tickets_available": 847,
        "home_team": "",
        "away_team": "",
        "league": "",
    }
    
    await db.events.update_one(
        {"slug": "justin-bieber-amsterdam-2026-tickets"},
        {"$set": event},
        upsert=True
    )
    
    # Check if tickets exist
    existing_tickets = await db.tickets.count_documents({"event_id": "justin_bieber_amsterdam_2026"})
    if existing_tickets > 0:
        return {"event": "upserted", "tickets": existing_tickets, "message": "Tickets already exist"}
    
    sections = [
        ("Upper Tier (Cat 3)", 89, 109, 120),
        ("Lower Tier (Cat 2)", 129, 159, 80),
        ("Floor Standing", 149, 189, 60),
        ("Lower Tier Front (Cat 1)", 189, 229, 40),
        ("Golden Circle", 289, 349, 20),
        ("Premium Floor (Early Entry)", 219, 269, 30),
        ("VIP Hospitality", 689, 799, 12),
        ("Meet & Greet VIP", 2499, 2999, 4),
    ]
    
    tickets = []
    for section, price_low, price_high, count in sections:
        for i in range(count):
            tickets.append({
                "ticket_id": f"jb_ams_{section.lower().replace(' ','_').replace('(','').replace(')','').replace('.','')[:20]}_{i}",
                "event_id": "justin_bieber_amsterdam_2026",
                "section": section,
                "category": section,
                "row": str(random.randint(1, 30)),
                "seat": str(random.randint(1, 50)),
                "price": round(random.uniform(price_low, price_high), 2),
                "currency": "EUR",
                "status": "available",
                "seller_id": "euromatch_official",
            })
    
    result = await db.tickets.insert_many(tickets)
    return {"event": "upserted", "tickets_created": len(result.inserted_ids)}
