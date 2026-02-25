from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# MongoDB
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'euromatchtickets')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/health")
async def api_health():
    return {"status": "ok"}

@app.get("/api/events")
async def get_events():
    events = await db.events.find({}, {"_id": 0}).to_list(100)
    return events

@app.get("/api/events/{event_id}")
async def get_event(event_id: str):
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        return {"error": "not found"}
    event["tickets"] = await db.tickets.find({"event_id": event_id}, {"_id": 0}).to_list(100)
    return event

@app.post("/api/seed")
async def seed():
    count = await db.events.count_documents({})
    if count > 0:
        return {"message": "already seeded", "count": count}
    
    import uuid
    events = [
        {"event_id": f"e_{uuid.uuid4().hex[:8]}", "event_type": "match", "title": "Liverpool vs Arsenal", "event_date": "2026-03-15", "city": "Liverpool", "country": "England", "venue": "Anfield", "image_url": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"},
        {"event_id": f"e_{uuid.uuid4().hex[:8]}", "event_type": "match", "title": "Real Madrid vs Barcelona", "event_date": "2026-04-10", "city": "Madrid", "country": "Spain", "venue": "Bernabeu", "image_url": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800"},
        {"event_id": f"e_{uuid.uuid4().hex[:8]}", "event_type": "concert", "title": "Coldplay", "event_date": "2026-05-20", "city": "Berlin", "country": "Germany", "venue": "Olympiastadion", "image_url": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800"},
    ]
    await db.events.insert_many(events)
    
    for ev in events:
        tickets = [{"ticket_id": f"t_{uuid.uuid4().hex[:8]}", "event_id": ev["event_id"], "price": 50+i*20, "category": ["Standard","Premium","VIP"][i%3], "status": "available"} for i in range(10)]
        await db.tickets.insert_many(tickets)
    
    return {"message": "seeded", "count": len(events)}

@app.get("/api/auth/me")
async def auth_me():
    raise HTTPException(401, "not authenticated")

logger.info("Server ready")
