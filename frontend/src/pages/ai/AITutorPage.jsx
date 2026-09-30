import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  Code2,
  BookOpen,
  HelpCircle,
  Calendar,
  Zap,
  MessageSquare,
  Copy,
  Check,
  Bot,
  User,
  Trash2,
  ChevronRight,
  Flame,
} from 'lucide-react'
import { aiTutorInitialMessages, courses } from '@/data/mockData'
import { Button, Input, Card, Badge, Avatar } from '@/components'
import { AIOrb } from '@/components/3d'

export function AITutorPage() {
  const [messages, setMessages] = useState(aiTutorInitialMessages)
  const [inputValue, setInputValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [showOrb, setShowOrb] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const quickActions = [
    { label: 'Explain this concept', prompt: 'Can you explain dynamic method dispatch in simple terms?' },
    { label: 'Give a real-world example', prompt: 'Give me a production-grade real-world example of Polymorphism in Java 21.' },
    { label: 'Create a practice quiz', prompt: 'Generate 3 challenging multiple-choice questions on Java interfaces vs abstract classes.' },
    { label: 'Summarize key takeaways', prompt: 'Summarize the top 5 architectural rules of Object-Oriented Design.' },
    { label: 'Create a 7-day study plan', prompt: 'Draft a personalized 7-day study schedule to master Java concurrency and Spring Boot.' },
  ]

  const recentQuestions = [
    'Explain polymorphism in Java',
    'Virtual Threads vs OS Threads',
    'How does B-Tree indexing work in Postgres?',
    'FastAPI dependency injection patterns',
  ]

  const suggestedTopics = [
    { title: 'Dynamic Method Dispatch', tag: 'OOP Architecture' },
    { title: 'Hibernate Lazy Loading Pitfalls', tag: 'Databases' },
    { title: 'CompletableFuture vs Virtual Threads', tag: 'Concurrency' },
    { title: 'Token Refresh Security in React', tag: 'Security' },
  ]

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue
    if (!query.trim()) return

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate smart AI response with delay
    setTimeout(() => {
      let aiText = `Here is a clear breakdown for: **${query}**\n\nWhen designing scalable systems in Java, decoupling your interface contracts from concrete business logic ensures high testability and clean domain boundaries.\n\n\`\`\`java\npublic interface OrderValidator {\n    boolean isValid(Order order);\n}\n\n@Component\npublic class DefaultOrderValidator implements OrderValidator {\n    @Override\n    public boolean isValid(Order order) {\n        return order.getTotal() > 0 && order.getItems().size() > 0;\n    }\n}\n\`\`\`\n\nWould you like me to generate 2 practice questions or explore unit testing with Mockito next?`

      if (query.toLowerCase().includes('study plan')) {
        aiText = `Here is your customized **7-Day Study Plan** to conquer Java Concurrency & Spring Boot:\n\n- **Day 1**: Java Memory Model, Stack vs Heap, Volatile keyword\n- **Day 2**: Thread Pools & ExecutorService\n- **Day 3**: CompletableFuture and Async Composition\n- **Day 4**: Java 21 Virtual Threads & Structured Concurrency\n- **Day 5**: Spring Boot 3 Non-blocking WebFlux\n- **Day 6**: Hands-on Mini Project (High-Throughput Ingestion Engine)\n- **Day 7**: Comprehensive 20-Question Final Assessment\n\nI can track your progress day-by-day. Let me know when you're ready to start Day 1!`
      } else if (query.toLowerCase().includes('quiz')) {
        aiText = `Here is your quick **3-Question Checkpoint**:\n\n1. Can an interface in Java 21 contain private methods?\n   *A) No, only public*\n   *B) Yes, for helper code in default methods*\n   *C) Only in abstract classes*\n\n2. Which annotation signals to the compiler that you are overriding a superclass method?\n   *A) @Implement*\n   *B) @Overload*\n   *C) @Override*\n\nReply with your answers (e.g. "1B, 2C") and I will grade them immediately!`
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setIsTyping(false)
    }, 800)
  }

  const copyToClipboard = (text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ─── Top Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>24/7 AI Learning Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI Tutor
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Ask questions, debug tricky code, generate quizzes, or craft personalized study roadmaps.
          </p>
        </div>

        {/* Right Controls: 3D Orb Toggle & Context Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant={showOrb ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowOrb(!showOrb)}
            icon={Sparkles}
          >
            {showOrb ? 'Hide 3D Neural Core' : 'Launch 3D Neural Core'}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#68756D]">Context:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="text-xs font-semibold text-[#12372A] bg-white border border-[#E8E2D5] rounded-xl px-3 py-2 focus:outline-none focus:border-[#2F7D62] shadow-2xs cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Optional Interactive 3D AI Orb View */}
      {showOrb && (
        <div className="p-6 rounded-3xl bg-[#FFFDF7] border-2 border-[#E8E2D5] shadow-xl shadow-[#12372A]/5 animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E2D5]">
            <div>
              <h3 className="text-sm font-bold text-[#12372A]">Interactive 3D Neural Studio</h3>
              <p className="text-2xs text-[#68756D]">Click any query capsule or rotate the 3D model to query the syllabus context</p>
            </div>
            <button
              onClick={() => setShowOrb(false)}
              className="text-xs text-[#8E9C94] hover:text-[#12372A]"
            >
              Close Studio ✕
            </button>
          </div>
          <AIOrb onSelectPrompt={(prompt) => handleSend(prompt)} />
        </div>
      )}

      {/* ─── Main Chat & Sidebar Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Chat Feed (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[72vh] overflow-hidden">
          {/* Chat Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => {
              const isAi = m.sender === 'ai'
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[88%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isAi
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line relative group ${
                        isAi
                          ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                          : 'bg-indigo-600 text-white shadow-xs'
                      }`}
                    >
                      {m.text}

                      {isAi && (
                        <button
                          onClick={() => copyToClipboard(m.text, idx)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 rounded-md bg-white border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy response"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                    <span className="text-3xs text-slate-400 block px-1">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              )
            })}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 italic flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                  AI Tutor is analyzing your syllabus and composing answer...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qa.prompt)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-700 text-2xs font-semibold whitespace-nowrap transition-all shadow-2xs cursor-pointer"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about Java OOP, architecture, or paste error trace..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
            <Button
              type="submit"
              size="md"
              disabled={!inputValue.trim() || isTyping}
              icon={Send}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Send
            </Button>
          </form>
        </div>

        {/* Sidebar: Suggested Topics & Recent Questions (1 Col) */}
        <div className="lg:col-span-1 space-y-5">
          {/* Quick Topics */}
          <Card padding="p-5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Suggested Topics
            </h4>

            <div className="space-y-2">
              {suggestedTopics.map((top, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSend(`Can you give me an in-depth explanation of ${top.title}?`)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {top.title}
                  </p>
                  <span className="text-2xs text-indigo-600 font-medium">{top.tag}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Questions */}
          <Card padding="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Queries
              </h4>
              <button
                onClick={() => setMessages(aiTutorInitialMessages)}
                className="text-2xs text-slate-400 hover:text-slate-600"
                title="Reset conversation"
              >
                Clear
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              {recentQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="w-full p-2 text-left hover:bg-slate-50 rounded-lg text-slate-700 truncate cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{q}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AITutorPage
