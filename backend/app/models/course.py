import enum
import uuid

from sqlalchemy import Column, String, Text, Boolean, Enum, ForeignKey, Numeric, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class CourseLevel(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class CourseStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class Course(Base):
    """A course created by an instructor."""

    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(300), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    preview_video_url = Column(String(500), nullable=True)
    price = Column(Numeric(10, 2), default=0.00, nullable=False)
    level = Column(Enum(CourseLevel), default=CourseLevel.BEGINNER, nullable=False)
    status = Column(Enum(CourseStatus), default=CourseStatus.DRAFT, nullable=False)
    is_free = Column(Boolean, default=False, nullable=False)
    language = Column(String(10), default="en", nullable=False)
    duration_hours = Column(Numeric(6, 2), nullable=True)

    # ─── Foreign keys ────────────────────────────────────────────────────────────
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categorys.id"), nullable=True)

    # ─── Relationships ────────────────────────────────────────────────────────────
    instructor = relationship("User", back_populates="courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan", order_by="Module.order")
    enrollments = relationship("Enrollment", back_populates="course")
    certificates = relationship("Certificate", back_populates="course")

    def __repr__(self) -> str:
        return f"<Course '{self.title}' [{self.status}]>"


class Category(Base):
    """Course category / subject area."""

    __tablename__ = "categorys"  # auto-named by Base; kept as is for consistency

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    icon_url = Column(String(500), nullable=True)

    courses = relationship("Course", backref="category")

    def __repr__(self) -> str:
        return f"<Category '{self.name}'>"


class Module(Base):
    """A course is divided into ordered modules."""

    __tablename__ = "modules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0, nullable=False)

    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan", order_by="Lesson.order")

    def __repr__(self) -> str:
        return f"<Module '{self.title}' order={self.order}>"
