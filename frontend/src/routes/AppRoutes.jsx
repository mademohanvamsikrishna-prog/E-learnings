import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// ── Layouts ──────────────────────────────────────────────────────────────────
import MainLayout from '@/layouts/MainLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import LandingLayout from '@/layouts/LandingLayout'

// ── Pages ────────────────────────────────────────────────────────────────────
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import StudentDashboard from '@/pages/student/StudentDashboard'
import ExploreCourses from '@/pages/courses/ExploreCourses'
import CourseDetails from '@/pages/courses/CourseDetails'
import MyCourses from '@/pages/student/MyCourses'
import LearningPage from '@/pages/learn/LearningPage'
import QuizPage from '@/pages/quiz/QuizPage'
import AssignmentPage from '@/pages/assignments/AssignmentPage'
import ProgressAnalytics from '@/pages/progress/ProgressAnalytics'
import CertificatePage from '@/pages/certificates/CertificatePage'
import AITutorPage from '@/pages/ai/AITutorPage'
import InstructorDashboard from '@/pages/instructor/InstructorDashboard'
import CreateCoursePage from '@/pages/instructor/CreateCoursePage'
import NotFoundPage from '@/pages/errors/NotFoundPage'

// ── Route Guards ─────────────────────────────────────────────────────────────

/**
 * ProtectedRoute: Only allows authenticated users.
 * Waits for token initialization before making redirect decisions.
 * Optionally restricts to a specific role ('STUDENT' | 'INSTRUCTOR').
 */
function ProtectedRoute({ children, role }) {
  const { isAuthenticated, isInitializing, user } = useAuth()

  // Don't redirect until we know whether the stored token is valid
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <svg className="w-8 h-8 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    // BUG-05 fix: Wrong role — redirect to the user's correct dashboard
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (user?.role === 'INSTRUCTOR') return <Navigate to="/instructor/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * PublicOnlyRoute: Redirects already-authenticated users away from
 * login / register pages to their correct dashboard.
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth()

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <svg className="w-8 h-8 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }

  if (isAuthenticated) {
    // BUG-05 fix: ADMIN users go to /admin/dashboard, not /dashboard
    let dest = '/dashboard'
    if (user?.role === 'INSTRUCTOR') dest = '/instructor/dashboard'
    else if (user?.role === 'ADMIN') dest = '/admin/dashboard'
    return <Navigate to={dest} replace />
  }

  return children
}

// ── Route Tree ────────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── 1. Landing Page — standalone layout with its own public navbar ─── */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
      </Route>

      {/* ── 2. Auth pages — standalone, no navbar/footer chrome ────────────── */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* ── 3. Public catalog — MainLayout (shared Navbar + Footer) ────────── */}
      <Route element={<MainLayout />}>
        <Route path="/explore" element={<ExploreCourses />} />
        <Route path="/courses" element={<ExploreCourses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
      </Route>

      {/* ── 4. Distraction-free learning — no sidebar, no footer ───────────── */}
      <Route
        path="/learn/:courseId"
        element={
          <ProtectedRoute>
            <LearningPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/:courseId/lesson/:lessonId"
        element={
          <ProtectedRoute>
            <LearningPage />
          </ProtectedRoute>
        }
      />

      {/* ── 5. Shared portal routes — accessible by BOTH roles ───────────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/certificates" element={<CertificatePage />} />
        <Route path="/certificate/:id" element={<CertificatePage />} />
        <Route path="/ai-tutor" element={<AITutorPage />} />
      </Route>

      {/* ── 6. Student portal — DashboardLayout, STUDENT role only ────────── */}
      <Route
        element={
          <ProtectedRoute role="STUDENT">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/learn/:courseId/quiz" element={<QuizPage />} />
        <Route path="/assignments" element={<AssignmentPage />} />
        <Route path="/assignment/:id" element={<AssignmentPage />} />
        <Route path="/progress" element={<ProgressAnalytics />} />
      </Route>

      {/* ── 7. Instructor portal — DashboardLayout, INSTRUCTOR role only ───── */}
      <Route
        element={
          <ProtectedRoute role="INSTRUCTOR">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/create-course" element={<CreateCoursePage />} />
        {/* Instructor tabs — deep-link support */}
        <Route path="/instructor/analytics" element={<InstructorDashboard />} />
        <Route path="/instructor/ai-tools" element={<InstructorDashboard />} />
      </Route>

      {/* ── 8. Admin portal — DashboardLayout, ADMIN role only ──────────────── */}
      <Route
        element={
          <ProtectedRoute role="ADMIN">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/*
          BUG-05 fix: Admin users now have a valid landing route.
          Replace the inline placeholder with a real AdminDashboard page once built.
        */}
        <Route
          path="/admin/dashboard"
          element={
            <div className="p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-white/60">Platform administration panel — coming soon.</p>
            </div>
          }
        />
      </Route>

      {/* ── 9. Legacy /student alias → /dashboard ───────────────────────────── */}
      <Route path="/student" element={<Navigate to="/dashboard" replace />} />
      <Route path="/instructor" element={<Navigate to="/instructor/dashboard" replace />} />

      {/* ── 10. 404 Catch-All ────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

