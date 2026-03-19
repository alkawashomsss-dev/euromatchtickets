"""
Backend tests for Event Details Page API - StubHub-style grouped sections
Tests /api/events/{eventId} endpoint for grouped_sections, categories, and ticket listings
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEventDetailsAPI:
    """Test /api/events/{eventId} endpoint for event details page"""
    
    def test_get_event_by_id_success(self):
        """Test fetching event by event_id"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "event_id" in data
        assert data["event_id"] == "concert_ac2e6adb1dd3"
        assert "title" in data
        assert "venue" in data
        assert "city" in data
        assert "event_date" in data
        print(f"✓ Event fetched: {data['title']}")
    
    def test_event_has_grouped_sections(self):
        """Test that event returns grouped_sections for StubHub-style display"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        assert response.status_code == 200
        
        data = response.json()
        assert "grouped_sections" in data, "Response must have grouped_sections field"
        assert isinstance(data["grouped_sections"], list), "grouped_sections must be a list"
        assert len(data["grouped_sections"]) > 0, "grouped_sections should not be empty"
        print(f"✓ Found {len(data['grouped_sections'])} section groups")
    
    def test_grouped_section_structure(self):
        """Test that each grouped section has correct fields"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        data = response.json()
        
        required_fields = ["category", "section", "count", "lowest_price", "highest_price", "tickets"]
        
        for section in data["grouped_sections"]:
            for field in required_fields:
                assert field in section, f"Section missing field: {field}"
            
            # Validate data types
            assert isinstance(section["category"], str)
            assert isinstance(section["section"], str)
            assert isinstance(section["count"], int)
            assert section["count"] > 0
            assert isinstance(section["lowest_price"], (int, float))
            assert isinstance(section["highest_price"], (int, float))
            assert section["lowest_price"] <= section["highest_price"]
            assert isinstance(section["tickets"], list)
            assert len(section["tickets"]) == section["count"]
        
        print(f"✓ All {len(data['grouped_sections'])} sections have valid structure")
    
    def test_grouped_section_tickets_structure(self):
        """Test that tickets within sections have correct fields"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        data = response.json()
        
        ticket_required_fields = ["ticket_id", "price", "section", "category", "currency"]
        
        for section in data["grouped_sections"]:
            for ticket in section["tickets"]:
                for field in ticket_required_fields:
                    assert field in ticket, f"Ticket missing field: {field}"
                
                # Validate price is within section range
                assert section["lowest_price"] <= ticket["price"] <= section["highest_price"], \
                    f"Ticket price {ticket['price']} outside range [{section['lowest_price']}, {section['highest_price']}]"
        
        print("✓ All tickets have valid structure and prices within section range")
    
    def test_event_has_ticket_count(self):
        """Test that event returns total ticket count"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        data = response.json()
        
        assert "ticket_count" in data
        assert data["ticket_count"] > 0
        
        # Verify ticket_count matches sum of section counts
        total_from_sections = sum(s["count"] for s in data["grouped_sections"])
        assert data["ticket_count"] == total_from_sections, \
            f"ticket_count {data['ticket_count']} doesn't match sum of sections {total_from_sections}"
        
        print(f"✓ Total tickets: {data['ticket_count']}")
    
    def test_event_has_categories(self):
        """Test that event returns categories summary"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        data = response.json()
        
        assert "categories" in data
        assert isinstance(data["categories"], dict)
        
        for cat_name, cat_data in data["categories"].items():
            assert "count" in cat_data
            assert "lowest_price" in cat_data
            assert cat_data["count"] > 0
        
        print(f"✓ Found {len(data['categories'])} categories: {list(data['categories'].keys())}")
    
    def test_event_not_found_returns_404(self):
        """Test that non-existent event returns 404"""
        response = requests.get(f"{BASE_URL}/api/events/nonexistent_event_xyz")
        assert response.status_code == 404
        print("✓ 404 returned for non-existent event")
    
    def test_event_by_slug(self):
        """Test fetching event by SEO slug"""
        response = requests.get(f"{BASE_URL}/api/events/john-legend-live-in-abu-dhabi-abu-dhabi-2026-tickets")
        assert response.status_code == 200
        
        data = response.json()
        assert data["event_id"] == "concert_ac2e6adb1dd3"
        print(f"✓ Event fetched by slug: {data['title']}")
    
    def test_sections_sorted_by_lowest_price(self):
        """Test that grouped_sections are sorted by lowest_price ascending"""
        response = requests.get(f"{BASE_URL}/api/events/concert_ac2e6adb1dd3")
        data = response.json()
        
        sections = data["grouped_sections"]
        prices = [s["lowest_price"] for s in sections]
        
        assert prices == sorted(prices), "Sections should be sorted by lowest_price ascending"
        print(f"✓ Sections sorted by price: {prices[:3]}...")


class TestEventListAPI:
    """Test /api/events endpoint for listing events"""
    
    def test_events_list_returns_200(self):
        """Test events list endpoint"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ Found {len(data)} events")
    
    def test_events_list_has_ticket_counts(self):
        """Test that events list includes ticket availability info"""
        response = requests.get(f"{BASE_URL}/api/events")
        data = response.json()
        
        # Check first few events have ticket info
        for event in data[:5]:
            assert "available_tickets" in event or "ticket_count" in event
            if "lowest_price" in event:
                assert isinstance(event["lowest_price"], (int, float, type(None)))
        
        print("✓ Events have ticket availability info")
    
    def test_events_filter_by_type(self):
        """Test filtering events by type"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=concert")
        assert response.status_code == 200
        
        data = response.json()
        for event in data:
            assert event["event_type"] == "concert"
        
        print(f"✓ Filtered {len(data)} concert events")
    
    def test_football_event_has_grouped_sections(self):
        """Test that football event also has grouped_sections"""
        # First get a football event
        response = requests.get(f"{BASE_URL}/api/events?event_type=match&limit=1")
        data = response.json()
        
        if len(data) > 0:
            event_id = data[0]["event_id"]
            detail_response = requests.get(f"{BASE_URL}/api/events/{event_id}")
            assert detail_response.status_code == 200
            
            detail = detail_response.json()
            assert "grouped_sections" in detail
            print(f"✓ Football event {event_id} has grouped_sections")
        else:
            pytest.skip("No football events in database")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
