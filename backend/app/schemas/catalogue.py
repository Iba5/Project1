"""
Catalogue schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ── Category ──────────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class CategoryPublic(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Catalogue Item ────────────────────────────────────────────────
class CatalogueItemCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    category_id: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    features: Optional[List[str]] = None
    specs: Optional[List[Dict[str, str]]] = None
    min_order: Optional[str] = None
    lead_time: Optional[str] = None
    status: Optional[str] = "draft"


class CatalogueItemUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    features: Optional[List[str]] = None
    specs: Optional[List[Dict[str, str]]] = None
    min_order: Optional[str] = None
    lead_time: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    status: Optional[str] = None
    version: Optional[int] = None


class CatalogueItemPublic(BaseModel):
    id: str
    name: str
    slug: str
    category_id: Optional[str] = None
    category: Optional[CategoryPublic] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool
    features: Optional[Any] = None
    specs: Optional[Any] = None
    min_order: Optional[str] = None
    lead_time: Optional[str] = None
    rating: Optional[float] = None
    review_count: int
    status: str
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
