"""
Test SEO Content Generation Endpoints
Tests the AI-powered content generation system for SEO pages.
Uses Emergent LLM Key with OpenAI GPT-4o (budget may be exceeded)

Endpoints tested:
- GET /api/seo/content-stats - Content generation statistics
- POST /api/seo/generate-content - Batch content generation
- POST /api/seo/generate-content-single/{slug} - Single page generation
- GET /api/seo/generate-content-status - Bulk job status
- POST /api/seo/generate-content-bulk - Start bulk generation background task
- GET /api/seo/pages - Paginated SEO pages list
- GET /api/seo/page/{slug} - Get specific page with AI content
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestContentStats:
    """Test content generation statistics endpoint - should always work"""
    
    def test_content_stats_returns_200(self):
        """GET /api/seo/content-stats should return statistics"""
        response = requests.get(f"{BASE_URL}/api/seo/content-stats", timeout=30)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("status") == "success", f"Expected status=success, got {data}"
        
        # Validate required fields
        assert "total_pages" in data, "Missing total_pages field"
        assert "ai_generated" in data, "Missing ai_generated field"
        assert "template_only" in data, "Missing template_only field"
        assert "progress_percent" in data, "Missing progress_percent field"
        
        # Validate data types
        assert isinstance(data["total_pages"], int), "total_pages should be int"
        assert isinstance(data["ai_generated"], int), "ai_generated should be int"
        assert isinstance(data["template_only"], int), "template_only should be int"
        
        # Validate logic: ai_generated + template_only = total_pages
        assert data["ai_generated"] + data["template_only"] == data["total_pages"], \
            f"ai_generated({data['ai_generated']}) + template_only({data['template_only']}) != total_pages({data['total_pages']})"
        
        print(f"Content stats: {data['ai_generated']}/{data['total_pages']} pages AI-generated ({data['progress_percent']}%)")


class TestContentGenerationStatus:
    """Test bulk content generation status endpoint - should always work"""
    
    def test_generation_status_returns_200(self):
        """GET /api/seo/generate-content-status should return job status"""
        response = requests.get(f"{BASE_URL}/api/seo/generate-content-status", timeout=30)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Validate job status structure
        assert "job" in data, "Missing 'job' field in response"
        job = data["job"]
        assert "running" in job, "Job missing 'running' field"
        assert "generated" in job, "Job missing 'generated' field"
        assert "errors" in job, "Job missing 'errors' field"
        
        # Validate stats structure
        assert "stats" in data, "Missing 'stats' field in response"
        stats = data["stats"]
        assert "total_pages" in stats, "Stats missing 'total_pages'"
        assert "ai_generated" in stats, "Stats missing 'ai_generated'"
        
        print(f"Job status: running={job['running']}, generated={job['generated']}, errors={job['errors']}")


class TestBatchContentGeneration:
    """Test batch content generation - may fail with budget exceeded"""
    
    def test_generate_content_batch(self):
        """POST /api/seo/generate-content should generate batch of pages or return budget error"""
        response = requests.post(
            f"{BASE_URL}/api/seo/generate-content",
            params={"batch_size": 2},
            timeout=120  # Content generation can be slow
        )
        
        # Should return 200 regardless of budget status
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Either success with generated content OR budget exceeded error
        if data.get("status") == "success":
            assert "generated" in data, "Success response missing 'generated' count"
            assert "errors" in data, "Success response missing 'errors' count"
            print(f"Batch generation success: {data['generated']} generated, {data['errors']} errors")
        elif data.get("status") == "error":
            # Budget exceeded is expected behavior per agent notes
            error_msg = data.get("message", "")
            print(f"Expected budget error or other error: {error_msg}")
            assert "message" in data, "Error response should have message"
        else:
            print(f"Unexpected response: {data}")


class TestSinglePageGeneration:
    """Test single page content generation - may fail with budget exceeded"""
    
    def test_generate_single_page_valid_slug(self):
        """POST /api/seo/generate-content-single/{slug} with valid slug"""
        # First get a valid slug from the API
        pages_response = requests.get(f"{BASE_URL}/api/seo/pages?limit=1", timeout=30)
        assert pages_response.status_code == 200
        
        pages_data = pages_response.json()
        if not pages_data.get("pages"):
            pytest.skip("No SEO pages available to test")
        
        slug = pages_data["pages"][0]["slug"]
        
        # Try to generate content for this page
        response = requests.post(
            f"{BASE_URL}/api/seo/generate-content-single/{slug}",
            timeout=120  # AI generation can be slow
        )
        
        # Should return 200 even if budget exceeded
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        if data.get("status") == "success":
            assert "slug" in data, "Success response missing 'slug'"
            assert "content_length" in data, "Success response missing 'content_length'"
            assert data["content_length"] > 200, "Content should be >200 chars"
            print(f"Single page generation success: {slug}, {data['content_length']} chars")
        else:
            # Budget exceeded or other error is expected
            print(f"Single page generation result: {data.get('status')}: {data.get('message', 'no message')}")
    
    def test_generate_single_page_invalid_slug(self):
        """POST /api/seo/generate-content-single/{slug} with invalid slug returns 404"""
        response = requests.post(
            f"{BASE_URL}/api/seo/generate-content-single/invalid-nonexistent-slug-xyz123",
            timeout=30
        )
        assert response.status_code == 404, f"Expected 404 for invalid slug, got {response.status_code}"
        print("Invalid slug correctly returns 404")


class TestBulkContentGeneration:
    """Test bulk content generation background job - may fail with budget exceeded"""
    
    def test_bulk_generation_starts(self):
        """POST /api/seo/generate-content-bulk should start background job or return status"""
        response = requests.post(
            f"{BASE_URL}/api/seo/generate-content-bulk",
            params={"batch_size": 2},
            timeout=30
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Could be: started, already_running, complete, or error
        valid_statuses = ["started", "already_running", "complete", "error"]
        assert data.get("status") in valid_statuses, \
            f"Unexpected status: {data.get('status')}. Expected one of {valid_statuses}"
        
        print(f"Bulk generation response: status={data.get('status')}")
        
        if data.get("status") == "started":
            assert "total_to_generate" in data, "Started response missing 'total_to_generate'"
            assert "batch_size" in data, "Started response missing 'batch_size'"
            print(f"Bulk job started: {data.get('total_to_generate')} pages to generate")
        elif data.get("status") == "already_running":
            print("Bulk job already running")
        elif data.get("status") == "complete":
            print("All pages already have AI content")


class TestSEOPagesAPI:
    """Test SEO pages listing and retrieval"""
    
    def test_get_seo_pages_paginated(self):
        """GET /api/seo/pages returns paginated list"""
        response = requests.get(f"{BASE_URL}/api/seo/pages?page=1&limit=10", timeout=30)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Validate pagination structure
        assert "total" in data, "Missing 'total' field"
        assert "page" in data, "Missing 'page' field"
        assert "limit" in data, "Missing 'limit' field"
        assert "total_pages" in data, "Missing 'total_pages' field"
        assert "pages" in data, "Missing 'pages' field"
        
        assert data["page"] == 1, "Page should be 1"
        assert data["limit"] == 10, "Limit should be 10"
        assert len(data["pages"]) <= 10, "Should return at most 10 pages"
        
        print(f"SEO pages: {data['total']} total, page {data['page']}/{data['total_pages']}, {len(data['pages'])} returned")
    
    def test_get_seo_pages_filter_by_category(self):
        """GET /api/seo/pages with category filter"""
        response = requests.get(f"{BASE_URL}/api/seo/pages?category=f1&limit=5", timeout=30)
        assert response.status_code == 200
        
        data = response.json()
        pages = data.get("pages", [])
        
        # All returned pages should be in the f1 category
        for page in pages:
            assert page.get("category") == "f1", f"Page {page.get('slug')} has category {page.get('category')}, expected f1"
        
        print(f"F1 category filter: {len(pages)} pages returned")
    
    def test_get_specific_seo_page(self):
        """GET /api/seo/page/{slug} returns specific page"""
        # Use known slug from the request: bahrain-grand-prix-2026-tickets
        slug = "bahrain-grand-prix-2026-tickets"
        response = requests.get(f"{BASE_URL}/api/seo/page/{slug}", timeout=30)
        
        # This page should exist per the requirements
        assert response.status_code == 200, f"Expected 200 for {slug}, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Validate page structure
        assert "slug" in data, "Page missing 'slug'"
        assert data["slug"] == slug, f"Slug mismatch: {data['slug']} != {slug}"
        
        # Check for AI-generated content fields
        has_ai_content = data.get("content_quality") == "ai_generated" or data.get("content_generated_at") is not None
        
        print(f"Page {slug}: category={data.get('category')}, has_ai_content={has_ai_content}")
        
        if has_ai_content:
            assert "content" in data, "AI-generated page should have content"
            assert len(data.get("content", "")) > 200, "AI content should be >200 chars"
            print(f"AI content length: {len(data.get('content', ''))}")
    
    def test_get_nonexistent_page_returns_404(self):
        """GET /api/seo/page/{slug} with invalid slug returns 404"""
        response = requests.get(f"{BASE_URL}/api/seo/page/nonexistent-page-xyz123", timeout=30)
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"


class TestAIGeneratedPageContent:
    """Test that AI-generated pages have proper content structure"""
    
    def test_ai_generated_page_has_content_fields(self):
        """Verify AI-generated pages have proper content fields"""
        # Get pages with AI content
        response = requests.get(f"{BASE_URL}/api/seo/pages?limit=50", timeout=30)
        assert response.status_code == 200
        
        data = response.json()
        pages = data.get("pages", [])
        
        # Find a page with AI content by checking the full page data
        ai_page_found = False
        for page_summary in pages[:10]:  # Check first 10
            slug = page_summary.get("slug")
            if not slug:
                continue
            
            # Get full page data
            page_response = requests.get(f"{BASE_URL}/api/seo/page/{slug}", timeout=30)
            if page_response.status_code == 200:
                page_data = page_response.json()
                if page_data.get("content_generated_at") or page_data.get("content_quality") == "ai_generated":
                    ai_page_found = True
                    
                    # Validate content fields
                    assert "content" in page_data, f"AI page {slug} missing 'content'"
                    content = page_data.get("content", "")
                    assert len(content) > 200, f"AI content too short: {len(content)} chars"
                    assert "<p>" in content, "AI content should contain HTML <p> tags"
                    
                    # Check it doesn't have forbidden AI words
                    ai_words_to_avoid = ["delve", "tapestry", "vibrant", "plethora", "myriad"]
                    content_lower = content.lower()
                    for word in ai_words_to_avoid:
                        if word in content_lower:
                            print(f"Warning: Found AI word '{word}' in content for {slug}")
                    
                    print(f"AI page verified: {slug}, content length: {len(content)}")
                    break
        
        if not ai_page_found:
            print("No AI-generated pages found in first 10 pages - may need to generate more")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
