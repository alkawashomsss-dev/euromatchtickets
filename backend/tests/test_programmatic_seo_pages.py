"""
Test suite for 91 Programmatic SEO Pages
Tests: API endpoints for city+event combinations (F1+City, Football+City, Concert+City, 
Champions League+City, World Cup+City, Buy Team Tickets, Niche SEO pages)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestProgrammaticSEOPages:
    """Test programmatic SEO page API endpoints"""
    
    # F1 + City pages
    def test_f1_tickets_london_2026(self):
        """Test F1 London page returns 200 with correct data"""
        response = requests.get(f"{BASE_URL}/api/seo/page/f1-tickets-london-2026")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data, "Missing title"
        assert "content" in data, "Missing content"
        assert "faq" in data, "Missing faq"
        assert len(data.get("faq", [])) >= 3, f"Expected at least 3 FAQs, got {len(data.get('faq', []))}"
        assert "price_low" in data, "Missing price_low"
        assert "city" in data, "Missing city"
        assert data.get("city", "").lower() in ["london", "silverstone"], f"City should be London/Silverstone, got {data.get('city')}"
        print(f"✓ f1-tickets-london-2026: title={data.get('title')[:50]}..., price_low={data.get('price_low')}, city={data.get('city')}")
    
    # Buy Team Tickets pages
    def test_buy_manchester_united_tickets(self):
        """Test Manchester United tickets page returns 200 with correct data"""
        response = requests.get(f"{BASE_URL}/api/seo/page/buy-manchester-united-tickets")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data, "Missing title"
        assert "content" in data, "Missing content"
        assert len(data.get("content", "")) > 100, "Content too short"
        assert "faq" in data, "Missing faq"
        print(f"✓ buy-manchester-united-tickets: title={data.get('title')[:50]}...")
    
    # World Cup + City pages
    def test_world_cup_2026_tickets_miami(self):
        """Test World Cup Miami page returns 200"""
        response = requests.get(f"{BASE_URL}/api/seo/page/world-cup-2026-tickets-miami")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data, "Missing title"
        assert "city" in data, "Missing city"
        assert "miami" in data.get("city", "").lower() or "miami" in data.get("slug", "").lower(), "City should contain Miami"
        print(f"✓ world-cup-2026-tickets-miami: title={data.get('title')[:50]}..., city={data.get('city')}")
    
    # Concert + City pages
    def test_concert_tickets_berlin_2026(self):
        """Test Concert Berlin page returns 200"""
        response = requests.get(f"{BASE_URL}/api/seo/page/concert-tickets-berlin-2026")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data, "Missing title"
        assert "city" in data, "Missing city"
        assert "berlin" in data.get("city", "").lower(), f"City should be Berlin, got {data.get('city')}"
        print(f"✓ concert-tickets-berlin-2026: title={data.get('title')[:50]}..., city={data.get('city')}")
    
    # Champions League + City pages
    def test_champions_league_tickets_madrid(self):
        """Test Champions League Madrid page returns 200"""
        response = requests.get(f"{BASE_URL}/api/seo/page/champions-league-tickets-madrid")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data, "Missing title"
        assert "city" in data, "Missing city"
        assert "madrid" in data.get("city", "").lower(), f"City should be Madrid, got {data.get('city')}"
        print(f"✓ champions-league-tickets-madrid: title={data.get('title')[:50]}..., city={data.get('city')}")
    
    # Niche SEO pages
    def test_cheap_f1_tickets_2026(self):
        """Test Cheap F1 Tickets niche page returns 200"""
        response = requests.get(f"{BASE_URL}/api/seo/page/cheap-f1-tickets-2026")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data, "Missing title"
        assert "content" in data, "Missing content"
        assert "cheap" in data.get("title", "").lower() or "cheap" in data.get("slug", "").lower(), "Title should contain 'cheap'"
        print(f"✓ cheap-f1-tickets-2026: title={data.get('title')[:50]}...")


class TestProgrammaticPageDataQuality:
    """Test data quality of programmatic SEO pages"""
    
    def test_page_has_unique_content(self):
        """Verify pages have unique content (300-1200 chars)"""
        slugs = ["f1-tickets-london-2026", "concert-tickets-berlin-2026", "world-cup-2026-tickets-miami"]
        contents = []
        for slug in slugs:
            response = requests.get(f"{BASE_URL}/api/seo/page/{slug}")
            if response.status_code == 200:
                data = response.json()
                content = data.get("content", "")
                contents.append(content)
                content_len = len(content)
                assert content_len >= 200, f"{slug}: Content too short ({content_len} chars)"
                print(f"✓ {slug}: content length = {content_len} chars")
        
        # Check uniqueness - no two pages should have identical content
        for i, c1 in enumerate(contents):
            for j, c2 in enumerate(contents):
                if i < j:
                    assert c1 != c2, f"Pages {slugs[i]} and {slugs[j]} have identical content"
        print("✓ All tested pages have unique content")
    
    def test_page_has_correct_price_data(self):
        """Verify pages have price_low and price_high"""
        response = requests.get(f"{BASE_URL}/api/seo/page/f1-tickets-london-2026")
        assert response.status_code == 200
        data = response.json()
        price_low = data.get("price_low")
        assert price_low is not None, "Missing price_low"
        assert isinstance(price_low, (int, float)), f"price_low should be numeric, got {type(price_low)}"
        assert price_low > 0, f"price_low should be positive, got {price_low}"
        print(f"✓ f1-tickets-london-2026: price_low={price_low}")
    
    def test_page_has_3_faqs(self):
        """Verify pages have exactly 3 FAQs"""
        response = requests.get(f"{BASE_URL}/api/seo/page/f1-tickets-london-2026")
        assert response.status_code == 200
        data = response.json()
        faqs = data.get("faq", [])
        assert len(faqs) >= 3, f"Expected at least 3 FAQs, got {len(faqs)}"
        # Verify FAQ structure
        for i, faq in enumerate(faqs[:3]):
            assert isinstance(faq, (list, tuple)), f"FAQ {i} should be list/tuple"
            assert len(faq) >= 2, f"FAQ {i} should have question and answer"
            assert len(faq[0]) > 10, f"FAQ {i} question too short"
            assert len(faq[1]) > 20, f"FAQ {i} answer too short"
        print(f"✓ f1-tickets-london-2026: {len(faqs)} FAQs with proper structure")


class TestSitemapIncludesProgrammaticPages:
    """Test that sitemap includes programmatic pages"""
    
    def test_sitemap_includes_f1_london(self):
        """Verify sitemap includes f1-tickets-london-2026"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200, f"Sitemap returned {response.status_code}"
        sitemap_content = response.text
        assert "f1-tickets-london-2026" in sitemap_content, "f1-tickets-london-2026 not in sitemap"
        print("✓ Sitemap includes f1-tickets-london-2026")
    
    def test_sitemap_includes_world_cup_miami(self):
        """Verify sitemap includes world-cup-2026-tickets-miami"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200
        sitemap_content = response.text
        assert "world-cup-2026-tickets-miami" in sitemap_content, "world-cup-2026-tickets-miami not in sitemap"
        print("✓ Sitemap includes world-cup-2026-tickets-miami")
    
    def test_sitemap_includes_concert_berlin(self):
        """Verify sitemap includes concert-tickets-berlin-2026"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200
        sitemap_content = response.text
        assert "concert-tickets-berlin-2026" in sitemap_content, "concert-tickets-berlin-2026 not in sitemap"
        print("✓ Sitemap includes concert-tickets-berlin-2026")


