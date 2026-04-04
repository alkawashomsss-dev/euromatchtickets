"""
Optimize all SEO page titles and meta descriptions for Google search ranking.
- Titles: Under 60 chars, with buying intent keywords
- Meta descriptions: 150-160 chars, with CTA and keywords
"""
import asyncio
import os
import re
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "euromatchtickets")


def optimize_title(title, slug, category, city, venue):
    """Generate SEO-optimized title under 60 characters."""
    # Clean the raw title
    t = title.split("|")[0].strip()
    t = re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'\s*€\d+[\d,.]*', '', t).strip()
    t = t.rstrip(' –—-!.')
    
    # Extract event name
    event_name = t
    for suffix in ["Tickets", "tickets"]:
        event_name = event_name.replace(suffix, "").strip()
    event_name = re.sub(r'\s{2,}', ' ', event_name).strip()
    
    if category == "f1":
        # F1 events: "Monaco GP 2026 Tickets – Verified | F1"
        if city and city not in event_name and city != "Europe":
            result = f"{event_name} Tickets {city} – Verified"
        else:
            result = f"{event_name} Tickets – Verified F1"
    elif category == "football":
        if "champions" in slug.lower() or "champions" in event_name.lower():
            result = f"{event_name} Tickets – UEFA Verified"
        elif city and city not in event_name and city != "Europe":
            result = f"{event_name} Tickets {city} – Verified"
        else:
            result = f"{event_name} Tickets – Verified Seller"
    elif category in ("concert", "concerts"):
        if city and city not in event_name and city != "Europe":
            result = f"{event_name} Tickets {city} – Verified"
        else:
            result = f"{event_name} Tickets – Verified Seller"
    elif category == "worldcup":
        if city and city not in event_name and city != "Europe":
            result = f"World Cup 2026 Tickets {city} – FIFA"
        else:
            result = f"{event_name} Tickets – FIFA 2026"
    else:
        result = f"{event_name} Tickets – Verified Seller"
    
    # Truncate to 60 chars
    if len(result) > 60:
        result = result[:57] + "..."
    
    return result


def generate_meta_description(title, slug, category, city, venue, year):
    """Generate meta description 150-160 chars with CTA."""
    event_name = title.split("|")[0].strip()
    event_name = re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', event_name, flags=re.IGNORECASE).strip()
    for suffix in ["Tickets", "tickets", "| EuroMatchTickets", "| EMT"]:
        event_name = event_name.replace(suffix, "").strip()
    event_name = event_name.rstrip(' –—-!.')
    event_name = re.sub(r'\s{2,}', ' ', event_name).strip()
    
    venue_text = f" at {venue}" if venue and venue != city and venue != "Europe" else ""
    city_text = f" in {city}" if city and city != "Europe" else ""
    
    if category == "f1":
        desc = f"Buy {event_name} tickets{venue_text}{city_text}. Formula 1 {year} season. Verified tickets, instant e-delivery, secure checkout. Book your seats now."
    elif category == "football":
        if "champions" in slug.lower():
            desc = f"Buy {event_name} tickets{venue_text}{city_text}. UEFA Champions League {year}. Verified seller, instant delivery, best seats available. Book now."
        else:
            desc = f"Buy {event_name} tickets{venue_text}{city_text}. {year} season match. Verified tickets, secure payment, instant e-delivery. Get your seats today."
    elif category in ("concert", "concerts"):
        desc = f"Buy {event_name} tickets{venue_text}{city_text}. Live concert {year}. Verified seller, instant e-delivery, best seats available. Book your tickets now."
    elif category == "worldcup":
        desc = f"Buy {event_name} tickets{venue_text}{city_text}. FIFA World Cup 2026. Verified tickets, secure checkout, instant delivery. Don't miss this match."
    else:
        desc = f"Buy {event_name} tickets{venue_text}{city_text}. {year} event. Verified tickets, instant e-delivery, secure payment. Book your seats today."
    
    # Ensure 150-160 chars
    if len(desc) > 160:
        desc = desc[:157] + "..."
    elif len(desc) < 140:
        desc += " Trusted by thousands of fans across Europe."
        if len(desc) > 160:
            desc = desc[:157] + "..."
    
    return desc


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    pages = await db.seo_pages.find(
        {"active": True},
        {"_id": 1, "slug": 1, "title": 1, "category": 1, "city": 1, "venue": 1, "year": 1}
    ).to_list(length=5000)
    
    print(f"Optimizing {len(pages)} active SEO pages...")
    
    updated = 0
    for page in pages:
        slug = page.get("slug", "")
        title = page.get("title", "")
        category = page.get("category", "other")
        city = page.get("city", "Europe")
        venue = page.get("venue", "")
        year = page.get("year", 2026)
        
        new_title = optimize_title(title, slug, category, city, venue)
        new_meta = generate_meta_description(title, slug, category, city, venue, year)
        
        await db.seo_pages.update_one(
            {"_id": page["_id"]},
            {"$set": {
                "title": new_title,
                "meta_description": new_meta,
            }}
        )
        updated += 1
        if updated % 100 == 0:
            print(f"  {updated}/{len(pages)} updated...")
    
    print(f"\nDone! Updated {updated} pages.")
    
    # Show samples
    samples = await db.seo_pages.find(
        {"active": True},
        {"_id": 0, "slug": 1, "title": 1, "meta_description": 1, "category": 1}
    ).to_list(length=10)
    
    print("\n=== Samples ===")
    for s in samples:
        print(f"Title ({len(s['title'])} chars): {s['title']}")
        print(f"Meta ({len(s.get('meta_description',''))} chars): {s.get('meta_description','')}")
        print(f"Category: {s['category']}")
        print("---")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
