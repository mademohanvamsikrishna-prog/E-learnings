import uuid

from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class Certificate(Base):
    """Completion certificate awarded to a student when they finish a course."""

    __tablename__ = "certificates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    certificate_number = Column(String(50), unique=True, nullable=False, index=True)
    file_url = Column(String(500), nullable=True)   # generated PDF stored in cloud
    # BUG-20 fix: missing timestamp — needed for sorting and PDF date
    issued_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)

    student = relationship("User", back_populates="certificates")
    course = relationship("Course", back_populates="certificates")

    def __repr__(self) -> str:
        return f"<Certificate #{self.certificate_number}>"
