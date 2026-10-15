import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Users, BookOpen, DollarSign, Star, PlusCircle, TrendingUp,
  Award, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Zap,
  Edit3, BarChart3, X, LayoutDashboard, Bot, Send, RefreshCw,
  MessageSquare, Target, Clock, Flame,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { instructorDashboardData } from '@/data/mockData'

// ─── Dark stat card ───────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, trend, icon: Icon, glow, gradient }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-5 flex flex-col justify-between hover:border-white/16 transition-all duration-300 hover:-translate-y-0.5 group"
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 8px 30px ${glow}30`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none"
        style={{ background: gradient }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${glow}20`, border: `1px solid ${glow}35` }}>
          <Icon className="w-5 h-5" style={{ color: glow }} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

// ─── Dark card ────────────────────────────────────────────────────────────────
function DarkCard({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── Grading modal ────────────────────────────────────────────────────────────
function GradeModal({ sub, onClose, onSubmit, grade, setGrade, feedback, setFeedback, success }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] shadow-2xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Grade Submission</h3>
            <p className="text-xs text-white/40 mt-0.5">{sub.assignment} · {sub.course}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-emerald-400">Grade submitted successfully!</p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1.5">
                Grade (0–100)
              </label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white text-sm font-bold focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1.5">
                Feedback
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white text-xs resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/8 text-white/50 text-xs font-bold hover:bg-white/5 transition-all cursor-pointer">
                Cancel
              </button>
              <button onClick={onSubmit}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.3)]">
                Submit Evaluation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',   label: 'Overview',   icon: LayoutDashboard },
  { id: 'analytics',  label: 'Analytics',  icon: BarChart3 },
  { id: 'ai-tutor',   label: 'AI Tutor',   icon: Sparkles },
]

// ─── AI chat messages ─────────────────────────────────────────────────────────
const INIT_MESSAGES = [
  {
    role: 'ai',
    text: `Hi! I'm your **Instructor AI Assistant** 🤖\n\nI can help you:\n- Draft quiz questions for any lesson\n- Suggest course structure improvements\n- Analyze student performance patterns\n- Generate course description copy\n\nWhat would you like to work on today?`,
  },
]

