# E-Learnings — Full Bug & Error Audit Report

> **Audit date:** 2026-10-15  
> **Scope:** Full-stack — FastAPI backend, React/Vite frontend, SQLAlchemy models, schemas, routes, services, auth, AI integration.  
> **Method:** Static analysis, repository search, code tracing. No destructive commands executed.

---

## Summary

| Severity | Count |
|----------|-------|
| P0 — Critical | 1 |
| P1 — High | 4 |
| P2 — Medium | 9 |
| P3 — Low | 8 |
| **Total** | **22** |

---

## P0 — Critical

### BUG-01 · Self-Privilege-Escalation via Registration Role Field

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/schemas/user.py#L11`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/schemas/user.py) · [`backend/app/services/auth_service.py#L28`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/services/auth_service.py) |
| **Evidence** | `UserCreate.role: Optional[str] = "STUDENT"`. `auth_service.register` calls `UserRole(data.role or "STUDENT")` — wraps in try/except but only catches `ValueError`. `INSTRUCTOR` is a valid enum value, so `UserRole("INSTRUCTOR")` succeeds without error. |
| **Root cause** | The `role` field is accepted from the client with no whitelist filter. Any user can POST `{"role": "INSTRUCTOR"}` to `/api/v1/auth/register` and receive an instructor account. |
| **User impact** | Any anonymous user can self-assign `INSTRUCTOR` (or `ADMIN`) privileges, bypassing all role-based access control on instructor-only routes. |
| **Fix** | Remove `role` from `UserCreate` entirely, or force it to `STUDENT` in `AuthService.register` regardless of what the client sends. Admins should assign elevated roles via a separate admin endpoint. |

```diff
# schemas/user.py
-    role: Optional[str] = "STUDENT"
```
```python
# auth_service.py — line 28: always force STUDENT on public registration
role_enum = UserRole.STUDENT
```

---

## P1 — High

### BUG-02 · Token Refresh Endpoint Returns 501 — Sessions Expire After 30 Minutes

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/api/auth.py#L31–37`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/api/auth.py) · [`frontend/src/services/api.js#L31–37`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/services/api.js) |
| **Evidence** | `POST /auth/refresh` always raises HTTP 501. The frontend `api.js` 401 interceptor immediately clears tokens and hard-redirects to `/login` — it never attempts a refresh first. `access_token_expire_minutes = 30`. |
| **Root cause** | Refresh logic was never implemented. The frontend has no retry/refresh flow before giving up. |
| **User impact** | Every user is force-logged-out within 30 minutes of inactivity or after any 401, even during an active session mid-task (e.g. a long quiz or study plan). |
| **Fix** | Implement `POST /auth/refresh` in the backend (validate refresh token, issue new access token). Add a response interceptor in `api.js` that retries once with a refreshed token before redirecting to `/login`. |

---

### BUG-03 · Insecure Default `SECRET_KEY` in Config

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/core/config.py#L17`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/core/config.py) |
| **Evidence** | `secret_key: str = "change-this-secret-key"`. If `.env` is missing or the variable is unset, the application starts with this known value and any attacker can craft valid JWTs. |
| **Root cause** | Pydantic `BaseSettings` uses the class-level default when the env var is absent. No startup check enforces a non-default value. |
| **User impact** | In any environment where `.env` is absent (CI, Docker, fresh clone), JWTs are trivially forgeable — complete authentication bypass. |
| **Fix** | Remove the default; make the field required: `secret_key: str`. Pydantic will raise a `ValidationError` at startup if `SECRET_KEY` is not set, failing fast and visibly. |

```diff
-    secret_key: str = "change-this-secret-key"
+    secret_key: str   # No default — must be provided in .env
```

---

### BUG-04 · Dev Guest Bypass in `get_ai_user_payload` Has No Production Safeguard Warning

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/core/dependencies.py#L44–78`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/core/dependencies.py) |
| **Evidence** | When `app_env == "development"` and no token is present, the dependency returns a hardcoded identity `{"sub": "usr_student_01", "role": "STUDENT", …}`. If `APP_ENV` is accidentally left as `development` in a production deploy, all AI endpoints are publicly accessible without authentication. |
| **Root cause** | The guard is a string equality check on an env var that has no validation; no startup warning is emitted. |
| **User impact** | Unauthenticated production users gain free access to all AI endpoints; API costs accrue without billing. |
| **Fix** | Add a startup warning/assertion if `app_env == "development"` and `app_debug` is True. Alternatively, use an explicit `ALLOW_GUEST_AI_ACCESS=true` flag rather than inferring from `app_env`. |

---

### BUG-05 · `ADMIN` Role Inaccessible — Cannot Log In or Navigate to Admin Area

