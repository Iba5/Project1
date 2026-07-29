"""
Tests for authentication endpoints and RBAC enforcement.
"""

from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.models.user import User
from tests.conftest import make_auth_headers


@pytest.mark.asyncio
class TestLogin:
    async def test_login_success(self, client: AsyncClient, admin_user: User):
        resp = await client.post("/api/v1/auth/login", json={
            "email": "admin@test.com",
            "password": "adminpass123",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "admin@test.com"

    async def test_login_wrong_password(self, client: AsyncClient, admin_user: User):
        resp = await client.post("/api/v1/auth/login", json={
            "email": "admin@test.com",
            "password": "wrongpassword",
        })
        assert resp.status_code == 401

    async def test_login_unknown_email(self, client: AsyncClient):
        resp = await client.post("/api/v1/auth/login", json={
            "email": "nobody@test.com",
            "password": "anything",
        })
        assert resp.status_code == 401

    async def test_get_me_requires_auth(self, client: AsyncClient):
        resp = await client.get("/api/v1/auth/me")
        assert resp.status_code == 403  # HTTPBearer returns 403 when no credentials

    async def test_get_me_with_valid_token(self, client: AsyncClient, admin_user: User):
        resp = await client.get(
            "/api/v1/auth/me",
            headers=make_auth_headers(admin_user),
        )
        assert resp.status_code == 200
        assert resp.json()["email"] == "admin@test.com"
        assert resp.json()["role"] == "super_admin"

    async def test_get_me_with_invalid_token(self, client: AsyncClient):
        resp = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer not.a.valid.token"},
        )
        assert resp.status_code == 401


@pytest.mark.asyncio
class TestRefreshToken:
    async def test_refresh_tokens(self, client: AsyncClient, admin_user: User):
        # First login to get tokens
        login_resp = await client.post("/api/v1/auth/login", json={
            "email": "admin@test.com",
            "password": "adminpass123",
        })
        refresh_token = login_resp.json()["refresh_token"]

        # Use refresh token
        resp = await client.post("/api/v1/auth/refresh", json={
            "refresh_token": refresh_token,
        })
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    async def test_refresh_with_invalid_token(self, client: AsyncClient):
        resp = await client.post("/api/v1/auth/refresh", json={
            "refresh_token": "invalid.token",
        })
        assert resp.status_code == 401


@pytest.mark.asyncio
class TestAccountLockout:
    async def test_account_locks_after_max_attempts(self, client: AsyncClient, admin_user: User):
        """After MAX_FAILED_LOGIN_ATTEMPTS failures, subsequent logins return 401 with lock message."""
        for _ in range(5):
            await client.post("/api/v1/auth/login", json={
                "email": "admin@test.com",
                "password": "wrongpassword",
            })

        # Account should now be locked
        resp = await client.post("/api/v1/auth/login", json={
            "email": "admin@test.com",
            "password": "adminpass123",  # correct password, but locked
        })
        assert resp.status_code == 401
        assert "locked" in resp.json()["detail"].lower()


@pytest.mark.asyncio
class TestRBAC:
    async def test_viewer_cannot_delete_catalogue_item(self, client: AsyncClient, viewer_user: User):
        """Viewer role lacks CATALOGUE_DELETE — must get 403."""
        resp = await client.delete(
            "/api/v1/catalogue/items/nonexistent-id",
            headers=make_auth_headers(viewer_user),
        )
        assert resp.status_code == 403

    async def test_viewer_can_read_catalogue(self, client: AsyncClient, viewer_user: User):
        """Viewer can list catalogue items (public endpoint)."""
        resp = await client.get("/api/v1/catalogue/items")
        assert resp.status_code == 200

    async def test_viewer_cannot_create_catalogue_item(self, client: AsyncClient, viewer_user: User):
        """Viewer lacks CATALOGUE_WRITE — must get 403."""
        resp = await client.post(
            "/api/v1/catalogue/items",
            headers=make_auth_headers(viewer_user),
            json={"name": "Test", "slug": "test"},
        )
        assert resp.status_code == 403

    async def test_admin_can_read_enquiries(self, client: AsyncClient, admin_user: User):
        """super_admin has ENQUIRY_READ."""
        resp = await client.get(
            "/api/v1/enquiries",
            headers=make_auth_headers(admin_user),
        )
        assert resp.status_code == 200
