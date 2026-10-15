"""
AI Feature Tests
─────────────────────────────────────────────────────────────────────────────
Tests for AI Tutor, Quiz Generator, Lesson Explainer, and Study Planner.

Design rules:
- All external AI provider calls are mocked — no real API calls, no API key needed.
- Uses an in-memory SQLite database (same pattern as test_auth.py).
- Never prints or logs API keys, production credentials, or student PII.
- Tests cover: provider config errors, successful generation, invalid/malformed
  AI output, quiz validation, lesson access control, study plan data isolation.

Run: python -m pytest tests/test_ai_features.py -v
"""

import json
import uuid
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from httpx import AsyncClient, ASGITransport

# conftest.py patches the DB engine and registers the get_db override.
# Import app components after conftest has already patched the engine.
from app.main import app
from app.core.security import create_access_token


# ─── Fixtures ────────────────────────────────────────────────────────────────

@pytest.fixture
async def client():

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as c:
        yield c


def _make_token(user_id: str = None, role: str = "STUDENT") -> str:
    """Create a valid JWT for testing. Never uses real credentials."""
    uid = user_id or str(uuid.uuid4())
    return create_access_token({"sub": uid, "role": role, "email": f"test_{uid[:8]}@test.example"})


# ─── Shared mock helper ───────────────────────────────────────────────────────

def _mock_openai_chat(content: str = "Mocked AI response."):
    """Return an AsyncMock that simulates a successful OpenAI chat.completions.create call."""
    mock_choice = MagicMock()
    mock_choice.message.content = content
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]
    return mock_completion


