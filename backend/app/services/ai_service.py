import logging
from typing import Optional

from app.core.config import get_settings
from app.schemas.ai import (
    AITutorRequest,
    AITutorResponse,
    AIQuizGenerateRequest,
    AIExplainRequest,
    AIStudyPlanRequest,
    AIGenericResponse,
)

settings = get_settings()
logger = logging.getLogger(__name__)


class AIService:
    """
    Abstraction layer for all AI provider calls.
    Switch between Gemini and OpenAI by changing AI_PROVIDER in .env.
    Never expose API keys — they live in settings (from .env).
    """

    def __init__(self):
        self.provider = settings.ai_provider

    def _get_client(self):
        """Return the appropriate SDK client based on configured provider."""
        if self.provider == "gemini":
            import google.generativeai as genai
            genai.configure(api_key=settings.gemini_api_key)
            return genai.GenerativeModel("gemini-1.5-flash")
        elif self.provider == "openai":
            from openai import AsyncOpenAI
            return AsyncOpenAI(api_key=settings.openai_api_key)
        raise ValueError(f"Unknown AI provider: {self.provider}")

    async def ask_tutor(self, request: AITutorRequest) -> AITutorResponse:
        """Answer a student's question using the AI tutor."""
        prompt = (
            f"You are a helpful e-learning tutor. "
            f"Answer the following question clearly and concisely:\n\n{request.question}"
        )
        answer = await self._generate(prompt)
        return AITutorResponse(answer=answer, model_used=self.provider)

    async def generate_quiz(self, request: AIQuizGenerateRequest) -> AIGenericResponse:
        """Generate quiz questions on a given topic."""
        prompt = (
            f"Generate {request.num_questions} {request.question_type} questions "
            f"on the topic: '{request.topic}'. "
            f"Difficulty: {request.difficulty}. "
            f"Return as a JSON array with fields: text, options, correct_answer, explanation."
        )
        result = await self._generate(prompt)
        return AIGenericResponse(result=result, model_used=self.provider)

    async def explain_content(self, request: AIExplainRequest) -> AIGenericResponse:
        """Explain lesson content at the requested comprehension level."""
        prompt = (
            f"Explain the following content at a {request.target_level} level. "
            f"Be concise and use simple language where needed:\n\n{request.content}"
        )
        result = await self._generate(prompt)
        return AIGenericResponse(result=result, model_used=self.provider)

    async def create_study_plan(self, request: AIStudyPlanRequest) -> AIGenericResponse:
        """Build a personalised study plan for a student."""
        prompt = (
            f"Create a structured study plan for a student who has "
            f"{request.available_hours_per_week} hours per week available. "
            f"Course ID: {request.course_id}. "
            f"{'Target completion: ' + str(request.target_completion_weeks) + ' weeks.' if request.target_completion_weeks else ''}"
        )
        result = await self._generate(prompt)
        return AIGenericResponse(result=result, model_used=self.provider)

    async def _generate(self, prompt: str) -> str:
        """Internal dispatcher — calls the configured AI provider."""
        try:
            if self.provider == "gemini":
                import google.generativeai as genai
                genai.configure(api_key=settings.gemini_api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                return response.text

            elif self.provider == "openai":
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=settings.openai_api_key)
                response = await client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                )
                return response.choices[0].message.content or ""

        except Exception as exc:
            logger.error(f"AI generation failed: {exc}")
            raise RuntimeError(f"AI service unavailable: {exc}") from exc

        raise ValueError(f"Unsupported AI provider: {self.provider}")
