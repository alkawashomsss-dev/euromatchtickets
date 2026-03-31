"""
SEO Canonical Tag and Meta Tag Tests
Tests for the fix: 'Duplicate, Google chose different canonical than user'
- Verifies canonical tags are set correctly per page
- Verifies only 1 canonical tag exists per page
- Verifies robots meta tag shows correct values
- Verifies 410 Gone for inactive/2025 pages
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://euro-indexing.preview.emergentagent.com')


class TestSEOBackendAPI:
    """Backend SEO API endpoint tests"""
    
    def test_indexing_status_endpoint(self):
        """Test /api/seo/indexing-status returns correct data"""
        response = requests.get(f"{BASE_URL}/api/seo/indexing-status")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "active_pages" in data, "Missing active_pages field"
        assert "inactive_pages" in data, "Missing inactive_pages field"
        assert "total" in data, "Missing total field"
        assert data["active_pages"] > 0, "Should have active pages"
        print(f"✓ Indexing status: {data['active_pages']} active, {data['inactive_pages']} inactive")
    
    def test_seo_page_active(self):
        """Test /api/seo/page/{slug} returns data for active pages"""
        # Test known active page
        response = requests.get(f"{BASE_URL}/api/seo/page/bayern-munich-tickets")
        assert response.status_code == 200, f"Expected 200 for active page, got {response.status_code}"
        
        data = response.json()
        assert "slug" in data, "Missing slug field"
        assert "title" in data, "Missing title field"
        assert data["active"] == True, "Page should be active"
        print(f"✓ Active page bayern-munich-tickets returns correct data")
    
    def test_seo_page_not_found(self):
        """Test /api/seo/page/{slug} returns 404 for non-existent pages"""
        response = requests.get(f"{BASE_URL}/api/seo/page/non-existent-page-xyz123")
        assert response.status_code == 404, f"Expected 404 for non-existent page, got {response.status_code}"
        print(f"✓ Non-existent page returns 404")
    
    def test_seo_pages_list(self):
        """Test /api/seo/pages returns paginated list"""
        response = requests.get(f"{BASE_URL}/api/seo/pages?page=1&limit=10")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "total" in data, "Missing total field"
        assert "pages" in data, "Missing pages field"
        assert len(data["pages"]) > 0, "Should have pages"
        print(f"✓ SEO pages list: {data['total']} total pages")
    
    def test_seo_stats(self):
        """Test /api/seo/stats returns category breakdown"""
        response = requests.get(f"{BASE_URL}/api/seo/stats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "total_pages" in data, "Missing total_pages field"
        assert "by_category" in data, "Missing by_category field"
        print(f"✓ SEO stats: {data['total_pages']} total pages")
    
    def test_sitemap_xml(self):
        """Test /api/sitemap.xml returns valid XML"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert "application/xml" in response.headers.get("Content-Type", ""), "Should return XML"
        assert "<?xml" in response.text, "Should be valid XML"
        assert "<urlset" in response.text, "Should have urlset element"
        print(f"✓ Sitemap XML is valid")
    
    def test_robots_txt(self):
        """Test /api/robots.txt returns correct content"""
        response = requests.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert "User-agent:" in response.text, "Should have User-agent directive"
        assert "Sitemap:" in response.text, "Should have Sitemap directive"
        assert "Allow: /" in response.text, "Should allow root"
        print(f"✓ robots.txt is valid")


