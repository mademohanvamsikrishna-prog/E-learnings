import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Layers,
  FileCode,
  DollarSign,
  Rocket,
  CheckCircle2,
  PlusCircle,
  Trash2,
  UploadCloud,
  PlayCircle,
  HelpCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react'
import { categories } from '@/data/mockData'
import { Button, Card, CardHeader, Input, Select, Badge, Modal } from '@/components'

export function CreateCoursePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1) // 1 to 5
  const [publishSuccessModal, setPublishSuccessModal] = useState(false)

  // Step 1: Basic Information
  const [title, setTitle] = useState('Full-Stack Java 21 & Microservices Architecture')
  const [subtitle, setSubtitle] = useState('Master distributed Spring Boot backends with Kafka and Docker')
  const [description, setDescription] = useState('Comprehensive engineering track for backend developers...')
  const [category, setCategory] = useState('programming')
  const [level, setLevel] = useState('Intermediate')
  const [language, setLanguage] = useState('English')
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800')

  // Step 2: Curriculum
  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Module 1: Distributed Architecture Fundamentals',
      lessons: [
        { id: 101, title: 'Introduction to Microservices Patterns', duration: '20 min', type: 'video' },
        { id: 102, title: 'Service Discovery with Eureka & Consul', duration: '35 min', type: 'video' },
        { id: 103, title: 'Module 1 Diagnostic Knowledge Check', duration: '15 min', type: 'quiz' },
      ],
    },
    {
      id: 2,
      title: 'Module 2: Event-Driven Streaming with Apache Kafka',
      lessons: [
        { id: 201, title: 'Kafka Topics, Partitions, and Consumer Groups', duration: '45 min', type: 'video' },
        { id: 202, title: 'Assignment: Build a Resilient Event Producer', duration: '60 min', type: 'assignment' },
      ],
    },
  ])

  // Step 3: Content Attachments
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
  const [pdfResourceName, setPdfResourceName] = useState('microservices-architecture-handbook.pdf')

  // Step 4: Pricing
  const [isPaid, setIsPaid] = useState(true)
  const [price, setPrice] = useState('89.99')
  const [discountPrice, setDiscountPrice] = useState('69.99')
  const [guarantee30Days, setGuarantee30Days] = useState(true)

  // Curriculum Helpers
  const addModule = () => {
    const nextId = modules.length + 1
    setModules([
      ...modules,
      {
        id: nextId,
        title: `Module ${nextId}: New Subject Area`,
        lessons: [{ id: Date.now(), title: '1. Initial Lecture Setup', duration: '25 min', type: 'video' }],
      },
    ])
  }

  const addLessonToModule = (modId, type = 'video') => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === modId) {
          const newLesson = {
            id: Date.now(),
            title: type === 'quiz' ? 'New Module Quiz' : type === 'assignment' ? 'New Capstone Assignment' : 'New Video Lesson',
            duration: type === 'quiz' ? '15 min' : '30 min',
            type,
          }
          return { ...mod, lessons: [...mod.lessons, newLesson] }
        }
        return mod
      })
    )
  }

  const removeModule = (modId) => {
    setModules((prev) => prev.filter((m) => m.id !== modId))
  }

  const removeLesson = (modId, lessonId) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === modId) {
          return { ...mod, lessons: mod.lessons.filter((l) => l.id !== lessonId) }
        }
        return mod
      })
    )
  }

  const steps = [
    { num: 1, label: 'Basic Info', icon: BookOpen },
    { num: 2, label: 'Curriculum', icon: Layers },
    { num: 3, label: 'Content', icon: FileCode },
    { num: 4, label: 'Pricing', icon: DollarSign },
    { num: 5, label: 'Publish', icon: Rocket },
  ]

  const handlePublish = () => {
    setPublishSuccessModal(true)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* ─── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Course Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create a New Course
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Build and publish production-grade technical curricula for the global student body.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => alert('Draft saved successfully!')}>
            Save Draft
          </Button>
        </div>
      </div>

      {/* ─── 5-Step Stepper Navigation ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((st, idx) => {
            const Icon = st.icon
            const isDone = currentStep > st.num
            const isCurrent = currentStep === st.num

            return (
              <div
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDone
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    isCurrent
                      ? 'bg-white text-indigo-600'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : st.num}
                </div>
                <span>{st.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Step 1: Basic Information ──────────────────────────────────────────── */}
      {currentStep === 1 && (
        <Card className="space-y-6">
          <CardHeader
            title="Step 1: Basic Course Information"
            subtitle="Define the high-level metadata, categorization, and cover visual"
          />

          <div className="space-y-4">
            <Input
              label="Course Title"
              placeholder="e.g. Mastering Microservices with Spring Boot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Input
              label="Course Subtitle / Tagline"
              placeholder="e.g. Build production-grade distributed architectures"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Course Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                placeholder="Explain what learners will build, prerequisites, and learning outcomes..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Difficulty Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </Select>

              <Select
                label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="French">French</option>
              </Select>
            </div>

            {/* Thumbnail URL / Uploader */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Course Thumbnail URL
              </label>
              <Input
                placeholder="https://images.unsplash.com/photo-..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />

              {thumbnail && (
                <div className="mt-3 w-48 aspect-video rounded-xl overflow-hidden border border-slate-200">
                  <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ─── Step 2: Curriculum Builder ─────────────────────────────────────────── */}
      {currentStep === 2 && (
        <Card className="space-y-6">
          <CardHeader
            title="Step 2: Curriculum & Syllabus Structure"
            subtitle="Organize your course into sequential modules, lectures, quizzes, and projects"
            action={
              <Button size="sm" onClick={addModule} icon={PlusCircle}>
                Add Module
              </Button>
            }
          />

          <div className="space-y-5">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const val = e.target.value
                        setModules((prev) =>
                          prev.map((m) => (m.id === mod.id ? { ...m, title: val } : m))
                        )
                      }}
                      className="font-bold text-slate-900 text-sm sm:text-base bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none w-full py-1"
                    />
                  </div>

                  <button
                    onClick={() => removeModule(mod.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                    title="Delete Module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Lessons inside Module */}
                <div className="space-y-2">
                  {mod.lessons.map((les) => (
                    <div
                      key={les.id}
                      className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {les.type === 'video' ? (
                          <PlayCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                        ) : les.type === 'quiz' ? (
                          <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800 truncate">{les.title}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-2xs text-slate-400">{les.duration}</span>
                        <button
                          onClick={() => removeLesson(mod.id, les.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add actions to module */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-2xs py-1"
                    icon={PlayCircle}
                    onClick={() => addLessonToModule(mod.id, 'video')}
                  >
                    + Add Video Lesson
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-2xs py-1"
                    icon={HelpCircle}
                    onClick={() => addLessonToModule(mod.id, 'quiz')}
                  >
                    + Add Quiz
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-2xs py-1"
                    icon={FileText}
                    onClick={() => addLessonToModule(mod.id, 'assignment')}
                  >
                    + Add Assignment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─── Step 3: Content Attachments ────────────────────────────────────────── */}
      {currentStep === 3 && (
        <Card className="space-y-6">
          <CardHeader
            title="Step 3: Lecture Content & Media Assets"
            subtitle="Upload video lectures, attach project starter archives, and author notes"
          />

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Demonstration Video URL (or Cloudinary / S3 Key)
              </label>
              <Input
                placeholder="https://..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-2xs text-slate-400 mt-1">
                Supports MP4, HLS streaming, Vimeo, or direct cloud storage keys.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Downloadable PDF / Code Starter Archive
              </label>
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-900">{pdfResourceName}</p>
                <p className="text-2xs text-slate-400 mt-0.5">Click to replace or upload another file</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                AI Knowledge Integration
              </label>
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                  <div>
                    <p className="font-bold text-purple-900">Auto-Index for AI Tutor</p>
                    <p className="text-2xs text-purple-700 mt-0.5">
                      Transcripts, code snippets, and lecture notes will automatically train the course AI assistant.
                    </p>
                  </div>
                </div>
                <Badge variant="purple" size="sm">Enabled</Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ─── Step 4: Pricing & Monetization ─────────────────────────────────────── */}
      {currentStep === 4 && (
        <Card className="space-y-6">
          <CardHeader
            title="Step 4: Pricing & Enrollment Model"
            subtitle="Configure course access, tuition fees, and money-back guarantees"
          />

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Course Type
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isPaid
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">Paid Course</p>
                  <p className="text-2xs text-slate-500 mt-1">Charge tuition fee for premium curriculum</p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    !isPaid
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">Free Access</p>
                  <p className="text-2xs text-slate-500 mt-1">Offer community track with free enrollment</p>
                </button>
              </div>
            </div>

            {isPaid && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md pt-2">
                <Input
                  label="Standard Price ($ USD)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  icon={DollarSign}
                />
                <Input
                  label="Discounted / Promo Price ($ USD)"
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  icon={DollarSign}
                />
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={guarantee30Days}
                  onChange={(e) => setGuarantee30Days(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span>Include 30-Day Student Satisfaction Guarantee badge</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* ─── Step 5: Final Review & Publish ─────────────────────────────────────── */}
      {currentStep === 5 && (
        <Card className="space-y-6">
          <CardHeader
            title="Step 5: Review & Publish"
            subtitle="Inspect your course syllabus checklist and push live to the student marketplace"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Summary Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Publication Readiness Checklist
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Title & Description configured</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{modules.length} Modules & {modules.reduce((a, m) => a + m.lessons.length, 0)} lectures organized</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Media streaming & PDF resources verified</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pricing set: ${discountPrice || price} USD</span>
                </div>
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                Live Marketplace Card Preview
              </span>

              {thumbnail && (
                <img src={thumbnail} alt="Preview" className="w-full aspect-video rounded-xl object-cover" />
              )}

              <div>
                <Badge variant="primary" size="sm" className="mb-2 capitalize">{category}</Badge>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{title}</h3>
                <p className="text-2xs text-slate-500 mt-1 line-clamp-2">{subtitle}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-extrabold text-base text-slate-900">${discountPrice || price}</span>
                  <Badge variant="success" size="sm">Ready to Publish</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <Button variant="secondary" size="md" onClick={() => alert('Opening live preview window...')}>
              Preview as Student
            </Button>

            <Button
              size="lg"
              variant="primary"
              className="bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold"
              icon={Rocket}
              onClick={handlePublish}
            >
              Publish Course to Marketplace
            </Button>
          </div>
        </Card>
      )}

      {/* ─── Bottom Step Navigation Buttons ─────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button
          variant="secondary"
          size="md"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          icon={ArrowLeft}
        >
          Previous Step
        </Button>

        {currentStep < 5 ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
            icon={ArrowRight}
            iconPosition="right"
          >
            Continue to Step {currentStep + 1}
          </Button>
        ) : (
          <Button
            variant="success"
            size="md"
            icon={CheckCircle2}
            onClick={handlePublish}
          >
            Publish Now
          </Button>
        )}
      </div>

      {/* Course Published Success Modal */}
      <Modal
        isOpen={publishSuccessModal}
        onClose={() => setPublishSuccessModal(false)}
        title="Course Published Successfully! 🚀"
        subtitle={`${title} is now live in the course directory`}
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPublishSuccessModal(false)
                navigate('/instructor/dashboard')
              }}
            >
              Back to Dashboard
            </Button>
            <Link to="/explore">
              <Button variant="primary" size="sm" icon={Eye}>
                View in Marketplace
              </Button>
            </Link>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Congratulations! Your new course has been successfully validated and published.
          </p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Knowledge Indexing In Progress
            </p>
            <p className="text-2xs text-emerald-700">
              The AI Tutor is indexing your curriculum lectures to answer questions for prospective students.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CreateCoursePage
