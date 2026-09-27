import { useEffect, useRef, useState, useTransition } from 'react'
import logoMark from '../assets/logo-mark.png'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'

const DISCIPLINES = [
  {
    id: 'content',
    num: '01',
    name: 'CONTENT CREATION',
    shortName: 'Content',
    tag: 'VIRAL HOOKS',
    metric: '94.2% RETENTION',
    statSub: '1.4M+ Organic Views',
    accentColor: '#0038ff',
    icon: '🎬',
    description: 'High-pacing hooks, viral storytelling, and vertical video architecture.',
    previewType: 'reels',
  },
  {
    id: 'editing',
    num: '02',
    name: 'VIDEO & PHOTO EDITING',
    shortName: 'Editing',
    tag: 'PRO 4K TIMELINE',
    metric: 'CINEMATIC GRADE',
    statSub: 'Color & Sound Design',
    accentColor: '#38bdf8',
    icon: '✂️',
    description: 'Precision timeline cuts, dynamic motion graphics, and studio color grading.',
    previewType: 'timeline',
  },
  {
    id: 'marketing',
    num: '03',
    name: 'DIGITAL MARKETING',
    shortName: 'Marketing',
    tag: 'PAID ADS SCALE',
    metric: '5.4X AD ROAS',
    statSub: 'Meta & Google Funnels',
    accentColor: '#10b981',
    icon: '📈',
    description: 'High-converting video ads engineered for profitable, scalable revenue.',
    previewType: 'marketing',
  },
  {
    id: 'products',
    num: '04',
    name: 'DIGITAL PRODUCTS',
    shortName: 'Products',
    tag: '55M+ CREATIVE ASSETS',
    metric: 'ALL-IN-ONE VAULT',
    statSub: 'Instant Lifetime Access',
    accentColor: '#a855f7',
    icon: '⚡',
    description: 'LUTs, studio sound effects, transitions, presets, and creator templates.',
    previewType: 'vault',
  },
  {
    id: 'scale',
    num: '05',
    name: 'BRAND GROWTH',
    shortName: 'Growth',
    tag: 'MARKET AUTHORITY',
    metric: '10M+ REACH',
    statSub: 'End-to-End Scale',
    accentColor: '#ffd400',
    icon: '🚀',
    description: 'Complete brand positioning and content partner to dominate your niche.',
    previewType: 'growth',
  },
]

