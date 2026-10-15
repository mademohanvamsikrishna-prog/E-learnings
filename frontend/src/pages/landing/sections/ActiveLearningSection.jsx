import { BookOpen, Video, Code2, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const STEPS = [
  {
    number: '01',
    title: 'Pick Your Path',
    desc: 'Choose from 500+ expert-crafted curricula. Filter by role — frontend, backend, ML engineer, DevOps.',
    icon: BookOpen,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    glow: 'group-hover:shadow-[0_8px_30px_rgba(124,58,237,0.18)]',
  },
  {
    number: '02',
    title: 'Watch & Code',
    desc: 'HD video lectures with synced notes, live code sandbox, and downloadable GitHub starter repos.',
    icon: Video,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    glow: 'group-hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
  },
  {
    number: '03',
    title: 'Build & Ship',
    desc: 'Complete real projects — not toy exercises. Every module has a portfolio-ready deliverable.',
    icon: Code2,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    glow: 'group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.18)]',
  },
  {
    number: '04',
    title: 'Get Certified',
    desc: 'Earn a cryptographically-signed certificate. One click to share to LinkedIn. Trusted by top companies.',
    icon: Award,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    glow: 'group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]',
  },
]

export function ActiveLearningSection() {
  return (
    <section className="bg-[#fafafa] py-20 sm:py-28 border-y border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7c3aed] mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f0f0f] tracking-tight leading-tight">
              From zero to job-ready
              <br />
              <span className="text-[#0f0f0f]/40">in four focused steps.</span>
            </h2>
          </div>
          <Link to="/explore">
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-[#0f0f0f] text-[#0f0f0f] rounded-xl font-bold text-sm hover:bg-[#0f0f0f] hover:text-white transition-all duration-200 cursor-pointer group whitespace-nowrap">
              Start learning today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Steps — horizontal timeline on desktop */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className={`group relative bg-white rounded-2xl border ${step.border} p-6 transition-all duration-300 hover:-translate-y-2 ${step.glow} cursor-default`}
                >
                  {/* Step number dot on connector line */}
                  <div className={`w-16 h-16 ${step.bg} ${step.border} border rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-7 h-7 ${step.color}`} />
                  </div>

                  <div className="text-[10px] font-black tracking-widest text-slate-300 mb-2">
                    STEP {step.number}
                  </div>

                  <h3 className="text-base font-extrabold text-[#0f0f0f] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Arrow to next step */}
                  {idx < STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-8 z-10 w-6 h-6 bg-white border border-slate-100 rounded-full items-center justify-center shadow-sm">
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom social proof bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          {[
            { val: '500+', lbl: 'Expert-built courses' },
            { val: '92%', lbl: 'Completion rate' },
            { val: '4.9/5', lbl: 'Average rating' },
            { val: '48h', lbl: 'Avg. time to first job' },
          ].map((s) => (
            <div key={s.lbl} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f0f0f] tracking-tight">{s.val}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ActiveLearningSection
