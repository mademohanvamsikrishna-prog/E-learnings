import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Search, CheckCircle2, Clock, ArrowRight,
  Award, PlayCircle, Star, TrendingUp, Filter,
} from 'lucide-react'
import { enrolledCourses } from '@/data/mockData'

// ─── Dark shared components ───────────────────────────────────────────────────
function DarkProgress({ value, color = 'from-purple-500 to-indigo-500' }) {
  return (
    <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${value}%` }} />
    </div>
  )
}

const TABS = [
  { key: 'all',         label: 'All Courses' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed' },
]

export function MyCourses() {
  const [activeTab, setActiveTab]       = useState('all')
  const [searchQuery, setSearchQuery]   = useState('')

  const filtered = enrolledCourses.filter((c) => {
    if (activeTab === 'in-progress' && c.progress === 100) return false
    if (activeTab === 'completed'   && c.progress <   100) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    }
    return true
  })

  const counts = {
    all:         enrolledCourses.length,
    'in-progress': enrolledCourses.filter((c) => c.progress < 100).length,
    completed:   enrolledCourses.filter((c) => c.progress === 100).length,
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Learning Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Courses</h1>
          <p className="text-white/40 text-xs mt-1">Manage your enrollments and pick up where you left off.</p>
        </div>
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enrolled courses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
          />
        </div>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/6">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === t.key
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-white/35 hover:text-white/70'
              }`}
            >
              {t.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === t.key
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/6 text-white/30'
              }`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
        <Link to="/explore">
          <button className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/8 bg-white/4 text-xs font-bold text-white/50 hover:bg-white/8 hover:text-white/80 transition-all cursor-pointer mb-2">
            Browse More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* ── Course list ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/4 p-14 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white">No courses found</h3>
          <p className="text-xs text-white/35 max-w-xs mx-auto">
            {searchQuery ? `No results for "${searchQuery}".` : 'Nothing in this view yet.'}
          </p>
          <Link to="/explore">
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-all">
              Explore Courses
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Link to={`/learn/${c.id}`} key={c.id} className="block group">
              <div className="flex gap-4 p-4 rounded-2xl border border-white/6 bg-white/3 hover:border-purple-500/25 hover:bg-purple-500/5 transition-all duration-200">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-20 h-14 rounded-xl object-cover border border-white/8 flex-none group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{c.category}</span>
                      <h4 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors truncate">{c.title}</h4>
                      <p className="text-[10px] text-white/30 mt-0.5">by {c.instructor} · {c.completedLessons}/{c.totalLessons} lessons</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-lg font-extrabold text-purple-400">{c.progress}%</div>
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-400">{c.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <DarkProgress value={c.progress} />
                    </div>
                    <button className="flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 border border-purple-500/25 text-purple-300 text-[11px] font-bold hover:bg-purple-600/50 transition-colors cursor-pointer">
                      <PlayCircle className="w-3.5 h-3.5" /> Resume
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses
