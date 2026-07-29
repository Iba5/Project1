"""
Rate limiting middleware.
In-memory sliding window per IP. Uses Redis if available via cache_manager.
"""

from __future__ import annotations

import time
from collections import defaultdict, deque
from threading import Lock

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.config import settings
from app.core.logging import logger


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Sliding window rate limiter.
    Allows settings.RATE_LIMIT_REQUESTS requests per settings.RATE_LIMIT_WINDOW_SECONDS per IP.
    Exempts /health endpoints from limiting.
    """

    # Class-level shared state (in-memory, per-process)
    _windows: dict[str, deque[float]] = defaultdict(deque)
    _lock: Lock = Lock()

    # Paths that bypass rate limiting
    _EXEMPT_PREFIXES = ("/health", "/docs", "/redoc", "/openapi")

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = request.url.path

        # Skip exempt paths
        if any(path.startswith(p) for p in self._EXEMPT_PREFIXES):
            return await call_next(request)

        client_ip = (request.client.host if request.client else "unknown")
        now = time.time()
        window = settings.RATE_LIMIT_WINDOW_SECONDS
        limit = settings.RATE_LIMIT_REQUESTS

        with self._lock:
            timestamps = self._windows[client_ip]
            # Purge timestamps outside the window
            while timestamps and timestamps[0] < now - window:
                timestamps.popleft()

            if len(timestamps) >= limit:
                retry_after = int(window - (now - timestamps[0])) + 1
                logger.warning(
                    "Rate limit exceeded",
                    extra={"structured": {"client_ip": client_ip, "path": path}},
                )
                return JSONResponse(
                    status_code=429,
                    content={
                        "type": "rate-limit",
                        "title": "Too Many Requests",
                        "status": 429,
                        "detail": f"Rate limit exceeded. Try again in {retry_after}s.",
                    },
                    headers={"Retry-After": str(retry_after)},
                )

            timestamps.append(now)

        response = await call_next(request)
        # Expose rate limit headers
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Window"] = str(window)
        return response
