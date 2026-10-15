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
  const { user, logout, isInstructor } = useAuth()
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

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="w-full sticky top-0 z-50 bg-[#0f0f0f]">
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
      <header className="border-b border-white/8 bg-[#0f0f0f]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/60 hover:bg-white/8 rounded-md cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* E-Learning Academy Wordmark Logo */}
            <Link to="/" className="flex items-center gap-2 group select-none">
              <div className="w-8 h-8 rounded-lg bg-[#5624d0] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-lg tracking-tight leading-none">
                  E-Learning <span className="text-[#a435f0]">Academy</span>
                </span>
                <span className="text-3xs text-white/30 font-medium tracking-tight">
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
                className="text-xs font-semibold text-white/60 hover:text-white px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Categories</span>
              </button>

              {/* Flyout Categories Menu */}
              {categoriesOpen && (
                <div
                  onMouseLeave={() => setCategoriesOpen(false)}
                  className="absolute top-full left-0 w-64 bg-[#141414] border border-white/10 shadow-2xl py-2 z-50 rounded-b-xl text-xs"
                >
                  {CATEGORY_ITEMS.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/explore?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-white/60 hover:bg-white/6 hover:text-purple-400"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/25" />
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
            <div className="absolute left-4 text-white/25 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything (e.g. Python, React, Machine Learning, Java)..."
              className="w-full pl-11 pr-4 py-3 bg-white/6 hover:bg-white/8 focus:bg-white/8 border border-white/12 rounded-full text-xs text-white placeholder:text-white/25 transition-all focus:outline-none focus:border-purple-500/40"
            />
          </form>

          {/* Right Navigation & Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Academy Business */}
            <Link
              to="/explore"
              className="hidden xl:inline-block text-xs font-medium text-white/50 hover:text-white px-2 py-1 transition-colors"
            >
              Academy Business
            </Link>

            {/* Teach on Academy */}
            <Link
              to="/instructor/dashboard"
              className="hidden lg:inline-block text-xs font-medium text-white/50 hover:text-white px-2 py-1 transition-colors"
            >
              Teach on Academy
            </Link>

            {/* AI Tutor Sparkle Pill */}
            <Link
              to="/ai-tutor"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-300 bg-purple-500/12 hover:bg-purple-500/20 transition-colors border border-purple-500/25"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a435f0]" />
              <span>AI Tutor</span>
            </Link>

            {/* If Authenticated: My Learning, Wishlist, Notifications, Avatar */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isInstructor ? '/instructor/dashboard' : '/my-courses'}
                  className="hidden md:inline-block text-xs font-medium text-white/50 hover:text-white transition-colors"
                >
                  My learning
                </Link>

                {/* Wishlist */}
                <Link
                  to="/my-courses"
                  className="p-2 text-white/40 hover:text-purple-400 rounded-full hover:bg-white/8 transition-colors"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                {/* Notifications */}
                <Notification />

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer"
                  >
                    <Avatar name={user.full_name} src={user.avatar_url} size="sm" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#141414] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] py-3 z-50 animate-fade-in text-xs"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 pb-3 border-b border-white/6 flex items-center gap-3">
                        <Avatar name={user.full_name} src={user.avatar_url} size="md" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-white truncate">{user.full_name}</p>
                          <p className="text-3xs text-white/35 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/20">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div className="py-2 text-white/60">
                        <Link
                          to={isInstructor ? '/instructor/dashboard' : '/dashboard'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white/6 hover:text-purple-400 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" /> Student Dashboard
                        </Link>
                        <Link
                          to="/my-courses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white/6 hover:text-purple-400 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400" /> My Learning
                        </Link>
                        <Link
                          to="/certificates"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white/6 hover:text-purple-400 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4 text-slate-400" /> Certificates
                        </Link>
                      </div>

                      <div className="border-t border-white/6 pt-2 px-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/8 rounded-xl cursor-pointer font-semibold text-left transition-colors"
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
                  className="px-4 py-2.5 text-xs font-bold text-white/70 border border-white/15 hover:bg-white/8 transition-colors rounded-xl"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition-all rounded-xl"
                >
                  Sign up
                </Link>

                {/* Globe Language Selector */}
                <button
                  type="button"
                  className="p-2.5 text-white/40 border border-white/10 hover:bg-white/8 transition-colors hidden sm:inline-block cursor-pointer rounded-xl"
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
          <div className="lg:hidden border-t border-white/6 bg-[#141414] p-4 space-y-3 animate-fade-in text-xs font-medium">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full px-4 py-2.5 bg-white/6 border border-white/10 text-xs text-white placeholder:text-white/25 rounded-full focus:outline-none"
              />
            </form>

            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white/60 font-bold border-b border-white/6 hover:text-white transition-colors"
            >
              Explore All Courses
            </Link>
            <Link
              to="/ai-tutor"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-purple-400 font-bold border-b border-white/6"
            >
              AI Tutor Mentorship
            </Link>

            {user ? (
              <div className="space-y-2 pt-2">
                <p className="text-3xs uppercase font-extrabold text-white/25">Signed in as {user.full_name}</p>
                <Link
                  to={isInstructor ? '/instructor/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-white/50 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-white/50 hover:text-white transition-colors"
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
              <div className="pt-3 border-t border-white/6 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 font-bold border border-white/15 text-white/70 rounded-xl"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl"
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
