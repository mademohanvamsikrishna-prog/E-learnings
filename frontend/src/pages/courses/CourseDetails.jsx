import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Globe,
  Share2,
  Sparkles,
} from 'lucide-react'
import { courses, mockUser } from '@/data/mockData'
import { Button, Card, Badge, Avatar, Modal } from '@/components'

export function CourseDetails() {
  const { courseId, id } = useParams()
  const navigate = useNavigate()
  const targetId = courseId || id || 'course-1'

  // Fetch course or default to first course
  const course = courses.find((c) => c.id === targetId) || courses[0]

  // Accordion state for modules
  const [expandedModules, setExpandedModules] = useState({ 'mod-1': true, 'mod-2': true })
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showEnrollSuccess, setShowEnrollSuccess] = useState(false)

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }))
  }

  const handleEnroll = () => {
    setIsEnrolled(true)
    setShowEnrollSuccess(true)
  }

  const faqs = [
    {
      q: 'Will I get lifetime access to the course videos and materials?',
      a: 'Yes! Once enrolled, you enjoy full lifetime access to all current and future curriculum updates, downloadable code repositories, and slide decks.',
    },
    {
      q: 'How does the AI Tutor assist me during this course?',
      a: 'The AI Tutor is built directly into every lesson. You can ask for simplified analogies, code error explanations, or customized practice quizzes tailored to the exact topic you are learning.',
    },
    {
      q: 'Do I receive a certificate upon finishing?',
      a: 'Yes, after completing 100% of the lessons, passing the module quizzes, and submitting the capstone assignment, you receive a verified shareable certificate of completion.',
    },
  ]

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-fade-in">
      {/* ─── Top Course Hero Section ────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Course Overview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
                  {course.category}
                </Badge>
                {course.isBestseller && (
                  <Badge variant="warning" size="sm" className="bg-amber-500 text-white border-transparent">
                    Bestseller
                  </Badge>
                )}
                <span className="text-xs text-slate-400">Updated October 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {course.shortDescription || course.description}
              </p>

              {/* Badges / Rating row */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating || '4.9'}</span>
                  <span className="text-slate-400 font-normal">
                    ({course.reviewsCount?.toLocaleString() || '2,340'} ratings)
                  </span>
                </div>

                <span className="text-slate-500">•</span>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{(course.studentsCount || 14800).toLocaleString()} students enrolled</span>
                </div>

                <span className="text-slate-500">•</span>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{course.duration || '24 Hours'} total</span>
                </div>

                <span className="text-slate-500">•</span>

                <span className="text-indigo-300 font-medium">{course.level}</span>
              </div>

              {/* Instructor Mini Badge */}
              <div className="flex items-center gap-3 pt-4">
                <Avatar
                  src={course.instructor?.avatar}
                  name={course.instructor?.name || course.instructor}
                  size="md"
                />
                <div>
                  <p className="text-xs text-slate-400">Created by</p>
                  <p className="text-sm font-semibold text-white">
                    {course.instructor?.name || course.instructor}
                  </p>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Floating Enrollment Box (Desktop) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-900 sticky top-24">
                {/* Preview Thumbnail */}
                <div className="relative aspect-video bg-slate-800">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="w-14 h-14 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                      <PlayCircle className="w-8 h-8 fill-indigo-600 text-white" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 left-3 text-2xs px-2 py-0.5 rounded bg-slate-900/80 text-white font-medium">
                    Preview this course
                  </span>
                </div>

                {/* Price and CTA */}
                <div className="p-6 space-y-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-medium">
                        ${course.originalPrice}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      35% OFF
                    </span>
                  </div>

                  {isEnrolled ? (
                    <Button
                      size="lg"
                      variant="success"
                      className="w-full font-bold shadow-md"
                      onClick={() => navigate(`/learn/${course.id}`)}
                      icon={PlayCircle}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full font-bold shadow-md text-base"
                      onClick={handleEnroll}
                    >
                      Enroll Now
                    </Button>
                  )}

                  <p className="text-center text-2xs text-slate-500">
                    30-Day Money-Back Guarantee • Full Lifetime Access
                  </p>

                  {/* Course Includes Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <p className="font-bold text-slate-900 uppercase tracking-wider text-2xs">
                      This course includes:
                    </p>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{course.duration} on-demand HD video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Downloadable code repos and architecture notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Integrated 24/7 AI tutor assistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Verified certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Details Body (What You'll Learn, Curriculum, Instructor, FAQ) ───── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            {course.whatYouWillLearn && (
              <Card>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  What you'll learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Course Content / Curriculum Accordion */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Course Content
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.curriculum?.length || 4} modules • {course.totalLessons || 42} lectures • {course.duration} total length
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const allOpen = Object.values(expandedModules).every(Boolean)
                    const updated = {}
                    ;(course.curriculum || []).forEach((m) => {
                      updated[m.id] = !allOpen
                    })
                    setExpandedModules(updated)
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Expand / Collapse All
                </button>
              </div>

              {/* Module Accordions */}
              <div className="space-y-3">
                {(course.curriculum?.length
                  ? course.curriculum
                  : [
                      {
                        id: 'mod-1',
                        title: 'Module 1: Foundations & Architecture Setup',
                        duration: '4h 15m',
                        lessons: [
                          { id: '1', title: '1. Introduction to the Platform and Tech Stack', duration: '15 min', isFree: true },
                          { id: '2', title: '2. Project Skeleton, Git, and Docker Setup', duration: '25 min', isFree: true },
                          { id: '3', title: '3. Core Primitives and System Design Overview', duration: '30 min', isFree: false },
                        ],
                      },
                      {
                        id: 'mod-2',
                        title: 'Module 2: Deep Dive into Core Architecture',
                        duration: '6h 30m',
                        lessons: [
                          { id: '4', title: '1. Implementing the Primary Data Models', duration: '35 min', isFree: false },
                          { id: '5', title: '2. State Management & Service Layer Isolation', duration: '45 min', isFree: false },
                        ],
                      },
                      {
                        id: 'mod-3',
                        title: 'Module 3: Production Deployment & Capstone',
                        duration: '5h 00m',
                        lessons: [
                          { id: '6', title: '1. Writing Comprehensive Automated Tests', duration: '40 min', isFree: false },
                          { id: '7', title: '2. Deploying to Cloud & Earning Your Certificate', duration: '50 min', isFree: false },
                        ],
                      },
                    ]
                ).map((mod) => {
                  const isOpen = !!expandedModules[mod.id]
                  return (
                    <div
                      key={mod.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2.5">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                          <span className="font-semibold text-slate-900 text-sm">
                            {mod.title}
                          </span>
                        </div>

                        <span className="text-2xs text-slate-500 font-medium shrink-0">
                          {mod.lessons?.length || 3} lectures • {mod.duration}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {(mod.lessons || []).map((les) => (
                            <div
                              key={les.id}
                              className="p-3.5 pl-9 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 text-slate-700">
                                <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-medium">{les.title}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                {les.isFree ? (
                                  <Link
                                    to={`/learn/${course.id}`}
                                    className="text-2xs font-semibold text-indigo-600 hover:underline"
                                  >
                                    Preview
                                  </Link>
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                                )}
                                <span className="text-2xs text-slate-400">{les.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Requirements & Description */}
            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                {(course.requirements || [
                  'Basic programming understanding in any modern language',
                  'A computer with internet access and admin rights to install tools',
                ]).map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
                Description
              </h3>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                <p>{course.description}</p>
              </div>
            </Card>

            {/* Instructor Bio */}
            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                Instructor
              </h3>
              <div className="flex items-start gap-4">
                <Avatar
                  src={course.instructor?.avatar}
                  name={course.instructor?.name || course.instructor}
                  size="xl"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {course.instructor?.name || course.instructor}
                  </h4>
                  <p className="text-xs text-indigo-600 font-medium">
                    {course.instructor?.title || 'Principal Software Architect'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Senior engineering leader with over a decade of production distributed systems and curriculum design experience. Trained over 15,000 engineers globally.
                  </p>
                </div>
              </div>
            </Card>

            {/* FAQ */}
            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{faq.q}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enrollment Confirmation Modal */}
      <Modal
        isOpen={showEnrollSuccess}
        onClose={() => setShowEnrollSuccess(false)}
        title="Enrollment Successful! 🎉"
        subtitle={`You now have full access to ${course.title}`}
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Link to="/my-courses">
              <Button variant="secondary" size="sm">
                View My Courses
              </Button>
            </Link>
            <Link to={`/learn/${course.id}`}>
              <Button variant="primary" size="sm" icon={PlayCircle}>
                Start First Lesson
              </Button>
            </Link>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Welcome aboard! You have been enrolled in <strong>{course.title}</strong>.
          </p>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-indigo-900">
            <p className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Tutor Activated:
            </p>
            <p className="text-slate-600">
              Whenever you're watching video lectures or solving quizzes, tap "Ask AI" in the bottom-right corner for instant help.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CourseDetails
