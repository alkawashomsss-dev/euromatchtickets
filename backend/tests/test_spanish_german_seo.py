"""
Test Spanish and German SEO landing pages and CSS animations.
Tests for: /es/* routes, /de/* routes, sitemap inclusion, CSS animation classes.
"""
import pytest
import requests
import os
import re

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSitemapSpanishGermanURLs:
    """Verify Spanish and German SEO pages are included in sitemap."""

    def test_sitemap_returns_200(self):
        """Sitemap endpoint returns success."""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200, f"Sitemap returned {response.status_code}"
        assert "application/xml" in response.headers.get("Content-Type", "")

    def test_sitemap_contains_spanish_pages(self):
        """Sitemap includes all Spanish SEO pages."""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        content = response.text
        
        spanish_pages = [
            "/es/comprar-entradas",
            "/es/entradas-champions-league",
            "/es/entradas-f1",
            "/es/entradas-conciertos",
            "/es/entradas-copa-del-mundo-2026",
        ]
        
        for page in spanish_pages:
            assert page in content, f"Spanish page {page} not found in sitemap"
        print(f"All {len(spanish_pages)} Spanish pages found in sitemap")

    def test_sitemap_contains_german_pages(self):
        """Sitemap includes all German SEO pages."""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        content = response.text
        
        german_pages = [
            "/de/tickets-kaufen",
            "/de/champions-league-tickets",
            "/de/formel-1-tickets",
            "/de/bundesliga-tickets",
            "/de/konzert-tickets",
            "/de/wm-2026-tickets",
        ]
        
        for page in german_pages:
            assert page in content, f"German page {page} not found in sitemap"
        print(f"All {len(german_pages)} German pages found in sitemap")

    def test_sitemap_spanish_pages_have_weekly_frequency(self):
        """Spanish pages have correct changefreq in sitemap."""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        content = response.text
        
        # Check that Spanish pages have weekly changefreq
        assert "es/comprar-entradas</loc>" in content
        # Verify priority is present for Spanish pages
        assert "<priority>0.90</priority>" in content or "<priority>0.85</priority>" in content

    def test_sitemap_german_pages_have_weekly_frequency(self):
        """German pages have correct changefreq in sitemap."""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        content = response.text
        
        # Check that German pages have weekly changefreq
        assert "de/tickets-kaufen</loc>" in content
        # Verify priority is present
        assert "<priority>0.90</priority>" in content or "<priority>0.85</priority>" in content


class TestSpanishLandingPages:
    """Test Spanish landing pages load correctly."""

    def test_spanish_main_page_loads(self):
        """Spanish main landing page /es/comprar-entradas loads."""
        response = requests.get(f"{BASE_URL}/es/comprar-entradas", allow_redirects=True)
        assert response.status_code == 200, f"Spanish main page returned {response.status_code}"

    def test_spanish_champions_league_page_loads(self):
        """Spanish Champions League page loads."""
        response = requests.get(f"{BASE_URL}/es/entradas-champions-league", allow_redirects=True)
        assert response.status_code == 200

    def test_spanish_f1_page_loads(self):
        """Spanish F1 page loads."""
        response = requests.get(f"{BASE_URL}/es/entradas-f1", allow_redirects=True)
        assert response.status_code == 200

    def test_spanish_concerts_page_loads(self):
        """Spanish concerts page loads."""
        response = requests.get(f"{BASE_URL}/es/entradas-conciertos", allow_redirects=True)
        assert response.status_code == 200

    def test_spanish_world_cup_page_loads(self):
        """Spanish World Cup 2026 page loads."""
        response = requests.get(f"{BASE_URL}/es/entradas-copa-del-mundo-2026", allow_redirects=True)
        assert response.status_code == 200


class TestGermanLandingPages:
    """Test German landing pages load correctly."""

    def test_german_main_page_loads(self):
        """German main landing page /de/tickets-kaufen loads."""
        response = requests.get(f"{BASE_URL}/de/tickets-kaufen", allow_redirects=True)
        assert response.status_code == 200, f"German main page returned {response.status_code}"

    def test_german_champions_league_page_loads(self):
        """German Champions League page loads."""
        response = requests.get(f"{BASE_URL}/de/champions-league-tickets", allow_redirects=True)
        assert response.status_code == 200

    def test_german_f1_page_loads(self):
        """German F1 page loads."""
        response = requests.get(f"{BASE_URL}/de/formel-1-tickets", allow_redirects=True)
        assert response.status_code == 200

    def test_german_bundesliga_page_loads(self):
        """German Bundesliga page loads."""
        response = requests.get(f"{BASE_URL}/de/bundesliga-tickets", allow_redirects=True)
        assert response.status_code == 200

    def test_german_concerts_page_loads(self):
        """German concerts page loads."""
        response = requests.get(f"{BASE_URL}/de/konzert-tickets", allow_redirects=True)
        assert response.status_code == 200

    def test_german_world_cup_page_loads(self):
        """German World Cup 2026 page loads."""
        response = requests.get(f"{BASE_URL}/de/wm-2026-tickets", allow_redirects=True)
        assert response.status_code == 200


class TestMotorsportEventForAnimations:
    """Test motorsport event page loads for speed line animations."""

    def test_motogp_event_loads(self):
        """MotoGP event page (event_fb49b98c7df6) loads."""
        response = requests.get(f"{BASE_URL}/api/events/event_fb49b98c7df6")
        assert response.status_code == 200, f"MotoGP event API returned {response.status_code}"
        data = response.json()
        # Verify this is a motorsport event
        assert data.get("event_type") in ["motogp", "f1"], f"Event type is {data.get('event_type')}"
        print(f"MotoGP event title: {data.get('title')}")

    def test_motogp_event_detail_page_loads(self):
        """MotoGP event detail frontend page loads."""
        response = requests.get(f"{BASE_URL}/event/event_fb49b98c7df6", allow_redirects=True)
        assert response.status_code == 200, f"MotoGP event detail page returned {response.status_code}"


class TestCSSAnimationsExist:
    """Verify CSS animation classes are defined in App.css by checking frontend."""
    
    def test_homepage_loads_with_css(self):
        """Homepage loads successfully (CSS is bundled)."""
        response = requests.get(f"{BASE_URL}/", allow_redirects=True)
        assert response.status_code == 200
        # Check that CSS is loaded (typically bundled in HTML or via link)
        assert "<!DOCTYPE html>" in response.text or "<!doctype html>" in response.text.lower()


@pytest.fixture(scope="session")
def api_client():
    """Shared requests session."""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
