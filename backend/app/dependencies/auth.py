"""
Auth dependency: get_current_user, require_permission.

Uses the permission-based RBAC system from app.permissions.rbac.
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_token
from app.dependencies.database import get_db_session
from app.models.user import User
from app.permissions.rbac import Permission, has_permission
from app.repositories.user import UserRepository

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    session=Depends(get_db_session),
) -> User:
    """Extract and validate JWT from the Authorization header."""
    token = credentials.credentials
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    user_id = payload.get("sub")
    repo = UserRepository(session)
    user = await repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


def require_permission(permission: str):
    """
    Dependency factory that checks the user's role has a specific
    permission using the RBAC permission map.

    Usage:
        @router.post("/items", dependencies=[Depends(require_permission(Permission.CATALOGUE_WRITE))])
        async def create_item(...):
    """

    async def _check(user: User = Depends(get_current_user)) -> User:
        if not has_permission(user.role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {permission}",
            )
        return user

    return _check


# ── Convenience shortcuts (backward-compatible) ──────────────────
# These check that the user's role has at least one write permission
# in the relevant domain, which maps cleanly to the old "admin" check.
require_admin = require_permission(Permission.CATALOGUE_DELETE)
require_editor = require_permission(Permission.CATALOGUE_WRITE)
