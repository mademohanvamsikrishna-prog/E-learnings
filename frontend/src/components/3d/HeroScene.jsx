import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function HeroScene({ scrollProgress = 0, className = '' }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const frameIdRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // ── Setup Scene, Camera, Renderer ───────────────────────────────────────
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ── Lighting ────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xfffdf7, 0.85)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.0)
    keyLight.position.set(6, 8, 7)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x2f7d62, 1.2)
    fillLight.position.set(-6, -4, 4)
    scene.add(fillLight)

    const accentPointLight = new THREE.PointLight(0xe89b5a, 2.2, 15)
    accentPointLight.position.set(2.5, 1.5, 3)
    scene.add(accentPointLight)

    // ── Materials ───────────────────────────────────────────────────────────
    const forestMat = new THREE.MeshStandardMaterial({
      color: 0x12372a,
      roughness: 0.35,
      metalness: 0.2,
    })

    const sageMat = new THREE.MeshStandardMaterial({
      color: 0x2f7d62,
      roughness: 0.4,
      metalness: 0.15,
    })

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe89b5a,
      roughness: 0.25,
      metalness: 0.85,
    })

    const creamMat = new THREE.MeshStandardMaterial({
      color: 0xfffdf7,
      roughness: 0.6,
      metalness: 0.05,
    })

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x2f7d62,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })

    // ── 3D Objects Group ────────────────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    // 1. Floating Hardcover Book (Left side)
    const bookGroup = new THREE.Group()
    const bookCoverGeo = new THREE.BoxGeometry(1.6, 2.2, 0.15)
    const bookCover = new THREE.Mesh(bookCoverGeo, forestMat)
    const bookPagesGeo = new THREE.BoxGeometry(1.5, 2.1, 0.28)
    const bookPages = new THREE.Mesh(bookPagesGeo, creamMat)
    bookPages.position.set(0.04, 0, 0.15)
    const bookGoldGeo = new THREE.BoxGeometry(0.08, 2.22, 0.46)
    const bookGoldRibbon = new THREE.Mesh(bookGoldGeo, goldMat)
    bookGoldRibbon.position.set(-0.76, 0, 0.15)
    bookGroup.add(bookCover, bookPages, bookGoldRibbon)
    bookGroup.position.set(-3.5, 1.2, 0.5)
    bookGroup.rotation.set(0.3, 0.45, -0.2)
    group.add(bookGroup)

    // 2. Modern Floating Laptop / Tablet (Right side)
    const laptopGroup = new THREE.Group()
    const laptopBaseGeo = new THREE.BoxGeometry(2.2, 0.08, 1.5)
    const laptopBase = new THREE.Mesh(laptopBaseGeo, sageMat)
    const laptopScreenGeo = new THREE.BoxGeometry(2.2, 1.4, 0.06)
    const laptopScreen = new THREE.Mesh(laptopScreenGeo, forestMat)
    laptopScreen.position.set(0, 0.7, -0.75)
    laptopScreen.rotation.x = -0.2
    const screenDisplayGeo = new THREE.PlaneGeometry(2.0, 1.2)
    const screenDisplayMat = new THREE.MeshBasicMaterial({
      color: 0xfffdf7,
      transparent: true,
      opacity: 0.85,
    })
    const screenDisplay = new THREE.Mesh(screenDisplayGeo, screenDisplayMat)
    screenDisplay.position.set(0, 0.71, -0.71)
    screenDisplay.rotation.x = -0.2
    laptopGroup.add(laptopBase, laptopScreen, screenDisplay)
    laptopGroup.position.set(3.4, -0.9, 0.8)
    laptopGroup.rotation.set(-0.15, -0.4, 0.1)
    group.add(laptopGroup)

    // 3. Floating Graduation Cap / Mortarboard (Top right)
    const capGroup = new THREE.Group()
    const capTopGeo = new THREE.BoxGeometry(1.5, 0.08, 1.5)
    const capTop = new THREE.Mesh(capTopGeo, forestMat)
    capTop.rotation.y = Math.PI / 4
    const capSkullGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.5, 16)
    const capSkull = new THREE.Mesh(capSkullGeo, forestMat)
    capSkull.position.y = -0.28
    const tasselGeo = new THREE.SphereGeometry(0.08, 8, 8)
    const tassel = new THREE.Mesh(tasselGeo, goldMat)
    tassel.position.set(0, 0.07, 0)
    capGroup.add(capTop, capSkull, tassel)
    capGroup.position.set(3.2, 2.2, -0.8)
    capGroup.rotation.set(0.25, 0.35, -0.15)
    group.add(capGroup)

    // 4. Central Intelligent AI Orb (Center-depth)
    const orbGroup = new THREE.Group()
    const innerOrbGeo = new THREE.SphereGeometry(0.7, 32, 32)
    const innerOrbMat = new THREE.MeshStandardMaterial({
      color: 0x2f7d62,
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0x12372a,
      emissiveIntensity: 0.4,
    })
    const innerOrb = new THREE.Mesh(innerOrbGeo, innerOrbMat)
    const outerHaloGeo = new THREE.IcosahedronGeometry(0.95, 1)
    const outerHalo = new THREE.Mesh(outerHaloGeo, wireframeMat)
    const ringGeo = new THREE.TorusGeometry(1.2, 0.03, 16, 64)
    const ring = new THREE.Mesh(ringGeo, goldMat)
    ring.rotation.x = Math.PI / 3
    orbGroup.add(innerOrb, outerHalo, ring)
    orbGroup.position.set(0.2, -1.8, 1.2)
    group.add(orbGroup)

    // 5. Floating Modular Knowledge Cubes
    const cubes = []
    const cubeCount = 6
    const cubeMatPalette = [sageMat, goldMat, creamMat, forestMat]
    for (let i = 0; i < cubeCount; i++) {
      const size = 0.4 + Math.random() * 0.35
      const cubeGeo = new THREE.BoxGeometry(size, size, size)
      const mat = cubeMatPalette[i % cubeMatPalette.length]
      const cube = new THREE.Mesh(cubeGeo, mat)

      // Distribute in pleasant surrounding coordinates
      const angle = (i / cubeCount) * Math.PI * 2
      const radius = 3.6 + Math.random() * 1.5
      cube.position.set(
        Math.cos(angle) * radius + (Math.random() - 0.5),
        Math.sin(angle) * 2.2 + (Math.random() - 0.5),
        (Math.random() - 0.5) * 3
      )
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      group.add(cube)
      cubes.push({ mesh: cube, speedX: 0.005 + Math.random() * 0.008, speedY: 0.004 + Math.random() * 0.007 })
    }

    // 6. Knowledge Particle Field (Golden & Sage stardust)
    const particleCount = 240
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 18
      particlePositions[i + 1] = (Math.random() - 0.5) * 12
      particlePositions[i + 2] = (Math.random() - 0.5) * 10
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xe89b5a,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // ── Mouse Interaction & Parallax ─────────────────────────────────────────
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // ── Resize Listener ─────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // ── Animation Loop ──────────────────────────────────────────────────────
    const startTime = performance.now()

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)
      const elapsedTime = (performance.now() - startTime) * 0.001

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.04
      targetY += (mouseY - targetY) * 0.04

      // Subtle float on book
      bookGroup.position.y = 1.2 + Math.sin(elapsedTime * 1.1) * 0.15
      bookGroup.rotation.y = 0.45 + Math.cos(elapsedTime * 0.8) * 0.08
      bookGroup.rotation.x = 0.3 + Math.sin(elapsedTime * 0.6) * 0.05

      // Subtle float on laptop
      laptopGroup.position.y = -0.9 + Math.sin(elapsedTime * 0.9 + 1) * 0.12
      laptopGroup.rotation.y = -0.4 + Math.sin(elapsedTime * 0.7) * 0.06

      // Cap float & spin
      capGroup.position.y = 2.2 + Math.cos(elapsedTime * 1.0) * 0.12
      capGroup.rotation.y += 0.004

      // AI Orb gentle rotation and pulse
      outerHalo.rotation.x += 0.006
      outerHalo.rotation.y += 0.008
      ring.rotation.z += 0.01
      const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.06
      innerOrb.scale.set(pulse, pulse, pulse)

      // Rotate surrounding knowledge cubes
      cubes.forEach((item) => {
        item.mesh.rotation.x += item.speedX
        item.mesh.rotation.y += item.speedY
      })

      // Particle system slow sway
      particleSystem.rotation.y = elapsedTime * 0.02
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05

      // Parallax camera displacement
      camera.position.x = targetX * 0.6
      camera.position.y = targetY * 0.4

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)

      // Dispose Three.js memory cleanly
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // ── Scroll-driven Camera and Object Convergence Update ────────────────────
  useEffect(() => {
    if (!sceneRef.current) return
    const clamped = Math.min(Math.max(scrollProgress, 0), 1)

    // Smoothly fly camera forward slightly as scroll advances
    const cam = sceneRef.current.children.find((c) => c.isCamera)
    if (cam) {
      cam.position.z = 9 - clamped * 2.2
    }
  }, [scrollProgress])

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{ willChange: 'transform' }}
    />
  )
}

export default HeroScene
