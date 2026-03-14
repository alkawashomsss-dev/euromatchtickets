"""
SEO Content Generator - Natural Language Content for Event Pages
Generates human-quality content that passes AI detection tools.
"""
import os
import logging
import random
from datetime import datetime, timezone
from database.db import db

logger = logging.getLogger(__name__)

# OpenAI client setup
openai_client = None
try:
    from openai import OpenAI
    api_key = os.environ.get('OPENAI_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
    if api_key:
        openai_client = OpenAI(api_key=api_key)
except ImportError:
    pass

ANTI_AI_SYSTEM = """You are a veteran European sports and entertainment journalist writing for a premium ticket marketplace.

CRITICAL RULES TO AVOID AI DETECTION:
1. NEVER use these words: delve, tapestry, landscape, vibrant, moreover, furthermore, in conclusion, it's worth noting, arguably, plethora, myriad, multifaceted, nuanced, paramount, pivotal, realm, robust, seamless, synergy, transformative, unprecedented, leveraging
2. Write like a real person - use contractions (it's, don't, we've, they'll)
3. Vary sentence length dramatically: mix 4-word sentences with 25-word ones
4. Include SPECIFIC numbers, dates, prices in euros
5. Add personal opinions and slight imperfections ("honestly", "if you ask me", "look,")
6. Reference real venues, real streets, real neighborhoods
7. Use active voice 90% of the time
8. Start paragraphs differently - never start two paragraphs the same way
9. Include at least one rhetorical question per article
10. Use colloquial phrases naturally ("the real kicker is", "here's the thing", "bottom line")
11. NO bullet points or numbered lists - write flowing paragraphs
12. Include a specific local tip that only someone who's been there would know
13. Mention competitor prices or comparison naturally
14. Write in a slightly informal, expert tone - like explaining to a friend over coffee

OUTPUT: Write 600-800 words in HTML paragraphs (<p> tags only). No h1/h2 headers. Include 2-3 internal links naturally using <a href="/events">text</a> format."""


async def generate_content_for_page(page):
    """Generate natural content for a single SEO page."""
    if not openai_client:
        return None
    
    slug = page.get("slug", "")
    title = page.get("title", slug.replace("-", " ").title())
    category = page.get("category", "events")
    city = page.get("city", "")
    price_low = page.get("price_low", 49)
    price_high = page.get("price_high", 299)
    year = page.get("year", 2026)
    
    # Randomize writing style for each article
    styles = [
        "Write as if you just returned from this event and are recommending it to a friend.",
        "Write from the perspective of a local ticket expert giving insider advice.",
        "Write like a travel blogger who covers European sporting and music events.",
        "Write as an experienced fan sharing tips with newcomers.",
    ]
    style = random.choice(styles)
    
    prompt = f"""{style}

Topic: {title}
Category: {category}
City: {city or 'European venue'}
Price range: €{price_low} - €{price_high}
Year: {year}

Write a unique, engaging article about buying tickets for this event. Include:
- What makes this event special and worth attending
- Practical ticket buying advice and price ranges in euros
- Venue details and what to expect on event day
- A local tip about the area (food, transport, neighborhoods)
- Why buying from EuroMatchTickets is the smart choice (FanProtect guarantee, QR instant delivery)

Remember: Write naturally. No AI patterns. Be specific. Be opinionated."""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": ANTI_AI_SYSTEM},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1200,
            temperature=0.9
        )
        content = response.choices[0].message.content
        
        # Post-processing: remove any AI-isms that slipped through
        ai_words = ["delve", "tapestry", "landscape", "vibrant", "moreover", "furthermore", "in conclusion", "it's worth noting", "plethora", "myriad", "multifaceted", "paramount", "pivotal", "realm", "robust", "seamless", "synergy", "transformative", "unprecedented"]
        for word in ai_words:
            content = content.replace(word, "")
            content = content.replace(word.capitalize(), "")
        
        # Clean up double spaces
        while "  " in content:
            content = content.replace("  ", " ")
        
        return content.strip()
    except Exception as e:
        logger.error(f"Content generation error for {slug}: {e}")
        return None


async def generate_content_batch(batch_size=10):
    """Generate content for empty SEO pages in batches."""
    empty_pages = await db.seo_pages.find(
        {"$or": [{"content": {"$exists": False}}, {"content": ""}, {"content": None}]},
        {"_id": 0}
    ).limit(batch_size).to_list(batch_size)
    
    results = {"generated": 0, "errors": 0, "slugs": []}
    
    for page in empty_pages:
        content = await generate_content_for_page(page)
        if content and len(content) > 200:
            await db.seo_pages.update_one(
                {"slug": page["slug"]},
                {"$set": {
                    "content": content,
                    "content_generated_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc)
                }}
            )
            results["generated"] += 1
            results["slugs"].append(page["slug"])
        else:
            results["errors"] += 1
    
    return results


async def cleanup_old_pages():
    """Remove 2025 and past event pages."""
    result = await db.seo_pages.delete_many({
        "$or": [
            {"year": {"$lt": 2026}},
            {"slug": {"$regex": "2025"}},
            {"slug": {"$regex": "2024"}}
        ]
    })
    return {"deleted": result.deleted_count}
