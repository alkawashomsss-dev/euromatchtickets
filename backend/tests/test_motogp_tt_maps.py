"""
Backend API tests for MotoGP and Isle of Man TT circuit maps.
Tests grouped_sections for interactive venue maps and validates price competitiveness.
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test event IDs
QATAR_MOTOGP_ID = "event_fb49b98c7df6"
ISLE_OF_MAN_TT_ID = "premium_75d01878d4e7"

# MotoGP expected sections from InteractiveVenueMap.jsx
MOTOGP_EXPECTED_SECTIONS = [
    "Main Grandstand", "Turn 1 Stand", "Chicane Stand", "Pit Straight",
    "Final Corner", "GA Zone A", "GA Zone B", "VIP Village", "Paddock Access"
]

# Isle of Man TT expected sections from InteractiveVenueMap.jsx
IOM_TT_EXPECTED_SECTIONS = [
    "Grandstand", "Bray Hill", "Quarter Bridge", "Ballaugh Bridge", 
    "Ramsey Hairpin", "The Mountain"
]

# Maximum price threshold (no ticket should exceed this)
MAX_PRICE_THRESHOLD = 2100


class TestMotoGPEvent:
    """Tests for Qatar MotoGP event detail page data"""
    
    def test_get_motogp_event_returns_200(self):
        """Test that MotoGP event endpoint returns successfully"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"SUCCESS: GET /api/events/{QATAR_MOTOGP_ID} returns 200")
    
    def test_motogp_event_type_is_correct(self):
        """Verify event_type is 'motogp' for circuit map detection"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        assert data.get("event_type") == "motogp", f"Expected motogp, got {data.get('event_type')}"
        print(f"SUCCESS: Event type is 'motogp' for {data.get('title')}")
    
    def test_motogp_has_grouped_sections(self):
        """Verify grouped_sections array exists and has data"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        assert len(grouped_sections) > 0, "grouped_sections should not be empty"
        print(f"SUCCESS: MotoGP event has {len(grouped_sections)} grouped sections")
    
    def test_motogp_grouped_sections_structure(self):
        """Verify each grouped section has required fields"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        
        for section in grouped_sections:
            assert "category" in section, "Section missing 'category'"
            assert "section" in section, "Section missing 'section'"
            assert "count" in section, "Section missing 'count'"
            assert "lowest_price" in section, "Section missing 'lowest_price'"
            assert "highest_price" in section, "Section missing 'highest_price'"
            assert "tickets" in section, "Section missing 'tickets'"
        print(f"SUCCESS: All grouped sections have correct structure")
    
    def test_motogp_has_circuit_sections(self):
        """Verify MotoGP event has circuit-specific sections for map display"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        
        section_names = set(s["section"] for s in grouped_sections)
        print(f"Found sections: {section_names}")
        
        # Check for at least some MotoGP-related sections (GA zones, VIP, grandstands)
        expected_patterns = ["GA Zone", "VIP", "Grandstand", "Turn", "Corner", "Straight", "Paddock"]
        found_patterns = []
        for section in section_names:
            for pattern in expected_patterns:
                if pattern.lower() in section.lower():
                    found_patterns.append(section)
                    break
        
        assert len(found_patterns) >= 3, f"Expected at least 3 circuit-related sections, found: {found_patterns}"
        print(f"SUCCESS: Found circuit sections: {found_patterns}")
    
    def test_motogp_prices_competitive(self):
        """Verify all MotoGP ticket prices are under €2,100 threshold"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        tickets = data.get("tickets", [])
        
        for ticket in tickets:
            price = ticket.get("price", 0)
            assert price <= MAX_PRICE_THRESHOLD, f"Ticket {ticket.get('ticket_id')} price €{price} exceeds €{MAX_PRICE_THRESHOLD}"
        
        max_price = max(t.get("price", 0) for t in tickets) if tickets else 0
        print(f"SUCCESS: All MotoGP tickets under €{MAX_PRICE_THRESHOLD} (max: €{max_price:.2f})")
    
    def test_motogp_image_url_valid(self):
        """Verify MotoGP event has a valid image URL"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        image_url = data.get("image_url") or data.get("event_image")
        
        assert image_url is not None, "Event should have an image_url"
        assert image_url.startswith("http"), f"Image URL should be valid HTTP: {image_url}"
        
        # Check if image loads (HEAD request)
        img_response = requests.head(image_url, timeout=5)
        assert img_response.status_code in [200, 301, 302], f"Image URL not accessible: {image_url}"
        print(f"SUCCESS: MotoGP event image URL is valid and accessible")


