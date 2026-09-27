import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import QuickBriefModal from './QuickBriefModal'
import DirectCheckoutModal from './DirectCheckoutModal'
import { useContent } from '../content/ContentContext'

const SHOWCASE_CARDS = [
  {
    id: 1,
    title: 'Viral Reels & Shorts',
    subtitle: 'Get Millions of Views & Followers',
    category: 'CONTENT CREATION',
    metric: 'VIRAL HOOKS',
    accent: 'from-blue-600 via-indigo-600 to-cyan-500',
    icon: '📱',
    desc: 'High-energy 30-60 second vertical videos with animated subtitles, trending sound effects, and psychology-backed hooks that blow up your reach on Instagram & YouTube.',
    bullets: ['Dynamic Subtitles & Emojis', 'Trending Audio & Studio SFX', '24-48h Express Delivery'],
    serviceKey: 'Content Creation',
    ctaText: 'Order Viral Reels →',
  },
  {
    id: 2,
    title: 'Paid Ads That Bring Sales',
    subtitle: 'Convert Viewers Into Paying Customers',
    category: 'DIGITAL MARKETING',
    metric: '4X - 6X ROAS',
    accent: 'from-emerald-500 via-teal-600 to-blue-700',
    icon: '🛍️',
    desc: 'High-converting video ads engineered specifically for Meta (Facebook & Instagram) and Google that stop the scroll, lower your ad costs, and scale your revenue.',
    bullets: ['Thumb-Stopping Video Hooks', 'Clear Call-To-Actions', 'Full Ad Funnel Retargeting'],
    serviceKey: 'Digital Marketing',
    ctaText: 'Launch Video Ads →',
  },
  {
    id: 3,
    title: 'YouTube & Podcast Videos',
    subtitle: 'Keep Viewers Hooked Till The End',
    category: 'VIDEO EDITING',
    metric: 'HIGH RETENTION',
    accent: 'from-amber-500 via-rose-600 to-purple-800',
    icon: '🎬',
    desc: 'Professional full-length YouTube and podcast video editing with smooth B-rolls, crystal-clear studio audio cleaning, custom sound design, and engaging pacing.',
    bullets: ['Cinema-Grade Audio Cleaning', 'Dynamic B-Roll & Visuals', 'Click-Worthy Packaging'],
    serviceKey: 'Editing',
    ctaText: 'Edit My Video →',
  },
  {
    id: 4,
    title: "World's Biggest Editing Pack",
    subtitle: '55 Million+ Creative Assets (Lifetime)',
    category: 'DIGITAL PRODUCT',
    metric: '₹99 ONLY',
    accent: 'from-purple-600 via-pink-600 to-amber-500',
    icon: '📦',
    desc: 'Instant lifetime Google Drive access to 4,500+ Cinematic LUTs, 10,000+ Studio Sound FX, Transitions, Premiere Pro, After Effects, and Canva templates.',
    bullets: ['Instant Cloud Drive Download', '100% Commercial Lifetime License', 'All Software Supported'],
    isProduct: true,
    ctaText: 'Get The Bundle (₹99) →',
  },
  {
    id: 5,
    title: 'Complete Brand Growth Engine',
    subtitle: 'Full-Service Social Media & Video Partner',
    category: 'BRAND SCALING',
    metric: 'ALL-IN-ONE',
    accent: 'from-cyan-500 via-blue-600 to-slate-900',
    icon: '🚀',
    desc: 'We handle your entire content calendar, daily viral video production, graphic design, and social media advertising so you can focus 100% on running your business.',
    bullets: ['Monthly Video & Post Calendar', 'Dedicated Video Editor & Strategist', 'End-to-End Business Growth'],
    serviceKey: 'Brand Growth',
    ctaText: 'Partner With Us →',
  },
]

