import { useState, useEffect, useRef } from 'react'
import { useContent } from '../content/ContentContext'
import { SERVICE_ICONS } from './icons/ServiceIcons'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import { playClickSound } from '../lib/soundFx'

const FALLBACK_SERVICES = [
  {
    id: 'content',
    number: '01',
    title: 'Content Creation',
    iconKey: 'Content Creation',
    desc: 'Create engaging content for creators, brands and digital audiences.',
    subChips: ['Shorts & Reels', 'Audience Building', 'Viral Concepts', 'Creative Direction'],
  },
  {
    id: 'marketing',
    number: '02',
    title: 'Digital Marketing',
    iconKey: 'Digital Marketing',
    desc: 'Build reach, visibility and digital growth through strategic marketing.',
    subChips: ['Reach & Scale', 'Paid & Organic', 'Funnel Strategy', 'Campaign Growth'],
  },
  {
    id: 'editing',
    number: '03',
    title: 'Editing',
    iconKey: 'Editing',
    desc: 'Professional video, photo and creative editing for digital content.',
    subChips: ['Video Editing', 'Photo Editing', 'Motion Graphics', 'Sound Design'],
    highlightSubservices: true,
  },
  {
    id: 'products',
    number: '04',
    title: 'Digital Products',
    iconKey: 'Digital Products',
    desc: 'Create, market and sell valuable digital products and resources.',
    subChips: ['Asset Packs', 'Preset Libraries', 'Templates', 'Creator Toolkits'],
  },
  {
    id: 'growth',
    number: '05',
    title: 'Brand Growth',
    iconKey: 'Brand Growth',
    desc: 'Build stronger digital presence, audience visibility and brand growth.',
    subChips: ['Digital Presence', 'Audience Retention', 'Visual Authority', 'Brand Scaling'],
  },
]

const SERVICE_THEMES = {
  content: {
    name: 'Cyan Blue',
    rgb: '0, 102, 255',
    rgbSecondary: '0, 210, 255',
    borderBase: 'border-blue-500/40 dark:border-blue-400/40',
    borderHover: 'hover:border-blue-500 dark:hover:border-cyan-400',
    shadowBase: 'shadow-[0_4px_24px_rgba(0,102,255,0.08)]',
    shadowHover: 'hover:shadow-[0_20px_45px_rgba(0,102,255,0.18)]',
    titleHover: 'group-hover:text-blue-600 dark:group-hover:text-cyan-400',
    titleDefault: 'text-blue-600 dark:text-blue-400',
    iconBgHover: 'group-hover:bg-blue-500/15 group-hover:shadow-[0_0_20px_rgba(0,102,255,0.35)]',
    iconTextHover: 'group-hover:text-blue-600 dark:group-hover:text-cyan-400',
    pillActive: 'bg-blue-500/10 dark:bg-blue-400/15 text-blue-600 dark:text-cyan-300 border-blue-500/30 shadow-[0_0_8px_rgba(0,102,255,0.15)]',
    cornerAura: 'from-blue-600/35 via-cyan-400/20 to-transparent',
    arrowColor: 'text-blue-600 dark:text-cyan-400',
    highlightChips: ['Shorts & Reels', 'Audience Building'],
  },
  marketing: {
    name: 'Sunset Amber',
    rgb: '245, 158, 11',
    rgbSecondary: '251, 191, 36',
    borderBase: 'border-amber-500/25 dark:border-amber-400/25',
    borderHover: 'hover:border-amber-500 dark:hover:border-amber-400',
    shadowBase: 'shadow-[0_4px_20px_rgba(245,158,11,0.06)]',
    shadowHover: 'hover:shadow-[0_20px_45px_rgba(245,158,11,0.18)]',
    titleHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    titleDefault: 'text-black dark:text-white',
    iconBgHover: 'group-hover:bg-amber-500/15 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    iconTextHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    pillActive: 'bg-amber-500/10 dark:bg-amber-400/15 text-amber-600 dark:text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    cornerAura: 'from-amber-500/35 via-yellow-400/20 to-transparent',
    arrowColor: 'text-amber-600 dark:text-amber-400',
    highlightChips: ['Reach & Scale', 'Funnel Strategy'],
  },
  editing: {
    name: 'Neon Violet Purple',
    rgb: '139, 92, 246',
    rgbSecondary: '192, 132, 252',
    borderBase: 'border-purple-500/30 dark:border-purple-400/30',
    borderHover: 'hover:border-purple-500 dark:hover:border-purple-400',
    shadowBase: 'shadow-[0_4px_20px_rgba(139,92,246,0.06)]',
    shadowHover: 'hover:shadow-[0_20px_45px_rgba(139,92,246,0.18)]',
    titleHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    titleDefault: 'text-black dark:text-white',
    iconBgHover: 'group-hover:bg-purple-500/15 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]',
    iconTextHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    pillActive: 'bg-purple-500/10 dark:bg-purple-400/15 text-purple-600 dark:text-purple-300 border-purple-500/30 shadow-[0_0_8px_rgba(139,92,246,0.15)]',
    cornerAura: 'from-purple-600/35 via-violet-400/20 to-transparent',
    arrowColor: 'text-purple-600 dark:text-purple-400',
    highlightChips: ['Video Editing', 'Motion Graphics'],
  },
  products: {
    name: 'Cyber Mint Emerald',
    rgb: '16, 185, 129',
    rgbSecondary: '52, 211, 153',
    borderBase: 'border-emerald-500/25 dark:border-emerald-400/25',
    borderHover: 'hover:border-emerald-500 dark:hover:border-emerald-400',
    shadowBase: 'shadow-[0_4px_20px_rgba(16,185,129,0.06)]',
    shadowHover: 'hover:shadow-[0_20px_45px_rgba(16,185,129,0.18)]',
    titleHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    titleDefault: 'text-black dark:text-white',
    iconBgHover: 'group-hover:bg-emerald-500/15 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    iconTextHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    pillActive: 'bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    cornerAura: 'from-emerald-500/35 via-teal-400/20 to-transparent',
    arrowColor: 'text-emerald-600 dark:text-emerald-400',
    highlightChips: ['Asset Packs', 'Preset Libraries'],
  },
  growth: {
    name: 'Electric Rose Pink',
    rgb: '244, 63, 94',
    rgbSecondary: '251, 113, 133',
    borderBase: 'border-rose-500/25 dark:border-rose-400/25',
    borderHover: 'hover:border-rose-500 dark:hover:border-rose-400',
    shadowBase: 'shadow-[0_4px_20px_rgba(244,63,94,0.06)]',
    shadowHover: 'hover:shadow-[0_20px_45px_rgba(244,63,94,0.18)]',
    titleHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    titleDefault: 'text-black dark:text-white',
    iconBgHover: 'group-hover:bg-rose-500/15 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]',
    iconTextHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    pillActive: 'bg-rose-500/10 dark:bg-rose-400/15 text-rose-600 dark:text-rose-300 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
    cornerAura: 'from-rose-500/35 via-pink-400/20 to-transparent',
    arrowColor: 'text-rose-600 dark:text-rose-400',
    highlightChips: ['Digital Presence', 'Brand Scaling'],
  },
}

