import { Link } from 'react-router-dom'
import { PlayCircle, CheckCircle2, Clock } from 'lucide-react'
import ProgressBar from './ProgressBar'
import Button from './Button'
import Badge from './Badge'

export function CourseProgress({
  course,
  className = '',
}) {
  if (!course) return null

  const progress = course.progress || 0
  const isComplete = progress === 100

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Thumbnail */}
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full sm:w-28 h-20 object-cover rounded-xl shrink-0 border border-slate-100"
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {course.category && (
              <Badge variant="primary" size="sm">
                {course.category}
              </Badge>
            )}
            {isComplete && (
              <Badge variant="success" size="sm" icon={CheckCircle2}>
                Completed
              </Badge>
            )}
          </div>

          <h4 className="font-semibold text-slate-900 text-base truncate">
            {course.title}
          </h4>

          {course.lastLesson && (
            <p className="text-xs text-slate-500 mt-1 truncate">
              Last lesson:{' '}
              <span className="font-medium text-slate-700">
                {course.lastLesson}
              </span>
            </p>
          )}

          {/* Progress bar */}
          <div className="mt-3">
            <ProgressBar
              value={progress}
              showPercentage
              color={isComplete ? 'emerald' : 'indigo'}
            />
          </div>
        </div>

        {/* Action */}
        <div className="mt-3 sm:mt-0 w-full sm:w-auto shrink-0 flex items-center justify-end">
          <Link to={`/learn/${course.id}`} className="w-full sm:w-auto">
            <Button
              variant={isComplete ? 'secondary' : 'primary'}
              size="sm"
              icon={isComplete ? CheckCircle2 : PlayCircle}
              className="w-full sm:w-auto font-medium"
            >
              {isComplete ? 'Review Course' : 'Continue Learning'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress
