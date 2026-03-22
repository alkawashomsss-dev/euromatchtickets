"""
Test Google OAuth authentication endpoints for euromatchtickets.com
Tests the new direct Google OAuth 2.0 flow that replaced Emergent-managed auth

Key endpoints tested:
- POST /api/auth/google - New Google OAuth code exchange
- POST /api/auth/session - Legacy Emergent auth (backward compatibility)
- GET /api/auth/me - Get current user (requires auth)
- POST /api/auth/logout - Logout user
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    BASE_URL = "https://euro-indexing.preview.emergentagent.com"

class TestGoogleAuthEndpoint:
    """Tests for POST /api/auth/google - new Google OAuth code exchange"""
    
    def test_google_auth_missing_code(self):
        """POST /api/auth/google returns 400 if code is missing"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google",
            json={"redirect_uri": "https://test.com/callback"},
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "detail" in data
        assert "code" in data["detail"].lower() or "required" in data["detail"].lower()
        print(f"✓ Missing code returns 400: {data['detail']}")
    
    def test_google_auth_missing_redirect_uri(self):
        """POST /api/auth/google returns 400 if redirect_uri is missing"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google",
            json={"code": "test_invalid_code"},
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "detail" in data
        assert "redirect_uri" in data["detail"].lower() or "required" in data["detail"].lower()
        print(f"✓ Missing redirect_uri returns 400: {data['detail']}")
    
    def test_google_auth_missing_both(self):
        """POST /api/auth/google returns 400 if both code and redirect_uri are missing"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google",
            json={},
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        print(f"✓ Missing both params returns 400")
    
    def test_google_auth_invalid_code(self):
        """POST /api/auth/google returns 401 (not 500) for invalid code"""
        response = requests.post(
            f"{BASE_URL}/api/auth/google",
            json={
                "code": "invalid_test_code_12345",
                "redirect_uri": "https://euromatchtickets.com/auth/callback"
            },
            headers={"Content-Type": "application/json"},
            timeout=30  # Token exchange may take time
        )
        # Should return 401 with meaningful error, NOT 500
        assert response.status_code == 401, f"Expected 401 for invalid code, got {response.status_code}: {response.text}"
        data = response.json()
        assert "detail" in data
        # Should contain meaningful error message
        assert len(data["detail"]) > 5, "Error message should be meaningful"
        print(f"✓ Invalid code returns 401 with meaningful error: {data['detail']}")


class TestLegacySessionEndpoint:
    """Tests for POST /api/auth/session - legacy Emergent auth (backward compatibility)"""
    
    def test_session_endpoint_exists(self):
        """POST /api/auth/session endpoint exists"""
        response = requests.post(
            f"{BASE_URL}/api/auth/session",
            json={},
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        # Should return 400 (missing session_id), not 404
        assert response.status_code != 404, "Legacy session endpoint should exist"
        print(f"✓ Legacy /api/auth/session endpoint exists (status: {response.status_code})")
    
    def test_session_missing_session_id(self):
        """POST /api/auth/session returns 400 if session_id is missing"""
        response = requests.post(
            f"{BASE_URL}/api/auth/session",
            json={},
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "detail" in data
        assert "session_id" in data["detail"].lower() or "required" in data["detail"].lower()
        print(f"✓ Missing session_id returns 400: {data['detail']}")
    
    def test_session_invalid_session_id(self):
        """POST /api/auth/session returns 401 for invalid session_id"""
        response = requests.post(
            f"{BASE_URL}/api/auth/session",
            json={"session_id": "invalid_session_12345"},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        # Should return 401 (invalid session), not 500
        assert response.status_code == 401, f"Expected 401 for invalid session_id, got {response.status_code}: {response.text}"
        print(f"✓ Invalid session_id returns 401")


class TestAuthMeEndpoint:
    """Tests for GET /api/auth/me - get current user"""
    
    def test_auth_me_unauthorized(self):
        """GET /api/auth/me returns 401 when not authenticated"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            timeout=15
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print(f"✓ /api/auth/me returns 401 when not authenticated")
    
    def test_auth_me_invalid_token(self):
        """GET /api/auth/me returns 401 with invalid Bearer token"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid_token_xyz123"},
            timeout=15
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        print(f"✓ /api/auth/me returns 401 with invalid token")


class TestLogoutEndpoint:
    """Tests for POST /api/auth/logout"""
    
    def test_logout_works_without_session(self):
        """POST /api/auth/logout works even without active session"""
        response = requests.post(
            f"{BASE_URL}/api/auth/logout",
            timeout=15
        )
        # Logout should succeed even if no session (idempotent)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"✓ /api/auth/logout succeeds without session")
    
    def test_logout_returns_success(self):
        """POST /api/auth/logout returns success:true"""
        response = requests.post(
            f"{BASE_URL}/api/auth/logout",
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        print(f"✓ /api/auth/logout returns success: True")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
