import { useEffect, useRef, useState } from 'react'
import { useContent } from '../content/ContentContext'
import { playClickSound } from '../lib/soundFx'
import AssetInspectorModal from './AssetInspectorModal'
import DirectCheckoutModal from './DirectCheckoutModal'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import bundleImg from '../assets/products/biggest-editing-bundle.webp'
import logoIcon from '../assets/logo-icon-blue-squircle.png'

const ASSET_TABS = [
  {
    id: 'reels',
    label: '🎬 30K+ Reels',
    badge: '4K ULTRA HD',
    chips: [
      '🔥 Motivational & Mindset (4K)',
      '🏎️ Luxury & Lifestyle',
      '📱 Tech & AI Viral Shorts',
      '💡 Business & Finance Hooks',
    ],
    highlight: '✓ 100% Watermark Free • Trending 9:16 Aspect • Instant Drive Download',
    accentColor: '#f43f5e',
  },
  {
    id: 'luts',
    label: '🎨 500+ LUTs',
    badge: 'COLOR GRADE',
    chips: [
      '🎬 Hollywood Teal & Orange',
      '🍎 Apple Log to Rec.709',
      '🎞️ Kodak 35mm Vintage Film',
      '🌆 Cyberpunk Neon Nights',
    ],
    highlight: '✓ Works in Premiere Pro, DaVinci Resolve, Final Cut & CapCut',
    accentColor: '#8b5cf6',
  },
  {
    id: 'sfx',
    label: '🔊 25K+ SFX',
    badge: 'STUDIO WAV',
    chips: [
      '💨 Cinematic Whooshes & Braams',
      '🖱️ UI Pops & Click FX',
      '💥 Impact Hits & Drops',
      '📈 Tension Risers & Downers',
    ],
    highlight: '✓ Studio 24-Bit Lossless WAV • 100% Royalty Free for Commercial Use',
    accentColor: '#00d2ff',
  },
  {
    id: 'canva',
    label: '📐 3L+ Canva',
    badge: '1-CLICK EDIT',
    chips: [
      '📊 Viral Instagram Carousels',
      '📸 Story & Reel Covers',
      '💼 Investor Pitch Decks',
      '🎯 High-Converting Ad Creative',
    ],
    highlight: '✓ 1-Click Import into Free or Pro Canva Accounts',
    accentColor: '#06b6d4',
  },
  {
    id: 'vfx',
    label: '⚡ 1,450+ VFX',
    badge: 'ALPHA CHANNEL',
    chips: [
      '🔥 4K Film Burns & Light Leaks',
      '📺 Glitch & CRT Overlays',
      '✨ Dust & Particle Bursts',
      '🎞️ 16mm/35mm Film Grain',
    ],
    highlight: '✓ Transparent Alpha Channel (.MOV) • Drag & Drop Blend Modes',
    accentColor: '#10b981',
  },
]

