import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-64 shrink-0 bg-surface-card border-r border-surface-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-surface-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-white">ELearn <span className="text-xs text-red-400">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-500/20 text-red-300'
                    : 'text-slate-400 hover:text-white hover:bg-surface-border/50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <p className="text-xs text-slate-400 mb-3 px-1">{user?.email}</p>
          <button onClick={logout} className="w-full btn-secondary text-xs justify-center">Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
