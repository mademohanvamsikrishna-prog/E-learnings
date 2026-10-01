import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  MessageSquare,
  Copy,
  Check,
  Bot,
  User,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { aiTutorInitialMessages, courses } from '@/data/mockData'
import { Button, Card } from '@/components'
import { AIOrb } from '@/components/3d'
import { aiService } from '@/services/aiService'

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 text-2xs text-slate-400">
        <span className="font-mono uppercase font-semibold text-slate-300">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 hover:text-slate-200 text-slate-400 cursor-pointer transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-xs font-mono overflow-x-auto leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function AITutorPage() {
  // Chat state persistence in localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ai_tutor_messages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch {
        // Fallback to initial messages
      }
    }
    return aiTutorInitialMessages
  })

  const [inputValue, setInputValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [showOrb, setShowOrb] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Persist messages across page reloads
  useEffect(() => {
    try {
      localStorage.setItem('ai_tutor_messages', JSON.stringify(messages))
    } catch {
      // Ignore quota errors if storage is full
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const quickActions = [
    { label: 'Explain this topic', prompt: 'Can you explain this topic in clear, simple terms?' },
    { label: 'Give me an example', prompt: 'Can you give me a clear real-world code example of this concept?' },
    { label: 'Explain it simply', prompt: 'Can you break this down simply with an intuitive analogy?' },
    { label: 'Give me exam notes', prompt: 'Please provide structured, exam-ready revision notes on this topic.' },
    { label: 'Quiz me on this topic', prompt: 'Generate 3 challenging practice questions with answers to test my understanding.' },
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

  const handleSend = async (textToSend) => {
    const rawQuery = textToSend !== undefined ? textToSend : inputValue
    const query = (rawQuery || '').trim()

    if (!query) {
      setErrorMessage('Please enter a question.')
      return
    }

    setErrorMessage(null)

    const userMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: 'user',
      sender: 'user',
      content: query,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    // Immediately display student's message in chat and clear input
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Build recent conversation context (last 8 messages)
    const recentHistory = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant' || m.sender === 'user' || m.sender === 'ai')
      .slice(-8)
      .map((m) => ({
        role: m.role || (m.sender === 'ai' ? 'assistant' : 'user'),
        content: m.content || m.text || '',
      }))
      .filter((m) => m.content.trim() !== '')

    const activeCourse = courses.find((c) => c.id === selectedCourse)

    try {
      const response = await aiService.chat({
        message: query,
        history: recentHistory,
        courseId: activeCourse?.id || null,
        courseTitle: activeCourse?.title || null,
      })

      if (response && response.success && response.answer) {
        const aiMessage = {
          id: `msg-${Date.now() + 1}-${Math.random().toString(36).substring(2, 7)}`,
          role: 'assistant',
          sender: 'ai',
          content: response.answer,
          text: response.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        const errText = response?.message || 'The AI Tutor is temporarily unavailable. Please try again.'
        setErrorMessage(errText)
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            sender: 'ai',
            isError: true,
            content: `⚠️ **Notice**: ${errText}`,
            text: `⚠️ **Notice**: ${errText}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }
    } catch (err) {
      let errorMsg = 'The AI Tutor is temporarily unavailable. Please try again.'

      if (!err.response) {
        errorMsg = 'Unable to connect to AI Tutor. Please try again.'
      } else if (err.response.status === 429) {
        errorMsg = 'The AI Tutor is currently busy. Please try again in a moment.'
      } else if (err.response.data?.message) {
        errorMsg = err.response.data.message
      }

      setErrorMessage(errorMsg)
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          sender: 'ai',
          isError: true,
          content: `⚠️ **Notice**: ${errorMsg}`,
          text: `⚠️ **Notice**: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
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
              className="text-xs text-[#8E9C94] hover:text-[#12372A] cursor-pointer"
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
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[74vh] overflow-hidden">
          {/* Error Banner Alert */}
          {errorMessage && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer ml-3 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Chat Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => {
              const isAi = m.role === 'assistant' || m.sender === 'ai'
              const content = m.content || m.text || ''
              const isErr = m.isError

              return (
                <div
                  key={m.id || idx}
                  className={`flex gap-3 max-w-[88%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isAi
                        ? isErr
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-purple-600 text-white shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1 max-w-[calc(100%-2.5rem)]">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                        isAi
                          ? isErr
                            ? 'bg-amber-50/80 border border-amber-200 text-amber-900'
                            : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                          : 'bg-indigo-600 text-white shadow-xs whitespace-pre-wrap'
                      }`}
                    >
                      {isAi ? (
                        <div className="prose prose-sm max-w-none text-slate-800">
                          <ReactMarkdown
                            components={{
                              code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                const codeString = String(children).replace(/\n$/, '')
                                const isMultiLine = codeString.includes('\n') || Boolean(match)

                                if (isMultiLine) {
                                  return (
                                    <CodeBlock
                                      language={match ? match[1] : 'code'}
                                      code={codeString}
                                    />
                                  )
                                }
                                return (
                                  <code
                                    className="px-1.5 py-0.5 rounded-md bg-purple-100/70 text-purple-800 font-mono text-xs font-medium"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              },
                              p({ children }) {
                                return <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>
                              },
                              h1({ children }) {
                                return <h1 className="text-base font-bold text-slate-900 mt-4 mb-2">{children}</h1>
                              },
                              h2({ children }) {
                                return <h2 className="text-sm font-bold text-slate-900 mt-3 mb-1.5">{children}</h2>
                              },
                              h3({ children }) {
                                return <h3 className="text-xs font-bold text-slate-900 mt-2.5 mb-1">{children}</h3>
                              },
                              ul({ children }) {
                                return <ul className="list-disc list-outside pl-4 space-y-1 mb-2.5">{children}</ul>
                              },
                              ol({ children }) {
                                return <ol className="list-decimal list-outside pl-4 space-y-1 mb-2.5">{children}</ol>
                              },
                              li({ children }) {
                                return <li className="leading-relaxed">{children}</li>
                              },
                              blockquote({ children }) {
                                return (
                                  <blockquote className="border-l-4 border-purple-400 pl-3 italic text-slate-600 my-2">
                                    {children}
                                  </blockquote>
                                )
                              },
                              a({ href, children }) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 underline hover:text-indigo-800"
                                  >
                                    {children}
                                  </a>
                                )
                              },
                            }}
                          >
                            {content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span>{content}</span>
                      )}

                      {isAi && (
                        <button
                          onClick={() => copyToClipboard(content, idx)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 rounded-md bg-white border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-2xs"
                          title="Copy response"
                        >
                          {copiedIdx === idx ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
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
              <div className="flex gap-3 max-w-[80%] mr-auto animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center gap-2.5 shadow-2xs">
                  <span className="flex items-center gap-1 font-mono text-purple-600 text-base leading-none">
                    <span className="inline-block animate-bounce [animation-delay:-0.3s]">●</span>
                    <span className="inline-block animate-bounce [animation-delay:-0.15s]">●</span>
                    <span className="inline-block animate-bounce">●</span>
                  </span>
                  <span className="font-medium text-slate-600">AI Tutor is thinking...</span>
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
                disabled={isTyping}
                onClick={() => handleSend(qa.prompt)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-700 text-2xs font-semibold whitespace-nowrap transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!isTyping && inputValue.trim()) {
                handleSend()
              }
            }}
            className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={textareaRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!isTyping && inputValue.trim()) {
                    handleSend()
                  }
                }
              }}
              placeholder="Ask anything about this topic, debug code, or request practice questions... (Press Enter to send)"
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
            <Button
              type="submit"
              size="md"
              disabled={!inputValue.trim() || isTyping}
              icon={Send}
              className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
            >
              {isTyping ? 'Thinking...' : 'Send'}
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
                  onClick={() => !isTyping && handleSend(`Can you give me an in-depth explanation of ${top.title}?`)}
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
                onClick={handleResetChat}
                className="text-2xs text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-1"
                title="Reset conversation"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              {recentQuestions.map((q, i) => (
                <button
                  key={i}
                  disabled={isTyping}
                  onClick={() => handleSend(q)}
                  className="w-full p-2 text-left hover:bg-slate-50 rounded-lg text-slate-700 truncate cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
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
