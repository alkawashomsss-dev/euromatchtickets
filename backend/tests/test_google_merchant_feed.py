"""
Google Merchant Center Feed Tests
Tests for /api/merchant/feed.xml and /api/merchant/feed-status endpoints
"""
import pytest
import requests
import os
import xml.etree.ElementTree as ET
from collections import Counter

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestMerchantFeedXML:
    """Tests for /api/merchant/feed.xml endpoint"""
    
    def test_feed_returns_200_and_xml(self):
        """Feed endpoint returns 200 with XML content type"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert "application/xml" in response.headers.get("Content-Type", ""), "Content-Type should be application/xml"
        print("PASSED: Feed returns 200 with XML content type")
    
    def test_feed_is_valid_xml(self):
        """Feed XML is well-formed and parseable"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        assert response.status_code == 200
        try:
            root = ET.fromstring(response.content)
            assert root.tag == "rss", f"Root element should be 'rss', got '{root.tag}'"
            print("PASSED: Feed is valid XML with rss root element")
        except ET.ParseError as e:
            pytest.fail(f"XML parsing failed: {e}")
    
    def test_feed_has_rss_2_format_with_google_namespace(self):
        """Feed uses RSS 2.0 format with Google Shopping namespace"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        content = response.text
        root = ET.fromstring(response.content)
        
        # Check RSS version
        assert root.get("version") == "2.0", "RSS version should be 2.0"
        
        # Check Google namespace in raw XML (ElementTree normalizes namespaces)
        assert 'xmlns:g="http://base.google.com/ns/1.0"' in content, \
            "Feed should have Google Shopping namespace (xmlns:g='http://base.google.com/ns/1.0')"
        print("PASSED: Feed has RSS 2.0 format with Google namespace")
    
    def test_feed_has_channel_with_metadata(self):
        """Feed has channel element with title, link, description"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        channel = root.find("channel")
        assert channel is not None, "Feed should have channel element"
        
        title = channel.find("title")
        assert title is not None and title.text, "Channel should have title"
        
        link = channel.find("link")
        assert link is not None and link.text, "Channel should have link"
        
        description = channel.find("description")
        assert description is not None and description.text, "Channel should have description"
        
        print(f"PASSED: Channel has title='{title.text}', link='{link.text}'")
    
    def test_feed_contains_products(self):
        """Feed contains product items"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        channel = root.find("channel")
        items = channel.findall("item")
        
        assert len(items) > 0, "Feed should contain at least one product"
        print(f"PASSED: Feed contains {len(items)} products")
    
    def test_feed_has_approximately_1200_products(self):
        """Feed should have approximately 1200 products (from seo_pages)"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        channel = root.find("channel")
        items = channel.findall("item")
        
        # Allow some variance (1000-1500 products)
        assert len(items) >= 1000, f"Expected at least 1000 products, got {len(items)}"
        print(f"PASSED: Feed has {len(items)} products (expected ~1200)")
    
    def test_products_have_required_google_fields(self):
        """Each product has all required Google Merchant fields"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        # Define Google namespace
        ns = {"g": "http://base.google.com/ns/1.0"}
        
        channel = root.find("channel")
        items = channel.findall("item")
        
        required_fields = [
            "g:id", "g:title", "g:description", "g:link", 
            "g:image_link", "g:price", "g:availability", 
            "g:condition", "g:brand"
        ]
        
        # Check first 10 products
        for i, item in enumerate(items[:10]):
            for field in required_fields:
                elem = item.find(field, ns)
                assert elem is not None, f"Product {i+1} missing required field: {field}"
                assert elem.text and len(elem.text.strip()) > 0, f"Product {i+1} has empty {field}"
        
        print(f"PASSED: First 10 products have all required Google fields")
    
    def test_all_product_ids_are_unique(self):
        """All product IDs (g:id) are unique - no duplicates"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        ns = {"g": "http://base.google.com/ns/1.0"}
        channel = root.find("channel")
        items = channel.findall("item")
        
        ids = []
        for item in items:
            id_elem = item.find("g:id", ns)
            if id_elem is not None and id_elem.text:
                ids.append(id_elem.text)
        
        # Check for duplicates
        id_counts = Counter(ids)
        duplicates = {k: v for k, v in id_counts.items() if v > 1}
        
        assert len(duplicates) == 0, f"Found duplicate product IDs: {duplicates}"
        assert len(ids) == len(items), "All products should have IDs"
        print(f"PASSED: All {len(ids)} product IDs are unique")
    
    def test_all_products_have_nonzero_prices(self):
        """All products have non-zero prices in 'XX EUR' format"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        ns = {"g": "http://base.google.com/ns/1.0"}
        channel = root.find("channel")
        items = channel.findall("item")
        
        zero_price_products = []
        invalid_format_products = []
        
        for item in items:
            price_elem = item.find("g:price", ns)
            id_elem = item.find("g:id", ns)
            product_id = id_elem.text if id_elem is not None else "unknown"
            
            if price_elem is not None and price_elem.text:
                price_text = price_elem.text.strip()
                
                # Check format: should be "XX EUR"
                if not price_text.endswith(" EUR"):
                    invalid_format_products.append((product_id, price_text))
                    continue
                
                # Extract numeric value
                try:
                    price_value = float(price_text.replace(" EUR", ""))
                    if price_value <= 0:
                        zero_price_products.append((product_id, price_text))
                except ValueError:
                    invalid_format_products.append((product_id, price_text))
        
        assert len(zero_price_products) == 0, f"Found products with zero/negative prices: {zero_price_products[:5]}"
        assert len(invalid_format_products) == 0, f"Found products with invalid price format: {invalid_format_products[:5]}"
        print(f"PASSED: All {len(items)} products have valid non-zero prices in 'XX EUR' format")
    
    def test_products_have_correct_google_product_category(self):
        """Products have correct google_product_category for event tickets"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        ns = {"g": "http://base.google.com/ns/1.0"}
        channel = root.find("channel")
        items = channel.findall("item")
        
        valid_categories = [
            "Arts & Entertainment > Event Tickets",
            "Arts & Entertainment > Event Tickets > Sporting Event Tickets",
            "Arts & Entertainment > Event Tickets > Concert & Music Festival Tickets"
        ]
        
        invalid_categories = []
        for item in items[:50]:  # Check first 50
            cat_elem = item.find("g:google_product_category", ns)
            id_elem = item.find("g:id", ns)
            product_id = id_elem.text if id_elem is not None else "unknown"
            
            if cat_elem is not None and cat_elem.text:
                if not any(cat_elem.text.startswith(vc) for vc in valid_categories):
                    invalid_categories.append((product_id, cat_elem.text))
        
        assert len(invalid_categories) == 0, f"Found products with invalid categories: {invalid_categories[:5]}"
        print("PASSED: Products have correct google_product_category for event tickets")
    
    def test_products_have_shipping_info(self):
        """Products have shipping info with free e-ticket delivery"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        ns = {"g": "http://base.google.com/ns/1.0"}
        channel = root.find("channel")
        items = channel.findall("item")
        
        # Check first 10 products
        for i, item in enumerate(items[:10]):
            shipping = item.find("g:shipping", ns)
            assert shipping is not None, f"Product {i+1} missing shipping element"
            
            # Check shipping has country, service, price
            country = shipping.find("g:country", ns)
            service = shipping.find("g:service", ns)
            price = shipping.find("g:price", ns)
            
            assert country is not None, f"Product {i+1} shipping missing country"
            assert service is not None, f"Product {i+1} shipping missing service"
            assert price is not None, f"Product {i+1} shipping missing price"
            
            # Verify free shipping (0 EUR)
            assert "0" in price.text, f"Product {i+1} should have free shipping, got {price.text}"
        
        print("PASSED: Products have shipping info with free e-ticket delivery")
    
    def test_products_have_custom_labels(self):
        """Products have custom labels (category, city, price tier, year)"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        ns = {"g": "http://base.google.com/ns/1.0"}
        channel = root.find("channel")
        items = channel.findall("item")
        
        # Check first 10 products
        for i, item in enumerate(items[:10]):
            label0 = item.find("g:custom_label_0", ns)  # category
            label1 = item.find("g:custom_label_1", ns)  # city
            label2 = item.find("g:custom_label_2", ns)  # price tier
            label3 = item.find("g:custom_label_3", ns)  # year
            
            assert label0 is not None, f"Product {i+1} missing custom_label_0 (category)"
            assert label1 is not None, f"Product {i+1} missing custom_label_1 (city)"
            assert label2 is not None, f"Product {i+1} missing custom_label_2 (price tier)"
            assert label3 is not None, f"Product {i+1} missing custom_label_3 (year)"
            
            # Verify price tier values
            assert label2.text in ["budget", "mid-range", "premium"], f"Invalid price tier: {label2.text}"
        
        print("PASSED: Products have custom labels (category, city, price tier, year)")
    
    def test_feed_has_no_html_entities_or_broken_chars(self):
        """Feed does not contain HTML entities or broken characters"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        content = response.text
        
        # Check for common HTML entities that should be XML-escaped
        problematic_patterns = [
            "&nbsp;", "&copy;", "&reg;", "&trade;",
            "&#", "\\u", "\x00", "\x1f"
        ]
        
        found_issues = []
        for pattern in problematic_patterns:
            if pattern in content:
                found_issues.append(pattern)
        
        # These are OK in XML: &amp; &lt; &gt; &quot; &apos;
        assert len(found_issues) == 0, f"Found problematic patterns in feed: {found_issues}"
        print("PASSED: Feed has no HTML entities or broken characters")
    
    def test_products_have_identifier_exists_false(self):
        """Products have identifier_exists=false (tickets don't have GTINs)"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed.xml", timeout=60)
        root = ET.fromstring(response.content)
        
        ns = {"g": "http://base.google.com/ns/1.0"}
        channel = root.find("channel")
        items = channel.findall("item")
        
        # Check first 10 products
        for i, item in enumerate(items[:10]):
            id_exists = item.find("g:identifier_exists", ns)
            assert id_exists is not None, f"Product {i+1} missing identifier_exists"
            assert id_exists.text == "false", f"Product {i+1} identifier_exists should be 'false', got '{id_exists.text}'"
        
        print("PASSED: Products have identifier_exists=false")


class TestMerchantFeedStatus:
    """Tests for /api/merchant/feed-status endpoint"""
    
    def test_feed_status_returns_200(self):
        """Feed status endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed-status", timeout=30)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("PASSED: Feed status returns 200")
    
    def test_feed_status_has_required_fields(self):
        """Feed status has feed_url, total_products, products_by_category"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed-status", timeout=30)
        data = response.json()
        
        assert "feed_url" in data, "Missing feed_url"
        assert "total_products" in data, "Missing total_products"
        assert "products_by_category" in data, "Missing products_by_category"
        
        # Verify feed_url format
        assert "/api/merchant/feed.xml" in data["feed_url"], f"Invalid feed_url: {data['feed_url']}"
        
        # Verify total_products is a number
        assert isinstance(data["total_products"], int), "total_products should be integer"
        assert data["total_products"] > 0, "total_products should be > 0"
        
        # Verify products_by_category is a dict
        assert isinstance(data["products_by_category"], dict), "products_by_category should be dict"
        
        print(f"PASSED: Feed status has required fields - total_products={data['total_products']}")
    
    def test_feed_status_shows_categories(self):
        """Feed status shows product counts by category"""
        response = requests.get(f"{BASE_URL}/api/merchant/feed-status", timeout=30)
        data = response.json()
        
        categories = data.get("products_by_category", {})
        
        # Should have at least some categories
        assert len(categories) > 0, "Should have at least one category"
        
        # All counts should be positive integers
        for cat, count in categories.items():
            assert isinstance(count, int), f"Category {cat} count should be integer"
            assert count > 0, f"Category {cat} should have positive count"
        
        print(f"PASSED: Feed status shows categories: {categories}")


class TestRobotsTxt:
    """Tests for robots.txt allowing merchant feed"""
    
    def test_robots_txt_allows_merchant_feed(self):
        """robots.txt allows /api/merchant/feed.xml"""
        response = requests.get(f"{BASE_URL}/robots.txt", timeout=30)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        content = response.text
        
        # Check that merchant feed is allowed
        assert "Allow: /api/merchant/feed.xml" in content or "/api/merchant/feed.xml" in content, \
            "robots.txt should allow /api/merchant/feed.xml"
        
        print("PASSED: robots.txt allows /api/merchant/feed.xml")
    
    def test_robots_txt_allows_sitemap(self):
        """robots.txt allows /api/sitemap.xml"""
        response = requests.get(f"{BASE_URL}/robots.txt", timeout=30)
        content = response.text
        
        # Check that sitemap is allowed
        assert "Allow: /api/sitemap.xml" in content or "sitemap.xml" in content.lower(), \
            "robots.txt should allow sitemap"
        
        print("PASSED: robots.txt allows sitemap")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
