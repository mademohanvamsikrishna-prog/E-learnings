import uuid
from typing import Optional, List
from pydantic import BaseModel


class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    time_limit_minutes: Optional[int] = None
    passing_score: float = 70.0
    max_attempts: int = 3
    shuffle_questions: bool = False
    course_id: uuid.UUID
    lesson_id: Optional[uuid.UUID] = None


class QuestionCreate(BaseModel):
    text: str
    question_type: str = "MULTIPLE_CHOICE"
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    points: int = 1
    order: int = 0


class QuizAttemptCreate(BaseModel):
    quiz_id: uuid.UUID
    answers: dict   # {question_id: answer}


class QuizResponse(BaseModel):
    id: uuid.UUID
    title: str
    passing_score: float
    max_attempts: int
    time_limit_minutes: Optional[int] = None

    model_config = {"from_attributes": True}
