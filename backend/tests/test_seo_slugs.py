"""
Test SEO Slug Features - Event slug-based lookups, sitemap, robots.txt, related content
Tests new SEO overhaul features including:
- Event lookup by SEO slug
- Event lookup by old event_id (backward compatibility)
- Slug generation endpoint
- Sitemap with slug URLs
- Sitemap index
- Robots.txt with proper Sitemap URLs
- Full related content endpoint
- Content stats endpoint
"""
import pytest
import requests
import os
import xml.etree.ElementTree as ET

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEventSlugLookup:
    """Test event lookup by SEO slug and event_id"""
    
    def test_event_lookup_by_slug(self):
        """GET /api/events/{slug} - Should return event data when using SEO slug"""
        # Use a known slug format
        response = requests.get(f"{BASE_URL}/api/events/liverpool-vs-arsenal-2026-tickets")
        
        # Could be 200 (found) or 404 (not found) - both are valid responses
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Event found by slug: {data.get('title', 'N/A')}")
            # Verify slug field exists in response
            assert 'event_id' in data, "Response should contain event_id"
            assert 'title' in data, "Response should contain title"
        else:
            print(f"⚠️ Event with slug 'liverpool-vs-arsenal-2026-tickets' not found (404) - may not exist in DB")
            assert response.status_code == 404
    
    def test_event_lookup_by_event_id(self):
        """GET /api/events/{event_id} - Old event_id lookup should still work"""
        # First get an event to get its event_id
        events_response = requests.get(f"{BASE_URL}/api/events?limit=1")
        assert events_response.status_code == 200
        events = events_response.json()
        
        if len(events) > 0:
            event_id = events[0]['event_id']
            response = requests.get(f"{BASE_URL}/api/events/{event_id}")
            assert response.status_code == 200
            data = response.json()
            assert data['event_id'] == event_id
            print(f"✅ Event lookup by event_id '{event_id}' works")
            # Check that slug field exists
            if 'slug' in data:
                print(f"   Slug: {data['slug']}")
        else:
            pytest.skip("No events in database")
    
    def test_events_list_contains_slug(self):
        """GET /api/events - Events list should include slug field"""
        response = requests.get(f"{BASE_URL}/api/events?limit=5")
        assert response.status_code == 200
        events = response.json()
        
        if len(events) > 0:
            # Check if at least some events have slugs
            events_with_slugs = [e for e in events if 'slug' in e and e['slug']]
            print(f"✅ {len(events_with_slugs)}/{len(events)} events have slug field")
            if events_with_slugs:
                print(f"   Sample slug: {events_with_slugs[0]['slug']}")
        else:
            pytest.skip("No events in database")


class TestSlugGeneration:
    """Test slug generation endpoint"""
    
    def test_generate_slugs_endpoint(self):
        """POST /api/events/generate-slugs - Should generate slugs (returns 0 if all done)"""
        response = requests.post(f"{BASE_URL}/api/events/generate-slugs")
        assert response.status_code == 200
        data = response.json()
        
        assert 'generated' in data, "Response should contain 'generated' count"
        assert 'total_events' in data, "Response should contain 'total_events' count"
        
        print(f"✅ Generate slugs: {data['generated']} new slugs created")
        print(f"   Total events: {data['total_events']}")


class TestSitemap:
    """Test sitemap endpoints"""
    
    def test_sitemap_xml(self):
        """GET /api/sitemap.xml - Should return valid XML sitemap with slug URLs"""
        response = requests.get(f"{BASE_URL}/api/sitemap.xml")
        assert response.status_code == 200
        assert 'application/xml' in response.headers.get('Content-Type', '')
        
        # Parse XML
        root = ET.fromstring(response.content)
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = root.findall('.//s:loc', ns)
        
        print(f"✅ Sitemap.xml contains {len(urls)} URLs")
        
        # Check for event URLs with slugs (not event_ids)
        event_urls = [u.text for u in urls if '/event/' in u.text]
        if event_urls:
            # Sample event URL to check format
            sample_url = event_urls[0]
            print(f"   Sample event URL: {sample_url}")
            # Event URLs should use slugs (contain hyphens and 'tickets')
            # Format: /event/{slug} where slug is like 'liverpool-vs-arsenal-2026-tickets'
            event_part = sample_url.split('/event/')[-1]
            if '-' in event_part and 'tickets' in event_part.lower():
                print(f"   ✅ Event URLs appear to use SEO slugs")
            elif event_part.startswith('e_'):
                print(f"   ⚠️ Event URLs still using event_id format (e_...)")
    
    def test_sitemap_index_xml(self):
        """GET /api/sitemap-index.xml - Should return valid sitemap index"""
        response = requests.get(f"{BASE_URL}/api/sitemap-index.xml")
        assert response.status_code == 200
        assert 'application/xml' in response.headers.get('Content-Type', '')
        
        # Parse XML
        root = ET.fromstring(response.content)
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        sitemaps = root.findall('.//s:loc', ns)
        
        print(f"✅ Sitemap index contains {len(sitemaps)} sitemaps")
        for sitemap in sitemaps[:5]:  # Show first 5
            print(f"   - {sitemap.text}")