// ─── Main component ───────────────────────────────────────────────────────────
export function InstructorDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const stats = instructorDashboardData.stats
  const firstName = user?.name?.split(' ')[0] || 'Instructor'

  // Derive initial tab from URL path
  const getInitialTab = () => {
    if (location.pathname.includes('analytics')) return 'analytics'
    if (location.pathname.includes('ai-tools'))  return 'ai-tutor'
    return 'overview'
  }

  const [activeTab,      setActiveTab]      = useState(getInitialTab)
  const [selectedSub,    setSelectedSub]    = useState(null)
  const [gradeInput,     setGradeInput]     = useState('95')
  const [feedbackInput,  setFeedbackInput]  = useState('Great clean architecture and tests!')
  const [gradeSuccess,   setGradeSuccess]   = useState(false)

  // AI tab state
  const [aiMessages,   setAiMessages]   = useState(INIT_MESSAGES)
  const [aiInput,      setAiInput]      = useState('')
  const [aiLoading,    setAiLoading]    = useState(false)

  const handleGradeSubmit = () => {
    setGradeSuccess(true)
    setTimeout(() => { setGradeSuccess(false); setSelectedSub(null) }, 1500)
  }

  const handleAiSend = () => {
    const text = aiInput.trim()
    if (!text) return
    setAiMessages((prev) => [...prev, { role: 'user', text }])
    setAiInput('')
    setAiLoading(true)
    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Great question! Here's how I'd approach **"${text}"**:\n\n1. Start with clear learning objectives\n2. Break content into 5–10 min segments\n3. Add a knowledge-check quiz after each module\n\nWould you like me to draft specific content for any of these steps?`,
        },
      ])
      setAiLoading(false)
    }, 1200)
  }

  const STATS = [
    { title: 'Total Students',  value: stats.totalStudents.toLocaleString(), subtitle: 'Across 6 active tracks', icon: Users,       glow: '#7c3aed', gradient: 'radial-gradient(#7c3aed, transparent)', trend: '+12% ↑' },
    { title: 'Total Revenue',   value: `$${stats.totalRevenue.toLocaleString()}`, subtitle: 'Net payout: $47,160', icon: DollarSign,  glow: '#10b981', gradient: 'radial-gradient(#10b981, transparent)', trend: '+18% ↑' },
    { title: 'Avg Rating',      value: `${stats.averageRating}★`,             subtitle: 'Based on 3,820 reviews', icon: Star,        glow: '#f59e0b', gradient: 'radial-gradient(#f59e0b, transparent)', trend: 'Top 5%' },
    { title: 'Active Courses',  value: stats.activeCourses,                   subtitle: '1 draft in review',     icon: BookOpen,    glow: '#6366f1', gradient: 'radial-gradient(#6366f1, transparent)', trend: 'All live' },
  ]

  const maxRevenue = Math.max(...instructorDashboardData.revenueTrend.map((m) => m.revenue), 1)

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Ambient orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="fixed bottom-40 left-10 w-72 h-72 rounded-full opacity-4 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />

      {/* ── GREETING BANNER ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-gradient-to-r from-indigo-600/15 via-purple-600/8 to-transparent p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10"
          style={{ background: 'radial-gradient(ellipse at right, #6366f1, transparent)' }} />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-400 border border-purple-500/20">
              Lead Instructor
            </span>
          </div>
          <p className="text-sm text-white/45">
            Your courses enrolled{' '}
            <strong className="text-white/80 font-bold">1,240 new students</strong>
            {' '}this month across all tracks.
          </p>
        </div>
        <Link to="/instructor/create-course" className="relative">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.35)] whitespace-nowrap">
            <PlusCircle className="w-4 h-4" /> Create New Course
          </button>
        </Link>
      </div>

      {/* ── STAT CARDS ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── TAB BAR ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 p-1 rounded-2xl border border-white/8 bg-white/3 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────────────────── */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Revenue chart + Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Revenue bar chart */}
            <div className="lg:col-span-2">
              <DarkCard className="h-full">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Revenue &amp; Growth</p>
                    <h2 className="text-base font-extrabold text-white">Monthly Earnings</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    +24% YoY
                  </span>
                </div>
                <div className="flex items-end justify-between h-48 gap-3 px-1">
                  {instructorDashboardData.revenueTrend.map((m, i) => {
                    const pct = Math.max(8, Math.round((m.revenue / maxRevenue) * 100))
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                        <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                          ${(m.revenue / 1000).toFixed(1)}k
                        </span>
                        <div
                          className="w-full rounded-t-xl relative overflow-hidden cursor-pointer"
                          style={{ height: `${pct}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-purple-500 group-hover/bar:from-indigo-500 group-hover/bar:to-purple-400 transition-colors" />
                        </div>
                        <span className="text-[10px] font-bold text-white/30">{m.month}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-white/6 flex items-center justify-between text-xs">
                  <span className="text-white/35">
                    Next payout: <strong className="text-white/60">Oct 15, 2026</strong>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Stripe Direct Active
                  </span>
                </div>
              </DarkCard>
            </div>

            {/* Student submissions */}
            <DarkCard className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Submissions</p>
                    <h2 className="text-base font-extrabold text-white">Pending Review</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    2 Pending
                  </span>
                </div>
                <div className="space-y-2.5">
                  {instructorDashboardData.recentSubmissions.map((sub) => (
                    <div key={sub.id}
                      className="p-3 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{sub.student}</span>
                        <span className="text-[10px] text-white/25">{sub.submittedAt}</span>
                      </div>
                      <p className="text-[11px] text-white/50 truncate">{sub.assignment}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-white/25">{sub.course}</span>
                        {sub.grade ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            ✓ {sub.grade}
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="text-[10px] font-bold text-purple-400 border border-purple-500/25 bg-purple-500/10 px-2.5 py-1 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer"
                          >
                            Grade Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 rounded-xl border border-white/8 text-white/40 text-xs font-bold hover:bg-white/5 hover:text-white/70 transition-all cursor-pointer">
                View All Submissions →
              </button>
            </DarkCard>
          </div>

          {/* Course performance table */}
          <DarkCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Performance</p>
                <h2 className="text-base font-extrabold text-white">Course Analytics</h2>
              </div>
              <Link to="/instructor/create-course">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/8 text-xs font-bold text-white/60 hover:bg-white/8 hover:text-white transition-all cursor-pointer">
                  <PlusCircle className="w-3.5 h-3.5" /> New Course
                </button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Course Title', 'Students', 'Completion', 'Rating', 'Revenue', 'Status', ''].map((h) => (
                      <th key={h} className="pb-3 px-3 text-[10px] font-black uppercase tracking-widest text-white/25">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {instructorDashboardData.coursePerformance.map((c) => (
                    <tr key={c.id} className="hover:bg-white/3 transition-colors group">
                      <td className="py-3.5 px-3 text-xs font-bold text-white/80 max-w-[200px] truncate group-hover:text-white transition-colors">
                        {c.title}
                      </td>
                      <td className="py-3.5 px-3 text-xs font-semibold text-white/50">{c.students.toLocaleString()}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50 font-semibold">{c.completionRate}%</span>
                          <div className="w-16 h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{ width: `${c.completionRate}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs font-black text-amber-400">★ {c.rating}</td>
                      <td className="py-3.5 px-3 text-xs font-extrabold text-emerald-400">{c.revenue}</td>
                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${
                          c.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button className="text-[10px] font-bold text-purple-400 border border-purple-500/20 bg-purple-500/8 px-2.5 py-1 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DarkCard>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg Watch Time',    value: '48 min',  sub: 'per session',        color: '#7c3aed', icon: Clock },
              { label: 'Completion Rate',   value: '76%',     sub: '+4% vs last month',  color: '#10b981', icon: Target },
              { label: 'Active Learners',   value: '1,082',   sub: 'last 30 days',       color: '#f59e0b', icon: Flame },
              { label: 'Quiz Pass Rate',    value: '88%',     sub: 'avg across courses', color: '#6366f1', icon: Award },
            ].map(({ label, value, sub, color, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/4 p-5 hover:border-white/16 transition-all hover:-translate-y-0.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <div className="text-2xl font-extrabold text-white">{value}</div>
                <div className="text-xs font-semibold text-white/50 mt-0.5">{label}</div>
                <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Student engagement funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <DarkCard>
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Engagement</p>
              <h2 className="text-base font-extrabold text-white mb-5">Student Engagement Funnel</h2>
              <div className="space-y-3">
                {[
                  { label: 'Enrolled',          value: 2840, pct: 100, color: '#7c3aed' },
                  { label: 'Started Course',     value: 2480, pct: 87,  color: '#6366f1' },
                  { label: 'Reached 50%',        value: 1820, pct: 64,  color: '#3b82f6' },
                  { label: 'Completed',          value: 1080, pct: 38,  color: '#10b981' },
                  { label: 'Left a Review',      value: 540,  pct: 19,  color: '#f59e0b' },
                ].map(({ label, value, pct, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/60">{label}</span>
                      <span className="text-xs font-bold text-white/70">{value.toLocaleString()} <span className="text-white/25">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-white/6 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </DarkCard>

            {/* Revenue by course */}
            <DarkCard>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Breakdown</p>
              <h2 className="text-base font-extrabold text-white mb-5">Revenue by Course</h2>
              <div className="space-y-3">
                {instructorDashboardData.coursePerformance.map((c, i) => {
                  const maxRev = 32000
                  const rawRev = parseInt(c.revenue.replace(/[$,]/g, '')) || 0
                  const pct = Math.round((rawRev / maxRev) * 100)
                  const colors = ['#7c3aed', '#10b981', '#f59e0b', '#6366f1', '#3b82f6']
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60 truncate max-w-[180px]">{c.title}</span>
                        <span className="text-xs font-extrabold text-emerald-400">{c.revenue}</span>
                      </div>
                      <div className="w-full h-2 bg-white/6 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.max(5, pct)}%`, background: colors[i % colors.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </DarkCard>
          </div>

          {/* Top performing lesson table */}
          <DarkCard>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Insights</p>
            <h2 className="text-base font-extrabold text-white mb-5">Top Performing Lessons</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Lesson', 'Course', 'Avg Watch %', 'Quiz Score', 'Likes'].map((h) => (
                      <th key={h} className="pb-3 px-3 text-[10px] font-black uppercase tracking-widest text-white/25">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {[
                    { lesson: 'Polymorphism Deep Dive',          course: 'Java OOP',        watch: 94, quiz: 91, likes: 412 },
                    { lesson: 'JWT Auth with FastAPI',            course: 'React & FastAPI', watch: 88, quiz: 85, likes: 371 },
                    { lesson: 'RAG Pipeline from Scratch',        course: 'Applied GenAI',   watch: 91, quiz: 88, likes: 398 },
                    { lesson: 'Kubernetes Cluster Setup',         course: 'Cloud & DevOps',  watch: 85, quiz: 79, likes: 284 },
                    { lesson: 'B-Tree Index Internals',           course: 'High Perf SQL',   watch: 87, quiz: 83, likes: 317 },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <td className="py-3.5 px-3 text-xs font-bold text-white/80">{row.lesson}</td>
                      <td className="py-3.5 px-3 text-xs text-white/40">{row.course}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-400">{row.watch}%</span>
                          <div className="w-14 h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${row.watch}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs font-bold text-amber-400">{row.quiz}%</td>
                      <td className="py-3.5 px-3 text-xs font-bold text-white/50">❤️ {row.likes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DarkCard>
        </div>
      )}

      {/* AI TUTOR TAB */}
      {activeTab === 'ai-tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[600px]">
          {/* Chat panel */}
          <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-white/4 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-white/6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.35)]">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">Instructor AI Assistant</p>
                <p className="text-[10px] text-white/30">Powered by Gemini Pro · Ready to help</p>
              </div>
              <button
                onClick={() => setAiMessages(INIT_MESSAGES)}
                className="ml-auto p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
                title="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white/6 border border-white/8 text-white/80 rounded-tl-sm'
                  }`}>
                    {msg.text.split('\n').map((line, j) => (
                      <span key={j}>
                        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                        {j < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/25 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="bg-white/6 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {['Generate quiz questions', 'Write course description', 'Suggest lesson structure', 'Analyze student feedback'].map((p) => (
                <button
                  key={p}
                  onClick={() => setAiInput(p)}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/4 text-white/40 hover:border-purple-500/25 hover:text-purple-300 hover:bg-purple-500/8 transition-all cursor-pointer whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-white/6 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                placeholder="Ask anything about your courses..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
              />
              <button
                onClick={handleAiSend}
                disabled={!aiInput.trim() || aiLoading}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* AI capabilities */}
            <DarkCard>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-extrabold text-white/70">AI Capabilities</span>
              </div>
              <div className="space-y-2">
                {[
                  { icon: '📝', label: 'Quiz generation', desc: 'Auto-generate MCQs & short answers' },
                  { icon: '📣', label: 'Course copy',     desc: 'Write titles, descriptions, CTAs' },
                  { icon: '🗺️', label: 'Curriculum planning', desc: 'Structure learning paths' },
                  { icon: '📊', label: 'Feedback analysis', desc: 'Summarize student reviews' },
                  { icon: '🎯', label: 'Objective writing', desc: 'SMART learning objective drafts' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/3 hover:bg-white/6 transition-colors">
                    <span className="text-base leading-none">{icon}</span>
                    <div>
                      <p className="text-xs font-bold text-white/70">{label}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DarkCard>

            {/* Quick actions */}
            <DarkCard>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">Quick Actions</p>
              <div className="space-y-2">
                {[
                  'Draft 10 Java OOP quiz questions',
                  'Summarize this week\'s reviews',
                  'Suggest next course topic',
                  'Write welcome email template',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setAiInput(q); setActiveTab('ai-tutor') }}
                    className="w-full text-left text-xs text-white/50 px-3 py-2.5 rounded-xl border border-white/6 hover:border-purple-500/20 hover:text-purple-300 hover:bg-purple-500/8 transition-all cursor-pointer"
                  >
                    {q} →
                  </button>
                ))}
              </div>
            </DarkCard>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {selectedSub && (
        <GradeModal
          sub={selectedSub}
          onClose={() => setSelectedSub(null)}
          onSubmit={handleGradeSubmit}
          grade={gradeInput}
          setGrade={setGradeInput}
          feedback={feedbackInput}
          setFeedback={setFeedbackInput}
          success={gradeSuccess}
        />
      )}
    </div>
  )
}

export default InstructorDashboard
