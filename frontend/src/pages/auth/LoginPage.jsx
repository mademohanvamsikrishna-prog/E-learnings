import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff,
  Sparkles, BookOpen, Briefcase, Zap, CheckCircle2,
  AlertCircle, Star, Play, TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLES = [
  {
    key: 'STUDENT',
    label: 'Student',
    icon: BookOpen,
    tagline: 'Continue your learning journey',
    demoEmail: 'alex.johnson@example.com',
    demoPassword: 'student2026',
    redirectTo: '/dashboard',
    ctaLabel: 'Sign in to Student Hub',
    features: ['AI study plan & tutor', 'HD video courses', 'Verified certificates'],
    stats: [
      { val: '50K+', lbl: 'Learners' },
      { val: '4.9★', lbl: 'Rating' },
      { val: '500+', lbl: 'Courses' },
    ],
  },
  {
    key: 'INSTRUCTOR',
    label: 'Instructor',
    icon: Briefcase,
    tagline: 'Manage your courses & students',
    demoEmail: 'sarah.connor@example.com',
    demoPassword: 'instructor2026',
    redirectTo: '/instructor/dashboard',
    ctaLabel: 'Enter Instructor Portal',
    features: ['Course creation studio', 'Student analytics', 'AI quiz generation'],
    stats: [
      { val: '500+', lbl: 'Courses built' },
      { val: '12K+', lbl: 'Students taught' },
      { val: '$0', lbl: 'Revenue cut' },
    ],
  },
]

