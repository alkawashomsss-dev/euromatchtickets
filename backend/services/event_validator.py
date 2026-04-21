"""
Event Validation Engine
=======================
Central truth-source for which pages/events are allowed to be INDEXED by Google.

Rules:
  - confirmed   → has verified date + venue + official source  → index, follow
  - coming_soon → artist/event speculated (no official announcement) → noindex, follow
  - expired     → past event                                     → noindex + 410 or redirect
  - missing     → slug not found anywhere                        → HTTP 404

This module does NOT write to DB. It READS from MongoDB + a hard-coded unverified
pages list for marketing/demand pages that don't have a DB event record.
"""

from datetime import datetime, timezone
from typing import Optional, Literal, Tuple


# ────────────────────────────────────────────────────────────────────
# UNVERIFIED DEMAND PAGES
# ────────────────────────────────────────────────────────────────────
# These are marketing/landing pages for artists/events WITHOUT a confirmed
# official tour date. They MUST render as Coming Soon (noindex, no prices,
# no Product schema, email capture only) until the dates are officially
# confirmed.
#
# To promote a page to "confirmed", REMOVE it from this set AND create a
# proper events row in the `events` collection with a real date + venue.
# ────────────────────────────────────────────────────────────────────
UNVERIFIED_DEMAND_PAGES = {
    # Slug (no leading slash)
    "justin-bieber-amsterdam-2026-tickets",
    # Add more speculative demand pages here as Google flags them:
    # "example-artist-city-2026-tickets",
}


def is_unverified_demand_page(path: str) -> bool:
    """Return True if this slug is a speculative/unverified demand page."""
    p = (path or "").strip("/").lower()
    return p in UNVERIFIED_DEMAND_PAGES


EventStatus = Literal["confirmed", "coming_soon", "expired", "missing"]


async def validate_event_slug(db, slug: str) -> Tuple[EventStatus, Optional[dict]]:
    """
    Look up an event by slug and return (status, event_doc_or_None).

    Status decision tree:
      1. Not in DB                                   → "missing"
      2. event_date in the past                      → "expired"
      3. event_date + venue present + status=upcoming → "confirmed"
      4. Anything else (missing date/venue)           → "coming_soon"
    """
    if not slug:
        return ("missing", None)

    event = await db.events.find_one(
        {"slug": slug},
        {"_id": 0}
    )
    if not event:
        # Try by event_id (legacy ugly URLs)
        event = await db.events.find_one(
            {"event_id": slug},
            {"_id": 0}
        )
    if not event:
        return ("missing", None)

    event_date = event.get("event_date")
    venue = event.get("venue")
    status = (event.get("status") or "").lower()

    # Parse date
    dt = None
    if isinstance(event_date, str) and len(event_date) >= 10:
        try:
            dt = datetime.fromisoformat(event_date.replace("Z", "+00:00"))
        except Exception:
            dt = None
    elif isinstance(event_date, datetime):
        dt = event_date

    now = datetime.now(timezone.utc)
    if dt is not None and dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    if status in ("past_event", "expired", "cancelled"):
        return ("expired", event)

    if dt is not None and dt < now:
        return ("expired", event)

    if dt is not None and venue and status in ("upcoming", "on_sale", "active", ""):
        return ("confirmed", event)

    return ("coming_soon", event)


def robots_tag_for_path(path: str, status: Optional[EventStatus] = None) -> str:
    """
    Decide the `X-Robots-Tag` + `<meta robots>` value for a path.

    Always returns one of:
      - "index, follow"
      - "noindex, follow"
      - "noindex, nofollow"
    """
    # 1. Known unverified demand pages → noindex, follow (let link equity flow)
    if is_unverified_demand_page(path):
        return "noindex, follow"

    # 2. Explicit event status
    if status == "coming_soon":
        return "noindex, follow"
    if status == "expired":
        return "noindex, nofollow"
    if status == "missing":
        return "noindex, nofollow"

    # 3. Default: index
    return "index, follow"
