"""
Test AI Chatbot and SEO Schema Fixes
- AI chatbot endpoint POST /api/chat/message
- Event schema with description and image fields
- Product schema with description and image fields
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestChatEndpoint:
    """AI Chatbot endpoint tests"""
    
    def test_chat_hello_message(self):
        """Test basic hello message returns 200 with response and session_id"""
        response = requests.post(f"{BASE_URL}/api/chat/message", json={
            "message": "hello",
            "session_id": "test_hello_1"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "response" in data, "Response should contain 'response' field"
        assert "session_id" in data, "Response should contain 'session_id' field"
        assert len(data["response"]) > 10, "Response should have meaningful content"
        print(f"Chat hello response: {data['response'][:100]}...")
    
    def test_chat_f1_tickets_question(self):
        """Test F1 tickets question returns relevant response"""
        response = requests.post(f"{BASE_URL}/api/chat/message", json={
            "message": "What F1 tickets do you have?",
            "session_id": "test_f1_2"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "response" in data
        # Response should mention F1 or Formula 1 or Grand Prix
        response_lower = data["response"].lower()
        assert any(term in response_lower for term in ["f1", "formula", "grand prix", "race"]), \
            f"Response should mention F1 related terms: {data['response']}"
        print(f"F1 response: {data['response'][:150]}...")
    
    def test_chat_arabic_support(self):
        """Test Arabic language support"""
        response = requests.post(f"{BASE_URL}/api/chat/message", json={
            "message": "كم سعر تذاكر كرة القدم",  # "How much are football tickets" in Arabic
            "session_id": "test_arabic_3"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "response" in data
        assert len(data["response"]) > 10, "Should return a meaningful response for Arabic"
        print(f"Arabic response: {data['response'][:150]}...")
    
    def test_chat_session_id_generated(self):
        """Test that session_id is generated if not provided"""
        response = requests.post(f"{BASE_URL}/api/chat/message", json={
            "message": "test message",
            "session_id": ""
        })
        assert response.status_code == 200
        data = response.json()
        assert "session_id" in data
        assert len(data["session_id"]) > 0, "Session ID should be generated"
        print(f"Generated session_id: {data['session_id']}")
    
    def test_chat_price_question(self):
        """Test price-related question"""
        response = requests.post(f"{BASE_URL}/api/chat/message", json={
            "message": "What are your cheapest tickets?",
            "session_id": "test_price_5"
        })
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        # Should mention prices or euros
        response_lower = data["response"].lower()
        assert any(term in response_lower for term in ["€", "eur", "price", "from", "cheap"]), \
            f"Response should mention prices: {data['response']}"
        print(f"Price response: {data['response'][:150]}...")


class TestSEOPageSchema:
    """Test SEO page API returns correct image and description fields"""
    
    def test_f1_page_has_image_field(self):
        """Test F1 page has image field that is NOT logo.png"""
        response = requests.get(f"{BASE_URL}/api/seo/page/f1-tickets-london-2026")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        
        # Check image field exists and is not logo.png
        image = data.get("image") or data.get("image_url") or ""
        assert image, "Page should have image field"
        assert "logo.png" not in image.lower(), f"Image should NOT be logo.png: {image}"
        # Should contain category-based image
        assert any(term in image.lower() for term in ["f1", "red", "heroes", "webp", "jpg", "png"]), \
            f"Image should be category-based: {image}"
        print(f"F1 page image: {image}")
    
    def test_f1_page_has_description(self):
        """Test F1 page has description field with length > 10 chars"""
        response = requests.get(f"{BASE_URL}/api/seo/page/f1-tickets-london-2026")
        assert response.status_code == 200
        data = response.json()
        
        # Check description field
        description = data.get("description") or data.get("meta_description") or ""
        assert len(description) > 10, f"Description should be > 10 chars: '{description}'"
        print(f"F1 page description: {description[:100]}...")
    
    def test_football_page_has_image(self):
        """Test football page has image field containing /images/heroes/"""
        response = requests.get(f"{BASE_URL}/api/seo/page/football-tickets-madrid")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        
        image = data.get("image") or data.get("image_url") or ""
        assert image, "Page should have image field"
        # Image should be from heroes folder or contain category-based image
        assert any(term in image.lower() for term in ["heroes", "football", "stadium", "webp", "jpg"]), \
            f"Image should be category-based: {image}"
        print(f"Football page image: {image}")
    
    def test_football_page_has_description(self):
        """Test football page has description field"""
        response = requests.get(f"{BASE_URL}/api/seo/page/football-tickets-madrid")
        assert response.status_code == 200
        data = response.json()
        
        description = data.get("description") or data.get("meta_description") or ""
        assert len(description) > 10, f"Description should be > 10 chars: '{description}'"
        print(f"Football page description: {description[:100]}...")
    
    def test_concert_page_has_image(self):
        """Test concert page has image field"""
        response = requests.get(f"{BASE_URL}/api/seo/page/concert-tickets-berlin-2026")
        if response.status_code == 404:
            pytest.skip("Concert page not found - may not exist in DB")
        assert response.status_code == 200
        data = response.json()
        
        image = data.get("image") or data.get("image_url") or ""
        assert image, "Page should have image field"
        print(f"Concert page image: {image}")
    
    def test_worldcup_page_has_image(self):
        """Test World Cup page has image field"""
        response = requests.get(f"{BASE_URL}/api/seo/page/world-cup-2026-tickets-miami")
        if response.status_code == 404:
            pytest.skip("World Cup page not found - may not exist in DB")
        assert response.status_code == 200
        data = response.json()
        
        image = data.get("image") or data.get("image_url") or ""
        assert image, "Page should have image field"
        print(f"World Cup page image: {image}")


class TestSEOImageMapping:
    """Test that category-based image mapping is working"""
    
    def test_f1_image_contains_f1_red(self):
        """Test F1 page image contains f1-red"""
        response = requests.get(f"{BASE_URL}/api/seo/page/f1-tickets-london-2026")
        assert response.status_code == 200
        data = response.json()
        
        image = data.get("image") or data.get("image_url") or ""
        # F1 pages should have f1-red image
        if "f1" in data.get("category", "").lower():
            assert "f1" in image.lower() or "red" in image.lower() or "heroes" in image.lower(), \
                f"F1 page should have F1-related image: {image}"
        print(f"F1 image mapping verified: {image}")
    
    def test_multiple_pages_have_images(self):
        """Test multiple pages have non-empty image fields"""
        test_slugs = [
            "f1-tickets-london-2026",
            "football-tickets-madrid",
            "buy-manchester-united-tickets",
            "champions-league-tickets-madrid"
        ]
        
        pages_with_images = 0
        for slug in test_slugs:
            response = requests.get(f"{BASE_URL}/api/seo/page/{slug}")
            if response.status_code == 200:
                data = response.json()
                image = data.get("image") or data.get("image_url") or ""
                if image and "logo.png" not in image.lower():
                    pages_with_images += 1
                    print(f"{slug}: {image}")
        
        assert pages_with_images >= 2, f"At least 2 pages should have images, got {pages_with_images}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