// ─── Mini course card for left panel decoration ───────────────────────────────
const PREVIEW_COURSES = [
  { title: 'Mastering React 19 & Next.js', progress: 68, rating: 4.9, tag: '⚡ React' },
  { title: 'Python for AI & ML Engineering', progress: 42, rating: 4.8, tag: '🤖 AI/ML' },
  { title: 'Full-Stack FastAPI + Postgres', progress: 91, rating: 4.9, tag: '🐍 Python' },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('STUDENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [forgotNotice, setForgotNotice] = useState(false)

  const cfg = ROLES.find((r) => r.key === role)

  // Switching the role toggle only changes the UI context — credentials must
  // always come from the user. Role is determined by the server after login.
  const switchRole = (r) => {
    setRole(r)
    setErrors({})
  }

  // BUG-22: show a notice instead of following the dead # link
  const handleForgotPassword = (e) => {
    e.preventDefault()
    setForgotNotice(true)
    setTimeout(() => setForgotNotice(false), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email'
    if (!password) errs.password = 'Password is required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setErrors({})
    setLoading(true)
    try {
      // BUG-07: pass 'remember' so AuthContext stores in sessionStorage when false
      // BUG-05: ADMIN role now maps to /admin/dashboard; others to their portals
      const profile = await login({ email, password, remember })
      let redirectTo = '/dashboard'
      if (profile.role === 'INSTRUCTOR') redirectTo = '/instructor/dashboard'
      else if (profile.role === 'ADMIN') redirectTo = '/admin/dashboard'
      navigate(redirectTo)
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        'Invalid credentials. Please try again.'
      setErrors({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0a] text-white overflow-hidden">

      {/* ── Background orbs ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="orb absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="orb orb-delay absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── LEFT: Visual Panel ────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 xl:p-16 z-10">

        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            EduSpire <span className="text-white/30">PRO</span>
          </span>
        </Link>

        {/* Center content */}
        <div className="space-y-10 max-w-lg">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/8 text-xs font-semibold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {role === 'STUDENT' ? '50,000+ students learning right now' : '1,200+ instructors teaching today'}
          </div>

          {/* Big headline */}
          <div>
            <h1 className="text-5xl xl:text-6xl font-extrabold tracking-[-0.04em] leading-[1.04]">
              {role === 'STUDENT' ? (
                <>
                  Learn faster.<br />
                  <span className="text-white/35">Build smarter.</span><br />
                  <span className="text-glow-gradient">Get hired.</span>
                </>
              ) : (
                <>
                  Teach what<br />
                  <span className="text-white/35">you love.</span><br />
                  <span className="text-glow-gradient">Earn more.</span>
                </>
              )}
            </h1>
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            {cfg.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-white/55">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex gap-6 pt-2 border-t border-white/6">
            {cfg.stats.map((s) => (
              <div key={s.lbl}>
                <div className="text-2xl font-extrabold text-white tracking-tight">{s.val}</div>
                <div className="text-xs text-white/35 mt-0.5">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Course preview cards */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-3">
              {role === 'STUDENT' ? 'Continue where you left off' : 'Your recent courses'}
            </p>
            {PREVIEW_COURSES.map((c, i) => (
              <div
                key={c.title}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/6 bg-white/4 backdrop-blur-sm hover:border-white/12 hover:bg-white/6 transition-all duration-200 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-500/20 flex items-center justify-center flex-none">
                  <Play className="w-4 h-4 text-purple-300 fill-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white/70 truncate group-hover:text-white/90 transition-colors">
                    {c.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/30 font-medium shrink-0">{c.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400">{c.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="border-l-2 border-purple-500/30 pl-4">
          <p className="text-sm text-white/35 italic leading-relaxed">
            {role === 'STUDENT'
              ? '"The AI tutor explains things better than my university professor. I went from CGPA 7 to a Stripe internship in 6 months."'
              : '"I published my first course in a weekend. 3,200 enrollments in the first month. Zero revenue cut to the platform."'}
          </p>
          <div className="mt-2 text-xs font-bold text-white/25">
            {role === 'STUDENT' ? '— Alex Johnson, Backend Intern @ Stripe' : '— Sarah Connor, Senior Instructor'}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-[48%] flex items-center justify-center p-6 sm:p-10">

        {/* Frosted glass form card */}
        <div className="w-full max-w-[420px] rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-8 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.5)]">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base">EduSpire PRO</span>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome back</h2>
            <p className="text-sm text-white/40 mt-1">{cfg.tagline}</p>
          </div>

          {/* ── Role Toggle ─────────────────────────────────────────────── */}
          <div className="bg-white/5 border border-white/8 rounded-xl p-1 flex gap-1 mb-6" role="tablist">
            {ROLES.map((r) => {
              const Icon = r.icon
              const isActive = role === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  id={`login-tab-${r.key.toLowerCase()}`}
                  onClick={() => switchRole(r.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/12 shadow-sm'
                      : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-white/25'}`} />
                  {r.label}
                </button>
              )
            })}
          </div>

          {/* Demo hint */}
          <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-purple-500/8 border border-purple-500/15 mb-6">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-white/50 leading-relaxed">
              <span className="font-bold text-white/70">Demo credentials pre-filled.</span>{' '}
              Just click <span className="text-purple-300 font-semibold">Sign In</span> to explore.
            </p>
          </div>

          {/* Form error */}
          {errors.form && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.form}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/6 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/8 transition-all ${
                    errors.email
                      ? 'border-red-500/40 focus:border-red-500/60'
                      : 'border-white/8 focus:border-purple-500/50'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white/6 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/8 transition-all ${
                    errors.password
                      ? 'border-red-500/40 focus:border-red-500/60'
                      : 'border-white/8 focus:border-purple-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="login-remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/30"
                />
                <span className="text-xs text-white/40">Remember me</span>
              </label>
              {/* BUG-22: not a dead # link anymore */}
              <button
                type="button"
                id="login-forgot-btn"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
              {forgotNotice && (
                <span className="absolute right-0 top-8 z-20 px-3 py-1.5 rounded-lg bg-purple-600/90 text-white text-xs font-semibold shadow-lg whitespace-nowrap animate-fade-in">
                  Password reset coming soon!
                </span>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.55)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)' }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  {cfg.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="px-3 text-[10px] uppercase tracking-widest font-semibold text-white/20">
              or
            </span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Google */}
          <button
            type="button"
            id="login-google-btn"
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/16 text-sm font-semibold text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 flex-none" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-white/30 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
