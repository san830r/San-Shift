import { useState, useEffect } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'

const SHOWREEL_CHAPTERS = [
  {
    title: 'Color Grading & Cinematic LUTs',
    tag: 'COLOR',
    desc: 'Teal & orange Arri Alexa color transforms, film emulation, halation & grain.',
    previewGradient: 'from-amber-600 via-rose-700 to-blue-900',
  },
  {
    title: 'Viral Motion & Kinetic Typography',
    tag: 'MOTION',
    desc: 'Dynamic pacing, 3D text punch-ins, snap zooms and retention architecture.',
    previewGradient: 'from-blue-600 via-indigo-700 to-cyan-500',
  },
  {
    title: '3D Anti-Gravity Product Visualization',
    tag: '3D VFX',
    desc: 'Photorealistic zero-gravity product showcases, specular lighting, and metallic reflections.',
    previewGradient: 'from-purple-700 via-pink-600 to-blue-800',
  },
  {
    title: 'Hollywood Sound Design & SFX',
    tag: 'AUDIO',
    desc: 'Impact risers, cinematic sub-drops, whoosh hits, and spatial stereo atmosphere.',
    previewGradient: 'from-emerald-700 via-cyan-800 to-blue-950',
  },
]

export default function ShowreelModal({ isOpen, onClose }) {
  const [activeChapter, setActiveChapter] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const chapter = SHOWREEL_CHAPTERS[activeChapter]

  const handleWhatsApp = () => {
    playClickSound()
    const msg = encodeURIComponent(
      `Hi SAN SHIFT! 👋 I watched your studio showreel and I want to produce high-end content for my project.\n\n` +
      `Focus Area: ${chapter.title}\n\nCan we discuss timeline and deliverables?`
    )
    window.open(`https://wa.me/917339467830?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
    >
      {/* Soft Blurred Theater Backdrop */}
      <div
        onClick={() => {
          playClickSound()
          onClose()
        }}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl transition-opacity"
      />

      {/* Main Theater Container */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#07090e] text-white shadow-[0_30px_90px_rgba(0,56,255,0.3)]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-blue shadow-[0_0_8px_#0038ff] animate-pulse" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-white/80">
              SAN SHIFT // STUDIO SHOWREEL 2026
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              onClose()
            }}
            data-cursor="CLOSE"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Close Showreel"
          >
            ✕
          </button>
        </div>

        {/* Cinematic 16:9 Screen */}
        <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
          {/* Animated Atmospheric Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${chapter.previewGradient} opacity-60 transition-all duration-700 blur-2xl`}
          />

          {/* Vignette Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />

          {/* Central Animated Content Card */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-lg">
            <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-brand-yellow backdrop-blur-md">
              CHAPTER {activeChapter + 1} OF {SHOWREEL_CHAPTERS.length} // {chapter.tag}
            </span>

            <h3 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white drop-shadow-md">
              {chapter.title}
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed font-sans font-medium drop-shadow-sm">
              {chapter.desc}
            </p>

            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={() => {
                playChimeSound()
                setIsPlaying(!isPlaying)
              }}
              data-cursor="PLAY"
              className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110 active:scale-95"
            >
              {isPlaying ? (
                <span className="font-black text-sm">❚❚</span>
              ) : (
                <span className="font-black text-base pl-0.5">▶</span>
              )}
            </button>
          </div>

          {/* Live Progress Line */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
            <div
              className="h-full bg-brand-blue transition-all duration-500 shadow-[0_0_8px_#0038ff]"
              style={{ width: `${((activeChapter + 1) / SHOWREEL_CHAPTERS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Chapter Selection Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#0a0d14] border-t border-white/10">
          {SHOWREEL_CHAPTERS.map((ch, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                playClickSound()
                setActiveChapter(idx)
              }}
              className={`flex flex-col text-left rounded-xl p-2.5 transition-all ${
                activeChapter === idx
                  ? 'bg-white/15 border border-brand-blue/50 text-white'
                  : 'bg-white/5 border border-transparent text-white/50 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-blue">
                0{idx + 1} // {ch.tag}
              </span>
              <span className="mt-1 text-xs font-bold truncate">{ch.title}</span>
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 px-6 py-4 bg-[#07090e]">
          <div className="text-xs text-white/60">
            <span>Want high-end creative execution like this?</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsApp}
              data-cursor="INQUIRE"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-dark px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all active:scale-95"
            >
              <span>Book Project Like This</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
