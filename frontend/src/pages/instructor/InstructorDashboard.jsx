import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BookOpen,
  DollarSign,
  Star,
  PlusCircle,
  TrendingUp,
  Award,
  Clock,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { instructorDashboardData } from '@/data/mockData'
import { StatCard, Card, CardHeader, Button, Badge, Modal } from '@/components'

export function InstructorDashboard() {
  const { user } = useAuth()
  const stats = instructorDashboardData.stats

  const [selectedSub, setSelectedSub] = useState(null)
  const [gradeInput, setGradeInput] = useState('95')
  const [feedbackInput, setFeedbackInput] = useState('Great clean architecture and tests!')
  const [gradeSuccess, setGradeSuccess] = useState(false)

  const handleGradeSubmit = () => {
    setGradeSuccess(true)
    setTimeout(() => {
      setGradeSuccess(false)
      setSelectedSub(null)
    }, 1200)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ─── Top Greeting & CTA ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Instructor'} 👋
            </h1>
            <Badge variant="purple" size="sm">
              Lead Instructor
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your courses have enrolled <strong className="text-slate-900 font-semibold">1,240 new students</strong> this month across all specializations.
          </p>
        </div>

        <Link to="/instructor/create-course">
          <Button size="md" icon={PlusCircle} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
            Create New Course
          </Button>
        </Link>
      </div>

      {/* ─── Metric Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          subtitle="Across 6 active tracks"
          icon={Users}
          color="indigo"
          trend="+12% this month"
          trendPositive
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="Net payouts: $47,160"
          icon={DollarSign}
          color="emerald"
          trend="+18% vs last month"
          trendPositive
        />
        <StatCard
          title="Average Rating"
          value={`${stats.averageRating} ★`}
          subtitle="Based on 3,820 reviews"
          icon={Star}
          color="amber"
          trend="Top 5% instructor"
          trendPositive
        />
        <StatCard
          title="Active Courses"
          value={stats.activeCourses}
          subtitle="1 draft in review"
          icon={BookOpen}
          color="purple"
          trend="All published healthy"
          trendPositive
        />
      </div>

      {/* ─── Revenue Analytics & Recent Activity Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend (2 Cols) */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader
              title="Revenue & Growth Analytics"
              subtitle="Monthly earnings trajectory ($)"
              action={
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  +24% Year-over-Year
                </span>
              }
            />

            <div className="pt-6 pb-2">
              <div className="flex items-end justify-between h-48 sm:h-56 gap-3 sm:gap-6 px-2">
                {instructorDashboardData.revenueTrend.map((m, idx) => {
                  const maxRev = 18000
                  const height = Math.min(100, Math.round((m.revenue / maxRev) * 100))
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-2xs font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${(m.revenue / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs font-bold text-slate-600">{m.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Next payout date: <strong>October 15, 2026</strong></span>
              <span className="font-semibold text-indigo-600">Stripe Direct Deposit Active</span>
            </div>
          </Card>
        </div>

        {/* Submissions to Grade & Activity (1 Col) */}
        <div className="lg:col-span-1 space-y-4">
          <Card padding="p-5" className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Student Submissions"
                subtitle="Pending evaluation"
                action={<Badge variant="warning" size="sm">2 Pending</Badge>}
              />

              <div className="space-y-3">
                {instructorDashboardData.recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{sub.student}</span>
                      <span className="text-2xs text-slate-400">{sub.submittedAt}</span>
                    </div>

                    <p className="text-xs text-slate-600 truncate">{sub.assignment}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-2xs font-semibold text-slate-400">{sub.course}</span>

                      {sub.grade ? (
                        <span className="text-2xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Graded: {sub.grade}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedSub(sub)}
                          className="text-2xs py-1 px-2.5 text-indigo-600"
                        >
                          Grade Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <Button variant="secondary" size="sm" className="w-full">
                View All Student Submissions
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Course Performance Table ───────────────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Course Performance"
          subtitle="Enrollment figures, completion rates, and cumulative revenue"
          action={
            <Link to="/instructor/create-course">
              <Button size="sm" icon={PlusCircle}>
                New Course
              </Button>
            </Link>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-2xs border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Completion Rate</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {instructorDashboardData.coursePerformance.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                    {c.title}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {c.students.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span>{c.completionRate}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${c.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">
                    ★ {c.rating}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {c.revenue}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={c.status === 'Published' ? 'success' : 'neutral'} size="sm">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grading Modal */}
      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={`Grade Submission: ${selectedSub.student}`}
          subtitle={`${selectedSub.assignment} • ${selectedSub.course}`}
        >
          <div className="space-y-4 text-xs">
            {gradeSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold">
                ✓ Grade and feedback submitted successfully!
              </div>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Grade Score (out of 100)
                  </label>
                  <input
                    type="number"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Instructor Feedback & Code Review Comments
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedSub(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleGradeSubmit}>
                    Submit Evaluation
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default InstructorDashboard
