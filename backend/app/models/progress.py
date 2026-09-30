import uuid

from sqlalchemy import Column, Boolean, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class Progress(Base):
    """Tracks whether a student has completed a specific lesson."""

    __tablename__ = "progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    is_completed = Column(Boolean, default=False, nullable=False)
    watch_duration_seconds = Column(Integer, default=0, nullable=False)  # for video lessons

    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=False)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id"), nullable=False)

    lesson = relationship("Lesson", back_populates="progress_records")

    def __repr__(self) -> str:
        return f"<Progress lesson={self.lesson_id} completed={self.is_completed}>"
