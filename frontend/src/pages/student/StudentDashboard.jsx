import { Link } from 'react-router-dom'
import {
  Flame, Clock, BookOpen, Award, PlayCircle, ArrowRight,
  CheckCircle2, Sparkles, BarChart2, Star, Zap, TrendingUp,
  Target,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { enrolledCourses, analyticsData, mockAssignments } from '@/data/mockData'

// ─── Reusable dark stat card ─────────────────────────────────────────────────
function DarkStatCard({ title, value, subtitle, trend, icon: Icon, gradient, glow }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/8 p-5 flex flex-col justify-between bg-white/4 backdrop-blur-sm hover:border-white/16 transition-all duration-300 hover:-translate-y-0.5 group`}
      style={{ boxShadow: `0 0 0 0 ${glow}` }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 8px 30px ${glow}`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
    >
      {/* Gradient orb background */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{ background: gradient }} />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${gradient}30`, border: `1px solid ${glow}40` }}
        >
          <Icon className="w-5 h-5" style={{ color: glow }} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{value}</div>
        <div className="text-xs font-semibold text-white/50 mt-0.5">{title}</div>
        {subtitle && <div className="text-[10px] text-white/25 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  )
}

// ─── Dark card wrapper ────────────────────────────────────────────────────────
function DarkCard({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function DarkProgress({ value, color = 'from-purple-500 to-indigo-500', height = 'h-2' }) {
  return (
    <div className={`w-full ${height} bg-white/8 rounded-full overflow-hidden`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export function StudentDashboard() {
  const { user } = useAuth()
  const student = user || { name: 'Alex' }
  const firstName = student.name?.split(' ')[0] || 'Student'

  const activeCourse  = enrolledCourses[0]
  const otherCourses  = enrolledCourses.slice(1, 4)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const weekDays = analyticsData?.weeklyActivity || [
    { day: 'M', hours: 2.5 }, { day: 'T', hours: 4 }, { day: 'W', hours: 1.5 },
    { day: 'T', hours: 5 },   { day: 'F', hours: 3 }, { day: 'S', hours: 2 },
    { day: 'S', hours: 0.5 },
  ]
  const maxHours = Math.max(...weekDays.map((d) => d.hours), 1)

  const STATS = [
    { title: 'Enrolled Courses', value: student.enrolledCount || 4,    subtitle: '3 active right now',     icon: BookOpen,  gradient: 'radial-gradient(#7c3aed, transparent)', glow: '#7c3aed', trend: '+1 this month' },
    { title: 'Hours Learned',    value: `${student.hoursLearned || 48.5}h`, subtitle: '12.5h this week',  icon: Clock,     gradient: 'radial-gradient(#10b981, transparent)', glow: '#10b981', trend: '+18% ↑' },
    { title: 'Study Streak',     value: `${student.streakDays || 14}d`, subtitle: 'Personal best!',         icon: Flame,     gradient: 'radial-gradient(#f59e0b, transparent)', glow: '#f59e0b', trend: '🔥 On Fire' },
    { title: 'Certificates',     value: student.certificatesCount || 2,  subtitle: 'Verified credentials',   icon: Award,     gradient: 'radial-gradient(#6366f1, transparent)', glow: '#6366f1', trend: '2 earned' },
  ]

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Ambient background orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="fixed bottom-40 left-10 w-80 h-80 rounded-full opacity-4 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

      {/* ── GREETING BANNER ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-transparent p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10"
          style={{ background: 'radial-gradient(ellipse at right, #7c3aed, transparent)' }} />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, {firstName} 👋
            </h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Active Learner
            </span>
          </div>
          <p className="text-sm text-white/45">
            You're on a{' '}
            <strong className="text-amber-400 font-bold">14-day streak 🔥</strong>
            {' '}— just 10 more mins to keep it going!
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative">
          <Link to="/ai-tutor">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/25 bg-purple-500/10 text-purple-300 text-xs font-bold hover:bg-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" /> Ask AI Tutor
            </button>
          </Link>
          <Link to="/explore">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0a0a0a] text-xs font-bold hover:bg-purple-50 transition-all cursor-pointer shadow-sm">
              <BookOpen className="w-3.5 h-3.5" /> Explore Courses
            </button>
          </Link>
        </div>
      </div>

      {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => <DarkStatCard key={s.title} {...s} />)}
      </div>

      {/* ── CONTINUE LEARNING + TODAY'S GOAL ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Resume learning hero card */}
        <div className="lg:col-span-2">
          <DarkCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Continue Learning</p>
                  <h2 className="text-base font-extrabold text-white">Pick up right where you left off</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  {activeCourse?.category || 'Java'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative flex-none">
                  <img
                    src={activeCourse?.thumbnail || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400'}
                    alt={activeCourse?.title}
                    className="w-full sm:w-44 h-28 object-cover rounded-xl border border-white/8"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">In Progress</span>
                  <h3 className="text-sm font-bold text-white mt-0.5 truncate">{activeCourse?.title}</h3>
                  <p className="text-xs text-white/40 mt-1 flex items-center gap-1.5 truncate">
                    <PlayCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{activeCourse?.lastLesson || 'Module 3: Inheritance & Polymorphism'}</span>
                  </p>
                  <p className="text-[10px] text-white/25 mt-1">
                    by {activeCourse?.instructor} · {activeCourse?.completedLessons}/{activeCourse?.totalLessons} lessons
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/4 border border-white/6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/50">Course Progress</span>
                  <span className="text-purple-400 font-bold">{activeCourse?.progress || 68}%</span>
                </div>
                <DarkProgress value={activeCourse?.progress || 68} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/6">
              <span className="text-xs text-white/35">
                Est. remaining: <strong className="text-white/60">4.5 hours</strong>
              </span>
              <Link to={`/learn/${activeCourse?.id}`}>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.35)]">
                  <PlayCircle className="w-4 h-4" /> Resume Lesson
                </button>
              </Link>
            </div>
          </DarkCard>
        </div>

        {/* Today's Goal */}
        <DarkCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Today's Goal</p>
                <h2 className="text-base font-extrabold text-white">Daily target</h2>
              </div>
              <span className="text-sm font-black text-emerald-400">80%</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Time spent</span>
                <span className="font-bold text-white">40 / 50 mins</span>
              </div>
              <DarkProgress value={80} color="from-emerald-500 to-teal-500" height="h-3" />

              <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>Just <strong>10 more minutes</strong> to hit your goal and extend your streak!</span>
              </div>
            </div>

            {/* Radial progress visual */}
            <div className="flex justify-center my-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="url(#grad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${80 * 2.51} ${(100 - 80) * 2.51}`}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white">80%</span>
                  <span className="text-[10px] text-white/30">done</span>
                </div>
              </div>
            </div>
          </div>

          <Link to="/ai-tutor">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/8 text-purple-300 text-xs font-bold hover:bg-purple-500/15 transition-all cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" /> Practice with AI (10 min)
            </button>
          </Link>
        </DarkCard>
      </div>

      {/* ── MY COURSES + SCHEDULE ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Enrolled courses */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">My Enrolled Courses</h2>
              <p className="text-[11px] text-white/30">Track your progress across all programs</p>
            </div>
            <Link to="/my-courses" className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {enrolledCourses.map((c) => (
              <Link to={`/learn/${c.id}`} key={c.id} className="block group">
                <div className="flex gap-3 p-3.5 rounded-2xl border border-white/6 bg-white/3 hover:border-purple-500/25 hover:bg-purple-500/5 transition-all duration-200">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-16 h-12 rounded-xl object-cover border border-white/8 flex-none group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white/80 group-hover:text-white transition-colors truncate">{c.title}</h4>
                      <span className="text-xs font-black text-purple-400 shrink-0">{c.progress}%</span>
                    </div>
                    <p className="text-[10px] text-white/30 mt-0.5 truncate">by {c.instructor}</p>
                    <div className="mt-2">
                      <DarkProgress value={c.progress} height="h-1.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400">{c.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column: assignments + weekly chart */}
        <div className="space-y-4">
          {/* Assignment card */}
          <DarkCard className="border-l-4 border-l-amber-500/70">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Due in 2 days</span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Assignment 2: E-Commerce Checkout Engine</h4>
            <p className="text-[10px] text-white/30 mb-3">Mastering Java &amp; OOP · 100 Points</p>
            <Link to="/assignments">
              <button className="text-[11px] font-bold text-amber-400 border border-amber-500/20 bg-amber-500/8 px-3 py-1.5 rounded-lg hover:bg-amber-500/15 transition-colors cursor-pointer">
                View Task →
              </button>
            </Link>
          </DarkCard>

          {/* Quiz card */}
          <DarkCard className="border-l-4 border-l-indigo-500/70">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Knowledge Check</span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Quiz: Module 2 OOP Architecture</h4>
            <p className="text-[10px] text-white/30 mb-3">10 Questions · 15 Mins · Passing: 70%</p>
            <Link to="/quiz/quiz-java-oop">
              <button className="text-[11px] font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity cursor-pointer shadow-sm">
                Start Quiz →
              </button>
            </Link>
          </DarkCard>

          {/* Weekly activity bar chart */}
          <DarkCard>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-white">Weekly Activity</h4>
              <span className="text-[10px] text-white/25">Mon – Sun</span>
            </div>
            <div className="flex items-end justify-between h-20 gap-1.5">
              {weekDays.map((w, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group/bar">
                  <div className="relative w-full rounded-t-lg overflow-hidden"
                    style={{ height: `${(w.hours / maxHours) * 100}%`, minHeight: '4px' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-indigo-500 group-hover/bar:from-purple-500 group-hover/bar:to-indigo-400 transition-colors" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {w.hours}h
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-white/25">{w.day}</span>
                </div>
              ))}
            </div>
          </DarkCard>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
