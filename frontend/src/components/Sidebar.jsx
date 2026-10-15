import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Compass, BookOpen, FileText, HelpCircle,
  BarChart3, Award, Sparkles, Settings, LogOut, PlusCircle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Avatar from './Avatar'

const STUDENT_LINKS = [
  { label: 'Dashboard',          path: '/dashboard',           icon: LayoutDashboard },
  { label: 'Explore Courses',    path: '/explore',             icon: Compass },
  { label: 'My Courses',         path: '/my-courses',          icon: BookOpen,  badge: '4' },
  { label: 'Assignments',        path: '/assignments',         icon: FileText,  badge: '1 Due' },
  { label: 'Quizzes',            path: '/quiz/quiz-java-oop',  icon: HelpCircle },
  { label: 'Progress',           path: '/progress',            icon: BarChart3 },
  { label: 'Certificates',       path: '/certificates',        icon: Award,     badge: '2' },
  { label: 'AI Tutor',           path: '/ai-tutor',            icon: Sparkles,  highlight: true },
]

const INSTRUCTOR_LINKS = [
  { label: 'Dashboard',          path: '/instructor/dashboard',       icon: LayoutDashboard },
  { label: 'My Courses',         path: '/my-courses',                 icon: BookOpen },
  { label: 'Create Course',      path: '/instructor/create-course',   icon: PlusCircle, highlight: true },
  { label: 'Analytics',          path: '/instructor/analytics',       icon: BarChart3 },
  { label: 'AI Tools',           path: '/instructor/ai-tools',        icon: Sparkles },
  { label: 'Certificates',       path: '/certificates',               icon: Award },
]

export function Sidebar({ className = '' }) {
  const { user, logout, isInstructor } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/instructor/dashboard') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const links = isInstructor ? INSTRUCTOR_LINKS : STUDENT_LINKS

  return (
    <aside
      className={`w-64 bg-[#111111] border-r border-white/6 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30 overflow-y-auto ${className}`}
    >
      <div className="p-4 space-y-5">

        {/* User mini-banner */}
        {user && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/8 flex items-center gap-2.5 truncate">
            <div className="relative flex-none">
              <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#111111] rounded-full" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 capitalize">
                {user.role?.toLowerCase()}
              </span>
            </div>
          </div>
        )}

        {/* Nav section label */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2 mb-2">
            {isInstructor ? 'Instructor Portal' : 'Learning Hub'}
          </p>

          <nav className="space-y-0.5">
            {links.map((link) => {
              const Icon  = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    active
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/25 font-semibold'
                      : link.highlight
                      ? 'text-purple-300 bg-purple-500/8 border border-purple-500/15 hover:bg-purple-500/15'
                      : 'text-white/45 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${
                      active ? 'text-purple-400' : link.highlight ? 'text-purple-400' : 'text-white/25'
                    }`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      active ? 'bg-purple-500/30 text-purple-300' : 'bg-white/8 text-white/40'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* AI Tutor promo card */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/10 border border-purple-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white/80">AI Tutor</span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed mb-3">
            Get instant explanations, debug help, and custom quizzes.
          </p>
          <Link to="/ai-tutor">
            <button className="w-full py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/30 text-xs font-bold text-purple-300 transition-all cursor-pointer">
              Open AI Tutor →
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom settings/logout */}
      <div className="p-4 border-t border-white/6 space-y-0.5">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-white/35 hover:bg-white/5 hover:text-white/70 transition-all"
        >
          <Settings className="w-4 h-4 text-white/20" />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400/70 hover:bg-rose-500/8 hover:text-rose-400 transition-all cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