function ServiceCard({ item, index = 0 }) {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const Icon = SERVICE_ICONS[item.iconKey || item.title] || SERVICE_ICONS['Content Creation']

  const defaultKeys = ['content', 'marketing', 'editing', 'products', 'growth']
  const themeKey = item.id || defaultKeys[index % 5] || 'content'
  const theme = SERVICE_THEMES[themeKey] || SERVICE_THEMES.content

  const isFirst = index === 0 || item.id === 'content'

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCoords({ x, y })
    if (!isHovered) setIsHovered(true)

    if (prefersReducedMotion()) return
    const px = x / rect.width - 0.5
    const py = y / rect.height - 0.5

    gsap.to(card, {
      rotateX: -py * 10,
      rotateY: px * 10,
      translateY: -6,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (prefersReducedMotion()) return
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      translateY: 0,
      duration: 0.45,
      ease: 'power2.out',
    })
  }

  const handleClick = () => {
    playClickSound()
    const target = document.getElementById('estimator') || document.getElementById('contact')
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor="INQUIRE"
      className={`group relative flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border ${theme.borderBase} ${theme.shadowBase} ${theme.borderHover} ${theme.shadowHover} bg-white dark:bg-[#0c101c] p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 1. Dynamic Cursor Spotlight (Follows mouse cursor smoothly with gentle, tasteful glow - BEHIND text at z-0) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: isHovered
            ? `radial-gradient(340px circle at ${coords.x}px ${coords.y}px, rgba(${theme.rgb}, 0.16), rgba(${theme.rgbSecondary}, 0.05), transparent 70%)`
            : undefined,
        }}
      />

      {/* 2. Signature ambient top-left glow in each card's distinct color theme */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-gradient-to-br ${theme.cornerAura} blur-2xl z-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-80' : 'opacity-35'
        }`}
      />

      {/* Subtle corner light reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-transparent blur-xl transition-all duration-500 group-hover:bg-white/10 dark:group-hover:bg-white/5 z-0"
      />

      <div className="relative z-10">
        {/* Top bar: Number badge + Icon */}
        <div className="flex items-center justify-between">
          <span className={`font-mono text-xs font-black tracking-widest transition-colors ${
            isHovered ? theme.arrowColor : 'text-black/40 dark:text-white/40'
          }`}>
            {item.number || '01'} // CORE
          </span>
          <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] p-2 transition-all duration-300 group-hover:scale-110 ${theme.iconBgHover}`}>
            {Icon && (
              <Icon className={`h-7 w-7 drop-shadow-sm text-black dark:text-white transition-colors ${theme.iconTextHover}`} />
            )}
          </div>
        </div>

        {/* Service Title */}
        <h3 className={`mt-4 font-display text-lg sm:text-xl font-black uppercase tracking-tight leading-snug transition-colors ${
          isFirst && !isHovered ? theme.titleDefault : 'text-black dark:text-white'
        } ${theme.titleHover}`}>
          {item.title}
        </h3>

        {/* Service Description */}
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-black/60 dark:text-white/60">
          {item.desc}
        </p>

        {/* Sub-services / Capabilities Chips */}
        {item.subChips && item.subChips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-black/5 dark:border-white/10">
            {item.subChips.map((chip, idx) => {
              const isHighlight = theme.highlightChips.includes(chip)
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-tight transition-colors ${
                    isHighlight
                      ? `${theme.pillActive} font-extrabold`
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-black/70 dark:text-white/70 border border-black/5 dark:border-white/10'
                  }`}
                >
                  {chip}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Card Footer: Action Indicator */}
      <div className={`relative z-10 mt-5 flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 text-xs font-bold text-black/50 dark:text-white/50 ${theme.titleHover} transition-colors`}>
        <span className="uppercase tracking-wider text-[11px]">Inquire Capability</span>
        <span className={`transform font-sans text-sm transition-transform duration-300 group-hover:translate-x-1.5 ${theme.arrowColor}`}>
          →
        </span>
      </div>
    </div>
  )
}

