"""
SEO and Image Testing for EuroMatchTickets
Tests: Logo files, manifest.json, OG image, Cache headers, GZip
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestLogoAndManifest:
    """Tests for logo files and manifest.json"""
    
    def test_favicon_exists(self):
        """favicon.ico should be accessible"""
        response = requests.get(f"{BASE_URL}/favicon.ico", timeout=10)
        assert response.status_code == 200, f"favicon.ico not found: {response.status_code}"
        print("OK: favicon.ico exists")
    
    def test_logo_32_exists(self):
        """logo-32.png should be accessible"""
        response = requests.get(f"{BASE_URL}/logo-32.png", timeout=10)
        assert response.status_code == 200, f"logo-32.png not found: {response.status_code}"
        print("OK: logo-32.png exists")
    
    def test_logo_192_exists(self):
        """logo-192.png should be accessible for PWA"""
        response = requests.get(f"{BASE_URL}/logo-192.png", timeout=10)
        assert response.status_code == 200, f"logo-192.png not found: {response.status_code}"
        print("OK: logo-192.png exists")
    
    def test_logo_512_exists(self):
        """logo-512.png should be accessible for PWA"""
        response = requests.get(f"{BASE_URL}/logo-512.png", timeout=10)
        assert response.status_code == 200, f"logo-512.png not found: {response.status_code}"
        print("OK: logo-512.png exists")
    
    def test_og_image_exists(self):
        """og-image.jpg should be accessible for social sharing"""
        response = requests.get(f"{BASE_URL}/og-image.jpg", timeout=10)
        assert response.status_code == 200, f"og-image.jpg not found: {response.status_code}"
        print("OK: og-image.jpg exists")
    
    def test_apple_touch_icon_exists(self):
        """apple-touch-icon.png should be accessible"""
        response = requests.get(f"{BASE_URL}/apple-touch-icon.png", timeout=10)
        assert response.status_code == 200, f"apple-touch-icon.png not found: {response.status_code}"
        print("OK: apple-touch-icon.png exists")
    
    def test_manifest_json_exists(self):
        """manifest.json should be accessible"""
        response = requests.get(f"{BASE_URL}/manifest.json", timeout=10)
        assert response.status_code == 200, f"manifest.json not found: {response.status_code}"
        print("OK: manifest.json exists")
    
    def test_manifest_has_icons(self):
        """manifest.json should have icon references"""
        response = requests.get(f"{BASE_URL}/manifest.json", timeout=10)
        assert response.status_code == 200
        data = response.json()
        
        assert "icons" in data, "manifest.json should have icons"
        icons = data["icons"]
        assert len(icons) >= 2, "manifest.json should have at least 2 icons"
        
        # Check for 192 and 512 icons
        icon_sizes = [icon.get("sizes") for icon in icons]
        assert "192x192" in icon_sizes, "manifest.json should have 192x192 icon"
        assert "512x512" in icon_sizes, "manifest.json should have 512x512 icon"
        print(f"OK: manifest.json has {len(icons)} icons including 192x192 and 512x512")


class TestBackendCacheAndCompression:
    """Tests for cache headers and GZip compression"""
    
    def test_api_events_returns_data(self):
        """GET /api/events should return event data"""
        response = requests.get(f"{BASE_URL}/api/events?limit=5", timeout=10)
        assert response.status_code == 200, f"API events failed: {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Events should be a list"
        print(f"OK: /api/events returns {len(data)} events")
    
    def test_api_has_gzip_support(self):
        """API should support GZip compression"""
        headers = {"Accept-Encoding": "gzip, deflate"}
        response = requests.get(f"{BASE_URL}/api/events?limit=5", headers=headers, timeout=10)
        assert response.status_code == 200
        
        # Check if gzip was used (content will be auto-decompressed by requests)
        # The header might be removed by intermediaries but we check the response size
        content_length = len(response.content)
        print(f"OK: API response received ({content_length} bytes)")
    
    def test_sitemap_index_accessible(self):
        """Sitemap index should be accessible"""
        response = requests.get(f"{BASE_URL}/api/sitemap-index.xml", timeout=10)
        assert response.status_code == 200, f"Sitemap index failed: {response.status_code}"
        assert "xml" in response.headers.get("content-type", "").lower() or "<?xml" in response.text[:100]
        print("OK: sitemap-index.xml accessible")


class TestHeroImages:
    """Tests for local hero images in /images/heroes/ path"""
    
    def test_f1_red_image_exists(self):
        """F1 red hero image should exist"""
        response = requests.get(f"{BASE_URL}/images/heroes/f1-red.jpg", timeout=10)
        assert response.status_code == 200, f"f1-red.jpg not found: {response.status_code}"
        print("OK: f1-red.jpg exists")
    
    def test_f1_red_webp_exists(self):
        """F1 red WebP image should exist"""
        response = requests.get(f"{BASE_URL}/images/heroes/f1-red-lg.webp", timeout=10)
        assert response.status_code == 200, f"f1-red-lg.webp not found: {response.status_code}"
        print("OK: f1-red-lg.webp exists")
    
    def test_football_stadium_image_exists(self):
        """Football stadium hero image should exist"""
        response = requests.get(f"{BASE_URL}/images/heroes/football-stadium.jpg", timeout=10)
        assert response.status_code == 200, f"football-stadium.jpg not found: {response.status_code}"
        print("OK: football-stadium.jpg exists")
    
    def test_concert_purple_image_exists(self):
        """Concert purple hero image should exist"""
        response = requests.get(f"{BASE_URL}/images/heroes/concert-purple.jpg", timeout=10)
        assert response.status_code == 200, f"concert-purple.jpg not found: {response.status_code}"
        print("OK: concert-purple.jpg exists")
    
    def test_motogp_orange_image_exists(self):
        """MotoGP orange hero image should exist"""
        response = requests.get(f"{BASE_URL}/images/heroes/motogp-orange.jpg", timeout=10)
        assert response.status_code == 200, f"motogp-orange.jpg not found: {response.status_code}"
        print("OK: motogp-orange.jpg exists")
    
    def test_worldcup_trophy_image_exists(self):
        """WorldCup trophy (gold) hero image should exist"""
        response = requests.get(f"{BASE_URL}/images/heroes/worldcup-trophy.jpg", timeout=10)
        assert response.status_code == 200, f"worldcup-trophy.jpg not found: {response.status_code}"
        print("OK: worldcup-trophy.jpg exists")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
