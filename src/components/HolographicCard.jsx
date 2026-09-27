import { useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/gsapSetup'

export default function HolographicCard({ children, className = '', ...props }) {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    if (prefersReducedMotion()) return
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setCoords({ x, y, opacity: 0.75 })
  }

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Iridescent Holographic Foil Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 mix-blend-overlay"
        style={{
          opacity: coords.opacity,
          background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.7) 0%, rgba(0,56,255,0.3) 30%, rgba(255,212,0,0.3) 60%, transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}