export default function Hero3DScene({ splineUrl = null, className = '' }) {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const [activeId, setActiveId] = useState('content')
  const [, startTransition] = useTransition()

  // Auto-cycle through the 5 disciplines every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      startTransition(() => {
        setActiveId((prev) => {
          const idx = DISCIPLINES.findIndex((d) => d.id === prev)
          const nextIdx = (idx + 1) % DISCIPLINES.length
          return DISCIPLINES[nextIdx].id
        })
      })
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Smooth 60fps cursor parallax
  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return undefined

    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power2.out' })
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power2.out' })

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      rotateX(-ny * 12)
      rotateY(nx * 14)
    }

    const handleMouseLeave = () => {
      rotateX(0)
      rotateY(0)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const active = DISCIPLINES.find((d) => d.id === activeId) || DISCIPLINES[0]

  const handleSelect = (id) => {
    startTransition(() => {
      setActiveId(id)
    })
  }

  if (splineUrl) {
    return (
      <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
        <iframe
          src={splineUrl}
          title="SAN SHIFT 3D Scene"
          className="h-full w-full border-0 pointer-events-auto"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex w-full items-center justify-center py-4 select-none ${className}`}
      style={{ perspective: '1400px' }}
      aria-label="SAN SHIFT Creative Studio Showcase"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-10 h-72 w-72 rounded-full bg-brand-blue/15 blur-[90px] sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-10 h-64 w-64 rounded-full bg-brand-yellow/12 blur-[100px]"
      />

      {/* Main Studio Showcase Card */}
      <div
        ref={cardRef}
        className="relative z-20 w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] rounded-3xl bg-gradient-to-b from-[#131724]/95 via-[#0b0e17]/98 to-[#04060b] border border-white/20 p-3.5 sm:p-5 text-white shadow-[0_25px_70px_-15px_rgba(0,56,255,0.4),0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle glass reflection sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-brand-blue/20"
        />

        {/* Top Studio HUD Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
              <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
              <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
            </div>
            <span className="ml-1 font-mono text-[9px] font-black tracking-widest text-brand-blue-tint uppercase">
              SAN SHIFT // CREATIVE STUDIO
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[8px] font-bold text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PRO 4K LIVE</span>
          </div>
        </div>

        {/* Dynamic Studio Viewport Display */}
        <div className="relative z-10 my-3.5 overflow-hidden rounded-2xl border border-white/12 bg-black/60 p-4 shadow-inner">
          {/* Subtle colored backlight matching active mode */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full blur-3xl opacity-40 transition-all duration-500"
            style={{ backgroundColor: active.accentColor }}
          />

          {/* Mode Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-sm shadow-sm"
                style={{
                  backgroundColor: `${active.accentColor}20`,
                  borderColor: `${active.accentColor}40`,
                }}
              >
                <span>{active.icon}</span>
              </div>
              <div>
                <div className="font-mono text-[8px] font-bold uppercase tracking-wider text-white/50">
                  {active.tag}
                </div>
                <div className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                  {active.name}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className="font-display text-sm sm:text-base font-black tracking-tight"
                style={{ color: active.accentColor === '#ffd400' ? '#fde047' : active.accentColor }}
              >
                {active.metric}
              </div>
              <div className="font-mono text-[8px] text-white/50">{active.statSub}</div>
            </div>
          </div>

          {/* Interactive Visual Graphic Area based on Active Mode */}
          <div className="mt-3.5 rounded-xl border border-white/10 bg-[#07090e]/90 p-3">
            {active.previewType === 'reels' && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-blue to-cyan-400 text-xs shadow-sm">
                    📱
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white">Viral Reel Simulator</div>
                    <div className="text-[8px] font-mono text-emerald-400 font-bold">
                      94.2% Retention • Hook Architecture
                    </div>
                  </div>
                </div>
                {/* Animated soundwave bars */}
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-brand-blue rounded-full animate-pulse h-3" />
                  <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-5" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 bg-brand-blue rounded-full animate-pulse h-2" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-4" style={{ animationDelay: '200ms' }} />
                </div>
              </div>
            )}

            {active.previewType === 'timeline' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[8px] font-mono text-white/50">
                  <span>TIMELINE: 00:14:28 // 4K 60FPS</span>
                  <span className="text-sky-400 font-bold">REC.709 ➔ COLOR LUT</span>
                </div>
                {/* Multi-track Timeline Bars */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-sky-400 via-brand-blue to-purple-500" />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[65%] rounded-full bg-emerald-400" />
                </div>
              </div>
            )}

            {active.previewType === 'marketing' && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">
                    📈
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white">Meta &amp; Google Ad Scale</div>
                    <div className="text-[8px] font-mono text-emerald-400 font-bold">
                      ROAS: 5.4X • Scaled to 10M+ Views
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[8px] font-black text-emerald-400">
                  SCALE READY
                </span>
              </div>
            )}

            {active.previewType === 'vault' && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 text-xs border border-purple-500/30">
                    ⚡
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white">55M+ Editing Vault</div>
                    <div className="text-[8px] font-mono text-purple-300 font-bold">
                      LUTs • Sound FX • Transitions • Templates
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 font-mono text-[8px] font-black text-purple-300">
                  INSTANT
                </span>
              </div>
            )}

            {active.previewType === 'growth' && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30">
                    🚀
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white">Brand Growth Partner</div>
                    <div className="text-[8px] font-mono text-amber-300 font-bold">
                      Full Social Media &amp; Content Management
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[8px] font-black text-amber-300">
                  AUTHORITY
                </span>
              </div>
            )}
          </div>

          <p className="mt-2.5 text-[9px] sm:text-[10px] text-white/70 leading-relaxed">
            {active.description}
          </p>
        </div>

        {/* Clean, Non-Scrollable Category Dock (Zero Horizontal Scrollbars!) */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 border-t border-white/10 pt-3">
          {DISCIPLINES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleSelect(d.id)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                activeId === d.id
                  ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(0,56,255,0.6)] scale-103'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{d.icon}</span>
              <span>{d.shortName}</span>
            </button>
          ))}
        </div>

        {/* Subtle Brand Watermark at Bottom */}
        <div className="relative z-10 mt-3 flex items-center justify-between px-1 text-[8px] font-mono text-white/40">
          <div className="flex items-center gap-1.5">
            <img src={logoMark} alt="" className="h-3 w-3 object-contain opacity-60" />
            <span>SAN SHIFT ECOSYSTEM</span>
          </div>
          <a
            href="#services"
            className="text-brand-blue-tint hover:underline flex items-center gap-0.5 font-bold"
          >
            <span>Explore Details</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
