"""
Auth service: login, register, token refresh, password management.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.auth import LoginResponse, UserPublic


class AuthService:
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)
        self.session = session

    async def login(self, email: str, password: str) -> LoginResponse:
        user = await self.repo.get_active_by_email(email)
        if not user:
            logger.warning("Login failed: user not found", extra={"structured": {"email": email}})
            raise ValueError("Invalid email or password")

        # Check account lock
        if user.locked_until and user.locked_until > datetime.now(timezone.utc):
            logger.warning("Login failed: account locked", extra={"structured": {"email": email}})
            raise ValueError("Account is locked. Try again later.")

        if not verify_password(password, user.password_hash):
            # Increment failed attempts
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
                from datetime import timedelta
                user.locked_until = datetime.now(timezone.utc) + timedelta(
                    minutes=settings.ACCOUNT_LOCK_MINUTES
                )
                logger.warning("Account locked due to failed attempts", extra={"structured": {"email": email}})
            await self.session.flush()
            raise ValueError("Invalid email or password")

        # Reset failed attempts on successful login
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login_at = datetime.now(timezone.utc)
        await self.session.flush()

        access_token = create_access_token(user.id, extra={"role": user.role})
        refresh_token = create_refresh_token(user.id)

        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserPublic.model_validate(user),
        )

    async def register(self, email: str, name: str, password: str, role: str = "viewer") -> User:
        existing = await self.repo.get_by_email(email)
        if existing:
            raise ValueError("Email already registered")

        user = await self.repo.create({
            "email": email,
            "name": name,
            "password_hash": hash_password(password),
            "role": role,
            "is_active": True,
            "is_verified": False,
        })
        logger.info("User registered", extra={"structured": {"email": email}})
        return user

    async def refresh_tokens(self, refresh_token: str) -> dict:
        try:
            payload = decode_token(refresh_token)
        except Exception:
            raise ValueError("Invalid or expired refresh token")

        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")

        user_id = payload.get("sub")
        user = await self.repo.get_by_id(user_id)
        if not user or not user.is_active:
            raise ValueError("User not found or inactive")

        new_access = create_access_token(user.id, extra={"role": user.role})
        new_refresh = create_refresh_token(user.id)
        return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}

    async def get_current_user(self, token: str) -> User:
        try:
            payload = decode_token(token)
        except Exception:
            raise ValueError("Invalid or expired token")

        if payload.get("type") != "access":
            raise ValueError("Invalid token type")

        user_id = payload.get("sub")
        user = await self.repo.get_by_id(user_id)
        if not user or not user.is_active:
            raise ValueError("User not found or inactive")
        return user
