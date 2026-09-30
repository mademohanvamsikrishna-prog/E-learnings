import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  Maximize2,
  CheckCircle2,
  Circle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Download,
  MessageSquare,
  Bookmark,
  Share2,
  Check,
  Send,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react'
import { courses, activeLessonData } from '@/data/mockData'
import { Button, ProgressBar, Badge, Modal, Input } from '@/components'

export function LearningPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const course = courses.find((c) => c.id === courseId) || courses[0]

  const [activeTab, setActiveTab] = useState('notes') // 'notes' | 'resources' | 'discussion'
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiConversation, setAiConversation] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm here to help with "${activeLessonData.lessonTitle}". Ask me to explain polymorphism, clarify dynamic method dispatch, or write an example!`,
    },
  ])
  const [aiLoading, setAiLoading] = useState(false)

  const videoRef = useRef(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAskAI = (e) => {
    e.preventDefault()
    if (!aiQuestion.trim()) return

    const userText = aiQuestion
    setAiQuestion('')
    setAiConversation((prev) => [...prev, { sender: 'user', text: userText }])
    setAiLoading(true)

    setTimeout(() => {
      let reply = `That's a key question about polymorphism! In Java 21, when an overridden method is called, the JVM looks up the target implementation via the object's vtable (virtual method table) in heap memory at runtime. This guarantees runtime dynamic dispatch.`
      if (userText.toLowerCase().includes('example')) {
        reply = `Here is a clear snippet demonstrating runtime polymorphism:\n\n\`\`\`java\nAnimal myDog = new Dog();\nmyDog.makeSound(); // Invokes Dog's overridden makeSound() at runtime!\n\`\`\``
      }
      setAiConversation((prev) => [...prev, { sender: 'ai', text: reply }])
      setAiLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* ─── Top Control Bar ────────────────────────────────────────────────────── */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
              {course.title}
            </span>
            <Badge variant="primary" size="sm" className="hidden sm:inline-flex bg-indigo-950 text-indigo-300 border-indigo-800">
              Module 2: Lesson 4
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>78% Complete</span>
            <div className="w-24">
              <ProgressBar value={78} color="indigo" size="sm" />
            </div>
          </div>

          {/* Quick AI Tutor Trigger Button */}
          <Button
            size="sm"
            onClick={() => setAiModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1.5"
            icon={Sparkles}
          >
            Ask AI Tutor
          </Button>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle curriculum sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ─── Main Workspace: Video + Notes & Curriculum Sidebar ─────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Video Player, Lesson Content & Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
          {/* Responsive Video Container */}
          <div className="relative bg-black w-full aspect-video max-h-[56vh] flex items-center justify-center group overflow-hidden">
            <video
              ref={videoRef}
              src={activeLessonData.videoUrl}
              poster={activeLessonData.videoPoster}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Custom Video Play/Pause Overlay */}
            <div
              onClick={togglePlay}
              className={`absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              <button
                type="button"
                className="w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110"
              >
                {isPlaying ? (
                  <PauseCircle className="w-10 h-10" />
                ) : (
                  <PlayCircle className="w-10 h-10 fill-white text-indigo-600" />
                )}
              </button>
            </div>

            {/* Video Bottom Progress Bar (simulated) */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="hover:text-indigo-400">
                  {isPlaying ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                </button>
                <span>14:20 / 50:00</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="hover:text-indigo-400"><Volume2 className="w-4 h-4" /></button>
                <button className="hover:text-indigo-400"><Maximize2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Lesson Metadata & Content Tabs */}
          <div className="p-6 max-w-5xl space-y-6">
            {/* Title & Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-2xs font-mono uppercase tracking-wider text-indigo-400">
                  {activeLessonData.moduleTitle}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeLessonData.lessonTitle}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isCompleted ? 'success' : 'secondary'}
                  className={isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'}
                  onClick={() => setIsCompleted(!isCompleted)}
                  icon={isCompleted ? Check : CheckCircle2}
                >
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAiModalOpen(true)}
                  className="border-purple-500/40 text-purple-300 hover:bg-purple-900/30"
                  icon={Sparkles}
                >
                  Explain with AI
                </Button>
              </div>
            </div>

            {/* Navigation Tabs (Notes, Resources, Discussions) */}
            <div className="flex items-center gap-2 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Lesson Notes & Code
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'resources'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4" />
                Resources ({activeLessonData.resources.length})
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'discussion'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Discussions ({activeLessonData.discussions.length})
              </button>
            </div>

            {/* Tab 1: Lesson Notes & Code */}
            {activeTab === 'notes' && (
              <div className="space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                    Lesson Overview
                  </h3>
                  <p>{activeLessonData.description}</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
                  <div className="flex items-center justify-between text-2xs text-slate-400 pb-3 border-b border-slate-800 mb-3 font-mono">
                    <span>PaymentProcessor.java</span>
                    <span>Java 21</span>
                  </div>
                  <pre className="font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
                    {activeLessonData.codeSnippet}
                  </pre>
                </div>

                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Key Architectural Rules
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                    <li>Dynamic method dispatch resolves methods based on object heap type, not reference type.</li>
                    <li>Always tag overridden methods with <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">@Override</code> for compiler checks.</li>
                    <li>Overloading happens at compile-time; overriding occurs at runtime.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                {activeLessonData.resources.map((res, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{res.title}</p>
                        <p className="text-2xs text-slate-400 uppercase">{res.type} • {res.size}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" icon={Download} className="text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Discussions */}
            {activeTab === 'discussion' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex gap-2">
                  <Input
                    placeholder="Ask a question or share a note about this lesson..."
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-xs"
                  />
                  <Button size="sm" icon={Send}>
                    Post
                  </Button>
                </div>

                <div className="space-y-3">
                  {activeLessonData.discussions.map((d) => (
                    <div key={d.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={d.avatar} alt={d.author} className="w-6 h-6 rounded-full" />
                          <span className="font-semibold text-white">{d.author}</span>
                        </div>
                        <span className="text-2xs text-slate-500">{d.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 pl-8">{d.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Bottom Navigation: Previous / Next Lesson ────────────────────────── */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              <Button
                variant="secondary"
                size="md"
                className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                icon={ChevronLeft}
              >
                Previous Lesson
              </Button>

              <div className="flex items-center gap-2">
                <Link to="/quiz/quiz-java-oop">
                  <Button variant="outline" size="md" className="border-indigo-500 text-indigo-300 hover:bg-indigo-950">
                    Take Module Quiz
                  </Button>
                </Link>

                <Button
                  variant="primary"
                  size="md"
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next Lesson
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Course Curriculum Navigation Drawer */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Course Content
                </h3>
                <p className="text-2xs text-slate-400 mt-0.5">
                  18 / 24 lessons completed
                </p>
              </div>

              <Badge variant="success" size="sm">78%</Badge>
            </div>

            {/* Modules List */}
            <div className="divide-y divide-slate-800/80 text-xs">
              {(course.curriculum?.length ? course.curriculum : [
                {
                  id: 'mod-1',
                  title: 'Module 1: Java Foundations',
                  lessons: [
                    { id: '1', title: '1. Introduction to JVM', duration: '18 min', isCompleted: true },
                    { id: '2', title: '2. Stack vs Heap Memory', duration: '24 min', isCompleted: true },
                  ],
                },
                {
                  id: 'mod-2',
                  title: 'Module 2: OOP Deep Dive',
                  lessons: [
                    { id: '3', title: '3. Encapsulation & Records', duration: '35 min', isCompleted: true },
                    { id: '4', title: '4. Polymorphism & VTables', duration: '50 min', isCurrent: true },
                    { id: '5', title: '5. Interfaces in Java 21', duration: '42 min', isCompleted: false },
                  ],
                },
                {
                  id: 'mod-3',
                  title: 'Module 3: Concurrency & Streams',
                  lessons: [
                    { id: '6', title: '1. Virtual Threads', duration: '45 min', isCompleted: false, isLocked: true },
                    { id: '7', title: '2. Reactive Pipelines', duration: '55 min', isCompleted: false, isLocked: true },
                  ],
                },
              ]).map((mod) => (
                <div key={mod.id} className="p-3">
                  <div className="font-semibold text-slate-200 mb-2 px-1">
                    {mod.title}
                  </div>

                  <div className="space-y-1">
                    {(mod.lessons || []).map((les) => (
                      <div
                        key={les.id}
                        className={`p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          les.isCurrent
                            ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/40'
                            : les.isCompleted
                            ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            : 'text-slate-500 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {les.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : les.isCurrent ? (
                            <PlayCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className="truncate text-xs">{les.title}</span>
                        </div>

                        <span className="text-2xs text-slate-500 shrink-0 ml-2">
                          {les.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* ─── Integrated AI Tutor Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="AI Lesson Assistant"
        subtitle={`Context: ${activeLessonData.lessonTitle}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {/* Chat transcript */}
          <div className="h-72 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800">
            {aiConversation.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {aiLoading && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 italic text-2xs animate-pulse">
                AI Tutor is generating an explanation...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 text-2xs">
            {['Explain this simply', 'Give me a code example', 'Generate a practice quiz', 'Summarize this lesson'].map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAiQuestion(qp)}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium cursor-pointer transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleAskAI} className="flex gap-2">
            <Input
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask anything about this lecture..."
              className="text-xs"
            />
            <Button type="submit" size="sm" icon={Send} disabled={aiLoading || !aiQuestion.trim()}>
              Send
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default LearningPage
