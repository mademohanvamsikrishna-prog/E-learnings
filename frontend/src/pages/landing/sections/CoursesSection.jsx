import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, Heart } from 'lucide-react'
import { courses } from '@/data/mockData'

const CATEGORY_TABS = [
  {
    id: 'Python',
    label: 'Python',
    title: 'Expand your career opportunities with Python',
    desc: 'Take one of E-Learning Academy’s range of Python courses and learn how to code using this incredibly useful language. Its simple syntax and readability makes Python perfect for Flask, Django, data analysis, and machine learning.',
    btnLabel: 'Explore Python',
    category: 'Programming',
  },
  {
    id: 'Web Development',
    label: 'Web Development',
    title: 'Build modern applications with Full-Stack Web Development',
    desc: 'Web development encompasses everything from responsive frontends using React and Next.js to robust backend APIs built with FastAPI, Node, and relational databases.',
    btnLabel: 'Explore Web Development',
    category: 'Web Development',
  },
  {
    id: 'AI & ML',
    label: 'Data Science & AI',
    title: 'Lead the next wave of Artificial Intelligence & Machine Learning',
    desc: 'From foundational statistics and neural networks to cutting-edge Generative AI and LLM orchestration with LangChain, master the skills reshaping modern technology.',
    btnLabel: 'Explore Data Science',
    category: 'AI & ML',
  },
  {
    id: 'Database',
    label: 'Database & SQL',
    title: 'Design reliable, high-throughput database systems',
    desc: 'Master SQL querying, PostgreSQL internal architectures, connection pooling, and replication to ensure enterprise-grade data persistence and performance.',
    btnLabel: 'Explore Databases',
    category: 'Database',
  },
  {
    id: 'Cloud',
    label: 'Cloud & DevOps',
    title: 'Automate infrastructure and scale with Cloud & Kubernetes',
    desc: 'Learn Docker containerization, Kubernetes cluster orchestration, and CI/CD pipelines to deploy resilient cloud-native architectures.',
    btnLabel: 'Explore Cloud',
    category: 'Cloud',
  },
]

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState(0)
  const currentTab = CATEGORY_TABS[activeTab]

  // Filter courses based on active tab category
  const filteredCourses = courses.filter(
    (c) => c.category === currentTab.category || currentTab.id === 'Python'
  ).slice(0, 4)

  const learnersViewing = courses.slice(2, 6)

  return (
    <section className="py-12 px-4 sm:px-6 max-w-[1440px] mx-auto text-left">
      {/* ── Section Header ─────────────────────────────────────────────────── */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d1f] tracking-tight">
        All the skills you need in one place
      </h2>
      <p className="mt-2 text-sm sm:text-base text-[#6a6f73]">
        From critical skills to technical topics, E-Learning Academy supports your professional development.
      </p>

      {/* ── Category Underline Tabs ──────────────────────────────────── */}
      <div className="mt-6 flex items-center gap-6 overflow-x-auto border-b border-[#d1d7dc] scrollbar-none">
        {CATEGORY_TABS.map((tab, idx) => {
          const isSelected = activeTab === idx
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#1c1d1f] text-[#1c1d1f]'
                  : 'border-transparent text-[#6a6f73] hover:text-[#1c1d1f]'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Featured Skill Showcase Card (Udemy border box) ───────────────── */}
      <div className="mt-6 p-6 sm:p-8 border border-[#d1d7dc] rounded-none bg-white">
        <h3 className="text-xl sm:text-2xl font-bold text-[#1c1d1f]">
          {currentTab.title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-[#334155] max-w-3xl leading-relaxed">
          {currentTab.desc}
        </p>

        <div className="mt-4">
          <Link to="/explore">
            <button className="px-4 py-2.5 text-xs font-bold text-[#1c1d1f] border border-[#1c1d1f] hover:bg-slate-100 transition-colors rounded-none cursor-pointer">
              {currentTab.btnLabel}
            </button>
          </Link>
        </div>

        {/* ── Course Cards Grid (Exact Udemy Structure) ────────────────────── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredCourses.map((course) => {
            const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor

            return (
              <div
                key={course.id}
                className="group flex flex-col justify-between cursor-pointer text-left"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-video w-full overflow-hidden border border-[#d1d7dc] bg-slate-100 mb-2">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>

                  {/* Course Title */}
                  <h4 className="text-sm font-bold text-[#1c1d1f] leading-snug line-clamp-2 group-hover:text-[#5624d0]">
                    <Link to={`/courses/${course.id}`}>{course.title}</Link>
                  </h4>

                  {/* Instructor Name */}
                  <p className="text-2xs text-[#6a6f73] mt-1 truncate">
                    {instructorName}
                  </p>

                  {/* Rating & Review Count */}
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="font-extrabold text-[#b4690e]">{course.rating}</span>
                    <div className="flex text-[#e59819]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#e59819]" />
                      ))}
                    </div>
                    <span className="text-3xs text-[#6a6f73]">
                      ({(course.reviewsCount || 2340).toLocaleString()})
                    </span>
                  </div>

                  {/* Pricing (Udemy discount format) */}
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-[#1c1d1f]">
                      ${course.price || 14.99}
                    </span>
                    <span className="text-xs text-[#6a6f73] line-through">
                      ${course.originalPrice || 84.99}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="mt-1.5">
                    {course.isBestseller && (
                      <span className="bg-[#eceb98] text-[#3d3c0a] font-bold text-3xs px-2 py-0.5 tracking-tight inline-block">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Section: Learners Are Viewing (Udemy Signature Row) ───────────── */}
      <div className="mt-16">
        <h3 className="text-xl sm:text-2xl font-bold text-[#1c1d1f]">
          Learners are viewing
        </h3>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {learnersViewing.map((course) => {
            const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : course.instructor

            return (
              <div
                key={`viewing-${course.id}`}
                className="group flex flex-col justify-between cursor-pointer text-left"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden border border-[#d1d7dc] bg-slate-100 mb-2">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>

                  <h4 className="text-sm font-bold text-[#1c1d1f] leading-snug line-clamp-2 group-hover:text-[#5624d0]">
                    <Link to={`/courses/${course.id}`}>{course.title}</Link>
                  </h4>

                  <p className="text-2xs text-[#6a6f73] mt-1 truncate">
                    {instructorName}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="font-extrabold text-[#b4690e]">{course.rating}</span>
                    <div className="flex text-[#e59819]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#e59819]" />
                      ))}
                    </div>
                    <span className="text-3xs text-[#6a6f73]">
                      ({(course.reviewsCount || 1840).toLocaleString()})
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-[#1c1d1f]">
                      ${course.price || 16.99}
                    </span>
                    <span className="text-xs text-[#6a6f73] line-through">
                      ${course.originalPrice || 94.99}
                    </span>
                  </div>

                  <div className="mt-1.5">
                    <span className="bg-[#eceb98] text-[#3d3c0a] font-bold text-3xs px-2 py-0.5 tracking-tight inline-block">
                      Hot & new
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CoursesSection
