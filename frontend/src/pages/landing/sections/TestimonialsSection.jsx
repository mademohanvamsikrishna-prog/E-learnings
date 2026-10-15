import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'David Chen',
    role: 'Senior Backend Engineer',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    course: 'Mastering Java & Object-Oriented Architecture',
    text: 'The deep dives on virtual threads and concurrency are unmatched. The practical exercises helped me lead our team\'s migration to high-throughput reactive services in under 3 months.',
    outcome: 'Got promoted to Staff Engineer',
    tag: '☕ Java',
  },
  {
    name: 'Elena Rostova',
    role: 'Full-Stack Developer',
    company: 'Shopify',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    course: 'Modern Full-Stack FastAPI & React',
    text: 'I transitioned from junior frontend to full-stack in just 4 months. The course projects felt like actual production pull requests at a real tech company — not toy homework.',
    outcome: '₹2.4L salary increase after cert',
    tag: '⚡ React + FastAPI',
  },
  {
    name: 'Marcus Williams',
    role: 'ML Engineer',
    company: 'Databricks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    course: 'Applied Generative AI & LLM Systems',
    text: 'The curriculum is constantly updated with current production libraries. The certificate generated multiple recruiter inbound inquiries within two weeks of posting.',
    outcome: '5 recruiter calls in 2 weeks',
    tag: '🤖 AI / LLMs',
  },
]

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0)
  const t = TESTIMONIALS[idx]

  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-28 overflow-hidden relative">
      {/* Subtle gradient accent */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">
              Student Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real outcomes,<br />
              <span className="text-white/35">real people.</span>
            </h2>
          </div>
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-white/30 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5 px-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === idx ? 'w-6 h-2 bg-purple-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-white/30 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured testimonial — big card */}
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Quote side */}
          <div className="lg:col-span-3 space-y-6">
            <Quote className="w-10 h-10 text-purple-500/40" />
            <blockquote className="text-xl sm:text-2xl font-semibold text-white/80 leading-relaxed tracking-tight">
              "{t.text}"
            </blockquote>

            {/* Outcome pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-bold text-emerald-300">{t.outcome}</span>
            </div>

            {/* Person */}
            <div className="flex items-center gap-4 pt-2">
              <img src={t.avatar} alt={t.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
              <div>
                <div className="text-sm font-extrabold text-white">{t.name}</div>
                <div className="text-xs text-white/45 mt-0.5">{t.role} · {t.company}</div>
                <div className="mt-1">
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    {t.tag}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* All testimonials mini-stack */}
          <div className="lg:col-span-2 space-y-3">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                onClick={() => setIdx(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  i === idx
                    ? 'bg-white/8 border-purple-500/30 shadow-[0_0_20px_rgba(124,58,237,0.12)]'
                    : 'bg-white/3 border-white/6 hover:border-white/12 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/10 flex-none" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{item.name}</div>
                    <div className="text-[10px] text-white/40 truncate">{item.role} · {item.company}</div>
                  </div>
                  {i === idx && (
                    <div className="ml-auto flex-none w-2 h-2 rounded-full bg-purple-400" />
                  )}
                </div>
                <p className="mt-2 text-[11px] text-white/40 leading-relaxed line-clamp-2">
                  "{item.text}"
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
