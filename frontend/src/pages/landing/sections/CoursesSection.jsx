import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowRight, TrendingUp } from 'lucide-react'
import { courses } from '@/data/mockData'

const TABS = [
  { id: 'Python',         label: 'Python',           emoji: '🐍', accent: 'from-yellow-500/20 to-amber-500/10' },
  { id: 'Web Dev',        label: 'Web Development',  emoji: '⚡', accent: 'from-blue-500/20 to-cyan-500/10' },
  { id: 'AI & ML',        label: 'AI & Machine Learning', emoji: '🤖', accent: 'from-purple-500/20 to-violet-500/10' },
  { id: 'Cloud',          label: 'Cloud & DevOps',   emoji: '☁️', accent: 'from-emerald-500/20 to-teal-500/10' },
  { id: 'Data Science',   label: 'Data Science',     emoji: '📊', accent: 'from-rose-500/20 to-pink-500/10' },
]

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState(0)

  const displayed = courses.slice(0, 4)
  const trending  = courses.slice(2, 6)

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7c3aed] mb-2">
              Course Catalog
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f0f0f] tracking-tight leading-tight">
              Every skill you need,<br />
              <span className="text-[#7c3aed]">one platform.</span>
            </h2>
          </div>
          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-sm font-bold text-[#7c3aed] hover:text-[#5b21b6] transition-colors group whitespace-nowrap"
          >
            Browse all courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── Pill Tabs ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#0f0f0f] text-white border-[#0f0f0f] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-[#0f0f0f]'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Course Cards Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayed.map((course, idx) => {
            const instructor = typeof course.instructor === 'object'
              ? course.instructor?.name : course.instructor
            return (
              <Link to={`/courses/${course.id}`} key={course.id} className="group block">
                <div className="rounded-2xl border border-slate-100 overflow-hidden hover:border-purple-200 hover:shadow-[0_8px_30px_-4px_rgba(124,58,237,0.15)] transition-all duration-300 hover:-translate-y-1 bg-white">
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category pill on image */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
                        {TABS[activeTab].emoji} {TABS[activeTab].label}
                      </span>
                    </div>
                    {course.isBestseller && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-amber-400 rounded-full text-[10px] font-black text-amber-900">
                          Bestseller
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[#0f0f0f] leading-snug line-clamp-2 group-hover:text-[#7c3aed] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">{instructor}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs font-extrabold text-amber-600">{course.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        ({(course.reviewsCount || 2340).toLocaleString()})
                      </span>
                    </div>

                    {/* Price row */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-[#0f0f0f]">
                          ${course.price || 14.99}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ${course.originalPrice || 84.99}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {Math.round((1 - (course.price || 14.99) / (course.originalPrice || 84.99)) * 100)}% off
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── Trending Section ──────────────────────────────────────────── */}
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-extrabold text-[#0f0f0f] tracking-tight">
              Trending right now
            </h3>
            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-100">
              🔥 Hot
            </span>
          </div>

          {/* Horizontal scroll on mobile */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
            {trending.map((course) => {
              const instructor = typeof course.instructor === 'object'
                ? course.instructor?.name : course.instructor
              return (
                <Link
                  to={`/courses/${course.id}`}
                  key={`trending-${course.id}`}
                  className="group flex-none w-64 sm:w-72"
                >
                  <div className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200">
                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-none bg-slate-100">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#0f0f0f] leading-snug line-clamp-2 group-hover:text-[#7c3aed] transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{instructor}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-600">{course.rating}</span>
                      </div>
                      <p className="text-sm font-extrabold text-[#0f0f0f] mt-0.5">
                        ${course.price || 14.99}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoursesSection
