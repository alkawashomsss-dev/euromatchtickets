"""
Growth Engine backend tests - demand + leads + vitals + security headers
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ── Demand: Most Wanted ─────────────────────────────────────────────
class TestMostWanted:
    def test_returns_expected_structure(self, s):
        r = s.get(f"{BASE_URL}/api/demand/most-wanted?limit=20", timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("coming_soon", "confirmed", "total_leads_tracked", "generated_at"):
            assert k in d, f"missing {k}"
        assert isinstance(d["coming_soon"], list)
        assert isinstance(d["confirmed"], list)
        # coming_soon entries should have lead_count
        for row in d["coming_soon"]:
            assert "lead_count" in row, f"coming_soon missing lead_count: {row}"
        # confirmed entries should have href, price_from, image_url keys
        for row in d["confirmed"]:
            assert "href" in row
            assert "price_from" in row
            assert "image_url" in row

    def test_respects_limit(self, s):
        r = s.get(f"{BASE_URL}/api/demand/most-wanted?limit=5", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert len(d["confirmed"]) <= 5
        assert len(d["coming_soon"]) <= 5

    def test_invalid_limit_rejected(self, s):
        r = s.get(f"{BASE_URL}/api/demand/most-wanted?limit=0", timeout=30)
        assert r.status_code == 422
        r = s.get(f"{BASE_URL}/api/demand/most-wanted?limit=500", timeout=30)
        assert r.status_code == 422


# ── Demand: By City ─────────────────────────────────────────────────
class TestByCity:
    def test_amsterdam(self, s):
        r = s.get(f"{BASE_URL}/api/demand/by-city?city=Amsterdam", timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("city", "confirmed_count", "demand_count", "confirmed", "coming_soon"):
            assert k in d
        assert d["city"] == "amsterdam"
        assert d["confirmed_count"] == len(d["confirmed"])
        assert d["demand_count"] == len(d["coming_soon"])

    def test_case_insensitive(self, s):
        r1 = s.get(f"{BASE_URL}/api/demand/by-city?city=LONDON", timeout=30)
        r2 = s.get(f"{BASE_URL}/api/demand/by-city?city=london", timeout=30)
        assert r1.status_code == 200 and r2.status_code == 200
        assert r1.json()["confirmed_count"] == r2.json()["confirmed_count"]

    def test_london_has_events(self, s):
        r = s.get(f"{BASE_URL}/api/demand/by-city?city=London", timeout=30)
        assert r.status_code == 200
        assert r.json()["confirmed_count"] > 0, "expected London events"

    def test_invalid_city_rejected(self, s):
        for bad in ["x!", "<script>", "a", "a;drop"]:
            r = s.get(f"{BASE_URL}/api/demand/by-city", params={"city": bad}, timeout=30)
            assert r.status_code in (400, 422), f"{bad} -> {r.status_code} {r.text}"


# ── Demand: By Artist ───────────────────────────────────────────────
class TestByArtist:
    def test_structure(self, s):
        r = s.get(f"{BASE_URL}/api/demand/by-artist?artist=justin", timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("artist", "confirmed", "coming_soon"):
            assert k in d
        assert d["artist"] == "justin"

    def test_invalid_artist(self, s):
        r = s.get(f"{BASE_URL}/api/demand/by-artist", params={"artist": "bad;drop"}, timeout=30)
        assert r.status_code in (400, 422)


# ── Leads: capture + count ─────────────────────────────────────────
class TestLeads:
    SLUG = "justin-bieber-amsterdam-2026-tickets"

    def test_capture_valid(self, s):
        email = f"test_{int(time.time())}@example.com"
        r = s.post(
            f"{BASE_URL}/api/leads/capture",
            json={
                "email": email,
                "event_slug": self.SLUG,
                "artist": "Justin Bieber",
                "city": "Amsterdam",
            },
            timeout=30,
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d.get("subscribed") is True
        assert "total_signups" in d

    def test_capture_upsert_increments_demand(self, s):
        email = f"dup_{int(time.time())}@example.com"
        r1 = s.get(f"{BASE_URL}/api/demand/by-city?city=Amsterdam", timeout=30)
        before = 0
        for row in r1.json().get("coming_soon", []):
            if row.get("event_slug") == self.SLUG:
                before = row.get("lead_count", 0)
        # first capture
        s.post(f"{BASE_URL}/api/leads/capture",
               json={"email": email, "event_slug": self.SLUG,
                     "artist": "Justin Bieber", "city": "Amsterdam"}, timeout=30)
        # duplicate capture - should still increment lead_count (per current impl uses $inc always)
        s.post(f"{BASE_URL}/api/leads/capture",
               json={"email": email, "event_slug": self.SLUG,
                     "artist": "Justin Bieber", "city": "Amsterdam"}, timeout=30)
        r2 = s.get(f"{BASE_URL}/api/demand/by-city?city=Amsterdam", timeout=30)
        after = 0
        for row in r2.json().get("coming_soon", []):
            if row.get("event_slug") == self.SLUG:
                after = row.get("lead_count", 0)
        assert after > before, f"demand lead_count should increment: {before} -> {after}"

    def test_invalid_email_422(self, s):
        r = s.post(f"{BASE_URL}/api/leads/capture",
                   json={"email": "not-an-email", "event_slug": self.SLUG}, timeout=30)
        assert r.status_code == 422

    def test_invalid_slug_400(self, s):
        r = s.post(f"{BASE_URL}/api/leads/capture",
                   json={"email": "a@b.com", "event_slug": "BAD SLUG!!<>"}, timeout=30)
        assert r.status_code == 400
        assert "invalid_slug" in r.text

    def test_leads_count(self, s):
        r = s.get(f"{BASE_URL}/api/leads/count?event_slug={self.SLUG}", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert "total_signups" in d
        assert isinstance(d["total_signups"], int)


# ── Metrics Vitals ──────────────────────────────────────────────────
class TestVitals:
    def test_valid_lcp(self, s):
        r = s.post(f"{BASE_URL}/api/metrics/vitals",
                   json={"name": "LCP", "value": 2340, "rating": "good", "path": "/foo"},
                   timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d.get("ok") is True

    def test_unknown_metric_rejected(self, s):
        r = s.post(f"{BASE_URL}/api/metrics/vitals",
                   json={"name": "HACK", "value": 1, "rating": "good", "path": "/x"},
                   timeout=30)
        # Should return ok:false (per spec) - either 200+ok:false or 400/422
        if r.status_code == 200:
            assert r.json().get("ok") is False, r.json()
        else:
            assert r.status_code in (400, 422)


# ── Security Headers ────────────────────────────────────────────────
class TestSecurityHeaders:
    def test_events_robots_header(self, s):
        r = s.get(f"{BASE_URL}/api/events?limit=1", timeout=30)
        assert r.status_code == 200
        hdr = r.headers.get("X-Robots-Tag", "")
        # Per spec: should be index,follow for sitemap/merchant routes OR noindex for others
        assert hdr != "", "missing X-Robots-Tag on /api/events"

    def test_404_robots_noindex(self, s):
        r = s.get(f"{BASE_URL}/api/nothing-definitely-not-here-xyz", timeout=30)
        assert r.status_code == 404
        hdr = r.headers.get("X-Robots-Tag", "")
        assert "noindex" in hdr.lower(), f"expected noindex on 404, got: {hdr!r}"
