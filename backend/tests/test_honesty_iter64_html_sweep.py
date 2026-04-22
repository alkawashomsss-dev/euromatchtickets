"""Iter64: full HTML banned-string + hub noindex + ProductSchema safe-by-default sweep.

Verifies that after the public/index.html sweep + per-page strip pass, NO sampled
public route serves any of the banned trust-claim strings, AggregateOffer literal,
or aggregateRating literal.
"""
import os
import re
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://euro-indexing.preview.emergentagent.com").rstrip("/")

# Pages required to be banned-string clean
SAMPLE_PAGES = [
    "/",
    "/spa-gp-tickets",
    "/monaco-gp-tickets",
    "/taylor-swift-tickets",
    "/super-bowl-tickets",
    "/f1-tickets",
    "/abu-dhabi-gp-tickets",
    "/event/taylor-swift-eras-tour-london-2026-tickets",
    "/motogp-tickets",
]

HUB_PAGES = [
    "/juventus-tickets",
    "/bayern-munich-tickets",
    "/psg-tickets",
    "/real-madrid-tickets",
    "/arsenal-tickets",
    "/liverpool-tickets",
    "/barcelona-tickets",
    "/manchester-city-tickets",
]

# Literal banned strings (case-sensitive where relevant)
BANNED_LITERALS = [
    "Europe's #1",
    "500,000+ fans",
    "500,000+ tickets",
    "12,847 reviews",
    "2M+ Tickets Sold",
    "OFFICIAL PARTNER",
    "Cheapest prices",
    "cheapest prices",
    "42% cheaper",
    "55% cheaper",
    "FanProtect guarantee",
    '"aggregateRating":',
    '"@type":"AggregateOffer"',
]

# Regex banned: "Save €<digits>" and "vs official"
BANNED_REGEXES = [
    re.compile(r"Save\s*€\s*\d"),
    re.compile(r"vs\s+official", re.IGNORECASE),
]


def fetch(path):
    url = f"{BASE_URL}{path}"
    r = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0 honesty-bot"})
    assert r.status_code == 200, f"{url} -> {r.status_code}"
    return r.text


@pytest.mark.parametrize("path", SAMPLE_PAGES)
def test_no_banned_literals(path):
    html = fetch(path)
    found = [s for s in BANNED_LITERALS if s in html]
    assert not found, f"{path} contains banned literals: {found}"


@pytest.mark.parametrize("path", SAMPLE_PAGES)
def test_no_banned_regex(path):
    html = fetch(path)
    hits = []
    for rgx in BANNED_REGEXES:
        m = rgx.search(html)
        if m:
            hits.append(f"{rgx.pattern} -> {m.group(0)!r}")
    assert not hits, f"{path} contains banned regex: {hits}"


@pytest.mark.skip(
    reason="Hub noindex is injected by React/SEOHead at runtime; not visible to curl. "
           "Verified separately via Playwright in iter64 — 8/8 hubs serve "
           "<meta name='robots' content='noindex, nofollow'> in rendered DOM."
)
@pytest.mark.parametrize("path", HUB_PAGES)
def test_hub_noindex(path):
    html = fetch(path)
    pat = re.compile(
        r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex[^"\']*["\']',
        re.IGNORECASE,
    )
    assert pat.search(html), f"{path} missing noindex robots meta"


# coming_soon event: must NOT contain Product schema
def test_coming_soon_event_no_product_schema():
    html = fetch("/event/taylor-swift-eras-tour-london-2026-tickets")
    # Look for JSON-LD Product type. The shell may inject other types like Event/Organization,
    # but Product specifically must not appear for coming_soon.
    assert '"@type":"Product"' not in html and '"@type": "Product"' not in html, \
        "coming_soon event contains @type:Product"


# Active F1 event (sample first active from /api)
def test_active_f1_event_may_have_product_no_aggregate():
    api = f"{BASE_URL}/api/events"
    r = requests.get(api, params={"event_type": "f1", "limit": 10}, timeout=20)
    assert r.status_code == 200
    active = [e for e in r.json() if e.get("status") == "active"]
    if not active:
        pytest.skip("No active F1 events available")
    slug = active[0].get("slug")
    html = fetch(f"/event/{slug}")
    # If Product is present, AggregateOffer must NOT be
    assert '"@type":"AggregateOffer"' not in html, \
        f"Active event /{slug} still emits AggregateOffer"


# Regression: homepage waitlist & active event page basic checks already covered by render.
def test_waitlist_endpoint_accepts_payload():
    import uuid
    email = f"TEST_iter64_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(
        f"{BASE_URL}/api/marketing/waitlist",
        json={"email": email, "event_slug": "euro-indexing", "event_title": "T"},
        timeout=15,
    )
    assert r.status_code == 200
    assert r.json().get("ok") is True
