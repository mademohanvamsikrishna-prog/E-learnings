import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Sparkles, Users, BookOpen, TrendingUp } from 'lucide-react'

export function AcademyPromosSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 space-y-12">

        {/* ── CTA 1: Teams / Business ───────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] text-white">
          {/* Background accent */}
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, #7c3aed 0%, transparent 60%)' }} />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center p-10 sm:p-14">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-xs font-semibold text-purple-300">
                <GraduationCap className="w-3.5 h-3.5" /> For teams &amp; enterprise
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Upskill your entire team.<br />
                <span className="text-white/40">At scale.</span>
              </h3>

              <p className="text-sm text-white/50 leading-relaxed max-w-md">
                Unlimited access to 27,000+ courses, advanced analytics, dedicated learning paths per role, and SSO integration.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, val: '500+', lbl: 'Companies' },
                  { icon: BookOpen, val: '27K+', lbl: 'Courses' },
                  { icon: TrendingUp, val: '14', lbl: 'Languages' },
                ].map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.lbl} className="text-center p-3 rounded-xl bg-white/5 border border-white/8">
                      <Icon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <div className="text-xl font-extrabold text-white">{s.val}</div>
                      <div className="text-[10px] text-white/40 font-medium">{s.lbl}</div>
                    </div>
                  )
                })}
              </div>

              <Link to="/explore">
                <button className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#0f0f0f] rounded-xl font-bold text-sm hover:bg-purple-50 transition-all hover:-translate-y-0.5 shadow-lg cursor-pointer group">
                  Get Academy Business
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Decorative right side */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { name: 'React 19 Masterclass', students: '12.4K', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20' },
                { name: 'Python for AI', students: '18.2K', color: 'from-yellow-500/20 to-amber-500/10 border-amber-500/20' },
                { name: 'AWS Solutions Arch.', students: '9.7K', color: 'from-orange-500/20 to-red-500/10 border-orange-500/20' },
                { name: 'LLM Engineering', students: '21.3K', color: 'from-purple-500/20 to-violet-500/10 border-purple-500/20' },
              ].map((c) => (
                <div key={c.name}
                  className={`p-4 rounded-2xl bg-gradient-to-br border ${c.color} backdrop-blur-sm`}>
                  <div className="text-xs font-bold text-white/80 mb-1">{c.name}</div>
                  <div className="text-[10px] text-white/35">{c.students} enrolled</div>
                  <div className="mt-3 h-1 bg-white/10 rounded-full">
                    <div className="h-full w-3/4 rounded-full bg-white/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA 2: Become an Instructor ──────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-100 bg-[#fafafa]">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Image side */}
            <div className="relative min-h-[280px] lg:min-h-0 overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80"
                alt="Instructor recording course"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fafafa]/20" />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl shadow-lg border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">50K+ active learners</span>
              </div>
            </div>

            {/* Text side */}
            <div className="p-10 sm:p-14 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700 self-start">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> For instructors
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f0f0f] tracking-tight leading-tight">
                  Teach what you love.<br />
                  <span className="text-[#0f0f0f]/35">Earn what you deserve.</span>
                </h3>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-md">
                  Build your course with our AI-powered curriculum builder, publish to 50K+ eager learners,
                  and get paid monthly. No platform cut, ever.
                </p>
              </div>

              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  'AI quiz & content generation tools',
                  'Student analytics & engagement heatmap',
                  'Direct payout — no revenue split',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-none">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <button className="flex items-center gap-2 px-6 py-3.5 bg-[#0f0f0f] text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer group self-start">
                  Start teaching today
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AcademyPromosSection
