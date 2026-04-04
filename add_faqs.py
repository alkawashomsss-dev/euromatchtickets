"""Add FAQ data to major event pages for Google FAQ rich snippets."""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "euromatchtickets")

# Category-specific FAQ templates
FAQ_TEMPLATES = {
    "f1": lambda name, city, venue: [
        [f"How do I buy {name} tickets?", f"You can buy verified {name} tickets directly on EuroMatchTickets. Select your preferred grandstand or general admission, complete secure checkout, and receive instant e-ticket delivery via QR code."],
        [f"Are {name} tickets verified?", f"Yes. All tickets sold on EuroMatchTickets are 100% verified and backed by our FanProtect money-back guarantee. If there's any issue, you get a full refund."],
        [f"What is the cheapest way to attend {name}?", f"General Admission tickets are the most affordable option. We offer prices up to 40% lower than competing platforms like Viagogo and StubHub."],
        [f"When does {name} take place?", f"{name} is part of the Formula 1 {2026} World Championship season{' at ' + venue if venue else ''}{' in ' + city if city and city != 'Europe' else ''}. Check our event page for exact dates."],
        [f"Can I get a refund if {name} is cancelled?", "Yes. Our FanProtect guarantee covers all cancellations. If the event is cancelled, you receive a full refund automatically."],
        [f"How will I receive my {name} tickets?", "Tickets are delivered instantly via QR code to your email after purchase. You can also access them through your EuroMatchTickets account. No physical shipping needed."],
    ],
    "football": lambda name, city, venue: [
        [f"How do I buy {name} tickets?", f"Purchase verified {name} tickets on EuroMatchTickets. Choose your stadium section, complete secure payment, and receive instant e-ticket delivery."],
        [f"Are {name} tickets genuine?", f"Absolutely. Every ticket is verified before sale and protected by our FanProtect money-back guarantee."],
        [f"What are the best seats for {name}?", f"It depends on your preference. Lower tier seats offer proximity to the pitch, while upper tiers provide panoramic views. Category 1 seats are closest to the action."],
        [f"How much do {name} tickets cost?", f"Prices vary by seat category and demand. We offer competitive pricing, often 30-40% below other resale platforms."],
        [f"Can I get a refund on {name} tickets?", "Yes. Our FanProtect guarantee covers cancellations and rescheduling. Full refund if the event doesn't take place."],
        [f"When is {name}?", f"Check our event page for confirmed match dates and kick-off times{' at ' + venue if venue else ''}{' in ' + city if city and city != 'Europe' else ''}."],
    ],
    "concert": lambda name, city, venue: [
        [f"How do I buy {name} tickets?", f"Buy verified {name} tickets on EuroMatchTickets. Select your section, pay securely, and receive instant e-tickets via QR code."],
        [f"Are {name} tickets authentic?", f"Yes. All tickets are 100% verified and backed by our FanProtect money-back guarantee."],
        [f"What is the best seating for {name}?", f"Floor/standing tickets offer the closest experience. Seated sections in lower tiers provide great views with comfort. VIP packages include premium perks."],
        [f"How much do {name} tickets cost?", f"Prices depend on seating category and date. We consistently offer lower prices than Viagogo and StubHub."],
        [f"Will I receive physical tickets for {name}?", "No physical tickets needed. You receive instant QR code e-tickets via email immediately after purchase."],
        [f"What happens if {name} is rescheduled?", "Your tickets remain valid for the new date. If you can't attend the rescheduled event, our FanProtect guarantee covers you for a full refund."],
    ],
    "worldcup": lambda name, city, venue: [
        [f"How do I buy {name} tickets?", f"Purchase verified {name} tickets on EuroMatchTickets. Select your match, choose your seats, and receive instant e-ticket delivery."],
        [f"Are {name} tickets official?", f"We are an independent resale marketplace. All tickets are 100% verified and backed by our FanProtect money-back guarantee."],
        [f"What are the FIFA World Cup 2026 venues?", "The 2026 FIFA World Cup will be hosted across the USA, Mexico, and Canada in 16 stadiums including MetLife Stadium (New York), Rose Bowl (Los Angeles), and Estadio Azteca (Mexico City)."],
        [f"How much do {name} cost?", f"Prices vary by match stage and seat category. Group stage tickets start from the lowest prices, while knockout rounds and the final command premium pricing."],
        [f"Can I get a refund on World Cup tickets?", "Yes. Our FanProtect guarantee provides a full refund if the match is cancelled. Rescheduled matches keep your ticket valid."],
        [f"How will I receive my World Cup tickets?", "Instant delivery via QR code e-ticket to your email. Access tickets anytime through your EuroMatchTickets account."],
    ],
}


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    pages = await db.seo_pages.find(
        {"active": True},
        {"_id": 1, "slug": 1, "title": 1, "category": 1, "city": 1, "venue": 1, "faq": 1}
    ).to_list(length=5000)

    updated = 0
    for page in pages:
        if page.get("faq") and len(page["faq"]) >= 4:
            continue

        cat = page.get("category", "other")
        title = page.get("title", "").split("–")[0].split("|")[0].strip()
        city = page.get("city", "Europe")
        venue = page.get("venue", "")

        # Get template or use football as default
        template_fn = FAQ_TEMPLATES.get(cat, FAQ_TEMPLATES.get("concerts", FAQ_TEMPLATES["football"]))
        if cat in ("concerts", "sports", "events", "city"):
            template_fn = FAQ_TEMPLATES["concert"] if cat == "concerts" else FAQ_TEMPLATES["football"]

        faqs = template_fn(title, city, venue)

        await db.seo_pages.update_one(
            {"_id": page["_id"]},
            {"$set": {"faq": faqs}}
        )
        updated += 1

    print(f"Added FAQs to {updated} pages")

    # Verify
    sample = await db.seo_pages.find_one(
        {"active": True, "faq": {"$exists": True, "$ne": []}},
        {"_id": 0, "title": 1, "faq": 1}
    )
    if sample:
        print(f"\nSample: {sample['title']}")
        for q, a in sample["faq"][:2]:
            print(f"  Q: {q}")
            print(f"  A: {a[:80]}...")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
