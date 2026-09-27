import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { useCurrency } from '../content/CurrencyContext'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import { use3DScrollReveal } from '../hooks/use3DScrollReveal'
import DirectCheckoutModal from './DirectCheckoutModal'
import TrustBadges from './TrustBadges'

export default function Dynamic3DScrollShowcase() {
  const { content } = useContent()
  const { formatPrice } = useCurrency()
  const containerRef = useRef(null)
  const pinSectionRef = useRef(null)
  const cardRigRef = useRef(null)
  const cardFaceRef = useRef(null)
  const frontPlateRef = useRef(null)
  const wing1Ref = useRef(null)
  const wing2Ref = useRef(null)
  const wing3Ref = useRef(null)
  const wing4Ref = useRef(null)
  const connectorSvgRef = useRef(null)

  // Activate 3D Scroll Flip-In physics on this section
  use3DScrollReveal(containerRef)

  const products = Array.isArray(content?.products) && content.products.length > 0
    ? content.products
    : []

  const [activeIndex, setActiveIndex] = useState(0)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [isExploded, setIsExploded] = useState(false)
  const isExplodedRef = useRef(false)

  const currentProduct = products[activeIndex] || products[0]

  // Category specific accent themes for dynamic ambient light
  const getThemeAccent = (category = '') => {
    const cat = (category || '').toLowerCase()
    if (cat.includes('bundle')) return { color: '#0038ff', glow: 'rgba(0, 56, 255, 0.45)', name: 'Electric Blue' }
    if (cat.includes('color') || cat.includes('lut')) return { color: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', name: 'Cinematic Emerald' }
    if (cat.includes('sound') || cat.includes('sfx')) return { color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.45)', name: 'Neon Violet' }
    if (cat.includes('reel') || cat.includes('social')) return { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)', name: 'Solar Amber' }
    return { color: '#0038ff', glow: 'rgba(0, 56, 255, 0.45)', name: 'Cyber Blue' }
  }

  const activeTheme = getThemeAccent(currentProduct?.category)

  // 3D Gyroscopic & Mouse Tilt Physics (Awwwards 60fps smoothing)
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const card = cardRigRef.current
    if (!card) return undefined

    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.65, ease: 'power2.out' })
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.65, ease: 'power2.out' })

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Clamp max tilt angles
      const rotX = -((y - centerY) / centerY) * 12
      const rotY = ((x - centerX) / centerX) * 14

      rotateX(rotX)
      rotateY(rotY)
    }

    const handleMouseLeave = () => {
      rotateX(0)
      rotateY(0)
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [activeIndex])

  // =========================================================================
  // KTM STYLED 3D EXPLODED SCROLL ENGINE (GSAP ScrollTrigger Scrubbing)
  // =========================================================================
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const section = pinSectionRef.current
    const frontPlate = frontPlateRef.current
    const w1 = wing1Ref.current
    const w2 = wing2Ref.current
    const w3 = wing3Ref.current
    const w4 = wing4Ref.current
    const svg = connectorSvgRef.current

    if (!section || !frontPlate || !w1 || !w2 || !w3 || !w4) return undefined

    const isMobile = window.innerWidth < 768
    const spreadX = isMobile ? 38 : 115
    const spreadY = isMobile ? 36 : 65
    const spreadZ = isMobile ? 40 : 85

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 25%',
          scrub: 1.2,
          onUpdate: (self) => {
            // Update state indicator based on scroll scrub
            const inExplosionRange = self.progress > 0.25 && self.progress < 0.8
            if (inExplosionRange !== isExplodedRef.current) {
              isExplodedRef.current = inExplosionRange
              setIsExploded(inExplosionRange)
            }
          },
        },
      })

      // STAGE 1: EXPANSION & EXPLOSION (progress 0 -> 0.45)
      tl.to(
        frontPlate,
        {
          z: spreadZ * 1.35,
          y: -25,
          scale: 1.02,
          opacity: 0.96,
          boxShadow: '0 25px 50px rgba(0,0,0,0.45)',
          ease: 'power2.out',
        },
        0
      )
        .to(
          w1,
          {
            x: -spreadX,
            y: -spreadY,
            z: spreadZ,
            rotationY: isMobile ? 6 : 14,
            rotationX: -6,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
          },
          0
        )
        .to(
          w2,
          {
            x: spreadX,
            y: -spreadY,
            z: spreadZ,
            rotationY: isMobile ? -6 : -14,
            rotationX: -6,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
          },
          0
        )
        .to(
          w3,
          {
            x: -spreadX * 0.9,
            y: spreadY * 1.05,
            z: spreadZ * 0.85,
            rotationY: isMobile ? 5 : 10,
            rotationX: 6,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
          },
          0
        )
        .to(
          w4,
          {
            x: spreadX * 0.9,
            y: spreadY * 1.05,
            z: spreadZ * 0.85,
            rotationY: isMobile ? -5 : -10,
            rotationX: 6,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
          },
          0
        )
        .to(
          svg,
          {
            opacity: 0.85,
            ease: 'power1.out',
          },
          0
        )

      // STAGE 2: HOLD EXPLOSION IN VIEW (progress 0.45 -> 0.65)
      tl.to({}, { duration: 0.25 })

      // STAGE 3: REASSEMBLE & LOCK (progress 0.65 -> 1.0)
      tl.to(
        [w1, w2, w3, w4],
        {
          x: 0,
          y: 0,
          z: 0,
          rotationY: 0,
          rotationX: 0,
          opacity: 0,
          scale: 0.8,
          ease: 'power3.inOut',
        },
        0.75
      )
        .to(
          frontPlate,
          {
            z: 20,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'power3.inOut',
          },
          0.75
        )
        .to(
          svg,
          {
            opacity: 0,
            ease: 'power1.in',
          },
          0.75
        )
    }, section)

    return () => ctx.revert()
  }, [activeIndex])

  // One-Click Manual Explode / Reassemble Toggle
  const handleToggleExplode = () => {
    playChimeSound()
    const nextState = !isExploded
    setIsExploded(nextState)
    isExplodedRef.current = nextState

    const frontPlate = frontPlateRef.current
    const w1 = wing1Ref.current
    const w2 = wing2Ref.current
    const w3 = wing3Ref.current
    const w4 = wing4Ref.current
    const svg = connectorSvgRef.current

    if (!frontPlate || !w1 || !w2 || !w3 || !w4) return

    const isMobile = window.innerWidth < 768
    const spreadX = isMobile ? 38 : 115
    const spreadY = isMobile ? 36 : 65
    const spreadZ = isMobile ? 40 : 85

    if (nextState) {
      // Explode manual tween
      gsap.to(frontPlate, { z: spreadZ * 1.3, y: -22, duration: 0.6, ease: 'power3.out' })
      gsap.to(w1, { x: -spreadX, y: -spreadY, z: spreadZ, rotationY: isMobile ? 6 : 14, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      gsap.to(w2, { x: spreadX, y: -spreadY, z: spreadZ, rotationY: isMobile ? -6 : -14, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      gsap.to(w3, { x: -spreadX * 0.9, y: spreadY * 1.05, z: spreadZ * 0.85, rotationY: isMobile ? 5 : 10, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      gsap.to(w4, { x: spreadX * 0.9, y: spreadY * 1.05, z: spreadZ * 0.85, rotationY: isMobile ? -5 : -10, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      gsap.to(svg, { opacity: 0.85, duration: 0.5 })
    } else {
      // Reassemble manual tween
      gsap.to([w1, w2, w3, w4], { x: 0, y: 0, z: 0, rotationY: 0, opacity: 0, scale: 0.8, duration: 0.5, ease: 'power3.inOut' })
      gsap.to(frontPlate, { z: 20, y: 0, duration: 0.5, ease: 'power3.inOut' })
      gsap.to(svg, { opacity: 0, duration: 0.3 })
    }
  }

  // 3D Flip Card Transition when switching dynamic products
  const handleSelectProduct = (index) => {
    if (index === activeIndex || isFlipping) return
    playClickSound()
    setIsFlipping(true)

    const card = cardFaceRef.current

    if (card && !prefersReducedMotion()) {
      gsap.to(card, {
        rotationY: 90,
        scale: 0.88,
        opacity: 0.4,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          setActiveIndex(index)
          gsap.fromTo(
            card,
            { rotationY: -90, scale: 0.88, opacity: 0.4 },
            {
              rotationY: 0,
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: 'power3.out',
              onComplete: () => {
                setIsFlipping(false)
                playChimeSound()
              },
            }
          )
        },
      })
    } else {
      setActiveIndex(index)
      setIsFlipping(false)
    }
  }

  if (!currentProduct) return null

  // Satellite Badges content (dynamically mapped from product stats)
  const statList = currentProduct.stats || [
    '55M+ Editing Presets & Premiere Files',
    '500+ Cinematic LUTs & Log Presets',
    '25,000+ Sound FX & Audio Waves',
    'Instant Google Drive VIP Link',
  ]

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-16 sm:py-24 md:py-32 border-b border-black/5 dark:border-white/5 bg-brand-offwhite/50 dark:bg-[#070a12] text-black dark:text-white"
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[580px] w-[580px] rounded-full blur-[140px] opacity-35 dark:opacity-25 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${activeTheme.color} 0%, transparent 70%)`,
        }}
      />

      <div ref={pinSectionRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Masked Line Reveal */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="reveal-silk inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 px-4 py-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black/70 dark:text-white/70 shadow-sm backdrop-blur-md">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeTheme.color }}
            />
            <span>3D STAGED EXPLODED VIEW • INTERACTIVE ANATOMY</span>
          </div>

          <div className="overflow-hidden">
            <h2 className="reveal-mask font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-[1.08]">
              SEE INSIDE THE VAULT. <br />
              <span
                className="transition-colors duration-700"
                style={{ color: activeTheme.color }}
              >
                UNPACKED IN 3D ANATOMY.
              </span>
            </h2>
          </div>

          <p className="reveal-3d text-xs sm:text-base text-black/60 dark:text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
            Scroll down or tap below to watch the 3D Vault expand into its four core creative dimensions: Presets, Cinematic LUTs, Sound FX and VIP Drive Delivery.
          </p>

          {/* Interactive Explode Trigger Button */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleToggleExplode}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                isExploded
                  ? 'bg-brand-blue text-white shadow-brand-blue/30 scale-102'
                  : 'bg-white dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/15 hover:border-brand-blue'
              }`}
            >
              <span>{isExploded ? '🔒 REASSEMBLE VAULT' : '💥 EXPLODE 3D ANATOMY'}</span>
            </button>

            <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
              {isExploded ? '● 4 Layers Expanded' : '● Scroll or Tap to Unpack'}
            </span>
          </div>
        </div>

        {/* Dynamic Product Segmented Switcher */}
        {products.length > 1 && (
          <div className="reveal-3d flex items-center justify-center mb-8 sm:mb-12 overflow-x-auto pb-2 scrollbar-none">
            <div className="inline-flex p-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-lg gap-1">
              {products.map((prod, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectProduct(idx)}
                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isActive ? activeTheme.color : 'transparent',
                    }}
                  >
                    <span>0{idx + 1} // {prod.name.split(' ')[0]}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* The 3D Stage with Exploded Anatomy & Side Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ======================================================= */}
          {/* LEFT: 3D STAGE & EXPLODING SATELLITE WINGS              */}
          {/* ======================================================= */}
          <div className="lg:col-span-7 flex justify-center [perspective:1500px] relative py-8 sm:py-12">
            
            {/* SVG Laser Leader Lines (Anatomy Connectors) */}
            <svg
              ref={connectorSvgRef}
              className="absolute inset-0 h-full w-full pointer-events-none opacity-0 transition-opacity duration-300 z-10 hidden sm:block"
              viewBox="0 0 600 500"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Top-Left Connector */}
              <line x1="300" y1="250" x2="160" y2="150" stroke={activeTheme.color} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="160" cy="150" r="3.5" fill={activeTheme.color} />
              
              {/* Top-Right Connector */}
              <line x1="300" y1="250" x2="440" y2="150" stroke={activeTheme.color} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="440" cy="150" r="3.5" fill={activeTheme.color} />

              {/* Bottom-Left Connector */}
              <line x1="300" y1="250" x2="175" y2="360" stroke={activeTheme.color} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="175" cy="360" r="3.5" fill={activeTheme.color} />

              {/* Bottom-Right Connector */}
              <line x1="300" y1="250" x2="425" y2="360" stroke={activeTheme.color} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="425" cy="360" r="3.5" fill={activeTheme.color} />
            </svg>

            {/* SATELLITE WING 1: TOP-LEFT (PRESETS & ASSETS) */}
            <div
              ref={wing1Ref}
              className="absolute z-20 pointer-events-none opacity-0 scale-75 origin-center -top-2 left-2 sm:left-4"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              <div className="rounded-xl border border-black/15 dark:border-white/20 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-xl max-w-[150px] sm:max-w-[200px] text-left leading-tight">
                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-black text-brand-blue">
                  <span>🎬 WING 01</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
                </div>
                <h5 className="font-bold text-[11px] sm:text-xs text-black dark:text-white mt-1">
                  55M+ Editing Assets
                </h5>
                <p className="text-[9px] text-black/60 dark:text-white/60 font-mono mt-0.5 truncate">
                  Premiere, AE, DaVinci, FCP
                </p>
              </div>
            </div>

            {/* SATELLITE WING 2: TOP-RIGHT (CINEMATIC LUTS) */}
            <div
              ref={wing2Ref}
              className="absolute z-20 pointer-events-none opacity-0 scale-75 origin-center -top-2 right-2 sm:right-4"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              <div className="rounded-xl border border-black/15 dark:border-white/20 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-xl max-w-[150px] sm:max-w-[200px] text-left leading-tight">
                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-black text-emerald-500">
                  <span>🎨 WING 02</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h5 className="font-bold text-[11px] sm:text-xs text-black dark:text-white mt-1">
                  4K Cinematic LUTs
                </h5>
                <p className="text-[9px] text-black/60 dark:text-white/60 font-mono mt-0.5 truncate">
                  Sony Log, Apple Log, Teal-Orange
                </p>
              </div>
            </div>

            {/* SATELLITE WING 3: BOTTOM-LEFT (SOUND FX) */}
            <div
              ref={wing3Ref}
              className="absolute z-20 pointer-events-none opacity-0 scale-75 origin-center -bottom-2 left-2 sm:left-6"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              <div className="rounded-xl border border-black/15 dark:border-white/20 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-xl max-w-[150px] sm:max-w-[200px] text-left leading-tight">
                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-black text-purple-500">
                  <span>🔊 WING 03</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
                <h5 className="font-bold text-[11px] sm:text-xs text-black dark:text-white mt-1">
                  25,000+ Sound FX
                </h5>
                <p className="text-[9px] text-black/60 dark:text-white/60 font-mono mt-0.5 truncate">
                  Whooshes, Risers, Hits & Foley
                </p>
              </div>
            </div>

            {/* SATELLITE WING 4: BOTTOM-RIGHT (GOOGLE DRIVE VIP LINK) */}
            <div
              ref={wing4Ref}
              className="absolute z-20 pointer-events-none opacity-0 scale-75 origin-center -bottom-2 right-2 sm:right-6"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              <div className="rounded-xl border border-black/15 dark:border-white/20 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-xl max-w-[150px] sm:max-w-[200px] text-left leading-tight">
                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase font-black text-amber-500">
                  <span>⚡ WING 04</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <h5 className="font-bold text-[11px] sm:text-xs text-black dark:text-white mt-1">
                  VIP Cloud Link
                </h5>
                <p className="text-[9px] text-black/60 dark:text-white/60 font-mono mt-0.5 truncate">
                  Instant Google Drive Access
                </p>
              </div>
            </div>

            {/* THE CORE 3D RIG */}
            <div
              ref={cardRigRef}
              className="relative w-full max-w-sm sm:max-w-md cursor-grab active:cursor-grabbing [transform-style:preserve-3d] transition-shadow duration-500 rounded-3xl"
            >
              {/* Outer Glow Halo */}
              <div
                className="absolute inset-0 rounded-3xl opacity-50 blur-2xl -z-10 transition-colors duration-700 pointer-events-none"
                style={{ backgroundColor: activeTheme.color }}
              />

              {/* Core 3D Body */}
              <div
                ref={cardFaceRef}
                className="relative overflow-hidden rounded-3xl border-2 border-black/10 dark:border-white/15 bg-white dark:bg-[#0c101c] p-4 sm:p-6 shadow-2xl [transform-style:preserve-3d]"
              >
                {/* 3D FRONT HOLOGRAPHIC ARMOR PLATE (LIFTS IN Z-SPACE ON EXPLODE) */}
                <div
                  ref={frontPlateRef}
                  className="rounded-2xl border border-black/10 dark:border-white/20 bg-brand-offwhite/90 dark:bg-white/[0.04] p-3 mb-4 backdrop-blur-xl shadow-md transition-shadow [transform:translateZ(20px)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shadow-lg"
                        style={{ backgroundColor: activeTheme.color, boxShadow: `0 0 10px ${activeTheme.color}` }}
                      />
                      <span className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-black/80 dark:text-white/80">
                        {currentProduct.category || 'VIP DIGITAL ASSETS'}
                      </span>
                    </div>

                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {isExploded ? '💥 3D ANATOMY UNPACKED' : '⚡ 3D VAULT LOCKED'}
                    </span>
                  </div>
                </div>

                {/* CORE ARTWORK ENGINE (Z: 0px / Base Layer) */}
                <div className="relative aspect-video sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-black/10 dark:border-white/10 group">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Badges inside image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-lg bg-black/80 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono font-black text-white uppercase tracking-wider shadow-md">
                      SAN SHIFT // VAULT
                    </span>
                    <span className="rounded-lg bg-emerald-500/90 text-white px-2 py-1 text-[9px] sm:text-[10px] font-mono font-black shadow-md">
                      ✓ LIFETIME ACCESS
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="truncate pr-2">
                      <span className="block text-[8px] sm:text-[9px] font-mono uppercase text-white/60">
                        MASTER EDITION
                      </span>
                      <span className="font-bold text-xs sm:text-sm truncate">
                        {currentProduct.name}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white/20 backdrop-blur-md px-3 py-1 border border-white/30 text-center shrink-0">
                      <span className="text-[9px] font-mono uppercase text-white/70 block">VALUE</span>
                      <span className="font-display font-black text-xs sm:text-sm text-brand-yellow">
                        {formatPrice(currentProduct.originalPrice || 1000)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PRICING & QUICK ACTIONS */}
                <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between [transform:translateZ(25px)]">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-black/50 dark:text-white/50 block">
                      DEAL PRICE
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="font-display text-2xl sm:text-3xl font-black"
                        style={{ color: activeTheme.color }}
                      >
                        {formatPrice(currentProduct.price || 99)}
                      </span>
                      <span className="text-xs text-black/40 dark:text-white/40 line-through">
                        {formatPrice(currentProduct.originalPrice || 1000)}
                      </span>
                      <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-black px-1.5 py-0.5">
                        90% OFF
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playChimeSound()
                      setCheckoutOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 cursor-pointer hover:brightness-110"
                    style={{ backgroundColor: activeTheme.color }}
                  >
                    <span>⚡ GET ACCESS</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Tilt Hint */}
                <div className="mt-3 text-center text-[9px] font-mono text-black/40 dark:text-white/40 [transform:translateZ(10px)]">
                  <span>✦ MOVE CURSOR TO TILT // SCROLL TO EXPEDITE ANATOMY ✦</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* RIGHT: EDITORIAL SPEC BREAKDOWN                         */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <span
                className="font-mono text-xs font-black uppercase tracking-wider"
                style={{ color: activeTheme.color }}
              >
                PRODUCT 0{activeIndex + 1} // {currentProduct.category}
              </span>

              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-black dark:text-white tracking-tight leading-tight">
                {currentProduct.name}
              </h3>

              <p className="text-xs sm:text-sm text-black/70 dark:text-white/70 font-sans leading-relaxed">
                {currentProduct.shortDescription || currentProduct.tagline}
              </p>
            </div>

            {/* Dynamic Included Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {statList.slice(0, 4).map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03] p-3.5 shadow-sm transition-all hover:border-black/20 dark:hover:border-white/20"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: activeTheme.color }}
                    />
                    <span className="font-mono text-[10px] font-bold text-black/50 dark:text-white/50 uppercase">
                      LAYER 0{i + 1}
                    </span>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-black dark:text-white block truncate">
                    {stat}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions: Primary Order on WhatsApp & Full Spec Link */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  playChimeSound()
                  setCheckoutOpen(true)
                }}
                className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-full py-4 px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl transition-all hover:scale-102 active:scale-95 cursor-pointer text-center"
                style={{
                  backgroundColor: activeTheme.color,
                  boxShadow: `0 12px 30px ${activeTheme.glow}`,
                }}
              >
                <span>💬 ORDER ON WHATSAPP ({formatPrice(currentProduct.price || 99)})</span>
                <span>→</span>
              </button>

              <Link
                to={`/products/${currentProduct.id}`}
                onClick={playClickSound}
                className="inline-flex items-center justify-center rounded-full border border-black/15 dark:border-white/20 bg-white/80 dark:bg-white/5 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white transition-all hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
              >
                FULL SPEC ↗
              </Link>
            </div>

            {/* Trust Guarantee */}
            <div className="pt-2 border-t border-black/5 dark:border-white/5">
              <TrustBadges />
            </div>
          </div>
        </div>
      </div>

      {/* Universal Direct Checkout Modal */}
      <DirectCheckoutModal
        isOpen={checkoutOpen}
        product={currentProduct}
        onClose={() => setCheckoutOpen(false)}
      />
    </section>
  )
}
