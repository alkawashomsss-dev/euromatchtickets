"""
SEO Meta Tags API Tests
Tests for /api/seo/page-meta endpoint to verify unique titles, descriptions, and canonicals
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://euro-indexing.preview.emergentagent.com')


class TestSEOPageMetaAPI:
    """Tests for /api/seo/page-meta endpoint"""
    
    def test_homepage_meta(self):
        """Homepage should return unique title and correct canonical"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/")
        assert response.status_code == 200
        data = response.json()
        
        # Title should be unique, not generic
        assert "title" in data
        assert data["title"] != "EuroMatchTickets - Europe's #1 Ticket Marketplace"
        assert "EuroMatchTickets" in data["title"]
        
        # Canonical should be homepage
        assert data["canonical"] == "https://euromatchtickets.com/"
        
        # Description should exist
        assert "description" in data
        assert len(data["description"]) > 50
        print(f"✅ Homepage: {data['title']}")
    
    def test_champions_league_meta(self):
        """Champions League page should have unique title"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/champions-league-tickets")
        assert response.status_code == 200
        data = response.json()
        
        # Title should be page-specific
        assert "Champions League" in data["title"]
        assert data["title"] != "EuroMatchTickets - Europe's #1 Ticket Marketplace"
        
        # Canonical should be page-specific (NOT homepage)
        assert data["canonical"] == "https://euromatchtickets.com/champions-league-tickets"
        assert data["canonical"] != "https://euromatchtickets.com/"
        print(f"✅ Champions League: {data['title']}")
    
    def test_f1_tickets_meta(self):
        """F1 Tickets page should have unique title"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/f1-tickets")
        assert response.status_code == 200
        data = response.json()
        
        assert "F1" in data["title"] or "Formula" in data["title"]
        assert data["canonical"] == "https://euromatchtickets.com/f1-tickets"
        print(f"✅ F1 Tickets: {data['title']}")
    
    def test_real_madrid_meta(self):
        """Real Madrid page should have unique title"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/real-madrid-tickets")
        assert response.status_code == 200
        data = response.json()
        
        assert "Real Madrid" in data["title"]
        assert data["canonical"] == "https://euromatchtickets.com/real-madrid-tickets"
        print(f"✅ Real Madrid: {data['title']}")
    
    def test_about_page_meta(self):
        """About page should have unique title"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/about")
        assert response.status_code == 200
        data = response.json()
        
        assert "About" in data["title"]
        assert data["canonical"] == "https://euromatchtickets.com/about"
        print(f"✅ About: {data['title']}")
    
    def test_spanish_page_meta_fallback(self):
        """Spanish page should return meta (may use fallback)"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/es/comprar-entradas")
        assert response.status_code == 200
        data = response.json()
        
        # Canonical should be correct
        assert data["canonical"] == "https://euromatchtickets.com/es/comprar-entradas"
        assert data["canonical"] != "https://euromatchtickets.com/"
        print(f"✅ Spanish: {data['title']} (canonical correct)")
    
    def test_german_page_meta_fallback(self):
        """German page should return meta (may use fallback)"""
        response = requests.get(f"{BASE_URL}/api/seo/page-meta?path=/de/tickets-kaufen")
        assert response.status_code == 200
        data = response.json()
        
        # Canonical should be correct
        assert data["canonical"] == "https://euromatchtickets.com/de/tickets-kaufen"
        assert data["canonical"] != "https://euromatchtickets.com/"
        print(f"✅ German: {data['title']} (canonical correct)")
    
    def test_all_pages_have_unique_canonicals(self):
        """All pages should have page-specific canonicals, not homepage"""
        test_paths = [
            "/champions-league-tickets",
            "/f1-tickets",
            "/real-madrid-tickets",
            "/about",
            "/es/comprar-entradas",
            "/de/tickets-kaufen",
        ]
        
        for path in test_paths:
            response = requests.get(f"{BASE_URL}/api/seo/page-meta?path={path}")
            assert response.status_code == 200
            data = response.json()
            
            expected_canonical = f"https://euromatchtickets.com{path}"
            assert data["canonical"] == expected_canonical, f"Path {path}: canonical is {data['canonical']}, expected {expected_canonical}"
            assert data["canonical"] != "https://euromatchtickets.com/", f"Path {path}: canonical points to homepage!"
        
        print("✅ All pages have unique canonicals")
    
    def test_no_generic_titles(self):
        """No page should return the generic marketplace title"""
        test_paths = [
            "/",
            "/champions-league-tickets",
            "/f1-tickets",
            "/real-madrid-tickets",
            "/about",
        ]
        
        generic_title = "EuroMatchTickets - Europe's #1 Ticket Marketplace"
        
        for path in test_paths:
            response = requests.get(f"{BASE_URL}/api/seo/page-meta?path={path}")
            assert response.status_code == 200
            data = response.json()
            
            assert data["title"] != generic_title, f"Path {path}: has generic title"
        
        print("✅ No pages have generic titles")


class TestSitemapEndpoints:
    """Tests for sitemap endpoints"""
    
    def test_sitemap_xml(self):
        """Main sitemap should return valid XML"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200
        assert "application/xml" in response.headers.get("Content-Type", "")
        assert "<urlset" in response.text
        assert "<loc>" in response.text
        print("✅ Sitemap XML is valid")
    
    def test_sitemap_index(self):
        """Sitemap index should return valid XML"""
        response = requests.get(f"{BASE_URL}/api/sitemap-index.xml")
        assert response.status_code == 200
        assert "application/xml" in response.headers.get("Content-Type", "")
        assert "<sitemapindex" in response.text
        print("✅ Sitemap index is valid")
    
    def test_robots_txt(self):
        """Robots.txt should allow indexing"""
        response = requests.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200
        assert "Allow: /" in response.text
        assert "Sitemap:" in response.text
        # Should NOT have Disallow: / at root level
        assert "Disallow: /\n" not in response.text.replace("Disallow: /admin", "")
        print("✅ Robots.txt allows indexing")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
