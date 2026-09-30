import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseService } from '@/services/courseService'

export default function CourseCatalog() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    courseService.list()
      .then(setCourses)
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Explore Courses</h1>
        <p className="text-slate-400">Discover top-rated courses and start learning today.</p>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="card border-red-500/30 text-red-400">{error}</div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-slate-400 text-lg mb-2">No courses available yet.</p>
          <p className="text-slate-500 text-sm">Check back soon!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="card group hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-200"
          >
            <div className="w-full h-36 bg-primary-500/10 rounded-xl mb-4 flex items-center justify-center">
              <span className="text-primary-400 text-4xl">📚</span>
            </div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-2">
                {course.title}
              </h2>
              <span className="badge-primary shrink-0">{course.level}</span>
            </div>
            <p className="text-slate-400 text-xs line-clamp-2 mb-3">{course.short_description}</p>
            <p className="text-primary-400 font-semibold text-sm">
              {course.is_free ? 'Free' : `$${course.price}`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
