"""
Enrich every ticket with realistic seating data: block, row, seat, section.

This lets the Checkout page display full ticket info (like viagogo/StubHub):
  "Block A12 · Row 5 · Seat 18"

Also promotes some tickets to premium categories (VIP, Platinum, Hospitality).
"""
import os
import random
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")
client = MongoClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

# Seating templates per event type
SEAT_TEMPLATES = {
    "worldcup": {
        "blocks": ["101", "102", "103", "104", "112", "113", "124", "125", "201", "202", "210", "211", "225", "236"],
        "sections": ["Lower Bowl", "Upper Bowl", "Midfield", "Corner", "Premium Club"],
        "rows_range": (1, 32),
        "seats_range": (1, 24),
    },
    "football": {
        "blocks": ["A1", "A2", "B4", "B5", "C8", "D12", "E3", "F7", "North Stand", "South Stand", "East Stand", "West Stand"],
        "sections": ["Tier 1", "Tier 2", "Lower", "Upper", "Corner"],
        "rows_range": (1, 45),
        "seats_range": (1, 30),
    },
    "match": {
        "blocks": ["A1", "A2", "B4", "B5", "C8", "D12", "North Stand", "South Stand"],
        "sections": ["Tier 1", "Tier 2", "Lower", "Upper", "Corner"],
        "rows_range": (1, 40),
        "seats_range": (1, 26),
    },
    "f1": {
        "blocks": ["Main Grandstand", "Grandstand A", "Grandstand B", "Grandstand K", "Turn 1 Grandstand", "Turn 3", "Turn 5", "Paddock Club"],
        "sections": ["Trackside", "Elevated", "Covered", "VIP Suite"],
        "rows_range": (1, 25),
        "seats_range": (1, 50),
    },
    "motogp": {
        "blocks": ["Tribune A", "Tribune B", "Tribune C", "Grandstand 1", "Grandstand 2", "Paddock Hospitality"],
        "sections": ["Covered", "Uncovered", "Trackside", "VIP"],
        "rows_range": (1, 20),
        "seats_range": (1, 40),
    },
    "concert": {
        "blocks": ["Floor GA", "Block A", "Block B", "Block C", "Upper Tier"],
        "sections": ["Standing", "Seated", "Golden Circle", "Balcony"],
        "rows_range": (1, 28),
        "seats_range": (1, 30),
    },
    "festival": {
        "blocks": ["Main Stage GA", "VIP Deck", "Day Pass", "3-Day Pass"],
        "sections": ["General Admission", "VIP", "Premium"],
        "rows_range": (0, 0),
        "seats_range": (0, 0),
    },
    "tennis": {
        "blocks": ["Court 1 Main", "Court 1 Upper", "Centre Court", "Grandstand"],
        "sections": ["Lower Bowl", "Upper Bowl", "Box Seats"],
        "rows_range": (1, 18),
        "seats_range": (1, 22),
    },
    "isle_of_man_tt": {
        "blocks": ["Grandstand Start", "Grandstand Finish", "Ramsey Viewing", "Glencrutchery Road"],
        "sections": ["Trackside", "Elevated", "Covered"],
        "rows_range": (1, 15),
        "seats_range": (1, 20),
    },
}


def pick(cat_lower: str, templates: dict):
    """Choose a VIP-ish block if category indicates premium."""
    is_vip = any(k in cat_lower for k in ("vip", "platinum", "hospitality", "paddock", "premium", "golden"))
    blocks = templates["blocks"]
    if is_vip:
        vip_blocks = [b for b in blocks if any(k in b.lower() for k in ("vip", "paddock", "premium", "golden", "box"))]
        if vip_blocks:
            return random.choice(vip_blocks), "VIP / Hospitality"
    return random.choice(blocks), random.choice(templates["sections"])


def main():
    # Preload event types for all events
    event_types = {
        e["event_id"]: e.get("event_type", "match")
        for e in db.events.find({}, {"_id": 0, "event_id": 1, "event_type": 1})
    }

    updated = 0
    # Process tickets in batches
    for ticket in db.tickets.find({}, {"_id": 0, "ticket_id": 1, "event_id": 1, "category": 1, "section": 1, "row": 1, "seat": 1, "block": 1}):
        # Skip if already has seating
        if ticket.get("row") and ticket.get("seat"):
            continue

        ev_type = event_types.get(ticket["event_id"], "match")
        tpl = SEAT_TEMPLATES.get(ev_type, SEAT_TEMPLATES["match"])
        cat_lower = (ticket.get("category") or "").lower()

        block, section = pick(cat_lower, tpl)

        row_lo, row_hi = tpl["rows_range"]
        seat_lo, seat_hi = tpl["seats_range"]
        if row_hi > 0:
            row = str(random.randint(row_lo, row_hi))
            seat = str(random.randint(seat_lo, seat_hi))
        else:
            row = ""
            seat = ""

        db.tickets.update_one(
            {"ticket_id": ticket["ticket_id"]},
            {"$set": {"block": block, "section": section, "row": row, "seat": seat}},
        )
        updated += 1

    print(f"✅ Enriched {updated} tickets with seating data (block · section · row · seat)")

    # Promote 12% of tickets to VIP-tier categories for visual diversity
    to_promote = list(db.tickets.aggregate([{"$sample": {"size": int(db.tickets.count_documents({}) * 0.12)}}]))
    promoted = 0
    for t in to_promote:
        if "vip" in (t.get("category") or "").lower():
            continue
        new_cat = random.choice(["VIP Hospitality", "Paddock Club", "Golden Circle", "Platinum VIP"])
        # Mark up price 3-5x
        new_price = round((t.get("price", 100) or 100) * random.uniform(3, 5), 2)
        db.tickets.update_one(
            {"ticket_id": t["ticket_id"]},
            {"$set": {"category": new_cat, "price": new_price, "original_price": round(new_price * 1.2, 2)}},
        )
        promoted += 1
    print(f"🌟 Promoted {promoted} tickets to VIP/Premium categories")


if __name__ == "__main__":
    main()
