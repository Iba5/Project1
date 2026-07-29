"""
Tests for catalogue endpoints.
"""

from __future__ import annotations

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.catalogue import Category, CatalogueItem
from app.models.user import User
from tests.conftest import make_auth_headers


async def _create_category(session: AsyncSession, slug: str = "tools") -> Category:
    cat = Category(name="Tools", slug=slug, is_active=True, sort_order=1)
    session.add(cat)
    await session.commit()
    await session.refresh(cat)
    return cat


async def _create_item(session: AsyncSession, category_id: str, slug: str = "hammer") -> CatalogueItem:
    item = CatalogueItem(
        name="Hammer",
        slug=slug,
        category_id=category_id,
        status="published",
    )
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return item


@pytest.mark.asyncio
class TestCataloguePublicEndpoints:
    async def test_list_items_public(self, client: AsyncClient, db_session: AsyncSession):
        cat = await _create_category(db_session)
        await _create_item(db_session, cat.id)

        resp = await client.get("/api/v1/catalogue/items")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 1

    async def test_get_single_item(self, client: AsyncClient, db_session: AsyncSession):
        cat = await _create_category(db_session)
        item = await _create_item(db_session, cat.id)

        resp = await client.get(f"/api/v1/catalogue/items/{item.id}")
        assert resp.status_code == 200
        assert resp.json()["slug"] == "hammer"

    async def test_get_nonexistent_item(self, client: AsyncClient):
        resp = await client.get("/api/v1/catalogue/items/does-not-exist")
        assert resp.status_code == 404

    async def test_list_categories_public(self, client: AsyncClient, db_session: AsyncSession):
        await _create_category(db_session)
        resp = await client.get("/api/v1/catalogue/categories")
        assert resp.status_code == 200
        assert resp.json()["total"] >= 1


@pytest.mark.asyncio
class TestCatalogueProtectedEndpoints:
    async def test_create_item_requires_auth(self, client: AsyncClient):
        resp = await client.post("/api/v1/catalogue/items", json={"name": "X", "slug": "x"})
        assert resp.status_code == 403

    async def test_create_item_as_admin(self, client: AsyncClient, db_session: AsyncSession, admin_user: User):
        cat = await _create_category(db_session)
        resp = await client.post(
            "/api/v1/catalogue/items",
            headers=make_auth_headers(admin_user),
            json={
                "name": "Drill",
                "slug": "drill",
                "category_id": cat.id,
                "status": "published",
            },
        )
        assert resp.status_code == 201
        assert resp.json()["slug"] == "drill"

    async def test_update_item_as_admin(self, client: AsyncClient, db_session: AsyncSession, admin_user: User):
        cat = await _create_category(db_session)
        item = await _create_item(db_session, cat.id)

        resp = await client.patch(
            f"/api/v1/catalogue/items/{item.id}",
            headers=make_auth_headers(admin_user),
            json={"name": "Updated Hammer"},
        )
        assert resp.status_code == 200
        assert resp.json()["name"] == "Updated Hammer"

    async def test_delete_item_as_admin(self, client: AsyncClient, db_session: AsyncSession, admin_user: User):
        cat = await _create_category(db_session)
        item = await _create_item(db_session, cat.id)

        resp = await client.delete(
            f"/api/v1/catalogue/items/{item.id}",
            headers=make_auth_headers(admin_user),
        )
        assert resp.status_code == 204

    async def test_delete_item_as_viewer_forbidden(self, client: AsyncClient, db_session: AsyncSession, viewer_user: User):
        cat = await _create_category(db_session)
        item = await _create_item(db_session, cat.id)

        resp = await client.delete(
            f"/api/v1/catalogue/items/{item.id}",
            headers=make_auth_headers(viewer_user),
        )
        assert resp.status_code == 403
