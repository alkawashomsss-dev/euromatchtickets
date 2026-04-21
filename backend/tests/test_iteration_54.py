"""
Iteration 54 regression tests:
  1. Lead capture idempotency – duplicate (email, slug) must NOT double-increment
     event_demand.lead_count. Only touch_count should grow in event_leads.
  2. Growth Engine pages still serve 200.
"""
import os
import time
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://euro-indexing.preview.emergentagent.com").rstrip("/")
SLUG = "justin-bieber-amsterdam-2026-tickets"
CITY = "Amsterdam"


def _fetch_lead_count_for_slug(slug: str):
    """Return lead_count for the given slug from /api/demand/by-city, or None."""
    r = requests.get(f"{BASE_URL}/api/demand/by-city", params={"city": CITY}, timeout=20)
    assert r.status_code == 200, f"/api/demand/by-city failed: {r.status_code} {r.text[:200]}"
    data = r.json()
    rows = data.get("rows") or data.get("items") or data.get("demand") or []
    if isinstance(data, list):
        rows = data
    for row in rows:
        if row.get("event_slug") == slug or row.get("slug") == slug:
            return row.get("lead_count")
    return None


def _fetch_lead_count_fallback(slug: str):
    """Fallback: read total_signups from /api/leads/count (event_leads doc count)."""
    r = requests.get(f"{BASE_URL}/api/leads/count", params={"event_slug": slug}, timeout=20)
    assert r.status_code == 200, f"/api/leads/count failed: {r.status_code}"
    return r.json().get("total_signups")


# -------- Lead capture idempotency --------
class TestLeadIdempotency:
    def test_duplicate_capture_does_not_inflate_lead_count(self):
        email = "test@example.com"  # existing lead per problem statement

        # 1. Baseline from demand endpoint
        before_demand = _fetch_lead_count_for_slug(SLUG)
        before_signups = _fetch_lead_count_fallback(SLUG)

        # 2. POST duplicate capture
        resp = requests.post(
            f"{BASE_URL}/api/leads/capture",
            json={
                "email": email,
                "event_slug": SLUG,
                "event_name": "Justin Bieber Amsterdam 2026",
                "artist": "Justin Bieber",
                "city": CITY,
                "source": "coming_soon",
            },
            timeout=20,
        )
        assert resp.status_code == 200, f"capture failed: {resp.status_code} {resp.text[:200]}"
        body = resp.json()
        assert body.get("subscribed") is True

        time.sleep(0.5)

        # 3. Re-fetch and assert equal
        after_demand = _fetch_lead_count_for_slug(SLUG)
        after_signups = _fetch_lead_count_fallback(SLUG)

        # event_leads count should never grow on duplicate email
        assert after_signups == before_signups, (
            f"event_leads signup count grew on duplicate! before={before_signups} after={after_signups}"
        )

        # event_demand.lead_count should be stable (the core regression)
        if before_demand is not None and after_demand is not None:
            assert after_demand == before_demand, (
                f"event_demand.lead_count inflated on duplicate! before={before_demand} after={after_demand}"
            )

    def test_new_email_does_increment(self):
        unique_email = f"test_iter54_{int(time.time())}@example.com"
        before_signups = _fetch_lead_count_fallback(SLUG)

        resp = requests.post(
            f"{BASE_URL}/api/leads/capture",
            json={
                "email": unique_email,
                "event_slug": SLUG,
                "artist": "Justin Bieber",
                "city": CITY,
            },
            timeout=20,
        )
        assert resp.status_code == 200
        time.sleep(0.5)
        after_signups = _fetch_lead_count_fallback(SLUG)
        assert after_signups == before_signups + 1, (
            f"new-email signup did not increment: before={before_signups} after={after_signups}"
        )


# -------- Growth-engine pages still render --------
class TestGrowthEnginePages:
    GROWTH_PAGES = [
        "/concerts-in-amsterdam-2026",
        "/concerts-in-london-2026",
        "/europe-tours-2026",
        "/most-wanted-concerts-2026",
    ]

    def test_growth_pages_status(self):
        for path in self.GROWTH_PAGES:
            r = requests.get(f"{BASE_URL}{path}", timeout=20)
            assert r.status_code == 200, f"{path} returned {r.status_code}"
            # Should be SPA shell (html)
            assert "<html" in r.text.lower()

    def test_justin_bieber_page_status(self):
        r = requests.get(f"{BASE_URL}/{SLUG}", timeout=20)
        assert r.status_code == 200

    def test_justin_bieber_raw_html_has_no_static_robots_meta(self):
        """Raw HTTP body must NOT include a hardcoded <meta name=robots> tag
        (meta robots is only injected by the pre-hydration JS)."""
        r = requests.get(f"{BASE_URL}/{SLUG}", timeout=20)
        # Look for any literal <meta name="robots" ...> in raw html
        lower = r.text.lower()
        # Count occurrences of 'name="robots"' in static HTML (pre-JS)
        # The pre-hydration script contains the string inside JS, that's fine.
        # What's forbidden is a real meta TAG: <meta ... name="robots"
        import re as _re
        meta_robots_tags = _re.findall(r'<meta[^>]+name=["\']robots["\'][^>]*>', r.text, _re.IGNORECASE)
        assert len(meta_robots_tags) == 0, (
            f"Found static <meta name=robots> tags in raw HTML — should be injected by JS only. Found: {meta_robots_tags}"
        )
