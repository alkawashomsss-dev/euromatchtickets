"""
Seed data routes - All event/ticket seeding endpoints
Extracted from legacy server.py to keep main server clean
"""
from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timezone
import uuid
import random
import logging
import os

from database.db import db
from utils.helpers import require_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.post("/seed")
async def seed_data():
    """Quick seed with basic events"""
    events_data = [
        {"event_type": "football", "title": "Real Madrid vs Barcelona - El Clasico", "home_team": "Real Madrid", "away_team": "FC Barcelona", "league": "La Liga", "venue": "Santiago Bernabeu", "city": "Madrid", "country": "Spain", "event_date": "2026-04-15T21:00:00Z", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200", "featured": True},
        {"event_type": "football", "title": "Manchester United vs Liverpool - Premier League", "home_team": "Manchester United", "away_team": "Liverpool FC", "league": "Premier League", "venue": "Old Trafford", "city": "Manchester", "country": "UK", "event_date": "2026-04-20T16:30:00Z", "event_image": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200", "featured": True},
        {"event_type": "f1", "title": "Monaco Grand Prix 2026", "venue": "Circuit de Monaco", "city": "Monte Carlo", "country": "Monaco", "event_date": "2026-05-24T15:00:00Z", "event_image": "https://images.unsplash.com/photo-1752884991461-8ac432ad9266?w=1200", "featured": True},
        {"event_type": "concert", "title": "Taylor Swift - Eras Tour 2026", "artist": "Taylor Swift", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-15T19:00:00Z", "event_image": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200", "featured": True},
        {"event_type": "concert", "title": "Coldplay - Music of the Spheres", "artist": "Coldplay", "genre": "Alternative Rock", "venue": "Spotify Camp Nou", "city": "Barcelona", "country": "Spain", "event_date": "2026-07-10T21:00:00Z", "event_image": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200", "featured": True},
    ]

    created = 0
    for data in events_data:
        event_id = f"event_{uuid.uuid4().hex[:12]}"
        data["event_id"] = event_id
        data["status"] = "upcoming"
        data["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.events.update_one({"title": data["title"]}, {"$set": data}, upsert=True)

        cats = {"general": (50, 150), "premium": (150, 400), "vip": (400, 1200)}
        for cat, (lo, hi) in cats.items():
            for _ in range(20):
                ticket = {
                    "ticket_id": f"ticket_{uuid.uuid4().hex[:12]}",
                    "event_id": event_id, "seller_id": "seller_euromatch",
                    "seller_name": "EuroMatchTickets Official",
                    "category": cat, "section": f"Block {random.choice(['A','B','C'])}",
                    "price": round(random.uniform(lo, hi), 2),
                    "original_price": hi, "currency": "EUR",
                    "status": "available", "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.tickets.insert_one(ticket)
        created += 1
    return {"success": True, "events_created": created}


@router.post("/reseed")
async def reseed():
    """Reset and re-seed all data"""
    await db.events.delete_many({})
    await db.tickets.delete_many({})
    result = await seed_data()
    return result


@router.post("/fix-tickets-seller")
async def fix_tickets_seller():
    result = await db.tickets.update_many(
        {"$or": [{"seller_id": {"$exists": False}}, {"seller_id": None}, {"seller_id": ""}]},
        {"$set": {"seller_id": "seller_euromatch", "seller_name": "EuroMatchTickets Official"}}
    )
    return {"modified_count": result.modified_count}


@router.post("/seed-premium-events")
async def seed_premium_events():
    """Seed high-value premium events"""
    premium_events = [
        {"title": "Champions League Final 2026", "event_type": "football", "home_team": "TBD", "away_team": "TBD", "league": "Champions League", "venue": "San Siro", "city": "Milan", "country": "Italy", "event_date": "2026-05-30T21:00:00Z", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200", "base_prices": {"general": 300, "premium": 800, "vip": 2500, "hospitality": 8000}},
        {"title": "El Clasico - Real Madrid vs Barcelona", "event_type": "football", "home_team": "Real Madrid", "away_team": "FC Barcelona", "venue": "Santiago Bernabeu", "city": "Madrid", "country": "Spain", "event_date": "2026-04-15T21:00:00Z", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200", "base_prices": {"general": 250, "premium": 600, "vip": 1500, "hospitality": 5000}},
        {"title": "Monaco Grand Prix 2026", "event_type": "f1", "venue": "Circuit de Monaco", "city": "Monte Carlo", "country": "Monaco", "event_date": "2026-05-24T15:00:00Z", "event_image": "https://images.unsplash.com/photo-1752884991461-8ac432ad9266?w=1200", "base_prices": {"general": 450, "grandstand": 950, "yacht_view": 5000, "paddock_club": 25000}},
        {"title": "Las Vegas Grand Prix 2026", "event_type": "f1", "venue": "Las Vegas Strip Circuit", "city": "Las Vegas", "country": "USA", "event_date": "2026-11-22T22:00:00Z", "event_image": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200", "base_prices": {"general": 550, "grandstand": 1200, "vip_lounge": 4500, "paddock_club": 18000}},
    ]

    created_events = []
    created_tickets = 0
    for event_data in premium_events:
        event_id = f"premium_{uuid.uuid4().hex[:12]}"
        base_prices = event_data.pop("base_prices", {})
        lowest_price = min(base_prices.values()) * 0.95
        event_doc = {**event_data, "event_id": event_id, "status": "upcoming", "featured": True, "lowest_price": round(lowest_price, 2), "available_tickets": random.randint(100, 300), "high_demand": True, "created_at": datetime.now(timezone.utc).isoformat()}
        await db.events.update_one({"event_id": event_id}, {"$set": event_doc}, upsert=True)
        for category, base_price in base_prices.items():
            count = 15 if base_price > 5000 else (25 if base_price > 1000 else 40)
            for _ in range(count):
                price = round(base_price * 0.95 * random.uniform(0.95, 1.05), 2)
                await db.tickets.insert_one({"ticket_id": f"ticket_{uuid.uuid4().hex[:12]}", "event_id": event_id, "seller_id": "seller_euromatch", "seller_name": "EuroMatchTickets Official", "category": category, "section": random.choice(["Block A", "Block B", "Premium", "VIP Area"]), "price": price, "original_price": base_price, "currency": "EUR", "status": "available", "created_at": datetime.now(timezone.utc).isoformat()})
                created_tickets += 1
        created_events.append({"event_id": event_id, "title": event_data["title"]})
    return {"success": True, "events_created": len(created_events), "tickets_created": created_tickets}


@router.post("/seed-f1-2026")
async def seed_f1_2026():
    """Seed the full F1 2026 calendar"""
    f1_races = [
        {"title": "Bahrain Grand Prix 2026", "venue": "Bahrain International Circuit", "city": "Sakhir", "country": "Bahrain", "date": "2026-03-08"},
        {"title": "Saudi Arabian Grand Prix 2026", "venue": "Jeddah Corniche Circuit", "city": "Jeddah", "country": "Saudi Arabia", "date": "2026-03-22"},
        {"title": "Australian Grand Prix 2026", "venue": "Albert Park Circuit", "city": "Melbourne", "country": "Australia", "date": "2026-03-29"},
        {"title": "Japanese Grand Prix 2026", "venue": "Suzuka Circuit", "city": "Suzuka", "country": "Japan", "date": "2026-04-12"},
        {"title": "Monaco Grand Prix 2026", "venue": "Circuit de Monaco", "city": "Monte Carlo", "country": "Monaco", "date": "2026-05-24"},
        {"title": "British Grand Prix 2026", "venue": "Silverstone Circuit", "city": "Silverstone", "country": "UK", "date": "2026-07-05"},
        {"title": "Italian Grand Prix 2026", "venue": "Autodromo Nazionale Monza", "city": "Monza", "country": "Italy", "date": "2026-09-06"},
        {"title": "Singapore Grand Prix 2026", "venue": "Marina Bay Street Circuit", "city": "Singapore", "country": "Singapore", "date": "2026-10-04"},
        {"title": "Las Vegas Grand Prix 2026", "venue": "Las Vegas Strip Circuit", "city": "Las Vegas", "country": "USA", "date": "2026-11-22"},
        {"title": "Abu Dhabi Grand Prix 2026", "venue": "Yas Marina Circuit", "city": "Abu Dhabi", "country": "UAE", "date": "2026-12-06"},
    ]

    created = 0
    for race in f1_races:
        event_id = f"f1_{uuid.uuid4().hex[:12]}"
        event_doc = {"event_id": event_id, "event_type": "f1", "title": race["title"], "venue": race["venue"], "city": race["city"], "country": race["country"], "event_date": f"{race['date']}T15:00:00Z", "event_image": "https://images.unsplash.com/photo-1752884991461-8ac432ad9266?w=1200", "status": "upcoming", "featured": True, "created_at": datetime.now(timezone.utc).isoformat()}
        await db.events.update_one({"title": race["title"]}, {"$set": event_doc}, upsert=True)
        prices = {"general": (89, 150), "grandstand": (189, 350), "premium_grandstand": (349, 600), "vip": (899, 1500), "paddock_club": (2499, 4000)}
        for cat, (lo, hi) in prices.items():
            for _ in range(25):
                await db.tickets.insert_one({"ticket_id": f"ticket_{uuid.uuid4().hex[:12]}", "event_id": event_id, "seller_id": "seller_euromatch", "seller_name": "EuroMatchTickets Official", "category": cat, "section": f"Block {random.choice(['A','B','C','D'])}", "price": round(random.uniform(lo, hi), 2), "original_price": hi, "currency": "EUR", "status": "available", "created_at": datetime.now(timezone.utc).isoformat()})
        created += 1
    return {"success": True, "f1_races_created": created}


@router.post("/add-worldcup-2026")
async def add_worldcup_2026():
    """Seed World Cup 2026 events"""
    matches = [
        {"title": "FIFA World Cup 2026 Opening Match", "venue": "Estadio Azteca", "city": "Mexico City", "country": "Mexico", "date": "2026-06-11"},
        {"title": "FIFA World Cup 2026 Final", "venue": "MetLife Stadium", "city": "New York", "country": "USA", "date": "2026-07-19"},
        {"title": "FIFA World Cup 2026 Semi-Final 1", "venue": "AT&T Stadium", "city": "Dallas", "country": "USA", "date": "2026-07-14"},
        {"title": "FIFA World Cup 2026 Semi-Final 2", "venue": "Hard Rock Stadium", "city": "Miami", "country": "USA", "date": "2026-07-15"},
    ]
    created = 0
    for match in matches:
        event_id = f"wc_{uuid.uuid4().hex[:12]}"
        doc = {"event_id": event_id, "event_type": "worldcup", "title": match["title"], "venue": match["venue"], "city": match["city"], "country": match["country"], "event_date": f"{match['date']}T18:00:00Z", "event_image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200", "status": "upcoming", "featured": True, "created_at": datetime.now(timezone.utc).isoformat()}
        await db.events.update_one({"title": match["title"]}, {"$set": doc}, upsert=True)
        for cat, (lo, hi) in {"cat3": (99, 200), "cat2": (199, 400), "cat1": (349, 700), "hospitality": (999, 5000)}.items():
            for _ in range(30):
                await db.tickets.insert_one({"ticket_id": f"ticket_{uuid.uuid4().hex[:12]}", "event_id": event_id, "seller_id": "seller_euromatch", "seller_name": "EuroMatchTickets Official", "category": cat, "section": f"Section {random.choice(['A','B','C'])}", "price": round(random.uniform(lo, hi), 2), "original_price": hi, "currency": "USD", "status": "available", "created_at": datetime.now(timezone.utc).isoformat()})
        created += 1
    return {"success": True, "wc_events_created": created}


@router.post("/add-champions-league")
async def add_champions_league():
    """Seed Champions League matches"""
    matches = [
        {"title": "Bayern Munich vs Real Madrid - UCL QF", "home": "Bayern Munich", "away": "Real Madrid", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "date": "2026-04-08"},
        {"title": "PSG vs Manchester City - UCL QF", "home": "PSG", "away": "Manchester City", "venue": "Parc des Princes", "city": "Paris", "country": "France", "date": "2026-04-09"},
        {"title": "Barcelona vs Liverpool - UCL SF", "home": "FC Barcelona", "away": "Liverpool FC", "venue": "Spotify Camp Nou", "city": "Barcelona", "country": "Spain", "date": "2026-04-29"},
    ]
    created = 0
    for m in matches:
        event_id = f"ucl_{uuid.uuid4().hex[:12]}"
        doc = {"event_id": event_id, "event_type": "football", "title": m["title"], "home_team": m["home"], "away_team": m["away"], "league": "Champions League", "venue": m["venue"], "city": m["city"], "country": m["country"], "event_date": f"{m['date']}T21:00:00Z", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200", "status": "upcoming", "featured": True, "created_at": datetime.now(timezone.utc).isoformat()}
        await db.events.update_one({"title": m["title"]}, {"$set": doc}, upsert=True)
        for cat, (lo, hi) in {"standard": (79, 200), "premium": (200, 500), "vip": (500, 1500)}.items():
            for _ in range(25):
                await db.tickets.insert_one({"ticket_id": f"ticket_{uuid.uuid4().hex[:12]}", "event_id": event_id, "seller_id": "seller_euromatch", "seller_name": "EuroMatchTickets Official", "category": cat, "section": f"Block {random.choice(['A','B','C'])}", "price": round(random.uniform(lo, hi), 2), "original_price": hi, "currency": "EUR", "status": "available", "created_at": datetime.now(timezone.utc).isoformat()})
        created += 1
    return {"success": True, "cl_events_created": created}


@router.post("/events/{event_id}/generate-description")
async def generate_event_description(event_id: str, request: Request):
    """Generate AI description for an event"""
    try:
        from openai import OpenAI
        api_key = os.environ.get('OPENAI_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        client = OpenAI(api_key=api_key)
        event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        prompt = f"Write a compelling 150-word description for: {event['title']} at {event['venue']}, {event['city']}. Focus on excitement and ticket purchase urgency."
        response = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}], max_tokens=300)
        desc = response.choices[0].message.content
        await db.events.update_one({"event_id": event_id}, {"$set": {"description": desc}})
        return {"success": True, "description": desc}
    except Exception as e:
        return {"error": str(e)}


@router.post("/seo/submit-urls")
async def seo_submit_urls(data: dict):
    """Submit URLs to Google for indexing"""
    import httpx
    urls = data.get("urls", [])
    results = []
    async with httpx.AsyncClient(timeout=10.0) as client:
        for url in urls:
            try:
                r = await client.get(f"https://www.google.com/ping?sitemap={url}")
                results.append({"url": url, "status": r.status_code})
            except Exception:
                results.append({"url": url, "status": "error"})
    return {"submitted": len(results), "results": results}


@router.post("/seo/index-all-pages")
async def seo_index_all_pages():
    """Index all pages with search engines"""
    import httpx
    base_url = os.environ.get('FRONTEND_URL', 'https://euromatchtickets.com')
    urls_to_index = [f"{base_url}/api/sitemap.xml"]
    results = []
    async with httpx.AsyncClient(timeout=10.0) as client:
        for url in urls_to_index:
            try:
                r = await client.get(f"https://www.google.com/ping?sitemap={url}")
                results.append({"url": url, "google": r.status_code})
            except Exception:
                results.append({"url": url, "google": "error"})
    return {"indexed": len(results), "results": results}


@router.get("/seo/city/{city_name}")
async def seo_get_city_page(city_name: str):
    events = await db.events.find({"city": {"$regex": city_name, "$options": "i"}, "status": {"$ne": "cancelled"}}, {"_id": 0}).to_list(50)
    return {"city": city_name, "events": events, "total": len(events)}


@router.get("/seo/compare/{competitor}")
async def seo_get_comparison(competitor: str):
    return {"competitor": competitor, "euromatchtickets_advantages": ["Lower prices", "FanProtect guarantee", "Instant delivery", "24/7 support"]}


@router.get("/seo/long-tail-keywords")
async def seo_get_long_tail():
    return {"keywords": ["cheap F1 tickets 2026", "best price Champions League tickets", "buy concert tickets Europe", "World Cup 2026 group stage tickets"]}


@router.api_route("/seo/refresh-sitemap", methods=["GET", "POST"])
async def seo_refresh_sitemap():
    import httpx
    base_url = os.environ.get('FRONTEND_URL', 'https://euromatchtickets.com')
    sitemap_url = f"{base_url}/api/sitemap.xml"
    results = {}
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            r = await client.get(f"https://www.google.com/ping?sitemap={sitemap_url}")
            results["google"] = {"status": r.status_code}
        except Exception:
            results["google"] = {"status": "error"}
    return {"sitemap_refreshed": True, "results": results}


@router.delete("/cleanup/delete-expired")
async def delete_expired_events_permanently():
    result = await db.events.delete_many({"status": "expired"})
    tickets_result = await db.tickets.delete_many({"status": {"$in": ["expired", "past_event"]}})
    return {"events_deleted": result.deleted_count, "tickets_deleted": tickets_result.deleted_count}


@router.post("/marketing/generate-campaign")
async def generate_marketing_campaign(request: Request):
    try:
        from openai import OpenAI
        api_key = os.environ.get('OPENAI_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            return {"error": "OpenAI API key not configured"}
        client = OpenAI(api_key=api_key)
        body = await request.json()
        event_type = body.get("event_type", "football")
        target = body.get("target_audience", "18-45 year old sports fans")
        budget = body.get("budget", 1000)
        prompt = f"""Create a marketing campaign for EuroMatchTickets.com targeting {target} for {event_type} events.
Budget: {budget} EUR. Include: ad copy (3 versions), hashtags, targeting strategy, and expected ROI."""
        response = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}], max_tokens=1000)
        return {"campaign": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}


@router.get("/marketing/email-campaigns")
async def get_email_campaigns():
    return {"campaigns": [{"name": "New Events Alert", "subject": "New Events Just Added - Book Now!", "frequency": "weekly"}, {"name": "Price Drop Alert", "subject": "Prices Dropped on Your Watched Events!", "frequency": "trigger-based"}]}


@router.get("/marketing/push-templates")
async def get_push_templates():
    return {"templates": [{"title": "Flash Sale", "body": "24-hour flash sale - up to 40% off!", "cta": "Shop Now"}, {"title": "New Event", "body": "Tickets just released for the biggest match of the year!", "cta": "Get Tickets"}]}


@router.get("/seo/generate-meta/{page_type}")
async def seo_generate_meta(page_type: str, title: str = "", price: int = 49, city: str = "Europe"):
    templates = {"event": f"{title} Tickets | From EUR{price} | EuroMatchTickets", "city": f"{city} Event Tickets 2026 | Best Prices | EuroMatchTickets"}
    return {"meta_title": templates.get(page_type, f"{title} | EuroMatchTickets"), "meta_description": f"Buy {title} tickets. Best prices guaranteed. From EUR{price}. FanProtect guarantee. Instant delivery."}
