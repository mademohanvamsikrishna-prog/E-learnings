import { BookOpen, Video, Code2, Award, ArrowRight, CheckCircle2 } from 'lucide-react'

const STEPS = [
  {
    step: '1',
    title: 'Choose a Course',
    desc: 'Select from 500+ structured curricula designed by industry architects and university professors.',
    icon: BookOpen,
    accent: 'bg-purple-50 text-[#5624d0]',
  },
  {
    step: '2',
    title: 'Interactive Learning',
    desc: 'Watch HD video lectures with synchronized timeline notes, downloadable assets, and GitHub starter code.',
    icon: Video,
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    step: '3',
    title: 'Hands-on Practice',
    desc: 'Solve algorithmic code drills, complete module assignments, and take proctored diagnostic quizzes.',
    icon: Code2,
    accent: 'bg-amber-50 text-amber-600',
  },
  {
    step: '4',
    title: 'Get Certified',
    desc: 'Earn verified certificates with unique cryptographic verification IDs to showcase on LinkedIn and resumes.',
    icon: Award,
    accent: 'bg-emerald-50 text-emerald-600',
  },
]

export function ActiveLearningSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5624d0] block mb-2">
            Proven Learning Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            How EduSpire Prepares You for Real-World Roles
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Passive reading does not build software engineers. Every module in our platform feeds directly into active practice, AI feedback, and credential verification.
          </p>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.step}
                className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {step.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#5624d0] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-2xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Integrated Milestone</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ActiveLearningSection
