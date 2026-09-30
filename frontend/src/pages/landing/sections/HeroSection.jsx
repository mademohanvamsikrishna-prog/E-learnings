import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

const BILLBOARD_SLIDES = [
  {
    title: 'Skills for your present (and your future)',
    desc: 'Prepare for certifications, master new tech frameworks, or advance in your current role. Courses from $12.99 through tonight.',
    ctaText: 'Explore courses',
    ctaLink: '/explore',
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Jump into learning for less',
    desc: 'If you’re ready to expand your potential, we’ve got courses starting at $12.99. Master Python, React, Machine Learning, and more.',
    ctaText: 'Start learning now',
    ctaLink: '/explore',
    bgImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const slide = BILLBOARD_SLIDES[currentSlide]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BILLBOARD_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BILLBOARD_SLIDES.length) % BILLBOARD_SLIDES.length)
  }

  return (
    <div className="w-full bg-white">
      {/* ── Udemy Billboard Carousel ────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto sm:px-6 sm:py-6">
        <div className="relative h-[340px] sm:h-[400px] lg:h-[440px] w-full overflow-hidden sm:rounded-none group bg-slate-900">
          {/* Background Photo */}
          <img
            src={slide.bgImage}
            alt="E-Learning Academy Billboard"
            className="w-full h-full object-cover object-center transition-all duration-700 brightness-[0.92]"
          />

          {/* Left Floating White Card (Iconic Udemy Signature) */}
          <div className="absolute top-6 left-4 sm:top-12 sm:left-12 max-w-[440px] bg-white p-6 sm:p-8 shadow-2xl rounded-none z-10 text-left border border-slate-100 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1d1f] tracking-tight leading-tight">
              {slide.title}
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#334155] leading-relaxed">
              {slide.desc}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link to={slide.ctaLink}>
                <button className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#1c1d1f] hover:bg-slate-800 transition-colors cursor-pointer rounded-none">
                  {slide.ctaText}
                </button>
              </Link>

              <Link to="/ai-tutor">
                <button className="px-4 py-3 text-xs sm:text-sm font-bold text-[#5624d0] hover:text-[#431ba8] hover:bg-purple-50 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="w-4 h-4 text-[#a435f0]" />
                  <span>Try AI Tutor</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Previous / Next Chevron Navigation Buttons */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1c1d1f] shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer z-20"
            title="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1c1d1f] shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer z-20"
            title="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ── Partner Companies Banner (Exact Udemy Style) ────────────────────── */}
      <div className="bg-[#f7f9fa] border-y border-[#d1d7dc] py-10 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-xs sm:text-sm font-bold text-[#6a6f73] mb-6">
            Trusted by over 16,000 companies and millions of learners around the world
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="font-extrabold text-2xl text-slate-800 tracking-tighter">Volkswagen</span>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">SAMSUNG</span>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">CISCO</span>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">vimeo</span>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">P&G</span>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">Hewlett Packard</span>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">citi</span>
            <span className="font-extrabold text-2xl text-slate-800 tracking-tight">ERICSSON</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
