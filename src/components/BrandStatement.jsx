import { useEffect, useRef } from 'react'
import { useContent } from '../content/ContentContext'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import { playClickSound } from '../lib/soundFx'
import { openSmartWhatsAppModal } from './SmartWhatsAppModal'

export default function BrandStatement() {
  const { content } = useContent()
  const { brandStatement } = content
  const sectionRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.statement-reveal',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  // Magnetic button effect on CTA
  useEffect(() => {
    const el = buttonRef.current
    if (!el || prefersReducedMotion()) return undefined

    const moveX = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const moveY = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      moveX(relX * 0.3)
      moveY(relY * 0.35)
    }
    const reset = () => {
      moveX(0)
      moveY(0)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', reset)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', reset)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-24 sm:py-32 lg:py-40 border-t border-black/5 dark:border-white/5 text-center"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/8 dark:bg-brand-blue/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-brand-yellow/15 dark:bg-brand-yellow/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-8">
        <span className="statement-reveal inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-brand-offwhite dark:bg-white/10 px-3.5 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/80 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-blue" />
          MANIFESTO
        </span>

        <h2 className="statement-reveal mt-6 sm:mt-8 font-display text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-black dark:text-white uppercase">
          {brandStatement.heading ? (
            brandStatement.heading.split('\n').map((line, idx, arr) => (
              <span key={idx} className="block">
                {idx === Math.floor(arr.length / 2) ? (
                  <span className="text-brand-blue">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))
          ) : (
            <>
              WE CREATE.
              <br />
              <span className="text-brand-blue">WE BUILD.</span>
              <br />
              WE GROW.
            </>
          )}
        </h2>

        <p className="statement-reveal mx-auto mt-5 sm:mt-8 max-w-2xl text-sm leading-relaxed text-black/65 dark:text-white/70 xs:text-base sm:text-xl font-sans">
          {brandStatement.text ||
            'From creative execution to digital growth, SAN SHIFT helps creators, brands and businesses turn ideas into digital results.'}
        </p>

        <div className="statement-reveal mt-8 sm:mt-10">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => {
              playClickSound()
              openSmartWhatsAppModal('retainer')
            }}
            data-cursor="BUILD"
            className="group inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-full bg-brand-blue px-7 py-3.5 sm:px-10 sm:py-5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-brand-blue/30 transition-all hover:bg-brand-blue-dark hover:shadow-2xl hover:shadow-brand-blue/40 active:scale-95"
          >
            <span>{brandStatement.cta || "Let's Build Together"}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-sans text-sm sm:text-base">
              ⚡
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
