import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsapSetup'

export default function KineticScrollSkew({ children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || typeof window === 'undefined') return undefined
    const el = containerRef.current
    if (!el) return undefined

    const skewSetter = gsap.quickSetter(el, 'skewY', 'deg')
    const clamp = gsap.utils.clamp(-3, 3)

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity()
        const skew = clamp(velocity / -350)
        skewSetter(skew)

        gsap.to(el, {
          skewY: 0,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <div ref={containerRef} className="origin-center will-change-transform">
      {children}
    </div>
  )
}
