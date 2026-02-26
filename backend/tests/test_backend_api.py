"""
FanPass Backend API Tests
Tests for ticket marketplace endpoints including events, sitemap, and static pages.
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://ticket-market-test.preview.emergentagent.com')


class TestHealthAndBasicEndpoints:
    """Basic health check and API endpoint tests"""

    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "FanPass" in data["message"]
        print("✓ API root endpoint working")

    def test_sitemap_xml(self):
        """Test sitemap.xml endpoint returns valid XML"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200
        assert "application/xml" in response.headers.get("content-type", "")
        
        content = response.text
        # Verify XML structure
        assert '<?xml version="1.0" encoding="UTF-8"?>' in content
        assert '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' in content
        assert '</urlset>' in content
        
        # Verify static pages are included
        assert 'fanpass.com/' in content
        assert 'fanpass.com/events' in content
        assert 'fanpass.com/about' in content
        assert 'fanpass.com/terms' in content
        assert 'fanpass.com/contact' in content
        assert 'fanpass.com/refund-policy' in content
        
        # Verify event pages are included
        assert '/event/' in content
        print("✓ Sitemap.xml endpoint returns valid XML with all pages")

    def test_robots_txt(self):
        """Test robots.txt endpoint returns valid content"""
        response = requests.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200
        assert "text/plain" in response.headers.get("content-type", "")
        
        content = response.text
        # Verify required directives
        assert "User-agent:" in content
        assert "Allow:" in content
        assert "Disallow:" in content
        assert "Sitemap:" in content
        
        # Verify protected paths
        assert "/admin" in content
        assert "/seller" in content
        assert "/api/" in content
        print("✓ Robots.txt endpoint returns valid content")


class TestEventsEndpoints:
    """Tests for events API endpoints"""

    def test_get_all_events(self):
        """Test getting all events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        
        events = response.json()
        assert isinstance(events, list)
        assert len(events) > 0
        
        # Verify event structure
        event = events[0]
        assert "event_id" in event
        assert "title" in event
        assert "event_type" in event
        assert "venue" in event
        assert "city" in event
        print(f"✓ Events endpoint returned {len(events)} events")

    def test_get_featured_events(self):
        """Test getting featured events"""
        response = requests.get(f"{BASE_URL}/api/events?featured=true")
        assert response.status_code == 200
        
        events = response.json()
        assert isinstance(events, list)
        
        # All returned events should be featured
        for event in events:
            assert event.get("featured") == True
        print(f"✓ Featured events endpoint returned {len(events)} events")

    def test_get_concert_events(self):
        """Test filtering events by concert type"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=concert")
        assert response.status_code == 200
        
        events = response.json()
        assert isinstance(events, list)
        
        # All returned events should be concerts
        for event in events:
            assert event.get("event_type") == "concert"
        print(f"✓ Concert filter returned {len(events)} events")

    def test_get_match_events(self):
        """Test filtering events by match type"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=match")
        assert response.status_code == 200
        
        events = response.json()
        assert isinstance(events, list)
        
        # All returned events should be matches
        for event in events:
            assert event.get("event_type") == "match"
        print(f"✓ Match filter returned {len(events)} events")


class TestEventDetailsEndpoints:
    """Tests for specific event details"""

    def test_get_concert_event_details(self):
        """Test getting concert event details (The Weeknd - event_2a9d04dfa45e)"""
        response = requests.get(f"{BASE_URL}/api/events/event_2a9d04dfa45e")
        assert response.status_code == 200
        
        event = response.json()
        assert event["event_id"] == "event_2a9d04dfa45e"
        assert event["event_type"] == "concert"
        assert "The Weeknd" in event.get("title", "") or "Weeknd" in event.get("artist", "")
        
        # Verify concert has proper categories
        categories = event.get("categories", {})
        assert "vip" in categories or "floor" in categories
        
        # Verify tickets are included
        tickets = event.get("tickets", [])
        assert isinstance(tickets, list)
        assert len(tickets) > 0
        print(f"✓ Concert event details returned with {len(tickets)} tickets")

    def test_get_match_event_details(self):
        """Test getting match event details (England vs Uruguay - event_ab4a8ddedfc0)"""
        response = requests.get(f"{BASE_URL}/api/events/event_ab4a8ddedfc0")
        assert response.status_code == 200
        
        event = response.json()
        assert event["event_id"] == "event_ab4a8ddedfc0"
        assert event["event_type"] == "match"
        assert event.get("home_team") == "England"
        assert event.get("away_team") == "Uruguay"
        
        # Verify match has proper categories
        categories = event.get("categories", {})
        assert "vip" in categories or "cat1" in categories
        
        # Verify tickets are included
        tickets = event.get("tickets", [])
        assert isinstance(tickets, list)
        assert len(tickets) > 0
        print(f"✓ Match event details returned with {len(tickets)} tickets")

    def test_event_not_found(self):
        """Test 404 for non-existent event"""
        response = requests.get(f"{BASE_URL}/api/events/nonexistent_event_123")
        assert response.status_code == 404
        print("✓ Non-existent event returns 404")


class TestTicketsEndpoints:
    """Tests for tickets API endpoints"""

    def test_get_tickets_for_event(self):
        """Test getting tickets for a specific event"""
        response = requests.get(f"{BASE_URL}/api/tickets?event_id=event_2a9d04dfa45e")
        assert response.status_code == 200
        
        tickets = response.json()
        assert isinstance(tickets, list)
        
        # All tickets should be for the requested event
        for ticket in tickets:
            assert ticket.get("event_id") == "event_2a9d04dfa45e"
        print(f"✓ Tickets endpoint returned {len(tickets)} tickets for event")


class TestAuthEndpoints:
    """Tests for authentication endpoints"""

    def test_auth_me_unauthenticated(self):
        """Test auth/me returns 401 when not authenticated"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ Auth/me returns 401 when unauthenticated")


class TestDataIntegrity:
    """Tests for data integrity and consistency"""

    def test_event_has_required_fields(self):
        """Test that events have all required fields"""
        response = requests.get(f"{BASE_URL}/api/events")
        events = response.json()
        
        required_fields = ["event_id", "event_type", "title", "venue", "city", "country", "event_date"]
        
        for event in events[:5]:  # Check first 5 events
            for field in required_fields:
                assert field in event, f"Missing field: {field} in event {event.get('event_id')}"
        print("✓ All events have required fields")

    def test_ticket_has_required_fields(self):
        """Test that tickets have all required fields"""
        response = requests.get(f"{BASE_URL}/api/events/event_2a9d04dfa45e")
        event = response.json()
        tickets = event.get("tickets", [])
        
        required_fields = ["ticket_id", "event_id", "seller_id", "category", "price"]
        
        for ticket in tickets[:5]:  # Check first 5 tickets
            for field in required_fields:
                assert field in ticket, f"Missing field: {field} in ticket {ticket.get('ticket_id')}"
        print("✓ All tickets have required fields")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
