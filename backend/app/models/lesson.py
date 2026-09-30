import enum
import uuid

from sqlalchemy import Column, String, Text, Boolean, Enum, ForeignKey, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class LessonType(str, enum.Enum):
    VIDEO = "VIDEO"
    PDF = "PDF"
    TEXT = "TEXT"
    QUIZ = "QUIZ"
    ASSIGNMENT = "ASSIGNMENT"


class Lesson(Base):
    """A single learning unit inside a module."""

    __tablename__ = "lessons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    content_type = Column(Enum(LessonType), default=LessonType.VIDEO, nullable=False)
    content_url = Column(String(500), nullable=True)   # video / PDF URL
    text_content = Column(Text, nullable=True)          # for TEXT type lessons
    duration_seconds = Column(Integer, nullable=True)
    order = Column(Integer, default=0, nullable=False)
    is_free_preview = Column(Boolean, default=False, nullable=False)

    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"), nullable=False)
    module = relationship("Module", back_populates="lessons")
    progress_records = relationship("Progress", back_populates="lesson")

    def __repr__(self) -> str:
        return f"<Lesson '{self.title}' [{self.content_type}]>"