# ═══════════════════════════════════════════════════════════════════════════════
# 1. AI Chat Endpoint (/ai/chat)
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.mark.asyncio
async def test_chat_returns_answer_when_ai_succeeds(client):
    """AI chat returns answer on successful OpenAI call."""
    mock_completion = _mock_openai_chat("Python is a high-level language.")

    with patch(
        "app.services.openai_service.OpenAIService._simple_generate",
        new_callable=AsyncMock,
    ) as mock_gen, patch(
        "app.services.openai_service.OpenAIService.generate_tutor_response",
        new_callable=AsyncMock,
        return_value={"answer": "Python is a high-level language.", "model": "gpt-4o-mini"},
    ):
        token = _make_token()
        res = await client.post(
            "/api/v1/ai/chat",
            json={"message": "What is Python?"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Python" in data["answer"]
    assert data["model_used"] == "gpt-4o-mini"


@pytest.mark.asyncio
async def test_chat_rejects_empty_message(client):
    """AI chat rejects empty messages with 400."""
    token = _make_token()
    res = await client.post(
        "/api/v1/ai/chat",
        json={"message": "   "},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 400
    assert res.json()["message"] == "Question cannot be empty"


@pytest.mark.asyncio
async def test_chat_rejects_message_exceeding_max_length(client):
    """AI chat rejects messages longer than 4000 characters."""
    token = _make_token()
    res = await client.post(
        "/api/v1/ai/chat",
        json={"message": "x" * 4001},
        headers={"Authorization": f"Bearer {token}"},
    )
    # Pydantic validates max_length=4000 → 422 Unprocessable Entity
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_chat_returns_503_when_config_missing(client):
    """AI chat returns 503 when OpenAI API key is not configured."""
    from app.services.openai_service import OpenAIConfigError

    with patch(
        "app.services.openai_service.OpenAIService.generate_tutor_response",
        new_callable=AsyncMock,
        side_effect=OpenAIConfigError(),
    ):
        token = _make_token()
        res = await client.post(
            "/api/v1/ai/chat",
            json={"message": "What is a class?"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 503
    assert res.json()["success"] is False


@pytest.mark.asyncio
async def test_chat_returns_429_on_rate_limit(client):
    """AI chat returns 429 when rate limited."""
    from app.services.openai_service import OpenAIRateLimitError

    with patch(
        "app.services.openai_service.OpenAIService.generate_tutor_response",
        new_callable=AsyncMock,
        side_effect=OpenAIRateLimitError(),
    ):
        token = _make_token()
        res = await client.post(
            "/api/v1/ai/chat",
            json={"message": "Explain inheritance"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 429
    assert res.json()["success"] is False


# ═══════════════════════════════════════════════════════════════════════════════
# 2. Quiz Generator (/ai/generate-quiz)
# ═══════════════════════════════════════════════════════════════════════════════

_VALID_QUIZ_JSON = json.dumps([
    {
        "text": "What does OOP stand for?",
        "question_type": "MULTIPLE_CHOICE",
        "options": [
            {"key": "A", "text": "Object Oriented Programming"},
            {"key": "B", "text": "Open Output Protocol"},
            {"key": "C", "text": "Ordered Object Processing"},
            {"key": "D", "text": "None of the above"},
        ],
        "correct_answer": "A",
        "explanation": "OOP = Object Oriented Programming.",
    },
    {
        "text": "Inheritance allows code reuse.",
        "question_type": "TRUE_FALSE",
        "options": [{"key": "True", "text": "True"}, {"key": "False", "text": "False"}],
        "correct_answer": "True",
        "explanation": "True — inheritance lets a child class reuse parent class code.",
    },
])


@pytest.mark.asyncio
async def test_quiz_generates_validated_questions(client):
    """Quiz generator returns structured, validated questions."""
    with patch(
        "app.services.openai_service.OpenAIService._simple_generate",
        new_callable=AsyncMock,
        return_value=_VALID_QUIZ_JSON,
    ):
        token = _make_token()
        res = await client.post(
            "/api/v1/ai/generate-quiz",
            json={"topic": "Object Oriented Programming", "num_questions": 2, "difficulty": "EASY"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 200
    data = res.json()
    assert "questions" in data
    assert len(data["questions"]) == 2
    assert data["questions"][0]["text"] == "What does OOP stand for?"
    assert data["questions"][0]["correct_answer"] == "A"
    assert data["total_questions"] == 2


@pytest.mark.asyncio
async def test_quiz_rejects_malformed_json(client):
    """Quiz generator returns 503 when AI returns invalid JSON."""
    with patch(
        "app.services.openai_service.OpenAIService._simple_generate",
        new_callable=AsyncMock,
        return_value="This is not valid JSON at all!",
    ):
        token = _make_token()
        res = await client.post(
            "/api/v1/ai/generate-quiz",
            json={"topic": "Python"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 503


@pytest.mark.asyncio
async def test_quiz_drops_questions_with_invalid_correct_answer(client):
    """Quiz validator drops questions where correct_answer doesn't match any option key."""
    bad_quiz = json.dumps([
        {
            "text": "Valid question?",
            "question_type": "MULTIPLE_CHOICE",
            "options": [{"key": "A", "text": "Yes"}, {"key": "B", "text": "No"}],
            "correct_answer": "A",  # Valid
            "explanation": "A is correct.",
        },
        {
            "text": "Question with wrong answer key?",
            "question_type": "MULTIPLE_CHOICE",
            "options": [{"key": "A", "text": "Yes"}, {"key": "B", "text": "No"}],
            "correct_answer": "Z",  # Invalid — not in options
            "explanation": "Z doesn't exist.",
        },
    ])
    with patch(
        "app.services.openai_service.OpenAIService._simple_generate",
        new_callable=AsyncMock,
        return_value=bad_quiz,
    ):
        token = _make_token()
        res = await client.post(
            "/api/v1/ai/generate-quiz",
            json={"topic": "Python"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 200
    data = res.json()
    # Only the valid question should survive
    assert len(data["questions"]) == 1
    assert data["questions"][0]["correct_answer"] == "A"


@pytest.mark.asyncio
async def test_quiz_rejects_invalid_num_questions(client):
    """Quiz generator rejects num_questions outside valid range."""
    token = _make_token()
    # Too many questions
    res = await client.post(
        "/api/v1/ai/generate-quiz",
        json={"topic": "Python", "num_questions": 50},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 422

    # Zero questions
    res = await client.post(
        "/api/v1/ai/generate-quiz",
        json={"topic": "Python", "num_questions": 0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_quiz_requires_authentication(client):
    """Quiz generator requires a valid JWT."""
    res = await client.post(
        "/api/v1/ai/generate-quiz",
        json={"topic": "Python"},
    )
    # FastAPI HTTPBearer returns 401 when no Authorization header is sent
    assert res.status_code == 401


# ═══════════════════════════════════════════════════════════════════════════════
# 3. Lesson Explainer (/ai/explain)
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.mark.asyncio
async def test_explain_returns_explanation(client):
    """Explainer returns a structured explanation for valid content."""
    with patch(
        "app.services.openai_service.OpenAIService._simple_generate",
        new_callable=AsyncMock,
        return_value="## Explanation\n\nPolymorphism means many forms...",
    ):
        token = _make_token()
        res = await client.post(
            "/api/v1/ai/explain",
            json={"content": "Polymorphism is a key OOP concept.", "target_level": "BEGINNER"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 200
    data = res.json()
    assert "explanation" in data
    assert data["target_level"] == "BEGINNER"
    assert data["used_db_content"] is False


@pytest.mark.asyncio
async def test_explain_rejects_too_short_content(client):
    """Explainer rejects content shorter than min_length=10."""
    token = _make_token()
    res = await client.post(
        "/api/v1/ai/explain",
        json={"content": "short", "target_level": "BEGINNER"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_explain_rejects_content_exceeding_max_length(client):
    """Explainer rejects content > 12000 chars."""
    token = _make_token()
    res = await client.post(
        "/api/v1/ai/explain",
        json={"content": "x" * 12001, "target_level": "BEGINNER"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_explain_rejects_invalid_lesson_id(client):
    """Explainer returns 404 for a non-existent lesson_id."""
    token = _make_token()
    res = await client.post(
        "/api/v1/ai/explain",
        json={
            "content": "Some valid lesson content here.",
            "lesson_id": str(uuid.uuid4()),  # Random UUID — won't exist in test DB
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_explain_requires_authentication(client):
    """Explainer requires a valid JWT."""
    res = await client.post(
        "/api/v1/ai/explain",
        json={"content": "Some lesson content to explain."},
    )
    # FastAPI HTTPBearer returns 401 when no Authorization header is sent
    assert res.status_code == 401


# ═══════════════════════════════════════════════════════════════════════════════
# 4. Study Planner (/ai/study-plan)
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.mark.asyncio
async def test_study_plan_requires_authentication(client):
    """Study planner requires authentication."""
    res = await client.post(
        "/api/v1/ai/study-plan",
        json={"course_id": str(uuid.uuid4()), "available_hours_per_week": 5},
    )
    # FastAPI HTTPBearer returns 401 when no Authorization header is sent
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_study_plan_rejects_unenrolled_student(client):
    """Study planner returns 403 when student is not enrolled."""
    token = _make_token(role="STUDENT")
    res = await client.post(
        "/api/v1/ai/study-plan",
        json={"course_id": str(uuid.uuid4()), "available_hours_per_week": 5},
        headers={"Authorization": f"Bearer {token}"},
    )
    # Student is not enrolled in this random course_id
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_study_plan_rejects_invalid_hours(client):
    """Study planner rejects hours_per_week=0 (ge=1 constraint)."""
    token = _make_token(role="STUDENT")
    res = await client.post(
        "/api/v1/ai/study-plan",
        json={"course_id": str(uuid.uuid4()), "available_hours_per_week": 0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_study_plan_rejects_excessive_hours(client):
    """Study planner rejects hours_per_week > 80."""
    token = _make_token(role="STUDENT")
    res = await client.post(
        "/api/v1/ai/study-plan",
        json={"course_id": str(uuid.uuid4()), "available_hours_per_week": 81},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 422


# ═══════════════════════════════════════════════════════════════════════════════
# 5. Provider Configuration
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.mark.asyncio
async def test_provider_config_error_returns_503(client):
    """Missing API key returns 503 on all AI endpoints."""
    from app.services.openai_service import OpenAIConfigError

    for endpoint, payload in [
        ("/api/v1/ai/chat", {"message": "test"}),
        ("/api/v1/ai/explain", {"content": "This is test lesson content."}),
    ]:
        with patch(
            "app.services.openai_service.OpenAIService.generate_tutor_response",
            new_callable=AsyncMock,
            side_effect=OpenAIConfigError(),
        ), patch(
            "app.services.openai_service.OpenAIService._simple_generate",
            new_callable=AsyncMock,
            side_effect=OpenAIConfigError(),
        ):
            token = _make_token()
            res = await client.post(
                endpoint,
                json=payload,
                headers={"Authorization": f"Bearer {token}"},
            )
        assert res.status_code == 503, f"Expected 503 for {endpoint}, got {res.status_code}"


# ═══════════════════════════════════════════════════════════════════════════════
# 6. Quiz schema unit tests (no HTTP)
# ═══════════════════════════════════════════════════════════════════════════════

def test_quiz_question_schema_rejects_empty_correct_answer():
    """AIQuizQuestion rejects an empty correct_answer."""
    from app.schemas.ai import AIQuizQuestion
    import pydantic

    with pytest.raises(pydantic.ValidationError):
        AIQuizQuestion(
            text="What is Python?",
            correct_answer="",
            explanation="n/a",
        )


def test_quiz_generate_request_topic_min_length():
    """AIQuizGenerateRequest rejects a topic shorter than min_length=3."""
    from app.schemas.ai import AIQuizGenerateRequest
    import pydantic

    with pytest.raises(pydantic.ValidationError):
        AIQuizGenerateRequest(topic="ab")


def test_quiz_generate_request_valid():
    """AIQuizGenerateRequest accepts valid input."""
    from app.schemas.ai import AIQuizGenerateRequest

    req = AIQuizGenerateRequest(
        topic="Python basics",
        num_questions=3,
        difficulty="EASY",
        question_type="MULTIPLE_CHOICE",
    )
    assert req.num_questions == 3
    assert req.difficulty == "EASY"


def test_explain_request_validates_level():
    """AIExplainRequest rejects invalid target_level values."""
    from app.schemas.ai import AIExplainRequest
    import pydantic

    with pytest.raises(pydantic.ValidationError):
        AIExplainRequest(content="Valid content here.", target_level="EXPERT")


def test_study_plan_request_validates_hours():
    """AIStudyPlanRequest rejects hours outside 1-80."""
    from app.schemas.ai import AIStudyPlanRequest
    import pydantic

    with pytest.raises(pydantic.ValidationError):
        AIStudyPlanRequest(course_id="some-id", available_hours_per_week=0)

    with pytest.raises(pydantic.ValidationError):
        AIStudyPlanRequest(course_id="some-id", available_hours_per_week=100)


if __name__ == "__main__":
    import sys
    import pytest as _pytest
    sys.exit(_pytest.main([__file__, "-v"]))
