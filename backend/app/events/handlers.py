"""
Domain event handlers.
Simple in-process event bus for side-effects (notifications, cache invalidation, etc.).
"""

from __future__ import annotations

import asyncio
from collections import defaultdict
from typing import Any, Callable, Coroutine, Dict, List

from app.core.logging import logger


# ── Event bus ─────────────────────────────────────────────────────
_handlers: Dict[str, List[Callable[..., Coroutine]]] = defaultdict(list)


def subscribe(event_type: str, handler: Callable[..., Coroutine]) -> None:
    """Register an async handler for an event type."""
    _handlers[event_type].append(handler)


async def emit(event_type: str, payload: Any = None) -> None:
    """Fire all handlers registered for an event type."""
    for handler in _handlers.get(event_type, []):
        try:
            await handler(payload)
        except Exception as exc:
            logger.error(
                "Event handler error",
                extra={"structured": {"event": event_type, "error": str(exc)}},
            )


# ── Built-in handlers ─────────────────────────────────────────────
async def _on_enquiry_created(payload: Any) -> None:
    """Side-effect when a new enquiry is created (e.g., send notification)."""
    logger.info("New enquiry event", extra={"structured": {"payload": str(payload)}})


async def _on_page_published(payload: Any) -> None:
    """Side-effect when a page is published (e.g., invalidate cache)."""
    logger.info("Page published event", extra={"structured": {"payload": str(payload)}})


# Register built-in handlers
subscribe("enquiry.created", _on_enquiry_created)
subscribe("page.published", _on_page_published)
