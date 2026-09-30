import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  FileText,
  HelpCircle,
  BarChart3,
  Award,
  Sparkles,
  User,
  Settings,
  LogOut,
  PlusCircle,
  Users,
  GraduationCap,
  ArrowRightLeft,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Avatar from './Avatar'

export function Sidebar({ className = '' }) {
  const { user, logout, switchRole, isInstructor } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/instructor/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const studentLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore Courses', path: '/explore', icon: Compass },
    { label: 'My Courses', path: '/my-courses', icon: BookOpen, badge: '4' },
    { label: 'Assignments', path: '/assignments', icon: FileText, badge: '1 Due' },
    { label: 'Quizzes', path: '/quiz/quiz-java-oop', icon: HelpCircle },
    { label: 'Progress & Analytics', path: '/progress', icon: BarChart3 },
    { label: 'Certificates', path: '/certificates', icon: Award, badge: '2' },
    { label: 'AI Tutor', path: '/ai-tutor', icon: Sparkles, highlight: true },
  ]

  const instructorLinks = [
    { label: 'Dashboard', path: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', path: '/my-courses', icon: BookOpen },
    { label: 'Create Course', path: '/instructor/create-course', icon: PlusCircle, highlight: true },
    { label: 'Analytics', path: '/progress', icon: BarChart3 },
    { label: 'AI Tutor', path: '/ai-tutor', icon: Sparkles },
    { label: 'Certificates', path: '/certificates', icon: Award },
  ]

  const links = isInstructor ? instructorLinks : studentLinks

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30 overflow-y-auto ${className}`}
    >
      <div className="p-4 space-y-6">
        {/* User Mini Banner */}
        {user && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <Avatar src={user.avatar} name={user.name} size="sm" isOnline />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-2xs text-slate-400 capitalize">{user.role?.toLowerCase()}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isInstructor) {
                  switchRole('STUDENT')
                  navigate('/dashboard')
                } else {
                  switchRole('INSTRUCTOR')
                  navigate('/instructor/dashboard')
                }
              }}
              title="Toggle role view"
              className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            {isInstructor ? 'Instructor Management' : 'Student Learning Hub'}
          </p>

          {links.map((link) => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : link.highlight
                    ? 'text-purple-700 bg-purple-50/70 hover:bg-purple-100/70'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-white' : link.highlight ? 'text-purple-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </div>

                {link.badge && (
                  <span
                    className={`text-2xs px-1.5 py-0.5 rounded-full font-semibold ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom section: Settings & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Platform Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
