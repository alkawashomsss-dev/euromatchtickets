"""
Test Auth Flow (Emergent Auth) and Homepage Hero Image Changes

Bug fixes tested:
1. Login was failing with redirect_uri_mismatch - switched from direct Google OAuth to Emergent Auth
2. Homepage was slow due to UHD video from Pexels - replaced with local optimized WebP image

Endpoints tested:
- POST /api/auth/session - Emergent auth session exchange
- GET /api/auth/me - Get authenticated user
- GET /api/events - Events API
- GET /api/seo/sitemap.xml - SEO sitemap
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestAuthEndpoints:
    """Test Emergent Auth session exchange endpoints"""
    
    def test_auth_session_missing_session_id(self):
        """POST /api/auth/session should return 400 when session_id is missing"""
        response = requests.post(f"{BASE_URL}/api/auth/session", json={})
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "session_id required" in data.get("detail", ""), f"Unexpected error message: {data}"
        print("PASS: /api/auth/session returns 400 when session_id missing")
    
    def test_auth_session_invalid_session_id(self):
        """POST /api/auth/session should return 401 for invalid session_id"""
        response = requests.post(
            f"{BASE_URL}/api/auth/session", 
            json={"session_id": "invalid_test_session_123"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "Invalid session" in data.get("detail", ""), f"Unexpected error message: {data}"
        print("PASS: /api/auth/session returns 401 for invalid session_id")
    
    def test_auth_me_unauthenticated(self):
        """GET /api/auth/me should return 401 when not authenticated"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "Not authenticated" in data.get("detail", ""), f"Unexpected error message: {data}"
        print("PASS: /api/auth/me returns 401 when not authenticated")
    
    def test_auth_me_invalid_token(self):
        """GET /api/auth/me should return 401 with invalid Authorization header"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid_token_xyz"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: /api/auth/me returns 401 for invalid token")
    
    def test_auth_logout_without_session(self):
        """POST /api/auth/logout should succeed even without session"""
        response = requests.post(f"{BASE_URL}/api/auth/logout")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get("success") == True, f"Expected success: true, got {data}"
        print("PASS: /api/auth/logout returns success without session")


class TestEventsAPI:
    """Test Events API endpoints still work correctly"""
    
    def test_events_endpoint_returns_200(self):
        """GET /api/events should return 200 and list of events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), f"Expected list, got {type(data)}"
        assert len(data) > 0, "Expected at least one event"
        print(f"PASS: /api/events returns {len(data)} events")
    
    def test_events_filter_by_type_concert(self):
        """GET /api/events?event_type=concert should return only concerts"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=concert")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for event in data[:5]:  # Check first 5
            assert event.get("event_type") == "concert", f"Expected concert, got {event.get('event_type')}"
        print(f"PASS: /api/events?event_type=concert returns {len(data)} concerts")
    
    def test_events_filter_by_type_match(self):
        """GET /api/events?event_type=match should return only matches"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=match")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: /api/events?event_type=match returns {len(data)} matches")
    
    def test_events_featured_filter(self):
        """GET /api/events?featured=true should return featured events"""
        response = requests.get(f"{BASE_URL}/api/events?featured=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned events should be featured
        for event in data[:5]:
            assert event.get("featured") == True, f"Event {event.get('event_id')} is not featured"
        print(f"PASS: /api/events?featured=true returns {len(data)} featured events")


class TestSEOEndpoints:
    """Test SEO endpoints still work correctly"""
    
    def test_sitemap_returns_xml(self):
        """GET /api/sitemap.xml should return valid XML"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        content_type = response.headers.get("content-type", "")
        assert "xml" in content_type, f"Expected XML content-type, got {content_type}"
        assert "<?xml" in response.text, "Response does not look like XML"
        print("PASS: /api/sitemap.xml returns valid XML")
    
    def test_robots_txt(self):
        """GET /api/robots.txt should return valid robots.txt"""
        response = requests.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert "User-agent" in response.text or "Sitemap" in response.text
        print("PASS: /api/robots.txt returns valid content")
    
    def test_seo_internal_links_match(self):
        """GET /api/seo/internal-links/match should return match links"""
        response = requests.get(f"{BASE_URL}/api/seo/internal-links/match")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: /api/seo/internal-links/match returns {len(data)} links")
    
    def test_seo_internal_links_concert(self):
        """GET /api/seo/internal-links/concert should return concert links"""
        response = requests.get(f"{BASE_URL}/api/seo/internal-links/concert")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: /api/seo/internal-links/concert returns {len(data)} links")


class TestHomepageHeroImages:
    """Test that homepage hero images use local paths (not external video/images)"""
    
    def test_local_hero_image_exists(self):
        """Local hero images should be accessible"""
        # Test the world cup trophy image used in homepage hero
        image_paths = [
            "/images/heroes/worldcup-trophy.jpg",
            "/images/heroes/worldcup-trophy-lg.webp",
            "/images/heroes/worldcup-trophy-md.webp",
            "/images/heroes/worldcup-trophy-sm.webp",
        ]
        
        for path in image_paths:
            response = requests.head(f"{BASE_URL}{path}")
            # 200 or 304 (cached) is acceptable
            assert response.status_code in [200, 304], f"Image {path} not found: status {response.status_code}"
            print(f"PASS: Local image {path} is accessible")
    
    def test_football_hero_image_exists(self):
        """Local football stadium hero image should be accessible"""
        image_paths = [
            "/images/heroes/football-stadium-lg.webp",
            "/images/heroes/football-stadium-md.webp",
        ]
        
        for path in image_paths:
            response = requests.head(f"{BASE_URL}{path}")
            assert response.status_code in [200, 304], f"Image {path} not found"
            print(f"PASS: Local image {path} is accessible")
    
    def test_concert_hero_image_exists(self):
        """Local concert hero image should be accessible"""
        image_paths = [
            "/images/heroes/concert-purple-md.webp",
        ]
        
        for path in image_paths:
            response = requests.head(f"{BASE_URL}{path}")
            assert response.status_code in [200, 304], f"Image {path} not found"
            print(f"PASS: Local image {path} is accessible")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_is_reachable(self):
        """API should be reachable"""
        response = requests.get(f"{BASE_URL}/api/events", timeout=10)
        assert response.status_code == 200
        print("PASS: API is reachable")
    
    def test_seed_endpoint(self):
        """POST /api/seed should work"""
        response = requests.post(f"{BASE_URL}/api/seed")
        assert response.status_code == 200
        print("PASS: /api/seed endpoint works")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
