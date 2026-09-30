import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Sparkles } from 'lucide-react'

export function FinalCTASection() {
  return (
    <section className="py-16 sm:py-24 bg-[#1c1d1f] text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5624d0]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Start Learning Today</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Join over 50,000+ developers building their careers on EduSpire
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Gain unrestricted access to top-rated courses in Software Architecture, AI Systems, and Cloud DevOps. Master practical skills with instant AI feedback.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <button className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-lg shadow-purple-900/50 bg-[#a435f0] hover:bg-[#8928ce] border-[#a435f0]">
              <span>Sign Up for Free</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </Link>

          <Link to="/explore" className="w-full sm:w-auto">
            <button className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-transparent text-white border-white/40 hover:bg-white/10 hover:border-white hover:text-white">
              <BookOpen className="w-4 h-4 mr-1 text-purple-300" />
              <span>Explore Course Catalog</span>
            </button>
          </Link>
        </div>

        {/* Guarantees */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Free tier available
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Instant syllabus access
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> 30-day money-back guarantee
          </span>
        </div>
      </div>
    </section>
  )
}

export default FinalCTASection
