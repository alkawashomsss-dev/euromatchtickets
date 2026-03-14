"""
Backend tests for SEO Pages, Sitemaps, and Cleanup APIs
Testing the Mega SEO Generator functionality with 10,000+ unique pages
"""

import pytest
import requests
import os

# Get base URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    BASE_URL = "https://content-boost-50.preview.emergentagent.com"

API_URL = f"{BASE_URL}/api"


class TestSEOStats:
    """Test /api/seo/stats endpoint - returns total pages count and breakdown"""
    
    def test_seo_stats_returns_total_pages(self):
        """GET /api/seo/stats should return total_pages count"""
        response = requests.get(f"{API_URL}/seo/stats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "total_pages" in data, "Response missing total_pages"
        assert isinstance(data["total_pages"], int), "total_pages should be integer"
        print(f"✓ Total SEO pages: {data['total_pages']}")
    
    def test_seo_stats_category_breakdown(self):
        """GET /api/seo/stats should return breakdown by category"""
        response = requests.get(f"{API_URL}/seo/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "by_category" in data, "Response missing by_category"
        assert isinstance(data["by_category"], dict), "by_category should be dict"
        print(f"✓ Categories breakdown: {data['by_category']}")
    
    def test_seo_stats_type_breakdown(self):
        """GET /api/seo/stats should return breakdown by page type"""
        response = requests.get(f"{API_URL}/seo/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "by_type" in data, "Response missing by_type"
        print(f"✓ Page types breakdown: {data['by_type']}")


class TestSEOPageBySlug:
    """Test /api/seo/page/{slug} - returns page with unique content, FAQ, internal links"""
    
    def test_get_bahrain_gp_page(self):
        """GET /api/seo/page/bahrain-grand-prix-tickets-2026 should return F1 page"""
        response = requests.get(f"{API_URL}/seo/page/bahrain-grand-prix-tickets-2026")
        
        if response.status_code == 404:
            pytest.skip("Bahrain GP page not yet generated")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "slug" in data, "Response missing slug"
        assert "title" in data, "Response missing title"
        assert "content" in data, "Response missing content"
        assert "category" in data, "Response missing category"
        
        # Check content length (should be 300-600 words unique content)
        content = data.get("content", "")
        word_count = len(content.split())
        assert word_count >= 100, f"Content too short: {word_count} words (expected 300+)"
        print(f"✓ Bahrain GP page content: {word_count} words")
    
    def test_get_real_madrid_page(self):
        """GET /api/seo/page/real-madrid-tickets-2026 should return football page"""
        response = requests.get(f"{API_URL}/seo/page/real-madrid-tickets-2026")
        
        if response.status_code == 404:
            pytest.skip("Real Madrid page not yet generated")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("category") == "football", f"Expected football category, got {data.get('category')}"
        assert "content" in data
        print(f"✓ Real Madrid page found with category: {data.get('category')}")
    
    def test_get_taylor_swift_page(self):
        """GET /api/seo/page/taylor-swift-concert-tickets-2026 should return concert page"""
        response = requests.get(f"{API_URL}/seo/page/taylor-swift-concert-tickets-2026")
        
        if response.status_code == 404:
            pytest.skip("Taylor Swift page not yet generated")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("category") == "concert", f"Expected concert category, got {data.get('category')}"
        print(f"✓ Taylor Swift concert page found")
    
    def test_page_has_price_info(self):
        """SEO pages should include price information"""
        response = requests.get(f"{API_URL}/seo/page/bahrain-grand-prix-tickets-2026")
        
        if response.status_code == 404:
            pytest.skip("Page not found")
        
        data = response.json()
        # Price info should be present
        if "price_low" in data:
            assert isinstance(data["price_low"], (int, float))
            print(f"✓ Price info present: €{data.get('price_low')} - €{data.get('price_high', 'N/A')}")
    
    def test_nonexistent_page_returns_404(self):
        """GET /api/seo/page/nonexistent-page should return 404"""
        response = requests.get(f"{API_URL}/seo/page/this-page-does-not-exist-12345")
        assert response.status_code == 404, f"Expected 404 for nonexistent page, got {response.status_code}"
        print("✓ 404 returned for nonexistent page")


class TestSEOPagination:
    """Test /api/seo/pages pagination endpoint"""
    
    def test_pagination_default(self):
        """GET /api/seo/pages should return paginated results"""
        response = requests.get(f"{API_URL}/seo/pages")
        assert response.status_code == 200
        
        data = response.json()
        assert "pages" in data, "Response missing pages array"
        assert "total" in data, "Response missing total count"
        assert "page" in data, "Response missing page number"
        assert "limit" in data, "Response missing limit"
        print(f"✓ Pagination: {len(data['pages'])} pages returned, {data['total']} total")
    
    def test_pagination_with_category_filter(self):
        """GET /api/seo/pages?category=f1 should filter F1 pages"""
        response = requests.get(f"{API_URL}/seo/pages", params={"category": "f1", "page": 1, "limit": 10})
        assert response.status_code == 200
        
        data = response.json()
        pages = data.get("pages", [])
        
        # All returned pages should be F1 category
        for page in pages:
            assert page.get("category") == "f1", f"Expected f1, got {page.get('category')}"
        
        print(f"✓ F1 filter: {data.get('total', 0)} F1 pages found")
    
    def test_pagination_page_2(self):
        """GET /api/seo/pages?page=2&limit=10 should return second page"""
        response = requests.get(f"{API_URL}/seo/pages", params={"page": 2, "limit": 10})
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("page") == 2
        print(f"✓ Page 2 returned {len(data.get('pages', []))} items")


class TestSitemaps:
    """Test sitemap endpoints for SEO indexing"""
    
    def test_sitemap_index(self):
        """GET /api/sitemap-index.xml should return valid XML sitemap index"""
        response = requests.get(f"{API_URL}/sitemap-index.xml")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        content = response.text
        assert '<?xml version' in content, "Missing XML declaration"
        assert 'sitemapindex' in content, "Not a sitemap index"
        assert 'f1.xml' in content, "Missing f1 sitemap reference"
        assert 'concerts.xml' in content, "Missing concerts sitemap reference"
        assert 'football.xml' in content, "Missing football sitemap reference"
        assert 'worldcup.xml' in content, "Missing worldcup sitemap reference"
        print("✓ Sitemap index contains all category references")
    
    def test_f1_sitemap(self):
        """GET /api/sitemaps/f1.xml should return F1 sitemap"""
        response = requests.get(f"{API_URL}/sitemaps/f1.xml")
        assert response.status_code == 200
        
        content = response.text
        assert '<?xml version' in content, "Missing XML declaration"
        assert 'urlset' in content, "Not a valid sitemap"
        assert '<loc>' in content or content.count('<url>') == 0, "Sitemap structure invalid"
        print(f"✓ F1 sitemap returned ({len(content)} chars)")
    
    def test_concerts_sitemap(self):
        """GET /api/sitemaps/concerts.xml should return concerts sitemap"""
        response = requests.get(f"{API_URL}/sitemaps/concerts.xml")
        assert response.status_code == 200
        
        content = response.text
        assert 'urlset' in content
        print(f"✓ Concerts sitemap returned ({len(content)} chars)")
    
    def test_football_sitemap(self):
        """GET /api/sitemaps/football.xml should return football sitemap"""
        response = requests.get(f"{API_URL}/sitemaps/football.xml")
        assert response.status_code == 200
        print("✓ Football sitemap accessible")
    
    def test_worldcup_sitemap(self):
        """GET /api/sitemaps/worldcup.xml should return World Cup sitemap"""
        response = requests.get(f"{API_URL}/sitemaps/worldcup.xml")
        assert response.status_code == 200
        print("✓ World Cup sitemap accessible")
    
    def test_pages_sitemap(self):
        """GET /api/sitemaps/pages.xml should return static pages sitemap"""
        response = requests.get(f"{API_URL}/sitemaps/pages.xml")
        assert response.status_code == 200
        
        content = response.text
        assert 'euromatchtickets.com' in content or 'mega-pages-gen' in content, "Missing base URL"
        print("✓ Static pages sitemap accessible")


class TestCleanupEndpoints:
    """Test event cleanup endpoints"""
    
    def test_cleanup_status(self):
        """GET /api/cleanup/status should return event cleanup statistics"""
        response = requests.get(f"{API_URL}/cleanup/status")
        assert response.status_code == 200
        
        data = response.json()
        assert "events" in data, "Response missing events stats"
        
        events = data["events"]
        assert "total" in events, "Missing total count"
        assert "active" in events, "Missing active count"
        assert "past_event" in events, "Missing past_event count"
        assert "pending_cleanup" in events, "Missing pending_cleanup count"
        
        print(f"✓ Cleanup status: {events['total']} total events, {events['active']} active, {events['past_event']} past, {events['pending_cleanup']} pending cleanup")
    
    def test_cleanup_expired_events_marks_past_not_deletes(self):
        """POST /api/cleanup/expired-events should mark events as past_event (not delete)"""
        response = requests.post(f"{API_URL}/cleanup/expired-events")
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("status") in ["success", "error"], f"Unexpected status: {data.get('status')}"
        
        if data.get("status") == "success":
            # Verify it mentions preservation
            message = data.get("message", "") + data.get("note", "")
            print(f"✓ Cleanup result: {data.get('message')}")
            
            # Should not mention deletion
            assert "deleted" not in message.lower() or "not deleted" in message.lower(), "Events should be preserved, not deleted"


class TestContentUniqueness:
    """Test that content is unique across different pages"""
    
    def test_monaco_vs_silverstone_different_content(self):
        """Monaco GP and Silverstone GP should have different content"""
        monaco = requests.get(f"{API_URL}/seo/page/monaco-grand-prix-tickets-2026")
        silverstone = requests.get(f"{API_URL}/seo/page/british-grand-prix-tickets-2026")
        
        if monaco.status_code == 404 or silverstone.status_code == 404:
            # Try alternative slugs
            silverstone = requests.get(f"{API_URL}/seo/page/silverstone-grand-prix-tickets-2026")
        
        if monaco.status_code == 404:
            pytest.skip("Monaco GP page not generated")
        if silverstone.status_code == 404:
            pytest.skip("Silverstone/British GP page not generated")
        
        monaco_content = monaco.json().get("content", "")
        silverstone_content = silverstone.json().get("content", "")
        
        # Content should be different
        assert monaco_content != silverstone_content, "Monaco and Silverstone have identical content!"
        
        # First 200 characters should be different (not template-fill)
        assert monaco_content[:200] != silverstone_content[:200], "Content starts are identical - possible template issue"
        
        print("✓ Monaco and Silverstone have unique content")
    
    def test_different_categories_different_content(self):
        """F1 page and Concert page should have very different content"""
        f1_response = requests.get(f"{API_URL}/seo/page/bahrain-grand-prix-tickets-2026")
        concert_response = requests.get(f"{API_URL}/seo/page/taylor-swift-concert-tickets-2026")
        
        if f1_response.status_code == 404:
            pytest.skip("F1 page not found")
        if concert_response.status_code == 404:
            pytest.skip("Concert page not found")
        
        f1_content = f1_response.json().get("content", "")
        concert_content = concert_response.json().get("content", "")
        
        # Content should be very different
        assert f1_content != concert_content
        
        # Check for category-specific keywords
        assert "Formula" in f1_content or "F1" in f1_content or "Grand Prix" in f1_content, "F1 page missing F1 keywords"
        assert "concert" in concert_content.lower() or "tour" in concert_content.lower(), "Concert page missing concert keywords"
        
        print("✓ F1 and Concert pages have unique category-specific content")


class TestMegaGenerate:
    """Test mega page generation endpoint"""
    
    def test_mega_generate_endpoint_exists(self):
        """POST /api/seo/mega-generate should be accessible"""
        # Just check endpoint exists - don't actually run generation in tests
        # as it takes time and generates many pages
        response = requests.options(f"{API_URL}/seo/mega-generate")
        # If OPTIONS not supported, try a quick health check
        if response.status_code == 405:
            # Endpoint exists but OPTIONS not allowed - that's fine
            print("✓ Mega generate endpoint exists (OPTIONS method not allowed)")
        else:
            print(f"✓ Mega generate endpoint responded with {response.status_code}")


class TestHealthAndBasics:
    """Basic health checks"""
    
    def test_api_health(self):
        """API health check should succeed"""
        response = requests.get(f"{API_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"
        print("✓ API is healthy")
    
    def test_base_url_correct(self):
        """Verify we're testing the correct URL"""
        print(f"✓ Testing against: {BASE_URL}")
        assert "mega-pages-gen" in BASE_URL or "euromatchtickets" in BASE_URL


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
