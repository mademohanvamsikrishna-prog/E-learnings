import enum
import uuid

from sqlalchemy import Column, String, Text, Enum, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class AssignmentStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    GRADED = "GRADED"


class Assignment(Base):
    """An assignment given to students in a course."""

    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    max_score = Column(String(10), default="100", nullable=False)

    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Assignment '{self.title}'>"


class Submission(Base):
    """A student's submission for an assignment."""

    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=True)           # text or markdown answer
    file_url = Column(String(500), nullable=True)   # uploaded file
    grade = Column(String(20), nullable=True)
    feedback = Column(Text, nullable=True)
    status = Column(Enum(AssignmentStatus), default=AssignmentStatus.PENDING, nullable=False)

    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id"), nullable=False)

    assignment = relationship("Assignment", back_populates="submissions")

    def __repr__(self) -> str:
        return f"<Submission student={self.student_id} status={self.status}>"