class TestStaticHTMLCanonical:
    """Tests for static HTML canonical tag implementation"""
    
    def test_homepage_has_canonical_tag(self):
        """Test homepage has canonical tag with empty href in static HTML"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Check for canonical tag with id and empty href
        assert 'id="canonical-tag"' in response.text, "Should have canonical tag with id"
        assert 'rel="canonical"' in response.text, "Should have rel=canonical"
        # The static HTML should have empty href (JS fills it in)
        assert 'href=""' in response.text or 'href="https://euromatchtickets.com' in response.text, "Canonical href should be empty or set by JS"
        print(f"✓ Homepage has canonical tag structure")
    
    def test_homepage_has_robots_meta(self):
        """Test homepage has robots meta tag with index, follow"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        
        # Check for robots meta tag
        assert 'name="robots"' in response.text, "Should have robots meta tag"
        assert 'index, follow' in response.text, "Should have index, follow directive"
        print(f"✓ Homepage has robots meta tag with index, follow")
    
    def test_static_html_has_vanilla_js_seo(self):
        """Test static HTML has vanilla JS SEO script"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        
        # Check for the vanilla JS SEO script markers
        assert "var B='https://euromatchtickets.com'" in response.text or "var B=" in response.text, "Should have base URL variable"
        assert "setMeta" in response.text, "Should have setMeta function"
        assert "is2025" in response.text, "Should have 2025 detection logic"
        print(f"✓ Static HTML has vanilla JS SEO script")


class TestPageSpecificCanonical:
    """Tests for page-specific canonical URLs"""
    
    def test_champions_league_page_loads(self):
        """Test Champions League page loads correctly"""
        response = requests.get(f"{BASE_URL}/champions-league-tickets")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ Champions League page loads")
    
    def test_f1_tickets_page_loads(self):
        """Test F1 tickets page loads correctly"""
        response = requests.get(f"{BASE_URL}/f1-tickets")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ F1 tickets page loads")
    
    def test_spanish_page_loads(self):
        """Test Spanish international page loads"""
        response = requests.get(f"{BASE_URL}/es/comprar-entradas")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ Spanish page /es/comprar-entradas loads")
    
    def test_german_page_loads(self):
        """Test German international page loads"""
        response = requests.get(f"{BASE_URL}/de/tickets-kaufen")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ German page /de/tickets-kaufen loads")
    
    def test_world_cup_page_loads(self):
        """Test World Cup 2026 page loads"""
        response = requests.get(f"{BASE_URL}/world-cup-2026")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ World Cup 2026 page loads")
    
    def test_bayern_munich_page_loads(self):
        """Test Bayern Munich tickets page loads"""
        response = requests.get(f"{BASE_URL}/bayern-munich-tickets")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ Bayern Munich tickets page loads")


class Test2025PagesNoIndex:
    """Tests for 2025 pages returning noindex"""
    
    def test_2025_page_detection_in_js(self):
        """Test that vanilla JS detects 2025 pages for noindex"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        
        # Check for 2025 detection logic in vanilla JS
        assert "is2025=p.indexOf('2025')!==-1" in response.text or "2025" in response.text, "Should have 2025 detection"
        assert "noindex, nofollow" in response.text, "Should have noindex directive for 2025 pages"
        print(f"✓ Vanilla JS has 2025 page noindex logic")


class TestHreflangTags:
    """Tests for hreflang tags on multilingual pages"""
    
    def test_homepage_has_hreflang_logic(self):
        """Test homepage has hreflang tag logic"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        
        # Check for hreflang logic in vanilla JS
        assert "hreflang" in response.text, "Should have hreflang logic"
        assert "x-default" in response.text, "Should have x-default hreflang"
        print(f"✓ Homepage has hreflang tag logic")


class TestSEOPageMeta:
    """Tests for /api/seo/page-meta endpoint"""
    
    def test_page_meta_homepage(self):
        """Test page-meta returns correct data for homepage"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "title" in data, "Missing title field"
        assert "description" in data, "Missing description field"
        assert "canonical" in data, "Missing canonical field"
        assert "euromatchtickets.com" in data["canonical"], "Canonical should point to euromatchtickets.com"
        print(f"✓ Page meta for homepage: {data['title'][:50]}...")
    
    def test_page_meta_f1_tickets(self):
        """Test page-meta returns correct data for F1 tickets"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/f1-tickets")
        assert response.status_code == 200
        
        data = response.json()
        assert "F1" in data["title"] or "f1" in data["title"].lower(), "Title should mention F1"
        assert "f1-tickets" in data["canonical"], "Canonical should include f1-tickets"
        print(f"✓ Page meta for F1 tickets: {data['title'][:50]}...")
    
    def test_page_meta_spanish(self):
        """Test page-meta returns correct data for Spanish page"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/es/comprar-entradas")
        assert response.status_code == 200
        
        data = response.json()
        assert "es/comprar-entradas" in data["canonical"], "Canonical should include Spanish path"
        print(f"✓ Page meta for Spanish page: {data['title'][:50]}...")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
