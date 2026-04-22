"""Tests for the honesty-layer fixes (waitlist, featured filter, coming_soon)."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://euro-indexing.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# Marketing waitlist
class TestWaitlist:
    def test_waitlist_post_valid(self):
        email = f"TEST_{uuid.uuid4().hex[:8]}@example.com"
        r = requests.post(f"{API}/marketing/waitlist", json={
            "email": email,
            "event_slug": "euro-indexing",
            "event_title": "Test Event",
        })
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True
        assert "waitlist_count" in data
        assert isinstance(data["waitlist_count"], int)
        assert data["waitlist_count"] >= 1

    def test_waitlist_post_invalid_email(self):
        r = requests.post(f"{API}/marketing/waitlist", json={
            "email": "notanemail",
            "event_slug": "euro-indexing",
            "event_title": "Test",
        })
        assert r.status_code == 400

    def test_waitlist_count_get(self):
        r = requests.get(f"{API}/marketing/waitlist/count/euro-indexing")
        assert r.status_code == 200
        data = r.json()
        assert data.get("slug") == "euro-indexing"
        assert isinstance(data.get("count"), int)


# Featured events must NOT include coming_soon items
class TestFeaturedExcludesComingSoon:
    def test_featured_no_coming_soon(self):
        r = requests.get(f"{API}/events", params={"featured": "true", "limit": 40})
        assert r.status_code == 200
        events = r.json()
        assert isinstance(events, list)
        for e in events:
            assert e.get("status") != "coming_soon", f"Event {e.get('title')} is coming_soon but featured"

    def test_featured_no_taylor_or_bieber(self):
        r = requests.get(f"{API}/events", params={"featured": "true", "limit": 40})
        assert r.status_code == 200
        events = r.json()
        bad = [e for e in events if any(k in (e.get("title") or "").lower() for k in ["taylor swift", "justin bieber"])]
        assert bad == [], f"Found banned featured items: {[e['title'] for e in bad]}"


# Taylor Swift events should be coming_soon, featured=false, no price
class TestTaylorSwiftStatus:
    def test_taylor_swift_event_state(self):
        r = requests.get(f"{API}/events/taylor-swift-eras-tour-london-2026-tickets")
        assert r.status_code == 200
        e = r.json()
        assert e.get("status") == "coming_soon", f"status={e.get('status')}"
        assert e.get("featured") in (False, None), f"featured={e.get('featured')}"
        # lowest_price should be null OR 0 OR not present (no fake price)
        lp = e.get("lowest_price")
        assert lp in (None, 0), f"lowest_price={lp}"
        assert (e.get("available_tickets") or 0) == 0


# Active F1 event has real price for hero/schema
class TestActiveEvent:
    def test_active_f1_event_exists(self):
        r = requests.get(f"{API}/events", params={"event_type": "f1", "limit": 5})
        assert r.status_code == 200
        events = r.json()
        active = [e for e in events if e.get("status") == "active"]
        assert active, "No active F1 events available"
        e = active[0]
        assert e.get("lowest_price") is not None and e["lowest_price"] > 0


# MotoGP events
class TestMotoGP:
    def test_motogp_events_exist(self):
        r = requests.get(f"{API}/events", params={"event_type": "motogp", "limit": 30})
        assert r.status_code == 200
        events = r.json()
        assert len(events) > 0, "Expected MotoGP events in DB"
