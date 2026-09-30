import enum
import uuid

from sqlalchemy import Column, String, Text, Boolean, Enum, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class QuestionType(str, enum.Enum):
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    TRUE_FALSE = "TRUE_FALSE"
    SHORT_ANSWER = "SHORT_ANSWER"


class Quiz(Base):
    """A quiz associated with a lesson or module."""

    __tablename__ = "quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    time_limit_minutes = Column(Integer, nullable=True)   # None = no limit
    passing_score = Column(Float, default=70.0, nullable=False)
    max_attempts = Column(Integer, default=3, nullable=False)
    shuffle_questions = Column(Boolean, default=False, nullable=False)

    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)

    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz")

    def __repr__(self) -> str:
        return f"<Quiz '{self.title}'>"


class Question(Base):
    """A question inside a quiz."""

    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(Text, nullable=False)
    question_type = Column(Enum(QuestionType), default=QuestionType.MULTIPLE_CHOICE, nullable=False)
    options = Column(Text, nullable=True)           # JSON string: ["A", "B", "C", "D"]
    correct_answer = Column(Text, nullable=False)   # JSON string for multi-select
    explanation = Column(Text, nullable=True)
    points = Column(Integer, default=1, nullable=False)
    order = Column(Integer, default=0, nullable=False)

    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)
    quiz = relationship("Quiz", back_populates="questions")

    def __repr__(self) -> str:
        return f"<Question [{self.question_type}] quiz={self.quiz_id}>"


class QuizAttempt(Base):
    """Records one attempt by a student on a quiz."""

    __tablename__ = "quizattempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    score = Column(Float, nullable=True)
    passed = Column(Boolean, nullable=True)
    answers = Column(Text, nullable=True)           # JSON: {question_id: answer}
    time_taken_seconds = Column(Integer, nullable=True)

    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)

    student = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

    def __repr__(self) -> str:
        return f"<QuizAttempt score={self.score} passed={self.passed}>"
