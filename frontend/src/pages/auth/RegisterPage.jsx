import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap, Mail, Lock, User, ArrowRight, Eye, EyeOff,
  Sparkles, BookOpen, Briefcase, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const ROLES = [
  {
    key: 'STUDENT',
    label: 'Student',
    sublabel: 'Learn & earn certificates',
    icon: BookOpen,
    headline: <>Join 50K+<br /><span className="text-white/35">learners already</span><br /><span className="text-glow-gradient">levelling up.</span></>,
    perks: ['AI-powered study plan', 'Hands-on project courses', 'LinkedIn-shareable certs'],
    ctaLabel: 'Create Student Account',
  },
  {
    key: 'INSTRUCTOR',
    label: 'Instructor',
    sublabel: 'Teach & earn revenue',
    icon: Briefcase,
    headline: <>Share your<br /><span className="text-white/35">expertise with</span><br /><span className="text-glow-gradient">the world.</span></>,
    perks: ['AI quiz & content tools', 'Student analytics dashboard', 'Direct payout, no cuts'],
    ctaLabel: 'Create Instructor Account',
  },
]

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('STUDENT')
  const [name, setName] = useState('')        // maps to full_name
  const [username, setUsername] = useState('') // required by backend
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const cfg = ROLES.find((r) => r.key === role)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required'
    if (!username.trim()) errs.username = 'Username is required'
    else if (username.trim().length < 3) errs.username = 'Min 3 characters'
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Min 8 characters'
    if (password !== confirm) errs.confirm = 'Passwords do not match'
    if (!agreeTerms) errs.terms = 'You must agree to continue'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setErrors({})
    setLoading(true)
    try {
      // Backend UserCreate: { email, username, full_name, password, role }
      const profile = await register({
        email,
        username: username.trim(),
        full_name: name.trim(),
        password,
        role,
      })
      const redirectTo = profile.role === 'INSTRUCTOR' ? '/instructor/dashboard' : '/dashboard'
      navigate(redirectTo)
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        'Registration failed. Please try again.'
      setErrors({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0a] text-white overflow-hidden">

      {/* ── Background orbs ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="orb absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="orb orb-delay absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── LEFT: Visual Panel ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 xl:p-16 z-10">

        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            EduSpire <span className="text-white/30">PRO</span>
          </span>
        </Link>

        {/* Center */}
        <div className="space-y-10 max-w-lg">
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/8 text-xs font-semibold text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            Free to join — no credit card required
          </div>

          {/* Dynamic headline */}
          <h2 className="text-5xl xl:text-6xl font-extrabold tracking-[-0.04em] leading-[1.04]">
            {cfg.headline}
          </h2>

          {/* Perks */}
          <div className="space-y-3">
            {cfg.perks.map((p) => (
              <div key={p} className="flex items-center gap-2.5 text-sm text-white/55">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {p}
              </div>
            ))}
          </div>

          {/* Role comparison */}
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const Icon = r.icon
              const isActive = role === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => { setRole(r.key); setErrors({}) }}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-purple-500/12 border-purple-500/30 shadow-[0_0_20px_rgba(124,58,237,0.12)]'
                      : 'bg-white/3 border-white/6 hover:border-white/12 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-purple-400' : 'text-white/25'}`} />
                  <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-white/40'}`}>{r.label}</div>
                  <div className={`text-[11px] mt-0.5 ${isActive ? 'text-white/50' : 'text-white/20'}`}>{r.sublabel}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="text-xs text-white/20">
          © 2026 EduSpire PRO Inc. · <a href="#" className="hover:text-white/40 transition-colors">Privacy</a> · <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-[52%] flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-[440px] rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-8 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.5)] my-auto">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base">EduSpire PRO</span>
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h1>
            <p className="text-sm text-white/40 mt-1">
              Join and start {role === 'INSTRUCTOR' ? 'teaching' : 'learning'} in minutes.
            </p>
          </div>

          {/* ── Role Toggle ──────────────────────────────────────────────── */}
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
                  id={`register-tab-${r.key.toLowerCase()}`}
                  onClick={() => { setRole(r.key); setErrors({}) }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/12'
                      : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-white/25'}`} />
                  {r.label}
                </button>
              )
            })}
          </div>

          {/* Form error */}
          {errors.form && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errors.form}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="text"
                  id="register-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/6 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/8 transition-all ${errors.name ? 'border-red-500/40' : 'border-white/8 focus:border-purple-500/50'}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="text"
                  id="register-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alexj (min 3 chars)"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/6 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/8 transition-all ${errors.username ? 'border-red-500/40' : 'border-white/8 focus:border-purple-500/50'}`}
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  id="register-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/6 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/8 transition-all ${errors.email ? 'border-red-500/40' : 'border-white/8 focus:border-purple-500/50'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Passwords side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-9 py-3 rounded-xl bg-white/6 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/8 transition-all ${errors.password ? 'border-red-500/40' : 'border-white/8 focus:border-purple-500/50'}`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer" tabIndex={-1}>
                    {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                  <input
                    type="password"
                    id="register-confirm-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/6 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/8 transition-all ${errors.confirm ? 'border-red-500/40' : 'border-white/8 focus:border-purple-500/50'}`}
                  />
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-red-400">{errors.confirm}</p>}
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="register-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/30"
                />
                <span className="text-xs text-white/40 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-semibold">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-semibold">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-400">{errors.terms}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.55)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)' }}
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Creating…</>
              ) : (
                <>{cfg.ctaLabel} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-white/30 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
