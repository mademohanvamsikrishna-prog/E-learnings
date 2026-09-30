import { Link } from 'react-router-dom'
import { Star, Clock, Users, BookOpen, ArrowRight } from 'lucide-react'
import Badge from './Badge'
import Avatar from './Avatar'
import ProgressBar from './ProgressBar'
import Button from './Button'

export function CourseCard({
  course,
  progress,
  variant = 'default', // 'default' | 'compact' | 'enrolled'
  className = '',
}) {
  if (!course) return null

  const isEnrolled = progress !== undefined || variant === 'enrolled'
  const progressValue = progress !== undefined ? progress : course.progress || 0

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col ${className}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {course.category && (
            <Badge variant="primary" size="sm" className="bg-white/95 backdrop-blur-xs font-semibold shadow-xs">
              {course.category}
            </Badge>
          )}
          {course.isBestseller && (
            <Badge variant="warning" size="sm" className="bg-amber-500 text-white font-semibold shadow-xs border-amber-600">
              Bestseller
            </Badge>
          )}
        </div>

        {course.level && (
          <span className="absolute bottom-3 right-3 text-2xs px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-medium backdrop-blur-xs">
            {course.level}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link
            to={isEnrolled ? `/learn/${course.id}` : `/courses/${course.id}`}
            className="block font-semibold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {course.title}
          </Link>

          {/* Instructor */}
          <div className="mt-2.5 flex items-center gap-2">
            <Avatar
              src={course.instructor?.avatar}
              name={course.instructor?.name || course.instructor}
              size="xs"
            />
            <span className="text-xs text-slate-600 font-medium truncate">
              {course.instructor?.name || course.instructor}
            </span>
          </div>

          {/* Rating & Stats */}
          {!isEnrolled && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1 font-semibold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{course.rating || '4.9'}</span>
                {course.reviewsCount && (
                  <span className="text-slate-400 font-normal">({course.reviewsCount.toLocaleString()})</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {course.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {course.duration}
                  </span>
                )}
                {course.studentsCount && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {(course.studentsCount / 1000).toFixed(1)}k
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Enrolled Progress vs Marketplace Pricing */}
        {isEnrolled ? (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="mb-3">
              <ProgressBar
                value={progressValue}
                showPercentage
                label={course.lastLesson ? 'Course Progress' : undefined}
                color={progressValue === 100 ? 'emerald' : 'indigo'}
              />
              {course.lastLesson && (
                <p className="text-xs text-slate-500 truncate mt-1">
                  Last: <span className="text-slate-700 font-medium">{course.lastLesson}</span>
                </p>
              )}
            </div>

            <Link to={`/learn/${course.id}`}>
              <Button
                variant={progressValue === 100 ? 'secondary' : 'primary'}
                size="sm"
                className="w-full justify-between"
                icon={ArrowRight}
                iconPosition="right"
              >
                {progressValue === 100 ? 'Review Course' : 'Continue Learning'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">${course.price}</span>
              {course.originalPrice && (
                <span className="text-xs text-slate-400 line-through">${course.originalPrice}</span>
              )}
            </div>

            <Link to={`/courses/${course.id}`}>
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                View Details
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCard
