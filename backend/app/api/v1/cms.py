"""
CMS endpoints.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, require_permission
from app.dependencies.database import get_db_session
from app.dependencies.pagination import get_pagination_params
from app.models.user import User
from app.permissions.rbac import Permission
from app.schemas.cms import (
    PageCreate,
    PagePublic,
    PageRollbackRequest,
    PageUpdate,
    PageVersionPublic,
)
from app.schemas.common import PaginatedResponse
from app.services.cms import CMSService

router = APIRouter()


@router.get("/pages", response_model=PaginatedResponse[PagePublic])
async def list_pages(
    status_filter: Optional[str] = Query(default=None, alias="status"),
    pagination=Depends(get_pagination_params),
    session: AsyncSession = Depends(get_db_session),
):
    svc = CMSService(session)
    items, total = await svc.list_pages(
        limit=pagination.limit, offset=pagination.offset, status=status_filter
    )
    return PaginatedResponse(items=items, total=total, limit=pagination.limit, offset=pagination.offset)


@router.get("/pages/{slug}", response_model=PagePublic)
async def get_page(slug: str, session: AsyncSession = Depends(get_db_session)):
    svc = CMSService(session)
    # Try by slug first, then by id
    page = await svc.get_page_by_slug(slug) or await svc.get_page(slug)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.post("/pages", response_model=PagePublic, status_code=status.HTTP_201_CREATED)
async def create_page(
    body: PageCreate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CMS_WRITE)),
):
    svc = CMSService(session)
    return await svc.create_page(body.model_dump(exclude_unset=True))


@router.patch("/pages/{page_id}", response_model=PagePublic)
async def update_page(
    page_id: str,
    body: PageUpdate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CMS_WRITE)),
):
    svc = CMSService(session)
    try:
        page = await svc.update_page(page_id, body.model_dump(exclude_unset=True))
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.post("/pages/{page_id}/publish", response_model=PagePublic)
async def publish_page(
    page_id: str,
    session: AsyncSession = Depends(get_db_session),
    user: User = Depends(require_permission(Permission.CMS_PUBLISH)),
):
    svc = CMSService(session)
    page = await svc.publish_page(page_id, user_id=user.id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.post("/pages/{page_id}/archive", response_model=PagePublic)
async def archive_page(
    page_id: str,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CMS_DELETE)),
):
    svc = CMSService(session)
    page = await svc.archive_page(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.get("/pages/{page_id}/versions", response_model=list[PageVersionPublic])
async def get_page_versions(
    page_id: str,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.CMS_READ)),
):
    svc = CMSService(session)
    return await svc.get_page_versions(page_id)


@router.post("/pages/{page_id}/rollback", response_model=PagePublic)
async def rollback_page(
    page_id: str,
    body: PageRollbackRequest,
    session: AsyncSession = Depends(get_db_session),
    user: User = Depends(require_permission(Permission.CMS_PUBLISH)),
):
    svc = CMSService(session)
    try:
        page = await svc.rollback_page(page_id, body.version_number, user_id=user.id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page
