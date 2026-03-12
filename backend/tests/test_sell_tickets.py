"""
Backend API Tests for EuroMatchTickets - Sell Your Tickets Feature
Tests for /api/seller/list-tickets, /api/seller/listings, /api/listings/recent, /api/seller/listings/{id}
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
TEST_SESSION_TOKEN = "test_session_7de377fd3dd44bd29b8a584618c10db9"

# ======= Authentication & Helper Fixtures =======

@pytest.fixture
def auth_headers():
    """Headers with auth token for protected endpoints"""
    return {
        "Authorization": f"Bearer {TEST_SESSION_TOKEN}"
    }

@pytest.fixture
def session():
    """Session without auth"""
    return requests.Session()


# ======= Health Check Tests =======

class TestHealthAndSetup:
    """Basic API health checks"""
    
    def test_api_health(self):
        """Verify API is running"""
        response = requests.get(f"{BASE_URL}/api")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "EuroMatchTickets API v2.0"
        print(f"✓ API health check passed: {data}")

    def test_auth_check_without_token(self):
        """Test that seller endpoints require authentication"""
        response = requests.get(f"{BASE_URL}/api/seller/listings")
        assert response.status_code == 401
        print("✓ Auth required for /api/seller/listings (401 without token)")

    def test_auth_check_with_token(self, auth_headers):
        """Test that auth token works"""
        response = requests.get(f"{BASE_URL}/api/seller/listings", headers=auth_headers)
        assert response.status_code == 200
        print("✓ Auth token accepted for /api/seller/listings")


# ======= POST /api/seller/list-tickets Tests =======

class TestListTicketsEndpoint:
    """Tests for POST /api/seller/list-tickets - Create a new listing"""
    
    def test_list_tickets_missing_auth(self):
        """Test listing without authentication fails"""
        form_data = {
            "event_name": "Test Concert 2026",
            "event_date": "2026-06-15T20:00",
            "venue": "Test Arena",
            "city": "London",
            "price_per_ticket": "99.00"
        }
        response = requests.post(f"{BASE_URL}/api/seller/list-tickets", data=form_data)
        assert response.status_code == 401
        print("✓ Listing without auth returns 401")

    def test_list_tickets_minimal_fields(self, auth_headers):
        """Test listing with only required fields"""
        form_data = {
            "event_name": "TEST_Minimal Concert 2026",
            "event_date": "2026-07-20T19:00",
            "venue": "Test Stadium",
            "city": "Paris",
            "price_per_ticket": "75.50"
        }
        response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert data.get("success") == True
        assert "listing_id" in data
        assert "event_id" in data
        assert data.get("tickets_created") == 1  # Default is 1 ticket
        
        print(f"✓ Minimal listing created: {data['listing_id']}")
        print(f"  - Event ID: {data['event_id']}")
        print(f"  - Message: {data.get('message')}")
        
        # Store for cleanup
        return data["listing_id"]

    def test_list_tickets_all_fields(self, auth_headers):
        """Test listing with all optional fields"""
        form_data = {
            "event_name": "TEST_Full Details Event 2026",
            "event_date": "2026-08-15T18:30",
            "event_type": "concert",
            "venue": "Madison Square Garden",
            "city": "New York",
            "country": "USA",
            "category": "vip",
            "section": "Block A Row 5",
            "num_tickets": "3",
            "price_per_ticket": "250.00",
            "original_price": "300.00",
            "description": "Amazing front row tickets for this sold-out event!"
        }
        response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert data.get("tickets_created") == 3
        print(f"✓ Full listing created with 3 tickets: {data['listing_id']}")
        
        return data["listing_id"]

    def test_list_tickets_with_file_upload(self, auth_headers):
        """Test listing with file upload (PDF simulation)"""
        form_data = {
            "event_name": "TEST_File Upload Concert 2026",
            "event_date": "2026-09-10T20:00",
            "venue": "O2 Arena",
            "city": "London",
            "price_per_ticket": "150.00",
            "num_tickets": "2"
        }
        
        # Create a fake PDF file for testing
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake pdf content for testing")
        files = {
            "ticket_file": ("test_ticket.pdf", fake_pdf, "application/pdf")
        }
        
        response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            files=files,
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert data.get("success") == True
        assert data.get("tickets_created") == 2
        print(f"✓ Listing with file upload created: {data['listing_id']}")
        
        return data["listing_id"]

    def test_list_tickets_invalid_file_type(self, auth_headers):
        """Test that invalid file types are rejected"""
        form_data = {
            "event_name": "TEST_Invalid File Event",
            "event_date": "2026-10-01T20:00",
            "venue": "Test Venue",
            "city": "Berlin",
            "price_per_ticket": "50.00"
        }
        
        # Try to upload an invalid file type
        fake_exe = io.BytesIO(b"MZ fake exe content")
        files = {
            "ticket_file": ("virus.exe", fake_exe, "application/octet-stream")
        }
        
        response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            files=files,
            headers=auth_headers
        )
        # Should reject with 400
        assert response.status_code == 400, f"Expected 400 but got {response.status_code}"
        print("✓ Invalid file type rejected with 400")

    def test_list_tickets_missing_required_fields(self, auth_headers):
        """Test that missing required fields return 422"""
        # Missing event_name
        form_data = {
            "event_date": "2026-11-01T20:00",
            "venue": "Test Venue",
            "city": "Madrid",
            "price_per_ticket": "100.00"
        }
        response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            headers=auth_headers
        )
        assert response.status_code == 422, f"Expected 422 but got {response.status_code}"
        print("✓ Missing required field returns 422")


# ======= GET /api/seller/listings Tests =======

class TestGetSellerListings:
    """Tests for GET /api/seller/listings - Get seller's listings"""
    
    def test_get_listings_no_auth(self):
        """Test that listings require auth"""
        response = requests.get(f"{BASE_URL}/api/seller/listings")
        assert response.status_code == 401
        print("✓ GET /api/seller/listings requires auth")

    def test_get_listings_with_auth(self, auth_headers):
        """Test fetching seller listings"""
        response = requests.get(f"{BASE_URL}/api/seller/listings", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "listings" in data
        assert "stats" in data
        assert isinstance(data["listings"], list)
        
        # Verify stats structure
        stats = data["stats"]
        assert "total_listings" in stats
        assert "active_listings" in stats
        assert "total_tickets_sold" in stats
        assert "total_earnings" in stats
        
        print(f"✓ GET /api/seller/listings returns {len(data['listings'])} listings")
        print(f"  - Stats: {stats}")
        
        return data

    def test_listings_contain_test_data(self, auth_headers):
        """Verify test listings appear in GET response"""
        # First create a listing
        form_data = {
            "event_name": "TEST_Verify Listing Appears",
            "event_date": "2026-12-01T20:00",
            "venue": "Verify Arena",
            "city": "Amsterdam",
            "price_per_ticket": "88.00"
        }
        create_response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        listing_id = created["listing_id"]
        
        # Then verify it appears in GET
        get_response = requests.get(f"{BASE_URL}/api/seller/listings", headers=auth_headers)
        assert get_response.status_code == 200
        listings = get_response.json()["listings"]
        
        listing_ids = [l["listing_id"] for l in listings]
        assert listing_id in listing_ids, f"Created listing {listing_id} not found in GET response"
        
        # Find our listing and verify data
        our_listing = next(l for l in listings if l["listing_id"] == listing_id)
        assert our_listing["event_name"] == "TEST_Verify Listing Appears"
        assert our_listing["city"] == "Amsterdam"
        assert our_listing["price_per_ticket"] == 88.0
        
        print(f"✓ Created listing verified in GET response: {listing_id}")
        return listing_id


# ======= GET /api/listings/recent Tests =======

class TestRecentListings:
    """Tests for GET /api/listings/recent - Public recent listings"""
    
    def test_recent_listings_public(self):
        """Test that recent listings is publicly accessible"""
        response = requests.get(f"{BASE_URL}/api/listings/recent")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/listings/recent returns {len(data)} listings (public)")
        
        # Verify seller_email is NOT exposed
        if len(data) > 0:
            first_listing = data[0]
            assert "seller_email" not in first_listing, "seller_email should be hidden"
            print("✓ seller_email is properly hidden from public response")
        
        return data

    def test_recent_listings_structure(self):
        """Verify recent listing response structure"""
        response = requests.get(f"{BASE_URL}/api/listings/recent")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            listing = data[0]
            # Should have these fields
            expected_fields = ["listing_id", "event_name", "venue", "city", "price_per_ticket"]
            for field in expected_fields:
                assert field in listing, f"Missing field: {field}"
            print(f"✓ Recent listing structure valid with fields: {list(listing.keys())}")


# ======= DELETE /api/seller/listings/{id} Tests =======

class TestDeleteListing:
    """Tests for DELETE /api/seller/listings/{listing_id}"""
    
    def test_delete_listing_no_auth(self):
        """Test that delete requires auth"""
        response = requests.delete(f"{BASE_URL}/api/seller/listings/fake_id")
        assert response.status_code == 401
        print("✓ DELETE listing requires auth")

    def test_delete_nonexistent_listing(self, auth_headers):
        """Test deleting a non-existent listing"""
        response = requests.delete(
            f"{BASE_URL}/api/seller/listings/nonexistent_listing_123",
            headers=auth_headers
        )
        assert response.status_code == 404
        print("✓ DELETE non-existent listing returns 404")

    def test_delete_listing_success(self, auth_headers):
        """Test successfully deleting a listing"""
        # First create a listing
        form_data = {
            "event_name": "TEST_To Be Deleted",
            "event_date": "2026-12-15T20:00",
            "venue": "Delete Arena",
            "city": "Rome",
            "price_per_ticket": "55.00"
        }
        create_response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        listing_id = create_response.json()["listing_id"]
        print(f"  Created listing to delete: {listing_id}")
        
        # Delete it
        delete_response = requests.delete(
            f"{BASE_URL}/api/seller/listings/{listing_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        assert delete_response.json().get("success") == True
        print(f"✓ Successfully deleted listing: {listing_id}")
        
        # Verify it's marked as cancelled (not returned in active)
        get_response = requests.get(f"{BASE_URL}/api/seller/listings", headers=auth_headers)
        listings = get_response.json()["listings"]
        for listing in listings:
            if listing["listing_id"] == listing_id:
                assert listing["status"] == "cancelled", "Deleted listing should be cancelled"
                print(f"✓ Deleted listing status is 'cancelled'")
                break


# ======= Integration Tests =======

class TestFullListingFlow:
    """End-to-end listing flow tests"""
    
    def test_full_listing_workflow(self, auth_headers):
        """Test complete listing flow: create -> verify -> delete"""
        # 1. Create listing
        form_data = {
            "event_name": "TEST_Full Workflow Concert",
            "event_date": "2027-01-15T20:00",
            "event_type": "concert",
            "venue": "Workflow Arena",
            "city": "Barcelona",
            "country": "Spain",
            "category": "premium",
            "section": "VIP Section B",
            "num_tickets": "2",
            "price_per_ticket": "175.00",
            "original_price": "200.00",
            "description": "Full workflow test tickets"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/seller/list-tickets",
            data=form_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        created = create_response.json()
        assert created["success"] == True
        listing_id = created["listing_id"]
        event_id = created["event_id"]
        print(f"1. Created listing: {listing_id}")
        
        # 2. Verify in seller listings
        get_response = requests.get(f"{BASE_URL}/api/seller/listings", headers=auth_headers)
        assert get_response.status_code == 200
        listings = get_response.json()["listings"]
        our_listing = next((l for l in listings if l["listing_id"] == listing_id), None)
        assert our_listing is not None
        assert our_listing["num_tickets"] == 2
        assert our_listing["price_per_ticket"] == 175.0
        assert our_listing["status"] == "active"
        print(f"2. Verified listing in seller dashboard")
        
        # 3. Verify in public recent
        recent_response = requests.get(f"{BASE_URL}/api/listings/recent")
        assert recent_response.status_code == 200
        recent = recent_response.json()
        found_in_recent = any(l["listing_id"] == listing_id for l in recent)
        print(f"3. Listing visible in public recent: {found_in_recent}")
        
        # 4. Delete listing
        delete_response = requests.delete(
            f"{BASE_URL}/api/seller/listings/{listing_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"4. Deleted listing: {listing_id}")
        
        print("✓ Full workflow completed successfully!")


# ======= Cleanup =======

class TestCleanup:
    """Clean up test data"""
    
    def test_cleanup_test_listings(self, auth_headers):
        """Delete all TEST_ prefixed listings"""
        # Get all listings
        response = requests.get(f"{BASE_URL}/api/seller/listings", headers=auth_headers)
        if response.status_code != 200:
            pytest.skip("Could not get listings for cleanup")
        
        listings = response.json().get("listings", [])
        deleted = 0
        
        for listing in listings:
            if listing.get("event_name", "").startswith("TEST_"):
                delete_response = requests.delete(
                    f"{BASE_URL}/api/seller/listings/{listing['listing_id']}",
                    headers=auth_headers
                )
                if delete_response.status_code == 200:
                    deleted += 1
        
        print(f"✓ Cleanup: Deleted {deleted} test listings")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
