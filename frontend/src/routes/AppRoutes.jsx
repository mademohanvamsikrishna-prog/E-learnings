import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// ── Layouts ──────────────────────────────────────────────────────────────────
import MainLayout from '@/layouts/MainLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// ── 15 Screens (Exact Order) ─────────────────────────────────────────────────
// 1. Landing Page
import LandingPage from '@/pages/LandingPage'
// 2. Login
import LoginPage from '@/pages/auth/LoginPage'
// 3. Register
import RegisterPage from '@/pages/auth/RegisterPage'
// 4. Student Dashboard
import StudentDashboard from '@/pages/student/StudentDashboard'
// 5. Explore Courses
import ExploreCourses from '@/pages/courses/ExploreCourses'
// 6. Course Details
import CourseDetails from '@/pages/courses/CourseDetails'
// 7. My Courses
import MyCourses from '@/pages/student/MyCourses'
// 8. Learning Page
import LearningPage from '@/pages/learn/LearningPage'
// 9. Quiz Page
import QuizPage from '@/pages/quiz/QuizPage'
// 10. Assignment Page
import AssignmentPage from '@/pages/assignments/AssignmentPage'
// 11. Progress / Analytics
import ProgressAnalytics from '@/pages/progress/ProgressAnalytics'
// 12. Certificate
import CertificatePage from '@/pages/certificates/CertificatePage'
// 13. AI Tutor
import AITutorPage from '@/pages/ai/AITutorPage'
// 14. Instructor Dashboard
import InstructorDashboard from '@/pages/instructor/InstructorDashboard'
// 15. Create Course
import CreateCoursePage from '@/pages/instructor/CreateCoursePage'

// ── Fallback Error Page ──────────────────────────────────────────────────────
import NotFoundPage from '@/pages/errors/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public / Catalog Layout (Navbar + Footer) ────────────────────────── */}
      <Route element={<MainLayout />}>
        {/* 1. Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* 5. Explore Courses */}
        <Route path="/explore" element={<ExploreCourses />} />
        <Route path="/courses" element={<ExploreCourses />} />

        {/* 6. Course Details */}
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
      </Route>

      {/* ── Auth Screens (Standalone Split View) ─────────────────────────────── */}
      {/* 2. Login */}
      <Route path="/login" element={<LoginPage />} />
      {/* 3. Register */}
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Distraction-Free Learning Screen ─────────────────────────────────── */}
      {/* 8. Learning Page */}
      <Route path="/learn/:courseId" element={<LearningPage />} />
      <Route path="/learn/:courseId/lesson/:lessonId" element={<LearningPage />} />

      {/* ── Authenticated App Layout (Navbar + Responsive Sidebar) ────────────── */}
      <Route element={<DashboardLayout />}>
        {/* 4. Student Dashboard */}
        <Route path="/dashboard" element={<StudentDashboard />} />

        {/* 7. My Courses */}
        <Route path="/my-courses" element={<MyCourses />} />

        {/* 9. Quiz Page */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/learn/:courseId/quiz" element={<QuizPage />} />

        {/* 10. Assignment Page */}
        <Route path="/assignments" element={<AssignmentPage />} />
        <Route path="/assignment/:id" element={<AssignmentPage />} />

        {/* 11. Progress / Analytics */}
        <Route path="/progress" element={<ProgressAnalytics />} />

        {/* 12. Certificate */}
        <Route path="/certificates" element={<CertificatePage />} />
        <Route path="/certificate/:id" element={<CertificatePage />} />

        {/* 13. AI Tutor */}
        <Route path="/ai-tutor" element={<AITutorPage />} />

        {/* 14. Instructor Dashboard */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />

        {/* 15. Create Course */}
        <Route path="/instructor/create-course" element={<CreateCoursePage />} />
      </Route>

      {/* ── 404 Catch-All ───────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
