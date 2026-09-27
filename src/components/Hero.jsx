import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import { playClickSound } from '../lib/soundFx'
import Hero3DScene from './Hero3DScene'

function MagneticButton({ href, onClick, className, children, cursor }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined

    const moveX = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const moveY = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      moveX(relX * 0.25)
      moveY(relY * 0.3)
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
    <a ref={ref} href={href} onClick={onClick} data-cursor={cursor} className={className}>
      {children}
    </a>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  const { content } = useContent()
  const { hero } = content

  const sectionRef = useRef(null)
  const badgeRef = useRef(null)
  const shiftRef = useRef(null)
  const standardRef = useRef(null)
  const underlineRef = useRef(null)
  const subtextRef = useRef(null)
  const ctaRef = useRef(null)
  const trustRef = useRef(null)
  const visualRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(badgeRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 })
      .fromTo(
        [shiftRef.current, standardRef.current],
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          clearProps: 'transform',
        },
        '-=0.3',
      )
      .fromTo(
        underlineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.65, ease: 'power2.out' },
        '-=0.2',
      )
      .fromTo(subtextRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
      .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
      .fromTo(trustRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
      .fromTo(visualRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.9 }, '-=0.7')

    return () => tl.kill()
  }, [])

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    playClickSound()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[auto] lg:min-h-[820px] flex-col justify-center overflow-hidden bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24"
    >
      {/* Luminous, colorful ambient gradient glows matching reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-1/4 h-[560px] w-[560px] rounded-full bg-gradient-to-tr from-[#0038ff]/30 via-cyan-400/25 to-blue-500/15 blur-[130px] animate-float-orb1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-1/6 h-[500px] w-[500px] rounded-full bg-purple-500/12 dark:bg-purple-500/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-10 h-72 w-72 rounded-full bg-amber-400/10 dark:bg-amber-400/12 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_25%,black,transparent)] opacity-40 dark:opacity-20"
      />

      {/* Main Container: Max 1400px, Generous Negative Space */}
      <div className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-12 my-auto">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[48%_52%] xl:grid-cols-[46%_54%] lg:gap-10 xl:gap-14">
          
          {/* ================= LEFT SIDE: HEADLINE & HIERARCHY ================= */}
          <div className="z-10 flex flex-col items-start max-w-xl text-left">
            {/* Small pill badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 rounded-2xl sm:rounded-full border border-black/10 dark:border-white/15 bg-brand-offwhite/90 dark:bg-white/10 px-3.5 py-1.5 sm:py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-black/70 dark:text-white/80 shadow-sm backdrop-blur-sm max-w-full"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue shadow-[0_0_6px_rgba(0,56,255,0.8)] animate-pulse" />
              <span className="break-words">{hero.badge || 'ALL CREATIVE & DIGITAL SOLUTIONS'}</span>
            </div>

            {/* Headline sits naturally and crisply on pure canvas */}
            <div className="mt-5 w-full text-left">
              <h1 className="font-display font-black leading-[1.04] tracking-[-0.015em] text-black dark:text-white select-none text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.5rem] text-left">
                <span className="block overflow-hidden py-1 -my-1 text-left">
                  <span ref={shiftRef} className="block text-slate-950 dark:text-white text-left">
                    SHIFT THE
                  </span>
                </span>
                <span className="relative block overflow-hidden pt-1 -mt-1 pb-4 sm:pb-5 text-left">
                  <span
                    ref={standardRef}
                    className="block bg-clip-text text-transparent animate-gradient-flow select-none text-left"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #0052ff 0%, #0091ff 25%, #00f0ff 50%, #0091ff 75%, #0052ff 100%)',
                      backgroundSize: '200% auto',
                    }}
                  >
                    STANDARD
                  </span>

                  {/* Yellow Marker Underline Accent */}
                  <svg
                    ref={underlineRef}
                    className="absolute bottom-0 left-0 h-3.5 sm:h-4 w-44 sm:w-56 md:w-68 lg:w-80 origin-left text-brand-yellow"
                    viewBox="0 0 280 20"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 14 C 60 5, 180 3, 277 11 C 210 16, 90 18, 12 17"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Supporting Copy */}
            <p
              ref={subtextRef}
              className="mt-5 max-w-md text-sm leading-relaxed text-black/65 dark:text-white/70 sm:text-base sm:leading-relaxed font-sans font-normal"
            >
              {hero.subtext ||
                'Creative tools. Digital solutions. Real growth. Everything you need to create, build and grow in the digital world.'}
            </p>

            {/* 2 CTA Buttons */}
            <div ref={ctaRef} className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <MagneticButton
                href="#services"
                onClick={scrollTo('services')}
                cursor="EXPLORE"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all hover:bg-brand-blue-dark hover:shadow-xl hover:shadow-brand-blue/40 active:scale-95"
              >
                <span>Explore Services</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-sans text-sm">
                  →
                </span>
              </MagneticButton>

              <MagneticButton
                href="/catalog"
                onClick={(e) => {
                  e.preventDefault()
                  playClickSound()
                  navigate('/catalog')
                }}
                cursor="CATALOG"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand-yellow hover:bg-brand-yellow-dark px-7 py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-brand-yellow/30 transition-all hover:shadow-xl hover:shadow-brand-yellow/40 active:scale-95 cursor-pointer"
              >
                <span>EXPLORE PRODUCTS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-sans text-sm">
                  →
                </span>
              </MagneticButton>
            </div>

            {/* Trust Strip */}
            <div
              ref={trustRef}
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-brand-yellow font-black">⚡</span>
                <span>Instant Digital Delivery</span>
              </div>
              <span className="text-black/30 dark:text-white/30">-</span>
              <div className="flex items-center gap-1.5">
                <span className="text-brand-blue font-black">🛡️</span>
                <span>Trusted by Creators</span>
              </div>
              <span className="text-black/30 dark:text-white/30">-</span>
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-500 font-black">♾️</span>
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: BALANCED 3D SCENE ================= */}
          <div ref={visualRef} className="relative z-10 w-full flex items-center justify-center lg:justify-end">
            <Hero3DScene />
          </div>
        </div>
      </div>
    </section>
  )
}
