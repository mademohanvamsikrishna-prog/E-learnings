import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Bot,
  Send,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  HelpCircle,
  BookOpen,
} from 'lucide-react'

const PROMPT_PRESETS = [
  {
    label: 'Explain a Concept',
    query: 'Can you explain dynamic method dispatch in Java with a real-world example?',
    response: `In Java, **polymorphism** allows a superclass reference to hold a subclass object. At runtime, the JVM uses dynamic method dispatch to invoke the subclass method rather than the reference type.

\`\`\`java
Animal myPet = new Dog();
myPet.makeSound(); // Outputs: "Woof!" dynamically at runtime
\`\`\`

This enables extensible architecture without tight coupling to specific implementations!`,
  },
  {
    label: 'Debug Code Bug',
    query: 'Why is my FastAPI async endpoint throwing a greenlet_spawn error with SQLAlchemy?',
    response: `This error happens when an async route attempts to access an un-awaited relationship or lazy-loaded attribute outside the active async session context.

**Solution**: Use \`selectinload()\` or join the relation explicitly:
\`\`\`python
stmt = select(Course).options(selectinload(Course.lessons)).where(Course.id == course_id)
result = await db.execute(stmt)
return result.scalars().first()
\`\`\``,
  },
  {
    label: 'Generate a Quiz',
    query: 'Create a quick multiple-choice quiz on React 19 Server Components.',
    response: `Here is your knowledge check:

**Question:** What is the primary benefit of React Server Components (RSC)?
- [ ] A) Faster client-side state re-renders
- [x] B) Zero bundle impact for server-only dependencies & direct DB access
- [ ] C) Eliminates the need for CSS stylesheets
- [ ] D) Replaces all client-side JavaScript completely`,
  },
]

export function AITutorSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const [customInput, setCustomInput] = useState('')

  const currentPreset = PROMPT_PRESETS[activeTab]

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentPreset.response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="ai-tutor" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-[#5624d0] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Intelligent Mentorship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Accelerate your learning with a dedicated AI Tutor
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Never get stuck on compiler errors, tricky recursion, or system design patterns again. Get instant code explanations, step-by-step debug traces, and custom practice quizzes.
          </p>
        </div>

        {/* Interactive AI Chat Simulator Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#5624d0] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold">EduSpire AI Assistant</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-3xs text-emerald-400 font-semibold">Online</span>
                </div>
                <p className="text-3xs text-slate-400">Context: Computer Science & Software Engineering</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ai-tutor"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Open Full AI Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Preset Buttons Bar */}
          <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Try a query:</span>
            {PROMPT_PRESETS.map((preset, idx) => (
              <button
                key={preset.label}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'bg-[#5624d0] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Simulated Chat Dialogue */}
          <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto bg-slate-50/50">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[75%] bg-[#5624d0] text-white p-3.5 rounded-2xl rounded-tr-xs text-xs font-medium shadow-xs">
                {currentPreset.query}
              </div>
            </div>

            {/* AI Response message */}
            <div className="flex justify-start items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#5624d0] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="relative max-w-[90%] sm:max-w-[80%] bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-xs text-xs text-slate-800 leading-relaxed shadow-xs space-y-2 group">
                <button
                  onClick={handleCopy}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-700 rounded bg-slate-50 border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <div className="whitespace-pre-line font-sans">
                  {currentPreset.response}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Grounded in verified syllabus
                  </span>
                  <span>Latency: 140ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask anything about your courses, code errors, or exam prep..."
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-xs text-slate-900 border border-transparent focus:border-[#5624d0] focus:bg-white focus:outline-none transition-all"
            />
            <Link to="/ai-tutor">
              <button
                type="button"
                className="px-4 py-2.5 bg-[#5624d0] hover:bg-[#431ba8] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AITutorSection
