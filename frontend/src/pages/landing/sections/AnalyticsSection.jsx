import { Flame, Clock, Award, CheckCircle, BarChart3, TrendingUp, Sparkles } from 'lucide-react'

const WEEKLY_HOURS = [
  { day: 'Mon', hours: 2.5, percent: 50 },
  { day: 'Tue', hours: 3.8, percent: 76 },
  { day: 'Wed', hours: 4.5, percent: 90 },
  { day: 'Thu', hours: 2.0, percent: 40 },
  { day: 'Fri', hours: 3.2, percent: 64 },
  { day: 'Sat', hours: 5.0, percent: 100 },
  { day: 'Sun', hours: 2.8, percent: 56 },
]

const SKILL_MASTERY = [
  { skill: 'Java 21 Concurrency & Virtual Threads', score: 92, color: 'bg-[#5624d0]' },
  { skill: 'Distributed Event-Driven Architecture', score: 86, color: 'bg-purple-600' },
  { skill: 'PostgreSQL Indexing & Performance Tuning', score: 94, color: 'bg-indigo-600' },
  { skill: 'FastAPI Async Production APIs', score: 88, color: 'bg-blue-600' },
]

export function AnalyticsSection() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5624d0] block mb-2">
            Real-Time Analytics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Measurable progress on every lesson
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Gain full visibility into your daily study velocity, pinpoint technical knowledge gaps, and watch your skills compound week over week.
          </p>
        </div>

        {/* Dashboard Preview Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-md">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between text-2xs text-slate-500 font-medium mb-1">
                <span>Learning Hours</span>
                <Clock className="w-4 h-4 text-[#5624d0]" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">124.5 hrs</div>
              <div className="text-2xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14% vs last week
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between text-2xs text-slate-500 font-medium mb-1">
                <span>Course Completion</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">78.4%</div>
              <div className="text-2xs text-slate-500 mt-1">4 of 5 courses done</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between text-2xs text-slate-500 font-medium mb-1">
                <span>Quiz Average</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">89.2%</div>
              <div className="text-2xs text-emerald-600 font-semibold mt-1">Top 5% percentile</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between text-2xs text-slate-500 font-medium mb-1">
                <span>Daily Streak</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">14 Days</div>
              <div className="text-2xs text-orange-600 font-semibold mt-1">Active Streak 🔥</div>
            </div>
          </div>

          {/* Lower Visual Grid: Weekly Velocity Bar Chart + Skill Competency Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {/* Weekly Learning Activity Bar Visualization */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#5624d0]" /> Weekly Study Velocity
                </h4>
                <span className="text-2xs text-slate-500 font-medium">23.8h Total</span>
              </div>

              <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 bg-slate-50 rounded-xl border border-slate-200/80">
                {WEEKLY_HOURS.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-3xs font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.hours}h
                    </span>
                    <div
                      style={{ height: `${item.percent}%` }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-500 ${
                        item.percent === 100
                          ? 'bg-[#5624d0] shadow-sm'
                          : 'bg-purple-300 group-hover:bg-[#5624d0]'
                      }`}
                    />
                    <span className="text-2xs font-semibold text-slate-600 pb-2">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Mastery Progression */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900">Verified Technical Competency</h4>
                <span className="text-2xs text-[#5624d0] font-semibold">Continuous Assessment</span>
              </div>

              <div className="space-y-4">
                {SKILL_MASTERY.map((skill) => (
                  <div key={skill.skill} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{skill.skill}</span>
                      <span className="font-mono font-bold text-slate-900">{skill.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${skill.score}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${skill.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnalyticsSection
