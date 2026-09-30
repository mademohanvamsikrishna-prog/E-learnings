import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, GraduationCap } from 'lucide-react'

export function AcademyPromosSection() {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-[1440px] mx-auto space-y-16">
      {/* ── Academy Business Banner ───────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-8 sm:p-12 border border-[#d1d7dc] bg-[#f7f9fa]">
        <div className="max-w-xl text-left space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#5624d0] flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-[#1c1d1f] text-xl tracking-tight">
              E-Learning <span className="text-[#5624d0]">Academy</span> <span className="font-normal text-slate-500 text-base">Business</span>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d1f] tracking-tight">
            Upskill your team with Academy Business
          </h3>

          <ul className="space-y-2 text-xs sm:text-sm text-[#334155]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c1d1f]" />
              <span>Unlimited access to 27,000+ top courses, anytime, anywhere</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c1d1f]" />
              <span>International course collection in 14 languages</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c1d1f]" />
              <span>Top certifications in tech, leadership, and cloud infrastructure</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link to="/explore">
              <button className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#1c1d1f] hover:bg-slate-800 transition-colors cursor-pointer rounded-none">
                Get Academy Business
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-[480px] h-64 sm:h-72 overflow-hidden shrink-0 border border-[#d1d7dc]">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
            alt="Academy Business Team"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ── Become an Instructor Banner (Exact Udemy Style) ───────────────── */}
      <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-10 p-8 sm:p-12 border border-[#d1d7dc] bg-white">
        <div className="max-w-xl text-left space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d1f] tracking-tight">
            Become an instructor
          </h3>

          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
            Instructors from around the world teach millions of learners on E-Learning Academy. We provide the tools and skills to teach what you love.
          </p>

          <div className="pt-2">
            <Link to="/instructor/dashboard">
              <button className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#1c1d1f] hover:bg-slate-800 transition-colors cursor-pointer rounded-none">
                Start teaching today
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-[480px] h-64 sm:h-72 overflow-hidden shrink-0 border border-[#d1d7dc]">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80"
            alt="Teach on E-Learning Academy Instructor"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default AcademyPromosSection
