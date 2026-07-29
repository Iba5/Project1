"""
Gallery schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ── MediaItem ─────────────────────────────────────────────────────
class MediaItemCreate(BaseModel):
    title: str
    alt_text: Optional[str] = None
    file_url: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    category: Optional[str] = None


class MediaItemPublic(BaseModel):
    id: str
    title: str
    alt_text: Optional[str] = None
    file_url: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── MediaCollection ───────────────────────────────────────────────
class MediaCollectionCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None


class MediaCollectionPublic(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    items: list["MediaCollectionItemPublic"] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MediaCollectionItemPublic(BaseModel):
    media_id: str
    sort_order: int
    media_item: Optional[MediaItemPublic] = None

    model_config = {"from_attributes": True}
