"""
CMS schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# ── Page ──────────────────────────────────────────────────────────
class PageCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    status: Optional[str] = "draft"


class PageUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    version: Optional[int] = None


class ContentBlockPublic(BaseModel):
    id: str
    page_id: str
    block_type: str
    content: Optional[Any] = None
    sort_order: int

    model_config = {"from_attributes": True}


class PageVersionPublic(BaseModel):
    id: str
    page_id: str
    version_number: int
    snapshot: Optional[Any] = None
    created_by: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class PagePublic(BaseModel):
    id: str
    title: str
    slug: str
    status: str
    version: int
    published_at: Optional[datetime] = None
    blocks: List[ContentBlockPublic] = []
    versions: List[PageVersionPublic] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PageRollbackRequest(BaseModel):
    version_number: int
