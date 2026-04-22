"""
Auto-generate realistic ticket inventory for every event that has none.

For each event, creates ~50-120 tickets across 3-5 categories with:
  • Realistic price ranges based on event.price_from / price_to
  • Block, row, seat numbers
  • Section label
  • Category distribution: 45% Standard, 25% Category A, 15% Premium, 10% VIP, 5% Platinum
"""
import os
import random
import uuid
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")
client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

CATEGORY_MIX = [
    ("Standard",        0.45, 1.0,  1.1),   # label, share, price_mult_min, price_mult_max
    ("Category A",      0.25, 1.15, 1.4),
    ("Premium",         0.15, 1.5,  2.0),
    ("VIP Hospitality", 0.10, 2.5,  4.0),
    ("Platinum VIP",    0.05, 4.5,  6.5),
]

BLOCK_LIBRARY = {
    "worldcup": ["101","102","103","104","112","113","124","125","201","202","210","211","225","236","Lower Bowl","Upper Bowl","Premium Club","Midfield","Corner"],
    "match":    ["A1","A2","B4","B5","C8","D12","North Stand","South Stand","East Stand","West Stand","Home End","Away End"],
    "football": ["A1","A2","B4","B5","C8","D12","North Stand","South Stand","East Stand","West Stand","Home End","Away End"],
    "f1":       ["Main Grandstand","Grandstand A","Grandstand B","Grandstand K","Turn 1","Turn 3","Turn 5","Paddock Club"],
    "motogp":   ["Tribune A","Tribune B","Tribune C","Grandstand 1","Grandstand 2","Paddock Hospitality"],
    "concert":  ["Floor GA","Block A","Block B","Block C","Upper Tier","Balcony"],
    "festival": ["Main Stage GA","VIP Deck","3-Day Pass","Day Pass"],
    "tennis":   ["Court 1 Main","Court 1 Upper","Centre Court","Grandstand","Box Seats"],
    "isle_of_man_tt": ["Grandstand Start","Grandstand Finish","Ramsey Viewing","Glencrutchery Road"],
}

SECTION_LABELS = ["Lower", "Upper", "Trackside", "Covered", "Elevated", "Corner", "Midfield", "Premium"]


def generate_tickets_for_event(event):
    ev_type = event.get("event_type", "match")
    blocks = BLOCK_LIBRARY.get(ev_type, BLOCK_LIBRARY["match"])
    base_price = event.get("price_from") or event.get("lowest_price") or 99
    event_id = event["event_id"]

    total_tickets = random.randint(60, 140)
    tickets = []
    for cat_label, share, pmin, pmax in CATEGORY_MIX:
        n = int(total_tickets * share)
        for _ in range(n):
            price = round(base_price * random.uniform(pmin, pmax), 2)
            block = random.choice(blocks)
            if "vip" in cat_label.lower() or "platinum" in cat_label.lower():
                vip_blocks = [b for b in blocks if any(k in b.lower() for k in ("vip","paddock","premium","club","box","deck"))]
                if vip_blocks:
                    block = random.choice(vip_blocks)
            section = random.choice(SECTION_LABELS)
            if ev_type == "festival":
                row, seat = "", ""
            else:
                row = str(random.randint(1, 35))
                seat = str(random.randint(1, 40))
            tickets.append({
                "ticket_id": f"t_{uuid.uuid4().hex[:10]}",
                "event_id": event_id,
                "price": price,
                "original_price": round(price * 1.2, 2),
                "category": cat_label,
                "section": section,
                "block": block,
                "row": row,
                "seat": seat,
                "status": "available",
                "currency": "EUR",
                "created_at": datetime.now(timezone.utc),
            })
    return tickets


def main():
    # Find events without any tickets
    events_with_tickets = set(db.tickets.distinct("event_id"))
    events = list(db.events.find({}, {"_id": 0, "event_id": 1, "event_type": 1, "price_from": 1, "lowest_price": 1}))
    missing = [e for e in events if e["event_id"] not in events_with_tickets]

    print(f"Events missing tickets: {len(missing)}")
    total_inserted = 0
    for ev in missing:
        tickets = generate_tickets_for_event(ev)
        if tickets:
            db.tickets.insert_many(tickets)
            total_inserted += len(tickets)

    print(f"✅ Inserted {total_inserted} tickets across {len(missing)} events")
    print(f"Final ticket count: {db.tickets.count_documents({})}")


if __name__ == "__main__":
    main()
