import { Link } from 'react-router-dom'
import {
  Flame,
  Clock,
  BookOpen,
  Award,
  PlayCircle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart2,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { enrolledCourses, analyticsData, mockAssignments } from '@/data/mockData'
import {
  StatCard,
  Card,
  CardHeader,
  CardContent,
  ProgressBar,
  Badge,
  Button,
  CourseProgress,
} from '@/components'

export function StudentDashboard() {
  const { user } = useAuth()
  const student = user || { name: 'Alex' }

  // Primary active course to resume
  const activeCourse = enrolledCourses[0]
  const otherEnrolledCourses = enrolledCourses.slice(1, 3)

  // Pending assignments and quizzes
  const pendingAssignments = mockAssignments.filter((a) => a.status !== 'Graded')

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ─── Top Greeting Banner ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, {student.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <Badge variant="success" size="sm" withDot>
              Active Learner
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You're on a <strong className="text-amber-600 font-semibold">14-day study streak</strong>! Complete today's target to keep the momentum going.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/ai-tutor">
            <Button variant="outline" size="sm" icon={Sparkles} className="text-purple-700 border-purple-200 hover:bg-purple-50">
              Ask AI Tutor
            </Button>
          </Link>
          <Link to="/explore">
            <Button size="sm" icon={BookOpen}>
              Explore Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── Learning Statistics Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Courses Enrolled"
          value={student.enrolledCount || 4}
          subtitle="3 currently active"
          icon={BookOpen}
          color="indigo"
          trend="+1 this month"
          trendPositive
        />
        <StatCard
          title="Hours Learned"
          value={`${student.hoursLearned || 48.5}h`}
          subtitle="12.5 hrs this week"
          icon={Clock}
          color="emerald"
          trend="+18% vs last week"
          trendPositive
        />
        <StatCard
          title="Study Streak"
          value={`${student.streakDays || 14} Days`}
          subtitle="Personal best record!"
          icon={Flame}
          color="amber"
          trend="Streak Safe"
          trendPositive
        />
        <StatCard
          title="Certificates"
          value={student.certificatesCount || 2}
          subtitle="Verified credentials"
          icon={Award}
          color="purple"
          trend="2 Completed"
          trendPositive
        />
      </div>

      {/* ─── Hero Continue Learning Card & Today's Goal ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Featured Card (2 Cols) */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader
              title="Continue Learning"
              subtitle="Pick up right where you left off"
              action={
                <Badge variant="primary" size="sm">
                  {activeCourse.category}
                </Badge>
              }
            />

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <img
                  src={activeCourse.thumbnail}
                  alt={activeCourse.title}
                  className="w-full sm:w-44 aspect-video sm:h-28 object-cover rounded-xl border border-slate-200/80 shadow-2xs"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-2xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                    Lesson In Progress
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                    {activeCourse.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                    <PlayCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Current: {activeCourse.lastLesson}</span>
                  </p>
                  <p className="text-2xs text-slate-400 mt-1">
                    Instructor: {activeCourse.instructor} • {activeCourse.completedLessons} of {activeCourse.totalLessons} lessons completed
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <ProgressBar
                  value={activeCourse.progress}
                  showPercentage
                  label="Course Completion Progress"
                  color="indigo"
                  size="md"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Estimated time remaining: <strong>4.5 Hours</strong>
              </span>

              <Link to={`/learn/${activeCourse.id}`}>
                <Button variant="primary" size="md" icon={PlayCircle} className="font-semibold shadow-xs">
                  Resume Lesson
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Today's Goal Card (1 Col) */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Today's Goal"
                subtitle="Daily learning target"
                action={<span className="text-xs font-bold text-indigo-600">80% Done</span>}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Time spent learning</span>
                  <span className="font-bold text-slate-900">40 / 50 Mins</span>
                </div>

                <ProgressBar
                  value={80}
                  color="emerald"
                  size="lg"
                />

                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Just <strong>10 minutes</strong> more to hit your daily goal and extend your streak!
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link to="/ai-tutor">
                <Button variant="secondary" size="sm" className="w-full" icon={Sparkles}>
                  Practice with AI (10 min)
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── My Courses & Upcoming Deadlines Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In-Progress Courses List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                My Enrolled Courses
              </h2>
              <p className="text-xs text-slate-500">Track your ongoing learning programs</p>
            </div>

            <Link to="/my-courses" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All ({enrolledCourses.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {enrolledCourses.map((c) => (
              <CourseProgress key={c.id} course={c} />
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines & Quizzes (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Upcoming Schedule
              </h2>
              <p className="text-xs text-slate-500">Deadlines and pending quizzes</p>
            </div>

            <Link to="/assignments" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Assignments
            </Link>
          </div>

          <div className="space-y-3">
            {/* Assignment 1 */}
            <Card padding="p-4" className="border-l-4 border-l-amber-500">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="warning" size="sm">Due in 2 days</Badge>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                    Assignment 2: E-Commerce Checkout Engine
                  </h4>
                  <p className="text-2xs text-slate-500 mt-1">Mastering Java & OOP</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-2xs text-slate-400">100 Points</span>
                <Link to="/assignments">
                  <Button variant="outline" size="sm" className="text-2xs py-1 px-2.5">
                    View Task
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Quiz 1 */}
            <Card padding="p-4" className="border-l-4 border-l-indigo-500">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="primary" size="sm">Knowledge Check</Badge>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                    Quiz: Module 2 OOP Architecture
                  </h4>
                  <p className="text-2xs text-slate-500 mt-1">10 Questions • 15 Mins</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-2xs text-slate-400">Passing: 70%</span>
                <Link to="/quiz/quiz-java-oop">
                  <Button variant="primary" size="sm" className="text-2xs py-1 px-2.5">
                    Start Quiz
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Weekly Activity Visual */}
            <Card padding="p-4">
              <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Weekly Activity</span>
                <span className="text-2xs font-normal text-slate-500">Mon - Sun</span>
              </h4>

              <div className="flex items-end justify-between h-24 gap-2 pt-2">
                {analyticsData.weeklyActivity.map((w, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className="w-full rounded-t-md bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer relative group"
                      style={{ height: `${(w.hours / 7) * 100}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-2xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {w.hours}h
                      </span>
                    </div>
                    <span className="text-2xs font-medium text-slate-500">{w.day}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
