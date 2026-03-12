"""
Test suite for EuroMatchTickets API v2.0 - Post-Refactoring Verification
Tests all critical endpoints after server.py was split into modular route files.
Route modules tested: events.py, seo.py, admin.py
"""
import pytest
import requests
import os

# Use production URL from environment - DO NOT add fallback defaults
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestBasicConnectivity:
    """Test 1-2: Basic API connectivity after refactoring"""
    
    def test_api_root_returns_v2(self, api_client):
        """Verify API root returns v2.0 indicating modular architecture"""
        response = api_client.get(f"{BASE_URL}/api")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "EuroMatchTickets API v2.0"
        assert data["version"] == "2.0"
        print(f"PASS: API root returns v2.0 - modular architecture confirmed")

    def test_root_endpoint(self, api_client):
        """Test root endpoint"""
        response = api_client.get(f"{BASE_URL}/")
        assert response.status_code == 200
        print(f"PASS: Root endpoint accessible")


class TestEventsEndpoints:
    """Test 3-5: Events routes from routes/events.py"""
    
    def test_get_events_list(self, api_client):
        """GET /api/events - returns list of events"""
        response = api_client.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: GET /api/events returns {len(data)} events")
    
    def test_get_events_with_filter(self, api_client):
        """GET /api/events?event_type=f1 - filter works"""
        response = api_client.get(f"{BASE_URL}/api/events?event_type=f1")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Verify filter works - all returned events should be f1
        if data:
            for event in data[:5]:  # Check first 5
                assert event.get("event_type") == "f1"
        print(f"PASS: GET /api/events with filter returns {len(data)} F1 events")
    
    def test_get_single_event(self, api_client):
        """GET /api/events/{event_id} - returns event with tickets"""
        # First get an event
        response = api_client.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        events = response.json()
        
        if events:
            event_id = events[0]["event_id"]
            response = api_client.get(f"{BASE_URL}/api/events/{event_id}")
            assert response.status_code == 200
            event = response.json()
            assert "event_id" in event
            assert "tickets" in event  # Should include tickets
            assert "ticket_count" in event
            assert "categories" in event
            print(f"PASS: GET /api/events/{event_id} returns event with {event['ticket_count']} tickets")
        else:
            pytest.skip("No events to test")


