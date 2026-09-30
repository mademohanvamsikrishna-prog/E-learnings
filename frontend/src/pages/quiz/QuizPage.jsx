import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  Award,
  RotateCcw,
  Sparkles,
  Trophy,
  AlertTriangle,
} from 'lucide-react'
import { mockQuiz } from '@/data/mockData'
import { Button, Card, ProgressBar, Badge, Modal } from '@/components'

export function QuizPage() {
  const navigate = useNavigate()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { questionId: optionIdx }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}) // { questionId: boolean }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60) // 15 minutes
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isSubmitted])

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remaining = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`
  }

  const currentQuestion = mockQuiz.questions[currentIdx]

  const handleSelectOption = (optIdx) => {
    if (isSubmitted && !reviewMode) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optIdx,
    }))
  }

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }))
  }

  const handleSubmitQuiz = () => {
    setIsSubmitted(true)
  }

  // Calculate results
  const correctCount = mockQuiz.questions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length
  const wrongCount = mockQuiz.questions.length - correctCount
  const scorePercent = Math.round((correctCount / mockQuiz.questions.length) * 100)
  const passed = scorePercent >= mockQuiz.passingScore

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 animate-fade-in">
      {/* ─── Top Quiz Status Header ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              Module 2 Assessment
            </Badge>
            {isSubmitted && (
              <Badge variant={passed ? 'success' : 'danger'} size="sm">
                {passed ? 'Passed 🎉' : 'Needs Review'}
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {mockQuiz.title}
          </h1>
        </div>

        {/* Timer & Question Counter */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              timeLeftSeconds < 180
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Time Left: {formatTime(timeLeftSeconds)}</span>
          </div>

          <div className="text-slate-500">
            Question <strong className="text-slate-900">{currentIdx + 1}</strong> of{' '}
            <strong>{mockQuiz.questions.length}</strong>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <ProgressBar
          value={((currentIdx + 1) / mockQuiz.questions.length) * 100}
          color="indigo"
          size="sm"
        />
      </div>

      {/* ─── Completed Score Results Banner (When Submitted) ────────────────────── */}
      {isSubmitted && !reviewMode && (
        <div className="bg-gradient-to-tr from-white via-indigo-50/40 to-white rounded-2xl border border-indigo-100 p-8 shadow-md text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Quiz Completed! 🎉
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              You scored <strong className="text-slate-900 font-bold">{scorePercent}%</strong>. Passing grade is {mockQuiz.passingScore}%.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-2xs text-slate-400 uppercase font-bold">Accuracy</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">{scorePercent}%</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-2xs text-slate-400 uppercase font-bold">Correct</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{correctCount}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-2xs text-slate-400 uppercase font-bold">Wrong</span>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">{wrongCount}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setReviewMode(true)
                setCurrentIdx(0)
              }}
            >
              Review Answers & Explanations
            </Button>
            <Link to="/learn/course-1">
              <Button size="md" icon={ArrowRight} iconPosition="right">
                Continue Next Lesson
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ─── Question Workspace & Palette ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Question Card (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs text-slate-400 mb-6">
              <span className="font-semibold text-indigo-600 uppercase tracking-wider">
                Question {currentQuestion.id} of {mockQuiz.questions.length}
              </span>

              {!isSubmitted && (
                <button
                  type="button"
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    flaggedQuestions[currentQuestion.id]
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag for Review'}</span>
                </button>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.text}
            </h2>

            {/* Options List */}
            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx
                const isCorrect = currentQuestion.correctAnswer === optIdx
                const showFeedback = reviewMode || isSubmitted

                let optionStyles = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                if (isSelected && !showFeedback) {
                  optionStyles = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20'
                } else if (showFeedback) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20'
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isSubmitted && !reviewMode}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${optionStyles}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected && !showFeedback
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : showFeedback && isCorrect
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : showFeedback && isSelected && !isCorrect
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-slate-300 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="flex-1 font-medium">{opt}</span>

                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation box (in review mode) */}
            {reviewMode && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700 animate-fade-in">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Explanation:
                </p>
                <p className="leading-relaxed text-slate-600">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                icon={ArrowLeft}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentIdx < mockQuiz.questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentIdx((prev) => Math.min(mockQuiz.questions.length - 1, prev + 1))}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Next Question
                  </Button>
                ) : !isSubmitted ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleSubmitQuiz}
                    icon={CheckCircle2}
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Link to="/learn/course-1">
                    <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                      Back to Course
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Question Palette Sidebar (1 Col) */}
        <div className="lg:col-span-1 space-y-4">
          <Card padding="p-5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Question Navigator
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {mockQuiz.questions.map((q, idx) => {
                const isCurrent = currentIdx === idx
                const isAnswered = selectedAnswers[q.id] !== undefined
                const isFlagged = flaggedQuestions[q.id]

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/30'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-2xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600" /> Current Question
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" /> Flagged for review
              </div>
            </div>

            {!isSubmitted && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz Now
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
