import { useEffect, useRef } from 'react'
import logoMark from '../assets/logo-mark.png'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import { playClickSound } from '../lib/soundFx'
import { openSmartWhatsAppModal } from './SmartWhatsAppModal'

export default function GrowthShowcase() {
  const containerRef = useRef(null)
  const stackRef = useRef(null)
  const cubeRef = useRef(null)
  const yellowBtnRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const container = containerRef.current
    if (!container) return undefined

    const items = container.querySelectorAll('[data-depth]')
    const movers = Array.from(items).map((el) => {
      const depth = parseFloat(el.dataset.depth) || 0.4
      return {
        el,
        depth,
        x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
      }
    })

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5

      movers.forEach(({ x, y, depth }) => {
        x(nx * depth * 50)
        y(ny * depth * 50)
      })
    }

    const handleMouseLeave = () => {
      movers.forEach(({ x, y }) => {
        x(0)
        y(0)
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-20 sm:py-28 lg:py-36 border-t border-black/5 dark:border-white/5"
      style={{ perspective: '1200px' }}
    >
      {/* Background glow and dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/8 dark:bg-brand-blue/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <div className="relative mx-auto flex min-h-[420px] xs:min-h-[460px] sm:min-h-[520px] max-w-3xl items-center justify-center">
          {/* Note Left: TURN IDEAS INTO INCOME */}
          <div
            data-depth="0.6"
            className="pointer-events-none absolute left-1 sm:left-8 top-4 sm:top-14 z-20 animate-float-slow text-left hidden xs:block"
          >
            <div className="font-handwriting text-lg sm:text-2xl font-bold uppercase tracking-wider text-black/80 dark:text-white/80 leading-none rotate-[-12deg]">
              TURN
              <br />
              IDEAS INTO
              <br />
              INCOME
            </div>
            {/* Hand-drawn arrow pointing down-right toward cards */}
            <svg
              className="mt-1 h-8 sm:h-12 w-10 sm:w-14 text-black/60 dark:text-white/60 rotate-[-5deg]"
              viewBox="0 0 60 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 10 Q 25 35, 48 38 M 38 32 L 48 38 L 46 26" />
            </svg>
          </div>

          {/* Note Right: CREATE BUILD SELL GROW in oval sketch */}
          <div
            data-depth="0.5"
            className="pointer-events-none absolute right-1 sm:right-10 top-4 sm:top-10 z-20 animate-float hidden xs:block"
          >
            <div className="relative flex items-center justify-center p-3 sm:p-5 rotate-[8deg]">
              {/* Hand-drawn sketched SVG oval border */}
              <svg
                className="absolute inset-0 h-full w-full text-black/35 dark:text-white/35"
                viewBox="0 0 160 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              >
                <ellipse cx="80" cy="50" rx="72" ry="42" />
              </svg>
              <div className="text-center font-handwriting text-xs sm:text-base font-bold uppercase tracking-wider text-black/75 dark:text-white/80 leading-tight">
                CREATE
                <br />
                BUILD
                <br />
                SELL
                <br />
                GROW
              </div>
            </div>
          </div>

          {/* ---------------- CENTERPIECE: TILTED CARD STACK ---------------- */}
          <div
            ref={stackRef}
            data-depth="0.9"
            className="relative z-10 w-[240px] xs:w-[280px] sm:w-[340px] md:w-[380px] preserve-3d animate-float"
            style={{
              transform: 'rotateY(-10deg) rotateX(14deg) rotateZ(-3deg)',
            }}
          >
            {/* Background layered fanned card 2 */}
            <div
              className="absolute inset-0 rounded-3xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 shadow-lg"
              style={{ transform: 'translate(10px, 10px) rotate(6deg)' }}
            />
            {/* Background layered fanned card 1 */}
            <div
              className="absolute inset-0 rounded-3xl border border-black/5 dark:border-white/5 bg-white/80 dark:bg-white/10 shadow-xl"
              style={{ transform: 'translate(5px, 5px) rotate(3deg)' }}
            />

            {/* Front Card */}
            <div className="relative rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0c101c]/95 p-6 xs:p-8 sm:p-12 text-center shadow-[0_25px_60px_-15px_rgba(0,56,255,0.2),0_10px_20px_rgba(0,0,0,0.05)] backdrop-blur-xl">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-black/40 dark:text-white/40">
                SAN SHIFT ECOSYSTEM
              </span>

              <h3 className="mt-3 sm:mt-4 font-display text-xl xs:text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
                YOUR
                <br />
                DIGITAL
                <br />
                GROWTH
                <br />
                PARTNER
              </h3>

              {/* Pure Blue Accent Underline */}
              <div className="mx-auto mt-4 sm:mt-5 h-1 w-12 sm:w-14 rounded-full bg-brand-blue shadow-[0_0_12px_rgba(0,56,255,0.8)]" />
            </div>
          </div>

          {/* Floating Yellow Action Circle Button */}
          <div
            ref={yellowBtnRef}
            data-depth="1.2"
            className="absolute right-3 sm:right-20 bottom-10 sm:bottom-20 z-30 animate-float-slow"
          >
            <button
              type="button"
              onClick={() => {
                playClickSound()
                openSmartWhatsAppModal('growth')
              }}
              data-cursor="GROW"
              className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-brand-yellow text-black font-black shadow-[0_15px_30px_-5px_rgba(255,214,0,0.5)] transition-all hover:scale-110 active:scale-95 group"
              aria-label="Connect with our growth team on WhatsApp"
            >
              <span className="text-lg sm:text-2xl transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ⚡
              </span>
            </button>
          </div>

          {/* Floating 3D Dark Cube with Glowing S> Logo */}
          <div
            ref={cubeRef}
            data-depth="1.1"
            className="absolute left-2 sm:left-14 bottom-4 sm:bottom-12 z-20 w-20 sm:w-32 animate-float"
            style={{
              transform: 'rotateY(25deg) rotateX(-15deg) rotateZ(8deg)',
            }}
          >
            <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1b1e26] to-[#08090c] p-3 sm:p-4 shadow-[0_20px_45px_-10px_rgba(0,56,255,0.45),0_10px_20px_rgba(0,0,0,0.4)] border border-white/20 flex items-center justify-center">
              <div className="absolute inset-1.5 sm:inset-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-blue/30 via-transparent to-brand-yellow/10" />
              <img
                src={logoMark}
                alt="SAN SHIFT"
                className="relative h-10 w-10 sm:h-16 sm:w-16 object-contain filter drop-shadow-[0_0_14px_rgba(0,56,255,0.9)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
