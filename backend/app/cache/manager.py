"""
Cache manager: Redis if available, in-memory dict with TTL otherwise.
"""

from __future__ import annotations

import hashlib
import json
import time
from typing import Any, Dict, Optional

from app.core.config import settings
from app.core.logging import logger


class _InMemoryCache:
    """Simple in-memory cache with TTL support."""

    def __init__(self) -> None:
        self._store: Dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        entry = self._store.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if expires_at and time.time() > expires_at:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        expires_at = time.time() + ttl if ttl else None
        self._store[key] = (value, expires_at)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def invalidate_pattern(self, pattern: str) -> None:
        """Invalidate keys matching a prefix pattern."""
        prefix = pattern.rstrip("*")
        keys_to_delete = [k for k in self._store if k.startswith(prefix)]
        for k in keys_to_delete:
            del self._store[k]


class CacheManager:
    """
    Unified cache interface.
    Uses Redis if REDIS_URL is configured, otherwise falls back to in-memory.
    """

    def __init__(self) -> None:
        self._redis: Any = None
        self._memory: _InMemoryCache = _InMemoryCache()
        self._use_redis = False

        if settings.REDIS_URL:
            try:
                import redis.asyncio as redis

                self._redis = redis.from_url(settings.REDIS_URL)
                self._use_redis = True
                logger.info("Cache: using Redis")
            except ImportError:
                logger.warning("Redis package not installed, falling back to in-memory cache")
            except Exception as exc:
                logger.warning(f"Redis connection failed: {exc}, falling back to in-memory cache")

        if not self._use_redis:
            logger.info("Cache: using in-memory store")

    @staticmethod
    def build_key(resource: str, id: str, version: Optional[int] = None) -> str:
        """Build a namespaced cache key."""
        parts = [resource, id]
        if version is not None:
            parts.append(str(version))
        return ":".join(parts)

    async def get(self, key: str) -> Optional[Any]:
        if self._use_redis and self._redis:
            data = await self._redis.get(key)
            if data:
                try:
                    return json.loads(data)
                except json.JSONDecodeError:
                    return data
            return None
        return self._memory.get(key)

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        if self._use_redis and self._redis:
            serialized = json.dumps(value, default=str)
            await self._redis.setex(key, ttl, serialized)
        else:
            self._memory.set(key, value, ttl=ttl)

    async def delete(self, key: str) -> None:
        if self._use_redis and self._redis:
            await self._redis.delete(key)
        else:
            self._memory.delete(key)

    async def invalidate_pattern(self, pattern: str) -> None:
        if self._use_redis and self._redis:
            keys = []
            async for key in self._redis.scan_iter(match=pattern):
                keys.append(key)
            if keys:
                await self._redis.delete(*keys)
        else:
            self._memory.invalidate_pattern(pattern)

    async def close(self) -> None:
        if self._redis:
            await self._redis.close()


# Singleton
cache_manager = CacheManager()
