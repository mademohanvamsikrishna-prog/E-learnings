import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Sparkles, MessageSquare, Lightbulb, HelpCircle, CheckCircle2 } from 'lucide-react'

const PROMPT_PILLS = [
  { text: 'Explain this concept', icon: Lightbulb, query: 'Explain polymorphism in Java with a real-world example.' },
  { text: 'Give me an example', icon: Sparkles, query: 'Show me an async FastAPI endpoint with dependency injection.' },
  { text: 'Create a quiz', icon: HelpCircle, query: 'Generate a 5-question test on binary search trees.' },
  { text: 'Help me understand', icon: MessageSquare, query: 'What is the difference between TCP and UDP in web protocols?' },
]

export function AIOrb({ onSelectPrompt }) {
  const mountRef = useRef(null)
  const [activeQuery, setActiveQuery] = useState(PROMPT_PILLS[0].query)
  const [activeResponse, setActiveResponse] = useState(
    'Polymorphism enables objects of different classes to respond to the same interface in their own distinct way. In Java, this means a base reference can invoke overridden subclass behaviors dynamically at runtime.'
  )

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 380
    const height = container.clientHeight || 380

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xfffdf7, 1.2)
    scene.add(ambient)

    const pointKey = new THREE.PointLight(0xe89b5a, 2.5, 10)
    pointKey.position.set(3, 3, 4)
    scene.add(pointKey)

    const pointFill = new THREE.PointLight(0x2f7d62, 3.0, 10)
    pointFill.position.set(-3, -2, 3)
    scene.add(pointFill)

    // Core Mesh (Inner glowing nucleus)
    const coreGeo = new THREE.SphereGeometry(0.8, 32, 32)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x12372a,
      emissive: 0x2f7d62,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.8,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    scene.add(coreMesh)

    // Outer Geodesic Crystalline Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.2, 1)
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xe89b5a,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const cageMesh = new THREE.Mesh(cageGeo, cageMat)
    scene.add(cageMesh)

    // Orbiting Golden Ring
    const ringGeo = new THREE.TorusGeometry(1.48, 0.025, 16, 64)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xe89b5a,
      metalness: 0.9,
      roughness: 0.2,
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 3.2
    scene.add(ringMesh)

    // Swirling electron energy particles
    const particleCount = 140
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.3 + Math.random() * 0.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i + 2] = radius * Math.cos(phi)
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xfffaed,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Interaction mouse tilt
    let mouseX = 0
    let mouseY = 0
    const handleMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }
    container.addEventListener('mousemove', handleMove)

    let animId
    const startTime = performance.now()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001

      coreMesh.rotation.y = t * 0.4
      cageMesh.rotation.x = t * -0.25
      cageMesh.rotation.y = t * 0.35
      ringMesh.rotation.z = t * 0.5
      particles.rotation.y = t * 0.2
      particles.rotation.x = t * 0.1

      const pulse = 1 + Math.sin(t * 2.5) * 0.05
      coreMesh.scale.set(pulse, pulse, pulse)

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05
      camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMove)
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) o.material.dispose()
      })
      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  const handlePillClick = (pill) => {
    setActiveQuery(pill.query)
    if (pill.text.includes('example')) {
      setActiveResponse(
        'Here is an example: @app.get("/items/{id}")\nasync def get_item(id: int, db: AsyncSession = Depends(get_db)):\n    return await db.get(Item, id)'
      )
    } else if (pill.text.includes('quiz')) {
      setActiveResponse(
        'Question 1: What is the average time complexity of a balanced BST lookup? A) O(1)  B) O(log N)  C) O(N) — Correct: B) O(log N)'
      )
    } else if (pill.text.includes('understand')) {
      setActiveResponse(
        'TCP ensures reliable, ordered packet delivery with handshake confirmations. UDP sends datagrams without waiting for handshakes, making it faster for live video and gaming.'
      )
    } else {
      setActiveResponse(
        'Polymorphism enables objects of different classes to respond to the same interface in their own distinct way. In Java, this means a base reference can invoke overridden subclass behaviors dynamically at runtime.'
      )
    }
    if (onSelectPrompt) onSelectPrompt(pill.query)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      {/* 3D AI Orb Container */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex-shrink-0 flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="absolute -bottom-2 px-3 py-1 rounded-full text-2xs font-semibold tracking-wider uppercase bg-[#12372A] text-[#FFFDF7] border border-[#2F7D62]/40 shadow-md">
          Live AI Engine
        </div>
      </div>

      {/* Interactive Queries & Live Response Preview */}
      <div className="flex-1 w-full flex flex-col gap-4">
        {/* Quick Action Pills */}
        <div className="flex flex-wrap gap-2">
          {PROMPT_PILLS.map((pill) => {
            const Icon = pill.icon
            const isCurrent = activeQuery === pill.query
            return (
              <button
                key={pill.text}
                type="button"
                onClick={() => handlePillClick(pill)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#12372A] text-[#FFFDF7] shadow-sm scale-105'
                    : 'bg-white text-[#17231D] border border-[#E8E2D5] hover:border-[#2F7D62] hover:bg-[#FFFDF7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#E89B5A]' : 'text-[#2F7D62]'}`} />
                <span>{pill.text}</span>
              </button>
            )
          })}
        </div>

        {/* Live Conversation Simulation Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-lg shadow-[#12372A]/5 space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#EFE9DC] text-[#12372A] flex items-center justify-center text-xs font-bold flex-shrink-0">
              Q
            </span>
            <p className="text-xs font-semibold text-[#17231D] pt-0.5">
              {activeQuery}
            </p>
          </div>

          <div className="flex items-start gap-2.5 bg-[#FFFDF7] p-3.5 rounded-xl border border-[#E8E2D5]/70">
            <div className="w-6 h-6 rounded-lg bg-[#12372A] text-[#E89B5A] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-[#17231D] leading-relaxed whitespace-pre-line font-mono sm:font-sans">
              {activeResponse}
            </div>
          </div>

          <div className="flex items-center justify-between text-2xs text-[#68756D] pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D62]" /> 99.4% factual accuracy across course material
            </span>
            <span className="font-semibold text-[#12372A]">Latency: 180ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIOrb
