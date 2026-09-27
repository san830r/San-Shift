import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsapSetup'

let lenisInstance = null

/**
 * Initializes studio-grade Lenis momentum smooth scrolling synced with GSAP ScrollTrigger.
 * Optimized for 60fps on mobile and desktop, clamps on prefers-reduced-motion.
 */
export function initLenis() {
  if (typeof window === 'undefined') return null
  if (prefersReducedMotion()) return null
  if (lenisInstance) return lenisInstance

  try {
    lenisInstance = new Lenis({
      lerp: 0.085, // Silky smooth deceleration
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    })

    // Sync Lenis scroll events to GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update)

    // Drive Lenis requestAnimationFrame directly from GSAP ticker
    const rafCallback = (time) => {
      lenisInstance?.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    // Store reference on window for navigation and modal coordination
    window.__lenis = lenisInstance
    window.__lenisRafCallback = rafCallback

    return lenisInstance
  } catch (err) {
    console.warn('[Lenis] Smooth scroll fallback to native:', err)
    return null
  }
}

/**
 * Returns active Lenis instance or null
 */
export function getLenis() {
  return lenisInstance || (typeof window !== 'undefined' ? window.__lenis : null)
}

/**
 * Pauses Lenis smooth scrolling (e.g., when a modal or lightbox is opened)
 */
export function stopLenis() {
  const instance = getLenis()
  instance?.stop()
}

/**
 * Resumes Lenis smooth scrolling
 */
export function startLenis() {
  const instance = getLenis()
  instance?.start()
}

/**
 * Smoothly scrolls to target element or top of page
 */
export function scrollToTarget(target, options = {}) {
  const instance = getLenis()
  if (instance) {
    instance.scrollTo(target, {
      offset: options.offset ?? 0,
      duration: options.duration ?? 1.2,
      immediate: options.immediate ?? false,
      easing: options.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
    })
  } else if (typeof window !== 'undefined') {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options.immediate ? 'auto' : 'smooth' })
    } else if (typeof target === 'string') {
      const el = document.querySelector(target)
      el?.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth' })
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth' })
    }
  }
}

/**
 * Cleans up Lenis instance
 */
export function destroyLenis() {
  if (lenisInstance) {
    if (window.__lenisRafCallback) {
      gsap.ticker.remove(window.__lenisRafCallback)
      window.__lenisRafCallback = null
    }
    lenisInstance.destroy()
    lenisInstance = null
    if (typeof window !== 'undefined') window.__lenis = null
  }
}
