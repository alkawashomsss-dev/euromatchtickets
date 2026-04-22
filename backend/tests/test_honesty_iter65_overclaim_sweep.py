"""Iter65: overclaim sweep for 100%-style claims, fake review signals,
duplicate trust ribbons, hero copy softening, pricing context, footer softening,
and public/index.html meta-map CTAs.
"""
import os
import re
import uuid
import requests
import pytest

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL", "https://euro-indexing.preview.emergentagent.com"
).rstrip("/")

HEADERS = {"User-Agent": "Mozilla/5.0 honesty-iter65"}

# Pages that must be 100%-claim clean
SWEEP_PAGES = [
    "/",
    "/world-cup-2026",
    "/spa-gp-tickets",
    "/monaco-gp-tickets",
    "/super-bowl-tickets",
    "/f1-tickets",
]

# Banned 100% claims
BANNED_100 = [
    "100% Money Back",
    "100% Money-Back",
    "100% money back",
    "100% money-back",
    "100% secure",
    "100% Secure",
    "100% 5-Star",
    "100% 5-star",
    "100% Verified Purchases",
    "100% verified purchases",
    "100% guaranteed",
    "100% Guaranteed",
    "100% verified sellers",
]

HUB_PAGES = ["/real-madrid-tickets", "/barcelona-tickets", "/liverpool-tickets"]


def fetch(path):
    url = f"{BASE_URL}{path}"
    r = requests.get(url, timeout=30, headers=HEADERS)
    assert r.status_code == 200, f"{url} -> {r.status_code}"
    return r.text


# ---------- Check 1: Banned 100%-claim sweep across 6 pages ----------
@pytest.mark.parametrize("path", SWEEP_PAGES)
def test_no_100_percent_claims(path):
    html = fetch(path)
    found = [s for s in BANNED_100 if s in html]
    assert not found, f"{path} still contains banned 100% claims: {found}"


# ---------- Check 2: Fake review summary signals absent from homepage ----------
FAKE_REVIEW_SIGNALS = [
    "5.0 Average Rating",
    "2,940 Total Reviews",
    "100% 5-Star Reviews",
    "100% Verified Purchases",
]


def test_homepage_no_fake_review_signals():
    html = fetch("/")
    found = [s for s in FAKE_REVIEW_SIGNALS if s in html]
    assert not found, f"Homepage still contains fake review signals: {found}"


# ---------- Check 3: Duplicate trust ribbon removed from homepage ----------
def test_homepage_no_duplicate_trust_ribbon():
    html = fetch("/")
    # The banned scrolling ticker contained this exact 5-part phrase
    banned = "BUYER PROTECTION · QR TICKET DELIVERY · ENCRYPTED PAYMENTS · EUROPEAN MARKETPLACE · VERIFIED SELLERS"
    assert banned not in html, "Duplicate scrolling trust ribbon still rendered on homepage"


# ---------- Check 4: Hero softened ----------
def test_homepage_hero_softened():
    html = fetch("/")
    # Must NOT contain the overclaim
    assert "biggest football event ever" not in html.lower(), \
        "Hero still claims 'biggest football event ever'"
    # Must contain softened copy
    assert "FIFA World Cup 2026" in html, "Hero missing 'FIFA World Cup 2026' reference"


# ---------- Check 5: From €150 price context + CTA label changes ----------
def test_homepage_price_context_and_cta_labels():
    html = fetch("/")
    # Subtext context
    assert "based on current listings" in html.lower(), \
        "Homepage missing 'based on current listings' subtext under €150 figure"
    # CTA label change: Buy -> View
    assert "Buy World Cup Tickets" not in html, \
        "Homepage CTA still labelled 'Buy World Cup Tickets'"
    assert "View World Cup Tickets" in html, \
        "Homepage missing 'View World Cup Tickets' CTA label"
    assert "Explore Events" in html, \
        "Homepage missing 'Explore Events' CTA label"


# ---------- Check 6: Inflated review counts absent ----------
INFLATED_COUNTS = ["12,000+", "4.9/5", "2,940"]


def test_homepage_no_inflated_counts():
    html = fetch("/")
    found = [s for s in INFLATED_COUNTS if s in html]
    assert not found, f"Homepage still contains inflated review stats: {found}"


# ---------- Check 7: Footer overclaim softened ----------
def test_footer_refund_softened():
    html = fetch("/")
    assert "All purchases covered by 100% Money Back Guarantee" not in html, \
        "Footer still has '100% Money Back Guarantee' overclaim"
    assert "Refund available according to our refund policy" in html, \
        "Footer missing softened refund line"


# ---------- Check 8: public/index.html meta-map CTAs ----------
def test_index_html_no_buy_prefix_in_meta_map():
    html = fetch("/")
    # Hard-coded route tuple pattern: ,'Buy  ->  must be replaced with ,'View
    # Use a regex that matches the pattern in the shell meta-map
    bad_pattern = re.compile(r",\s*'Buy\s+[A-Z]")
    m = bad_pattern.search(html)
    assert not m, f"public/index.html meta-map still has ,'Buy <X>' CTA tuple: {m.group(0) if m else ''}"

    # Also ensure no '100% verified sellers' left in shell
    assert "100% verified sellers" not in html, \
        "Shell still contains '100% verified sellers'"


# ---------- Check 9a: /api/marketing/waitlist still accepts payload ----------
def test_waitlist_endpoint_still_accepts():
    email = f"TEST_iter65_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(
        f"{BASE_URL}/api/marketing/waitlist",
        json={"email": email, "event_slug": "euro-indexing", "event_title": "T"},
        timeout=15,
    )
    assert r.status_code == 200
    body = r.json()
    assert body.get("ok") is True


# ---------- Check 9b: /api/events?featured=true returns >=1 active event ----------
def test_featured_events_returns_active():
    r = requests.get(f"{BASE_URL}/api/events", params={"featured": "true"}, timeout=20)
    assert r.status_code == 200
    events = r.json()
    assert isinstance(events, list) and len(events) >= 1, \
        f"featured=true returned no events ({len(events) if isinstance(events, list) else 'n/a'})"
    # None should be coming_soon (per regression requirement)
    cs = [e for e in events if e.get("status") == "coming_soon"]
    assert not cs, f"featured endpoint returned coming_soon events: {[e.get('slug') for e in cs]}"


# ---------- Check 9c: Hub pages render LiveClubHubPage content ----------
@pytest.mark.parametrize("path", HUB_PAGES)
def test_hub_pages_render(path):
    html = fetch(path)
    # Basic render check - should return 200 and have some content
    assert len(html) > 1000, f"{path} returned suspiciously small HTML"
    # Hub pages must NOT contain the banned 100% claims either
    found = [s for s in BANNED_100 if s in html]
    assert not found, f"{path} still contains banned 100% claims: {found}"
