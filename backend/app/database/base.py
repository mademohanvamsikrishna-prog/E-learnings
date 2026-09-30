from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy import Column, DateTime, func


class Base(DeclarativeBase):
    """
    Shared declarative base for all SQLAlchemy models.
    All models inherit from this to get automatic timestamps.
    """

    # Derive __tablename__ automatically from class name (lowercase)
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + "s"

    # Audit timestamps applied to every table
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