export default function Curved3DCarousel() {
  const { content } = useContent()
  const showcaseData = content.growthShowcase || {}
  const cards = showcaseData.cards || SHOWCASE_CARDS
  const badge = showcaseData.badge || 'WHAT WE DO FOR YOU'
  const heading = showcaseData.heading || 'EVERYTHING YOUR BRAND'
  const headingHighlight = showcaseData.headingHighlight || 'NEEDS TO GROW.'
  const subtext =
    showcaseData.subtext ||
    'No complicated jargon. Clear, high-impact services designed to get you views, followers, customers, and sales.'

  const product =
    content.products?.find((p) => p.id === content.site.featuredProductId) ?? content.products?.[0]

  const [activeIndex, setActiveIndex] = useState(0) // Default to Reels
  const [dragStartX, setDragStartX] = useState(null)
  const [briefOpen, setBriefOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('Content Creation')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const containerRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handlePrev = useCallback(() => {
    playClickSound()
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1))
  }, [cards.length])

  const handleNext = useCallback(() => {
    playClickSound()
    setActiveIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0))
  }, [cards.length])

  const handleTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (dragStartX === null) return
    const diff = e.changedTouches[0].clientX - dragStartX
    if (diff > 45) handlePrev()
    else if (diff < -45) handleNext()
    setDragStartX(null)
  }

  const handleCardAction = (card) => {
    if (card.isProduct) {
      playClickSound()
      setCheckoutOpen(true)
    } else {
      playChimeSound()
      setSelectedService(card.serviceKey)
      setBriefOpen(true)
    }
  }

  return (
    <section className="relative py-20 sm:py-28 bg-[#060810] text-white overflow-hidden border-t border-white/10">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[600px] rounded-full bg-brand-blue/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12 text-center">
        {/* Simple & Audience-Friendly Header */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3.5 py-1 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-brand-yellow">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow animate-pulse" />
            <span>{badge}</span>
          </div>

          <h2 className="mt-3 sm:mt-4 font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            {heading} <br />
            <span className="text-brand-blue">{headingHighlight}</span>
          </h2>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-white/65 max-w-xl mx-auto font-sans leading-relaxed">
            {subtext}
          </p>
        </div>

        {/* Quick Category Navigation Pills (Super Easy For Audience To Browse) */}
        <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {cards.map((card, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={card.id || idx}
                type="button"
                onClick={() => {
                  playClickSound()
                  setActiveIndex(idx)
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span>{card.icon}</span>
                <span>{card.title.split(' ')[0]} {card.title.split(' ')[1] || ''}</span>
              </button>
            )
          })}
        </div>

        {/* 3D Perspective Curved Carousel Viewport */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative mx-auto h-[440px] sm:h-[480px] w-full max-w-4xl flex items-center justify-center perspective-[1200px] select-none overflow-hidden sm:overflow-visible"
        >
          {cards.map((card, idx) => {
            const offset = idx - activeIndex
            const isCenter = offset === 0
            const absOffset = Math.abs(offset)

            // Calculate 3D cylindrical transform values with responsive adjustments
            const rotateY = offset * (isMobile ? 18 : 22)
            const translateX = offset * (isMobile ? 115 : 190)
            const translateZ = -absOffset * (isMobile ? 60 : 95)
            const opacity = isCenter ? 1 : isMobile ? (absOffset === 1 ? 0.35 : 0) : Math.max(0.15, 1 - absOffset * 0.35)
            const scale = 1 - absOffset * 0.08

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (!isCenter) {
                    playClickSound()
                    setActiveIndex(idx)
                  }
                }}
                data-cursor={isCenter ? 'VIEW' : 'SELECT'}
                className={`absolute w-[270px] xs:w-[300px] sm:w-[340px] rounded-3xl border p-4 sm:p-6 text-left transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between ${
                  isCenter
                    ? 'border-brand-blue shadow-[0_25px_60px_rgba(0,56,255,0.4)] z-30 bg-[#0f1424]'
                    : 'border-white/10 shadow-lg z-10 bg-[#0b0e18] hover:border-white/20'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  pointerEvents: absOffset > (isMobile ? 1 : 2) ? 'none' : 'auto',
                }}
              >
                <div>
                  {/* Visual Header Banner */}
                  <div
                    className={`w-full rounded-2xl bg-gradient-to-br ${card.accent} p-4 flex flex-col justify-between mb-4 relative overflow-hidden shadow-md`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-white/90">
                      <span className="flex items-center gap-1">
                        <span className="text-base">{card.icon}</span>
                        <span>{card.category}</span>
                      </span>
                      <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-brand-yellow font-mono text-[9px]">
                        {card.metric}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="text-lg sm:text-xl font-display font-black text-white leading-tight">
                        {card.title}
                      </div>
                      <div className="text-[11px] font-medium text-white/80 mt-0.5">
                        {card.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Simple Plain-English Description */}
                  <p className="text-xs text-white/70 leading-relaxed font-sans line-clamp-3">
                    {card.desc}
                  </p>

                  {/* 3 Clear Checkmark Deliverables */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                    {card.bullets.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-white/85 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  {isCenter ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardAction(card)
                      }}
                      data-cursor="GO"
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-blue hover:bg-brand-blue-dark px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-brand-blue/30 transition-all active:scale-95"
                    >
                      <span>{card.ctaText}</span>
                    </button>
                  ) : (
                    <>
                      <span className="text-white/40 uppercase tracking-wider text-[11px] font-bold">
                        Click to Focus
                      </span>
                      <span className="text-white/30 font-mono text-[10px]">
                        0{card.id} / 05
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel Navigation Arrows & Dots */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handlePrev}
            data-cursor="PREV"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-brand-blue hover:border-brand-blue transition-colors active:scale-95 shadow-md"
            aria-label="Previous service"
          >
            ←
          </button>

          <div className="flex items-center gap-1.5">
            {SHOWCASE_CARDS.map((_, i) => (
              <span
                key={i}
                onClick={() => {
                  playClickSound()
                  setActiveIndex(i)
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeIndex === i ? 'w-6 bg-brand-blue' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            data-cursor="NEXT"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-brand-blue hover:border-brand-blue transition-colors active:scale-95 shadow-md"
            aria-label="Next service"
          >
            →
          </button>
        </div>

        {/* Explore Products & Catalog CTA Banner */}
        <div className="mt-12 sm:mt-14 max-w-2xl mx-auto">
          <div className="p-5 sm:p-6 rounded-3xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/15 via-purple-600/15 to-brand-yellow/15 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>55M+ DIGITAL ASSETS ARCHIVE</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-black text-white">
                Looking for Ready-To-Use Creative Assets?
              </h3>
              <p className="text-xs text-white/65 mt-1 font-sans">
                LUTs, sound effects, motion graphics, Canva templates & viral reels vault.
              </p>
            </div>

            <Link
              to="/catalog"
              onClick={() => playClickSound()}
              className="shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-brand-yellow hover:bg-brand-yellow-dark text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-brand-yellow/30 hover:shadow-brand-yellow/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>EXPLORE PRODUCTS</span>
              <span className="font-sans text-sm font-black">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Direct Brief Modal */}
      <QuickBriefModal
        isOpen={briefOpen}
        initialService={selectedService}
        onClose={() => setBriefOpen(false)}
      />

      {/* Direct Checkout Modal for Bundle Card */}
      {product && (
        <DirectCheckoutModal
          isOpen={checkoutOpen}
          product={product}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </section>
  )
}
