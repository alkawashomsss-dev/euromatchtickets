#!/usr/bin/env python3
"""
Backend API Test Suite for FanPass - Event Marketplace
Tests all core API endpoints and functionality
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, List, Any, Optional

class FanPassAPITester:
    def __init__(self, base_url: str = "https://ticketswap-europe.preview.emergentagent.com"):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test counters
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.critical_failures = []
        
        print(f"🎯 Testing FanPass API at: {self.base_url}")
        print("=" * 60)

    def log_test(self, name: str, success: bool, details: str = "", critical: bool = False):
        """Log test result"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {name}")
        
        if details:
            print(f"     {details}")
            
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append({"name": name, "details": details, "critical": critical})
            if critical:
                self.critical_failures.append(name)

    def test_api_health(self) -> bool:
        """Test if API is responding"""
        try:
            response = self.session.get(f"{self.base_url}/api/")
            success = response.status_code == 200
            
            if success:
                self.log_test("API Health Check", True, "API is responding")
            else:
                self.log_test("API Health Check", False, f"Status: {response.status_code}", critical=True)
                
            return success
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}", critical=True)
            return False

    def test_seed_data(self) -> bool:
        """Seed the database with demo data"""
        try:
            response = self.session.post(f"{self.base_url}/api/seed")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                self.log_test("Database Seeding", True, f"Message: {data.get('message', 'Seeded successfully')}")
            else:
                self.log_test("Database Seeding", False, f"Status: {response.status_code}", critical=True)
                
            return success
        except Exception as e:
            self.log_test("Database Seeding", False, f"Error: {str(e)}", critical=True)
            return False

    def test_get_events(self) -> List[Dict]:
        """Test getting all events"""
        try:
            response = self.session.get(f"{self.base_url}/api/events")
            success = response.status_code == 200
            
            if success:
                events = response.json()
                total_events = len(events)
                concerts = len([e for e in events if e.get('event_type') == 'concert'])
                matches = len([e for e in events if e.get('event_type') == 'match'])
                featured = len([e for e in events if e.get('featured')])
                
                self.log_test("Get All Events", True, 
                    f"Total: {total_events}, Concerts: {concerts}, Matches: {matches}, Featured: {featured}")
                
                # Test specific requirements
                if total_events >= 15:
                    self.log_test("Event Count Check", True, f"Found {total_events} events (≥15 required)")
                else:
                    self.log_test("Event Count Check", False, f"Only {total_events} events (15 required)")
                
                return events
            else:
                self.log_test("Get All Events", False, f"Status: {response.status_code}", critical=True)
                return []
                
        except Exception as e:
            self.log_test("Get All Events", False, f"Error: {str(e)}", critical=True)
            return []

    def test_event_filters(self, events: List[Dict]) -> bool:
        """Test event filtering functionality"""
        if not events:
            self.log_test("Event Filters", False, "No events to test filters", critical=True)
            return False
            
        tests_passed = 0
        total_filter_tests = 3
        
        # Test concert filter
        try:
            response = self.session.get(f"{self.base_url}/api/events?event_type=concert")
            if response.status_code == 200:
                concert_events = response.json()
                all_concerts = all(e.get('event_type') == 'concert' for e in concert_events)
                if all_concerts and len(concert_events) > 0:
                    self.log_test("Concert Filter", True, f"Found {len(concert_events)} concerts")
                    tests_passed += 1
                else:
                    self.log_test("Concert Filter", False, "Filter returned non-concert events")
            else:
                self.log_test("Concert Filter", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Concert Filter", False, f"Error: {str(e)}")

        # Test match filter  
        try:
            response = self.session.get(f"{self.base_url}/api/events?event_type=match")
            if response.status_code == 200:
                match_events = response.json()
                all_matches = all(e.get('event_type') == 'match' for e in match_events)
                if all_matches and len(match_events) > 0:
                    self.log_test("Match Filter", True, f"Found {len(match_events)} matches")
                    tests_passed += 1
                else:
                    self.log_test("Match Filter", False, "Filter returned non-match events")
            else:
                self.log_test("Match Filter", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Match Filter", False, f"Error: {str(e)}")

        # Test city filter
        if events:
            test_city = events[0].get('city')
            if test_city:
                try:
                    response = self.session.get(f"{self.base_url}/api/events?city={test_city}")
                    if response.status_code == 200:
                        city_events = response.json()
                        correct_city = all(test_city.lower() in e.get('city', '').lower() for e in city_events)
                        if correct_city and len(city_events) > 0:
                            self.log_test("City Filter", True, f"Found {len(city_events)} events in {test_city}")
                            tests_passed += 1
                        else:
                            self.log_test("City Filter", False, f"Filter returned events from other cities")
                    else:
                        self.log_test("City Filter", False, f"Status: {response.status_code}")
                except Exception as e:
                    self.log_test("City Filter", False, f"Error: {str(e)}")
            else:
                self.log_test("City Filter", False, "No city data to test with")
        
        return tests_passed == total_filter_tests

    def test_event_details(self, events: List[Dict]) -> Optional[Dict]:
        """Test getting event details"""
        if not events:
            self.log_test("Event Details", False, "No events to test", critical=True)
            return None
            
        test_event = events[0]
        event_id = test_event.get('event_id')
        
        try:
            response = self.session.get(f"{self.base_url}/api/events/{event_id}")
            success = response.status_code == 200
            
            if success:
                event_detail = response.json()
                has_tickets = 'tickets' in event_detail
                has_categories = 'categories' in event_detail
                ticket_count = len(event_detail.get('tickets', []))
                
                self.log_test("Event Details", True, 
                    f"Event: {event_detail.get('title')}, Tickets: {ticket_count}, Categories: {len(event_detail.get('categories', {}))}")
                
                return event_detail
            else:
                self.log_test("Event Details", False, f"Status: {response.status_code}", critical=True)
                return None
                
        except Exception as e:
            self.log_test("Event Details", False, f"Error: {str(e)}", critical=True)
            return None

    def test_tickets_api(self, event_detail: Optional[Dict] = None) -> bool:
        """Test tickets API endpoints"""
        tests_passed = 0
        
        # Test get all tickets
        try:
            response = self.session.get(f"{self.base_url}/api/tickets")
            if response.status_code == 200:
                tickets = response.json()
                self.log_test("Get All Tickets", True, f"Found {len(tickets)} available tickets")
                tests_passed += 1
            else:
                self.log_test("Get All Tickets", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get All Tickets", False, f"Error: {str(e)}")

        # Test tickets for specific event
        if event_detail:
            event_id = event_detail.get('event_id')
            try:
                response = self.session.get(f"{self.base_url}/api/tickets?event_id={event_id}")
                if response.status_code == 200:
                    event_tickets = response.json()
                    self.log_test("Get Event Tickets", True, f"Found {len(event_tickets)} tickets for event")
                    tests_passed += 1
                else:
                    self.log_test("Get Event Tickets", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Get Event Tickets", False, f"Error: {str(e)}")

        # Test tickets by category
        try:
            response = self.session.get(f"{self.base_url}/api/tickets?category=vip")
            if response.status_code == 200:
                vip_tickets = response.json()
                all_vip = all(t.get('category') == 'vip' for t in vip_tickets)
                if all_vip:
                    self.log_test("Get VIP Tickets", True, f"Found {len(vip_tickets)} VIP tickets")
                    tests_passed += 1
                else:
                    self.log_test("Get VIP Tickets", False, "Filter returned non-VIP tickets")
            else:
                self.log_test("Get VIP Tickets", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get VIP Tickets", False, f"Error: {str(e)}")

        return tests_passed >= 2

    def test_featured_events(self) -> bool:
        """Test featured events functionality"""
        try:
            response = self.session.get(f"{self.base_url}/api/events?featured=true")
            success = response.status_code == 200
            
            if success:
                featured_events = response.json()
                all_featured = all(e.get('featured') for e in featured_events)
                
                if all_featured and len(featured_events) > 0:
                    concerts = len([e for e in featured_events if e.get('event_type') == 'concert'])
                    matches = len([e for e in featured_events if e.get('event_type') == 'match'])
                    self.log_test("Featured Events", True, 
                        f"Found {len(featured_events)} featured events (Concerts: {concerts}, Matches: {matches})")
                else:
                    self.log_test("Featured Events", False, "No featured events or filter failed")
                    
                return all_featured and len(featured_events) > 0
            else:
                self.log_test("Featured Events", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Featured Events", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self) -> Dict[str, Any]:
        """Run complete test suite"""
        print("🚀 Starting FanPass Backend API Test Suite\n")
        
        # Critical path tests
        if not self.test_api_health():
            return self.generate_report()
            
        if not self.test_seed_data():
            return self.generate_report()
            
        # Core functionality tests
        events = self.test_get_events()
        self.test_event_filters(events)
        event_detail = self.test_event_details(events)
        self.test_tickets_api(event_detail)
        self.test_featured_events()
        
        return self.generate_report()

    def generate_report(self) -> Dict[str, Any]:
        """Generate test report"""
        print("\n" + "=" * 60)
        print("🎯 FanPass Backend API Test Results")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100) if self.tests_run > 0 else 0:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 Critical Failures: {len(self.critical_failures)}")
            for failure in self.critical_failures:
                print(f"   ❌ {failure}")
        
        if self.failed_tests:
            print(f"\n📋 Failed Tests:")
            for test in self.failed_tests:
                print(f"   ❌ {test['name']}: {test['details']}")
        
        # Determine overall status
        critical_fail = len(self.critical_failures) > 0
        success_rate = (self.tests_passed/self.tests_run*100) if self.tests_run > 0 else 0
        
        if critical_fail:
            status = "CRITICAL_FAILURE"
        elif success_rate >= 80:
            status = "PASS"
        else:
            status = "FAIL"
            
        print(f"\n🎯 Overall Status: {status}")
        
        return {
            "status": status,
            "tests_run": self.tests_run,
            "tests_passed": self.tests_passed,
            "success_rate": success_rate,
            "critical_failures": self.critical_failures,
            "failed_tests": self.failed_tests
        }

def main():
    """Main test execution"""
    tester = FanPassAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    if results["status"] == "CRITICAL_FAILURE":
        return 2
    elif results["status"] == "FAIL":
        return 1
    else:
        return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)