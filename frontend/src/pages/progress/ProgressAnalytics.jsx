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

export function ProgressAnalytics() {
  const [weeklyGoal, setWeeklyGoal] = useState(15) // 15 hours goal

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ─── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Learning Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Progress & Analytics
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
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
          subtitle="Total video & sandbox time"
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
          <Card className="h-full">
            <CardHeader
              title="Weekly Learning Activity"
              subtitle="Hours logged per day (Mon - Sun)"
              action={
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  Total: 29.0 hrs
                </span>
              }
            />

            <div className="pt-6 pb-2">
              <div className="flex items-end justify-between h-48 sm:h-56 gap-3 sm:gap-6 px-2">
                {analyticsData.weeklyActivity.map((item, idx) => {
                  const maxHours = 7
                  const barHeight = Math.min(100, Math.round((item.hours / maxHours) * 100))
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-2xs font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.hours}h
                      </span>
                      <div
                        className="w-full rounded-t-xl bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer relative"
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className="text-xs font-bold text-slate-600">{item.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Study Sessions
              </span>
              <span>Daily Average: <strong>4.1 Hours</strong></span>
            </div>
          </Card>
        </div>

        {/* Weekly Goal Progress (1 Col) */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Weekly Goal"
                subtitle="Target: 15.0 hrs/week"
                action={<Badge variant="primary" size="sm">Active</Badge>}
              />

              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-28 h-28 rounded-full border-8 border-indigo-600 border-t-indigo-200 flex flex-col items-center justify-center mx-auto shadow-inner">
                    <span className="text-2xl font-extrabold text-slate-900">82%</span>
                    <span className="text-2xs text-slate-500 font-semibold">12.3 / 15h</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 text-center leading-relaxed">
                  You need <strong>2.7 hours</strong> more over the weekend to crush your weekly target!
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button variant="secondary" size="sm" className="w-full">
                Adjust Weekly Target
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Course Completion Breakdown & Quiz Performance ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion Breakdown */}
        <Card>
          <CardHeader
            title="Course Completion Breakdown"
            subtitle="Current status across all your enrolled tracks"
          />

          <div className="space-y-4 pt-2">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 truncate max-w-[260px]">
                    {c.title}
                  </span>
                  <span className="font-bold text-slate-700">{c.progress}%</span>
                </div>
                <ProgressBar
                  value={c.progress}
                  color={c.progress === 100 ? 'emerald' : 'indigo'}
                  size="md"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Quiz Performance History */}
        <Card>
          <CardHeader
            title="Quiz Performance History"
            subtitle="Recent module assessment scores"
          />

          <div className="space-y-3 pt-2">
            {analyticsData.quizPerformance.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">{q.name}</h4>
                  <p className="text-2xs text-slate-400">{q.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-extrabold text-sm ${
                      q.score >= 90
                        ? 'text-emerald-600'
                        : q.score >= 80
                        ? 'text-indigo-600'
                        : 'text-amber-600'
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
        </Card>
      </div>

      {/* ─── Earned Achievements & Badges ───────────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Achievements & Milestones"
          subtitle="Badges unlocked through study consistency and exam performance"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {analyticsData.achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col items-center text-center hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-2xl flex items-center justify-center shadow-xs border border-slate-200 mb-3">
                {ach.icon}
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{ach.title}</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-snug">{ach.description}</p>
              <span className="mt-3 text-2xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {ach.earnedDate}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ProgressAnalytics
