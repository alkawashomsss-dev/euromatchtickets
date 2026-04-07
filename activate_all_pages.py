"""
Comprehensive SEO fix:
1. Activate all 664 inactive pages (they were wrongly deactivated)
2. Add meta descriptions to all newly activated pages
3. Add FAQs to all newly activated pages
4. Generate optimized titles for all newly activated pages
"""
import asyncio
import os
import re
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "euromatchtickets")


def optimize_title(title, slug, category, city):
    t = title.split("|")[0].strip()
    t = re.sub(r'\s*(from|ab|depuis|da)\s*€?\d+[\d,.]*', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'\s*€\d+[\d,.]*', '', t).strip()
    t = t.rstrip(' –—-!.')
    event_name = t
    for s in ["Tickets", "tickets"]:
        event_name = event_name.replace(s, "").strip()
    event_name = re.sub(r'\s{2,}', ' ', event_name).strip()

    if category == "f1":
        result = f"{event_name} Tickets – Verified F1"
    elif category == "football":
        result = f"{event_name} Tickets – Verified Seller"
    elif category in ("concert", "concerts"):
        result = f"{event_name} Tickets – Verified Seller"
    elif category == "worldcup":
        result = f"{event_name} Tickets – FIFA 2026"
    else:
        result = f"{event_name} Tickets – Verified Seller"

    if len(result) > 60:
        result = result[:57] + "..."
    return result


def generate_meta(title, slug, category, city, venue, year):
    event_name = title.split("|")[0].strip()
    event_name = re.sub(r'\s*(from|ab)\s*€?\d+', '', event_name, flags=re.IGNORECASE).strip()
    for s in ["Tickets", "tickets", "| EuroMatchTickets"]:
        event_name = event_name.replace(s, "").strip()
    event_name = event_name.rstrip(' –—-!.')
    event_name = re.sub(r'\s{2,}', ' ', event_name).strip()
    vt = f" at {venue}" if venue and venue != city and venue != "Europe" else ""
    ct = f" in {city}" if city and city != "Europe" else ""

    if category == "f1":
        desc = f"Buy {event_name} tickets{vt}{ct}. Formula 1 {year} season. Verified tickets, instant e-delivery, secure checkout. Book your seats now."
    elif category == "football":
        desc = f"Buy {event_name} tickets{vt}{ct}. {year} season. Verified tickets, secure payment, instant e-delivery. Get your seats today."
    elif category in ("concert", "concerts"):
        desc = f"Buy {event_name} tickets{vt}{ct}. Live concert {year}. Verified seller, instant e-delivery, best seats available. Book now."
    elif category == "worldcup":
        desc = f"Buy {event_name} tickets{vt}{ct}. FIFA World Cup 2026. Verified tickets, secure checkout, instant delivery."
    else:
        desc = f"Buy {event_name} tickets{vt}{ct}. {year} event. Verified tickets, instant e-delivery, secure payment. Book your seats today."

    if len(desc) > 160:
        desc = desc[:157] + "..."
    elif len(desc) < 140:
        desc += " Trusted by fans across Europe."
        if len(desc) > 160:
            desc = desc[:157] + "..."
    return desc


