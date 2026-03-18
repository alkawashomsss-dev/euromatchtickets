"""
Test checkout/create-event endpoint validation
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://luxury-tickets-dev.preview.emergentagent.com').rstrip('/')

class TestCheckoutEndpoint:
    """Tests for POST /api/checkout/create-event endpoint"""
    
    def test_checkout_missing_params_returns_401_or_400(self):
        """Test that missing params returns proper error (auth required first)"""
        response = requests.post(f"{BASE_URL}/api/checkout/create-event", json={})
        # Without auth, should return 401 Not authenticated OR 400 for missing params
        assert response.status_code in [400, 401, 422], f"Expected 400/401/422, got {response.status_code}"
        data = response.json()
        # Should have detail field explaining the error
        assert "detail" in data
        print(f"Missing params response: {data}")
    
    def test_checkout_with_partial_params_returns_error(self):
        """Test that partial params returns validation error"""
        response = requests.post(f"{BASE_URL}/api/checkout/create-event", json={
            "event_id": "concert_ac2e6adb1dd3"
            # Missing price and origin_url
        })
        # Should return auth error (401) or validation error (400/422)
        assert response.status_code in [400, 401, 422]
        data = response.json()
        assert "detail" in data
        print(f"Partial params response: {data}")

class TestEventsAPI:
    """Tests for events API used by checkout"""
    
    def test_event_exists(self):
        """Test that the test event exists"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        assert response.status_code == 200, f"Event not found, status: {response.status_code}"
        data = response.json()
        assert "title" in data
        assert "venue" in data
        print(f"Event found: {data.get('title')} at {data.get('venue')}")
    
    def test_event_has_required_fields_for_checkout(self):
        """Test event has fields needed by CheckoutPage"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        assert response.status_code == 200
        data = response.json()
        
        # CheckoutPage needs these fields
        required_fields = ["title", "venue", "city", "event_date", "event_image"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        print(f"All required fields present for checkout")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
