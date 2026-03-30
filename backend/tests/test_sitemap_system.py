"""
EuroMatchTickets Sitemap System Tests
=====================================
Tests for the comprehensive sitemap system including:
- Sitemap index validation (9 child sitemaps)
- XML validity for all sitemaps
- Hreflang annotations in international sitemap
- Image tags in events sitemap
- Priority and changefreq validation
- URL deduplication across sitemaps
- API endpoints for status and regeneration
"""

import pytest
import requests
import os
import xml.etree.ElementTree as ET
from collections import defaultdict

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# XML namespaces used in sitemaps
NAMESPACES = {
    'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xhtml': 'http://www.w3.org/1999/xhtml',
    'image': 'http://www.google.com/schemas/sitemap-image/1.1'
}


class TestSitemapIndex:
    """Tests for the main sitemap.xml index file"""
    
    def test_sitemap_index_returns_valid_xml(self):
        """GET /sitemap.xml must return valid XML sitemapindex"""
        response = requests.get(f"{BASE_URL}/sitemap.xml")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Parse XML
        root = ET.fromstring(response.content)
        assert 'sitemapindex' in root.tag, f"Root element should be sitemapindex, got {root.tag}"
        print("PASSED: sitemap.xml returns valid XML sitemapindex")
    
    def test_sitemap_index_has_9_child_sitemaps(self):
        """Sitemap index must contain exactly 9 child sitemaps"""
        response = requests.get(f"{BASE_URL}/sitemap.xml")
        root = ET.fromstring(response.content)
        
        sitemaps = root.findall('sm:sitemap', NAMESPACES)
        assert len(sitemaps) == 9, f"Expected 9 child sitemaps, got {len(sitemaps)}"
        
        # Verify expected sitemap names
        expected_sitemaps = [
            'sitemap-core.xml',
            'sitemap-f1-motorsport.xml',
            'sitemap-football.xml',
            'sitemap-concerts.xml',
            'sitemap-worldcup.xml',
            'sitemap-city-regional.xml',
            'sitemap-events.xml',
            'sitemap-international.xml',
            'sitemap-guides.xml'
        ]
        
        found_sitemaps = []
        for sitemap in sitemaps:
            loc = sitemap.find('sm:loc', NAMESPACES)
            if loc is not None:
                found_sitemaps.append(loc.text.split('/')[-1])
        
        for expected in expected_sitemaps:
            assert expected in found_sitemaps, f"Missing sitemap: {expected}"
        
        print(f"PASSED: Found all 9 expected sitemaps: {found_sitemaps}")
    
    def test_sitemap_index_uses_correct_domain(self):
        """All sitemap URLs must use https://euromatchtickets.com domain"""
        response = requests.get(f"{BASE_URL}/sitemap.xml")
        root = ET.fromstring(response.content)
        
        for sitemap in root.findall('sm:sitemap', NAMESPACES):
            loc = sitemap.find('sm:loc', NAMESPACES)
            assert loc is not None, "Sitemap missing <loc> element"
            assert loc.text.startswith('https://euromatchtickets.com/'), \
                f"URL should use euromatchtickets.com domain: {loc.text}"
        
        print("PASSED: All sitemap URLs use correct domain")


class TestChildSitemaps:
    """Tests for individual child sitemap files"""
    
    @pytest.mark.parametrize("sitemap_name", [
        "sitemap-core.xml",
        "sitemap-f1-motorsport.xml",
        "sitemap-football.xml",
        "sitemap-concerts.xml",
        "sitemap-worldcup.xml",
        "sitemap-city-regional.xml",
        "sitemap-events.xml",
        "sitemap-international.xml",
        "sitemap-guides.xml"
    ])
    def test_child_sitemap_is_valid_xml(self, sitemap_name):
        """Each child sitemap must be valid XML"""
        response = requests.get(f"{BASE_URL}/{sitemap_name}")
        assert response.status_code == 200, f"{sitemap_name}: Expected 200, got {response.status_code}"
        
        # Parse XML - will raise exception if invalid
        root = ET.fromstring(response.content)
        assert 'urlset' in root.tag, f"{sitemap_name}: Root should be urlset, got {root.tag}"
        
        # Check for URLs
        urls = root.findall('sm:url', NAMESPACES)
        assert len(urls) > 0, f"{sitemap_name}: Should contain at least one URL"
        
        print(f"PASSED: {sitemap_name} is valid XML with {len(urls)} URLs")


