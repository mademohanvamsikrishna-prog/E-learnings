import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseService } from '@/services/courseService'

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courseService.get(courseId)
      .then(setCourse)
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="page-container">
        <div className="card text-center py-16">
          <p className="text-slate-400 text-lg">Course not found.</p>
          <Link to="/courses" className="btn-primary mt-4 inline-flex">← Back to Courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-4xl">
      <Link to="/courses" className="text-slate-400 hover:text-white text-sm mb-6 inline-flex items-center gap-1">
        ← Back to Courses
      </Link>

      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
            <div className="flex items-center gap-2">
              <span className="badge-primary">{course.level}</span>
              <span className="badge badge-success">{course.status}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-400 shrink-0">
            {course.is_free ? 'Free' : `$${course.price}`}
          </p>
        </div>
        <p className="text-slate-400 text-sm">{course.description || 'No description available.'}</p>
      </div>

      <button className="btn-primary text-base px-8 py-3">Enroll Now</button>
    </div>
  )
}