| Field | Detail |
|-------|--------|
| **File** | [`frontend/src/routes/AppRoutes.jsx#L53–55`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/routes/AppRoutes.jsx) · [`frontend/src/pages/auth/LoginPage.jsx#L87`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/pages/auth/LoginPage.jsx) |
| **Evidence** | After login, `profile.role === 'INSTRUCTOR'` redirects to `/instructor/dashboard`; all others go to `/dashboard`. The `ProtectedRoute` role check redirects non-matching roles away. There is no route, layout, or dashboard for `ADMIN`. An admin user logs in and is immediately redirected to the student dashboard, then bounced back by `role="STUDENT"` guard — an infinite redirect loop. |
| **Root cause** | The admin role was modelled but no corresponding frontend route or page was built. The redirect logic doesn't account for ADMIN. |
| **User impact** | Admin users cannot use the platform. Login causes a redirect loop between `/dashboard` and `/login`. |
| **Fix** | Update login redirect: `role === 'ADMIN' → '/admin/dashboard'` (or a shared `/dashboard` that admins can access). Add `ADMIN` to `require_student`-equivalent fallthrough in `ProtectedRoute`. |

---

## P2 — Medium

### BUG-06 · Frontend AI Error Handler Reads `.message` But Backend Returns `.detail`

| Field | Detail |
|-------|--------|
| **File** | [`frontend/src/pages/ai/AITutorPage.jsx#L138`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/pages/ai/AITutorPage.jsx) |
| **Evidence** | Catch block: `err.response.data?.message`. FastAPI `HTTPException` serializes as `{"detail": "..."}`, not `{"message": "..."}`. Only `JSONResponse` errors from `_ai_error_response` use `{"message": "..."}` — but those return non-2xx status codes caught by Axios, which also use `.detail`. |
| **Root cause** | Field name mismatch between FastAPI's error schema (`detail`) and the frontend's extraction key (`message`). |
| **User impact** | When an HTTP error occurs (503, 429, 401), the displayed error always falls back to the generic "AI Tutor temporarily unavailable" message, even when the backend returned a specific, actionable message. |
| **Fix** | In AITutorPage catch block: `err.response.data?.detail || err.response.data?.message`. Apply the same fix to any other AI page error handlers. |

---

### BUG-07 · "Remember Me" Checkbox Has No Effect

| Field | Detail |
|-------|--------|
| **File** | [`frontend/src/pages/auth/LoginPage.jsx#L61, #L344–357`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/pages/auth/LoginPage.jsx) |
| **Evidence** | `const [remember, setRemember] = useState(true)` — checkbox exists and updates state, but `remember` is never passed to `login()` or used to choose between `localStorage` and `sessionStorage`. Tokens always land in `localStorage`. |
| **Root cause** | Checkbox UI was built but the logic to honour it was not implemented. |
| **User impact** | Users who uncheck "Remember me" expecting session-only storage still have tokens persisted to `localStorage` indefinitely — a session management and privacy issue on shared machines. |
| **Fix** | Pass `remember` into `AuthContext.login`. If `!remember`, store tokens in `sessionStorage` instead of `localStorage`. Clear `sessionStorage` on tab/window close. |

---

### BUG-08 · Course Enrollment is Mocked — No API Call Made

| Field | Detail |
|-------|--------|
| **File** | [`frontend/src/pages/courses/CourseDetails.jsx#L43–46`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/pages/courses/CourseDetails.jsx) |
| **Evidence** | `handleEnroll` sets `setIsEnrolled(true)` and `setShowEnrollSuccess(true)` only — no `api.post('/enrollments', …)` call. Also, the entire backend `/enrollments` endpoint returns `{"message": "Enrollments — implementation pending"}`. |
| **Root cause** | Enrollment was scaffolded as a stub both on the frontend and backend. |
| **User impact** | Users believe they enrolled in a course, but no database record is created. AI study plan and progress tracking silently fail because no enrollment row exists. |
| **Fix** | Implement `POST /api/v1/enrollments` on the backend (create `Enrollment` record). Call it from `handleEnroll` in `CourseDetails.jsx`. |

---

### BUG-09 · `LearningPage` AI Ask Uses Hardcoded Mock Response — Not Real API

| Field | Detail |
|-------|--------|
| **File** | [`frontend/src/pages/learn/LearningPage.jsx#L60–77`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/pages/learn/LearningPage.jsx) |
| **Evidence** | `handleAskAI` runs a `setTimeout` with hardcoded text about polymorphism. It never calls `aiService.chat()` or `aiService.askTutor()`. |
| **Root cause** | AI integration on the learning page was replaced with a placeholder mock and never wired to the real service. |
| **User impact** | "Ask AI Tutor" button in the lesson view always returns the same two canned responses regardless of the question asked, making it completely non-functional. |
| **Fix** | Replace the `setTimeout` mock with `await aiService.askTutor(aiQuestion, lessonId, courseId)` from the existing `aiService.js`. |