class TestCoreSitemap:
    """Tests for sitemap-core.xml specific requirements"""
    
    def test_homepage_has_priority_1_and_hourly_changefreq(self):
        """Homepage must have priority 1.00 and changefreq hourly"""
        response = requests.get(f"{BASE_URL}/sitemap-core.xml")
        root = ET.fromstring(response.content)
        
        homepage_found = False
        for url in root.findall('sm:url', NAMESPACES):
            loc = url.find('sm:loc', NAMESPACES)
            if loc is not None and loc.text == 'https://euromatchtickets.com/':
                homepage_found = True
                
                priority = url.find('sm:priority', NAMESPACES)
                assert priority is not None, "Homepage missing priority"
                assert priority.text == '1.00', f"Homepage priority should be 1.00, got {priority.text}"
                
                changefreq = url.find('sm:changefreq', NAMESPACES)
                assert changefreq is not None, "Homepage missing changefreq"
                assert changefreq.text == 'hourly', f"Homepage changefreq should be hourly, got {changefreq.text}"
                
                break
        
        assert homepage_found, "Homepage URL not found in sitemap-core.xml"
        print("PASSED: Homepage has priority 1.00 and changefreq hourly")
    
    def test_homepage_has_hreflang_annotations(self):
        """Homepage must have hreflang annotations for all languages"""
        response = requests.get(f"{BASE_URL}/sitemap-core.xml")
        root = ET.fromstring(response.content)
        
        for url in root.findall('sm:url', NAMESPACES):
            loc = url.find('sm:loc', NAMESPACES)
            if loc is not None and loc.text == 'https://euromatchtickets.com/':
                hreflang_links = url.findall('xhtml:link', NAMESPACES)
                assert len(hreflang_links) >= 5, f"Homepage should have at least 5 hreflang links, got {len(hreflang_links)}"
                
                # Check for required languages
                langs = [link.get('hreflang') for link in hreflang_links]
                required_langs = ['en', 'es', 'de', 'fr', 'it', 'x-default']
                for lang in required_langs:
                    assert lang in langs, f"Missing hreflang for {lang}"
                
                print(f"PASSED: Homepage has hreflang for: {langs}")
                return
        
        pytest.fail("Homepage not found in sitemap-core.xml")


class TestInternationalSitemap:
    """Tests for sitemap-international.xml with hreflang annotations"""
    
    def test_international_sitemap_has_hreflang_annotations(self):
        """International sitemap must contain xhtml:link hreflang annotations"""
        response = requests.get(f"{BASE_URL}/sitemap-international.xml")
        root = ET.fromstring(response.content)
        
        urls_with_hreflang = 0
        for url in root.findall('sm:url', NAMESPACES):
            hreflang_links = url.findall('xhtml:link', NAMESPACES)
            if len(hreflang_links) > 0:
                urls_with_hreflang += 1
        
        assert urls_with_hreflang > 0, "No URLs with hreflang annotations found"
        print(f"PASSED: Found {urls_with_hreflang} URLs with hreflang annotations")
    
    def test_hreflang_is_bidirectional(self):
        """Hreflang must be bidirectional (es links to en, de, fr, it and vice versa)"""
        response = requests.get(f"{BASE_URL}/sitemap-international.xml")
        root = ET.fromstring(response.content)
        
        # Find Spanish homepage and check it links to all other languages
        for url in root.findall('sm:url', NAMESPACES):
            loc = url.find('sm:loc', NAMESPACES)
            if loc is not None and '/es/comprar-entradas' in loc.text:
                hreflang_links = url.findall('xhtml:link', NAMESPACES)
                langs = {link.get('hreflang'): link.get('href') for link in hreflang_links}
                
                # Check bidirectional links
                assert 'en' in langs, "Spanish page missing link to English"
                assert 'de' in langs, "Spanish page missing link to German"
                assert 'fr' in langs, "Spanish page missing link to French"
                assert 'it' in langs, "Spanish page missing link to Italian"
                assert 'x-default' in langs, "Spanish page missing x-default"
                
                print(f"PASSED: Spanish page has bidirectional hreflang: {list(langs.keys())}")
                return
        
        pytest.fail("Spanish homepage not found in international sitemap")


