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
        {"title": "Champions League Final 2026", "event_type": "football", "home_team": "TBD", "away_team": "TBD", "league": "Champions League", "venue": "San Siro", "city": "Milan", "country": "Italy", "event_date": "2026-05-30T21:00:00Z", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200", "base_prices": {"general": 89, "premium": 199, "vip": 449, "hospitality": 899}},
        {"title": "El Clasico - Real Madrid vs Barcelona", "event_type": "football", "home_team": "Real Madrid", "away_team": "FC Barcelona", "venue": "Santiago Bernabeu", "city": "Madrid", "country": "Spain", "event_date": "2026-04-15T21:00:00Z", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200", "base_prices": {"general": 69, "premium": 149, "vip": 349, "hospitality": 699}},
        {"title": "Monaco Grand Prix 2026", "event_type": "f1", "venue": "Circuit de Monaco", "city": "Monte Carlo", "country": "Monaco", "event_date": "2026-05-24T15:00:00Z", "event_image": "https://images.unsplash.com/photo-1752884991461-8ac432ad9266?w=1200", "base_prices": {"general": 99, "grandstand": 199, "yacht_view": 499, "paddock_club": 999}},
        {"title": "Las Vegas Grand Prix 2026", "event_type": "f1", "venue": "Las Vegas Strip Circuit", "city": "Las Vegas", "country": "USA", "event_date": "2026-11-22T22:00:00Z", "event_image": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200", "base_prices": {"general": 109, "grandstand": 249, "vip_lounge": 499, "paddock_club": 899}},
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



@router.post("/seed-new-events")
async def seed_new_events():
    """Seed Super Bowl, Taylor Swift nights, World Athletics, Champions League, concerts"""
    new_events = [
        # Super Bowl
        {"event_type": "match", "title": "Super Bowl LXI 2027", "venue": "Levi's Stadium", "city": "Santa Clara", "country": "USA", "event_date": "2027-02-07T18:00:00Z", "featured": True, "subtitle": "NFL Championship Game", "genre": "American Football", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/d1f3f993ef225f8bb18bf55d54c64c51b61a17902dc81f204df12ad8285ee2bd.png", "base_prices": {"upper_deck": (99, 249), "mid_level": (249, 449), "lower_level": (449, 699), "club_level": (699, 999), "vip_suite": (999, 1499), "platinum": (1499, 1999)}},
        {"event_type": "match", "title": "Super Bowl LXI 2027 - VIP Experience", "venue": "Levi's Stadium", "city": "Santa Clara", "country": "USA", "event_date": "2027-02-07T14:00:00Z", "featured": True, "subtitle": "Premium Pre-Game + Game Day + After Party", "genre": "American Football", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/d1f3f993ef225f8bb18bf55d54c64c51b61a17902dc81f204df12ad8285ee2bd.png", "base_prices": {"premium": (999, 1999)}},
        # Taylor Swift - 6 Wembley Nights
        {"event_type": "concert", "title": "Taylor Swift - Eras Tour Wembley Night 1", "artist": "Taylor Swift", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-19T18:00:00Z", "featured": True, "subtitle": "The Eras Tour 2026 - Opening Night", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png", "base_prices": {"general": (59, 129), "category_a": (129, 249), "floor_standing": (199, 349), "vip_lounge": (349, 699), "diamond": (699, 1299)}},
        {"event_type": "concert", "title": "Taylor Swift - Eras Tour Wembley Night 2", "artist": "Taylor Swift", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-20T18:00:00Z", "featured": True, "subtitle": "The Eras Tour 2026", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png", "base_prices": {"general": (59, 129), "category_a": (129, 249), "floor_standing": (199, 349), "vip_lounge": (349, 699), "diamond": (699, 1299)}},
        {"event_type": "concert", "title": "Taylor Swift - Eras Tour Wembley Night 3", "artist": "Taylor Swift", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-21T18:00:00Z", "featured": True, "subtitle": "The Eras Tour 2026", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png", "base_prices": {"general": (59, 129), "category_a": (129, 249), "floor_standing": (199, 349), "vip_lounge": (349, 699), "diamond": (699, 1299)}},
        {"event_type": "concert", "title": "Taylor Swift - Eras Tour Wembley Night 4", "artist": "Taylor Swift", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-25T18:00:00Z", "featured": True, "subtitle": "The Eras Tour 2026", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png", "base_prices": {"general": (59, 129), "category_a": (129, 249), "floor_standing": (199, 349), "vip_lounge": (349, 699), "diamond": (699, 1299)}},
        {"event_type": "concert", "title": "Taylor Swift - Eras Tour Wembley Night 5", "artist": "Taylor Swift", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-27T18:00:00Z", "featured": True, "subtitle": "The Eras Tour 2026", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png", "base_prices": {"general": (59, 129), "category_a": (129, 249), "floor_standing": (199, 349), "vip_lounge": (349, 699), "diamond": (699, 1299)}},
        {"event_type": "concert", "title": "Taylor Swift - Eras Tour Wembley Night 6", "artist": "Taylor Swift", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-06-28T18:00:00Z", "featured": True, "subtitle": "The Eras Tour 2026 - Closing Night", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png", "base_prices": {"general": (59, 129), "category_a": (129, 249), "floor_standing": (199, 349), "vip_lounge": (349, 699), "diamond": (699, 1299)}},
        # World Athletics
        {"event_type": "match", "title": "World Athletics Championships 2026 - Day 1", "venue": "National Athletics Centre", "city": "Budapest", "country": "Hungary", "event_date": "2026-09-11T10:00:00Z", "featured": True, "subtitle": "100m Heats, Long Jump Qualifying", "genre": "Athletics", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/a3a9316ec64f6c42707d0fe9d06b2409d1652145b679655bcb7aac9a3c772036.png", "base_prices": {"day_pass": (49, 99), "evening_session": (79, 149), "premium": (149, 299), "vip": (299, 599)}},
        {"event_type": "match", "title": "World Athletics Championships 2026 - 100m Final", "venue": "National Athletics Centre", "city": "Budapest", "country": "Hungary", "event_date": "2026-09-13T20:00:00Z", "featured": True, "subtitle": "Men's & Women's 100m Finals", "genre": "Athletics", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/a3a9316ec64f6c42707d0fe9d06b2409d1652145b679655bcb7aac9a3c772036.png", "base_prices": {"general": (79, 149), "premium": (149, 299), "vip": (299, 599), "platinum": (599, 999)}},
        {"event_type": "match", "title": "World Athletics Championships 2026 - 200m Final", "venue": "National Athletics Centre", "city": "Budapest", "country": "Hungary", "event_date": "2026-09-15T20:00:00Z", "featured": True, "subtitle": "Sprint Finals Night", "genre": "Athletics", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/a3a9316ec64f6c42707d0fe9d06b2409d1652145b679655bcb7aac9a3c772036.png", "base_prices": {"general": (69, 129), "premium": (129, 249), "vip": (249, 499)}},
        {"event_type": "match", "title": "World Athletics Championships 2026 - Marathon", "venue": "Budapest City Centre", "city": "Budapest", "country": "Hungary", "event_date": "2026-09-17T07:00:00Z", "featured": True, "subtitle": "Men's & Women's Marathon", "genre": "Athletics", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/a3a9316ec64f6c42707d0fe9d06b2409d1652145b679655bcb7aac9a3c772036.png", "base_prices": {"viewing_area": (29, 59), "premium": (59, 129)}},
        {"event_type": "match", "title": "World Athletics Championships 2026 - Final Day", "venue": "National Athletics Centre", "city": "Budapest", "country": "Hungary", "event_date": "2026-09-17T18:00:00Z", "featured": True, "subtitle": "4x100m Relay Finals, Closing Ceremony", "genre": "Athletics", "event_image": "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/a3a9316ec64f6c42707d0fe9d06b2409d1652145b679655bcb7aac9a3c772036.png", "base_prices": {"general": (89, 179), "premium": (179, 349), "vip": (349, 699), "platinum": (699, 1299)}},
        # Champions League
        {"event_type": "match", "title": "UEFA Champions League Final 2026", "venue": "San Siro", "city": "Milan", "country": "Italy", "event_date": "2026-05-30T21:00:00Z", "featured": True, "subtitle": "UCL Final", "genre": "Football", "base_prices": {"cat3": (199, 400), "cat2": (400, 800), "cat1": (800, 1500), "vip": (1500, 5000)}},
        {"event_type": "match", "title": "Champions League Semi-Final 1st Leg", "venue": "TBA", "city": "Europe", "country": "Europe", "event_date": "2026-04-28T21:00:00Z", "featured": True, "subtitle": "UCL Semi-Final", "genre": "Football", "base_prices": {"cat3": (99, 200), "cat2": (200, 400), "cat1": (400, 800)}},
        {"event_type": "match", "title": "Champions League Semi-Final 2nd Leg", "venue": "TBA", "city": "Europe", "country": "Europe", "event_date": "2026-05-05T21:00:00Z", "featured": True, "subtitle": "UCL Semi-Final", "genre": "Football", "base_prices": {"cat3": (99, 200), "cat2": (200, 400), "cat1": (400, 800)}},
        # Concerts
        {"event_type": "concert", "title": "Bad Bunny - DeBi TiRAR MaS FOToS Tour London", "artist": "Bad Bunny", "genre": "Reggaeton", "venue": "Tottenham Hotspur Stadium", "city": "London", "country": "UK", "event_date": "2026-07-15T19:00:00Z", "featured": True, "base_prices": {"general": (69, 149), "premium": (149, 299), "vip": (299, 599)}},
        {"event_type": "concert", "title": "Bruno Mars - The Romantic Tour London", "artist": "Bruno Mars", "genre": "Pop/R&B", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-08-10T19:00:00Z", "featured": True, "base_prices": {"general": (79, 159), "premium": (159, 329), "vip": (329, 699)}},
        {"event_type": "concert", "title": "Bruno Mars - The Romantic Tour Berlin", "artist": "Bruno Mars", "genre": "Pop/R&B", "venue": "Olympiastadion", "city": "Berlin", "country": "Germany", "event_date": "2026-08-15T19:00:00Z", "featured": True, "base_prices": {"general": (69, 139), "premium": (139, 279), "vip": (279, 599)}},
        {"event_type": "concert", "title": "Guns N' Roses European Stadium Tour 2026", "artist": "Guns N' Roses", "genre": "Rock", "venue": "London Stadium", "city": "London", "country": "UK", "event_date": "2026-06-20T18:00:00Z", "featured": True, "base_prices": {"general": (59, 129), "premium": (129, 249), "vip": (249, 499)}},
        {"event_type": "concert", "title": "Metallica M72 World Tour 2026 - Paris", "artist": "Metallica", "genre": "Heavy Metal", "venue": "Stade de France", "city": "Paris", "country": "France", "event_date": "2026-07-05T18:00:00Z", "featured": True, "base_prices": {"general": (79, 159), "premium": (159, 329), "vip": (329, 699)}},
        {"event_type": "concert", "title": "The Weeknd After Hours Til Dawn Tour London", "artist": "The Weeknd", "genre": "R&B/Pop", "venue": "Tottenham Hotspur Stadium", "city": "London", "country": "UK", "event_date": "2026-07-20T19:00:00Z", "featured": True, "base_prices": {"general": (69, 149), "premium": (149, 299), "vip": (299, 599)}},
        {"event_type": "concert", "title": "Harry Styles Love On Tour 2026 London", "artist": "Harry Styles", "genre": "Pop", "venue": "Wembley Stadium", "city": "London", "country": "UK", "event_date": "2026-09-01T19:00:00Z", "featured": True, "base_prices": {"general": (69, 139), "premium": (139, 279), "vip": (279, 599)}},
        # MotoGP / Isle of Man
        {"event_type": "motogp", "title": "Italian MotoGP 2026 - Mugello Race Day", "venue": "Autodromo del Mugello", "city": "Scarperia", "country": "Italy", "event_date": "2026-06-01T14:00:00Z", "featured": True, "base_prices": {"general": (49, 99), "grandstand": (99, 199), "vip": (199, 499)}},
        {"event_type": "motogp", "title": "Isle of Man TT 2026 - Senior Race", "venue": "Snaefell Mountain Course", "city": "Douglas", "country": "Isle of Man", "event_date": "2026-06-13T10:00:00Z", "featured": True, "base_prices": {"hillside": (29, 69), "grandstand": (69, 149), "vip": (149, 349)}},
        # Festivals
        {"event_type": "festival", "title": "ACL Festival 2026 - Weekend 1", "venue": "Zilker Park", "city": "Austin", "country": "USA", "event_date": "2026-10-02T11:00:00Z", "featured": True, "base_prices": {"single_day": (99, 199), "3_day_pass": (249, 449), "vip": (449, 999)}},
        {"event_type": "festival", "title": "ACL Festival 2026 - Weekend 2", "venue": "Zilker Park", "city": "Austin", "country": "USA", "event_date": "2026-10-09T11:00:00Z", "featured": True, "base_prices": {"single_day": (99, 199), "3_day_pass": (249, 449), "vip": (449, 999)}},
    ]

    created = 0
    total_tickets = 0
    for ev in new_events:
        event_id = f"premium_{uuid.uuid4().hex[:12]}"
        base_prices = ev.pop("base_prices", {})
        lowest = min(lo for lo, hi in base_prices.values()) if base_prices else 49
        total_avail = 0
        ev["event_id"] = event_id
        ev["status"] = "upcoming"
        ev["created_at"] = datetime.now(timezone.utc).isoformat()
        ev["lowest_price"] = round(lowest * 0.95, 2)
        ev["available_tickets"] = random.randint(30, 200)
        total_avail = ev["available_tickets"]
        await db.events.update_one({"title": ev["title"]}, {"$set": ev}, upsert=True)
        for cat, (lo, hi) in base_prices.items():
            count = 15 if hi > 3000 else (20 if hi > 1000 else 30)
            for _ in range(count):
                await db.tickets.insert_one({
                    "ticket_id": f"ticket_{uuid.uuid4().hex[:12]}", "event_id": event_id,
                    "seller_id": "seller_euromatch", "seller_name": "EuroMatchTickets Official",
                    "category": cat, "section": f"Block {random.choice(['A','B','C','D','E'])}",
                    "price": round(random.uniform(lo, hi), 2), "original_price": hi,
                    "currency": "EUR", "status": "available",
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
                total_tickets += 1
        created += 1
    return {"success": True, "events_created": created, "tickets_created": total_tickets}


@router.post("/seed-mega-premium-events")
async def seed_mega_premium_events():
    """Seed ultra-premium realistic events: FIFA Club World Cup 2025, World Cup 2026 premium, Boxing mega-fights"""

    SECTIONS = ["Floor", "Section A", "Section B", "Section C", "Balcony"]

    mega_events = [
        # ═══════ FIFA CLUB WORLD CUP 2025 ═══════
        {"event_type": "football", "title": "FIFA Club World Cup 2025 Final", "home_team": "TBD", "away_team": "TBD", "league": "Club World Cup", "venue": "MetLife Stadium", "city": "New York", "country": "USA", "event_date": "2025-07-13T20:00:00Z", "featured": True, "high_demand": True, "subtitle": "The Biggest Club Match in History", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 40, "price_range": (79, 179)},
             {"category": "seated", "section": "Section B", "count": 35, "price_range": (179, 349)},
             {"category": "seated", "section": "Section A", "count": 30, "price_range": (349, 599)},
             {"category": "vip", "section": "Floor", "count": 20, "price_range": (599, 999)},
             {"category": "platinum", "section": "Floor", "count": 10, "price_range": (999, 1499)},
         ]},
        {"event_type": "football", "title": "FIFA Club World Cup 2025 - Real Madrid vs Flamengo", "home_team": "Real Madrid", "away_team": "Flamengo", "league": "Club World Cup", "venue": "Hard Rock Stadium", "city": "Miami", "country": "USA", "event_date": "2025-06-18T21:00:00Z", "featured": True, "high_demand": True, "subtitle": "Group Stage - Europe vs South America", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 40, "price_range": (49, 129)},
             {"category": "seated", "section": "Section B", "count": 35, "price_range": (129, 249)},
             {"category": "seated", "section": "Section A", "count": 30, "price_range": (249, 449)},
             {"category": "vip", "section": "Floor", "count": 15, "price_range": (449, 799)},
             {"category": "platinum", "section": "Floor", "count": 8, "price_range": (799, 1199)},
         ]},
        {"event_type": "football", "title": "FIFA Club World Cup 2025 - Manchester City vs Al Ahly", "home_team": "Manchester City", "away_team": "Al Ahly", "league": "Club World Cup", "venue": "Orlando City Stadium", "city": "Orlando", "country": "USA", "event_date": "2025-06-19T18:00:00Z", "featured": True, "subtitle": "Group Stage", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 45, "price_range": (39, 99)},
             {"category": "seated", "section": "Section B", "count": 35, "price_range": (99, 199)},
             {"category": "seated", "section": "Section A", "count": 25, "price_range": (199, 349)},
             {"category": "vip", "section": "Floor", "count": 12, "price_range": (349, 599)},
         ]},
        {"event_type": "football", "title": "FIFA Club World Cup 2025 - Bayern Munich vs Boca Juniors", "home_team": "Bayern Munich", "away_team": "Boca Juniors", "league": "Club World Cup", "venue": "Lincoln Financial Field", "city": "Philadelphia", "country": "USA", "event_date": "2025-06-21T20:00:00Z", "featured": True, "subtitle": "Group Stage", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 40, "price_range": (39, 109)},
             {"category": "seated", "section": "Section B", "count": 35, "price_range": (109, 219)},
             {"category": "seated", "section": "Section A", "count": 25, "price_range": (219, 399)},
             {"category": "vip", "section": "Floor", "count": 12, "price_range": (399, 699)},
         ]},
        {"event_type": "football", "title": "FIFA Club World Cup 2025 Semi-Final 1", "home_team": "TBD", "away_team": "TBD", "league": "Club World Cup", "venue": "AT&T Stadium", "city": "Dallas", "country": "USA", "event_date": "2025-07-08T20:00:00Z", "featured": True, "high_demand": True, "subtitle": "Semi-Final", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 35, "price_range": (59, 149)},
             {"category": "seated", "section": "Section B", "count": 30, "price_range": (149, 299)},
             {"category": "seated", "section": "Section A", "count": 25, "price_range": (299, 499)},
             {"category": "vip", "section": "Floor", "count": 15, "price_range": (499, 799)},
             {"category": "platinum", "section": "Floor", "count": 8, "price_range": (799, 1199)},
         ]},

        # ═══════ FIFA WORLD CUP 2026 PREMIUM ═══════
        {"event_type": "worldcup", "title": "FIFA World Cup 2026 Final - Premium", "venue": "MetLife Stadium", "city": "New York", "country": "USA", "event_date": "2026-07-19T20:00:00Z", "featured": True, "high_demand": True, "subtitle": "The Greatest Show on Earth", "event_image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 30, "price_range": (189, 399)},
             {"category": "seated", "section": "Section B", "count": 25, "price_range": (399, 699)},
             {"category": "seated", "section": "Section A", "count": 20, "price_range": (699, 999)},
             {"category": "vip", "section": "Floor", "count": 15, "price_range": (999, 1499)},
             {"category": "platinum", "section": "Floor", "count": 5, "price_range": (1499, 1999)},
         ]},
        {"event_type": "worldcup", "title": "FIFA World Cup 2026 - USA vs England", "home_team": "USA", "away_team": "England", "venue": "SoFi Stadium", "city": "Los Angeles", "country": "USA", "event_date": "2026-06-15T18:00:00Z", "featured": True, "high_demand": True, "subtitle": "Group Stage Blockbuster", "event_image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 40, "price_range": (89, 199)},
             {"category": "seated", "section": "Section B", "count": 35, "price_range": (199, 349)},
             {"category": "seated", "section": "Section A", "count": 25, "price_range": (349, 599)},
             {"category": "vip", "section": "Floor", "count": 12, "price_range": (599, 899)},
             {"category": "platinum", "section": "Floor", "count": 5, "price_range": (899, 1299)},
         ]},
        {"event_type": "worldcup", "title": "FIFA World Cup 2026 - Brazil vs Argentina", "home_team": "Brazil", "away_team": "Argentina", "venue": "AT&T Stadium", "city": "Dallas", "country": "USA", "event_date": "2026-06-22T20:00:00Z", "featured": True, "high_demand": True, "subtitle": "South American Derby", "event_image": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 35, "price_range": (99, 249)},
             {"category": "seated", "section": "Section B", "count": 30, "price_range": (249, 449)},
             {"category": "seated", "section": "Section A", "count": 20, "price_range": (449, 699)},
             {"category": "vip", "section": "Floor", "count": 10, "price_range": (699, 999)},
             {"category": "platinum", "section": "Floor", "count": 5, "price_range": (999, 1499)},
         ]},

        # ═══════ BOXING MEGA-FIGHTS ═══════
        {"event_type": "match", "title": "Tyson Fury vs Oleksandr Usyk III - Undisputed", "venue": "Kingdom Arena", "city": "Riyadh", "country": "Saudi Arabia", "event_date": "2025-10-18T22:00:00Z", "featured": True, "high_demand": True, "subtitle": "Undisputed Heavyweight Championship of the World", "genre": "Boxing", "event_image": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 30, "price_range": (129, 299)},
             {"category": "seated", "section": "Section B", "count": 25, "price_range": (299, 549)},
             {"category": "seated", "section": "Section A", "count": 20, "price_range": (549, 899)},
             {"category": "vip", "section": "Floor", "count": 12, "price_range": (899, 1499)},
             {"category": "platinum", "section": "Floor", "count": 5, "price_range": (1499, 2199)},
         ]},
        {"event_type": "match", "title": "Canelo Alvarez vs David Benavidez - Super Middleweight", "venue": "T-Mobile Arena", "city": "Las Vegas", "country": "USA", "event_date": "2025-09-13T22:00:00Z", "featured": True, "high_demand": True, "subtitle": "Undisputed Super Middleweight Championship", "genre": "Boxing", "event_image": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 35, "price_range": (89, 199)},
             {"category": "seated", "section": "Section B", "count": 30, "price_range": (199, 399)},
             {"category": "seated", "section": "Section A", "count": 20, "price_range": (399, 699)},
             {"category": "vip", "section": "Floor", "count": 12, "price_range": (699, 1199)},
             {"category": "platinum", "section": "Floor", "count": 5, "price_range": (1199, 1799)},
         ]},
        {"event_type": "match", "title": "UFC 310 - Heavyweight Championship", "venue": "T-Mobile Arena", "city": "Las Vegas", "country": "USA", "event_date": "2025-12-06T22:00:00Z", "featured": True, "high_demand": True, "subtitle": "UFC Pay-Per-View Mega Event", "genre": "MMA/UFC", "event_image": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 30, "price_range": (89, 249)},
             {"category": "seated", "section": "Section B", "count": 25, "price_range": (249, 449)},
             {"category": "seated", "section": "Section A", "count": 18, "price_range": (449, 699)},
             {"category": "vip", "section": "Floor", "count": 10, "price_range": (699, 999)},
             {"category": "platinum", "section": "Floor", "count": 5, "price_range": (999, 1499)},
         ]},

        # ═══════ BAYERN vs REAL MADRID - UCL ═══════
        {"event_type": "football", "title": "Bayern Munich vs Real Madrid - UCL Quarter-Final", "home_team": "Bayern Munich", "away_team": "Real Madrid", "league": "Champions League", "venue": "Allianz Arena", "city": "Munich", "country": "Germany", "event_date": "2026-04-08T21:00:00Z", "featured": True, "high_demand": True, "subtitle": "Champions League Quarter-Final 1st Leg", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 35, "price_range": (59, 149)},
             {"category": "seated", "section": "Section B", "count": 30, "price_range": (149, 299)},
             {"category": "seated", "section": "Section A", "count": 25, "price_range": (299, 499)},
             {"category": "vip", "section": "Floor", "count": 15, "price_range": (499, 799)},
             {"category": "platinum", "section": "Floor", "count": 8, "price_range": (799, 1199)},
         ]},
        {"event_type": "football", "title": "Real Madrid vs Bayern Munich - UCL Quarter-Final 2nd Leg", "home_team": "Real Madrid", "away_team": "Bayern Munich", "league": "Champions League", "venue": "Santiago Bernabeu", "city": "Madrid", "country": "Spain", "event_date": "2026-04-15T21:00:00Z", "featured": True, "high_demand": True, "subtitle": "Champions League Quarter-Final 2nd Leg", "event_image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
         "ticket_tiers": [
             {"category": "general_admission", "section": "Section C", "count": 35, "price_range": (69, 169)},
             {"category": "seated", "section": "Section B", "count": 30, "price_range": (169, 349)},
             {"category": "seated", "section": "Section A", "count": 25, "price_range": (349, 549)},
             {"category": "vip", "section": "Floor", "count": 15, "price_range": (549, 899)},
             {"category": "platinum", "section": "Floor", "count": 8, "price_range": (899, 1299)},
         ]},
    ]

    created = 0
    total_tickets = 0
    for ev in mega_events:
        event_id = f"mega_{uuid.uuid4().hex[:12]}"
        tiers = ev.pop("ticket_tiers", [])
        lowest = min(t["price_range"][0] for t in tiers) if tiers else 99
        total_avail = sum(t["count"] for t in tiers)
        ev.update({
            "event_id": event_id, "status": "upcoming",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "lowest_price": round(lowest * 0.97, 2),
            "available_tickets": total_avail,
        })
        if "slug" not in ev:
            from routes.events import generate_event_slug
            ev["slug"] = generate_event_slug(ev["title"], ev["event_type"], ev.get("city", ""), ev["event_date"])
        await db.events.update_one({"title": ev["title"]}, {"$set": ev}, upsert=True)

        for tier in tiers:
            lo, hi = tier["price_range"]
            for _ in range(tier["count"]):
                await db.tickets.insert_one({
                    "ticket_id": f"ticket_{uuid.uuid4().hex[:12]}",
                    "event_id": event_id,
                    "seller_id": "seller_euromatch",
                    "seller_name": "EuroMatchTickets Official",
                    "category": tier["category"],
                    "section": tier["section"],
                    "price": round(random.uniform(lo, hi), 2),
                    "original_price": hi,
                    "currency": "EUR",
                    "status": "available",
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
                total_tickets += 1
        created += 1

    return {"success": True, "events_created": created, "tickets_created": total_tickets}
