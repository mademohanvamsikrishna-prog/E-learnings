"""
E-Learning Platform — FastAPI Application Entry Point
─────────────────────────────────────────────────────
Routing structure:
  /api/v1/auth        → Authentication (register, login, refresh)
  /api/v1/courses     → Course CRUD
  /api/v1/users       → User profiles
  /api/v1/lessons     → Lesson management
  /api/v1/quizzes     → Quiz management
  /api/v1/assignments → Assignment management
  /api/v1/progress    → Progress tracking
  /api/v1/enrollments → Enrollment management
  /api/v1/certificates→ Certificates
  /api/v1/ai          → AI features (Tutor, Quiz Gen, Explain, Study Plan)
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.auth import router as auth_router
from app.api.courses import router as courses_router
from app.api.ai import router as ai_router
from app.api.users import (
    router_users,
    router_lessons,
    router_quizzes,
    router_assignments,
    router_progress,
    router_enrollments,
    router_certificates,
)

settings = get_settings()


# ─── Lifespan (startup / shutdown) ───────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"[START] {settings.app_name} starting in [{settings.app_env}] mode")
    yield
    # Shutdown
    print("[STOP] Application shutdown")


# ─── Application factory ─────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    description="AI-powered E-Learning Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── API v1 routers ──────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(courses_router, prefix=API_PREFIX)
app.include_router(ai_router, prefix=API_PREFIX)
app.include_router(router_users, prefix=API_PREFIX)
app.include_router(router_lessons, prefix=API_PREFIX)
app.include_router(router_quizzes, prefix=API_PREFIX)
app.include_router(router_assignments, prefix=API_PREFIX)
app.include_router(router_progress, prefix=API_PREFIX)
app.include_router(router_enrollments, prefix=API_PREFIX)
app.include_router(router_certificates, prefix=API_PREFIX)


# ─── Health check ────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": settings.app_name, "env": settings.app_env}
