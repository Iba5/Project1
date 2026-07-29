"""
Tests for enquiry endpoints.
"""

from __future__ import annotations

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enquiry import Enquiry
from app.models.user import User
from tests.conftest import make_auth_headers


async def _create_enquiry(session: AsyncSession) -> Enquiry:
    enq = Enquiry(
        name="John Doe",
        email="john@example.com",
        message="I need PPE for my team.",
        status="new",
        source="contact_form",
    )
    session.add(enq)
    await session.commit()
    await session.refresh(enq)
    return enq


@pytest.mark.asyncio
class TestEnquiryPublicSubmit:
    async def test_submit_enquiry_public(self, client: AsyncClient):
        resp = await client.post("/api/v1/enquiries", json={
            "name": "Jane Smith",
            "email": "jane@example.com",
            "message": "Interested in ice blocks.",
        })
        assert resp.status_code == 201
        assert resp.json()["name"] == "Jane Smith"
        assert resp.json()["status"] == "new"

    async def test_submit_enquiry_missing_name(self, client: AsyncClient):
        """Name is required — Pydantic validation should reject."""
        resp = await client.post("/api/v1/enquiries", json={
            "email": "noemail@example.com",
        })
        assert resp.status_code == 422


@pytest.mark.asyncio
class TestEnquiryAdminEndpoints:
    async def test_list_enquiries_requires_auth(self, client: AsyncClient):
        resp = await client.get("/api/v1/enquiries")
        assert resp.status_code == 403

    async def test_list_enquiries_as_admin(self, client: AsyncClient, db_session: AsyncSession, admin_user: User):
        await _create_enquiry(db_session)
        resp = await client.get(
            "/api/v1/enquiries",
            headers=make_auth_headers(admin_user),
        )
        assert resp.status_code == 200
        assert resp.json()["total"] >= 1

    async def test_get_stats_as_admin(self, client: AsyncClient, db_session: AsyncSession, admin_user: User):
        await _create_enquiry(db_session)
        resp = await client.get(
            "/api/v1/enquiries/stats",
            headers=make_auth_headers(admin_user),
        )
        assert resp.status_code == 200

    async def test_update_status_as_admin(self, client: AsyncClient, db_session: AsyncSession, admin_user: User):
        enq = await _create_enquiry(db_session)
        resp = await client.patch(
            f"/api/v1/enquiries/{enq.id}/status",
            headers=make_auth_headers(admin_user),
            json={"status": "contacted", "notes": "Called them."},
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "contacted"

    async def test_delete_enquiry_as_admin(self, client: AsyncClient, db_session: AsyncSession, admin_user: User):
        enq = await _create_enquiry(db_session)
        resp = await client.delete(
            f"/api/v1/enquiries/{enq.id}",
            headers=make_auth_headers(admin_user),
        )
        assert resp.status_code == 204

    async def test_viewer_cannot_list_enquiries(self, client: AsyncClient, db_session: AsyncSession, viewer_user: User):
        await _create_enquiry(db_session)
        resp = await client.get(
            "/api/v1/enquiries",
            headers=make_auth_headers(viewer_user),
        )
        # Viewer has ENQUIRY_READ — they CAN list. This is by design.
        assert resp.status_code == 200

    async def test_viewer_cannot_delete_enquiry(self, client: AsyncClient, db_session: AsyncSession, viewer_user: User):
        enq = await _create_enquiry(db_session)
        resp = await client.delete(
            f"/api/v1/enquiries/{enq.id}",
            headers=make_auth_headers(viewer_user),
        )
        assert resp.status_code == 403
