"""
Settings schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel


class SettingUpdate(BaseModel):
    value: Optional[Any] = None
    description: Optional[str] = None


class SettingPublic(BaseModel):
    id: str
    key: str
    value: Optional[Any] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
