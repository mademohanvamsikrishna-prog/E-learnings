"""
Unit & Integration Tests for AI Tutor Chat Endpoints
────────────────────────────────────────────────────
Tests input validation, endpoint routing, missing API key handling,
multi-turn conversation handling, and OpenAI tutor responses.
"""

import unittest
from unittest.mock import AsyncMock, patch
from starlette.testclient import TestClient

from app.main import app
from app.services.openai_service import (
    OpenAIService,
    OpenAIRateLimitError,
    OpenAIConfigError,
    OpenAIServiceUnavailableError,
)


class TestAIChatEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    # ── Test 1: Route Availability ──────────────────────────────────────────────
    def test_routes_available(self):
        """Verify both /api/v1/ai/chat and /api/ai/chat are mounted."""
        # With empty payload to verify route exists (should return 400 validation error)
        res_v1 = self.client.post("/api/v1/ai/chat", json={})
        self.assertEqual(res_v1.status_code, 400)

        res_direct = self.client.post("/api/ai/chat", json={})
        self.assertEqual(res_direct.status_code, 400)

    # ── Test 2: Input Validation (Empty, whitespace, null) ───────────────────────
    def test_validation_empty_message(self):
        """Test rejection of empty message."""
        res = self.client.post("/api/v1/ai/chat", json={"message": ""})
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Question cannot be empty")

    def test_validation_whitespace_only(self):
        """Test rejection of whitespace-only message."""
        res = self.client.post("/api/v1/ai/chat", json={"message": "   \n\t  "})
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Question cannot be empty")

    def test_validation_null_message(self):
        """Test rejection of null / None message."""
        res = self.client.post("/api/v1/ai/chat", json={"message": None})
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "Question cannot be empty")

    def test_validation_very_long_message(self):
        """Test rejection of excessively long message (>4000 characters)."""
        long_query = "What is polymorphism? " * 300  # >6000 chars
        res = self.client.post("/api/v1/ai/chat", json={"message": long_query})
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertIn("Question is too long", data["message"])

    # ── Test 3: Missing / Unconfigured OpenAI API Key ───────────────────────────
    def test_missing_api_key_error_handling(self):
        """When OPENAI_API_KEY is empty, return a safe 503 without leaking details."""
        with patch("app.services.openai_service.settings.openai_api_key", ""):
            res = self.client.post("/api/v1/ai/chat", json={"message": "What is Python?"})
            self.assertEqual(res.status_code, 503)
            data = res.json()
            self.assertFalse(data["success"])
            self.assertEqual(data["message"], "The AI Tutor is temporarily unavailable. Please try again.")

    # ── Test 4: Rate Limiting Handling ──────────────────────────────────────────
    @patch.object(OpenAIService, "generate_tutor_response")
    def test_rate_limit_handling(self, mock_generate):
        """Simulate OpenAI rate limit error."""
        mock_generate.side_effect = OpenAIRateLimitError("The AI Tutor is currently busy. Please try again in a moment.")
        res = self.client.post("/api/v1/ai/chat", json={"message": "Explain Java OOP"})
        self.assertEqual(res.status_code, 429)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertEqual(data["message"], "The AI Tutor is currently busy. Please try again in a moment.")

    # ── Test 5: Successful AI Tutor Flow: What is Python? ───────────────────────
    @patch.object(OpenAIService, "generate_tutor_response")
    def test_what_is_python(self, mock_generate):
        """Test asking 'What is Python?'."""
        expected_answer = (
            "### What is Python?\n\n"
            "**Python** is a high-level, interpreted programming language known for its readability.\n\n"
            "```python\nprint('Hello, Student!')\n```"
        )
        mock_generate.return_value = {"answer": expected_answer, "model": "gpt-4o-mini"}

        res = self.client.post("/api/v1/ai/chat", json={"message": "What is Python?"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["answer"], expected_answer)
        self.assertEqual(data["model_used"], "gpt-4o-mini")

    # ── Test 6: Successful AI Tutor Flow: Inheritance in Java ───────────────────
    @patch.object(OpenAIService, "generate_tutor_response")
    def test_explain_inheritance(self, mock_generate):
        """Test asking 'Explain inheritance in Java with an example.'."""
        expected_answer = (
            "### Inheritance in Java\n\n"
            "Inheritance allows a subclass to inherit fields and methods from a superclass.\n\n"
            "```java\n"
            "class Animal {\n"
            "    void eat() { System.out.println(\"Eating...\"); }\n"
            "}\n"
            "class Dog extends Animal {\n"
            "    void bark() { System.out.println(\"Barking!\"); }\n"
            "}\n"
            "```"
        )
        mock_generate.return_value = {"answer": expected_answer, "model": "gpt-4o-mini"}

        res = self.client.post("/api/v1/ai/chat", json={"message": "Explain inheritance in Java with an example."})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("Inheritance in Java", data["answer"])

    # ── Test 7: Successful AI Tutor Flow: 5 MCQs on DBMS ────────────────────────
    @patch.object(OpenAIService, "generate_tutor_response")
    def test_mcqs_on_dbms(self, mock_generate):
        """Test asking 'Give me 5 MCQs on DBMS.'."""
        expected_answer = (
            "### 5 Practice MCQs on DBMS\n\n"
            "1. What does DBMS stand for?\n"
            "   - A) Data Base Multi System\n"
            "   - B) Database Management System (Correct)\n"
        )
        mock_generate.return_value = {"answer": expected_answer, "model": "gpt-4o-mini"}

        res = self.client.post("/api/v1/ai/chat", json={"message": "Give me 5 MCQs on DBMS."})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("5 Practice MCQs on DBMS", data["answer"])

    # ── Test 8: Multi-turn Conversation & History ───────────────────────────────
    @patch.object(OpenAIService, "generate_tutor_response")
    def test_conversation_history_passed(self, mock_generate):
        """Verify conversation history is forwarded to service."""
        mock_generate.return_value = {"answer": "Polymorphism example: ...", "model": "gpt-4o-mini"}

        history = [
            {"role": "user", "content": "What is polymorphism?"},
            {"role": "assistant", "content": "Polymorphism allows objects to take multiple forms."},
        ]

        res = self.client.post(
            "/api/v1/ai/chat",
            json={
                "message": "Give me an example",
                "history": history,
                "course_title": "Mastering Java OOP",
            },
        )
        self.assertEqual(res.status_code, 200)
        # Check that mock received the history
        args, kwargs = mock_generate.call_args
        self.assertEqual(kwargs.get("user_message"), "Give me an example")
        passed_history = kwargs.get("history")
        self.assertEqual(len(passed_history), 2)
        self.assertEqual(passed_history[0].role, "user")
        self.assertEqual(passed_history[0].content, "What is polymorphism?")
        self.assertEqual(kwargs.get("course_title"), "Mastering Java OOP")


if __name__ == "__main__":
    unittest.main()
