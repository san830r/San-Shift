import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'

/**
 * Custom hook to activate high-end 3D Flip-In and Silk Scroll entrance animations
 * across container elements, inspired by Awwwards-winning streetwear & luxury editorial sites.
 *
 * Supported helper classes within containerRef:
 * - .reveal-3d      : 3D Flip-In (rotateX: -32deg, transformPerspective: 1000px, y: 45px)
 * - .reveal-silk    : Silk entrance (y: 60px, skewY: 3deg, power4.out)
 * - .reveal-mask    : Masked line slide-up (y: 110% -> 0%)
 * - .reveal-scale   : Subtle cinematic depth zoom (scale: 0.92 -> 1)
 */
export function use3DScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const container = containerRef?.current
    if (!container) return undefined

    const ctx = gsap.context(() => {
      // 1. 3D Flip-In Animation (Prompt 07 DRIFT Style)
      const flipElements = container.querySelectorAll('.reveal-3d')
      if (flipElements.length > 0) {
        gsap.fromTo(
          flipElements,
          {
            opacity: 0,
            y: 45,
            rotationX: -30,
            transformPerspective: 1000,
            transformOrigin: '50% 0%',
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.95,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 2. Silk Entrance Animation (Prompt 08 AURELLE Style)
      const silkElements = container.querySelectorAll('.reveal-silk')
      if (silkElements.length > 0) {
        gsap.fromTo(
          silkElements,
          {
            opacity: 0,
            y: 60,
            skewY: 3,
            transformOrigin: '0% 50%',
          },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1.1,
            stagger: 0.09,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 3. Masked Word / Line Reveals (y: 110% -> 0%)
      const maskElements = container.querySelectorAll('.reveal-mask')
      if (maskElements.length > 0) {
        gsap.fromTo(
          maskElements,
          {
            y: '110%',
            opacity: 0,
          },
          {
            y: '0%',
            opacity: 1,
            duration: 1.0,
            stagger: 0.07,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 4. Subtle Cinematic Scale
      const scaleElements = container.querySelectorAll('.reveal-scale')
      if (scaleElements.length > 0) {
        gsap.fromTo(
          scaleElements,
          {
            scale: 0.92,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, container)

    return () => ctx.revert()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

export default use3DScrollReveal
