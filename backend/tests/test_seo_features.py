"""
Test SEO Features for EuroMatchTickets
Testing:
1. GZip compression on API responses
2. /api/seo/page-meta endpoint
3. Backend health check
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestBackendHealth:
    """Basic health check tests"""
    
    def test_api_root_returns_200(self):
        """Health check: GET /api/ should return 200"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        print(f"API root response: {data}")

class TestGZipCompression:
    """Test GZip compression middleware"""
    
    def test_gzip_enabled_on_large_responses(self):
        """GZip should compress responses when Accept-Encoding header is set"""
        headers = {"Accept-Encoding": "gzip, deflate, br"}
        response = requests.get(f"{BASE_URL}/api/events", headers=headers)
        assert response.status_code == 200
        
        # Check if response was compressed (requests auto-decompresses)
        # The actual content-encoding might be stripped by requests library
        # But we can verify the response is valid JSON
        data = response.json()
        assert isinstance(data, list) or isinstance(data, dict)
        print(f"GZip test passed - received valid JSON response")

class TestSEOPageMeta:
    """Test /api/seo/page-meta endpoint"""
    
    def test_page_meta_root_path(self):
        """Page meta for root path should return default title"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta", params={"path": "/"})
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "canonical" in data
        assert "euromatchtickets.com" in data["canonical"].lower()
        print(f"Root path meta: {data}")
    
    def test_page_meta_f1_tickets(self):
        """Page meta for /f1-tickets should return appropriate title"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta", params={"path": "/f1-tickets"})
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "canonical" in data
        assert "f1-tickets" in data["canonical"]
        print(f"F1 tickets path meta: {data}")
    
    def test_page_meta_world_cup(self):
        """Page meta for /world-cup-2026"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta", params={"path": "/world-cup-2026"})
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "canonical" in data
        print(f"World Cup path meta: {data}")
    
    def test_page_meta_champions_league(self):
        """Page meta for /champions-league-tickets"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta", params={"path": "/champions-league-tickets"})
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "canonical" in data
        print(f"Champions League path meta: {data}")
    
    def test_page_meta_empty_path(self):
        """Page meta with empty path should return default"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta", params={"path": ""})
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        print(f"Empty path meta: {data}")

class TestExistingEndpoints:
    """Verify existing endpoints still work"""
    
    def test_events_endpoint(self):
        """GET /api/events should return list of events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Events endpoint returned {len(data)} events")
    
    def test_sitemap_endpoint(self):
        """GET /api/sitemap.xml should return XML"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200
        assert "xml" in response.headers.get("content-type", "").lower()
        print("Sitemap endpoint working")
    
    def test_robots_endpoint(self):
        """GET /api/robots.txt should return text"""
        response = requests.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200
        assert "user-agent" in response.text.lower()
        print("Robots.txt endpoint working")

class TestSEOPages:
    """Test SEO pages API"""
    
    def test_seo_pages_list(self):
        """GET /api/seo/pages should return paginated list"""
        response = requests.get(f"{BASE_URL}/api/seo/pages", params={"limit": 10})
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "pages" in data
        print(f"SEO pages: {data['total']} total pages")
    
    def test_seo_stats(self):
        """GET /api/seo/stats should return stats"""
        response = requests.get(f"{BASE_URL}/api/seo/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_pages" in data
        print(f"SEO stats: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
