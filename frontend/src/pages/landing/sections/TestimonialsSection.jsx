import { Star, Quote, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const TESTIMONIALS = [
  {
    name: 'David Chen',
    role: 'Senior Backend Engineer at Stripe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    course: 'Mastering Java & Object-Oriented Architecture',
    rating: 5,
    text: 'E-Learning Academy’s deep dives on virtual threads and concurrency are unmatched. The practical exercises helped me lead our team’s migration to high-throughput reactive services.',
  },
  {
    name: 'Elena Rostova',
    role: 'Full-Stack Developer at Shopify',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    course: 'Modern Full-Stack FastAPI & React',
    rating: 5,
    text: 'I transitioned from junior frontend to full-stack in 4 months. The course projects felt like actual pull requests at a real tech company, not toy homework exercises.',
  },
  {
    name: 'Marcus Williams',
    role: 'Machine Learning Engineer at Databricks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    course: 'Applied Generative AI & LLM Systems',
    rating: 5,
    text: 'The curriculum is constantly updated with current production libraries. The certificate verified directly to my LinkedIn and generated multiple recruiter inbound inquiries.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-20 bg-[#f7f9fa] border-t border-[#d1d7dc]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d1f] tracking-tight">
          How learners like you are achieving their goals
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white p-6 sm:p-7 border border-[#d1d7dc] rounded-none flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-slate-300 mb-3" />
                <p className="text-xs sm:text-sm text-[#1c1d1f] leading-relaxed font-normal">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#d1d7dc]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1c1d1f]">
                    {t.name}
                  </h4>
                  <p className="text-3xs text-[#6a6f73]">{t.role}</p>
                  <Link
                    to="/explore"
                    className="text-3xs text-[#5624d0] font-bold hover:underline block mt-0.5"
                  >
                    [{t.course}]
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
