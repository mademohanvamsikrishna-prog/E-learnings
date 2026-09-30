import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
  BookOpen,
  Briefcase,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button, Input } from '@/components'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('STUDENT') // 'STUDENT' | 'INSTRUCTOR'
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!name.trim()) newErrors.name = 'Full name is required'
    if (!email) newErrors.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'

    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await register({ name, email, role })
      if (role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch {
      setErrors({ form: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900">
      {/* ─── Left Brand Panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              EduSpire <span className="text-indigo-400">AI</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Join 10,000+ Tech Professionals</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Start Your Mastery Journey Today.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Gain unlimited access to expert-led engineering tracks, personalized AI tutoring sessions, hands-on portfolio assignments, and verified career credentials.
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>For Students:</span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized curriculum, adaptive practice quizzes, real-time code execution, and 24/7 AI learning coach.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-white pt-2 border-t border-white/10">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>For Instructors:</span>
            </div>
            <p className="text-xs text-slate-400">
              Comprehensive course creator, curriculum builder, automated grading analytics, and student performance tracking.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © 2026 EduSpire AI Inc. All rights reserved.
        </div>
      </div>

      {/* ─── Right Form Panel ────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">EduSpire AI</span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Join EduSpire to start learning or teaching with AI assistance.
            </p>
          </div>

          {errors.form && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              error={errors.name}
              required
            />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={Lock}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Role Radio Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                I want to join as:
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all select-none ${
                    role === 'STUDENT'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900">Student</span>
                    <input
                      type="radio"
                      name="role"
                      value="STUDENT"
                      checked={role === 'STUDENT'}
                      onChange={() => setRole('STUDENT')}
                      className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                  </div>
                  <span className="text-2xs text-slate-500">Learn courses & earn certificates</span>
                </label>

                <label
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all select-none ${
                    role === 'INSTRUCTOR'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900">Instructor</span>
                    <input
                      type="radio"
                      name="role"
                      value="INSTRUCTOR"
                      checked={role === 'INSTRUCTOR'}
                      onChange={() => setRole('INSTRUCTOR')}
                      className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                  </div>
                  <span className="text-2xs text-slate-500">Teach courses & manage students</span>
                </label>
              </div>
            </div>

            {/* Agree to terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-indigo-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-semibold text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.agreeTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold shadow-sm"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Create {role === 'INSTRUCTOR' ? 'Instructor' : 'Student'} Account
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
