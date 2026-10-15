"""
Auth Regression Tests (Phase 3)
─────────────────────────────────────────────────────────────────────────────
Tests the /auth/register, /auth/login, and /users/me endpoints using:
  - An in-memory SQLite database (no external DB required — see conftest.py)
  - Safe placeholder credentials (never reuse production values)
  - Pure unit/integration tests with no real network calls

Run with:  python -m pytest tests/test_auth.py -v
"""

import uuid
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

# conftest.py patches the DB engine and registers the get_db override
# before this module is imported. Just import the already-patched app.
from app.main import app  # noqa: E402
from app.core.dependencies import get_db  # noqa: E402


# ─── Fixtures ─────────────────────────────────────────────────────────────────
@pytest_asyncio.fixture
async def client():
    """Async HTTP client against the FastAPI app."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as c:
        yield c


# Safe test credentials — never reuse real/production values here
_STUDENT_PAYLOAD = {
    "email": "student.regtest@test.example",
    "username": "teststudent",
    "full_name": "Test Student",
    "password": "TestPass123!",
    "role": "STUDENT",
}
_INSTRUCTOR_PAYLOAD = {
    "email": "instructor.regtest@test.example",
    "username": "testinstructor",
    "full_name": "Test Instructor",
    "password": "TestPass456!",
    "role": "INSTRUCTOR",
}


# ─── Test 1: Student Registration ─────────────────────────────────────────────
@pytest.mark.asyncio
async def test_register_student(client: AsyncClient):
    res = await client.post("/api/v1/auth/register", json=_STUDENT_PAYLOAD)
    assert res.status_code == 201, res.text
    data = res.json()
    assert data["email"] == _STUDENT_PAYLOAD["email"]
    assert data["username"] == _STUDENT_PAYLOAD["username"]
    assert data["full_name"] == _STUDENT_PAYLOAD["full_name"]
    assert data["role"] == "STUDENT"
    assert data["is_active"] is True
    assert "hashed_password" not in data  # must never be exposed


# ─── Test 2: Instructor Registration ──────────────────────────────────────────
@pytest.mark.asyncio
async def test_register_instructor(client: AsyncClient):
    res = await client.post("/api/v1/auth/register", json=_INSTRUCTOR_PAYLOAD)
    assert res.status_code == 201, res.text
    data = res.json()
    assert data["role"] == "INSTRUCTOR"


# ─── Test 3: Duplicate email is rejected ──────────────────────────────────────
@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    # First registration should succeed (may already exist from test_register_student)
    await client.post("/api/v1/auth/register", json=_STUDENT_PAYLOAD)
    # Second registration with same email must be rejected
    res = await client.post("/api/v1/auth/register", json=_STUDENT_PAYLOAD)
    assert res.status_code == 400
    assert "already exists" in res.json()["detail"].lower()


# ─── Test 4: Student Login ────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_login_student(client: AsyncClient):
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": _STUDENT_PAYLOAD["email"], "password": _STUDENT_PAYLOAD["password"]},
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


# ─── Test 5: Invalid credentials are rejected ─────────────────────────────────
@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": _STUDENT_PAYLOAD["email"], "password": "wrongpassword"},
    )
    assert res.status_code == 401
    assert "Invalid" in res.json()["detail"]


# ─── Test 6: /users/me returns correct profile ────────────────────────────────
@pytest.mark.asyncio
async def test_get_me_student(client: AsyncClient):
    # Login to get a token
    login_res = await client.post(
        "/api/v1/auth/login",
        json={"email": _STUDENT_PAYLOAD["email"], "password": _STUDENT_PAYLOAD["password"]},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # Fetch profile
    me_res = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200, me_res.text
    data = me_res.json()
    assert data["email"] == _STUDENT_PAYLOAD["email"]
    assert data["role"] == "STUDENT"
    assert "hashed_password" not in data


# ─── Test 7: /users/me returns correct role for instructor ────────────────────
@pytest.mark.asyncio
async def test_get_me_instructor(client: AsyncClient):
    login_res = await client.post(
        "/api/v1/auth/login",
        json={"email": _INSTRUCTOR_PAYLOAD["email"], "password": _INSTRUCTOR_PAYLOAD["password"]},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    me_res = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200, me_res.text
    assert me_res.json()["role"] == "INSTRUCTOR"


# ─── Test 8: /users/me without token returns 403 (HTTPBearer rejects) ─────────
@pytest.mark.asyncio
async def test_get_me_unauthenticated(client: AsyncClient):
    res = await client.get("/api/v1/users/me")
    # HTTPBearer with auto_error=True returns 403 when no bearer header
    assert res.status_code in (401, 403)


# ─── Test 9: /users/me with expired / invalid token returns 401 ───────────────
@pytest.mark.asyncio
async def test_get_me_invalid_token(client: AsyncClient):
    res = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer this.is.not.a.valid.jwt"},
    )
    assert res.status_code == 401


# ─── Test 10: Client-side role selection cannot grant INSTRUCTOR access ────────
@pytest.mark.asyncio
async def test_login_role_is_server_assigned(client: AsyncClient):
    """
    Verify that a STUDENT who logs in cannot receive INSTRUCTOR-level data
    by sending a role in their login payload. The backend ignores any 'role'
    field in LoginRequest — role comes from the DB record only.
    """
    # LoginRequest only accepts email + password; extra fields are ignored
    res = await client.post(
        "/api/v1/auth/login",
        json={
            "email": _STUDENT_PAYLOAD["email"],
            "password": _STUDENT_PAYLOAD["password"],
            "role": "INSTRUCTOR",  # should be ignored
        },
    )
    assert res.status_code == 200
    token = res.json()["access_token"]

    # Profile must still show STUDENT
    me_res = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    assert me_res.json()["role"] == "STUDENT"


# ─── Test 11: UserRole is stored as a plain string value, not an enum repr ────
@pytest.mark.asyncio
async def test_role_serialised_as_string(client: AsyncClient):
    """
    Regression: auth_service used to pass role=data.role (str) to User.role
    (Enum column). This test confirms the role column round-trips as the plain
    string 'INSTRUCTOR', not '<UserRole.INSTRUCTOR: INSTRUCTOR>' or similar.
    """
    login_res = await client.post(
        "/api/v1/auth/login",
        json={"email": _INSTRUCTOR_PAYLOAD["email"], "password": _INSTRUCTOR_PAYLOAD["password"]},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    me_res = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    role_value = me_res.json()["role"]
    assert role_value == "INSTRUCTOR", f"Expected 'INSTRUCTOR', got {role_value!r}"
    assert "<" not in role_value, "role must be a plain string, not an enum repr"


# ─── Test 12: JWT tokens are accepted after datetime.now(timezone.utc) fix ────
@pytest.mark.asyncio
async def test_jwt_timezone_aware_token_accepted(client: AsyncClient):
    """
    Regression: security.py used datetime.utcnow() (deprecated, removed in
    Python 3.12). Now uses datetime.now(timezone.utc). Verify tokens created
    with the new code are still decoded and accepted by /users/me.
    """
    login_res = await client.post(
        "/api/v1/auth/login",
        json={"email": _STUDENT_PAYLOAD["email"], "password": _STUDENT_PAYLOAD["password"]},
    )
    assert login_res.status_code == 200, login_res.text
    token = login_res.json()["access_token"]
    assert token, "Expected a non-empty access_token"

    # Token must be usable immediately
    me_res = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200, me_res.text
    assert me_res.json()["email"] == _STUDENT_PAYLOAD["email"]


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-v"]))
