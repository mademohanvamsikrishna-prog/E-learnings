import { Link } from 'react-router-dom'
import { Star, Clock, Users, ArrowRight, BookOpen } from 'lucide-react'
import Avatar from './Avatar'

export function CourseCard({
  course,
  progress,
  variant = 'default', // 'default' | 'compact' | 'enrolled'
  className = '',
}) {
  if (!course) return null

  const isEnrolled   = progress !== undefined || variant === 'enrolled'
  const progressValue = progress !== undefined ? progress : course.progress || 0

  return (
    <div
      className={`group relative rounded-2xl border border-white/8 bg-white/4 overflow-hidden hover:border-purple-500/25 hover:bg-white/6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(124,58,237,0.12)] flex flex-col ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-white/5">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {course.category && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/15">
              {course.category}
            </span>
          )}
          {course.isBestseller && (
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white">
              🏆 Bestseller
            </span>
          )}
        </div>

        {/* Level badge bottom-right */}
        {course.level && (
          <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white/80 border border-white/10">
            {course.level}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link
            to={isEnrolled ? `/learn/${course.id}` : `/courses/${course.id}`}
            className="block font-bold text-white/80 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2"
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
            <span className="text-xs text-white/35 font-medium truncate">
              {course.instructor?.name || course.instructor}
            </span>
          </div>

          {/* Rating & stats row */}
          {!isEnrolled && (
            <div className="mt-3 flex items-center justify-between text-xs text-white/35 pt-3 border-t border-white/6">
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{course.rating || '4.9'}</span>
                {course.reviewsCount && (
                  <span className="text-white/25 font-normal">({course.reviewsCount.toLocaleString()})</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {course.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-white/20" /> {course.duration}
                  </span>
                )}
                {course.studentsCount && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-white/20" /> {(course.studentsCount / 1000).toFixed(1)}k
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isEnrolled ? (
          <div className="mt-4 pt-3 border-t border-white/6 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/35">Progress</span>
                <span className="text-purple-400 font-bold">{progressValue}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${progressValue === 100 ? 'from-emerald-500 to-teal-500' : 'from-purple-500 to-indigo-500'} transition-all`}
                  style={{ width: `${progressValue}%` }}
                />
              </div>
              {course.lastLesson && (
                <p className="text-[10px] text-white/25 truncate mt-1">Last: {course.lastLesson}</p>
              )}
            </div>
            <Link to={`/learn/${course.id}`}>
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
                {progressValue === 100 ? 'Review Course' : 'Continue Learning'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-white">${course.price}</span>
              {course.originalPrice && (
                <span className="text-xs text-white/25 line-through">${course.originalPrice}</span>
              )}
            </div>
            <Link to={`/courses/${course.id}`}>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-white/60 hover:bg-purple-500/15 hover:border-purple-500/25 hover:text-purple-300 transition-all cursor-pointer">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCard
