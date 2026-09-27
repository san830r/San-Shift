import { useState, useRef, useEffect, useCallback } from 'react'
import Reveal from './Reveal'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import DirectCheckoutModal from './DirectCheckoutModal'
import { useContent } from '../content/ContentContext'
import sanshiftReelVideo from '../assets/reels/sanshift-reel.mp4'

const TIMELINE_EVENTS = [
  { time: 1.2, label: '💥 Whoosh Hit SFX', type: 'sfx', color: 'bg-amber-400' },
  { time: 3.0, label: '🔥 Kinetic Text Hook', type: 'text', color: 'bg-emerald-400' },
  { time: 5.5, label: '🎬 Beat Drop Transition', type: 'vfx', color: 'bg-cyan-400' },
  { time: 7.8, label: '💎 4K Teal & Orange LUT', type: 'lut', color: 'bg-purple-400' },
]

export default function TimelineScrubberShowcase() {
  const { content } = useContent()
  const product =
    content.products.find((p) => p.id === content.site.featuredProductId) ?? content.products[0]

  const [currentTime, setCurrentTime] = useState(2.5) // 0 to 10 seconds
  const [isPlaying, setIsPlaying] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activePreset, setActivePreset] = useState('lut-cinematic')

  const timelineBarRef = useRef(null)
  const videoRef = useRef(null)

  const DURATION = 10 // 10 seconds loop

  // Keep video synchronized with timeline scrubber
  useEffect(() => {
    if (videoRef.current) {
      const v = videoRef.current
      if (Math.abs(v.currentTime - currentTime) > 0.3) {
        v.currentTime = currentTime % (v.duration || DURATION)
      }
    }
  }, [currentTime])

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return undefined

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.05
        return next >= DURATION ? 0 : next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handleScrub = useCallback((clientX) => {
    if (!timelineBarRef.current) return
    const rect = timelineBarRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    setCurrentTime(Number((percent * DURATION).toFixed(2)))
  }, [DURATION])

  const handlePointerDown = (e) => {
    setIsScrubbing(true)
    setIsPlaying(false)
    playClickSound()
    handleScrub(e.clientX || (e.touches && e.touches[0]?.clientX))
  }

  const handlePointerMove = useCallback((e) => {
    if (!isScrubbing) return
    handleScrub(e.clientX || (e.touches && e.touches[0]?.clientX))
  }, [isScrubbing, handleScrub])

  const handlePointerUp = useCallback(() => {
    setIsScrubbing(false)
  }, [])

  useEffect(() => {
    if (isScrubbing) {
      window.addEventListener('mousemove', handlePointerMove)
      window.addEventListener('touchmove', handlePointerMove)
      window.addEventListener('mouseup', handlePointerUp)
      window.addEventListener('touchend', handlePointerUp)
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchend', handlePointerUp)
    }
  }, [isScrubbing, handlePointerMove, handlePointerUp])

  const formatTimecode = (sec) => {
    const s = Math.floor(sec)
    const ms = Math.floor((sec % 1) * 60)
    return `00:00:0${s}:${ms < 10 ? '0' : ''}${ms}`
  }

  return (
    <section
      id="editing-suite"
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

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-3.5 py-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black/75 dark:text-white/80 shadow-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <span>THE EDITING STUDIO // LIVE NLE TIMELINE</span>
            </div>

            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-black dark:text-white">
              INSIDE THE <span className="animate-shimmer-text">SAN SHIFT TIMELINE</span>
            </h2>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-black/65 dark:text-white/70 font-sans">
              Experience the anatomical precision of a viral reel. Scrub through the multi-track timeline below to see how sound design, color grading, and kinetic overlays come together.
            </p>
          </Reveal>
        </div>

        {/* Studio NLE Suite Interface */}
        <Reveal delay={100}>
          <div className="rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/15 bg-[#0f131f] text-white shadow-[0_30px_90px_rgba(0,56,255,0.22)] overflow-hidden">
            {/* Window Top Bar (Mac / Premiere style) */}
            <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 border-b border-white/10 bg-[#090c15]">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500/80 inline-block shrink-0" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500/80 inline-block shrink-0" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500/80 inline-block shrink-0" />
                <span className="ml-1.5 sm:ml-3 font-mono text-[10px] sm:text-xs font-bold text-white/60 tracking-wider truncate max-w-[130px] xs:max-w-[220px] sm:max-w-none">
                  SAN_SHIFT_VIRAL_MASTER_v4.prproj • 4K UHD 60FPS
                </span>
              </div>

              {/* Timecode Badge */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs font-black text-cyan-400 tracking-widest bg-cyan-950/60 px-2 sm:px-2.5 py-1 rounded-lg border border-cyan-800/40">
                  {formatTimecode(currentTime)}
                </span>
              </div>
            </div>

            {/* Middle Section: Video Canvas + Inspector Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] border-b border-white/10">
              {/* Program Monitor (Video Player) */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                <video
                  ref={videoRef}
                  src={sanshiftReelVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`h-full w-full object-cover transition-all duration-300 ${
                    activePreset === 'lut-cinematic'
                      ? 'contrast-115 saturate-125'
                      : activePreset === 'lut-viral'
                      ? 'contrast-130 saturate-140 brightness-95'
                      : 'contrast-120 hue-rotate-15'
                  }`}
                />

                {/* Live Floating Captions Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-center pointer-events-none">
                  <span className="inline-block rounded-xl bg-black/80 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-display font-black uppercase tracking-tight text-brand-yellow shadow-xl border border-white/10">
                    {currentTime < 2.5
                      ? '💥 HOOK: STOP WASTING HOURS EDITING...'
                      : currentTime < 6.0
                      ? '⚡ CINEMATIC BEAT DROP + SFX SYNC'
                      : '🎬 SCALE YOUR RETENTION TO 85%+'}
                  </span>
                </div>

                {/* Overlaid Event Trigger Indicator */}
                {TIMELINE_EVENTS.map((ev) => {
                  const isActive = Math.abs(currentTime - ev.time) < 0.4
                  return isActive ? (
                    <div
                      key={ev.label}
                      className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/80 backdrop-blur-md px-3.5 py-1 border border-white/20 text-white text-[11px] font-mono font-bold animate-bounce"
                    >
                      <span className={`h-2 w-2 rounded-full ${ev.color} animate-ping`} />
                      <span>TRIGGERED: {ev.label}</span>
                    </div>
                  ) : null
                })}
              </div>

              {/* Right Panel: NLE Asset Inspector & Preset Switcher */}
              <div className="p-5 sm:p-6 bg-[#0c101c] flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/60">
                      Layer Inspector
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      ACTIVE
                    </span>
                  </div>

                  {/* Active Preset Selector */}
                  <div className="mt-4">
                    <label className="block text-[11px] font-mono text-white/50 uppercase mb-2">
                      Active Color LUT Preset:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound()
                          setActivePreset('lut-cinematic')
                        }}
                        className={`rounded-xl px-2.5 py-2 text-[11px] font-mono font-bold transition-all cursor-pointer text-center ${
                          activePreset === 'lut-cinematic'
                            ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/40 border border-white/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        🎬 4K Film
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound()
                          setActivePreset('lut-viral')
                        }}
                        className={`rounded-xl px-2.5 py-2 text-[11px] font-mono font-bold transition-all cursor-pointer text-center ${
                          activePreset === 'lut-viral'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40 border border-white/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        🔥 Hormozi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound()
                          setActivePreset('lut-teal')
                        }}
                        className={`rounded-xl px-2.5 py-2 text-[11px] font-mono font-bold transition-all cursor-pointer text-center ${
                          activePreset === 'lut-teal'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 border border-white/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        💎 Hollywood
                      </button>
                    </div>
                  </div>

                  {/* Preset Asset Specs */}
                  <div className="mt-5 space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-white/40">Sound Library:</span>
                      <span className="text-white font-bold">55M+ Master FX Vault</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-white/40">Playback Res:</span>
                      <span className="text-cyan-400 font-bold">3840 x 2160 (Full 4K)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-white/40">Compatibility:</span>
                      <span className="text-emerald-400 font-bold">CapCut / Pr / Ae / FCP</span>
                    </div>
                  </div>
                </div>

                {/* Instant Action CTA */}
                <button
                  type="button"
                  onClick={() => {
                    playChimeSound()
                    setCheckoutOpen(true)
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-blue-dark hover:brightness-110 active:scale-95 text-white px-4 py-3 sm:px-5 sm:py-3.5 text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-blue/40 transition-all cursor-pointer"
                >
                  <span>⚡ UNLOCK FULL MASTER PACK — ₹99</span>
                </button>
              </div>
            </div>

            {/* Bottom Section: Multi-Track Timeline Editor */}
            <div className="p-3.5 sm:p-6 bg-[#070911]">
              {/* Transport Controls & Ruler */}
              <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setIsPlaying(!isPlaying)
                    }}
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-brand-blue text-white transition-colors cursor-pointer text-xs sm:text-sm"
                  >
                    <span>{isPlaying ? '⏸' : '▶'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setCurrentTime(0)
                      setIsPlaying(false)
                    }}
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors cursor-pointer text-xs"
                  >
                    <span>⏮</span>
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-mono text-white/50 ml-1 sm:ml-2 hidden xs:inline">
                    Click &amp; drag scrubber below
                  </span>
                </div>

                <div className="text-[10px] sm:text-[11px] font-mono text-white/50">
                  Total: <span className="text-white font-bold">10.00s</span>
                </div>
              </div>

              {/* Timeline Tracks Box */}
              <div
                ref={timelineBarRef}
                onMouseDown={handlePointerDown}
                onTouchStart={handlePointerDown}
                className="relative select-none rounded-xl sm:rounded-2xl border border-white/10 bg-[#0c101c] p-2 sm:p-3 space-y-1.5 sm:space-y-2 cursor-ew-resize touch-none overflow-hidden"
              >
                {/* TRACK 1: V2 - Kinetic Captions & Motion Graphics */}
                <div className="relative h-7 sm:h-8 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center px-2 sm:px-3 overflow-hidden">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-purple-300 shrink-0 mr-2 sm:mr-3">
                    <span className="hidden xs:inline">V2: Subtitles &amp; VFX</span>
                    <span className="xs:hidden">V2: VFX</span>
                  </span>
                  <div className="absolute left-[30%] w-[45%] sm:w-[35%] h-5 rounded bg-purple-600/40 border border-purple-400/50 flex items-center px-1.5 sm:px-2 text-[8px] sm:text-[9px] font-mono text-white truncate">
                    Kinetic Text Hook.mogrt
                  </div>
                </div>

                {/* TRACK 2: V1 - 4K A-Roll Footage */}
                <div className="relative h-7 sm:h-8 rounded-lg bg-blue-950/40 border border-blue-800/40 flex items-center px-2 sm:px-3 overflow-hidden">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-blue-300 shrink-0 mr-2 sm:mr-3">
                    <span className="hidden xs:inline">V1: 4K A-Roll</span>
                    <span className="xs:hidden">V1: Video</span>
                  </span>
                  <div className="absolute left-0 right-0 h-5 rounded bg-blue-600/30 border border-blue-400/40 flex items-center px-1.5 sm:px-2 text-[8px] sm:text-[9px] font-mono text-white truncate">
                    SAN_SHIFT_RAW_A_ROLL.mov (Rec.709 Mastered)
                  </div>
                </div>

                {/* TRACK 3: A1 - Dialogue Audio */}
                <div className="relative h-7 sm:h-8 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center px-2 sm:px-3 overflow-hidden">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-300 shrink-0 mr-2 sm:mr-3">
                    <span className="hidden xs:inline">A1: Voiceover</span>
                    <span className="xs:hidden">A1: Audio</span>
                  </span>
                  {/* Fake Audio Waveform bars */}
                  <div className="flex items-center gap-[2px] h-full opacity-60 flex-1 ml-2 sm:ml-4 overflow-hidden">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[2px] bg-emerald-400 rounded-full shrink-0"
                        style={{ height: `${20 + ((i * 7) % 70)}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* TRACK 4: A2 - Sound Effects & Boom */}
                <div className="relative h-7 sm:h-8 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center px-2 sm:px-3 overflow-hidden">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-300 shrink-0 mr-2 sm:mr-3">
                    <span className="hidden xs:inline">A2: SFX &amp; Sub</span>
                    <span className="xs:hidden">A2: SFX</span>
                  </span>
                  <div className="absolute left-[12%] w-[24%] sm:w-[16%] h-5 rounded bg-amber-600/40 border border-amber-400/50 flex items-center px-1 text-[8px] font-mono text-white truncate">
                    Whoosh.wav
                  </div>
                  <div className="absolute left-[55%] w-[28%] sm:w-[20%] h-5 rounded bg-amber-600/40 border border-amber-400/50 flex items-center px-1 text-[8px] font-mono text-white truncate">
                    Bass_Riser.wav
                  </div>
                </div>

                {/* Interactive Red/Cyan Playhead Line */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none will-change-[left]"
                  style={{ left: `${(currentTime / DURATION) * 100}%` }}
                >
                  <div className="h-full w-[2px] bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                  <div className="absolute top-0 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-cyan-400 rounded-sm rotate-45 shadow-[0_0_8px_#22d3ee]" />
                </div>
              </div>
            </div>
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
