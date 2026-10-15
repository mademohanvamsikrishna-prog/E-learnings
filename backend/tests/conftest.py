"""
Shared pytest configuration for all backend tests.

Creates a single in-memory SQLite test database, applies it to the app's
database module, and registers all table creation in a session-scoped fixture
so that every test module shares the same engine and sees the same tables.

This prevents the cross-module engine collision that occurs when two test
files both monkey-patch _db_module at import time with different engines.
"""

import pytest
import pytest_asyncio

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

# ─── Single shared engine for the entire test session ────────────────────────
import app.database.database as _db_module

_TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

_shared_engine = create_async_engine(
    _TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
_shared_session_factory = async_sessionmaker(
    bind=_shared_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Patch the app's database module ONCE at conftest import time
_db_module.engine = _shared_engine
_db_module.async_session_factory = _shared_session_factory

# Now import app components (after patching)
from app.main import app  # noqa: E402
from app.database.base import Base  # noqa: E402
from app.core.dependencies import get_db  # noqa: E402


# ─── Shared DB session override ───────────────────────────────────────────────

async def _override_get_db():
    async with _shared_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


app.dependency_overrides[get_db] = _override_get_db


# ─── Session-scoped table creation (runs once for the entire test session) ────

@pytest_asyncio.fixture(scope="session", autouse=True)
async def create_all_tables():
    """
    Create all ORM tables once at the start of the test session.
    All test modules share this engine, so tables exist for all of them.
    """
    # Import every model so SQLAlchemy metadata is fully populated
    import app.models.user       # noqa: F401
    import app.models.course     # noqa: F401
    import app.models.enrollment # noqa: F401
    import app.models.lesson     # noqa: F401
    import app.models.quiz       # noqa: F401
    import app.models.assignment # noqa: F401
    import app.models.progress   # noqa: F401
    import app.models.certificate  # noqa: F401

    async with _shared_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    async with _shared_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