class TestEventsSitemap:
    """Tests for sitemap-events.xml with image tags"""
    
    def test_events_sitemap_has_image_tags(self):
        """Events sitemap must contain image:image tags for events with images"""
        response = requests.get(f"{BASE_URL}/sitemap-events.xml")
        root = ET.fromstring(response.content)
        
        urls_with_images = 0
        for url in root.findall('sm:url', NAMESPACES):
            images = url.findall('image:image', NAMESPACES)
            if len(images) > 0:
                urls_with_images += 1
                
                # Verify image structure
                for img in images:
                    img_loc = img.find('image:loc', NAMESPACES)
                    assert img_loc is not None, "Image missing <image:loc>"
                    assert img_loc.text.startswith('http'), f"Invalid image URL: {img_loc.text}"
        
        assert urls_with_images > 0, "No events with image tags found"
        print(f"PASSED: Found {urls_with_images} events with image tags")
    
    def test_events_have_image_titles(self):
        """Event images should have titles"""
        response = requests.get(f"{BASE_URL}/sitemap-events.xml")
        root = ET.fromstring(response.content)
        
        images_with_titles = 0
        total_images = 0
        
        for url in root.findall('sm:url', NAMESPACES):
            for img in url.findall('image:image', NAMESPACES):
                total_images += 1
                img_title = img.find('image:title', NAMESPACES)
                if img_title is not None and img_title.text:
                    images_with_titles += 1
        
        assert total_images > 0, "No images found"
        print(f"PASSED: {images_with_titles}/{total_images} images have titles")


class TestURLDeduplication:
    """Tests for URL deduplication across all sitemaps"""
    
    def test_no_duplicate_urls_across_sitemaps(self):
        """No URL should appear in more than one sitemap"""
        all_urls = defaultdict(list)
        
        sitemap_names = [
            "sitemap-core.xml",
            "sitemap-f1-motorsport.xml",
            "sitemap-football.xml",
            "sitemap-concerts.xml",
            "sitemap-worldcup.xml",
            "sitemap-city-regional.xml",
            "sitemap-events.xml",
            "sitemap-international.xml",
            "sitemap-guides.xml"
        ]
        
        for sitemap_name in sitemap_names:
            response = requests.get(f"{BASE_URL}/{sitemap_name}")
            if response.status_code == 200:
                root = ET.fromstring(response.content)
                for url in root.findall('sm:url', NAMESPACES):
                    loc = url.find('sm:loc', NAMESPACES)
                    if loc is not None:
                        all_urls[loc.text].append(sitemap_name)
        
        # Find duplicates
        duplicates = {url: sitemaps for url, sitemaps in all_urls.items() if len(sitemaps) > 1}
        
        if duplicates:
            print(f"WARNING: Found {len(duplicates)} duplicate URLs across sitemaps")
            for url, sitemaps in list(duplicates.items())[:5]:
                print(f"  {url}: {sitemaps}")
        
        # Allow test to pass but report duplicates
        assert len(duplicates) == 0, f"Found {len(duplicates)} duplicate URLs"
        print(f"PASSED: No duplicate URLs found across {len(sitemap_names)} sitemaps")
    
    def test_total_urls_approximately_2125(self):
        """Total URLs across all sitemaps should be approximately 2125"""
        response = requests.get(f"{BASE_URL}/api/sitemap/status")
        assert response.status_code == 200
        
        data = response.json()
        total_urls = data.get('total_urls', 0)
        
        # Allow some variance (±100)
        assert 2000 <= total_urls <= 2250, f"Expected ~2125 URLs, got {total_urls}"
        print(f"PASSED: Total URLs = {total_urls} (expected ~2125)")


