"""
Generic CRUD repository base class.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Generic async repository with CRUD operations.
    All methods respect soft-delete (is_deleted=False) by default.
    """

    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    # ── Read ──────────────────────────────────────────────────────
    async def get_by_id(
        self, id: str, *, include_deleted: bool = False
    ) -> Optional[ModelType]:
        stmt = select(self.model).where(self.model.id == id)
        if not include_deleted and hasattr(self.model, "is_deleted"):
            stmt = stmt.where(self.model.is_deleted == False)  # noqa: E712
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_many(
        self,
        *,
        limit: int = 20,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
        include_deleted: bool = False,
    ) -> List[ModelType]:
        stmt = select(self.model)
        if not include_deleted and hasattr(self.model, "is_deleted"):
            stmt = stmt.where(self.model.is_deleted == False)  # noqa: E712
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key) and value is not None:
                    stmt = stmt.where(getattr(self.model, key) == value)
        stmt = stmt.offset(offset).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count(
        self,
        *,
        filters: Optional[Dict[str, Any]] = None,
        include_deleted: bool = False,
    ) -> int:
        stmt = select(func.count()).select_from(self.model)
        if not include_deleted and hasattr(self.model, "is_deleted"):
            stmt = stmt.where(self.model.is_deleted == False)  # noqa: E712
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key) and value is not None:
                    stmt = stmt.where(getattr(self.model, key) == value)
        result = await self.session.execute(stmt)
        return result.scalar_one()

    # ── Create ────────────────────────────────────────────────────
    async def create(self, data: Dict[str, Any]) -> ModelType:
        instance = self.model(**data)
        self.session.add(instance)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    # ── Update ────────────────────────────────────────────────────
    async def update(self, id: str, data: Dict[str, Any]) -> Optional[ModelType]:
        instance = await self.get_by_id(id)
        if not instance:
            return None
        for key, value in data.items():
            if value is not None and hasattr(instance, key):
                setattr(instance, key, value)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    # ── Soft delete ───────────────────────────────────────────────
    async def soft_delete(self, id: str) -> Optional[ModelType]:
        instance = await self.get_by_id(id)
        if not instance:
            return None
        instance.is_deleted = True  # type: ignore[attr-defined]
        instance.deleted_at = datetime.now(timezone.utc)  # type: ignore[attr-defined]
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    # ── Hard delete ───────────────────────────────────────────────
    async def hard_delete(self, id: str) -> bool:
        instance = await self.get_by_id(id, include_deleted=True)
        if not instance:
            return False
        await self.session.delete(instance)
        await self.session.flush()
        return True
