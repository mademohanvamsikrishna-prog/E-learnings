import { useState, useMemo } from 'react'
import {
  Compass, SlidersHorizontal, Star, Search, X, Sparkles,
} from 'lucide-react'
import { courses, categories } from '@/data/mockData'
import { CourseCard } from '@/components'

// ─── Dark radio group ─────────────────────────────────────────────────────────
function DarkRadio({ name, options, value, onChange }) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer select-none group">
          <div
            onClick={() => onChange(opt.value)}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
              value === opt.value
                ? 'border-purple-500 bg-purple-500'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <span className={`text-xs transition-colors ${value === opt.value ? 'text-purple-300 font-bold' : 'text-white/40 group-hover:text-white/60'}`}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  )
}

export function ExploreCourses() {
  const [searchQuery,      setSearchQuery]      = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel,    setSelectedLevel]    = useState('all')
  const [selectedRating,   setSelectedRating]   = useState('all')
  const [selectedPrice,    setSelectedPrice]    = useState('all')
  const [sortBy,           setSortBy]           = useState('popular')

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle      = course.title.toLowerCase().includes(q)
          const matchDesc       = course.shortDescription?.toLowerCase().includes(q)
          const matchInstructor = (course.instructor?.name || course.instructor)?.toLowerCase().includes(q)
          const matchCat        = course.category?.toLowerCase().includes(q)
          if (!matchTitle && !matchDesc && !matchInstructor && !matchCat) return false
        }
        if (selectedCategory !== 'all') {
          if (course.categoryId !== selectedCategory && course.category?.toLowerCase() !== selectedCategory) return false
        }
        if (selectedLevel !== 'all') {
          if (!course.level.toLowerCase().includes(selectedLevel.toLowerCase())) return false
        }
        if (selectedRating !== 'all') {
          if (course.rating < parseFloat(selectedRating)) return false
        }
        if (selectedPrice === 'free' && course.price > 0)  return false
        if (selectedPrice === 'paid' && course.price === 0) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'rating')     return b.rating - a.rating
        if (sortBy === 'price-low')  return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        return (b.studentsCount || 0) - (a.studentsCount || 0)
      })
  }, [searchQuery, selectedCategory, selectedLevel, selectedRating, selectedPrice, sortBy])

  const clearAll = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedLevel('all')
    setSelectedRating('all')
    setSelectedPrice('all')
    setSortBy('popular')
  }

  const hasFilters = searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all'
    || selectedRating !== 'all' || selectedPrice !== 'all'

  return (
    <div className="space-y-6 pb-16">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" /> Course Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Explore Courses</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">
            Discover {courses.length} high-impact curricula taught by engineering leaders.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, skill, instructor..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category pill bar ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)]'
                : 'bg-white/4 text-white/40 border-white/8 hover:border-white/16 hover:text-white/70 hover:bg-white/6'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Filter sidebar */}
        <div className="hidden lg:block w-60 rounded-2xl border border-white/8 bg-white/4 p-5 shrink-0 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/6">
            <span className="text-xs font-black text-white/60 uppercase tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" /> Filters
            </span>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Difficulty Level</p>
            <DarkRadio
              name="level"
              value={selectedLevel}
              onChange={setSelectedLevel}
              options={[
                { label: 'All Levels',    value: 'all' },
                { label: 'Beginner',      value: 'Beginner' },
                { label: 'Intermediate',  value: 'Intermediate' },
                { label: 'Advanced',      value: 'Advanced' },
              ]}
            />
          </div>

          {/* Rating */}
          <div className="pt-4 border-t border-white/6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Minimum Rating</p>
            <DarkRadio
              name="rating"
              value={selectedRating}
              onChange={setSelectedRating}
              options={[
                { label: 'All Ratings',  value: 'all' },
                { label: '4.8 ★ & above', value: '4.8' },
                { label: '4.5 ★ & above', value: '4.5' },
                { label: '4.0 ★ & above', value: '4.0' },
              ]}
            />
          </div>

          {/* Price */}
          <div className="pt-4 border-t border-white/6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Price</p>
            <DarkRadio
              name="price"
              value={selectedPrice}
              onChange={setSelectedPrice}
              options={[
                { label: 'All Courses',   value: 'all' },
                { label: 'Paid Courses',  value: 'paid' },
                { label: 'Free Previews', value: 'free' },
              ]}
            />
          </div>

          {/* AI Discover promo */}
          <div className="pt-4 border-t border-white/6">
            <div className="rounded-xl bg-gradient-to-br from-purple-600/15 to-indigo-600/10 border border-purple-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white/70">AI Recommend</span>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed mb-2.5">
                Let AI suggest the best courses for your skill level and goals.
              </p>
              <button className="w-full py-2 rounded-lg bg-purple-600/30 border border-purple-500/25 text-[11px] font-bold text-purple-300 hover:bg-purple-600/50 transition-all cursor-pointer">
                Get Suggestions →
              </button>
            </div>
          </div>
        </div>

        {/* Results area */}
        <div className="flex-1 w-full space-y-5">

          {/* Top bar: count & sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/8 bg-white/4">
            <div className="text-xs text-white/35">
              Showing <strong className="text-white font-bold">{filteredCourses.length}</strong> courses
              {hasFilters && (
                <button onClick={clearAll} className="ml-2 text-purple-400 hover:text-purple-300 font-bold cursor-pointer">
                  · Clear filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-white/25">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-white bg-white/6 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/40 cursor-pointer"
              >
                <option value="popular"    className="bg-[#1a1a1a]">Most Popular</option>
                <option value="rating"     className="bg-[#1a1a1a]">Highest Rated</option>
                <option value="price-low"  className="bg-[#1a1a1a]">Price: Low → High</option>
                <option value="price-high" className="bg-[#1a1a1a]">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Courses grid */}
          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/4 p-14 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-white">No courses match your criteria</h3>
              <p className="text-xs text-white/35 max-w-sm mx-auto">
                Try different keywords or clear the applied filters to see all available tracks.
              </p>
              <button
                onClick={clearAll}
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCourses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExploreCourses
