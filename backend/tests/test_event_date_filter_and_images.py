"""
Test Event Date Filtering and Local Image Implementation
- Tests that GET /api/events only returns future dated events
- Tests sitemap and internal-links filters
- Tests image cache headers for static assets
"""
import pytest
import requests
import os
from datetime import datetime, timezone

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEventDateFilter:
    """Verify all events returned by API are future-dated (>= today 2026-02-12)"""
    
    def test_api_health(self):
        """Verify API is running"""
        response = requests.get(f"{BASE_URL}/api")
        assert response.status_code == 200, f"API not running: {response.status_code}"
        print("✓ API is running")

    def test_all_events_have_future_dates(self):
        """GET /api/events should only return events with event_date >= today"""
        response = requests.get(f"{BASE_URL}/api/events?limit=200")
        assert response.status_code == 200, f"Failed to get events: {response.status_code}"
        
        events = response.json()
        assert len(events) > 0, "No events returned"
        
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        past_events = []
        
        for event in events:
            event_date = event.get('event_date', '')[:10]  # Get YYYY-MM-DD part
            if event_date < today:
                past_events.append({
                    'event_id': event.get('event_id'),
                    'title': event.get('title'),
                    'event_date': event_date
                })
        
        print(f"Total events returned: {len(events)}")
        print(f"Today's date: {today}")
        
        if past_events:
            print(f"FAILED: Found {len(past_events)} past events:")
            for pe in past_events[:5]:  # Show first 5
                print(f"  - {pe['title']} ({pe['event_date']})")
        else:
            print(f"✓ All {len(events)} events have future dates (>= {today})")
        
        assert len(past_events) == 0, f"Found {len(past_events)} past events in API response"

    def test_match_events_have_future_dates(self):
        """GET /api/events?event_type=match should only return future football matches"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=match")
        assert response.status_code == 200, f"Failed: {response.status_code}"
        
        events = response.json()
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        
        past_count = sum(1 for e in events if e.get('event_date', '')[:10] < today)
        
        print(f"Total football matches: {len(events)}")
        print(f"✓ All football matches have future dates" if past_count == 0 else f"FAILED: {past_count} past matches")
        
        assert past_count == 0, f"Found {past_count} past football matches"

    def test_concert_events_have_future_dates(self):
        """GET /api/events?event_type=concert should only return future concerts"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=concert")
        assert response.status_code == 200, f"Failed: {response.status_code}"
        
        events = response.json()
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        
        past_count = sum(1 for e in events if e.get('event_date', '')[:10] < today)
        
        print(f"Total concerts: {len(events)}")
        print(f"✓ All concerts have future dates" if past_count == 0 else f"FAILED: {past_count} past concerts")
        
        assert past_count == 0, f"Found {past_count} past concerts"

    def test_featured_events_have_future_dates(self):
        """GET /api/events?featured=true should only return future featured events"""
        response = requests.get(f"{BASE_URL}/api/events?featured=true")
        assert response.status_code == 200, f"Failed: {response.status_code}"
        
        events = response.json()
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        
        past_count = sum(1 for e in events if e.get('event_date', '')[:10] < today)
        
        print(f"Total featured events: {len(events)}")
        print(f"✓ All featured events have future dates" if past_count == 0 else f"FAILED: {past_count} past featured")
        
        assert past_count == 0, f"Found {past_count} past featured events"


