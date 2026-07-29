"""
Security utilities: password hashing, JWT creation / validation.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ── Password hashing ─────────────────────────────────────────────
_pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return _pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plaintext password against a hash."""
    return _pwd_context.verify(plain, hashed)


# ── JWT helpers ───────────────────────────────────────────────────
def _build_token(
    data: Dict[str, Any],
    expires_delta: timedelta,
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_access_token(subject: str, extra: Optional[Dict[str, Any]] = None) -> str:
    """Create a short-lived access token."""
    data: Dict[str, Any] = {"sub": subject, "type": "access"}
    if extra:
        data.update(extra)
    delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return _build_token(data, delta)


def create_refresh_token(subject: str) -> str:
    """Create a long-lived refresh token."""
    data: Dict[str, Any] = {"sub": subject, "type": "refresh"}
    delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    return _build_token(data, delta)


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT.
    Raises JWTError on invalid / expired tokens.
    """
    payload: Dict[str, Any] = jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )
    return payload