FAQ_TEMPLATES = {
    "f1": lambda n, c, v: [
        [f"How do I buy {n} tickets?", f"Buy verified {n} tickets on EuroMatchTickets. Select your grandstand, complete secure checkout, receive instant e-ticket via QR code."],
        [f"Are {n} tickets verified?", "Yes. All tickets are 100% verified and backed by our FanProtect money-back guarantee."],
        [f"What is the cheapest way to attend {n}?", "General Admission tickets are the most affordable. We offer prices up to 40% lower than Viagogo and StubHub."],
        [f"When does {n} take place?", f"{n} is part of the Formula 1 2026 season{' at ' + v if v else ''}{' in ' + c if c and c != 'Europe' else ''}. Check our page for exact dates."],
        [f"Can I get a refund if {n} is cancelled?", "Yes. FanProtect guarantee covers cancellations with automatic full refund."],
    ],
    "football": lambda n, c, v: [
        [f"How do I buy {n} tickets?", f"Purchase verified {n} tickets on EuroMatchTickets. Choose your section, pay securely, receive instant e-ticket delivery."],
        [f"Are {n} tickets genuine?", "Every ticket is verified before sale and protected by our FanProtect money-back guarantee."],
        [f"What are the best seats for {n}?", f"Lower tier seats offer proximity to the pitch{' at ' + v if v else ''}. Category 1 seats are closest to the action."],
        [f"How much do {n} tickets cost?", "Prices vary by seat category. We offer competitive pricing, often 30-40% below other resale platforms."],
        [f"Can I get a refund on {n} tickets?", "Yes. FanProtect guarantee covers cancellations. Full refund if the event doesn't take place."],
    ],
    "concert": lambda n, c, v: [
        [f"How do I buy {n} tickets?", f"Buy verified {n} tickets on EuroMatchTickets. Select your section, pay securely, receive instant e-tickets via QR code."],
        [f"Are {n} tickets authentic?", "Yes. All tickets are 100% verified and backed by our FanProtect money-back guarantee."],
        [f"What is the best seating for {n}?", f"Floor/standing tickets offer the closest experience{' at ' + v if v else ''}. Seated sections in lower tiers provide great views."],
        [f"How much do {n} tickets cost?", "Prices depend on seating category and date. We consistently offer lower prices than Viagogo and StubHub."],
        [f"What happens if {n} is rescheduled?", "Tickets remain valid for the new date. FanProtect guarantee covers you for a full refund if you can't attend."],
    ],
}


def clean_event_name(title, slug):
    name = title.split("–")[0].split("|")[0].strip()
    name = re.sub(r'\s*Tickets?\s*', ' ', name, flags=re.IGNORECASE).strip()
    name = re.sub(r'\s*Verified\s*', '', name, flags=re.IGNORECASE).strip()
    name = re.sub(r'\s*(from|ab)\s*€?\d+', '', name, flags=re.IGNORECASE).strip()
    name = re.sub(r'\s{2,}', ' ', name).strip().rstrip(' –—-.')
    if not name or len(name) < 3:
        name = slug.replace('-', ' ').title().replace('Tickets', '').replace('2026', '').strip() + " 2026"
    return name


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Step 1: Activate ALL inactive pages
    result = await db.seo_pages.update_many(
        {"active": False},
        {"$set": {"active": True}}
    )
    print(f"Step 1: Activated {result.modified_count} pages")

    # Step 2: Update titles, meta descriptions, and FAQs for ALL pages that need it
    pages = await db.seo_pages.find(
        {"$or": [
            {"meta_description": {"$exists": False}},
            {"meta_description": ""},
            {"faq": {"$exists": False}},
            {"faq": []},
        ]},
        {"_id": 1, "slug": 1, "title": 1, "category": 1, "city": 1, "venue": 1, "year": 1}
    ).to_list(length=5000)

    print(f"Step 2: Updating {len(pages)} pages with missing meta/FAQ...")

    updated = 0
    for page in pages:
        slug = page.get("slug", "")
        title = page.get("title", slug)
        category = page.get("category", "other")
        city = page.get("city", "Europe")
        venue = page.get("venue", "")
        year = page.get("year", 2026)

        new_title = optimize_title(title, slug, category, city)
        new_meta = generate_meta(title, slug, category, city, venue, year)

        event_name = clean_event_name(title, slug)
        template_fn = FAQ_TEMPLATES.get(category, FAQ_TEMPLATES.get("football"))
        if not template_fn:
            template_fn = FAQ_TEMPLATES["football"]
        faqs = template_fn(event_name, city, venue)

        update_fields = {"meta_description": new_meta, "faq": faqs}
        # Only update title if it doesn't already look optimized
        if "–" not in title and "|" in title:
            update_fields["title"] = new_title

        await db.seo_pages.update_one(
            {"_id": page["_id"]},
            {"$set": update_fields}
        )
        updated += 1

    print(f"Step 2: Updated {updated} pages")

    # Step 3: Verify
    total = await db.seo_pages.count_documents({})
    active = await db.seo_pages.count_documents({"active": True})
    has_meta = await db.seo_pages.count_documents({"meta_description": {"$exists": True, "$ne": ""}})
    has_faq = await db.seo_pages.count_documents({"faq": {"$exists": True, "$ne": []}})

    print(f"\n=== FINAL STATUS ===")
    print(f"Total pages: {total}")
    print(f"Active: {active}")
    print(f"With meta description: {has_meta}")
    print(f"With FAQ: {has_faq}")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