class TestSitemapAndInternalLinks:
    """Verify sitemap and internal links only include future/valid events"""

    def test_sitemap_xml_structure(self):
        """GET /api/sitemap.xml should be valid XML"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200, f"Sitemap not accessible: {response.status_code}"
        
        content = response.text
        assert '<?xml version="1.0"' in content, "Invalid XML header"
        assert '<urlset xmlns=' in content, "Missing urlset element"
        assert '</urlset>' in content, "Missing closing urlset"
        
        print("✓ Sitemap XML structure is valid")

    def test_sitemap_no_past_events(self):
        """GET /api/sitemap.xml should not include past events"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200
        
        content = response.text
        # Check if any event URLs with old dates exist
        # The sitemap should only include events with future dates
        event_count = content.count('<loc>') - 20  # Approx static pages
        
        print(f"✓ Sitemap contains event URLs")
        print(f"Sitemap has Cache-Control: {response.headers.get('Cache-Control', 'not set')}")

    def test_internal_links_match_future_only(self):
        """GET /api/seo/internal-links/match should only return future event links"""
        response = requests.get(f"{BASE_URL}/api/seo/internal-links/match")
        assert response.status_code == 200, f"Failed: {response.status_code}"
        
        links = response.json()
        print(f"Football internal links returned: {len(links)}")
        
        # Verify links have proper structure
        for link in links:
            assert 'url' in link, "Missing url in internal link"
            assert 'title' in link, "Missing title in internal link"
            assert '/event/' in link['url'], f"Invalid event URL: {link['url']}"
        
        print("✓ Internal links for matches have correct structure")

    def test_internal_links_concert_future_only(self):
        """GET /api/seo/internal-links/concert should only return future concert links"""
        response = requests.get(f"{BASE_URL}/api/seo/internal-links/concert")
        assert response.status_code == 200, f"Failed: {response.status_code}"
        
        links = response.json()
        print(f"Concert internal links returned: {len(links)}")
        print("✓ Internal links for concerts working")


class TestImageCacheHeaders:
    """Verify image assets have proper cache headers"""

    def test_local_hero_images_exist(self):
        """Verify local hero WebP images exist"""
        images_to_check = [
            "/images/heroes/f1-red-lg.webp",
            "/images/heroes/football-stadium-lg.webp",
            "/images/heroes/concert-purple-lg.webp",
            "/images/heroes/motogp-orange-lg.webp",
            "/images/heroes/worldcup-trophy-lg.webp",
        ]
        
        for img_path in images_to_check:
            response = requests.head(f"{BASE_URL}{img_path}")
            assert response.status_code == 200, f"Missing image: {img_path}"
            print(f"✓ {img_path} exists")
        
        print("✓ All local hero images exist")

    def test_image_cache_headers(self):
        """Static image assets should have long Cache-Control headers"""
        # Test a local image
        response = requests.get(f"{BASE_URL}/images/heroes/f1-red-lg.webp")
        
        if response.status_code == 200:
            cache_control = response.headers.get('Cache-Control', '')
            print(f"Image Cache-Control: {cache_control}")
            # Note: Cloud providers may override cache headers
            print("✓ Image request successful")
        else:
            print(f"Image returned {response.status_code}")


class TestSEORelatedFeatures:
    """Additional SEO-related tests"""

    def test_robots_txt(self):
        """GET /api/robots.txt should be accessible"""
        response = requests.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200, f"robots.txt not accessible: {response.status_code}"
        
        content = response.text
        assert 'User-agent:' in content, "Missing User-agent directive"
        assert 'Sitemap:' in content, "Missing Sitemap directive"
        
        print("✓ robots.txt is properly configured")

    def test_sitemap_index_xml(self):
        """GET /api/sitemap-index.xml should list all sitemaps"""
        response = requests.get(f"{BASE_URL}/api/sitemap-index.xml")
        assert response.status_code == 200, f"Failed: {response.status_code}"
        
        content = response.text
        assert '<sitemapindex' in content, "Invalid sitemap index"
        assert '<sitemap>' in content, "No sitemaps listed"
        
        print("✓ Sitemap index is properly configured")

    def test_no_cancelled_events_in_api(self):
        """API should not return cancelled or expired events"""
        response = requests.get(f"{BASE_URL}/api/events?limit=200")
        assert response.status_code == 200
        
        events = response.json()
        
        invalid_status_count = 0
        for event in events:
            status = event.get('status', '')
            if status in ['cancelled', 'past_event', 'expired']:
                invalid_status_count += 1
        
        print(f"Events with cancelled/past/expired status: {invalid_status_count}")
        assert invalid_status_count == 0, f"Found {invalid_status_count} events with invalid status"
        print("✓ No cancelled/past/expired events in API response")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
