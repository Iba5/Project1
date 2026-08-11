"""
Catalogue endpoints.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import require_permission
from app.dependencies.database import get_db_session
from app.dependencies.pagination import get_pagination_params
from app.models.user import User
from app.permissions.rbac import Permission
from app.schemas.catalogue import (
    CatalogueItemCreate,
    CatalogueItemPublic,
    CatalogueItemUpdate,
    CategoryCreate,
    CategoryPublic,
    CategoryUpdate,
)
from app.schemas.common import PaginatedResponse
from app.services.catalogue import CatalogueService

router = APIRouter()


# ── Categories ────────────────────────────────────────────────────

@router.get("/categories", response_model=PaginatedResponse[CategoryPublic])
async def list_categories(
    pagination=Depends(get_pagination_params),
    session: AsyncSession = Depends(get_db_session),
):
    svc = CatalogueService(session)
    items, total = await svc.list_categories(limit=pagination.limit, offset=pagination.offset)
    return PaginatedResponse(items=items, total=total, limit=pagination.limit, offset=pagination.offset)


@router.post("/categories", response_model=CategoryPublic, status_code=status.HTTP_201_CREATED)
async def create_category(
    body: CategoryCreate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CATALOGUE_WRITE)),
):
    svc = CatalogueService(session)
    return await svc.create_category(body.model_dump(exclude_unset=True))


@router.patch("/categories/{category_id}", response_model=CategoryPublic)
async def update_category(
    category_id: str,
    body: CategoryUpdate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CATALOGUE_WRITE)),
):
    svc = CatalogueService(session)
    category = await svc.update_category(category_id, body.model_dump(exclude_unset=True))
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# ── Items ─────────────────────────────────────────────────────────

@router.get("/items", response_model=PaginatedResponse[CatalogueItemPublic])
async def list_items(
    category_id: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    is_featured: Optional[bool] = Query(default=None),
    pagination=Depends(get_pagination_params),
    session: AsyncSession = Depends(get_db_session),
):
    svc = CatalogueService(session)
    items, total = await svc.list_items(
        limit=pagination.limit,
        offset=pagination.offset,
        category_id=category_id,
        status=status,
        is_featured=is_featured,
    )
    return PaginatedResponse(items=items, total=total, limit=pagination.limit, offset=pagination.offset)


@router.get("/items/{item_id}", response_model=CatalogueItemPublic)
async def get_item(item_id: str, session: AsyncSession = Depends(get_db_session)):
    svc = CatalogueService(session)
    item = await svc.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/items", response_model=CatalogueItemPublic, status_code=status.HTTP_201_CREATED)
async def create_item(
    body: CatalogueItemCreate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CATALOGUE_WRITE)),
):
    svc = CatalogueService(session)
    return await svc.create_item(body.model_dump(exclude_unset=True))


@router.patch("/items/{item_id}", response_model=CatalogueItemPublic)
async def update_item(
    item_id: str,
    body: CatalogueItemUpdate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CATALOGUE_WRITE)),
):
    svc = CatalogueService(session)
    try:
        item = await svc.update_item(item_id, body.model_dump(exclude_unset=True))
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: str,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CATALOGUE_DELETE)),
):
    svc = CatalogueService(session)
    item = await svc.delete_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
