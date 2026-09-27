import { useState, useRef, useEffect, useCallback } from 'react'
import { playClickSound } from '../lib/soundFx'
import AudioEqualizer from './AudioEqualizer'

const CLIPS = [
  {
    id: 1,
    start: 0,
    end: 28,
    track: 'V2',
    name: '3D_HOOK_INTRO.mov',
    color: 'bg-brand-blue/80 border-brand-blue text-white',
    title: 'Dynamic 3D Kinetic Hook',
    tag: 'RETENTION HOOK • +182% RETENTION',
    visualDesc: 'Explosive 3D text shatter + Arri Alexa orange/blue grade',
  },
  {
    id: 2,
    start: 28,
    end: 62,
    track: 'V2',
    name: 'KINETIC_CAPTIONS.mogr',
    color: 'bg-brand-yellow/85 border-brand-yellow text-black font-black',
    title: 'Hormozi-Style Kinetic Typography',
    tag: 'ENGAGEMENT • AUDIO-SYNCED',
    visualDesc: 'Sub-frame accurate bounce subtitles with impact SFX',
  },
  {
    id: 3,
    start: 62,
    end: 100,
    track: 'V2',
    name: 'PRODUCT_3D_LOOP.mp4',
    color: 'bg-emerald-500/80 border-emerald-400 text-white',
    title: 'Anti-Gravity Product Visualizer',
    tag: 'CONVERSION • 4.8x SALES LIFT',
    visualDesc: 'Floating 3D packaging with metallic reflections',
  },
]

