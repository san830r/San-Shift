import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/gsapSetup'

export default function AntiGravityParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || typeof window === 'undefined') return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Mouse coordinates
    let mouse = { x: -1000, y: -1000, radius: 140 }
    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Create Anti-Gravity particles
    const particleCount = Math.min(36, Math.floor(window.innerWidth / 35))
    const particles = []

    const COLORS = [
      'rgba(0, 56, 255, 0.45)', // Brand Blue
      'rgba(0, 56, 255, 0.25)', // Soft Blue
      'rgba(255, 212, 0, 0.45)', // Brand Yellow
      'rgba(0, 56, 255, 0.65)', // Bright Electric Blue
    ]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4.5 + 1.5,
        speedY: -(Math.random() * 0.45 + 0.15), // Upward anti-gravity drift
        speedX: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        shape: Math.random() > 0.4 ? 'circle' : 'poly', // Mixed spheres & geometric chips
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        // Anti-gravity upward movement
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotationSpeed

        // Wrap around borders
        if (p.y < -20) p.y = height + 20
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20

        // Mouse magnetic avoidance
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius
          p.x -= (dx / dist) * force * 3.5
          p.y -= (dy / dist) * force * 3.5
        }

        // Draw particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Floating geometric diamond/chip
          ctx.beginPath()
          ctx.rect(-p.size, -p.size, p.size * 2, p.size * 2)
          ctx.fill()
        }

        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] opacity-75 dark:opacity-85"
      aria-hidden="true"
    />
  )
}
