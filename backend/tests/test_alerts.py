"""
Test suite for Price Alerts API endpoints
Tests: subscribe, unsubscribe, status, stats
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAlertsAPI:
    """Price Alerts endpoint tests"""
    
    @pytest.fixture
    def test_email(self):
        """Generate unique test email for each test run"""
        return f"TEST_alert_{uuid.uuid4().hex[:8]}@test.com"
    
    @pytest.fixture  
    def test_event_id(self):
        """Use a consistent test event ID"""
        return "TEST_event_123"
    
    def test_health_check(self):
        """Verify API is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        print("API health check passed")
    
    def test_subscribe_success(self, test_email, test_event_id):
        """Test subscribing to price alerts"""
        payload = {
            "email": test_email,
            "event_id": test_event_id,
            "event_title": "Test Event Title",
            "current_price": 99.0
        }
        response = requests.post(f"{BASE_URL}/api/alerts/subscribe", json=payload)
        
        # Status code assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert data.get("success") == True
        assert "message" in data
        print(f"Subscribe successful: {data}")
    
    def test_subscribe_duplicate(self, test_email, test_event_id):
        """Test subscribing same email to same event returns already_subscribed"""
        payload = {
            "email": test_email,
            "event_id": test_event_id,
            "event_title": "Test Event Title",
            "current_price": 99.0
        }
        # First subscription
        requests.post(f"{BASE_URL}/api/alerts/subscribe", json=payload)
        
        # Second subscription should return already_subscribed
        response = requests.post(f"{BASE_URL}/api/alerts/subscribe", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert data.get("already_subscribed") == True or "Already subscribed" in data.get("message", "")
        print(f"Duplicate subscribe handled correctly: {data}")
    
    def test_subscribe_invalid_email(self, test_event_id):
        """Test subscribing with invalid email returns error"""
        payload = {
            "email": "invalid-email",
            "event_id": test_event_id,
            "event_title": "Test Event Title",
            "current_price": 99.0
        }
        response = requests.post(f"{BASE_URL}/api/alerts/subscribe", json=payload)
        assert response.status_code == 422  # Validation error
        print("Invalid email validation passed")
    
    def test_get_stats(self, test_event_id):
        """Test getting alert stats for an event"""
        response = requests.get(f"{BASE_URL}/api/alerts/stats/{test_event_id}")
        
        # Status code assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert "subscribers" in data
        assert "watching" in data
        assert isinstance(data["subscribers"], int)
        assert isinstance(data["watching"], int)
        print(f"Stats response: {data}")
    
    def test_get_status_not_subscribed(self, test_event_id):
        """Test checking subscription status for non-subscriber"""
        email = f"TEST_nosub_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.get(f"{BASE_URL}/api/alerts/status/{test_event_id}/{email}")
        
        # Status code assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert "subscribed" in data
        assert data["subscribed"] == False
        print(f"Non-subscriber status check: {data}")
    
    def test_get_status_subscribed(self, test_email, test_event_id):
        """Test checking subscription status after subscribing"""
        # First subscribe
        payload = {
            "email": test_email,
            "event_id": test_event_id,
            "event_title": "Test Event Title",
            "current_price": 99.0
        }
        requests.post(f"{BASE_URL}/api/alerts/subscribe", json=payload)
        
        # Check status
        response = requests.get(f"{BASE_URL}/api/alerts/status/{test_event_id}/{test_email}")
        
        # Status code assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert data["subscribed"] == True
        print(f"Subscriber status check: {data}")
    
    def test_unsubscribe(self, test_email, test_event_id):
        """Test unsubscribing from price alerts"""
        # First subscribe
        payload = {
            "email": test_email,
            "event_id": test_event_id,
            "event_title": "Test Event Title",
            "current_price": 99.0
        }
        requests.post(f"{BASE_URL}/api/alerts/subscribe", json=payload)
        
        # Unsubscribe
        unsub_payload = {
            "email": test_email,
            "event_id": test_event_id
        }
        response = requests.post(f"{BASE_URL}/api/alerts/unsubscribe", json=unsub_payload)
        
        # Status code assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert data.get("success") == True
        print(f"Unsubscribe successful: {data}")
        
        # Verify unsubscribed by checking status
        status_response = requests.get(f"{BASE_URL}/api/alerts/status/{test_event_id}/{test_email}")
        status_data = status_response.json()
        assert status_data["subscribed"] == False
        print(f"Verified unsubscribed: {status_data}")


class TestAlertsWithRealEvent:
    """Test alerts with a real event from the database"""
    
    def test_get_real_event_and_subscribe(self):
        """Get a real event and test alert subscription"""
        # First, get a real event
        events_response = requests.get(f"{BASE_URL}/api/events?limit=1")
        assert events_response.status_code == 200
        events_data = events_response.json()
        
        # API returns array directly
        if isinstance(events_data, dict):
            events_list = events_data.get("events", [])
        else:
            events_list = events_data if isinstance(events_data, list) else []
        
        if not events_list or len(events_list) == 0:
            pytest.skip("No events available in database")
        
        event = events_list[0]
        event_id = event.get("event_id")
        event_title = event.get("title")
        lowest_price = event.get("lowest_price", 99)
        
        print(f"Testing with real event: {event_title} (ID: {event_id})")
        
        # Test subscription
        test_email = f"TEST_real_{uuid.uuid4().hex[:8]}@test.com"
        payload = {
            "email": test_email,
            "event_id": event_id,
            "event_title": event_title,
            "current_price": lowest_price
        }
        response = requests.post(f"{BASE_URL}/api/alerts/subscribe", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"Subscribed to real event successfully: {data}")
        
        # Get stats for this event
        stats_response = requests.get(f"{BASE_URL}/api/alerts/stats/{event_id}")
        assert stats_response.status_code == 200
        stats_data = stats_response.json()
        assert stats_data["subscribers"] >= 1  # At least our subscription
        print(f"Event has {stats_data['subscribers']} subscriber(s)")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