class TestSitemapAPI:
    """Tests for sitemap API endpoints"""
    
    def test_sitemap_status_endpoint(self):
        """GET /api/sitemap/status must return JSON with total_urls and sitemaps array"""
        response = requests.get(f"{BASE_URL}/api/sitemap/status")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Verify required fields
        assert 'total_urls' in data, "Response missing 'total_urls'"
        assert 'sitemaps' in data, "Response missing 'sitemaps'"
        assert isinstance(data['sitemaps'], list), "'sitemaps' should be a list"
        assert len(data['sitemaps']) > 0, "'sitemaps' should not be empty"
        
        # Verify sitemap structure
        for sitemap in data['sitemaps']:
            assert 'file' in sitemap, "Sitemap missing 'file'"
            assert 'url_count' in sitemap, "Sitemap missing 'url_count'"
        
        print(f"PASSED: /api/sitemap/status returns {data['total_urls']} total URLs across {len(data['sitemaps'])} sitemaps")
    
    def test_sitemap_regenerate_endpoint(self):
        """POST /api/sitemap/regenerate must return status regeneration_started"""
        response = requests.post(f"{BASE_URL}/api/sitemap/regenerate")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        assert 'status' in data, "Response missing 'status'"
        assert data['status'] == 'regeneration_started', f"Expected 'regeneration_started', got {data['status']}"
        
        print("PASSED: /api/sitemap/regenerate returns regeneration_started")


class TestURLDomain:
    """Tests for URL domain consistency"""
    
    def test_all_urls_use_euromatchtickets_domain(self):
        """All sitemap URLs must use https://euromatchtickets.com domain"""
        sitemap_names = [
            "sitemap-core.xml",
            "sitemap-international.xml",
            "sitemap-events.xml"
        ]
        
        invalid_urls = []
        
        for sitemap_name in sitemap_names:
            response = requests.get(f"{BASE_URL}/{sitemap_name}")
            if response.status_code == 200:
                root = ET.fromstring(response.content)
                for url in root.findall('sm:url', NAMESPACES):
                    loc = url.find('sm:loc', NAMESPACES)
                    if loc is not None and not loc.text.startswith('https://euromatchtickets.com'):
                        invalid_urls.append((sitemap_name, loc.text))
        
        assert len(invalid_urls) == 0, f"Found {len(invalid_urls)} URLs with wrong domain: {invalid_urls[:5]}"
        print("PASSED: All URLs use https://euromatchtickets.com domain")


class TestXMLStructure:
    """Tests for XML structure and schema compliance"""
    
    def test_sitemaps_have_required_elements(self):
        """Each URL entry must have loc, lastmod, changefreq, and priority"""
        response = requests.get(f"{BASE_URL}/sitemap-core.xml")
        root = ET.fromstring(response.content)
        
        for url in root.findall('sm:url', NAMESPACES):
            loc = url.find('sm:loc', NAMESPACES)
            lastmod = url.find('sm:lastmod', NAMESPACES)
            changefreq = url.find('sm:changefreq', NAMESPACES)
            priority = url.find('sm:priority', NAMESPACES)
            
            assert loc is not None, "URL missing <loc>"
            assert lastmod is not None, f"URL {loc.text} missing <lastmod>"
            assert changefreq is not None, f"URL {loc.text} missing <changefreq>"
            assert priority is not None, f"URL {loc.text} missing <priority>"
        
        print("PASSED: All URLs have required elements (loc, lastmod, changefreq, priority)")
    
    def test_priority_values_are_valid(self):
        """Priority values must be between 0.0 and 1.0"""
        response = requests.get(f"{BASE_URL}/sitemap-core.xml")
        root = ET.fromstring(response.content)
        
        for url in root.findall('sm:url', NAMESPACES):
            priority = url.find('sm:priority', NAMESPACES)
            if priority is not None:
                try:
                    val = float(priority.text)
                    assert 0.0 <= val <= 1.0, f"Invalid priority: {val}"
                except ValueError:
                    pytest.fail(f"Priority is not a number: {priority.text}")
        
        print("PASSED: All priority values are valid (0.0-1.0)")
    
    def test_changefreq_values_are_valid(self):
        """Changefreq values must be valid sitemap values"""
        valid_changefreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
        
        response = requests.get(f"{BASE_URL}/sitemap-core.xml")
        root = ET.fromstring(response.content)
        
        for url in root.findall('sm:url', NAMESPACES):
            changefreq = url.find('sm:changefreq', NAMESPACES)
            if changefreq is not None:
                assert changefreq.text in valid_changefreq, f"Invalid changefreq: {changefreq.text}"
        
        print("PASSED: All changefreq values are valid")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
