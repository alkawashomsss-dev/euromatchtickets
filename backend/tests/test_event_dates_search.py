"""
Test suite for event dates fixes, duplicate removal, and debounced search functionality.
Tests the fixes applied by fix_all_events.py script.
"""
import pytest
import requests
import os
import re

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEventSearch:
    """Test debounced search functionality"""
    
    def test_search_justin_bieber_returns_one_result(self):
        """Search 'justin bieber' should return exactly 1 result with correct date Jul 18 2026"""
        response = requests.get(f"{BASE_URL}/api/events", params={"search": "justin bieber"})
        assert response.status_code == 200
        events = response.json()
        assert len(events) == 1, f"Expected 1 Justin Bieber event, got {len(events)}"
        
        event = events[0]
        assert "justin" in event.get("title", "").lower() or "bieber" in event.get("title", "").lower()
        # Check date is Jul 18 2026
        assert event.get("event_date", "").startswith("2026-07-18"), f"Expected Jul 18 2026, got {event.get('event_date')}"
        assert event.get("slug") == "justin-bieber-amsterdam-2026-tickets"
    
    def test_search_monaco_returns_monaco_gp(self):
        """Search 'monaco' should return Monaco Grand Prix 2026 with date May 31"""
        response = requests.get(f"{BASE_URL}/api/events", params={"search": "monaco"})
        assert response.status_code == 200
        events = response.json()
        assert len(events) >= 1, "Expected at least 1 Monaco event"
        
        # Find Monaco GP
        monaco_gp = next((e for e in events if "monaco" in e.get("title", "").lower() and "grand prix" in e.get("title", "").lower()), None)
        assert monaco_gp is not None, "Monaco Grand Prix not found"
        assert monaco_gp.get("event_date", "").startswith("2026-05-31"), f"Expected May 31 2026, got {monaco_gp.get('event_date')}"


class TestF1Events:
    """Test F1 events have realistic dates"""
    
    def test_f1_filter_returns_f1_events(self):
        """F1 filter should return F1 events with realistic dates"""
        response = requests.get(f"{BASE_URL}/api/events", params={"event_type": "f1"})
        assert response.status_code == 200
        events = response.json()
        assert len(events) >= 10, f"Expected at least 10 F1 events, got {len(events)}"
        
        # All should be F1 type
        for event in events:
            assert event.get("event_type") == "f1", f"Event {event.get('title')} is not F1 type"
    
    def test_f1_events_no_script_timestamps(self):
        """F1 events should not have script-generated timestamps like T05:32, T09:55, T22:20"""
        response = requests.get(f"{BASE_URL}/api/events", params={"event_type": "f1"})
        assert response.status_code == 200
        events = response.json()
        
        bad_patterns = ['T05:32', 'T09:55', 'T22:20:58', 'T22:20:5']
        for event in events:
            event_date = event.get("event_date", "")
            for pattern in bad_patterns:
                assert pattern not in event_date, f"Event {event.get('title')} has script timestamp: {event_date}"
    
    def test_belgian_gp_date_august_30(self):
        """Belgian Grand Prix 2026 should have date August 30"""
        response = requests.get(f"{BASE_URL}/api/events", params={"search": "belgian"})
        assert response.status_code == 200
        events = response.json()
        
        belgian_gp = next((e for e in events if "belgian" in e.get("title", "").lower() and "grand prix" in e.get("title", "").lower()), None)
        assert belgian_gp is not None, "Belgian Grand Prix not found"
        assert belgian_gp.get("event_date", "").startswith("2026-08-30"), f"Expected Aug 30 2026, got {belgian_gp.get('event_date')}"


class TestNoDuplicates:
    """Test that duplicate events have been removed"""
    
    def test_no_duplicate_titles(self):
        """No events should have duplicate titles"""
        response = requests.get(f"{BASE_URL}/api/events", params={"limit": 200})
        assert response.status_code == 200
        events = response.json()
        
        titles = [e.get("title", "") for e in events]
        duplicates = [t for t in titles if titles.count(t) > 1]
        unique_duplicates = list(set(duplicates))
        
        assert len(unique_duplicates) == 0, f"Found duplicate titles: {unique_duplicates}"
    
    def test_el_clasico_exists_once(self):
        """El Clasico: Real Madrid vs Barcelona should exist exactly once"""
        response = requests.get(f"{BASE_URL}/api/events/el-clasico-real-madrid-vs-barcelona-2026-tickets")
        assert response.status_code == 200
        event = response.json()
        assert "clasico" in event.get("title", "").lower() or ("real madrid" in event.get("title", "").lower() and "barcelona" in event.get("title", "").lower())


class TestWorldCupEvents:
    """Test World Cup events have clean times"""
    
    def test_world_cup_events_clean_times(self):
        """World Cup events should have clean times like 20:00, 18:00, 21:00"""
        response = requests.get(f"{BASE_URL}/api/events", params={"search": "world cup"})
        assert response.status_code == 200
        events = response.json()
        
        # Filter to actual World Cup events (not Club World Cup only)
        wc_events = [e for e in events if "world cup" in e.get("title", "").lower()]
        assert len(wc_events) >= 5, f"Expected at least 5 World Cup events, got {len(wc_events)}"
        
        # Check times are clean (ending in :00:00Z)
        clean_time_pattern = re.compile(r'T\d{2}:00:00Z$')
        for event in wc_events:
            event_date = event.get("event_date", "")
            assert clean_time_pattern.search(event_date), f"Event {event.get('title')} has non-clean time: {event_date}"


class TestAllEventsNoScriptTimestamps:
    """Test all events don't have script-generated timestamps"""
    
    def test_no_events_with_script_timestamps(self):
        """No events should have timestamps like T05:32, T09:55, T22:20:58"""
        response = requests.get(f"{BASE_URL}/api/events", params={"limit": 200})
        assert response.status_code == 200
        events = response.json()
        
        bad_patterns = ['T05:32', 'T09:55', 'T22:20:58', 'T22:20:5']
        bad_events = []
        for event in events:
            event_date = event.get("event_date", "")
            for pattern in bad_patterns:
                if pattern in event_date:
                    bad_events.append(f"{event.get('title')}: {event_date}")
                    break
        
        assert len(bad_events) == 0, f"Events with script timestamps: {bad_events}"


class TestJustinBieberPage:
    """Test Justin Bieber Amsterdam page loads"""
    
    def test_justin_bieber_page_loads(self):
        """Justin Bieber Amsterdam page should load at canonical URL"""
        response = requests.get(f"{BASE_URL}/api/events/justin-bieber-amsterdam-2026-tickets")
        assert response.status_code == 200
        event = response.json()
        assert event.get("slug") == "justin-bieber-amsterdam-2026-tickets"
        assert "amsterdam" in event.get("city", "").lower()


class TestClearFilters:
    """Test clear filters functionality"""
    
    def test_events_without_filters(self):
        """Events endpoint without filters should return all events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        events = response.json()
        assert len(events) >= 50, f"Expected at least 50 events, got {len(events)}"
    
    def test_events_with_search_then_clear(self):
        """Search should filter, then clearing should show all"""
        # With search
        response_search = requests.get(f"{BASE_URL}/api/events", params={"search": "f1"})
        assert response_search.status_code == 200
        f1_events = response_search.json()
        
        # Without search (cleared)
        response_all = requests.get(f"{BASE_URL}/api/events")
        assert response_all.status_code == 200
        all_events = response_all.json()
        
        assert len(all_events) > len(f1_events), "All events should be more than F1 filtered events"
