from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate


class AuthService:

    @staticmethod
    async def register(db: AsyncSession, data: UserCreate) -> User:
        """Create a new user after checking for duplicate email/username."""
        # Check for duplicate email
        result = await db.execute(select(User).where(User.email == data.email))
        if result.scalar_one_or_none():
            raise ValueError("A user with this email already exists.")

        # Check for duplicate username
        result = await db.execute(select(User).where(User.username == data.username))
        if result.scalar_one_or_none():
            raise ValueError("This username is already taken.")

        # BUG-01 fix: role is ALWAYS STUDENT for public registration.
        # Elevated roles (INSTRUCTOR, ADMIN) must be assigned by an admin via a
        # separate privileged endpoint — never accepted from the client payload.
        role_enum = UserRole.STUDENT

        user = User(
            email=data.email,
            username=data.username,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
            role=role_enum,
        )
        db.add(user)
        await db.flush()  # get the id before commit
        return user

    @staticmethod
    async def login(db: AsyncSession, data: LoginRequest) -> TokenResponse:
        """Validate credentials and return JWT tokens."""
        result = await db.execute(select(User).where(User.email == data.email))
        user: Optional[User] = result.scalar_one_or_none()

        if not user or not verify_password(data.password, user.hashed_password):
            raise ValueError("Invalid email or password.")

        if not user.is_active:
            raise ValueError("Your account has been deactivated.")

        token_data = {"sub": str(user.id), "role": user.role, "email": user.email}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )
