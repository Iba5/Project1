"""
Enquiry schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class EnquiryCreate(BaseModel):
    """Public enquiry submission."""
    name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    message: str
    source: Optional[str] = "contact_form"


class EnquiryUpdateStatus(BaseModel):
    status: str = Field(pattern="^(new|contacted|resolved|closed)$")
    notes: Optional[str] = None


class EnquiryPublic(BaseModel):
    id: str
    name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    message: Optional[str] = None
    status: str
    source: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
