from typing import Optional, List, Literal
from pydantic import BaseModel, Field


class ChatMessageItem(BaseModel):
    """A single turn in the chat history."""
    role: Literal["user", "assistant", "system"]
    content: str


class AIChatRequest(BaseModel):
    """
    Incoming chat request for AI Tutor.
    Supports 'message' (per specification) and 'question' (for backward compatibility).
    """
    message: Optional[str] = None
    question: Optional[str] = None
    history: Optional[List[ChatMessageItem]] = Field(default_factory=list)
    course_id: Optional[str] = None
    course_title: Optional[str] = None
    lesson_id: Optional[str] = None
    lesson_title: Optional[str] = None
    topic: Optional[str] = None

    def get_query(self) -> str:
        """Extract and clean query from message or question."""
        text = self.message if self.message is not None else self.question
        return (text or "").strip()


class AIChatResponse(BaseModel):
    """Standardized response from AI Tutor."""
    success: bool = True
    answer: Optional[str] = None
    message: Optional[str] = None
    model_used: Optional[str] = None


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
