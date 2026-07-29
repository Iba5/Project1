"""
Enquiry repository.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enquiry import Enquiry
from app.repositories.base import BaseRepository


class EnquiryRepository(BaseRepository[Enquiry]):
    def __init__(self, session: AsyncSession):
        super().__init__(Enquiry, session)
