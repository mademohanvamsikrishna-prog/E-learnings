import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Compass, BookOpen, Code2, Award, ArrowRight } from 'lucide-react'

const STAGES = [
  {
    step: '01',
    title: 'Explore',
    subtitle: 'Curated Pathways',
    description: 'Map out personalized curricula aligned with your career ambition and background knowledge.',
    icon: Compass,
    accent: '#2F7D62',
  },
  {
    step: '02',
    title: 'Learn',
    subtitle: 'Active Immersion',
    description: 'Bite-sized architectural breakdowns, video deep dives, and live code examples.',
    icon: BookOpen,
    accent: '#12372A',
  },
  {
    step: '03',
    title: 'Practice',
    subtitle: 'Adaptive Drills',
    description: 'Algorithmic quizzes, timed problem solving, and instant AI tutor feedback on submissions.',
    icon: Code2,
    accent: '#E89B5A',
  },
  {
    step: '04',
    title: 'Master',
    subtitle: 'Verified Credential',
    description: 'Earn cryptographic certificates and build a portfolio ready for technical interviews.',
    icon: Award,
    accent: '#12372A',
  },
]

export function LearningPath() {
  const canvasRef = useRef(null)
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let t = 0

    const resize = () => {
      if (!canvas) return
      canvas.width = canvas.parentElement?.clientWidth || 800
      canvas.height = 140
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      t += 0.015
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const w = canvas.width
      const h = canvas.height
      const y = h / 2

      // Draw background guideline
      ctx.beginPath()
      ctx.moveTo(40, y)
      // Smooth sinusoidal curve
      for (let x = 40; x <= w - 40; x += 5) {
        const wave = Math.sin((x / w) * Math.PI * 4 + t * 0.5) * 12
        ctx.lineTo(x, y + wave)
      }
      ctx.strokeStyle = 'rgba(232, 226, 213, 0.7)'
      ctx.lineWidth = 3
      ctx.setLineDash([6, 6])
      ctx.stroke()
      ctx.setLineDash([])

      // Glowing active energy pulse
      const pulseX = 40 + ((Math.sin(t) + 1) / 2) * (w - 80)
      const pulseWave = Math.sin((pulseX / w) * Math.PI * 4 + t * 0.5) * 12

      const glowGrad = ctx.createRadialGradient(pulseX, y + pulseWave, 0, pulseX, y + pulseWave, 24)
      glowGrad.addColorStop(0, 'rgba(232, 155, 90, 0.9)')
      glowGrad.addColorStop(0.5, 'rgba(47, 125, 98, 0.4)')
      glowGrad.addColorStop(1, 'rgba(47, 125, 98, 0)')

      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(pulseX, y + pulseWave, 24, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#E89B5A'
      ctx.beginPath()
      ctx.arc(pulseX, y + pulseWave, 5, 0, Math.PI * 2)
      ctx.fill()

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Dynamic Glowing Sine Curve */}
      <div className="w-full relative h-28 hidden md:block overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* 4 Connected Milestone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon
          const isSelected = activeStage === idx

          return (
            <div
              key={stage.step}
              onClick={() => setActiveStage(idx)}
              onMouseEnter={() => setActiveStage(idx)}
              className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? 'bg-white border-[#2F7D62] shadow-xl shadow-[#12372A]/5 -translate-y-2'
                  : 'bg-[#FFFDF7] border-[#E8E2D5] hover:border-[#98C2AF] hover:-translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-mono text-xs font-bold tracking-widest px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: isSelected ? 'rgba(47, 125, 98, 0.12)' : 'rgba(18, 55, 42, 0.05)',
                    color: isSelected ? '#2F7D62' : '#68756D',
                  }}
                >
                  {stage.step}
                </span>

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300"
                  style={{
                    backgroundColor: isSelected ? '#12372A' : 'rgba(18, 55, 42, 0.06)',
                    color: isSelected ? '#FFFDF7' : '#12372A',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-2xs font-semibold uppercase tracking-wider text-[#68756D] mb-1">
                {stage.subtitle}
              </div>
              <h3 className="text-xl font-bold text-[#12372A] tracking-tight mb-2 flex items-center gap-2">
                {stage.title}
                {isSelected && <ArrowRight className="w-4 h-4 text-[#E89B5A] inline-block animate-pulse" />}
              </h3>
              <p className="text-xs text-[#68756D] leading-relaxed">
                {stage.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningPath
