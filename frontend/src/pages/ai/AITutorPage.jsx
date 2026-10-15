import { useState, useRef, useEffect } from 'react'
import {
  Sparkles, Send, MessageSquare, Copy, Check,
  Bot, User, Trash2, AlertCircle,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { aiTutorInitialMessages, courses } from '@/data/mockData'
import { AIOrb } from '@/components/3d'
import { aiService } from '@/services/aiService'

// ─── Code block (dark, unchanged) ─────────────────────────────────────────────
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/4 border-b border-white/8 text-[10px] text-white/40">
        <span className="font-mono uppercase font-bold text-white/50">{language || 'code'}</span>
        <button onClick={handleCopy} type="button" className="flex items-center gap-1 hover:text-white/70 transition-colors cursor-pointer">
          {copied ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                  : <><Copy className="w-3 h-3" /><span>Copy</span></>}
        </button>
      </div>
      <pre className="p-3.5 text-xs font-mono overflow-x-auto leading-relaxed text-white/75">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function AITutorPage() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ai_tutor_messages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch { /* fall through */ }
    }
    return aiTutorInitialMessages
  })
  const [inputValue,    setInputValue]    = useState('')
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id)
  const [isTyping,      setIsTyping]      = useState(false)
  const [copiedIdx,     setCopiedIdx]     = useState(null)
  const [showOrb,       setShowOrb]       = useState(false)
  const [errorMessage,  setErrorMessage]  = useState(null)

  const messagesEndRef = useRef(null)
  const textareaRef    = useRef(null)

  // Persist messages
  useEffect(() => {
    try { localStorage.setItem('ai_tutor_messages', JSON.stringify(messages)) } catch { /* ignore */ }
  }, [messages])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages, isTyping])

  // ─── Quick actions & sidebar data ──────────────────────────────────────────
  const quickActions = [
    { label: 'Explain this topic',   prompt: 'Can you explain this topic in clear, simple terms?' },
    { label: 'Give me an example',   prompt: 'Can you give me a clear real-world code example of this concept?' },
    { label: 'Explain it simply',    prompt: 'Can you break this down simply with an intuitive analogy?' },
    { label: 'Give me exam notes',   prompt: 'Please provide structured, exam-ready revision notes on this topic.' },
    { label: 'Quiz me on this topic',prompt: 'Generate 3 challenging practice questions with answers to test my understanding.' },
  ]
  const recentQuestions = [
    'Explain polymorphism in Java',
    'Virtual Threads vs OS Threads',
    'How does B-Tree indexing work in Postgres?',
    'FastAPI dependency injection patterns',
  ]
  const suggestedTopics = [
    { title: 'Dynamic Method Dispatch',             tag: 'OOP Architecture' },
    { title: 'Hibernate Lazy Loading Pitfalls',     tag: 'Databases' },
    { title: 'CompletableFuture vs Virtual Threads', tag: 'Concurrency' },
    { title: 'Token Refresh Security in React',     tag: 'Security' },
  ]

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleSend = async (textToSend) => {
    const rawQuery = textToSend !== undefined ? textToSend : inputValue
    const query = (rawQuery || '').trim()
    if (!query) { setErrorMessage('Please enter a question.'); return }

    setErrorMessage(null)
    const userMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: 'user', sender: 'user',
      content: query, text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const recentHistory = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant' || m.sender === 'user' || m.sender === 'ai')
      .slice(-8)
      .map((m) => ({ role: m.role || (m.sender === 'ai' ? 'assistant' : 'user'), content: m.content || m.text || '' }))
      .filter((m) => m.content.trim() !== '')

    const activeCourse = courses.find((c) => c.id === selectedCourse)

    try {
      const response = await aiService.chat({
        message: query, history: recentHistory,
        courseId: activeCourse?.id || null,
        courseTitle: activeCourse?.title || null,
      })

      if (response && response.success && response.answer) {
        setMessages((prev) => [...prev, {
          id: `msg-${Date.now() + 1}-${Math.random().toString(36).substring(2, 7)}`,
          role: 'assistant', sender: 'ai',
          content: response.answer, text: response.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
      } else {
        const errText = response?.message || 'The AI Tutor is temporarily unavailable. Please try again.'
        setErrorMessage(errText)
        setMessages((prev) => [...prev, {
          id: `msg-${Date.now() + 1}`, role: 'assistant', sender: 'ai', isError: true,
          content: `⚠️ **Notice**: ${errText}`, text: `⚠️ **Notice**: ${errText}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
      }
    } catch (err) {
      let errorMsg = 'The AI Tutor is temporarily unavailable. Please try again.'
      if (!err.response) errorMsg = 'Unable to connect to AI Tutor. Please try again.'
      else if (err.response.status === 429) errorMsg = 'The AI Tutor is currently busy. Please try again in a moment.'
      else if (err.response.data?.detail || err.response.data?.message)
        errorMsg = err.response.data.detail || err.response.data.message

      setErrorMessage(errorMsg)
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`, role: 'assistant', sender: 'ai', isError: true,
        content: `⚠️ **Notice**: ${errorMsg}`, text: `⚠️ **Notice**: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleResetChat = () => {
    setMessages(aiTutorInitialMessages)
    setErrorMessage(null)
    localStorage.removeItem('ai_tutor_messages')
  }

  const copyToClipboard = (text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-12">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 24/7 AI Learning Assistant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Tutor</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">
            Ask questions, debug code, generate quizzes, or craft personalized study roadmaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowOrb(!showOrb)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showOrb
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
                : 'border-white/8 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showOrb ? 'Hide Neural Core' : 'Launch 3D Neural Core'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">Context:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="text-xs font-semibold text-white bg-white/6 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/40 cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1a1a1a] text-white">{c.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── 3D Orb ──────────────────────────────────────────────────────── */}
      {showOrb && (
        <div className="p-6 rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/6">
            <div>
              <h3 className="text-sm font-bold text-white">Interactive 3D Neural Studio</h3>
              <p className="text-[10px] text-white/30">Click any query capsule to send it to the chat</p>
            </div>
            <button onClick={() => setShowOrb(false)} className="text-xs text-white/30 hover:text-white cursor-pointer">Close ✕</button>
          </div>
          <AIOrb onSelectPrompt={(prompt) => handleSend(prompt)} />
        </div>
      )}

      {/* ── Chat + Sidebar grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">

        {/* Chat panel (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-white/8 bg-white/4 flex flex-col h-[74vh] overflow-hidden">

          {/* Error banner */}
          {errorMessage && (
            <div className="bg-amber-500/8 border-b border-amber-500/15 px-4 py-2.5 flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-amber-300/60 hover:text-amber-300 cursor-pointer ml-3">✕</button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => {
              const isAi    = m.role === 'assistant' || m.sender === 'ai'
              const content = m.content || m.text || ''
              const isErr   = m.isError

              return (
                <div key={m.id || idx} className={`flex gap-3 max-w-[88%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAi
                      ? isErr ? 'bg-amber-600' : 'bg-gradient-to-br from-purple-600 to-indigo-600'
                      : 'bg-gradient-to-br from-indigo-600 to-purple-700'
                  }`}>
                    {isAi ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>

                  {/* Bubble */}
                  <div className="space-y-1 max-w-[calc(100%-2.5rem)]">
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                      isAi
                        ? isErr
                          ? 'bg-amber-500/8 border border-amber-500/20 text-amber-200'
                          : 'bg-white/6 border border-white/8 text-white/80'
                        : 'bg-gradient-to-br from-purple-600/40 to-indigo-600/30 border border-purple-500/25 text-white whitespace-pre-wrap'
                    }`}>
                      {isAi ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                const codeString = String(children).replace(/\n$/, '')
                                const isMultiLine = codeString.includes('\n') || Boolean(match)
                                if (isMultiLine) return <CodeBlock language={match ? match[1] : 'code'} code={codeString} />
                                return <code className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs" {...props}>{children}</code>
                              },
                              p({ children })  { return <p className="mb-2.5 last:mb-0 leading-relaxed text-white/70">{children}</p> },
                              h1({ children }) { return <h1 className="text-base font-bold text-white mt-4 mb-2">{children}</h1> },
                              h2({ children }) { return <h2 className="text-sm font-bold text-white mt-3 mb-1.5">{children}</h2> },
                              h3({ children }) { return <h3 className="text-xs font-bold text-white mt-2.5 mb-1">{children}</h3> },
                              ul({ children }) { return <ul className="list-disc list-outside pl-4 space-y-1 mb-2.5 text-white/60">{children}</ul> },
                              ol({ children }) { return <ol className="list-decimal list-outside pl-4 space-y-1 mb-2.5 text-white/60">{children}</ol> },
                              li({ children }) { return <li className="leading-relaxed">{children}</li> },
                              blockquote({ children }) {
                                return <blockquote className="border-l-4 border-purple-500/40 pl-3 italic text-white/50 my-2">{children}</blockquote>
                              },
                              a({ href, children }) {
                                return <a href={href} target="_blank" rel="noreferrer" className="text-purple-400 underline hover:text-purple-300">{children}</a>
                              },
                            }}
                          >
                            {content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span>{content}</span>
                      )}

                      {/* Copy button (AI only) */}
                      {isAi && (
                        <button
                          onClick={() => copyToClipboard(content, idx)}
                          className="absolute top-2 right-2 p-1.5 text-white/20 hover:text-white/60 rounded-lg bg-white/5 border border-white/8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Copy"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                    <span className="text-[9px] text-white/20 block px-1">{m.timestamp}</span>
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-3.5 bg-white/6 border border-white/8 rounded-2xl flex items-center gap-2.5">
                  <span className="flex items-center gap-1 font-mono text-purple-400 text-lg leading-none">
                    <span className="inline-block animate-bounce [animation-delay:-0.3s]">●</span>
                    <span className="inline-block animate-bounce [animation-delay:-0.15s]">●</span>
                    <span className="inline-block animate-bounce">●</span>
                  </span>
                  <span className="text-xs font-medium text-white/40">AI Tutor is thinking…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick action chips */}
          <div className="p-3 bg-black/20 border-t border-white/6 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                type="button"
                disabled={isTyping}
                onClick={() => handleSend(qa.prompt)}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-white/45 hover:border-purple-500/30 hover:text-purple-300 hover:bg-purple-500/8 text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer disabled:opacity-40"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); if (!isTyping && inputValue.trim()) handleSend() }}
            className="p-3.5 bg-[#0f0f0f] border-t border-white/6 flex items-center gap-2"
          >
            <input
              ref={textareaRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!isTyping && inputValue.trim()) handleSend()
                }
              }}
              placeholder="Ask anything… debug code, quiz me, explain a concept (Enter to send)"
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white/6 border border-white/8 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
            >
              <Send className="w-4 h-4" />
              {isTyping ? 'Thinking…' : 'Send'}
            </button>
          </form>
        </div>

        {/* Sidebar (1 col) */}
        <div className="lg:col-span-1 space-y-4">

          {/* Suggested topics */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">Suggested Topics</p>
            <div className="space-y-2">
              {suggestedTopics.map((top, idx) => (
                <div
                  key={idx}
                  onClick={() => !isTyping && handleSend(`Can you give me an in-depth explanation of ${top.title}?`)}
                  className="p-2.5 rounded-xl border border-white/6 bg-white/3 hover:border-purple-500/25 hover:bg-purple-500/6 transition-all cursor-pointer"
                >
                  <p className="text-xs font-semibold text-white/70 leading-snug">{top.title}</p>
                  <span className="text-[10px] text-purple-400 font-medium">{top.tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent queries */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/25">Recent Queries</p>
              <button
                onClick={handleResetChat}
                className="text-[10px] text-white/25 hover:text-red-400 cursor-pointer flex items-center gap-1 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="space-y-1">
              {recentQuestions.map((q, i) => (
                <button
                  key={i}
                  disabled={isTyping}
                  onClick={() => handleSend(q)}
                  className="w-full p-2 text-left rounded-xl hover:bg-white/5 text-xs text-white/35 hover:text-white/60 truncate cursor-pointer flex items-center gap-1.5 disabled:opacity-40 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-white/20 shrink-0" />
                  <span className="truncate">{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI capabilities card */}
          <div className="rounded-2xl border border-purple-500/15 bg-gradient-to-br from-purple-600/10 to-indigo-600/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white/70">AI Capabilities</span>
            </div>
            <ul className="space-y-1.5">
              {['Concept explanations', 'Live code debugging', 'Custom quiz generation', 'Study roadmaps', 'Exam preparation'].map((cap) => (
                <li key={cap} className="flex items-center gap-2 text-[11px] text-white/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60 shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AITutorPage
