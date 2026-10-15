"""
AI request and response schemas.
All validation is strict — the AI layer must not receive or return raw unvalidated data.
"""
from typing import Optional, List, Literal
from pydantic import BaseModel, Field, field_validator, model_validator


# ─── Shared ───────────────────────────────────────────────────────────────────────

class ChatMessageItem(BaseModel):
    """A single turn in the chat history."""
    role: Literal["user", "assistant", "system"]
    content: str = Field(..., max_length=8000)


# ─── AI Chat ─────────────────────────────────────────────────────────────────────

class AIChatRequest(BaseModel):
    """
    Incoming chat request for AI Tutor.
    Supports 'message' (per specification) and 'question' (for backward compatibility).
    Course context is accepted as titles (resolved server-side) or passed as-is for
    display context — UUIDs should never be passed as 'course_title'.
    """
    message: Optional[str] = Field(None, max_length=4000)
    question: Optional[str] = Field(None, max_length=4000)
    history: Optional[List[ChatMessageItem]] = Field(default_factory=list, max_length=20)
    course_id: Optional[str] = Field(None, max_length=100)
    course_title: Optional[str] = Field(None, max_length=255)
    lesson_id: Optional[str] = Field(None, max_length=100)
    lesson_title: Optional[str] = Field(None, max_length=255)
    topic: Optional[str] = Field(None, max_length=200)

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


# ─── AI Tutor (simple endpoint) ──────────────────────────────────────────────────

class AITutorRequest(BaseModel):
    """Ask the AI tutor a question, optionally in the context of a lesson."""
    question: str = Field(..., min_length=1, max_length=4000)
    lesson_id: Optional[str] = Field(None, max_length=100)
    course_id: Optional[str] = Field(None, max_length=100)


class AITutorResponse(BaseModel):
    answer: str
    model_used: str


# ─── AI Quiz Generator ────────────────────────────────────────────────────────────

class AIQuizOption(BaseModel):
    """One answer choice for a multiple-choice question."""
    key: str = Field(..., description="Option key, e.g. 'A'")
    text: str = Field(..., max_length=500)


class AIQuizQuestion(BaseModel):
    """A single validated quiz question returned by the AI."""
    text: str = Field(..., min_length=5, max_length=1000)
    question_type: Literal["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"] = "MULTIPLE_CHOICE"
    options: Optional[List[AIQuizOption]] = None
    correct_answer: str = Field(..., max_length=500)
    explanation: Optional[str] = Field(None, max_length=1000)

    @field_validator("correct_answer")
    @classmethod
    def correct_answer_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("correct_answer must not be empty")
        return v


class AIQuizGenerateRequest(BaseModel):
    """Ask the AI to generate quiz questions from course content."""
    topic: str = Field(..., min_length=3, max_length=500)
    num_questions: int = Field(5, ge=1, le=20)
    difficulty: Literal["EASY", "INTERMEDIATE", "HARD"] = "INTERMEDIATE"
    question_type: Literal["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"] = "MULTIPLE_CHOICE"
    course_id: Optional[str] = Field(None, max_length=100)


class AIQuizGenerateResponse(BaseModel):
    """Validated quiz generation response — structured, not a raw string."""
    questions: List[AIQuizQuestion]
    topic: str
    difficulty: str
    model_used: str
    total_questions: int


# ─── AI Lesson Explainer ──────────────────────────────────────────────────────────

class AIExplainRequest(BaseModel):
    """
    Request an AI explanation of a lesson or raw text content.

    BUG-11 fix: `content` is now optional when `lesson_id` is provided —
    the server fetches lesson text from the database in that case.
    A validator enforces that at least one of the two must be present.
    """
    content: Optional[str] = Field(
        None, min_length=10, max_length=12000,
        description="Lesson text content to explain (required when lesson_id is absent)"
    )
    target_level: Literal["BEGINNER", "INTERMEDIATE", "ADVANCED"] = "BEGINNER"
    lesson_id: Optional[str] = Field(None, max_length=100,
                                     description="Optional lesson ID for server-side DB lookup")

    @model_validator(mode="after")
    def content_or_lesson_id_required(self) -> "AIExplainRequest":
        if not self.lesson_id and not self.content:
            raise ValueError(
                "Either 'content' or 'lesson_id' must be provided. "
                "Supply 'content' directly, or provide 'lesson_id' and let the server fetch it."
            )
        return self


class AIExplainResponse(BaseModel):
    """Explanation response."""
    explanation: str
    target_level: str
    model_used: str
    # True if explanation was generated from server-fetched lesson content
    used_db_content: bool = False


# ─── Personalised Study Planner ───────────────────────────────────────────────────

class AIStudyPlanRequest(BaseModel):
    """Generate a personalised study plan."""
    course_id: str = Field(..., max_length=100)
    available_hours_per_week: int = Field(5, ge=1, le=80)
    target_completion_weeks: Optional[int] = Field(None, ge=1, le=52)
    goals: Optional[str] = Field(None, max_length=500)


class AIStudyPlanResponse(BaseModel):
    """Structured study plan response."""
    plan: str
    course_id: str
    hours_per_week: int
    target_weeks: Optional[int]
    model_used: str


# ─── Generic (legacy, kept for backward compat) ───────────────────────────────────

class AIGenericResponse(BaseModel):
    result: str
    model_used: str
    tokens_used: Optional[int] = None
