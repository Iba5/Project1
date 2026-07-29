"""
Enquiry endpoints.
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
from app.schemas.enquiry import EnquiryCreate, EnquiryPublic, EnquiryUpdateStatus
from app.services.enquiry import EnquiryService

router = APIRouter()


@router.get("", response_model=PaginatedResponse[EnquiryPublic])
async def list_enquiries(
    status_filter: Optional[str] = Query(default=None, alias="status"),
    pagination=Depends(get_pagination_params),
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.ENQUIRY_READ)),
):
    svc = EnquiryService(session)
    items, total = await svc.list_enquiries(
        limit=pagination.limit,
        offset=pagination.offset,
        status=status_filter,
    )
    return PaginatedResponse(items=items, total=total, limit=pagination.limit, offset=pagination.offset)


@router.get("/stats")
async def get_enquiry_stats(
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.ENQUIRY_READ)),
):
    """Admin endpoint — returns aggregated enquiry statistics."""
    svc = EnquiryService(session)
    return await svc.get_stats()


@router.get("/{enquiry_id}", response_model=EnquiryPublic)
async def get_enquiry(
    enquiry_id: str,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.ENQUIRY_READ)),
):
    svc = EnquiryService(session)
    enquiry = await svc.get_enquiry(enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.post("", response_model=EnquiryPublic, status_code=status.HTTP_201_CREATED)
async def create_enquiry(
    body: EnquiryCreate,
    session: AsyncSession = Depends(get_db_session),
):
    """Public endpoint — no auth required."""
    svc = EnquiryService(session)
    return await svc.create_enquiry(body.model_dump(exclude_unset=True))


@router.patch("/{enquiry_id}/status", response_model=EnquiryPublic)
async def update_enquiry_status(
    enquiry_id: str,
    body: EnquiryUpdateStatus,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.ENQUIRY_WRITE)),
):
    svc = EnquiryService(session)
    enquiry = await svc.update_status(enquiry_id, body.status, body.notes)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.delete("/{enquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enquiry(
    enquiry_id: str,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.ENQUIRY_DELETE)),
):
    svc = EnquiryService(session)
    enquiry = await svc.delete_enquiry(enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
