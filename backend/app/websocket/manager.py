"""
WebSocket connection manager.
"""

from __future__ import annotations

from typing import Dict, List

from fastapi import WebSocket

from app.core.logging import logger


class WebSocketManager:
    """Manages active WebSocket connections."""

    def __init__(self) -> None:
        self._connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        """Accept a WebSocket connection and register it."""
        await websocket.accept()
        self._connections[user_id] = websocket
        logger.info("WebSocket connected", extra={"structured": {"user_id": user_id}})

    def disconnect(self, user_id: str) -> None:
        """Remove a WebSocket connection."""
        self._connections.pop(user_id, None)
        logger.info("WebSocket disconnected", extra={"structured": {"user_id": user_id}})

    async def send_to_user(self, user_id: str, message: dict) -> None:
        """Send a JSON message to a specific user."""
        ws = self._connections.get(user_id)
        if ws:
            try:
                await ws.send_json(message)
            except Exception as exc:
                logger.warning(
                    "WebSocket send failed",
                    extra={"structured": {"user_id": user_id, "error": str(exc)}},
                )
                self._connections.pop(user_id, None)

    async def broadcast(self, message: dict) -> None:
        """Send a JSON message to all connected users."""
        disconnected: List[str] = []
        for user_id, ws in self._connections.items():
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(user_id)
        for uid in disconnected:
            self._connections.pop(uid, None)

    @property
    def active_connections(self) -> int:
        return len(self._connections)


# Singleton
ws_manager = WebSocketManager()
