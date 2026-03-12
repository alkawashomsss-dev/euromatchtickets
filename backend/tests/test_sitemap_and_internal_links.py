"""
Tests for Sitemap Fix and Internal Links API
- Sitemap-index.xml should NOT contain articles entry (0 articles in DB)
- articles.xml should return empty but valid XML
- related-pages API should return contextually related pages
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')


class TestSitemapIndex:
    """Test /api/sitemap-index.xml - Fix for empty articles causing GSC error"""

    def test_sitemap_index_returns_valid_xml(self):
        """Sitemap-index.xml should return valid XML with 200 status"""
        response = requests.get(f"{BASE_URL}/api/sitemap-index.xml")
        assert response.status_code == 200
        assert 'application/xml' in response.headers.get('Content-Type', '')
        assert '<?xml version="1.0"' in response.text
        assert '<sitemapindex xmlns=' in response.text
        print("✓ sitemap-index.xml returns valid XML")

    def test_sitemap_index_does_not_contain_articles(self):
        """Sitemap-index.xml should NOT contain articles entry (0 articles in DB)"""
        response = requests.get(f"{BASE_URL}/api/sitemap-index.xml")
        assert response.status_code == 200
        assert 'articles.xml' not in response.text, "articles.xml should NOT be in sitemap-index when 0 articles exist"
        print("✓ sitemap-index.xml does NOT contain articles entry")

    def test_sitemap_index_has_exactly_6_entries(self):
        """Sitemap-index.xml should have exactly 6 sitemap entries (pages, f1, football, concerts, worldcup, cities)"""
        response = requests.get(f"{BASE_URL}/api/sitemap-index.xml")
        assert response.status_code == 200
        sitemap_count = response.text.count('<sitemap>')
        assert sitemap_count == 6, f"Expected 6 sitemap entries, got {sitemap_count}"
        
        # Verify each expected category is present
        expected_categories = ['pages', 'f1', 'football', 'concerts', 'worldcup', 'cities']
        for cat in expected_categories:
            assert f'/sitemaps/{cat}.xml' in response.text, f"Missing {cat}.xml in sitemap-index"
        print("✓ sitemap-index.xml has exactly 6 entries (no articles)")


class TestArticlesSitemap:
    """Test /api/sitemaps/articles.xml - Should return empty but valid XML"""

    def test_articles_sitemap_returns_valid_empty_xml(self):
        """articles.xml should return valid XML with empty urlset (no error)"""
        response = requests.get(f"{BASE_URL}/api/sitemaps/articles.xml")
        assert response.status_code == 200
        assert 'application/xml' in response.headers.get('Content-Type', '')
        assert '<?xml version="1.0"' in response.text
        assert '<urlset xmlns=' in response.text
        assert '</urlset>' in response.text
        # Should have empty urlset (no <url> entries)
        assert '<url>' not in response.text, "articles.xml should have empty urlset (0 articles)"
        print("✓ articles.xml returns valid empty XML (no URLs)")


class TestOtherSitemaps:
    """Test other sitemap endpoints still work"""

    def test_pages_sitemap_returns_valid_xml(self):
        """pages.xml should return valid XML with static pages"""
        response = requests.get(f"{BASE_URL}/api/sitemaps/pages.xml")
        assert response.status_code == 200
        assert '<urlset xmlns=' in response.text
        assert '<url>' in response.text  # Should have URLs
        print("✓ pages.xml works correctly")

    def test_f1_sitemap_returns_valid_xml(self):
        """f1.xml should return valid XML with F1 pages"""
        response = requests.get(f"{BASE_URL}/api/sitemaps/f1.xml")
        assert response.status_code == 200
        assert '<urlset xmlns=' in response.text
        assert '<url>' in response.text
        print("✓ f1.xml works correctly")

    def test_football_sitemap_returns_valid_xml(self):
        """football.xml should return valid XML with football pages"""
        response = requests.get(f"{BASE_URL}/api/sitemaps/football.xml")
        assert response.status_code == 200
        assert '<urlset xmlns=' in response.text
        assert '<url>' in response.text
        print("✓ football.xml works correctly")

    def test_concerts_sitemap_returns_valid_xml(self):
        """concerts.xml should return valid XML with concert pages"""
        response = requests.get(f"{BASE_URL}/api/sitemaps/concerts.xml")
        assert response.status_code == 200
        assert '<urlset xmlns=' in response.text
        assert '<url>' in response.text
        print("✓ concerts.xml works correctly")


class TestRelatedPagesAPI:
    """Test /api/seo/related-pages endpoint for internal linking"""

    def test_related_pages_f1_returns_links_array(self):
        """GET /api/seo/related-pages?category=f1&limit=6 should return JSON with links array"""
        response = requests.get(f"{BASE_URL}/api/seo/related-pages?category=f1&limit=6")
        assert response.status_code == 200
        data = response.json()
        assert 'links' in data, "Response should have 'links' key"
        assert isinstance(data['links'], list), "'links' should be an array"
        assert len(data['links']) > 0, "Should return at least 1 F1 related page"
        assert len(data['links']) <= 6, "Should respect limit parameter"
        
        # Verify link structure
        for link in data['links']:
            assert 'url' in link
            assert 'title' in link
            assert link['url'].startswith('/')
        print(f"✓ related-pages for F1 returns {len(data['links'])} links")

    def test_related_pages_concert_returns_links(self):
        """GET /api/seo/related-pages?category=concert&limit=6 should return concert pages"""
        response = requests.get(f"{BASE_URL}/api/seo/related-pages?category=concert&limit=6")
        assert response.status_code == 200
        data = response.json()
        assert 'links' in data
        assert len(data['links']) > 0
        
        # Verify concert category in response
        has_concert_category = any(link.get('category') == 'concert' for link in data['links'])
        assert has_concert_category, "Should include concert category pages"
        print(f"✓ related-pages for concert returns {len(data['links'])} links")

    def test_related_pages_excludes_current_slug(self):
        """Related pages should exclude the current page slug from results"""
        slug = "bahrain-grand-prix-tickets-2026"
        response = requests.get(f"{BASE_URL}/api/seo/related-pages?category=f1&slug={slug}&city=Sakhir")
        assert response.status_code == 200
        data = response.json()
        
        # Check that the current slug is NOT in the results
        urls = [link['url'] for link in data['links']]
        assert f"/{slug}" not in urls, f"Current slug '{slug}' should be excluded from results"
        print(f"✓ Current slug correctly excluded from results")

    def test_related_pages_football_with_cross_category(self):
        """Football category with limit=8 should include cross-category pages if needed"""
        response = requests.get(f"{BASE_URL}/api/seo/related-pages?category=football&limit=8")
        assert response.status_code == 200
        data = response.json()
        assert 'links' in data
        assert len(data['links']) <= 8
        print(f"✓ related-pages for football returns {len(data['links'])} links (may include cross-category)")

    def test_related_pages_includes_url_title_category_city(self):
        """Each link should include url, title, category, and city fields"""
        response = requests.get(f"{BASE_URL}/api/seo/related-pages?category=f1&limit=3")
        assert response.status_code == 200
        data = response.json()
        
        for link in data['links']:
            assert 'url' in link, "Link should have 'url'"
            assert 'title' in link, "Link should have 'title'"
            assert 'category' in link, "Link should have 'category'"
            assert 'city' in link, "Link should have 'city'"
        print("✓ Links include all required fields (url, title, category, city)")

    def test_related_pages_same_city_different_category(self):
        """When city is specified, should return same-city pages from different categories"""
        response = requests.get(f"{BASE_URL}/api/seo/related-pages?category=f1&city=Sakhir&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert 'links' in data
        # This may include cross-category pages from Sakhir if available
        print(f"✓ related-pages with city filter returns {len(data['links'])} links")


class TestStaticSitemapFile:
    """Test the static sitemap-index.xml file in frontend/public"""

    def test_static_sitemap_exists(self):
        """Static sitemap-index.xml should exist and be accessible"""
        # Read the file directly
        sitemap_path = '/app/frontend/public/sitemap-index.xml'
        assert os.path.exists(sitemap_path), "Static sitemap-index.xml should exist"
        
        with open(sitemap_path, 'r') as f:
            content = f.read()
        
        assert '<?xml version="1.0"' in content
        assert '<sitemapindex xmlns=' in content
        print("✓ Static sitemap-index.xml exists and is valid XML")

    def test_static_sitemap_no_articles_entry(self):
        """Static sitemap-index.xml should NOT contain articles.xml entry"""
        sitemap_path = '/app/frontend/public/sitemap-index.xml'
        with open(sitemap_path, 'r') as f:
            content = f.read()
        
        assert 'articles.xml' not in content, "Static sitemap should NOT have articles.xml entry"
        print("✓ Static sitemap-index.xml does NOT contain articles entry")

    def test_static_sitemap_has_correct_entries(self):
        """Static sitemap should have pages, f1, football, concerts, worldcup, cities"""
        sitemap_path = '/app/frontend/public/sitemap-index.xml'
        with open(sitemap_path, 'r') as f:
            content = f.read()
        
        expected = ['pages.xml', 'f1.xml', 'football.xml', 'concerts.xml', 'worldcup.xml', 'cities.xml']
        for entry in expected:
            assert entry in content, f"Missing {entry} in static sitemap"
        print("✓ Static sitemap has all 6 expected entries")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