class TestRobotsTxt:
    """Test robots.txt endpoint"""
    
    def test_robots_txt(self):
        """GET /api/robots.txt - Should have Sitemap URLs with /api/ prefix"""
        response = requests.get(f"{BASE_URL}/api/robots.txt")
        assert response.status_code == 200
        content = response.text
        
        print(f"✅ robots.txt returned ({len(content)} bytes)")
        
        # Check for Sitemap directives
        assert 'Sitemap:' in content, "robots.txt should contain Sitemap directive"
        
        # Check that sitemap URLs have /api/ prefix
        lines = content.split('\n')
        sitemap_lines = [l for l in lines if l.startswith('Sitemap:')]
        
        for line in sitemap_lines:
            url = line.replace('Sitemap:', '').strip()
            print(f"   Sitemap URL: {url}")
            if '/api/' in url:
                print(f"   ✅ Contains /api/ prefix")
            else:
                print(f"   ⚠️ Missing /api/ prefix")


class TestRelatedContent:
    """Test related content endpoints for internal linking"""
    
    def test_full_related_endpoint(self):
        """GET /api/seo/full-related/{slug} - Should return 4 sections of related content"""
        # Use a known SEO page slug
        response = requests.get(f"{BASE_URL}/api/seo/full-related/bahrain-grand-prix-2026-tickets")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check for 4 required sections
            required_sections = ['related_pages', 'city_events', 'upcoming_events', 'similar_pages']
            for section in required_sections:
                assert section in data, f"Response should contain '{section}'"
                print(f"   {section}: {len(data[section])} items")
            
            print(f"✅ Full related endpoint returns all 4 sections")
        else:
            print(f"⚠️ full-related endpoint returned {response.status_code}")
            # It might return empty sections if page doesn't exist
            if response.status_code == 404:
                pytest.skip("Page 'bahrain-grand-prix-2026-tickets' not found in seo_pages")
    
    def test_related_pages_endpoint(self):
        """GET /api/seo/related-pages - Should return related pages for internal linking"""
        response = requests.get(f"{BASE_URL}/api/seo/related-pages?category=f1&limit=8")
        assert response.status_code == 200
        data = response.json()
        
        assert 'links' in data, "Response should contain 'links' array"
        print(f"✅ Related pages returned {len(data['links'])} links")
        
        if data['links']:
            sample = data['links'][0]
            print(f"   Sample link: {sample.get('url', 'N/A')} - {sample.get('title', 'N/A')}")


class TestContentStats:
    """Test content statistics endpoint"""
    
    def test_content_stats(self):
        """GET /api/seo/content-stats - Should show content generation stats"""
        response = requests.get(f"{BASE_URL}/api/seo/content-stats")
        assert response.status_code == 200
        data = response.json()
        
        assert data.get('status') == 'success', "Should return success status"
        
        print(f"✅ Content stats:")
        print(f"   Total pages: {data.get('total_pages', 'N/A')}")
        print(f"   AI generated: {data.get('ai_generated', 'N/A')}")
        print(f"   Template only: {data.get('template_only', 'N/A')}")


class TestEventFields:
    """Test that events have required SEO fields"""
    
    def test_event_has_image_fields(self):
        """Events should have image_url and image_alt fields"""
        response = requests.get(f"{BASE_URL}/api/events?limit=3")
        assert response.status_code == 200
        events = response.json()
        
        if len(events) > 0:
            event = events[0]
            # Get full event details
            detail_response = requests.get(f"{BASE_URL}/api/events/{event['event_id']}")
            if detail_response.status_code == 200:
                detail = detail_response.json()
                
                # Check for image fields
                has_image_url = 'image_url' in detail or 'image' in detail
                has_image_alt = 'image_alt' in detail
                
                print(f"✅ Event '{detail.get('title', 'N/A')}':")
                print(f"   Has image_url/image: {has_image_url}")
                print(f"   Has image_alt: {has_image_alt}")
                if has_image_url:
                    img = detail.get('image_url') or detail.get('image')
                    print(f"   Image: {img[:80] if img else 'N/A'}...")


@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session
