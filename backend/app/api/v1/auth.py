"""
Auth endpoints: login, register, refresh, forgot-password, me.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db_session
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserPublic,
)
from app.services.auth import AuthService

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, session: AsyncSession = Depends(get_db_session)):
    """Authenticate user and return JWT tokens."""
    svc = AuthService(session)
    try:
        return await svc.login(body.email, body.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))


@router.get("/bootstrap-status")
async def bootstrap_status(session: AsyncSession = Depends(get_db_session)):
    """Whether the one-time admin signup is still available (no admin exists yet)."""
    svc = AuthService(session)
    return {"needs_setup": await svc.bootstrap_needed()}


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, session: AsyncSession = Depends(get_db_session)):
    """Create the site's one-time bootstrap admin account.

    Only succeeds while no admin/super_admin account exists yet. Once that
    account is created, this endpoint always refuses — the site has exactly
    one admin, created once, authenticated via /login thereafter.
    """
    svc = AuthService(session)
    try:
        user = await svc.register(body.email, body.name, body.password)
        return UserPublic.model_validate(user)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc))


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest, session: AsyncSession = Depends(get_db_session)):
    """Exchange a refresh token for a new access/refresh pair."""
    svc = AuthService(session)
    try:
        return await svc.refresh_tokens(body.refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest):
    """Request a password reset link (placeholder — sends email in production)."""
    # In production, generate a reset token and send via email
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest):
    """Reset password using a valid reset token (placeholder)."""
    # In production, validate the reset token and update the password
    return {"message": "Password has been reset"}


@router.get("/me", response_model=UserPublic)
async def get_me(user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return UserPublic.model_validate(user)
