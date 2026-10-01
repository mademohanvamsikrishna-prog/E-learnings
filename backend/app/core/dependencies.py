from typing import AsyncGenerator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.database.database import async_session_factory

# ─── Bearer token extractor ──────────────────────────────────────────────────────
bearer_scheme = HTTPBearer()
optional_bearer_scheme = HTTPBearer(auto_error=False)


# ─── Database session ────────────────────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a database session per request, closing it when done."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ─── Authentication ──────────────────────────────────────────────────────────────
async def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Decode the JWT and return its payload. Raises 401 on invalid token."""
    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


async def get_ai_user_payload(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_bearer_scheme),
) -> dict:
    """
    Authenticate student for AI Tutor.
    Validates JWT when present. In development mode, allows guest/demo student
    fallback if unauthenticated so frontend exploration is seamless.
    """
    from app.core.config import get_settings
    settings = get_settings()

    if credentials and credentials.credentials:
        payload = decode_token(credentials.credentials)
        if payload and payload.get("type") == "access":
            return payload
        if settings.app_env != "development":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

    if settings.app_env == "development":
        return {
            "sub": "usr_student_01",
            "role": "STUDENT",
            "email": "alex.johnson@example.com",
            "name": "Alex Johnson",
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required to use AI Tutor",
        headers={"WWW-Authenticate": "Bearer"},
    )



# ─── Role guards ─────────────────────────────────────────────────────────────────
def require_roles(*roles: str):
    """
    Dependency factory that restricts access to users with one of the given roles.
    Usage:  Depends(require_roles("ADMIN", "INSTRUCTOR"))
    """

    async def _check_role(
        payload: dict = Depends(get_current_user_payload),
    ) -> dict:
        user_role: Optional[str] = payload.get("role")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted to: {', '.join(roles)}",
            )
        return payload

    return _check_role


# ─── Convenience role dependencies ───────────────────────────────────────────────
require_student = require_roles("STUDENT", "INSTRUCTOR", "ADMIN")
require_instructor = require_roles("INSTRUCTOR", "ADMIN")
require_admin = require_roles("ADMIN")
