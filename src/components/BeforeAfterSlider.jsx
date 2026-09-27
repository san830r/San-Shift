import { useState, useRef, useCallback, useEffect } from 'react'
import { playClickSound } from '../lib/soundFx'
import { openSmartWhatsAppModal } from './SmartWhatsAppModal'
import InteractiveTimeline from './InteractiveTimeline'

const PRESETS = [
  {
    id: 'cinematic',
    title: 'Cinematic Color Grade',
    desc: 'Flat S-Log3 RAW transformed into rich Arri Alexa teal-and-orange cinematic depth.',
    tag: 'COLOR GRADING',
    beforeLabel: 'RAW S-LOG3 FLAT',
    afterLabel: 'SAN SHIFT CINEMATIC LUT',
    stat: '+340% Dynamic Contrast',
  },
  {
    id: 'motion',
    title: 'Viral Reel Retention Edit',
    desc: 'Boring talking head footage upgraded with kinetic typography, zoom punch-ins & 3D depth.',
    tag: 'MOTION GRAPHICS',
    beforeLabel: 'STATIC RAW CLIP',
    afterLabel: 'VIRAL HOOK + KINETIC SFX',
    stat: '+182% Watch Time',
  },
  {
    id: 'product',
    title: '3D Product Visualization',
    desc: 'Plain 2D mockup converted into floating 3D anti-gravity interactive showcase.',
    tag: '3D VFX & PACKAGING',
    beforeLabel: 'PLAIN FLAT MOCKUP',
    afterLabel: '3D ANTI-GRAVITY RENDER',
    stat: '4.8x Higher Conversion',
  },
]

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50) // percentage 0 - 100
  const [activePreset, setActivePreset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState('slider') // 'slider' | 'timeline'
  const containerRef = useRef(null)

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percent)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }, [handleMove])

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMove])

  const preset = PRESETS[activePreset]

  return (
    <section id="comparison" className="relative py-24 sm:py-32 bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 overflow-hidden border-t border-black/5 dark:border-white/5">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-brand-blue/6 dark:bg-brand-blue/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 dark:bg-brand-blue/15 px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-brand-blue">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-ping" />
              <span>Interactive Quality Showcase</span>
            </div>
            <h2 className="mt-3 sm:mt-4 font-display text-2xl xs:text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-black dark:text-white leading-[1.05]">
              RAW FOOTAGE VS. <br />
              <span className="text-brand-blue">SAN SHIFT STANDARD.</span>
            </h2>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-black/60 dark:text-white/60 font-medium">
              Interact with the slider or scrub the multi-track studio timeline to witness how we transform raw assets into high-converting masterpieces.
            </p>
          </div>

          {/* Mode Switcher & Presets */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 p-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setViewMode('slider')
                }}
                data-cursor="COMPARE"
                className={`rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                  viewMode === 'slider'
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                    : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                }`}
              >
                ⚡ Compare Slider
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setViewMode('timeline')
                }}
                data-cursor="TIMELINE"
                className={`rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                }`}
              >
                🎬 Studio Scrubber
              </button>
            </div>

            {/* Presets (Only when in slider mode) */}
            {viewMode === 'slider' && (
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setActivePreset(idx)
                      setSliderPos(50)
                    }}
                    data-cursor="CLICK"
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                      activePreset === idx
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 scale-102'
                        : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20'
                    }`}
                  >
                    {p.tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display Container: Slider OR Interactive Timeline Workstation */}
        <div className="relative mx-auto max-w-5xl">
          {viewMode === 'timeline' ? (
            <InteractiveTimeline />
          ) : (
            <div className="relative rounded-3xl border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 p-2 sm:p-4 shadow-2xl backdrop-blur-xl">
              
              {/* Top Toolbar / Monitor Header */}
              <div className="flex items-center justify-between px-3 py-2 text-[11px] font-mono text-black/40 dark:text-white/40 border-b border-black/5 dark:border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-bold text-black/70 dark:text-white/70 uppercase">
                    MONITOR // {preset.tag}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline bg-brand-blue/10 dark:bg-brand-blue/30 text-brand-blue px-2 py-0.5 rounded font-black text-[10px]">
                    {preset.stat}
                  </span>
                  <span className="font-semibold text-black/60 dark:text-white/60">
                    SLIDER: {Math.round(sliderPos)}%
                  </span>
                </div>
              </div>

              {/* Slider Viewport */}
              <div
                ref={containerRef}
                data-cursor="DRAG"
                onMouseDown={() => setIsDragging(true)}
                onTouchMove={handleTouchMove}
                className="relative aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl select-none cursor-ew-resize border border-black/5 dark:border-white/10 bg-[#0c101c]"
              >
                {/* === AFTER LAYER (Full Width Underneath) === */}
                <div className="absolute inset-0 flex flex-col justify-between p-3.5 xs:p-5 sm:p-10 overflow-hidden bg-gradient-to-br from-[#020b24] via-[#09153a] to-[#040714] text-white">
                  {/* Visual Elements for "AFTER / SAN SHIFT" */}
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 75% 30%, rgba(0, 56, 255, 0.7) 0%, transparent 60%), radial-gradient(circle at 25% 75%, rgba(255, 212, 0, 0.25) 0%, transparent 45%)'
                    }}
                  />

                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

                  {/* Center Showcase Graphic */}
                  <div className="relative z-10 my-auto text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-yellow shadow-[0_0_15px_rgba(255,212,0,0.3)]">
                      ★ 4K HDR • 60 FPS • MASTER RENDER
                    </div>
                    <h3 className="mt-2.5 sm:mt-4 font-display text-lg xs:text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,56,255,0.6)]">
                      SHIFT THE STANDARD.
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-[11px] xs:text-xs sm:text-sm font-semibold text-brand-blue-tint/90 max-w-md line-clamp-2 sm:line-clamp-none">
                      {preset.desc}
                    </p>

                    {/* Sound Wave / Timeline Mockup */}
                    <div className="mt-3 sm:mt-6 flex items-center gap-1 sm:gap-1.5 h-6 sm:h-8">
                      {[35, 75, 45, 90, 60, 100, 70, 85, 40, 95, 80, 55, 90, 70, 45, 80, 100, 60, 40, 75, 90, 60, 30].map((h, i) => (
                        <span
                          key={i}
                          className="w-0.5 sm:w-1 rounded-full bg-brand-blue transition-all"
                          style={{ height: `${h}%`, opacity: 0.5 + (h / 200) }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* After Badge Top Right */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/40 border border-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow animate-pulse" />
                      {preset.afterLabel}
                    </span>
                  </div>
                </div>

                {/* === BEFORE LAYER (Clipped by slider position) === */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white/90 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20 select-none"
                  style={{ width: `${sliderPos}%` }}
                >
                  <div
                    className="absolute inset-y-0 left-0 flex flex-col justify-between p-3.5 xs:p-5 sm:p-10 bg-[#2b2f38] text-white/70"
                    style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                  >
                    <div className="absolute inset-0 bg-[#353942] opacity-95 pointer-events-none" />

                    <div className="relative z-10 my-auto text-center flex flex-col items-center opacity-60 grayscale">
                      <div className="inline-block rounded border border-white/20 bg-white/5 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white/50">
                        RAW UNGRADED FOOTAGE • 720P
                      </div>
                      <h3 className="mt-2.5 sm:mt-4 font-display text-lg xs:text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white/40">
                        AVERAGE INDUSTRY LOOK
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-[11px] xs:text-xs sm:text-sm font-mono text-white/40 max-w-md line-clamp-2 sm:line-clamp-none">
                        Flat contrast, uninspired pacing, static cuts, low retention rate.
                      </p>

                      <div className="mt-3 sm:mt-6 flex items-center gap-1 sm:gap-1.5 h-6 sm:h-8 opacity-30">
                        {[20, 25, 20, 30, 25, 30, 20, 25, 20, 30, 25, 20, 25, 20, 30, 25, 20].map((h, i) => (
                          <span
                            key={i}
                            className="w-0.5 sm:w-1 rounded-full bg-white"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-mono uppercase tracking-wider text-white/80 border border-white/10">
                        {preset.beforeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* === DRAGGABLE SLIDER HANDLE === */}
                <div
                  className="absolute top-0 bottom-0 z-30 flex items-center justify-center -translate-x-1/2 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-black shadow-[0_0_24px_rgba(0,56,255,0.7)] border-2 border-brand-blue transition-transform hover:scale-110 active:scale-95">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className="font-bold text-[10px] sm:text-xs text-brand-blue">◀</span>
                      <span className="h-3.5 sm:h-4 w-px bg-black/20" />
                      <span className="font-bold text-[10px] sm:text-xs text-brand-blue">▶</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Caption Strip */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3 py-2 text-xs text-black/60 dark:text-white/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-handwriting text-lg sm:text-xl text-brand-blue">Drag slider left &amp; right to compare</span>
                  <span className="hidden sm:inline text-black/30 dark:text-white/30">|</span>
                  <span className="font-semibold text-black/80 dark:text-white/80">{preset.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    openSmartWhatsAppModal('reels')
                  }}
                  className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-blue hover:underline"
                >
                  <span>Request Custom Edit Sample</span>
                  <span>⚡</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  )
}