export default function Services() {
  const sectionRef = useRef(null)
  const { content } = useContent()
  const servicesContent = content?.services || {}
  const rawItems = servicesContent?.items && servicesContent.items.length === 5
    ? servicesContent.items
    : FALLBACK_SERVICES

  // Ensure items have proper iconKey and fallbacks
  const items = rawItems.map((item, idx) => {
    const fallback = FALLBACK_SERVICES[idx] || FALLBACK_SERVICES[0]
    return {
      ...fallback,
      ...item,
      iconKey: item.iconKey || item.title || fallback.iconKey,
      subChips: item.subChips || fallback.subChips,
    }
  })

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const cards = sectionRef.current?.querySelectorAll('.service-card-item')
    if (!cards || cards.length === 0) return undefined

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const heading = servicesContent.heading || 'WHAT WE DO'
  const subheading = servicesContent.subheading || 'Five core capabilities. One creative direction.'

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative scroll-mt-20 bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-20 sm:py-28 lg:py-32 border-t border-black/5 dark:border-white/5"
    >
      {/* Ambient background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-blue/5 dark:bg-brand-blue/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 bg-brand-offwhite dark:bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/80 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shadow-[0_0_6px_#0038ff]" />
            OUR CAPABILITIES
          </span>

          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white leading-tight">
            {heading}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-black/60 dark:text-white/60 sm:text-lg">
            {subheading}
          </p>
        </div>

        {/* 5 Core Services: Balanced 3 + 2 layout on desktop, 1 or 2 column on mobile/tablet */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6">
          {items.map((item, idx) => {
            // Desktop 6-col grid layout:
            // First 3 items: each spans 2 cols (cols 1-2, 3-4, 5-6) -> Row 1 (3 items)
            // 4th item: starts at col 2, spans 2 cols (cols 2-3) -> Row 2 (centered)
            // 5th item: spans 2 cols (cols 4-5) -> Row 2 (centered)
            let colClasses = 'lg:col-span-2'
            if (idx === 3) {
              colClasses = 'lg:col-span-2 lg:col-start-2'
            } else if (idx === 4) {
              colClasses = 'md:col-span-2 md:max-w-md md:mx-auto md:w-full lg:col-span-2 lg:max-w-none'
            }

            return (
              <div key={item.id} className={`service-card-item flex flex-col ${colClasses}`}>
                <ServiceCard item={item} index={idx} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
