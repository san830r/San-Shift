import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'

export default function MarketingRadar3D({ goal = 'ecommerce' }) {
  const containerRef = useRef(null)
  const rigRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const container = containerRef.current
    const rig = rigRef.current
    if (!container || !rig) return undefined

    const rotateX = gsap.quickTo(rig, 'rotationX', { duration: 0.6, ease: 'power2.out' })
    const rotateY = gsap.quickTo(rig, 'rotationY', { duration: 0.6, ease: 'power2.out' })

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      // Isometric base tilt is 52deg X, -18deg Z. We adjust around that
      rotateX(52 - ny * 18)
      rotateY(nx * 22)
    }

    const handleMouseLeave = () => {
      rotateX(52)
      rotateY(0)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ perspective: '1100px' }}
      className="relative flex items-center justify-center py-6 px-4 cursor-crosshair select-none"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl"
      />

      {/* 3D Isometric Rig */}
      <div
        ref={rigRef}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(52deg) rotateZ(-18deg)',
          willChange: 'transform',
        }}
        className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center transition-transform duration-100 ease-out"
      >
        {/* Ring 1 (Outer - Meta Ads): 260px */}
        <div
          style={{ transform: 'translateZ(0px)' }}
          className="absolute h-60 w-60 sm:h-64 sm:w-64 rounded-full border border-sky-400/30 dark:border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.15)] animate-[spin_24s_linear_infinite]"
        >
          {/* Orbiting Meta Satellite */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-sky-500/90 text-white px-2.5 py-0.5 shadow-[0_0_12px_#0284c7] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            <span className="font-mono text-[9px] font-black tracking-wider">META ADS</span>
          </div>
        </div>

        {/* Ring 2 (Middle - Google Search): 190px */}
        <div
          style={{ transform: 'translateZ(14px)' }}
          className="absolute h-44 w-44 sm:h-48 sm:w-48 rounded-full border border-dashed border-emerald-400/40 dark:border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.15)] animate-[spin_16s_linear_infinite_reverse]"
        >
          {/* Orbiting Google Satellite */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-emerald-600/90 text-white px-2.5 py-0.5 shadow-[0_0_12px_#059669] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[9px] font-black tracking-wider">GOOGLE ROI</span>
          </div>
        </div>

        {/* Ring 3 (Inner - TikTok / Short-form): 120px */}
        <div
          style={{ transform: 'translateZ(26px)' }}
          className="absolute h-28 w-28 sm:h-32 sm:w-32 rounded-full border border-purple-400/40 dark:border-purple-400/50 shadow-[0_0_20px_rgba(192,132,252,0.2)] animate-[spin_10s_linear_infinite]"
        >
          {/* Orbiting TikTok Satellite */}
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex items-center gap-1 rounded-full bg-purple-600/90 text-white px-2 py-0.5 shadow-[0_0_10px_#9333ea]">
            <span className="font-mono text-[8px] font-black">VIRAL REELS</span>
          </div>
        </div>

        {/* Center Core: Conversion Dynamo (translateZ: 38px) */}
        <div
          style={{ transform: 'translateZ(38px)' }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-brand-blue via-emerald-500 to-cyan-400 p-0.5 shadow-[0_0_35px_rgba(16,185,129,0.5)]"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0f1d] text-center">
            <div className="text-center leading-none">
              <span className="block text-xs font-black text-emerald-400">ROI</span>
              <span className="block font-mono text-[8px] font-extrabold text-white/70">CORE</span>
            </div>
          </div>
          {/* Radiating pulse ring */}
          <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-30" />
        </div>

        {/* Floating Telemetry Chip 1 (Top Left, translateZ: 58px) */}
        <div
          style={{
            transform: 'translate3d(-55px, -70px, 58px)',
          }}
          className="pointer-events-none absolute flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-black/90 px-3 py-1.5 backdrop-blur-md shadow-2xl text-white"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <div className="text-left leading-tight">
            <span className="block font-mono text-[8px] uppercase tracking-wider text-emerald-400 font-bold">
              AVG ROAS
            </span>
            <span className="block font-display text-xs font-black">
              {goal === 'personal' ? '10x REACH' : '5.4x BLENDED'}
            </span>
          </div>
        </div>

        {/* Floating Telemetry Chip 2 (Bottom Right, translateZ: 68px) */}
        <div
          style={{
            transform: 'translate3d(55px, 60px, 68px)',
          }}
          className="pointer-events-none absolute flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-black/90 px-3 py-1.5 backdrop-blur-md shadow-2xl text-white"
        >
          <span className="flex h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
          <div className="text-left leading-tight">
            <span className="block font-mono text-[8px] uppercase tracking-wider text-sky-400 font-bold">
              CONV RATE
            </span>
            <span className="block font-display text-xs font-black">4.8% CTR (TOP 1%)</span>
          </div>
        </div>

        {/* Floating Telemetry Chip 3 (Top Right, translateZ: 48px) */}
        <div
          style={{
            transform: 'translate3d(60px, -50px, 48px)',
          }}
          className="pointer-events-none absolute hidden sm:flex items-center gap-1.5 rounded-xl border border-purple-400/40 bg-black/90 px-2.5 py-1 backdrop-blur-md shadow-2xl text-white text-[10px] font-bold"
        >
          <span className="text-purple-400">⚡</span>
          <span className="font-mono text-[9px] text-purple-200">CPA -38% LOWER</span>
        </div>
      </div>
    </div>
  )
}
