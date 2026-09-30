import { useState, useMemo } from 'react'
import {
  Compass,
  Filter,
  SlidersHorizontal,
  Star,
  BookOpen,
  ArrowUpDown,
  Search,
  X,
  Sparkles,
} from 'lucide-react'
import { courses, categories } from '@/data/mockData'
import { CourseCard, SearchBar, Badge, Button, Select } from '@/components'

export function ExploreCourses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filter & sort logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const matchTitle = course.title.toLowerCase().includes(query)
          const matchDesc = course.shortDescription?.toLowerCase().includes(query)
          const matchInstructor = (course.instructor?.name || course.instructor)?.toLowerCase().includes(query)
          const matchCat = course.category?.toLowerCase().includes(query)
          if (!matchTitle && !matchDesc && !matchInstructor && !matchCat) return false
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (course.categoryId !== selectedCategory && course.category?.toLowerCase() !== selectedCategory) {
            return false
          }
        }

        // Level filter
        if (selectedLevel !== 'all') {
          if (!course.level.toLowerCase().includes(selectedLevel.toLowerCase())) {
            return false
          }
        }

        // Rating filter
        if (selectedRating !== 'all') {
          const minRating = parseFloat(selectedRating)
          if (course.rating < minRating) return false
        }

        // Price filter
        if (selectedPrice === 'free' && course.price > 0) return false
        if (selectedPrice === 'paid' && course.price === 0) return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        return (b.studentsCount || 0) - (a.studentsCount || 0) // default 'popular'
      })
  }, [searchQuery, selectedCategory, selectedLevel, selectedRating, selectedPrice, sortBy])

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedLevel('all')
    setSelectedRating('all')
    setSelectedPrice('all')
    setSortBy('popular')
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    selectedRating !== 'all' ||
    selectedPrice !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* ─── Page Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Course Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Courses
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Discover {courses.length} high-impact curricula taught by engineering leaders.
          </p>
        </div>

        <div className="w-full md:w-96">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by topic, skill, instructor..."
            size="md"
          />
        </div>
      </div>

      {/* ─── Category Pills Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ─── Main Content Layout with Filter Sidebar ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden lg:block w-64 bg-white rounded-2xl border border-slate-200/90 p-5 shrink-0 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              Filters
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Difficulty Level
            </label>
            <div className="space-y-1.5 text-xs text-slate-600">
              {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <label key={lvl} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="level"
                    checked={selectedLevel === lvl}
                    onChange={() => setSelectedLevel(lvl)}
                    className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <span>{lvl === 'all' ? 'All Levels' : lvl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Minimum Rating
            </label>
            <div className="space-y-1.5 text-xs text-slate-600">
              {[
                { label: 'All Ratings', value: 'all' },
                { label: '4.8 ★ & above', value: '4.8' },
                { label: '4.5 ★ & above', value: '4.5' },
                { label: '4.0 ★ & above', value: '4.0' },
              ].map((r) => (
                <label key={r.value} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === r.value}
                    onChange={() => setSelectedRating(r.value)}
                    className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <span className="flex items-center gap-1">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Price
            </label>
            <div className="space-y-1.5 text-xs text-slate-600">
              {[
                { label: 'All Courses', value: 'all' },
                { label: 'Paid Courses', value: 'paid' },
                { label: 'Free Previews', value: 'free' },
              ].map((p) => (
                <label key={p.value} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPrice === p.value}
                    onChange={() => setSelectedPrice(p.value)}
                    className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Top Bar: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs text-slate-500">
              Showing <strong className="text-slate-900 font-semibold">{filteredCourses.length}</strong> available courses
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No courses match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching with different keywords or clearing applied filters to see all available tracks.
              </p>
              <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
