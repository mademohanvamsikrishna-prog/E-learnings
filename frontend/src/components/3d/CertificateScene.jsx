import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Award, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react'
import { MagneticButton } from '../animations'

export function CertificateScene({ onStartJourney }) {
  const mountRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Floating background golden stars/particles
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 500
    const height = container.clientHeight || 340

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    const particleCount = 120
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8
      positions[i + 1] = (Math.random() - 0.5) * 5
      positions[i + 2] = (Math.random() - 0.5) * 4
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xe89b5a,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    let animId
    const startTime = performance.now()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001
      points.rotation.y = t * 0.04
      points.rotation.x = Math.sin(t * 0.03) * 0.05
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-6">
      {/* 3D Golden Particle Canvas Behind */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Cinematic 3D Certificate Card */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered
            ? 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.02)'
            : 'perspective(1200px) rotateX(7deg) rotateY(-10deg) scale(0.98)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease',
        }}
        className="relative z-10 w-full max-w-xl bg-[#FFFDF7] rounded-3xl p-8 sm:p-10 border-2 border-[#E8E2D5] shadow-2xl shadow-[#12372A]/10 text-center cursor-pointer select-none"
      >
        {/* Subtle Metallic Corner Embellishments */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#E89B5A]" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#E89B5A]" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#E89B5A]" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#E89B5A]" />

        {/* Certificate Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-6 h-6 text-[#E89B5A]" />
          <span className="font-editorial italic text-xs tracking-widest text-[#2F7D62] uppercase font-semibold">
            Certificate of Mastery
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#12372A] tracking-tight">
          Alex Morgan
        </h3>

        <p className="mt-2 text-xs text-[#68756D] max-w-md mx-auto leading-relaxed">
          Has demonstrated rigorous practical competency, passed comprehensive proctored assessments, and completed capstone project:
        </p>

        <div className="my-4 py-2 px-4 rounded-xl bg-white border border-[#E8E2D5] inline-block shadow-sm">
          <span className="font-bold text-sm text-[#12372A]">
            Advanced Java & Reactive Microservices
          </span>
        </div>

        {/* Footer Details */}
        <div className="mt-6 pt-5 border-t border-[#E8E2D5]/70 flex items-center justify-between text-2xs text-[#68756D]">
          <div className="text-left">
            <span className="block font-medium">Instructor: Dr. Sarah Jenkins</span>
            <span className="font-mono text-[#8E9C94]">ID: EDS-2026-9482</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#12372A] text-[#FFFDF7] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E89B5A]" /> Verified On-Chain
          </div>
        </div>
      </div>

      {/* Accompanying Editorial Copy & CTA */}
      <div className="relative z-10 mt-8 text-center max-w-lg">
        <p className="font-editorial italic text-lg sm:text-xl text-[#12372A] mb-4">
          "Your learning journey deserves to be recognized."
        </p>
        <MagneticButton
          onClick={onStartJourney}
          className="btn-accent px-6 py-3 text-sm shadow-lg font-bold"
        >
          <Sparkles className="w-4 h-4 text-[#17231D]" />
          Start Your Journey
        </MagneticButton>
      </div>
    </div>
  )
}

export default CertificateScene
