"""
Gallery endpoints.
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
from app.schemas.common import PaginatedResponse
from app.schemas.gallery import MediaCollectionPublic, MediaItemCreate, MediaItemPublic, MediaCollectionCreate
from app.services.gallery import GalleryService

router = APIRouter()


# ── Items ─────────────────────────────────────────────────────────

@router.get("/items", response_model=PaginatedResponse[MediaItemPublic])
async def list_items(
    category: Optional[str] = Query(default=None),
    pagination=Depends(get_pagination_params),
    session: AsyncSession = Depends(get_db_session),
):
    svc = GalleryService(session)
    items, total = await svc.list_items(
        limit=pagination.limit, offset=pagination.offset, category=category
    )
    return PaginatedResponse(items=items, total=total, limit=pagination.limit, offset=pagination.offset)


@router.get("/items/{item_id}", response_model=MediaItemPublic)
async def get_item(item_id: str, session: AsyncSession = Depends(get_db_session)):
    svc = GalleryService(session)
    item = await svc.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Media item not found")
    return item


@router.post("/items", response_model=MediaItemPublic, status_code=status.HTTP_201_CREATED)
async def create_item(
    body: MediaItemCreate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.GALLERY_WRITE)),
):
    svc = GalleryService(session)
    return await svc.create_item(body.model_dump(exclude_unset=True))


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: str,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.GALLERY_DELETE)),
):
    svc = GalleryService(session)
    item = await svc.delete_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Media item not found")


# ── Collections ───────────────────────────────────────────────────

@router.get("/collections", response_model=PaginatedResponse[MediaCollectionPublic])
async def list_collections(
    pagination=Depends(get_pagination_params),
    session: AsyncSession = Depends(get_db_session),
):
    svc = GalleryService(session)
    items, total = await svc.list_collections(limit=pagination.limit, offset=pagination.offset)
    return PaginatedResponse(items=items, total=total, limit=pagination.limit, offset=pagination.offset)


@router.post("/collections", response_model=MediaCollectionPublic, status_code=status.HTTP_201_CREATED)
async def create_collection(
    body: MediaCollectionCreate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.GALLERY_WRITE)),
):
    svc = GalleryService(session)
    return await svc.create_collection(body.model_dump(exclude_unset=True))
