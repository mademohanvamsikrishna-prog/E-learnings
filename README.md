# 🎓 E-Learning Platform

An AI-powered, full-stack e-learning platform built with **FastAPI** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## ✨ Features

| Area | Details |
|---|---|
| **Auth** | JWT-based RBAC (Student / Instructor / Admin) |
| **Courses** | Create, publish, and manage video, PDF, text lessons |
| **Quizzes** | AI-generated or manual quizzes with attempt tracking |
| **Progress** | Per-lesson completion tracking and course % progress |
| **Certificates** | Auto-generated on course completion |
| **AI Tutor** | Answers student questions in course context |
| **AI Quiz Gen** | Generates quiz questions from any topic |
| **AI Explain** | Simplifies or elaborates lesson content |
| **AI Study Plan** | Personalised study plan per student |

---

## 🗂 Project Structure

```
e-learning-platform/
├── frontend/           React + Vite + Tailwind SPA
│   └── src/
│       ├── components/ Reusable UI components
│       ├── pages/      Auth / Student / Instructor / Admin / Courses pages
│       ├── layouts/    Per-role layouts (sidebar + outlet)
│       ├── services/   All API calls (api.js, authService, courseService…)
│       ├── context/    AuthContext — global auth state
│       └── routes/     AppRoutes with role-guarded routes
│
└── backend/            Python FastAPI application
    └── app/
        ├── main.py     Application entry point
        ├── api/        Route handlers (thin — no business logic)
        ├── services/   Business logic layer
        ├── models/     SQLAlchemy ORM models
        ├── schemas/    Pydantic request/response schemas
        ├── core/       Config, security, dependency injection
        └── database/   Engine, session, base model
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

---

### Backend

```bash
cd backend

# 1. Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy and fill in environment variables
cp .env.example .env

# 4. Run the development server
uvicorn app.main:app --reload --port 8000
```

API Docs available at: http://localhost:8000/api/docs

---

### Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

App available at: http://localhost:5173

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL async connection string |
| `SECRET_KEY` | JWT signing secret (keep it long and random) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `OPENAI_API_KEY` | OpenAI API key (optional alternative) |
| `AI_PROVIDER` | `gemini` or `openai` |
| `CLOUDINARY_*` | Cloudinary credentials for media storage |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 🏗 Architecture

```
React Component
      │
      ▼
Service (services/)   ← API calls here ONLY
      │
      ▼
FastAPI Router (api/)  ← HTTP mapping only
      │
      ▼
Service Layer (services/) ← Business logic
      │
      ▼
SQLAlchemy Model (models/)
      │
      ▼
PostgreSQL
```

### Authentication Flow

```
Register / Login
      │
  FastAPI auth.py
      │
  AuthService validates credentials
      │
  JWT (access + refresh) returned
      │
  React stores tokens in localStorage
      │
  Axios auto-attaches Bearer header
      │
  Protected routes check role via ProtectedRoute
```

---

## 👤 User Roles

| Role | Access |
|---|---|
| **STUDENT** | Browse courses, enroll, learn, take quizzes, get certificates, use AI tutor |
| **INSTRUCTOR** | All student access + create/edit courses, upload content, view analytics |
| **ADMIN** | Full platform access + user management, moderation, platform analytics |

---

## 🤖 AI Features

All AI functionality lives in:

- **Backend**: `backend/app/services/ai_service.py` + `backend/app/api/ai.py`
- **Frontend**: `frontend/src/services/aiService.js`

To switch between Gemini and OpenAI, set `AI_PROVIDER=openai` in `.env` and add your `OPENAI_API_KEY`. No code changes needed.

**API keys are never exposed to the frontend.**

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | FastAPI, SQLAlchemy 2 (async), Pydantic v2 |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Database | PostgreSQL + asyncpg |
| Migrations | Alembic |
| AI | Gemini API / OpenAI API |
| Storage | Cloudinary / S3 |

---

## 📄 License

MIT