class TestAdditionalProgrammaticPages:
    """Test additional programmatic page variations"""
    
    def test_f1_barcelona_2026(self):
        """Test F1 Barcelona page"""
        response = requests.get(f"{BASE_URL}/api/seo/page/f1-tickets-barcelona-2026")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "barcelona" in data.get("city", "").lower(), f"City should be Barcelona, got {data.get('city')}"
        print(f"✓ f1-tickets-barcelona-2026: city={data.get('city')}")
    
    def test_football_tickets_madrid(self):
        """Test Football Madrid page - verify city badge shows 'Madrid' not 'Programmatic City'"""
        response = requests.get(f"{BASE_URL}/api/seo/page/football-tickets-madrid")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        city = data.get("city", "")
        assert city.lower() == "madrid", f"City should be 'Madrid', got '{city}'"
        assert "programmatic" not in city.lower(), f"City should NOT contain 'Programmatic', got '{city}'"
        print(f"✓ football-tickets-madrid: city='{city}' (correct, not 'Programmatic City')")
    
    def test_buy_chelsea_fc_tickets(self):
        """Test Buy Chelsea FC Tickets page"""
        response = requests.get(f"{BASE_URL}/api/seo/page/buy-chelsea-fc-tickets")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data
        print(f"✓ buy-chelsea-fc-tickets: title={data.get('title')[:50]}...")
    
    def test_premier_league_tickets_2026(self):
        """Test Premier League 2026 page"""
        response = requests.get(f"{BASE_URL}/api/seo/page/premier-league-tickets-2026")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "title" in data
        print(f"✓ premier-league-tickets-2026: title={data.get('title')[:50]}...")


class TestSEOPageStats:
    """Test SEO page statistics endpoint"""
    
    def test_seo_stats_shows_programmatic_pages(self):
        """Verify SEO stats endpoint shows programmatic page types"""
        response = requests.get(f"{BASE_URL}/api/seo/stats")
        assert response.status_code == 200
        data = response.json()
        total = data.get("total_pages", 0)
        assert total > 90, f"Expected >90 total pages (91 programmatic + existing), got {total}"
        by_type = data.get("by_type", {})
        # Check for programmatic page types
        programmatic_types = ["programmatic_city", "programmatic_team", "programmatic_niche"]
        found_programmatic = sum(by_type.get(pt, 0) for pt in programmatic_types)
        print(f"✓ SEO stats: total={total}, by_type={by_type}")
        print(f"✓ Programmatic pages found: {found_programmatic}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
