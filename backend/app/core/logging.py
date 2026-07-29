"""
Structured JSON logging setup with request-ID correlation.
"""

from __future__ import annotations

import json
import logging
import sys
import uuid
from datetime import datetime, timezone
from typing import Any, Dict


class _JsonFormatter(logging.Formatter):
    """Emit every log record as a single JSON line."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        # Merge structured fields if the caller passed `extra={...}`
        if hasattr(record, "structured"):
            log_entry.update(record.structured)  # type: ignore[attr-defined]
        if record.exc_info and record.exc_info[1] is not None:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry, default=str)


def setup_logging(level: str = "INFO") -> logging.Logger:
    """Configure the root logger for JSON output."""
    logger = logging.getLogger("canbri")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(_JsonFormatter())
        logger.addHandler(handler)
    # Prevent propagation to root to avoid duplicate lines
    logger.propagate = False
    return logger


def new_request_id() -> str:
    """Generate a new request correlation ID."""
    return str(uuid.uuid4())


# Module-level logger
logger = setup_logging()
