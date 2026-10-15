import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft,
  Flag, Trophy, Sparkles, RotateCcw,
} from 'lucide-react'
import { mockQuiz } from '@/data/mockData'

export function QuizPage() {
  const [currentIdx,        setCurrentIdx]        = useState(0)
  const [selectedAnswers,   setSelectedAnswers]   = useState({})
  const [flaggedQuestions,  setFlaggedQuestions]  = useState({})
  const [timeLeftSeconds,   setTimeLeftSeconds]   = useState(15 * 60)
  const [isSubmitted,       setIsSubmitted]       = useState(false)
  const [reviewMode,        setReviewMode]        = useState(false)

  useEffect(() => {
    if (isSubmitted) return
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) { clearInterval(timer); setIsSubmitted(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isSubmitted])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const q         = mockQuiz.questions[currentIdx]
  const total     = mockQuiz.questions.length
  const progress  = ((currentIdx + 1) / total) * 100

  const correctCount  = mockQuiz.questions.filter((x) => selectedAnswers[x.id] === x.correctAnswer).length
  const scorePercent  = Math.round((correctCount / total) * 100)
  const passed        = scorePercent >= mockQuiz.passingScore

  const handleSelect = (optIdx) => {
    if (isSubmitted && !reviewMode) return
    setSelectedAnswers((p) => ({ ...p, [q.id]: optIdx }))
  }
  const toggleFlag = () => setFlaggedQuestions((p) => ({ ...p, [q.id]: !p[q.id] }))

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12">

      {/* ── Header bar ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
              Module 2 Assessment
            </span>
            {isSubmitted && (
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                passed
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
                  : 'bg-red-500/15 text-red-300 border-red-500/20'
              }`}>
                {passed ? 'Passed 🎉' : 'Needs Review'}
              </span>
            )}
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">{mockQuiz.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
            timeLeftSeconds < 180
              ? 'bg-red-500/10 text-red-300 border-red-500/20 animate-pulse'
              : 'bg-white/5 text-white/60 border-white/8'
          }`}>
            <Clock className="w-4 h-4" />
            {fmt(timeLeftSeconds)}
          </div>
          <span className="text-white/40">
            Q <strong className="text-white">{currentIdx + 1}</strong> / <strong>{total}</strong>
          </span>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="w-full h-1.5 bg-white/6 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>

      {/* ── Score results ─────────────────────────────────────────────── */}
      {isSubmitted && !reviewMode && (
        <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent p-10 text-center space-y-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl ${
            passed ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-indigo-600 to-purple-600'
          }`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Quiz Completed! 🎉</h2>
            <p className="text-white/50 text-sm mt-1">
              You scored <strong className="text-white">{scorePercent}%</strong>. Passing grade is {mockQuiz.passingScore}%.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { label: 'Accuracy',  val: `${scorePercent}%`, color: 'text-purple-400' },
              { label: 'Correct',   val: correctCount,       color: 'text-emerald-400' },
              { label: 'Wrong',     val: total - correctCount, color: 'text-red-400' },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-white/5 border border-white/8">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-1">{s.label}</p>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => { setReviewMode(true); setCurrentIdx(0) }}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 text-sm font-bold hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Review Answers
            </button>
            <Link to="/learn/course-1">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-all cursor-pointer">
                Continue Next Lesson <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Main question workspace ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">

        {/* Question card */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs border-b border-white/6 pb-4">
              <span className="font-bold text-purple-400 uppercase tracking-wider">
                Question {currentIdx + 1} of {total}
              </span>
              {!isSubmitted && (
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    flaggedQuestions[q.id]
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                      : 'text-white/35 hover:bg-white/6 hover:text-white/60'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  {flaggedQuestions[q.id] ? 'Flagged' : 'Flag'}
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">{q.text}</h2>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[q.id] === optIdx
                const isCorrect  = q.correctAnswer === optIdx
                const showFeedback = reviewMode || isSubmitted

                let base = 'border-white/8 bg-white/4 text-white/60 hover:border-white/16 hover:bg-white/6'
                if (isSelected && !showFeedback)
                  base = 'border-purple-500/50 bg-purple-500/12 text-white ring-1 ring-purple-500/25'
                else if (showFeedback && isCorrect)
                  base = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20'
                else if (showFeedback && isSelected && !isCorrect)
                  base = 'border-red-500/40 bg-red-500/10 text-red-200 ring-1 ring-red-500/20'

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelect(optIdx)}
                    disabled={isSubmitted && !reviewMode}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${base}`}
                  >
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                      isSelected && !showFeedback
                        ? 'border-purple-500 bg-purple-500 text-white'
                        : showFeedback && isCorrect
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : showFeedback && isSelected && !isCorrect
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-white/15 text-white/30'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="flex-1 font-medium">{opt}</span>
                    {showFeedback && isCorrect   && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {reviewMode && (
              <div className="p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/15 text-xs text-white/60 leading-relaxed">
                <p className="font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4" /> Explanation
                </p>
                {q.explanation}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/6">
              <button
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 bg-white/4 text-xs font-bold text-white/50 hover:bg-white/8 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < total - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((p) => Math.min(total - 1, p + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : !isSubmitted ? (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Submit Quiz
                  </button>
                ) : (
                  <Link to="/learn/course-1">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
                      Back to Course <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question palette */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5 space-y-4 sticky top-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25">Navigator</p>

            <div className="grid grid-cols-5 gap-2">
              {mockQuiz.questions.map((ques, idx) => {
                const isCurrent  = currentIdx === idx
                const isAnswered = selectedAnswers[ques.id] !== undefined
                const isFlagged  = flaggedQuestions[ques.id]

                return (
                  <button
                    key={ques.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-xl text-xs font-black transition-all cursor-pointer relative ${
                      isCurrent  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg'
                      : isAnswered ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                      : 'bg-white/6 text-white/35 hover:bg-white/10 hover:text-white/60'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-white/6 space-y-1.5">
              {[
                { color: 'bg-purple-500', label: 'Current' },
                { color: 'bg-emerald-500/40 border border-emerald-500/25', label: 'Answered' },
                { color: 'bg-amber-400', label: 'Flagged' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-[10px] text-white/30">
                  <span className={`w-3 h-3 rounded-full ${l.color}`} />
                  {l.label}
                </div>
              ))}
            </div>

            {!isSubmitted && (
              <button
                onClick={() => setIsSubmitted(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
