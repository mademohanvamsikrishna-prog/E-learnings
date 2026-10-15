import uuid

from sqlalchemy import Column, Boolean, ForeignKey, Integer, UniqueConstraint
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

    # BUG-18 fix: add back-populates for bidirectional ORM access
    lesson = relationship("Lesson", back_populates="progress_records")
    student = relationship("User", back_populates="progress_records")

    # BUG-17 fix: prevent duplicate progress records for the same student/lesson
    __table_args__ = (
        UniqueConstraint(
            "student_id", "lesson_id", "enrollment_id",
            name="uq_progress_student_lesson_enrollment",
        ),
    )

    def __repr__(self) -> str:
        return f"<Progress lesson={self.lesson_id} completed={self.is_completed}>"