export default function InteractiveTimeline() {
  const [playheadPos, setPlayheadPos] = useState(38) // 0 to 100 percentage
  const [isPlaying, setIsPlaying] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const timelineRef = useRef(null)

  // Current active clip based on playhead position
  const activeClip = CLIPS.find((c) => playheadPos >= c.start && playheadPos < c.end) || CLIPS[0]

  // Convert percentage to timecode (HH:MM:SS:FF at 24fps, total length 15s)
  const totalSeconds = (playheadPos / 100) * 15
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const frames = Math.floor((totalSeconds % 1) * 24)
  const formattedTimecode = `00:0${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${frames < 10 ? '0' : ''}${frames}`

  const updateScrub = useCallback((clientX) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPlayheadPos(percent)
  }, [])

  useEffect(() => {
    const handleMove = (e) => {
      if (isScrubbing) {
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX)
        if (clientX !== undefined) updateScrub(clientX)
      }
    }
    const handleUp = () => setIsScrubbing(false)

    if (isScrubbing) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleUp)
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [isScrubbing, updateScrub])

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setPlayheadPos((prev) => (prev >= 99 ? 0 : prev + 0.8))
    }, 40)
    return () => clearInterval(interval)
  }, [isPlaying])

  const togglePlayback = () => {
    playClickSound()
    setIsPlaying((prev) => !prev)
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-[#0c101c] text-white p-3.5 sm:p-7 shadow-2xl overflow-hidden font-sans select-none">
      
      {/* Top Application Bar (DaVinci / Premiere Style) */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 text-xs font-mono text-white/50">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500/80 shrink-0" />
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500/80 shrink-0" />
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500/80 shrink-0" />
          <span className="ml-1.5 sm:ml-2 font-bold text-white uppercase text-[10px] sm:text-[11px] truncate max-w-[120px] xs:max-w-none">
            SAN SHIFT // TIMELINE PRO
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="bg-brand-blue/30 text-brand-blue-tint px-2 sm:px-2.5 py-0.5 rounded font-mono font-bold text-[10px] sm:text-[11px] border border-brand-blue/40">
            {formattedTimecode}
          </span>
          <span className="hidden sm:inline text-white/40 text-[10px]">24.00 FPS • 4K HDR</span>
        </div>
      </div>

      {/* Center Live Program Monitor */}
      <div className="relative mt-3 sm:mt-4 aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl sm:rounded-2xl bg-[#05070e] border border-white/10 overflow-hidden flex flex-col justify-between p-3.5 xs:p-5 sm:p-8">
        {/* Background Film Grain & Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,56,255,0.2)_0%,transparent_70%)] pointer-events-none" />

        {/* Top Monitor Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-brand-yellow">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow animate-ping" />
            {activeClip.tag}
          </span>

          <AudioEqualizer active={isPlaying || isScrubbing} barCount={6} />
        </div>

        {/* Center Frame Visual Title */}
        <div className="relative z-10 text-center my-auto">
          <h4 className="font-display text-lg xs:text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,56,255,0.8)]">
            {activeClip.title}
          </h4>
          <p className="mt-1.5 sm:mt-2 text-[11px] xs:text-xs sm:text-sm font-medium text-white/70 max-w-md mx-auto line-clamp-2 sm:line-clamp-none">
            {activeClip.visualDesc}
          </p>
        </div>

        {/* Bottom Monitor Transport Controls */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/60">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              data-cursor="PLAY"
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-brand-blue text-white shadow-md shadow-brand-blue/40 hover:bg-brand-blue-dark active:scale-95 text-xs"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <span className="text-[10px] sm:text-[11px] font-bold text-white/80">
              {isPlaying ? 'PLAYING' : 'PAUSED'}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-white/40 hidden xs:inline">
            DRAG RED PLAYHEAD TO SCRUB
          </span>
        </div>
      </div>

      {/* Scrubbable Multi-Track Timeline */}
      <div className="relative mt-4 sm:mt-5 pt-3 border-t border-white/10">
        
        {/* Track Headers */}
        <div className="space-y-1 sm:space-y-2 mb-2 font-mono text-[9px] sm:text-[10px] text-white/40">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-blue">TRACK V2 // MOTION GRAPHICS</span>
            <span className="truncate max-w-[120px] xs:max-w-none">CLIP: {activeClip.name}</span>
          </div>
        </div>

        {/* Interactive Scrub Area */}
        <div
          ref={timelineRef}
          onMouseDown={() => setIsScrubbing(true)}
          onTouchStart={(e) => {
            setIsScrubbing(true)
            if (e.touches.length > 0) updateScrub(e.touches[0].clientX)
          }}
          data-cursor="SCRUB"
          className="relative h-24 sm:h-28 w-full rounded-xl bg-[#070a14] border border-white/10 p-1.5 sm:p-2 cursor-ew-resize select-none overflow-hidden touch-none"
        >
          {/* Timeline Grid Ticks */}
          <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-20">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-full w-px bg-white/40" />
            ))}
          </div>

          {/* V2 Video Track (Cuts) */}
          <div className="relative h-7 w-full flex gap-1 mb-2 z-10">
            {CLIPS.map((clip) => {
              const width = clip.end - clip.start
              return (
                <div
                  key={clip.id}
                  className={`h-full rounded border px-2 flex items-center justify-between text-[9px] font-bold truncate transition-opacity ${clip.color} ${
                    activeClip.id === clip.id ? 'opacity-100 ring-1 ring-white' : 'opacity-70'
                  }`}
                  style={{ width: `${width}%` }}
                >
                  <span className="truncate">{clip.name}</span>
                </div>
              )
            })}
          </div>

          {/* V1 Base Video Track */}
          <div className="relative h-6 w-full rounded border border-blue-500/30 bg-blue-900/40 text-[9px] font-mono text-blue-200/70 px-2 flex items-center mb-2 z-10">
            <span>V1 // 4K_RAW_MASTER_FOOTAGE.mov</span>
          </div>

          {/* A1 Audio Track with Waveform Visualizer */}
          <div className="relative h-6 w-full rounded border border-purple-500/30 bg-purple-900/40 text-[9px] font-mono text-purple-200/70 px-2 flex items-center justify-between z-10">
            <span>A1 // DIALOGUE_SFX_MASTER.wav</span>
            <div className="flex items-center gap-0.5 h-3 opacity-60">
              {[40, 80, 50, 100, 70, 90, 40, 60, 90, 70, 50, 80, 60, 40].map((h, i) => (
                <span key={i} className="w-0.5 rounded-full bg-purple-300" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Draggable Red Playhead Line */}
          <div
            className="absolute top-0 bottom-0 z-30 w-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] pointer-events-none"
            style={{ left: `${playheadPos}%` }}
          >
            {/* Playhead Handle Cap */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rotate-45 rounded-[2px] bg-red-500 shadow-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
