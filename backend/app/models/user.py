import enum
import uuid

from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    INSTRUCTOR = "INSTRUCTOR"
    ADMIN = "ADMIN"


class User(Base):
    """Platform user — can be a student, instructor, or admin."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(String(1000), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    # ─── Relationships ────────────────────────────────────────────────────────────
    enrollments = relationship("Enrollment", back_populates="student", lazy="noload")
    courses = relationship("Course", back_populates="instructor", lazy="noload")
    quiz_attempts = relationship("QuizAttempt", back_populates="student", lazy="noload")
    certificates = relationship("Certificate", back_populates="student", lazy="noload")

    def __repr__(self) -> str:
        return f"<User {self.username} ({self.role})>"
