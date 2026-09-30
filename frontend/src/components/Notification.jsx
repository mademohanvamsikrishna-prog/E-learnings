import { useState, useRef, useEffect } from 'react'
import { Bell, Check, BookOpen, Award, AlertCircle, Clock } from 'lucide-react'

const initialNotifications = [
  {
    id: 1,
    title: 'Assignment Graded',
    message: 'Dr. Sarah Connor graded your E-Commerce Engine assignment: 96/100 (A+)!',
    time: '2 hours ago',
    icon: Award,
    color: 'emerald',
    read: false,
  },
  {
    id: 2,
    title: 'Daily Streak Milestone! 🔥',
    message: "You've reached a 14-day study streak. Keep it going!",
    time: '5 hours ago',
    icon: Award,
    color: 'amber',
    read: false,
  },
  {
    id: 3,
    title: 'New Quiz Available',
    message: 'Module 2: OOP Deep Dive quiz is ready for you to test your skills.',
    time: '1 day ago',
    icon: BookOpen,
    color: 'indigo',
    read: true,
  },
]

export function Notification() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => {
                const IconComponent = n.icon || Bell
                return (
                  <div
                    key={n.id}
                    className={`p-4 flex gap-3 transition-colors hover:bg-slate-50 ${
                      !n.read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {n.title}
                        </p>
                        <span className="text-2xs text-slate-400 shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 text-center border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">
              All caught up!
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notification