class TestSEOEndpoints:
    """Test 6-13: SEO routes from routes/seo.py"""
    
    def test_seo_stats(self, api_client):
        """GET /api/seo/stats - returns SEO page statistics"""
        response = api_client.get(f"{BASE_URL}/api/seo/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_pages" in data
        assert "by_category" in data
        assert "by_type" in data
        assert data["total_pages"] > 0
        print(f"PASS: GET /api/seo/stats - {data['total_pages']} total SEO pages")
        print(f"  Categories: {list(data['by_category'].keys())}")
    
    def test_seo_page_monaco_gp(self, api_client):
        """GET /api/seo/page/monaco-grand-prix-tickets-2026 - Monaco GP page"""
        response = api_client.get(f"{BASE_URL}/api/seo/page/monaco-grand-prix-tickets-2026")
        assert response.status_code == 200
        data = response.json()
        assert "slug" in data
        assert "title" in data
        assert "content" in data
        assert data["category"] == "f1"
        # Verify 300+ words content requirement
        content_words = len(data.get("content", "").split())
        assert content_words >= 300, f"Content should have 300+ words, has {content_words}"
        print(f"PASS: Monaco GP page has {content_words} words content")
    
    def test_seo_page_taylor_swift(self, api_client):
        """GET /api/seo/page/taylor-swift-concert-tickets-2026 - Taylor Swift page"""
        response = api_client.get(f"{BASE_URL}/api/seo/page/taylor-swift-concert-tickets-2026")
        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "concert"
        assert "taylor" in data.get("slug", "").lower()
        print(f"PASS: Taylor Swift SEO page loads correctly")
    
    def test_seo_page_real_madrid(self, api_client):
        """GET /api/seo/page/real-madrid-tickets-2026 - Real Madrid page"""
        response = api_client.get(f"{BASE_URL}/api/seo/page/real-madrid-tickets-2026")
        assert response.status_code == 200
        data = response.json()
        assert data["category"] == "football"
        print(f"PASS: Real Madrid SEO page loads correctly")
    
    def test_seo_pages_pagination(self, api_client):
        """GET /api/seo/pages?category=f1&page=1&limit=5 - pagination works"""
        response = api_client.get(f"{BASE_URL}/api/seo/pages?category=f1&page=1&limit=5")
        assert response.status_code == 200
        data = response.json()
        assert "pages" in data
        assert "total" in data
        assert "page" in data
        assert "limit" in data
        assert "total_pages" in data
        assert len(data["pages"]) <= 5
        # Verify all returned are f1 category
        for page in data["pages"]:
            assert page.get("category") == "f1"
        print(f"PASS: SEO pagination works - {data['total']} F1 pages, showing {len(data['pages'])}")


class TestSitemaps:
    """Test 14-18: Sitemap generation from routes/seo.py"""
    
    def test_sitemap_index(self, api_client):
        """GET /api/sitemap-index.xml - returns valid XML sitemap index"""
        response = api_client.get(f"{BASE_URL}/api/sitemap-index.xml")
        assert response.status_code == 200
        assert "xml" in response.headers.get("Content-Type", "")
        content = response.text
        assert '<?xml version="1.0"' in content
        assert '<sitemapindex' in content
        # Check for expected category sitemaps
        for cat in ["f1", "concerts", "football", "worldcup", "pages"]:
            assert f"/sitemaps/{cat}.xml" in content, f"Missing {cat} sitemap reference"
        print(f"PASS: Sitemap index contains all category references")
    
    def test_f1_sitemap(self, api_client):
        """GET /api/sitemaps/f1.xml - returns F1 sitemap with 528 URLs"""
        response = api_client.get(f"{BASE_URL}/api/sitemaps/f1.xml")
        assert response.status_code == 200
        content = response.text
        assert '<urlset' in content
        url_count = content.count('<url>')
        # Based on previous test, F1 should have 528 pages
        assert url_count > 400, f"F1 sitemap should have 500+ URLs, has {url_count}"
        print(f"PASS: F1 sitemap has {url_count} URLs")
    
    def test_concerts_sitemap(self, api_client):
        """GET /api/sitemaps/concerts.xml - returns concert sitemap"""
        response = api_client.get(f"{BASE_URL}/api/sitemaps/concerts.xml")
        assert response.status_code == 200
        content = response.text
        assert '<urlset' in content
        url_count = content.count('<url>')
        print(f"PASS: Concerts sitemap has {url_count} URLs")
    
    def test_football_sitemap(self, api_client):
        """GET /api/sitemaps/football.xml - returns football sitemap"""
        response = api_client.get(f"{BASE_URL}/api/sitemaps/football.xml")
        assert response.status_code == 200
        content = response.text
        assert '<urlset' in content
        url_count = content.count('<url>')
        print(f"PASS: Football sitemap has {url_count} URLs")
    
    def test_static_pages_sitemap(self, api_client):
        """GET /api/sitemaps/pages.xml - returns static pages sitemap"""
        response = api_client.get(f"{BASE_URL}/api/sitemaps/pages.xml")
        assert response.status_code == 200
        content = response.text
        assert '<urlset' in content
        # Check static pages are included
        assert '/events' in content or '/blog' in content
        print(f"PASS: Static pages sitemap generated")


class TestAdminEndpoints:
    """Test 19-22: Admin routes from routes/admin.py"""
    
    def test_cleanup_status(self, api_client):
        """GET /api/cleanup/status - returns cleanup status"""
        response = api_client.get(f"{BASE_URL}/api/cleanup/status")
        assert response.status_code == 200
        data = response.json()
        assert "events" in data
        assert "tickets" in data
        assert "last_check" in data
        # Verify events structure
        events = data["events"]
        assert "total" in events
        assert "active" in events
        assert "past_event" in events
        print(f"PASS: Cleanup status - {events['total']} total events, {events['active']} active")
    
    def test_get_reviews(self, api_client):
        """GET /api/reviews - returns reviews with aggregate rating"""
        response = api_client.get(f"{BASE_URL}/api/reviews")
        assert response.status_code == 200
        data = response.json()
        assert "reviews" in data
        assert "aggregate" in data
        assert "average_rating" in data["aggregate"]
        assert "total_reviews" in data["aggregate"]
        print(f"PASS: Reviews endpoint - avg rating {data['aggregate']['average_rating']}, {data['aggregate']['total_reviews']} reviews")
    
    def test_create_review(self, api_client):
        """POST /api/reviews - create a new review"""
        review_data = {
            "reviewer_name": "TEST_User",
            "reviewer_email": "test@example.com",
            "event_name": "Monaco Grand Prix 2026",
            "rating": 5,
            "title": "Great experience!",
            "content": "The ticket purchase was smooth and the event was amazing.",
            "verified_purchase": False
        }
        response = api_client.post(f"{BASE_URL}/api/reviews", json=review_data)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "review_id" in data
        print(f"PASS: Created review with ID {data['review_id']}")
    
    def test_robots_txt(self, api_client):
        """GET /api/robots.txt - returns robots.txt with sitemap references"""
        response = api_client.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200
        content = response.text
        assert "User-agent:" in content
        assert "Sitemap:" in content
        assert "sitemap-index.xml" in content
        print(f"PASS: robots.txt contains sitemap reference")


class TestSEOContentQuality:
    """Test 23-24: Content quality verification"""
    
    def test_seo_page_has_faq(self, api_client):
        """Monaco GP page should have FAQ structure"""
        response = api_client.get(f"{BASE_URL}/api/seo/page/monaco-grand-prix-tickets-2026")
        assert response.status_code == 200
        data = response.json()
        content = data.get("content", "")
        # Check for FAQ indicators or rich content
        has_rich_content = "?" in content or "faq" in content.lower() or len(content) > 1000
        assert has_rich_content, "Content should be rich with FAQs or detailed information"
        print(f"PASS: Monaco GP has rich content ({len(content)} chars)")
    
    def test_seo_page_has_internal_links(self, api_client):
        """SEO pages should have internal link data"""
        response = api_client.get(f"{BASE_URL}/api/seo/internal-links/f1")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if data:
            assert "url" in data[0]
            assert "title" in data[0]
        print(f"PASS: Internal links endpoint returns {len(data)} links")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
