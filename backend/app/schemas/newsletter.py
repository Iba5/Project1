"""
Newsletter schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class NewsletterSubscribe(BaseModel):
    """Newsletter subscription request."""
    email: EmailStr
    source: Optional[str] = "footer_form"


class NewsletterPublic(BaseModel):
    """Newsletter subscriber public representation."""
    id: str
    email: str
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}
