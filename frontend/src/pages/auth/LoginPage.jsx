import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button, Input, Card } from '@/components'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('alex.johnson@example.com')
  const [password, setPassword] = useState('password123')
  const [role, setRole] = useState('STUDENT') // 'STUDENT' | 'INSTRUCTOR'
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!email) newErrors.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'

    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await login({ email, password, role })
      if (role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch {
      setErrors({ form: 'Invalid credentials. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const fillQuickLogin = (selectedRole) => {
    setRole(selectedRole)
    if (selectedRole === 'INSTRUCTOR') {
      setEmail('sarah.connor@example.com')
      setPassword('instructor2026')
    } else {
      setEmail('alex.johnson@example.com')
      setPassword('student2026')
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900">
      {/* ─── Left Brand Panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1c1d1f] via-slate-900 to-[#230d5b] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#5624d0] flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              EduSpire <span className="text-purple-400">PRO</span>
            </span>
          </Link>
        </div>

        {/* Center Illustration Content */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI-Powered Learning Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Accelerate Your Engineering Career.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Access over 500+ structured courses in modern Java, React, AI/LLM engineering, and cloud architecture with 24/7 AI tutoring.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interactive coding sandbox & video environment</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated assignments and immediate code reviews</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified certificates shareable to LinkedIn</span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Banner */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
          <p className="text-xs text-slate-300 italic">
            "EduSpire is the only platform where the curriculum actually reflects what senior engineers write in production today."
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Alex Johnson</span>
            <span className="text-2xs text-purple-300">Full-Stack Student</span>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-left">
            <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#5624d0] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">EduSpire PRO</span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Enter your credentials to access your personalized learning dashboard.
            </p>
          </div>

          {/* Quick Evaluator Role Toggle Helper */}
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs space-y-2">
            <p className="font-semibold text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5624d0]" /> Quick Demo One-Click Login:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillQuickLogin('STUDENT')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  role === 'STUDENT'
                    ? 'bg-[#5624d0] text-white border-[#5624d0] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Demo as Student
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('INSTRUCTOR')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  role === 'INSTRUCTOR'
                    ? 'bg-[#5624d0] text-white border-[#5624d0] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Demo as Instructor
              </button>
            </div>
          </div>

          {errors.form && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              error={errors.email}
              required
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span>Remember me</span>
              </label>

              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold shadow-sm"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to {role === 'INSTRUCTOR' ? 'Instructor Portal' : 'Student Hub'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-slate-50 px-3 text-2xs uppercase tracking-wider font-semibold text-slate-400 absolute">
              or continue with
            </span>
          </div>

          {/* Social login */}
          <button
            type="button"
            onClick={() => handleSubmit({ preventDefault: () => {} })}
            className="w-full py-2.5 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer link */}
          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
