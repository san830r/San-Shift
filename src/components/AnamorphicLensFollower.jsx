import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'

export default function AnamorphicLensFollower() {
  const flareRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || typeof window === 'undefined') return undefined
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    const el = flareRef.current
    if (!el) return undefined

    const moveX = gsap.quickTo(el, 'x', { duration: 0.85, ease: 'power2.out' })
    const moveY = gsap.quickTo(el, 'y', { duration: 0.85, ease: 'power2.out' })

    const handleMouseMove = (e) => {
      moveX(e.clientX)
      moveY(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null
  }

  return (
    <div
      ref={flareRef}
      className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-[1] transition-opacity duration-700"
      aria-hidden="true"
    >
      {/* Ultra-soft ambient aura: serene sky blue + subtle gold glow */}
      <div className="h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] rounded-full bg-gradient-to-tr from-brand-blue/6 via-sky-400/5 to-brand-yellow/6 blur-[95px] dark:from-brand-blue/12 dark:via-sky-500/8 dark:to-brand-yellow/8" />
    </div>
  )
}
