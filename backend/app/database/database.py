"""
Database configuration and async engine setup for Supabase PostgreSQL.
Supports direct connection, transaction pooler, and session pooler (PgBouncer/Supavisor).
"""

from typing import Any, Dict
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.core.config import get_settings

settings = get_settings()

# ─── Connection arguments ───────────────────────────────────────────────────────
# Supabase requires SSL encryption for all remote connections.
# When connecting via asyncpg, SSL mode is passed through connect_args['ssl'].
# For local PostgreSQL development without SSL, set DB_SSL_MODE=disable in .env.
_connect_args: Dict[str, Any] = {}

if settings.db_ssl_mode and settings.db_ssl_mode.lower() != "disable":
    _connect_args["ssl"] = settings.db_ssl_mode  # 'require' | 'prefer' | 'verify-full'

# Supabase Transaction Pooler (port 6543) does not support prepared statements.
# Setting statement_cache_size=0 disables asyncpg's prepared statement cache.
if settings.db_statement_cache_size is not None:
    _connect_args["statement_cache_size"] = settings.db_statement_cache_size

# ─── Async engine ────────────────────────────────────────────────────────────────
# Use configured DATABASE_URL or safe placeholder for initialization
_db_url = settings.database_url or "postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

_engine_kwargs: Dict[str, Any] = {
    "echo": settings.database_echo,
    "pool_pre_ping": True,  # Validates connection liveness before each checkout over the network
    "connect_args": _connect_args,
}

if settings.db_pool_size == 0:
    # Serverless deployment / external pooler managed (e.g. AWS Lambda, Vercel)
    _engine_kwargs["poolclass"] = NullPool
else:
    # Standard connection pool for local dev or containerized deployment
    _engine_kwargs["pool_size"] = settings.db_pool_size
    _engine_kwargs["max_overflow"] = settings.db_max_overflow
    _engine_kwargs["pool_timeout"] = settings.db_pool_timeout
    _engine_kwargs["pool_recycle"] = settings.db_pool_recycle

engine = create_async_engine(_db_url, **_engine_kwargs)

# ─── Session factory ─────────────────────────────────────────────────────────────
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Keep objects usable after commit
)


# ─── Schema / Tables Initialization Helper ──────────────────────────────────────
async def init_db() -> None:
    """
    Create all tables in Supabase PostgreSQL based on defined SQLAlchemy models.
    Can be run via: python -m app.database.database
    """
    from app.database.base import Base

    # Import models so Base.metadata is fully populated with all tables
    import app.models.user  # noqa: F401
    import app.models.course  # noqa: F401
    import app.models.lesson  # noqa: F401
    import app.models.quiz  # noqa: F401
    import app.models.assignment  # noqa: F401
    import app.models.progress  # noqa: F401
    import app.models.enrollment  # noqa: F401
    import app.models.certificate  # noqa: F401

    print("Connecting to Supabase PostgreSQL and creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables initialized successfully.")


if __name__ == "__main__":
    import asyncio

    asyncio.run(init_db())
