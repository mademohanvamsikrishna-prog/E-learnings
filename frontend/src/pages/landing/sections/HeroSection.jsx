import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Sparkles, Play, Users, Star, BookOpen, Zap } from 'lucide-react'

const STATS = [
  { value: '50K+', label: 'Active Learners' },
  { value: '500+', label: 'Expert Courses' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '92%', label: 'Completion Rate' },
]

const COMPANIES = [
  'Google', 'Stripe', 'Shopify', 'Airbnb', 'Netflix', 'Databricks',
  'Notion', 'Vercel', 'Figma', 'Linear', 'OpenAI', 'Anthropic',
]

const FLOATING_TAGS = [
  { label: 'React 19', color: 'bg-blue-500/15 text-blue-300 border-blue-500/20', top: '18%', left: '62%', delay: '0s' },
  { label: 'FastAPI', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', top: '38%', left: '68%', delay: '0.8s' },
  { label: 'AI / LLMs', color: 'bg-purple-500/15 text-purple-300 border-purple-500/20', top: '58%', left: '58%', delay: '1.6s' },
  { label: 'Kubernetes', color: 'bg-amber-500/15 text-amber-300 border-amber-500/20', top: '72%', left: '70%', delay: '2.4s' },
]

const TYPEWRITER_WORDS = ['React', 'Python', 'AI / LLMs', 'Java', 'DevOps', 'FastAPI']

export function HeroSection() {
  const [search, setSearch] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  // Typewriter effect
  useEffect(() => {
    const word = TYPEWRITER_WORDS[wordIdx]
    let timeout

    if (!isDeleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90)
    } else if (!isDeleting && displayed.length === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 55)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setWordIdx((i) => (i + 1) % TYPEWRITER_WORDS.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, wordIdx])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(search.trim() ? `/explore?q=${encodeURIComponent(search.trim())}` : '/explore')
  }

  return (
    <div className="w-full bg-[#0a0a0a] text-white overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center hero-noise">

        {/* Animated gradient orbs */}
        <div className="orb absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="orb orb-delay absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="orb absolute top-[40%] left-[40%] w-[350px] h-[350px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: Copy */}
            <div className="space-y-8">
              {/* Live badge */}
              <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-purple-300 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1,420 students enrolled today</span>
              </div>

              {/* Headline */}
              <div className="animate-fade-up delay-100">
                <h1 className="font-extrabold text-[3.2rem] sm:text-[4rem] lg:text-[4.5rem] leading-[1.04] tracking-[-0.04em] text-white">
                  Master{' '}
                  <span className="relative inline-block">
                    <span className="text-glow-gradient">{displayed}</span>
                    <span className="cursor-blink text-amber-400 ml-0.5">|</span>
                  </span>
                  <br />
                  <span className="text-white/60">the way experts</span>
                  <br />
                  <span className="text-white">actually do it.</span>
                </h1>
              </div>

              {/* Subheading */}
              <p className="animate-fade-up delay-200 text-base sm:text-lg text-white/55 leading-relaxed max-w-xl font-normal">
                500+ structured courses built by senior engineers. Hands-on projects,
                AI tutoring, and verified credentials — not passive video watching.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="animate-fade-up delay-300 relative max-w-lg">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="w-full pl-12 pr-32 py-4 bg-white/8 border border-white/12 rounded-xl text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-white text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="animate-fade-up delay-300 flex flex-wrap items-center gap-3">
                <Link to="/explore">
                  <button className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#0a0a0a] rounded-xl font-bold text-sm hover:bg-slate-100 transition-all hover:-translate-y-0.5 shadow-lg cursor-pointer">
                    Explore Courses <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="flex items-center gap-2 px-6 py-3.5 border border-white/15 text-white rounded-xl font-semibold text-sm hover:bg-white/8 hover:border-white/30 transition-all cursor-pointer backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Try AI Tutor
                  </button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="animate-fade-up delay-400 flex flex-wrap gap-6 pt-2 border-t border-white/8">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-extrabold text-white tracking-tight">{s.value}</div>
                    <div className="text-xs text-white/40 font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Visual stack */}
            <div className="hidden lg:flex relative justify-center items-center">
              {/* Glow behind cards */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full opacity-20 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
              </div>

              {/* Course card stack */}
              <div className="relative w-[340px] space-y-3">
                {/* Card 1 — back */}
                <div className="absolute -top-6 left-6 right-0 h-28 bg-white/4 border border-white/8 rounded-2xl backdrop-blur-sm scale-95 origin-bottom" />

                {/* Card 2 — mid */}
                <div className="absolute -top-3 left-3 right-0 h-28 bg-white/6 border border-white/10 rounded-2xl backdrop-blur-sm scale-[0.97] origin-bottom" />

                {/* Card 3 — front (main visible card) */}
                <div className="relative bg-white/9 border border-white/14 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Mastering React 19</div>
                      <div className="text-xs text-white/50">Dr. Sarah Connor</div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Progress</span><span className="text-purple-400 font-semibold">68%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /><span className="font-bold">4.9</span>
                      <span className="text-white/40">(2,340)</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer">
                      <Play className="w-3 h-3 fill-white" /> Resume
                    </button>
                  </div>
                </div>

                {/* AI assistant badge */}
                <div className="mt-4 flex items-center gap-2.5 bg-white/7 border border-purple-500/20 rounded-xl p-3 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">AI Tutor available</div>
                    <div className="text-[10px] text-white/40">Ask anything about your lesson →</div>
                  </div>
                </div>

                {/* Online users badge */}
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-300 font-semibold">142 learners online right now</span>
                </div>
              </div>

              {/* Floating skill tags */}
              {FLOATING_TAGS.map((tag) => (
                <div
                  key={tag.label}
                  className={`absolute hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-sm animate-float ${tag.color}`}
                  style={{ top: tag.top, left: tag.left, animationDelay: tag.delay }}
                >
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TRUST TICKER ─────────────────────────────────────────── */}
      <div className="border-y border-white/6 py-5 bg-white/2 overflow-hidden">
        <div className="flex items-center gap-6 mb-2.5 justify-center">
          <span className="text-xs font-semibold text-white/30 uppercase tracking-widest whitespace-nowrap px-4">
            Trusted by teams at
          </span>
        </div>
        <div className="marquee-track overflow-hidden">
          <div className="animate-marquee">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <span
                key={i}
                className="inline-block mx-8 text-lg font-black text-white/20 hover:text-white/50 transition-colors duration-300 cursor-default whitespace-nowrap select-none tracking-tight"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
