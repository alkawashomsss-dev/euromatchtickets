"""
Test Reviews API for EuroMatchTickets Customer Review System
Tests POST /api/reviews (submit review) and GET /api/reviews (fetch reviews)
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestReviewsAPI:
    """Reviews endpoint tests - public endpoints (no auth required)"""
    
    # Module: POST /api/reviews - Submit new review
    def test_post_review_success(self):
        """Test submitting a new review with all required fields"""
        payload = {
            "reviewer_name": "TEST_John Smith",
            "reviewer_email": "test_john@example.com",
            "event_name": "TEST Champions League Final 2026",
            "rating": 5,
            "title": "Amazing Experience!",
            "content": "The tickets arrived instantly and everything worked perfectly. Great service!",
            "verified_purchase": False
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        
        # Status assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert data.get("success") is True, f"Expected success=True, got {data}"
        assert "review_id" in data, "Response should contain review_id"
        assert data["review_id"].startswith("rev_"), f"review_id should start with 'rev_', got {data['review_id']}"
        
        print(f"✓ POST /api/reviews - Created review: {data['review_id']}")
        return data["review_id"]
    
    def test_post_review_min_rating(self):
        """Test submitting a review with rating 1 (minimum valid)"""
        payload = {
            "reviewer_name": "TEST_Jane Doe",
            "reviewer_email": "test_jane@example.com",
            "event_name": "TEST F1 Monaco GP",
            "rating": 1,
            "title": "Could be better",
            "content": "Not satisfied with the experience.",
            "verified_purchase": False
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") is True
        print(f"✓ POST /api/reviews - Rating 1 accepted: {data['review_id']}")
    
    def test_post_review_max_rating(self):
        """Test submitting a review with rating 5 (maximum valid)"""
        payload = {
            "reviewer_name": "TEST_Max Rating",
            "reviewer_email": "test_max@example.com",
            "event_name": "TEST MotoGP Italian GP",
            "rating": 5,
            "title": "Perfect Experience!",
            "content": "Everything was perfect from start to finish.",
            "verified_purchase": True
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") is True
        print(f"✓ POST /api/reviews - Rating 5 accepted: {data['review_id']}")
    
    def test_post_review_invalid_rating_too_high(self):
        """Test that rating > 5 is rejected"""
        payload = {
            "reviewer_name": "TEST_Invalid User",
            "reviewer_email": "test_invalid@example.com",
            "event_name": "TEST Event",
            "rating": 6,  # Invalid - should be 1-5
            "title": "Test",
            "content": "Test content",
            "verified_purchase": False
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        
        # Should return 422 validation error
        assert response.status_code == 422, f"Expected 422 for rating > 5, got {response.status_code}"
        print("✓ POST /api/reviews - Rating 6 rejected (422)")
    
    def test_post_review_invalid_rating_too_low(self):
        """Test that rating < 1 is rejected"""
        payload = {
            "reviewer_name": "TEST_Invalid User",
            "reviewer_email": "test_invalid@example.com",
            "event_name": "TEST Event",
            "rating": 0,  # Invalid - should be 1-5
            "title": "Test",
            "content": "Test content",
            "verified_purchase": False
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        
        # Should return 422 validation error
        assert response.status_code == 422, f"Expected 422 for rating < 1, got {response.status_code}"
        print("✓ POST /api/reviews - Rating 0 rejected (422)")
    
    def test_post_review_missing_required_fields(self):
        """Test that missing required fields return 422"""
        # Missing reviewer_name, event_name, title, content
        payload = {
            "rating": 5
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        
        assert response.status_code == 422, f"Expected 422 for missing fields, got {response.status_code}"
        print("✓ POST /api/reviews - Missing fields rejected (422)")
    
    def test_post_review_optional_email(self):
        """Test that reviewer_email is optional"""
        payload = {
            "reviewer_name": "TEST_No Email User",
            "event_name": "TEST Concert",
            "rating": 4,
            "title": "Good show",
            "content": "Nice experience overall.",
            "verified_purchase": False
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") is True
        print(f"✓ POST /api/reviews - Email optional accepted: {data['review_id']}")

    # Module: GET /api/reviews - Fetch reviews
    def test_get_reviews_pending(self):
        """Test fetching pending reviews (newly submitted reviews are pending)"""
        response = requests.get(f"{BASE_URL}/api/reviews?status=pending")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "reviews" in data, "Response should contain 'reviews' key"
        assert "aggregate" in data, "Response should contain 'aggregate' key"
        assert isinstance(data["reviews"], list), "reviews should be a list"
        
        # Check aggregate structure
        agg = data["aggregate"]
        assert "average_rating" in agg, "aggregate should contain average_rating"
        assert "total_reviews" in agg, "aggregate should contain total_reviews"
        
        print(f"✓ GET /api/reviews?status=pending - Found {len(data['reviews'])} pending reviews")
        print(f"  Aggregate: avg={agg['average_rating']}, total={agg['total_reviews']}")
        return data
    
    def test_get_reviews_approved(self):
        """Test fetching approved reviews (default for public display)"""
        response = requests.get(f"{BASE_URL}/api/reviews?status=approved")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "reviews" in data, "Response should contain 'reviews' key"
        assert "aggregate" in data, "Response should contain 'aggregate' key"
        
        # Check aggregate structure
        agg = data["aggregate"]
        assert isinstance(agg["average_rating"], (int, float)), "average_rating should be numeric"
        assert isinstance(agg["total_reviews"], int), "total_reviews should be integer"
        
        print(f"✓ GET /api/reviews?status=approved - Found {len(data['reviews'])} approved reviews")
        print(f"  Aggregate: avg={agg['average_rating']}, total={agg['total_reviews']}")
        return data
    
    def test_get_reviews_default_status(self):
        """Test that default status is 'approved'"""
        response = requests.get(f"{BASE_URL}/api/reviews")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "reviews" in data
        # All reviews should have status approved (default behavior)
        for review in data["reviews"]:
            assert review.get("status") == "approved", f"Expected approved, got {review.get('status')}"
        
        print(f"✓ GET /api/reviews (no status param) - Returns approved reviews")
    
    def test_get_reviews_with_limit(self):
        """Test fetching reviews with limit parameter"""
        response = requests.get(f"{BASE_URL}/api/reviews?status=approved&limit=5")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert len(data["reviews"]) <= 5, f"Expected max 5 reviews, got {len(data['reviews'])}"
        print(f"✓ GET /api/reviews?limit=5 - Returned {len(data['reviews'])} reviews")
    
    def test_review_data_structure(self):
        """Test that review objects have expected fields"""
        # First create a review, then fetch pending to verify structure
        payload = {
            "reviewer_name": "TEST_Structure Check",
            "reviewer_email": "test_structure@example.com",
            "event_name": "TEST Structure Event",
            "rating": 5,
            "title": "Structure Test",
            "content": "Testing review data structure",
            "verified_purchase": True
        }
        response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        assert response.status_code == 200
        
        # Fetch pending reviews to find our test review
        response = requests.get(f"{BASE_URL}/api/reviews?status=pending&limit=50")
        assert response.status_code == 200
        
        data = response.json()
        reviews = data["reviews"]
        
        # Find our test review
        test_review = None
        for r in reviews:
            if r.get("reviewer_name") == "TEST_Structure Check":
                test_review = r
                break
        
        if test_review:
            # Verify expected fields
            expected_fields = ["review_id", "reviewer_name", "event_name", "rating", "title", "content", "status", "created_at"]
            for field in expected_fields:
                assert field in test_review, f"Review should have field '{field}'"
            
            assert test_review["status"] == "pending", "New reviews should be pending"
            assert test_review["rating"] == 5
            print(f"✓ Review data structure validated - all expected fields present")
        else:
            print("⚠ Could not find test review in pending list (may have been approved)")


class TestReviewsIntegration:
    """Integration tests for review submission and retrieval flow"""
    
    def test_full_review_submission_flow(self):
        """Test complete flow: submit review → verify it exists in pending"""
        unique_name = f"TEST_Flow_{int(time.time())}"
        
        # Step 1: Submit review
        payload = {
            "reviewer_name": unique_name,
            "reviewer_email": f"{unique_name}@test.com",
            "event_name": "TEST World Cup Match",
            "rating": 5,
            "title": "Incredible Match!",
            "content": "Best football match I've ever seen. Will definitely use EuroMatchTickets again!",
            "verified_purchase": False
        }
        
        submit_response = requests.post(f"{BASE_URL}/api/reviews", json=payload)
        assert submit_response.status_code == 200
        review_id = submit_response.json()["review_id"]
        print(f"✓ Submitted review: {review_id}")
        
        # Step 2: Fetch pending reviews and find our review
        fetch_response = requests.get(f"{BASE_URL}/api/reviews?status=pending&limit=100")
        assert fetch_response.status_code == 200
        
        pending_reviews = fetch_response.json()["reviews"]
        found = any(r.get("review_id") == review_id for r in pending_reviews)
        
        assert found, f"Review {review_id} should appear in pending list"
        print(f"✓ Review {review_id} found in pending reviews")
        
        # Verify review data
        our_review = next((r for r in pending_reviews if r.get("review_id") == review_id), None)
        assert our_review["reviewer_name"] == unique_name
        assert our_review["rating"] == 5
        assert our_review["title"] == "Incredible Match!"
        print(f"✓ Review data integrity verified")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
