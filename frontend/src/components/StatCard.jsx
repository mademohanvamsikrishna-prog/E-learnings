import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const iconColors = {
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  trend,
  trendPositive = true,
  className = '',
}) {
  const iconColorClass = iconColors[color] || iconColors.indigo

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
            {value}
          </h3>

          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                  trendPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {trendPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                {trend}
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${iconColorClass}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
