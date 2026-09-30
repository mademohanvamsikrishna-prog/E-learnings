import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  Globe,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRightLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Avatar from './Avatar'
import Notification from './Notification'

const CATEGORY_ITEMS = [
  { name: 'Development', subs: ['Web Development', 'Python', 'Java', 'React', 'FastAPI'] },
  { name: 'Business', subs: ['Communication', 'Management', 'Finance', 'Strategy'] },
  { name: 'Finance & Accounting', subs: ['Accounting', 'Cryptocurrency', 'Investing'] },
  { name: 'IT & Software', subs: ['Network & Security', 'AWS Certification', 'Linux'] },
  { name: 'Office Productivity', subs: ['Microsoft Excel', 'Project Management', 'Google Workspace'] },
  { name: 'Personal Development', subs: ['Productivity', 'Leadership', 'Career Growth'] },
  { name: 'Design', subs: ['Web Design', 'UI/UX Design', 'Graphic Design', 'Figma'] },
  { name: 'Marketing', subs: ['Digital Marketing', 'SEO', 'Social Media Marketing'] },
]

export function Navbar() {
  const { user, logout, switchRole, isInstructor } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleRole = () => {
    if (isInstructor) {
      switchRole('STUDENT')
      navigate('/dashboard')
    } else {
      switchRole('INSTRUCTOR')
      navigate('/instructor/dashboard')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="w-full sticky top-0 z-50 bg-white">
      {/* ── Top Promo Bar (Udemy signature banner) ─────────────────────────── */}
      <div className="bg-[#5624d0] text-white text-xs font-bold py-2.5 px-4 text-center tracking-tight flex items-center justify-center gap-2">
        <span>Ready to get with the times?</span>
        <span className="font-normal text-purple-200">|</span>
        <span className="font-normal">Sale ends tonight at midnight. In-demand courses from $12.99.</span>
        <Link to="/explore" className="underline font-bold hover:text-purple-200 ml-1">
          Shop now
        </Link>
      </div>

      {/* ── Main Udemy Navigation Header ───────────────────────────────────── */}
      <header className="border-b border-[#d1d7dc] bg-white shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1c1d1f] hover:bg-slate-100 rounded-md cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* E-Learning Academy Wordmark Logo */}
            <Link to="/" className="flex items-center gap-2 group select-none">
              <div className="w-8 h-8 rounded-lg bg-[#5624d0] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[#1c1d1f] text-lg tracking-tight leading-none">
                  E-Learning <span className="text-[#a435f0]">Academy</span>
                </span>
                <span className="text-3xs text-[#6a6f73] font-medium tracking-tight">
                  Master In-Demand Skills
                </span>
              </div>
            </Link>

            {/* Categories Dropdown Button */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onMouseEnter={() => setCategoriesOpen(true)}
                className="text-xs font-semibold text-[#1c1d1f] hover:text-[#5624d0] px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Categories</span>
              </button>

              {/* Flyout Categories Menu */}
              {categoriesOpen && (
                <div
                  onMouseLeave={() => setCategoriesOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white border border-[#d1d7dc] shadow-xl py-2 z-50 rounded-b-md text-xs"
                >
                  {CATEGORY_ITEMS.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/explore?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-[#1c1d1f] hover:bg-slate-100 hover:text-[#5624d0]"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Large Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-3xl hidden md:flex items-center relative"
          >
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything (e.g. Python, React, Machine Learning, Java)..."
              className="w-full pl-11 pr-4 py-3 bg-[#f7f9fa] hover:bg-[#e4e8eb]/70 focus:bg-white border border-[#1c1d1f] rounded-full text-xs text-[#1c1d1f] placeholder:text-[#6a6f73] transition-all focus:outline-none"
            />
          </form>

          {/* Right Navigation & Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Academy Business */}
            <Link
              to="/explore"
              className="hidden xl:inline-block text-xs font-medium text-[#1c1d1f] hover:text-[#5624d0] px-2 py-1"
            >
              Academy Business
            </Link>

            {/* Teach on Academy */}
            <Link
              to="/instructor/dashboard"
              className="hidden lg:inline-block text-xs font-medium text-[#1c1d1f] hover:text-[#5624d0] px-2 py-1"
            >
              Teach on Academy
            </Link>

            {/* AI Tutor Sparkle Pill */}
            <Link
              to="/ai-tutor"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#5624d0] bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a435f0]" />
              <span>AI Tutor</span>
            </Link>

            {/* If Authenticated: My Learning, Wishlist, Notifications, Avatar */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isInstructor ? '/instructor/dashboard' : '/my-courses'}
                  className="hidden md:inline-block text-xs font-medium text-[#1c1d1f] hover:text-[#5624d0]"
                >
                  My learning
                </Link>

                {/* Wishlist */}
                <Link
                  to="/my-courses"
                  className="p-2 text-[#1c1d1f] hover:text-[#5624d0] rounded-full hover:bg-slate-100"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                {/* Notifications */}
                <Notification />

                {/* Quick Role Switcher Button */}
                <button
                  type="button"
                  onClick={toggleRole}
                  title="Switch between Student and Instructor view"
                  className="hidden 2xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-3xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowRightLeft className="w-3 h-3 text-[#5624d0]" />
                  <span>Role: <strong>{user.role}</strong></span>
                </button>

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer"
                  >
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-md bg-white border border-[#d1d7dc] shadow-2xl py-3 z-50 animate-fade-in text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 pb-3 border-b border-slate-100 flex items-center gap-3">
                        <Avatar name={user.name} src={user.avatar} size="md" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-3xs text-slate-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-3xs font-extrabold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-[#5624d0]">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div className="py-2 text-slate-700">
                        <Link
                          to={isInstructor ? '/instructor/dashboard' : '/dashboard'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 hover:text-[#5624d0]"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" /> Student Dashboard
                        </Link>
                        <Link
                          to="/my-courses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 hover:text-[#5624d0]"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400" /> My Learning
                        </Link>
                        <Link
                          to="/certificates"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 hover:text-[#5624d0]"
                        >
                          <GraduationCap className="w-4 h-4 text-slate-400" /> Certificates
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-2 px-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer font-semibold text-left"
                        >
                          <LogOut className="w-4 h-4" /> Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* If Guest: Exact Udemy Log in & Sign up buttons */
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-xs font-bold text-[#1c1d1f] border border-[#1c1d1f] hover:bg-slate-100 transition-colors rounded-none"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#1c1d1f] hover:bg-slate-800 transition-colors rounded-none"
                >
                  Sign up
                </Link>

                {/* Globe Language Selector */}
                <button
                  type="button"
                  className="p-2.5 text-[#1c1d1f] border border-[#1c1d1f] hover:bg-slate-100 transition-colors hidden sm:inline-block cursor-pointer"
                  title="Change language"
                >
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Flyout Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#d1d7dc] bg-white p-4 space-y-3 animate-fade-in text-xs font-medium">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full px-4 py-2.5 bg-[#f7f9fa] border border-[#1c1d1f] text-xs text-[#1c1d1f] rounded-full"
              />
            </form>

            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#1c1d1f] font-bold border-b border-slate-100"
            >
              Explore All Courses
            </Link>
            <Link
              to="/ai-tutor"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#5624d0] font-bold border-b border-slate-100"
            >
              AI Tutor Mentorship
            </Link>

            {user ? (
              <div className="space-y-2 pt-2">
                <p className="text-3xs uppercase font-extrabold text-slate-400">Signed in as {user.name}</p>
                <Link
                  to={isInstructor ? '/instructor/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-slate-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-slate-700"
                >
                  My Learning
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-rose-600 font-bold"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 font-bold border border-[#1c1d1f] text-[#1c1d1f]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 font-bold bg-[#1c1d1f] text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  )
}

export default Navbar
