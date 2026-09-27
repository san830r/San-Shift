import { useState, useRef, useCallback, useEffect } from 'react'
import Reveal from './Reveal'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import DirectCheckoutModal from './DirectCheckoutModal'
import { useContent } from '../content/ContentContext'
import sanshiftReelVideo from '../assets/reels/sanshift-reel.mp4'

export default function BeforeAfterShowcase() {
  const { content } = useContent()
  const product =
    content.products.find((p) => p.id === content.site.featuredProductId) ?? content.products[0]

  const [sliderPos, setSliderPos] = useState(50) // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false)
  const [activeFilter, setActiveFilter] = useState('cinematic') // 'cinematic' | 'blockbuster' | 'tealorange'
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const containerRef = useRef(null)
  const videoBeforeRef = useRef(null)
  const videoAfterRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Track container width for pixel-perfect video alignment
  useEffect(() => {
    if (!containerRef.current) return
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    const ro = new ResizeObserver(updateWidth)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Keep both before & after videos playing in perfect sync
  useEffect(() => {
    const v1 = videoBeforeRef.current
    const v2 = videoAfterRef.current
    if (!v1 || !v2) return

    const syncVideos = () => {
      if (Math.abs(v1.currentTime - v2.currentTime) > 0.08) {
        v2.currentTime = v1.currentTime
      }
    }

    v1.addEventListener('timeupdate', syncVideos)
    return () => v1.removeEventListener('timeupdate', syncVideos)
  }, [])

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setSliderPos(percent)
  }, [])

  const handleTouchMove = (e) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handlePointerDown = (e) => {
    setIsDragging(true)
    handleMove(e.clientX || (e.touches && e.touches[0]?.clientX))
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handlePointerUp)
      window.addEventListener('touchend', handlePointerUp)
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleTouchMove)
    }
    return () => {
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchend', handlePointerUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging, handleMouseMove, handleTouchMove])

  return (
    <section
      id="before-after"
      className="relative overflow-hidden bg-brand-offwhite dark:bg-[#070a13] text-black dark:text-white py-24 sm:py-32 border-t border-black/5 dark:border-white/5 transition-colors duration-300"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-brand-blue/10 dark:bg-brand-blue/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-purple-600/10 dark:bg-purple-600/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black/70 dark:text-white/80 shadow-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span>THE EDITING STANDARD // INTERACTIVE COMPARISON</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-black dark:text-white">
              SEE THE <span className="animate-shimmer-text">TRANSFORMATION</span> IN REAL TIME
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-black/65 dark:text-white/70 font-sans">
              Drag the interactive slider below to witness how SAN SHIFT grades flat, lifeless raw camera footage into high-retention 4K cinematic mastery.
            </p>
          </Reveal>

          {/* Quick Style Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setActiveFilter('cinematic')
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                activeFilter === 'cinematic'
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 scale-105'
                  : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10'
              }`}
            >
              🎬 4K Film Grade
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setActiveFilter('blockbuster')
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                activeFilter === 'blockbuster'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                  : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10'
              }`}
            >
              🔥 High-Contrast Viral Hook
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setActiveFilter('tealorange')
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                activeFilter === 'tealorange'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105'
                  : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10'
              }`}
            >
              💎 Hollywood Teal &amp; Orange
            </button>
          </div>
        </div>

        {/* Interactive Comparison Split Frame */}
        <Reveal delay={100} className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            className="relative select-none aspect-video sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border-2 border-black/10 dark:border-white/15 bg-black shadow-[0_30px_90px_rgba(0,56,255,0.22)] cursor-ew-resize touch-none"
          >
            {/* LAYER 1: AFTER (SAN SHIFT Cinematic Grade) - Full Width Background */}
            <div className="absolute inset-0 w-full h-full">
              <video
                ref={videoAfterRef}
                src={sanshiftReelVideo}
                autoPlay
                loop
                muted
                playsInline
                className={`h-full w-full object-cover transition-all duration-500 ${
                  activeFilter === 'cinematic'
                    ? 'contrast-115 saturate-125 brightness-100'
                    : activeFilter === 'blockbuster'
                    ? 'contrast-130 saturate-140 brightness-95 hue-rotate-5'
                    : 'contrast-120 saturate-135 hue-rotate-15'
                }`}
              />
              {/* After Badge */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-black/70 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                <span>SAN SHIFT 4K GRADE (AFTER)</span>
              </div>
            </div>

            {/* LAYER 2: BEFORE (Raw Flat LOG Footage) - Clipped Left Side */}
            <div
              className="absolute inset-0 h-full overflow-hidden will-change-[width]"
              style={{ width: `${sliderPos}%` }}
            >
              <div
                className="absolute inset-0 h-full"
                style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
              >
                <video
                  ref={videoBeforeRef}
                  src={sanshiftReelVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover grayscale-[70%] contrast-[80%] brightness-[105%]"
                />
              </div>

              {/* Before Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-xl bg-black/70 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-lg">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>RAW CAMERA (BEFORE)</span>
              </div>
            </div>

            {/* LAYER 3: Interactive Glass Split-Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 flex flex-col items-center pointer-events-none will-change-[left]"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Vertical Laser Divider Line */}
              <div className="w-[3px] h-full bg-gradient-to-b from-brand-blue via-white to-brand-blue shadow-[0_0_12px_rgba(0,56,255,0.8)]" />

              {/* Frosted Center Pill Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-white/80 bg-black/80 backdrop-blur-xl text-white shadow-[0_0_24px_rgba(0,56,255,0.6)] cursor-ew-resize transition-transform duration-150 hover:scale-110 active:scale-95">
                <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest flex items-center gap-1">
                  <span>◀</span>
                  <span>▶</span>
                </span>
              </div>
            </div>

            {/* Bottom Tip Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none rounded-full bg-black/60 backdrop-blur-md px-4 py-1 border border-white/10 text-[11px] font-mono font-bold text-white/80">
              👈 Drag slider left &amp; right to compare 👉
            </div>
          </div>

          {/* Under-Slider Feature Stats Bar */}
          <div className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <span className="block text-brand-blue font-display text-2xl font-black">100%</span>
              <span className="text-[11px] font-mono text-black/60 dark:text-white/60 uppercase">Cinematic Precision</span>
            </div>
            <div>
              <span className="block text-emerald-500 font-display text-2xl font-black">&gt; 85%</span>
              <span className="text-[11px] font-mono text-black/60 dark:text-white/60 uppercase">3s Watch Retention</span>
            </div>
            <div>
              <span className="block text-purple-500 font-display text-2xl font-black">55M+</span>
              <span className="text-[11px] font-mono text-black/60 dark:text-white/60 uppercase">Assets in Vault</span>
            </div>
            <div>
              <span className="block text-brand-yellow font-display text-2xl font-black">4K UHD</span>
              <span className="text-[11px] font-mono text-black/60 dark:text-white/60 uppercase">Export Mastered</span>
            </div>
          </div>

          {/* Call to action trigger */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                playChimeSound()
                setCheckoutOpen(true)
              }}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-dark hover:brightness-110 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-brand-blue/40 transition-all hover:scale-102 active:scale-95 cursor-pointer"
            >
              <span>Get the 55M+ Master Editing Bundle — Just ₹99</span>
              <span>→</span>
            </button>
          </div>
        </Reveal>
      </div>

      {/* Direct Checkout Modal */}
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
