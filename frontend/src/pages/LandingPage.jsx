import {
  HeroSection,
  CoursesSection,
  AITutorSection,
  ActiveLearningSection,
  TestimonialsSection,
  AcademyPromosSection,
} from './landing/sections'

export function LandingPage() {
  return (
    <div className="w-full bg-white text-[#1c1d1f] selection:bg-purple-100 selection:text-[#5624d0]">
      {/* 1. Billboard Hero Carousel & 16,000+ Enterprise Partner Logos */}
      <HeroSection />

      {/* 2. 'All the skills you need in one place' Tabs + Course Cards & 'Learners are viewing' */}
      <CoursesSection />

      {/* 3. 24/7 AI Learning Mentor Simulator */}
      <AITutorSection />

      {/* 4. Active Hands-On Learning Methodology */}
      <ActiveLearningSection />

      {/* 5. 'How learners like you are achieving their goals' (Authentic Testimonials) */}
      <TestimonialsSection />

      {/* 6. Academy Business & Become an Instructor Banners */}
      <AcademyPromosSection />
    </div>
  )
}

export default LandingPage
