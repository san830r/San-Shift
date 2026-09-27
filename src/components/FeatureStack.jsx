import { useEffect, useRef } from 'react'
import { useContent } from '../content/ContentContext'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import { playClickSound } from '../lib/soundFx'

export default function FeatureStack() {
  const { content } = useContent()
  const processData = content.creativeProcess || {
    heading: 'IDEA → CREATE → BUILD → GROW',
    subheading: 'A continuous cycle designed for rapid iteration, premium execution, and exponential brand scale.',
    steps: [
      { number: '01', title: 'IDEA', desc: 'Uncovering the strategic hook, visual direction, and digital opportunities.' },
      { number: '02', title: 'CREATE', desc: 'High-end asset creation, editorial video editing, motion design, and product packaging.' },
      { number: '03', title: 'BUILD', desc: 'Engineering lightning-fast responsive websites, digital funnels, and conversion architecture.' },
      { number: '04', title: 'GROW', desc: 'Scaling reach, audience retention, and consistent revenue across digital platforms.' },
    ],
  }

  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const section = sectionRef.current
    const cards = cardRefs.current
    const line = lineRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      // Animate connecting SVG path
      if (line) {
        const length = line.getTotalLength ? line.getTotalLength() : 800
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'center 40%',
            scrub: 0.6,
          },
        })
      }

      // Progressively reveal process cards
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-24 sm:py-32 lg:py-36 border-t border-black/5 dark:border-white/5"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-brand-blue/5 dark:bg-brand-blue/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 bg-brand-offwhite dark:bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/80 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
            CREATIVE PROCESS
          </span>

          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white">
            {processData.heading}
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-black/60 dark:text-white/60">
            {processData.subheading}
          </p>
        </div>

        {/* 4 Connected Floating Process Cards */}
        <div className="relative mt-16 sm:mt-24">
          {/* Desktop Connecting SVG Orbital/Progress Line */}
          <div className="pointer-events-none absolute top-1/2 left-0 right-0 hidden -translate-y-1/2 lg:block">
            <svg
              className="h-16 w-full text-brand-blue"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Background faint path */}
              <path
                d="M 50 30 C 250 5, 300 55, 500 30 C 700 5, 750 55, 950 30"
                stroke="rgba(0, 56, 255, 0.12)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              {/* Animated drawing path */}
              <path
                ref={lineRef}
                d="M 50 30 C 250 5, 300 55, 500 30 C 700 5, 750 55, 950 30"
                stroke="#0038ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {processData.steps.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                onClick={playClickSound}
                data-cursor={`STEP ${step.number}`}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/8 dark:border-white/10 bg-white/90 dark:bg-[#0c101c]/90 p-7 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-brand-blue/40 dark:hover:border-brand-blue hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(0,56,255,0.2)] cursor-pointer"
              >
                {/* Step indicator node */}
                <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/10">
                  <span className="font-mono text-2xl font-black text-black/25 dark:text-white/30 group-hover:text-brand-blue transition-colors">
                    {step.number}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-offwhite dark:bg-white/10 text-black dark:text-white text-xs font-black border border-black/5 dark:border-white/10 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm">
                    {i + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="mt-6">
                  <h3 className="font-display text-2xl font-black tracking-tight text-black dark:text-white group-hover:text-brand-blue transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/60 dark:text-white/60">
                    {step.desc}
                  </p>
                </div>

                {/* Hover arrow indicator */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-blue opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  <span>Phase {step.number}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
