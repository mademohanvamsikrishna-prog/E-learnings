import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Bot, CheckCircle2, Copy, Check, Zap, Send } from 'lucide-react'

const PRESETS = [
  {
    label: '🔍 Explain a Concept',
    query: 'Can you explain dynamic method dispatch in Java with a real example?',
    response: [
      { type: 'text', content: 'Great question! **Dynamic method dispatch** is how Java resolves overridden methods at *runtime*, not compile time.' },
      { type: 'code', lang: 'java', content: `Animal myPet = new Dog();\nmyPet.makeSound(); // → "Woof!" (Dog's method, decided at runtime)` },
      { type: 'text', content: 'The JVM checks the **actual object type** on the heap, not the reference type. This powers extensible, loosely-coupled architecture.' },
      { type: 'badge', content: '✓ Grounded in verified syllabus · 140ms' },
    ],
  },
  {
    label: '🐛 Debug My Code',
    query: 'Why does my FastAPI async endpoint throw a greenlet_spawn error with SQLAlchemy?',
    response: [
      { type: 'text', content: 'This error occurs when an async route accesses a **lazy-loaded relationship** outside the active async session.' },
      { type: 'code', lang: 'python', content: `# Fix: eagerly load the relation\nstmt = select(Course).options(\n  selectinload(Course.lessons)\n).where(Course.id == course_id)\nresult = await db.execute(stmt)` },
      { type: 'text', content: 'Use `selectinload()` or `joinedload()` to avoid lazy evaluation across async boundaries.' },
      { type: 'badge', content: '✓ Verified fix · 112ms' },
    ],
  },
  {
    label: '📝 Generate a Quiz',
    query: 'Create a quick MCQ quiz on React 19 Server Components.',
    response: [
      { type: 'text', content: 'Here\'s your **React 19 Server Components** knowledge check:' },
      { type: 'quiz', content: [
        { q: 'What is the primary benefit of React Server Components?', options: ['Faster client-side re-renders', 'Zero bundle impact for server-only deps', 'Removes need for CSS', 'Replaces all client JS'], correct: 1 },
      ]},
      { type: 'badge', content: '✓ Auto-graded · 98ms' },
    ],
  },
]

export function AITutorSection() {
  const [activePreset, setActivePreset] = useState(0)
  const [copied, setCopied] = useState(false)
  const [input, setInput] = useState('')
  const preset = PRESETS[activePreset]

  const handleCopy = () => {
    navigator.clipboard?.writeText(preset.query)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-28 relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/8 text-xs font-semibold text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              24/7 AI Mentorship
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Never get stuck again.<br />
              <span className="text-white/40">Ask your AI Tutor anything.</span>
            </h2>

            <p className="text-base text-white/50 leading-relaxed">
              Powered by GPT-4o — understands your course context, explains concepts step-by-step,
              debugs your code, and generates custom quizzes on demand.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {['Instant code explanations', 'Custom quizzes', 'Debug traces', 'Study plans'].map((f) => (
                <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs font-medium text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {f}
                </div>
              ))}
            </div>

            <Link to="/login">
              <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer">
                <Zap className="w-4 h-4" /> Start with AI Tutor free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Terminal chat window */}
          <div className="rounded-2xl overflow-hidden border border-white/8 bg-[#111111] shadow-[0_0_60px_rgba(124,58,237,0.12)]">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-semibold text-white/60">EduSpire AI Tutor</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <Link to="/login" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors">
                Open full studio →
              </Link>
            </div>

            {/* Preset tabs */}
            <div className="flex gap-1 p-2 bg-[#161616] border-b border-white/5 overflow-x-auto scrollbar-none">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  onClick={() => setActivePreset(idx)}
                  className={`flex-none px-2.5 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activePreset === idx
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat area */}
            <div className="p-4 space-y-4 min-h-[320px] max-h-[380px] overflow-y-auto">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-purple-600/25 border border-purple-500/20 px-4 py-2.5 rounded-2xl rounded-tr-sm">
                  <p className="text-xs text-white/80 leading-relaxed">{preset.query}</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 space-y-2 relative group">
                  <button
                    onClick={handleCopy}
                    className="absolute top-0 right-0 p-1.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/40" />}
                  </button>

                  {preset.response.map((block, i) => {
                    if (block.type === 'text') return (
                      <div key={i} className="text-xs text-white/65 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: block.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/90">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-white/10 rounded text-purple-300 font-mono">$1</code>') }}
                      />
                    )
                    if (block.type === 'code') return (
                      <div key={i} className="rounded-xl overflow-hidden border border-white/8">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-white/4 border-b border-white/6">
                          <span className="text-[10px] font-mono font-bold text-white/40 uppercase">{block.lang}</span>
                        </div>
                        <pre className="p-3 text-[11px] font-mono text-purple-200 leading-relaxed overflow-x-auto">
                          <code>{block.content}</code>
                        </pre>
                      </div>
                    )
                    if (block.type === 'quiz') return (
                      <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2">
                        {block.content.map((q, qi) => (
                          <div key={qi}>
                            <p className="text-xs font-semibold text-white/80 mb-2">{q.q}</p>
                            {q.options.map((opt, oi) => (
                              <div key={oi} className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[11px] mb-1 ${oi === q.correct ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 'text-white/40'}`}>
                                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[8px] font-bold flex-none">
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                {opt}
                                {oi === q.correct && <CheckCircle2 className="w-3 h-3 ml-auto text-emerald-400" />}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                    if (block.type === 'badge') return (
                      <div key={i} className="text-[10px] text-emerald-400/70 font-semibold pt-1">{block.content}</div>
                    )
                    return null
                  })}
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-white/6 bg-[#141414] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your course..."
                className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/8 rounded-xl text-xs text-white/70 placeholder:text-white/25 focus:outline-none focus:border-purple-500/40 transition-colors"
              />
              <Link to="/login">
                <button className="p-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors cursor-pointer shadow-lg">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AITutorSection
