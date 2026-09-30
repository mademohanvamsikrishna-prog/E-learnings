from typing import Optional
from pydantic import BaseModel


class AITutorRequest(BaseModel):
    """Ask the AI tutor a question, optionally in the context of a lesson."""
    question: str
    lesson_id: Optional[str] = None
    course_id: Optional[str] = None


class AITutorResponse(BaseModel):
    answer: str
    model_used: str


class AIQuizGenerateRequest(BaseModel):
    """Ask the AI to generate quiz questions from course content."""
    topic: str
    num_questions: int = 5
    difficulty: str = "INTERMEDIATE"   # EASY | INTERMEDIATE | HARD
    question_type: str = "MULTIPLE_CHOICE"


class AIExplainRequest(BaseModel):
    """Request an AI explanation of a lesson or PDF."""
    content: str                    # raw text or lesson transcript
    target_level: str = "BEGINNER"  # simplify or elaborate accordingly


class AIStudyPlanRequest(BaseModel):
    """Generate a personalised study plan."""
    course_id: str
    available_hours_per_week: int = 5
    target_completion_weeks: Optional[int] = None


class AIGenericResponse(BaseModel):
    result: str
    model_used: str
    tokens_used: Optional[int] = None
