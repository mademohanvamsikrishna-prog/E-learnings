import { LearningPath } from '@/components/3d'
import { ScrollReveal } from '@/components/animations'

export function LearningJourneySection() {
  return (
    <section id="journey" className="relative py-24 sm:py-32 overflow-hidden bg-[#F7F3EA]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#2F7D62]/10 via-[#E89B5A]/10 to-[#12372A]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal animation="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF7] border border-[#E8E2D5] text-xs font-semibold text-[#2F7D62] uppercase tracking-wider mb-3">
            <span>Seamless Progression</span>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
            Your Learning <span className="font-editorial italic font-normal text-[#2F7D62]">Universe</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#68756D] leading-relaxed">
            Move seamlessly through a continuous four-stage curriculum engineered for rapid concept comprehension and battle-tested mastery.
          </p>
        </ScrollReveal>

        {/* 3D Glowing Sine Wave Path & Dynamic Cards */}
        <div className="mt-12">
          <LearningPath />
        </div>
      </div>
    </section>
  )
}

export default LearningJourneySection
