import { useState } from 'react'
import {
  BarChart3,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Target,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react'
import { analyticsData, enrolledCourses } from '@/data/mockData'
import { StatCard, Card, CardHeader, ProgressBar, Badge, Button } from '@/components'

// BUG-13 fix: replaced all light-mode classes with dark-theme equivalents
// to match the bg-[#0a0a0a] DashboardLayout background.

export function ProgressAnalytics() {
  const [weeklyGoal, setWeeklyGoal] = useState(15) // 15 hours goal

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ─── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Learning Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Progress &amp; Analytics
          </h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">
            Comprehensive breakdown of your study hours, quiz accuracy, and milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="lg" icon={Flame}>
            14-Day Study Streak
          </Badge>
        </div>
      </div>

      {/* ─── Metrics Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${analyticsData.overallProgress}%`}
          subtitle="Across all enrolled tracks"
          icon={TrendingUp}
          color="indigo"
          trend="+5% this week"
          trendPositive
        />
        <StatCard
          title="Learning Hours"
          value={`${analyticsData.totalHoursLearned}h`}
          subtitle="Total video &amp; sandbox time"
          icon={Clock}
          color="emerald"
          trend="+3.5 hrs yesterday"
          trendPositive
        />
        <StatCard
          title="Quiz Average"
          value={`${analyticsData.averageQuizScore}%`}
          subtitle="5 quizzes passed"
          icon={CheckCircle2}
          color="purple"
          trend="Top 10% of cohort"
          trendPositive
        />
        <StatCard
          title="Assignments Done"
          value={`${analyticsData.assignmentsCompleted} / 10`}
          subtitle="1 assignment in review"
          icon={Award}
          color="amber"
          trend="90% submission rate"
          trendPositive
        />
      </div>

      {/* ─── Charts & Breakdown Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Bar Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-white/8 bg-white/4 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Weekly Learning Activity</h3>
                <p className="text-xs text-white/40 mt-0.5">Hours logged per day (Mon - Sun)</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                Total: 29.0 hrs
              </span>
            </div>

            <div className="pt-4 pb-2">
              <div className="flex items-end justify-between h-48 sm:h-56 gap-3 sm:gap-6 px-2">
                {analyticsData.weeklyActivity.map((item, idx) => {
                  const maxHours = 7
                  const barHeight = Math.min(100, Math.round((item.hours / maxHours) * 100))
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-semibold text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.hours}h
                      </span>
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 transition-all cursor-pointer"
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className="text-xs font-bold text-white/40">{item.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/6 flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Study Sessions
              </span>
              <span>Daily Average: <strong className="text-white/70">4.1 Hours</strong></span>
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress (1 Col) */}
        <div className="lg:col-span-1">
          <div className="h-full rounded-2xl border border-white/8 bg-white/4 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white">Weekly Goal</h3>
                <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-white/40 mb-4">Target: 15.0 hrs/week</p>

              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-28 h-28 rounded-full border-8 border-purple-600 border-t-purple-900/60 flex flex-col items-center justify-center mx-auto">
                    <span className="text-2xl font-extrabold text-white">82%</span>
                    <span className="text-[10px] text-white/40 font-semibold">12.3 / 15h</span>
                  </div>
                </div>

                <p className="text-xs text-white/50 text-center leading-relaxed">
                  You need <strong className="text-white/80">2.7 hours</strong> more over the weekend to crush your weekly target!
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/6">
              <button className="w-full py-2.5 rounded-xl border border-white/8 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/60 hover:text-white transition-all cursor-pointer">
                Adjust Weekly Target
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Course Completion Breakdown & Quiz Performance ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion Breakdown */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
          <h3 className="text-sm font-bold text-white mb-0.5">Course Completion Breakdown</h3>
          <p className="text-xs text-white/40 mb-4">Current status across all your enrolled tracks</p>

          <div className="space-y-4">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/80 truncate max-w-[260px]">
                    {c.title}
                  </span>
                  <span className="font-bold text-white/60 ml-2">{c.progress}%</span>
                </div>
                <ProgressBar
                  value={c.progress}
                  color={c.progress === 100 ? 'emerald' : 'indigo'}
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Performance History */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
          <h3 className="text-sm font-bold text-white mb-0.5">Quiz Performance History</h3>
          <p className="text-xs text-white/40 mb-4">Recent module assessment scores</p>

          <div className="space-y-3">
            {analyticsData.quizPerformance.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/4 border border-white/6 rounded-xl flex items-center justify-between text-xs hover:border-white/12 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-white/80">{q.name}</h4>
                  <p className="text-[10px] text-white/35 mt-0.5">{q.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-extrabold text-sm ${
                      q.score >= 90
                        ? 'text-emerald-400'
                        : q.score >= 80
                        ? 'text-indigo-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {q.score}%
                  </span>
                  <Badge variant={q.score >= 80 ? 'success' : 'warning'} size="sm">
                    {q.score >= 80 ? 'Pass' : 'Review'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Earned Achievements & Badges ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
        <h3 className="text-sm font-bold text-white mb-0.5">Achievements &amp; Milestones</h3>
        <p className="text-xs text-white/40 mb-4">Badges unlocked through study consistency and exam performance</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analyticsData.achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-4 rounded-xl border border-white/8 bg-white/4 flex flex-col items-center text-center hover:border-purple-500/25 hover:bg-purple-500/5 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/10 text-2xl flex items-center justify-center mb-3">
                {ach.icon}
              </div>
              <h4 className="font-bold text-white/80 text-xs">{ach.title}</h4>
              <p className="text-[10px] text-white/40 mt-1 leading-snug">{ach.description}</p>
              <span className="mt-3 text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                {ach.earnedDate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressAnalytics
