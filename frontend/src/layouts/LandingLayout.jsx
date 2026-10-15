import { useState } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import {
  GraduationCap,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Globe,
} from 'lucide-react'
import { Footer } from '@/components'

const CATEGORIES = [
  { name: 'Development', subs: ['Web Development', 'Python', 'Java', 'React', 'FastAPI'] },
  { name: 'Business', subs: ['Communication', 'Management', 'Finance'] },
  { name: 'IT & Software', subs: ['Network & Security', 'AWS Certification', 'Linux'] },
  { name: 'Design', subs: ['Web Design', 'UI/UX Design', 'Figma'] },
  { name: 'Marketing', subs: ['Digital Marketing', 'SEO', 'Social Media'] },
  { name: 'Personal Development', subs: ['Productivity', 'Leadership', 'Career Growth'] },
]

/**
 * LandingLayout — standalone layout used exclusively by the public Landing Page.
 * Has its own navbar with Log In / Sign Up CTAs (no sidebar, no auth-state avatar).
 */
export function LandingLayout() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(searchQuery.trim() ? `/explore?q=${encodeURIComponent(searchQuery.trim())}` : '/explore')
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1c1d1f] selection:bg-purple-100 selection:text-[#5624d0]">
      {/* ── Promo Banner ────────────────────────────────────────────────────── */}
      <div className="bg-[#5624d0] text-white text-xs font-bold py-2.5 px-4 text-center tracking-tight flex items-center justify-center gap-2">
        <span>New to learning?</span>
        <span className="font-normal text-purple-200">|</span>
        <span className="font-normal">In-demand courses from ₹449. Sale ends tonight.</span>
        <Link to="/explore" className="underline font-bold hover:text-purple-200 ml-1">
          Shop now
        </Link>
      </div>

      {/* ── Main Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#d1d7dc] bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">

          {/* LEFT: Mobile toggle + Logo + Categories */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#1c1d1f] hover:bg-slate-100 rounded-md cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 select-none group">
              <div className="w-8 h-8 rounded-lg bg-[#5624d0] flex items-center justify-center text-white shadow-sm group-hover:bg-[#4212a0] transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="font-extrabold text-[#1c1d1f] text-[17px] tracking-tight">
                  E-Learning <span className="text-[#a435f0]">Academy</span>
                </span>
                <span className="text-[10px] text-[#6a6f73] font-medium">Master In-Demand Skills</span>
              </div>
            </Link>

            {/* Categories dropdown */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onMouseEnter={() => setCategoriesOpen(true)}
                className="flex items-center gap-1 text-sm font-semibold text-[#1c1d1f] hover:text-[#5624d0] px-3 py-2 rounded-md transition-colors cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {categoriesOpen && (
                <div
                  onMouseLeave={() => setCategoriesOpen(false)}
                  className="absolute top-full left-0 w-60 bg-white border border-[#d1d7dc] shadow-xl py-2 z-50 rounded-b-md"
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/explore?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-[#1c1d1f] hover:bg-slate-50 hover:text-[#5624d0] transition-colors"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Explore nav link */}
            <Link
              to="/explore"
              className="hidden lg:inline-block text-sm font-semibold text-[#1c1d1f] hover:text-[#5624d0] px-3 py-2 transition-colors"
            >
              Explore
            </Link>
          </div>

          {/* CENTER: Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden md:flex items-center relative"
          >
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything (Python, React, Machine Learning...)"
              className="w-full pl-11 pr-4 py-2.5 bg-[#f7f9fa] hover:bg-[#eef0f2] focus:bg-white border border-[#1c1d1f] rounded-full text-sm text-[#1c1d1f] placeholder:text-[#6a6f73] transition-all focus:outline-none focus:ring-2 focus:ring-[#5624d0]/30"
            />
          </form>

          {/* RIGHT: Nav links + Auth CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Teach on Academy */}
            <Link
              to="/register"
              className="hidden lg:inline-block text-sm font-medium text-[#1c1d1f] hover:text-[#5624d0] px-2 py-1 transition-colors"
            >
              Teach on Academy
            </Link>

            {/* AI Tutor pill */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#5624d0] bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a435f0]" />
              <span>AI Tutor</span>
            </Link>

            {/* Language */}
            <button
              type="button"
              className="p-2.5 text-[#1c1d1f] border border-[#1c1d1f] hover:bg-slate-50 transition-colors hidden sm:inline-flex cursor-pointer"
              title="Language"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* ──── PRIMARY CTAs ──────────────────────────────────────────── */}
            <Link
              to="/login"
              id="landing-login-btn"
              className="px-4 py-2 text-sm font-bold text-[#1c1d1f] border border-[#1c1d1f] hover:bg-slate-100 transition-colors rounded-none whitespace-nowrap"
            >
              Log in
            </Link>

            <Link
              to="/register"
              id="landing-register-btn"
              className="px-4 py-2 text-sm font-bold text-white bg-[#1c1d1f] hover:bg-slate-800 transition-colors rounded-none whitespace-nowrap"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#d1d7dc] bg-white px-4 py-4 space-y-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fa] border border-[#1c1d1f] text-sm text-[#1c1d1f] rounded-full focus:outline-none"
              />
            </form>

            <Link
              to="/explore"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold text-[#1c1d1f] border-b border-slate-100"
            >
              Explore All Courses
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold text-[#5624d0] border-b border-slate-100 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> AI Tutor
            </Link>

            <div className="pt-2 flex gap-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-bold border border-[#1c1d1f] text-[#1c1d1f] hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-bold bg-[#1c1d1f] text-white hover:bg-slate-800 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Page Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default LandingLayout
