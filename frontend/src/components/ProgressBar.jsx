export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = false,
  color = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const colors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-600',
    rose: 'bg-rose-500',
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  const barColor = colors[color] || colors.indigo
  const heightClass = heights[size] || heights.md

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercentage && <span className="font-semibold text-slate-600">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${barColor} ${heightClass} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

export default ProgressBar
