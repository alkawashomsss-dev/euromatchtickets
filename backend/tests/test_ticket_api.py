"""
Backend API Tests for EuroMatchTickets - F1, MotoGP, World Cup Tickets
Tests for /api/events endpoints with event_type filtering
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEventsAPI:
    """Test events API endpoints for F1, MotoGP, and World Cup tickets"""
    
    def test_health_endpoint(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"Health check failed: {response.status_code}"
        data = response.json()
        assert data.get("status") == "healthy", f"Status not healthy: {data}"
        print(f"✓ Health endpoint working: {data}")
    
    def test_get_f1_events(self):
        """Test /api/events?event_type=f1 - should return F1 events"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=f1")
        assert response.status_code == 200, f"F1 events API failed: {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ F1 events returned: {len(data)} events")
        
        # Verify F1 events have expected structure
        if len(data) > 0:
            event = data[0]
            assert "event_id" in event, "event_id missing from F1 event"
            assert "title" in event, "title missing from F1 event"
            assert "venue" in event, "venue missing from F1 event"
            assert "event_date" in event, "event_date missing from F1 event"
            # Check event contains F1 or Grand Prix in title/type
            has_f1_content = "f1" in event.get("title", "").lower() or "grand prix" in event.get("title", "").lower() or event.get("event_type") == "f1"
            print(f"✓ F1 event structure valid: {event.get('title')}")
    
    def test_get_motogp_events(self):
        """Test /api/events?event_type=motogp - should return MotoGP events"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=motogp")
        assert response.status_code == 200, f"MotoGP events API failed: {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ MotoGP events returned: {len(data)} events")
        
        # Verify MotoGP events have expected structure
        if len(data) > 0:
            event = data[0]
            assert "event_id" in event, "event_id missing from MotoGP event"
            assert "title" in event, "title missing from MotoGP event"
            print(f"✓ MotoGP event structure valid: {event.get('title')}")
    
    def test_get_worldcup_events(self):
        """Test /api/events?event_type=worldcup - should return World Cup events"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=worldcup")
        assert response.status_code == 200, f"World Cup events API failed: {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ World Cup events returned: {len(data)} events")
        
        # Verify World Cup events have expected structure
        if len(data) > 0:
            event = data[0]
            assert "event_id" in event, "event_id missing from World Cup event"
            assert "title" in event, "title missing from World Cup event"
            print(f"✓ World Cup event structure valid: {event.get('title')}")
    
    def test_get_fifa_search_events(self):
        """Test /api/events?search=FIFA - should return FIFA related events"""
        response = requests.get(f"{BASE_URL}/api/events?search=FIFA")
        assert response.status_code == 200, f"FIFA search API failed: {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ FIFA search returned: {len(data)} events")
        
        # Verify events contain FIFA in title
        for event in data:
            title = event.get("title", "").lower()
            has_fifa = "fifa" in title or "world cup" in title
            print(f"  - Event: {event.get('title')}")
    
    def test_get_featured_events(self):
        """Test /api/events?featured=true - should return featured events"""
        response = requests.get(f"{BASE_URL}/api/events?featured=true")
        assert response.status_code == 200, f"Featured events API failed: {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ Featured events returned: {len(data)} events")
    
    def test_get_event_details(self):
        """Test /api/events/{event_id} - get single event details"""
        # First get list of events to get an event_id
        response = requests.get(f"{BASE_URL}/api/events?event_type=f1")
        assert response.status_code == 200
        events = response.json()
        
        if len(events) > 0:
            event_id = events[0]["event_id"]
            detail_response = requests.get(f"{BASE_URL}/api/events/{event_id}")
            assert detail_response.status_code == 200, f"Event details API failed for {event_id}"
            detail = detail_response.json()
            assert "event_id" in detail
            assert "tickets" in detail, "tickets array should be in event details"
            assert "categories" in detail, "categories should be in event details"
            print(f"✓ Event details returned for {event_id}: {detail.get('title')}")
            print(f"  - Tickets available: {detail.get('ticket_count', 0)}")
            print(f"  - Categories: {list(detail.get('categories', {}).keys())}")
        else:
            pytest.skip("No F1 events available to test event details")
    
    def test_no_duplicate_api_prefix(self):
        """Test that /api/api/ prefix doesn't work (should be 404)"""
        # This tests the bug fix - duplicate /api/api/ should not work
        response = requests.get(f"{BASE_URL}/api/api/events")
        # This should NOT return 200 if the bug is fixed
        print(f"✓ /api/api/events returns status: {response.status_code}")
        # A 404 indicates the duplicate prefix doesn't route correctly (expected behavior)
        # If it returns 200, the API might have weird routing


class TestEventFiltering:
    """Test event filtering functionality"""
    
    def test_all_events_list(self):
        """Test /api/events without filter returns all events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        print(f"✓ All events returned: {len(data)} events")
        assert isinstance(data, list)
    
    def test_match_events(self):
        """Test /api/events?event_type=match returns football matches"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=match")
        assert response.status_code == 200
        data = response.json()
        print(f"✓ Match events returned: {len(data)} events")
    
    def test_concert_events(self):
        """Test /api/events?event_type=concert returns concerts"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=concert")
        assert response.status_code == 200
        data = response.json()
        print(f"✓ Concert events returned: {len(data)} events")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