---

### BUG-10 · `QuizAttempt` in Study Plan Fetches Cross-Course Scores

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/api/ai.py#L406–414`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/api/ai.py) |
| **Evidence** | The study plan endpoint fetches `QuizAttempt` records filtered only by `student_id`, not by course. The `Quiz` model has a `course_id` FK, but the query does not join to it. Scores from all courses are sent to the AI as context for one specific course's study plan. |
| **Root cause** | The quiz score query is missing a `.join(Quiz).where(Quiz.course_id == course_uuid)` filter. |
| **User impact** | Study plans receive irrelevant quiz score context from other courses, potentially reducing plan quality. |
| **Fix** | Join `QuizAttempt` → `Quiz` and filter by `Quiz.course_id == course_uuid` in the study plan score query. |

---

### BUG-11 · `AIExplainRequest.content` Required Even When `lesson_id` is Provided

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/schemas/ai.py#L109`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/schemas/ai.py) |
| **Evidence** | `content: str = Field(..., min_length=10, max_length=12000)` — the `...` makes it required. The endpoint fetches DB lesson content when `lesson_id` is given, overriding the client value, but the schema still forces clients to send a non-empty `content` string (≥10 chars). |
| **Root cause** | The `content` field was not made optional when the DB-lookup path was added. |
| **User impact** | Frontend calling `/ai/explain` with a `lesson_id` must still send arbitrary dummy text to pass validation — unintuitive and fragile. |
| **Fix** | `content: Optional[str] = Field(None, …)` and add a root validator: if `lesson_id` is absent, `content` must be provided. |

---

### BUG-12 · `_is_enrolled` Blocks Completed Students from AI Features

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/api/ai.py#L112–121`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/api/ai.py) |
| **Evidence** | `_is_enrolled` checks `Enrollment.status == EnrollmentStatus.ACTIVE` only. Students who completed a course have `status = COMPLETED`. They cannot use lesson explainer or generate a study plan for that course. |
| **Root cause** | Status filter is too narrow — `COMPLETED` should also count as enrolled for AI access. |
| **User impact** | Students who finish a course lose access to AI explanations for that course's lessons. |
| **Fix** | Change the filter to `Enrollment.status.in_([EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED])`. |

---

### BUG-13 · `ProgressAnalytics` Uses Light-Mode CSS in a Dark-Theme App

| Field | Detail |
|-------|--------|
| **File** | [`frontend/src/pages/progress/ProgressAnalytics.jsx#L24–30`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/pages/progress/ProgressAnalytics.jsx) |
| **Evidence** | Classes `border-slate-200`, `text-slate-900`, `bg-indigo-50`, `text-indigo-700` — light-mode palette — are used inside a `DashboardLayout` that renders on a `bg-[#0a0a0a]` background. Text and borders are invisible or clashing. |
| **Root cause** | The component was ported from an earlier light-mode design and never updated for the dark theme. |
| **User impact** | Progress analytics page is visually broken — text nearly invisible, contrasts fail WCAG AA. |
| **Fix** | Replace light-mode classes with the dark equivalents used elsewhere (`border-white/8`, `text-white`, `bg-white/4`, `text-purple-300`, etc.). |

---

### BUG-14 · All Core Student Pages Use Mock Data Instead of Real API

| Field | Detail |
|-------|--------|
| **Files** | `StudentDashboard.jsx`, `MyCourses.jsx`, `QuizPage.jsx`, `AssignmentPage.jsx`, `CertificatePage.jsx`, `ExploreCourses.jsx`, `CourseDetails.jsx`, `InstructorDashboard.jsx` |
| **Evidence** | Every page imports from `@/data/mockData`. No page calls the real `/api/v1/courses`, `/api/v1/enrollments`, `/api/v1/quizzes`, or `/api/v1/certificates` endpoints. |
| **Root cause** | Most student/instructor data endpoints are stubs on the backend (`"implementation pending"`), so the frontend was wired to mock data and not updated. |
| **User impact** | All student-facing features show identical static demo data to every user regardless of their actual account. |
| **Fix** | Implement backend endpoints for enrollments, progress, quizzes, assignments, and certificates, then connect the frontend pages to the real API. This is the largest remaining work item. |

---

## P3 — Low

### BUG-15 · `Category` Table Named `categorys` (Typo)

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/models/course.py#L59`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/models/course.py) |
| **Evidence** | `__tablename__ = "categorys"` — grammatically wrong; should be `"categories"`. The ForeignKey on `Course` references `"categorys.id"`, so both must change together. |
| **Fix** | Rename table to `"categories"` and update the FK string. Generate an Alembic migration. |

