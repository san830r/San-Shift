import { useEffect, useState, useCallback } from 'react'

export default function ClickShockwave() {
  const [ripples, setRipples] = useState([])

  const addRipple = useCallback((e) => {
    // Only spawn on left click and interactive elements or canvas
    if (e.button !== 0) return
    const id = Date.now() + Math.random()
    const x = e.clientX
    const y = e.clientY

    setRipples((prev) => [
      ...prev.slice(-6), // Limit max concurrent ripples
      { id, x, y }
    ])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 700)
  }, [])

  useEffect(() => {
    window.addEventListener('pointerdown', addRipple)
    return () => window.removeEventListener('pointerdown', addRipple)
  }, [addRipple])

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden" aria-hidden="true">
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: r.x, top: r.y }}
        >
          {/* Main Shockwave Ring */}
          <div className="h-4 w-4 rounded-full border-2 border-brand-blue animate-[shockwave_0.65s_cubic-bezier(0.1,0.8,0.2,1)_forwards] shadow-[0_0_15px_rgba(0,56,255,0.7)]" />
          
          {/* Micro Secondary Golden Glow Ring */}
          <div className="absolute inset-0 h-4 w-4 rounded-full border border-brand-yellow/80 animate-[shockwave-inner_0.45s_ease-out_forwards]" />

          {/* Micro Geometric Particle Sparks */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-brand-yellow"
              style={{
                transform: `rotate(${angle}deg) translate(0px, 0px)`,
                animation: `spark-drift 0.5s ease-out forwards`,
                animationDelay: `${i * 15}ms`,
                '--angle': `${angle}deg`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
