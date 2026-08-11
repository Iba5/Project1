"""
Catalogue schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator

MAX_GALLERY_IMAGES = 5


def _check_gallery_size(v: Optional[List[str]]) -> Optional[List[str]]:
    if v is not None and len(v) > MAX_GALLERY_IMAGES:
        raise ValueError(f"A product can have at most {MAX_GALLERY_IMAGES} additional images")
    return v


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
    gallery_image_urls: Optional[List[str]] = None
    is_featured: bool = False
    is_out_of_stock: bool = False
    features: Optional[List[str]] = None
    specs: Optional[List[Dict[str, str]]] = None
    min_order: Optional[str] = None
    lead_time: Optional[str] = None
    status: Optional[str] = "draft"

    _check_gallery = field_validator("gallery_image_urls")(_check_gallery_size)


class CatalogueItemUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    gallery_image_urls: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_out_of_stock: Optional[bool] = None
    features: Optional[List[str]] = None
    specs: Optional[List[Dict[str, str]]] = None
    min_order: Optional[str] = None
    lead_time: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    status: Optional[str] = None
    version: Optional[int] = None

    _check_gallery = field_validator("gallery_image_urls")(_check_gallery_size)


class CatalogueItemPublic(BaseModel):
    id: str
    name: str
    slug: str
    category_id: Optional[str] = None
    category: Optional[CategoryPublic] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    gallery_image_urls: Optional[List[str]] = None
    is_featured: bool
    is_out_of_stock: bool
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