---

### BUG-16 · `Enrollment` Has No Unique Constraint — Duplicate Enrollments Possible

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/models/enrollment.py`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/models/enrollment.py) |
| **Evidence** | No `UniqueConstraint("student_id", "course_id")`. A student can be enrolled multiple times in the same course, corrupting progress tracking and certificate logic. |
| **Fix** | Add `UniqueConstraint("student_id", "course_id", name="uq_enrollment_student_course")` to the model and generate a migration. |

---

### BUG-17 · `Progress` Has No Unique Constraint — Duplicate Records Possible

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/models/progress.py`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/models/progress.py) |
| **Evidence** | No `UniqueConstraint("student_id", "lesson_id", "enrollment_id")`. Multiple progress records for the same student/lesson combination would cause incorrect completion calculations. |
| **Fix** | Add the unique constraint and migration. |

---

### BUG-18 · `Progress` Model Missing `back_populates` on `student` Relationship

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/models/progress.py`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/models/progress.py) · [`backend/app/models/user.py`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/models/user.py) |
| **Evidence** | `Progress` has `student_id` FK to `users.id` but no `student = relationship(...)`. `User` has no `progress_records` relationship. SQLAlchemy will not raise an error, but bidirectional access is impossible. |
| **Fix** | Add `student = relationship("User", back_populates="progress_records")` in `Progress` and `progress_records = relationship("Progress", back_populates="student", lazy="noload")` in `User`. |

---

### BUG-19 · `Assignment.max_score` Is `String(10)` Instead of Numeric

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/models/assignment.py#L26`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/models/assignment.py) |
| **Evidence** | `max_score = Column(String(10), default="100")`. Any grading calculation (`score / max_score * 100`) requires a cast that is easy to forget, and sorting/filtering on max_score would be lexicographic. |
| **Fix** | Change to `Column(Integer, default=100)` with a migration. |

---

### BUG-20 · `Certificate` Model Has No `issued_at` Timestamp

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/models/certificate.py`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/models/certificate.py) |
| **Evidence** | No `created_at` / `issued_at` column. Certificates cannot be sorted chronologically and the date shown on the certificate PDF has no database source. |
| **Fix** | Add `issued_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)`. |

---

### BUG-21 · `ai.py` Chat Handler Re-imports `AIChatRequest` Inside Try Block on Every Request

| Field | Detail |
|-------|--------|
| **File** | [`backend/app/api/ai.py#L161`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/backend/app/api/ai.py) |
| **Evidence** | `from app.schemas.ai import AIChatRequest as _Req` — imported inside the `try` block on every request. Python caches module imports so there is no correctness bug, but it is misleading style and adds micro-overhead. |
| **Fix** | Move the import to the top of the file. The `_Req` alias is unnecessary since `AIChatRequest` is already imported at module level — use it directly. |

---

### BUG-22 · "Forgot Password?" Link Is a Dead `href="#"` 

| Field | Detail |
|-------|--------|
| **File** | [`frontend/src/pages/auth/LoginPage.jsx#L354`](file:///c:/Users/madem/OneDrive/Desktop/learning/e-learning-platform/frontend/src/pages/auth/LoginPage.jsx) |
| **Evidence** | `<a href="#">Forgot password?</a>` — clicking scrolls to page top. No password reset page or API endpoint exists. |
| **Fix** | Implement a password reset flow (email-based token). Until then, change to a `<button>` with a toast/modal: "Password reset coming soon." A dead `href="#"` actively misleads users. |

---

## Recommended Fix Priority

| Order | Bug IDs | Rationale |
|-------|---------|-----------|
| 1 | BUG-01 | Self-privilege escalation — fix before any other users register |
| 2 | BUG-03 | Insecure default secret key — forge-able JWTs |
| 3 | BUG-05 | Admin redirect loop — locks out admin users completely |
| 4 | BUG-04 | Dev guest bypass — add explicit safeguard / startup warning |
| 5 | BUG-02 | Implement token refresh — critical UX and session security |
| 6 | BUG-12 | Completed students blocked from AI features |
| 7 | BUG-10 | Cross-course quiz scores in study plan |
| 8 | BUG-06 | AI error field mismatch (quick 1-line fix) |
| 9 | BUG-07 | Remember Me no-op (quick fix) |
| 10 | BUG-09 | LearningPage AI mock (wire to real service) |
| 11 | BUG-08 + BUG-14 | Enrollment + all mock data → real API (larger effort) |
| 12 | BUG-11 | AIExplainRequest.content optional |
| 13 | BUG-13 | ProgressAnalytics dark-mode CSS |
| 14 | BUG-16–22 | Data-integrity, model, and code-quality fixes |