export default function FeaturedProduct() {
  const { content } = useContent()
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activeTabId, setActiveTabId] = useState('reels')
  const product =
    content.products.find((p) => p.id === content.site.featuredProductId) ?? content.products[0]

  const boxRigRef = useRef(null)
  const containerRef = useRef(null)
  const shineRef = useRef(null)

  // 3D Parallax Tilt & Holographic Foil Sheen
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const container = containerRef.current
    const rig = boxRigRef.current
    const shine = shineRef.current
    if (!container || !rig) return undefined

    const rotateX = gsap.quickTo(rig, 'rotationX', { duration: 0.6, ease: 'power2.out' })
    const rotateY = gsap.quickTo(rig, 'rotationY', { duration: 0.6, ease: 'power2.out' })

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      rotateX(-ny * 12)
      rotateY(nx * 14)

      if (shine) {
        const px = Math.round(((e.clientX - rect.left) / rect.width) * 100)
        const py = Math.round(((e.clientY - rect.top) / rect.height) * 100)
        shine.style.setProperty('--mx', `${px}%`)
        shine.style.setProperty('--my', `${py}%`)
        shine.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      rotateX(0)
      rotateY(0)
      if (shine) shine.style.opacity = '0'
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!product) return null

  const activeTab = ASSET_TABS.find((t) => t.id === activeTabId) || ASSET_TABS[0]

  return (
    <section
      id="product"
      className="relative scroll-mt-20 overflow-hidden bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-16 sm:py-24"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-brand-blue/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 bottom-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ================= LEFT COLUMN: HOLOGRAPHIC 3D ARTWORK CARD ================= */}
          <div
            ref={containerRef}
            className="lg:col-span-5 flex flex-col items-center justify-center relative py-4 sm:py-6"
            style={{ perspective: '1100px' }}
          >
            {/* Zero-Gravity Floating Glass Software Badges (3D Interactive Depth) */}
            <div
              aria-hidden="true"
              className="animate-float pointer-events-none absolute -top-2 left-0 sm:-left-3 z-40 hidden sm:flex items-center gap-2 rounded-2xl border border-white/60 dark:border-white/20 bg-white/90 dark:bg-[#13102b]/90 px-3 py-1.5 shadow-xl backdrop-blur-md"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#00005b] font-mono text-[10px] font-black text-[#9999ff] shadow-xs">
                Ae
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-white">Motion VFX</span>
            </div>

            <div
              aria-hidden="true"
              className="animate-float-slow pointer-events-none absolute top-12 -right-2 sm:-right-4 z-40 hidden sm:flex items-center gap-2 rounded-2xl border border-white/60 dark:border-white/20 bg-white/90 dark:bg-[#1f0e2b]/90 px-3 py-1.5 shadow-xl backdrop-blur-md"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#000033] font-mono text-[10px] font-black text-[#ea77ff] shadow-xs">
                Pr
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-white">Transitions</span>
            </div>

            <div
              aria-hidden="true"
              className="animate-float-fast pointer-events-none absolute -bottom-2 left-2 sm:left-0 z-40 hidden sm:flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#0a1626]/95 px-3 py-1.5 shadow-xl backdrop-blur-md"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#00c4cc]/20 text-[#00c4cc] font-mono text-[10px] font-black shadow-xs">
                Ps
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-white">Canva &amp; LUTs</span>
            </div>

            <div
              aria-hidden="true"
              className="animate-float pointer-events-none absolute bottom-4 -right-1 sm:-right-3 z-40 hidden sm:flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-white/95 dark:bg-[#071d18]/95 px-3 py-1.5 shadow-xl backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="font-mono text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">24-Bit SFX</span>
            </div>

            <div
              ref={boxRigRef}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative group w-full max-w-[420px] transition-transform duration-100 ease-out"
            >
              {/* Soft electric blue ambient glow halo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-[32px] bg-brand-blue/25 blur-2xl transition-all duration-500 group-hover:bg-brand-blue/40"
              />

              {/* Holographic Prismatic Border Ring */}
              <div className="relative rounded-[32px] p-[1.5px] bg-gradient-to-tr from-cyan-400/50 via-purple-500/50 to-amber-400/50 shadow-2xl overflow-hidden">
                
                {/* Main Card Surface */}
                <div className="relative overflow-hidden rounded-[30px] bg-white dark:bg-[#0a0d16] p-3.5 sm:p-4">
                  
                  {/* Holographic Sheen Light Reflection (Apple Card Effect) */}
                  <div
                    ref={shineRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 rounded-[30px]"
                    style={{
                      background:
                        'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.35) 0%, rgba(0,210,255,0.18) 25%, rgba(168,85,247,0.15) 50%, transparent 75%)',
                    }}
                  />

                  {/* ================= OFFICIAL STUDIO AUTHENTICITY HEADER ================= */}
                  <div className="relative z-10 flex items-center justify-between mb-3 px-1">
                    {/* Top-Left: SAN SHIFT Squircle Logo & Master Archive ID */}
                    <div className="flex items-center gap-2">
                      <img
                        src={logoIcon}
                        alt="SAN SHIFT"
                        className="h-6 w-6 rounded-lg object-contain shadow-xs"
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[10px] font-black tracking-widest text-slate-900 dark:text-white uppercase leading-none">
                          SAN SHIFT
                        </span>
                        <span className="font-mono text-[7.5px] font-bold tracking-wider text-brand-blue dark:text-cyan-400 uppercase mt-0.5">
                          MASTER ARCHIVE • BATCH #2026
                        </span>
                      </div>
                    </div>

                    {/* Top-Right: Rotating 3D Metallic Gold Holographic Seal */}
                    <div className="relative group/seal flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-400/25 to-amber-500/15 border border-amber-500/40 shadow-xs backdrop-blur-md">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 shadow-xs text-black text-[8px] font-black animate-spin-slow">
                        ★
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] font-black tracking-wider text-amber-700 dark:text-amber-300 uppercase leading-none">
                          VERIFIED AUTHENTIC
                        </span>
                        <span className="font-mono text-[6.5px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                          LIFETIME LICENSE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product artwork image */}
                  <div className="relative z-10 overflow-hidden rounded-2xl bg-black/5 dark:bg-black/40 shadow-inner">
                    <img
                      src={product.image || bundleImg}
                      alt={product.name}
                      className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-103"
                      loading="eager"
                    />
                  </div>

                  {/* ================= BRANDED TECHNICAL LICENSE FOOTER (NO REDUNDANCY) ================= */}
                  <div className="relative z-10 mt-3 pt-2.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between px-1 text-[9px] font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">ID: SS-VAULT-2026</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-bold uppercase tracking-wider text-brand-blue dark:text-cyan-400">
                      COMMERCIAL RIGHTS GRANTED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT SPEC & LIVE DRAWER ================= */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 uppercase tracking-wider">
                {product.category || 'DIGITAL BUNDLES'}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                ⚡ ALL-IN-ONE BUNDLE
              </span>
              {product.originalPrice && product.price && (
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider">
                  🔥 {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Live Urgency Badge & Creator Rating */}
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 text-xs text-amber-700 dark:text-amber-300 font-semibold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span>
                  {content.site?.featuredUrgencyText || (
                    <>
                      ⚡ <strong className="font-bold text-slate-900 dark:text-white">Early-Bird Batch:</strong> Only 14 Lifetime Passes Left at ₹{product.price ?? 99}!
                    </>
                  )}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-amber-400">★★★★★</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {content.site?.featuredRatingText || '4.9/5'}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">(1,240+ Editors)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-950 dark:text-white leading-[1.12]">
              {product.name}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl">
              {product.shortDescription || product.tagline || 'The ultimate collection of resources for video editing, content creation and digital marketing — one pack, endless creativity.'}
            </p>

            {/* 2-Column Bullet List */}
            {product.stats && product.stats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 w-full py-1 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="space-y-2">
                  {product.stats.slice(0, Math.ceil(product.stats.length / 2)).map((stat, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                      <span>{stat}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-brand-blue dark:text-cyan-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue dark:bg-cyan-400 shrink-0" />
                    <span>+ 50+ More Categories &amp; Much More...</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {product.stats.slice(Math.ceil(product.stats.length / 2)).map((stat, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                      <span>{stat}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Lifetime Free Future Updates Included</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 w-full py-1 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                    <span>55M+ Digital Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                    <span>30K+ Viral Reels</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                    <span>3 Lakh+ Canva Templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Lifetime Free Future Updates Included</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= INTERACTIVE MINI ASSET DRAWER ================= */}
            <div className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ⚡ Live Interactive Sample Drawer:
                </span>
                <span className="font-mono text-[9px] font-semibold text-brand-blue dark:text-cyan-400">
                  {activeTab.badge}
                </span>
              </div>

              {/* Drawer Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {ASSET_TABS.map((tab) => {
                  const isActive = tab.id === activeTabId
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        playClickSound()
                        setActiveTabId(tab.id)
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30 scale-[1.02]'
                          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Sample Chips */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {activeTab.chips.map((chip, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/30 border border-black/5 dark:border-white/10 text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate"
                  >
                    <span>{chip}</span>
                  </div>
                ))}
              </div>

              {/* Drawer Highlight & Inspect Link */}
              <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {activeTab.highlight}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setInspectorOpen(true)
                  }}
                  className="font-bold text-brand-blue dark:text-cyan-400 hover:underline cursor-pointer shrink-0 ml-2"
                >
                  Inspect All 55M+ →
                </button>
              </div>
            </div>

            {/* Price & CTA Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-4xl sm:text-5xl font-black text-brand-blue tracking-tight">
                ₹{product.price ?? 99}
              </span>
              {product.originalPrice && (
                <span className="text-xl sm:text-2xl text-slate-400 line-through font-semibold">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                INSTANT LIFETIME ACCESS
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setCheckoutOpen(true)
                }}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-brand-blue hover:bg-brand-blue-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 transition-all active:scale-95 cursor-pointer"
              >
                <span>GET THE BUNDLE — ₹99</span>
                <span className="font-sans text-sm">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setInspectorOpen(true)
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-black text-xs sm:text-sm uppercase tracking-wider hover:border-brand-blue hover:text-brand-blue dark:hover:border-brand-blue dark:hover:text-brand-blue transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <span>👁 PEEK INSIDE ASSETS</span>
              </button>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>🔒</span>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⚡</span>
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🏷️</span>
                <span>One-Time Payment</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <AssetInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        onBuy={() => setCheckoutOpen(true)}
      />

      <DirectCheckoutModal
        isOpen={checkoutOpen}
        product={product}
        onClose={() => setCheckoutOpen(false)}
      />
    </section>
  )
}
