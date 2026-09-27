import { useState } from 'react'
import {
  playClickSound,
  playSubBassBoom,
  playWhoosh,
  playGlitch,
  playVinylRiser,
  playChimeSound,
} from '../lib/soundFx'

const LUTS = [
  {
    id: 'teal_orange',
    name: 'Arri Alexa Teal & Orange',
    tag: 'HOLLYWOOD CINEMATIC',
    filter: 'contrast(125%) saturate(135%) hue-rotate(-12deg) brightness(105%)',
    bg: 'from-[#0f172a] via-[#1e293b] to-[#0284c7]',
    badge: 'Teal Shadows • Warm Skin',
  },
  {
    id: 'cyber_neon',
    name: 'Tokyo Cyber Neon',
    tag: 'FUTURISTIC / HIGH DOPAMINE',
    filter: 'contrast(140%) saturate(160%) hue-rotate(45deg) brightness(110%)',
    bg: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
    badge: 'Deep Violet • Electric Cyan',
  },
  {
    id: 'kodachrome',
    name: 'Vintage Kodachrome 64',
    tag: 'RETRO ANALOG FILM',
    filter: 'sepia(28%) contrast(115%) saturate(120%) brightness(102%)',
    bg: 'from-[#451a03] via-[#78350f] to-[#b45309]',
    badge: 'Warm Golden Hour • Organic Grain',
  },
  {
    id: 'luxury_gold',
    name: 'Black & Pure Gold',
    tag: 'LUXURY BRAND PACKAGING',
    filter: 'contrast(150%) saturate(85%) brightness(95%) sepia(20%)',
    bg: 'from-[#0a0a0a] via-[#171717] to-[#854d0e]',
    badge: 'Crushed Blacks • Gilded Highlights',
  },
]

const SFX_ITEMS = [
  { id: 'boom', name: 'Sub-Bass Impact Boom', tag: '32Hz Drop', fn: playSubBassBoom, icon: '💥' },
  { id: 'whoosh', name: 'Cyber Anamorphic Whoosh', tag: 'Fast Cut Transition', fn: playWhoosh, icon: '⚡' },
  { id: 'glitch', name: 'Digital Glitch Stutter', tag: 'Hook Pattern Interrupt', fn: playGlitch, icon: '🎧' },
  { id: 'riser', name: 'Tension Vinyl Riser', tag: 'Pre-Drop Buildup', fn: playVinylRiser, icon: '🔊' },
  { id: 'chime', name: 'Pristine Reward Chime', tag: 'CTA Notification', fn: playChimeSound, icon: '🔔' },
]

export default function AssetSoundboard() {
  const [activeLut, setActiveLut] = useState(0)
  const [playingSfx, setPlayingSfx] = useState(null)

  const currentLut = LUTS[activeLut]

  const handlePlaySfx = (item) => {
    setPlayingSfx(item.id)
    item.fn()
    setTimeout(() => setPlayingSfx(null), 600)
  }

  return (
    <section id="soundboard" className="relative py-24 sm:py-32 bg-[#060810] text-white transition-colors duration-300 border-t border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[450px] w-[500px] rounded-full bg-brand-blue/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-brand-yellow">
            <span>Live Asset Testing Suite</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-white">
            INTERACTIVE LUT &amp; <br />
            <span className="text-brand-blue">SFX SOUNDBOARD.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/60">
            Click to test real synthesized sound effects and switch cinematic color grading LUTs live on our 4K demo frame.
          </p>
        </div>

        {/* 2-Column Split: LUT Preview on Left, SFX Soundboard on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Interactive Color LUT Switcher (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0c101c] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <span className="text-brand-blue font-bold">LUT PREVIEW MONITOR</span>
                <span className="text-brand-yellow font-bold">{currentLut.tag}</span>
              </div>

              {/* Video Frame with CSS Filter applied dynamically */}
              <div className="relative mt-4 aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black flex flex-col justify-between p-6">
                {/* Background Layer simulated with current LUT filter */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentLut.bg} transition-all duration-500`}
                  style={{ filter: currentLut.filter }}
                />

                {/* Film Overlay Graphics */}
                <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-white/80">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/20">
                    LUT: {currentLut.name}
                  </span>
                  <span className="bg-brand-blue/80 px-2 py-0.5 rounded text-white font-bold">
                    REC.709
                  </span>
                </div>

                {/* Center Title Inside Frame */}
                <div className="relative z-10 text-center my-auto">
                  <h4 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-lg">
                    SHIFT THE STANDARD.
                  </h4>
                  <span className="mt-1 inline-block text-xs font-mono font-bold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    {currentLut.badge}
                  </span>
                </div>

                <div className="relative z-10 text-[10px] font-mono text-white/50 text-right">
                  LIVE COLOR GRADING PREVIEW
                </div>
              </div>

              {/* LUT Selector Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {LUTS.map((lut, idx) => (
                  <button
                    key={lut.id}
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setActiveLut(idx)
                    }}
                    data-cursor="LUT"
                    className={`p-3 rounded-2xl text-left border transition-all active:scale-95 ${
                      activeLut === idx
                        ? 'border-brand-blue bg-brand-blue/20 text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold block truncate">{lut.name}</span>
                    <span className="text-[10px] text-white/40 font-mono block mt-0.5">{lut.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
              <span>Includes 15+ .CUBE LUTs</span>
              <span className="text-brand-blue font-bold">Premiere / FCP / DaVinci</span>
            </div>
          </div>

          {/* Right: Interactive SFX Soundboard (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0c101c] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <span className="text-brand-yellow font-bold">HOLLYWOOD SFX SOUNDBOARD</span>
                <span className="text-white/40">CLICK TO PLAY SOUNDS</span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-white/60">
                Test the sub-bass impacts, cinematic whooshes, and tension risers included inside the SAN SHIFT Creator Pack.
              </p>

              {/* Sound Buttons Grid */}
              <div className="mt-5 space-y-3">
                {SFX_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePlaySfx(item)}
                    data-cursor="SFX"
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                      playingSfx === item.id
                        ? 'border-brand-yellow bg-brand-yellow/15 shadow-[0_0_20px_rgba(255,212,0,0.3)] scale-[1.01]'
                        : 'border-white/10 bg-white/5 hover:border-brand-blue/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white block">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-white/50">
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/20 px-2 py-0.5 rounded">
                        {playingSfx === item.id ? 'PLAYING...' : 'TRIGGER ▶'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
              <span>Zero Distortion • 24-bit 48kHz WAV</span>
              <a href="#catalog" className="text-brand-yellow hover:underline font-bold">
                Get All 150+ SFX →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
