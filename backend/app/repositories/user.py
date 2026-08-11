"""
User repository.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import BaseRepository

ADMIN_ROLES = ("super_admin", "admin")


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email, User.is_deleted == False)  # noqa: E712
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def admin_exists(self) -> bool:
        """Whether any admin/super_admin account already exists (bootstrap gate)."""
        stmt = select(
            exists().where(
                User.role.in_(ADMIN_ROLES),
                User.is_deleted == False,  # noqa: E712
            )
        )
        result = await self.session.execute(stmt)
        return bool(result.scalar())

    async def get_active_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(
            User.email == email,
            User.is_deleted == False,  # noqa: E712
            User.is_active == True,  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