class TestIsleOfManTTEvent:
    """Tests for Isle of Man TT event detail page data"""
    
    def test_get_iom_tt_event_returns_200(self):
        """Test that IOM TT event endpoint returns successfully"""
        response = requests.get(f"{BASE_URL}/api/events/{ISLE_OF_MAN_TT_ID}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"SUCCESS: GET /api/events/{ISLE_OF_MAN_TT_ID} returns 200")
    
    def test_iom_tt_title_contains_isle_of_man(self):
        """Verify title contains 'Isle of Man' for map detection"""
        response = requests.get(f"{BASE_URL}/api/events/{ISLE_OF_MAN_TT_ID}")
        data = response.json()
        title = data.get("title", "")
        
        assert "isle of man" in title.lower(), f"Title should contain 'Isle of Man': {title}"
        print(f"SUCCESS: Title contains 'Isle of Man': {title}")
    
    def test_iom_tt_has_grouped_sections(self):
        """Verify grouped_sections array exists and has data"""
        response = requests.get(f"{BASE_URL}/api/events/{ISLE_OF_MAN_TT_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        assert len(grouped_sections) > 0, "grouped_sections should not be empty"
        print(f"SUCCESS: IOM TT event has {len(grouped_sections)} grouped sections")
    
    def test_iom_tt_has_course_sections(self):
        """Verify IOM TT event has Snaefell Mountain Course sections"""
        response = requests.get(f"{BASE_URL}/api/events/{ISLE_OF_MAN_TT_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        
        section_names = set(s["section"] for s in grouped_sections)
        print(f"Found sections: {section_names}")
        
        # Check for IOM TT specific sections
        iom_patterns = ["Grandstand", "Bray Hill", "Quarter Bridge", "Ballaugh Bridge", "Ramsey Hairpin"]
        found_patterns = []
        for section in section_names:
            for pattern in iom_patterns:
                if pattern.lower() in section.lower():
                    found_patterns.append(section)
                    break
        
        assert len(found_patterns) >= 3, f"Expected at least 3 IOM TT course sections, found: {found_patterns}"
        print(f"SUCCESS: Found IOM TT course sections: {found_patterns}")
    
    def test_iom_tt_prices_competitive(self):
        """Verify all IOM TT ticket prices are under €2,100 threshold"""
        response = requests.get(f"{BASE_URL}/api/events/{ISLE_OF_MAN_TT_ID}")
        data = response.json()
        tickets = data.get("tickets", [])
        
        for ticket in tickets:
            price = ticket.get("price", 0)
            assert price <= MAX_PRICE_THRESHOLD, f"Ticket {ticket.get('ticket_id')} price €{price} exceeds €{MAX_PRICE_THRESHOLD}"
        
        max_price = max(t.get("price", 0) for t in tickets) if tickets else 0
        print(f"SUCCESS: All IOM TT tickets under €{MAX_PRICE_THRESHOLD} (max: €{max_price:.2f})")
    
    def test_iom_tt_image_url_valid(self):
        """Verify IOM TT event has a valid image URL"""
        response = requests.get(f"{BASE_URL}/api/events/{ISLE_OF_MAN_TT_ID}")
        data = response.json()
        image_url = data.get("image_url") or data.get("event_image")
        
        assert image_url is not None, "Event should have an image_url"
        assert image_url.startswith("http"), f"Image URL should be valid HTTP: {image_url}"
        
        # Check if image loads (HEAD request)
        img_response = requests.head(image_url, timeout=5)
        assert img_response.status_code in [200, 301, 302], f"Image URL not accessible: {image_url}"
        print(f"SUCCESS: IOM TT event image URL is valid and accessible")


class TestAllEventsPricing:
    """Tests for competitive pricing across all events"""
    
    def test_all_events_have_reasonable_lowest_price(self):
        """Verify all events return reasonable lowest_price values"""
        response = requests.get(f"{BASE_URL}/api/events?limit=200")
        assert response.status_code == 200
        events = response.json()
        
        high_price_events = []
        for event in events:
            lowest_price = event.get("lowest_price")
            if lowest_price and lowest_price > MAX_PRICE_THRESHOLD:
                high_price_events.append({
                    "title": event.get("title"),
                    "lowest_price": lowest_price
                })
        
        assert len(high_price_events) == 0, f"Events with prices over €{MAX_PRICE_THRESHOLD}: {high_price_events}"
        
        max_lowest_price = max((e.get("lowest_price") or 0) for e in events)
        print(f"SUCCESS: All {len(events)} events have competitive prices (highest lowest_price: €{max_lowest_price:.2f})")
    
    def test_motogp_events_list_returns_data(self):
        """Verify MotoGP events are returned from API"""
        response = requests.get(f"{BASE_URL}/api/events?event_type=motogp")
        assert response.status_code == 200
        events = response.json()
        
        assert len(events) > 0, "Should have at least one MotoGP event"
        print(f"SUCCESS: Found {len(events)} MotoGP events")
        
        # Verify each has lowest_price
        for event in events:
            assert event.get("lowest_price") is not None or event.get("available_tickets", 0) == 0, \
                f"Event {event.get('title')} missing lowest_price"


class TestSectionFiltering:
    """Tests for section filtering functionality"""
    
    def test_grouped_sections_have_ticket_counts(self):
        """Verify each grouped section has non-zero ticket count"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        
        for section in grouped_sections:
            count = section.get("count", 0)
            assert count > 0, f"Section {section.get('section')} has zero tickets"
        
        total_count = sum(s.get("count", 0) for s in grouped_sections)
        print(f"SUCCESS: All sections have ticket counts (total: {total_count})")
    
    def test_grouped_sections_sorted_by_price(self):
        """Verify grouped_sections are sorted by lowest_price ascending"""
        response = requests.get(f"{BASE_URL}/api/events/{QATAR_MOTOGP_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        
        prices = [s.get("lowest_price", float('inf')) for s in grouped_sections]
        sorted_prices = sorted(prices)
        
        assert prices == sorted_prices, "Grouped sections should be sorted by lowest_price"
        print(f"SUCCESS: Grouped sections sorted by price (min: €{prices[0]:.2f}, max: €{prices[-1]:.2f})")
    
    def test_grouped_sections_contain_ticket_details(self):
        """Verify each grouped section includes ticket array with details"""
        response = requests.get(f"{BASE_URL}/api/events/{ISLE_OF_MAN_TT_ID}")
        data = response.json()
        grouped_sections = data.get("grouped_sections", [])
        
        for section in grouped_sections[:3]:  # Check first 3 sections
            tickets = section.get("tickets", [])
            assert len(tickets) > 0, f"Section {section.get('section')} has no tickets array"
            
            for ticket in tickets[:2]:  # Check first 2 tickets per section
                assert "ticket_id" in ticket, "Ticket missing ticket_id"
                assert "price" in ticket, "Ticket missing price"
                assert "section" in ticket, "Ticket missing section"
                assert "category" in ticket, "Ticket missing category"
        
        print(f"SUCCESS: Grouped sections contain ticket details for filtering")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
