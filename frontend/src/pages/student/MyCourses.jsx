import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  PlayCircle,
  Filter,
} from 'lucide-react'
import { enrolledCourses } from '@/data/mockData'
import { CourseProgress, SearchBar, Button, Badge } from '@/components'

export function MyCourses() {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'in-progress' | 'completed'
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = enrolledCourses.filter((course) => {
    // Tab filter
    if (activeTab === 'in-progress' && course.progress === 100) return false
    if (activeTab === 'completed' && course.progress < 100) return false

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = course.title.toLowerCase().includes(q)
      const matchInstructor = course.instructor.toLowerCase().includes(q)
      const matchCategory = course.category.toLowerCase().includes(q)
      if (!matchTitle && !matchInstructor && !matchCategory) return false
    }

    return true
  })

  const inProgressCount = enrolledCourses.filter((c) => c.progress < 100).length
  const completedCount = enrolledCourses.filter((c) => c.progress === 100).length

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ─── Top Header & Search ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Courses
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your active enrollments and pick up where you left off.
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search enrolled courses..."
            size="md"
          />
        </div>
      </div>

      {/* ─── Tabs Filter Bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>All Courses</span>
            <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {enrolledCourses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('in-progress')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'in-progress'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>In Progress</span>
            <span className="text-2xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
              {inProgressCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Completed</span>
            <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              {completedCount}
            </span>
          </button>
        </div>

        <Link to="/explore">
          <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right" className="hidden sm:inline-flex">
            Browse More
          </Button>
        </Link>
      </div>

      {/* ─── Enrolled Courses List ──────────────────────────────────────────────── */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No courses found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No enrolled courses match "${searchQuery}".`
              : activeTab === 'completed'
              ? 'You have not completed any courses yet. Keep learning!'
              : 'You do not have any enrolled courses in this view.'}
          </p>
          <Link to="/explore">
            <Button size="sm">Explore New Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseProgress key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses
