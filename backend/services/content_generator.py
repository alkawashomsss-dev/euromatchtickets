"""
SEO Content Generator - Natural Language Content for Event Pages
Uses Emergent LLM Key with OpenAI GPT-4o to generate human-quality content.
"""
import os
import logging
import random
import uuid
from datetime import datetime, timezone
from database.db import db
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

SYSTEM_PROMPT = """You are a veteran European sports and entertainment journalist writing for a premium ticket marketplace called EuroMatchTickets.

CRITICAL RULES TO AVOID AI DETECTION:
1. NEVER use these words: delve, tapestry, landscape, vibrant, moreover, furthermore, in conclusion, it's worth noting, arguably, plethora, myriad, multifaceted, nuanced, paramount, pivotal, realm, robust, seamless, synergy, transformative, unprecedented, leveraging, elevate, embark, foster
2. Write like a real person - use contractions (it's, don't, we've, they'll)
3. Vary sentence length dramatically: mix 4-word sentences with 25-word ones
4. Include SPECIFIC numbers, dates, prices in euros
5. Add personal opinions and slight imperfections ("honestly", "if you ask me", "look,")
6. Reference real venues, real streets, real neighborhoods
7. Use active voice 90% of the time
8. Start paragraphs differently - never start two paragraphs the same way
9. Include at least one rhetorical question per article
10. Use colloquial phrases naturally ("the real kicker is", "here's the thing", "bottom line")
11. NO bullet points or numbered lists - write flowing paragraphs only
12. Include a specific local tip that only someone who's been there would know
13. Mention competitor prices or comparison naturally
14. Write in a slightly informal, expert tone - like explaining to a friend over coffee

OUTPUT FORMAT: Write 600-800 words in HTML paragraphs using <p> tags ONLY. No <h1>, <h2>, or any header tags. No markdown. No bullet points. Include 2-3 internal links naturally using <a href="/events">browse more events</a> or <a href="/f1-tickets">F1 tickets</a> format. Output ONLY the HTML content, no preamble."""


WRITING_STYLES = [
    "Write as if you just returned from this event and are recommending it to a friend.",
    "Write from the perspective of a local ticket expert giving insider advice.",
    "Write like a travel blogger who covers European sporting and music events.",
    "Write as an experienced fan sharing tips with newcomers.",
    "Write like a journalist covering the event scene for a lifestyle magazine.",
]


async def generate_content_for_page(page: dict) -> str | None:
    """Generate natural, human-like content for a single SEO page using Emergent LLM."""
    if not EMERGENT_LLM_KEY:
        logger.error("EMERGENT_LLM_KEY not found in environment")
        return None

    slug = page.get("slug", "")
    title = page.get("title", slug.replace("-", " ").title())
    category = page.get("category", "events")
    city = page.get("city", "")
    price_low = page.get("price_low", 49)
    price_high = page.get("price_high", 299)
    year = page.get("year", 2026)
    page_type = page.get("page_type", "event")

    style = random.choice(WRITING_STYLES)

    # Build category-specific context
    cat_context = {
        "f1": "Formula 1 racing, Grand Prix circuits, paddock access, race day atmosphere, team garages",
        "football": "European football, stadium atmosphere, fan culture, derby matches, Champions League nights",
        "concert": "live music, concert venues, artist performances, VIP experiences, festival vibes",
        "worldcup": "FIFA World Cup 2026, international football, host cities, group stages, knockout rounds",
        "motogp": "MotoGP racing, motorcycle Grand Prix, circuit details, race weekend schedule",
    }.get(category, "live events, entertainment, European venues")

    prompt = f"""{style}

Topic: {title}
Category: {category} ({cat_context})
City: {city or 'European venue'}
Price range: €{price_low} - €{price_high}
Year: {year}
Page type: {page_type}

Write a unique, engaging article about buying tickets for this event. Include:
- What makes this event special and worth attending
- Practical ticket buying advice and price ranges in euros
- Venue details and what to expect on event day
- A local tip about the area (food, transport, neighborhoods)
- Why buying from EuroMatchTickets is the smart choice (FanProtect guarantee, QR instant delivery)
- A natural call-to-action encouraging ticket purchase

Remember: Write naturally. No AI patterns. Be specific. Be opinionated. Use HTML <p> tags only."""

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"seo-content-{uuid.uuid4().hex[:8]}",
            system_message=SYSTEM_PROMPT,
        ).with_model("openai", "gpt-4o")

        user_msg = UserMessage(text=prompt)
        content = await chat.send_message(user_msg)

        if not content or len(content) < 200:
            logger.warning(f"Content too short for {slug}: {len(content) if content else 0} chars")
            return None

        # Post-processing: remove any AI-isms that slipped through
        ai_words = [
            "delve", "tapestry", "landscape", "vibrant", "moreover", "furthermore",
            "in conclusion", "it's worth noting", "plethora", "myriad", "multifaceted",
            "paramount", "pivotal", "realm", "robust", "seamless", "synergy",
            "transformative", "unprecedented", "leveraging", "elevate", "embark", "foster",
        ]
        for word in ai_words:
            content = content.replace(word, "")
            content = content.replace(word.capitalize(), "")

        # Clean up double spaces
        while "  " in content:
            content = content.replace("  ", " ")

        return content.strip()
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Content generation error for {slug}: {error_msg}")
        if "Budget has been exceeded" in error_msg:
            raise RuntimeError("BUDGET_EXCEEDED")
        return None


async def generate_content_batch(batch_size: int = 5) -> dict:
    """Generate content for a batch of SEO pages that have template/low-quality content."""
    # Find pages without AI-generated content
    pages = await db.seo_pages.find(
        {"content_generated_at": {"$exists": False}},
        {"_id": 0},
    ).limit(batch_size).to_list(batch_size)

    if not pages:
        return {"generated": 0, "errors": 0, "remaining": 0, "message": "All pages already have AI content"}

    results = {"generated": 0, "errors": 0, "slugs": [], "error_slugs": []}

    for page in pages:
        content = await generate_content_for_page(page)
        if content and len(content) > 200:
            await db.seo_pages.update_one(
                {"slug": page["slug"]},
                {"$set": {
                    "content": content,
                    "content_generated_at": datetime.now(timezone.utc).isoformat(),
                    "content_quality": "ai_generated",
                    "updated_at": datetime.now(timezone.utc),
                }},
            )
            results["generated"] += 1
            results["slugs"].append(page["slug"])
        else:
            results["errors"] += 1
            results["error_slugs"].append(page["slug"])

    remaining = await db.seo_pages.count_documents({"content_generated_at": {"$exists": False}})
    results["remaining"] = remaining
    return results


async def get_content_stats() -> dict:
    """Get statistics about content generation progress."""
    total = await db.seo_pages.count_documents({})
    ai_generated = await db.seo_pages.count_documents({"content_generated_at": {"$exists": True}})
    template_only = total - ai_generated

    return {
        "total_pages": total,
        "ai_generated": ai_generated,
        "template_only": template_only,
        "progress_percent": round((ai_generated / total * 100), 1) if total > 0 else 0,
    }
