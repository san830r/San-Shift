import { useState, useEffect } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { stopLenis, startLenis } from '../lib/lenisSetup'
import { useCurrency } from '../content/CurrencyContext'

const ASSET_SECTIONS = [
  {
    id: 'luts',
    name: 'LUTs & Color Grades',
    count: '2,500+ Files',
    desc: 'Cinematic .CUBE presets engineered for Premiere Pro, DaVinci Resolve, Final Cut & CapCut.',
    items: [
      { name: 'Teal & Orange Arri Look', sub: 'Cinema Film Print 2383', tag: 'REC.709' },
      { name: 'Kodak Portra 400 Grain', sub: 'Vintage Warm Analog', tag: 'ANALOG' },
      { name: 'Moody Night City Cyber', sub: 'Deep Blue & Neon Cyan', tag: 'STREET' },
      { name: 'Natural Skin Tone Glow', sub: 'Soft Portrait Tone', tag: 'BEAUTY' },
    ],
  },
  {
    id: 'sfx',
    name: 'Sound FX & Hits',
    count: '8,000+ Files',
    desc: 'WAV 24-bit 48kHz uncompressed Hollywood audio stems for high-impact edits.',
    items: [
      { name: 'Deep Sub-Bass Impact Hit', sub: 'Trailer Drop 40Hz', tag: 'IMPACT' },
      { name: 'Cinematic Whoosh Transition', sub: 'Organic Wind Swell', tag: 'RISER' },
      { name: 'Retro Film Camera Shutter', sub: 'Mechanical Click', tag: 'FOLEY' },
      { name: 'Tape Rewind Glitch Hit', sub: 'Analog Tape Noise', tag: 'TEXTURE' },
    ],
  },
  {
    id: 'motion',
    name: 'Motion Graphics',
    count: '1,450+ Templates',
    desc: 'After Effects & Premiere Pro MOGRT files with editable text, colors and speeds.',
    items: [
      { name: 'Kinetic 3D Typography Intro', sub: 'Auto-Resize MOGRT', tag: 'TITLES' },
      { name: 'Clean Lower Thirds Minimal', sub: 'Alpha Channel 60FPS', tag: 'OVERLAYS' },
      { name: 'Smooth Zoom & Whip Transitions', sub: 'Drag & Drop Preset', tag: 'FX' },
      { name: 'Social Follow & Like Pops', sub: 'Animated Vector 4K', tag: 'SOCIAL' },
    ],
  },
  {
    id: 'canva',
    name: 'Canva & Thumbnails',
    count: '3,00,000+ Designs',
    desc: 'One-click editable Canva templates for YouTube thumbnails, Instagram reels & marketing.',
    items: [
      { name: 'High-CTR YouTube Cover 01', sub: 'Hormozi & MrBeast Style', tag: 'CANVA' },
      { name: 'Carousel Story Slide Pack', sub: 'Minimal Editorial Flow', tag: 'INSTAGRAM' },
      { name: 'Brand Presentation Deck', sub: 'Pitch Deck & Media Kit', tag: 'BUSINESS' },
      { name: 'Podcast Cover Art Series', sub: 'Bold Typography Grid', tag: 'PODCAST' },
    ],
  },
  {
    id: 'reels',
    name: 'Viral Reels & Edits',
    count: '30,000+ Videos',
    desc: 'High-retention 9:16 vertical video templates, viral hooks, and ready-to-post creative reels.',
    items: [
      { name: '3-Second Hook Mastery Pack', sub: 'High Watch-Time Formula', tag: 'REELS' },
      { name: 'Motivational & Luxury Edits', sub: '4K Ultra-HD Visuals', tag: 'TIKTOK' },
      { name: 'Finance & Tech Shorts Pack', sub: 'Kinetic Subtitles & Cuts', tag: 'SHORTS' },
      { name: 'E-commerce Ad Creative Set', sub: 'High-Converting Drops', tag: 'META ADS' },
    ],
  },
  {
    id: 'more',
    name: 'Ebooks, 3D & More',
    count: '50+ Categories',
    desc: 'Full library of 3 Lakh+ ebooks, 3D mockups, textures, fonts, vector icons & brand kits.',
    items: [
      { name: '3 Lakh+ Ebooks & Articles', sub: 'Business, Tech & Growth', tag: 'EBOOKS' },
      { name: 'Photoshop 3D Product Mockups', sub: 'Smart Object Layers', tag: 'MOCKUPS' },
      { name: 'Modern Sans & Display Fonts', sub: 'Commercial Web Licenses', tag: 'FONTS' },
      { name: 'Vector Icons & Textures Pack', sub: 'High-Res PNG & SVG', tag: 'GRAPHICS' },
    ],
  },
]

export default function AssetInspectorModal({ isOpen, onClose, onBuy }) {
  const [activeTab, setActiveTab] = useState(0)
  const { formatPrice } = useCurrency()

  // Lock scroll & pause Lenis
  useEffect(() => {
    if (isOpen) {
      stopLenis()
      document.body.style.overflow = 'hidden'
    } else {
      startLenis()
      document.body.style.overflow = ''
    }
    return () => {
      startLenis()
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

  const current = ASSET_SECTIONS[activeTab] || ASSET_SECTIONS[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-fade-in"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={() => {
          playClickSound()
          onClose()
        }}
        className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Dialog with Fixed Max Height and Scrollable Body */}
      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#0c101c] text-black dark:text-white shadow-[0_25px_70px_rgba(0,56,255,0.25)]">
        
        {/* Sticky Top Header */}
        <div className="sticky top-0 z-20 shrink-0 flex items-center justify-between border-b border-black/5 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-3.5 bg-white dark:bg-[#0c101c]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand-blue shadow-[0_0_8px_#0038ff]" />
            <span className="font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider text-black/70 dark:text-white/70">
              INSIDE THE 55M+ EDITING BUNDLE
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              onClose()
            }}
            data-cursor="CLOSE"
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sticky Horizontal Tab Pills */}
        <div className="sticky top-[49px] z-10 shrink-0 flex gap-2 overflow-x-auto px-4 sm:px-6 py-2.5 sm:py-3 border-b border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-md no-scrollbar">
          {ASSET_SECTIONS.map((sec, idx) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                playClickSound()
                setActiveTab(idx)
              }}
              data-cursor="SELECT"
              className={`shrink-0 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 scale-102'
                  : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              <span>{sec.name}</span>
              <span className="ml-1.5 opacity-70 text-[10px]">({sec.count})</span>
            </button>
          ))}
        </div>

        {/* Scrollable Active Content Preview */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 custom-scrollbar overscroll-contain"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-black uppercase text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">
                CATEGORY {activeTab + 1} OF {ASSET_SECTIONS.length}
              </span>
              <span className="font-mono text-[10px] text-black/40 dark:text-white/40">
                {current.count}
              </span>
            </div>
            <h4 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              {current.name}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-black/60 dark:text-white/60 leading-relaxed font-sans">
              {current.desc}
            </p>
          </div>

          {/* Sample Asset Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {current.items.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between rounded-xl sm:rounded-2xl border border-black/8 dark:border-white/10 bg-brand-offwhite/50 dark:bg-white/[0.03] p-3.5 sm:p-4 transition-all hover:border-brand-blue/40 hover:bg-white dark:hover:bg-white/[0.06] hover:shadow-sm"
              >
                <div className="pr-2">
                  <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-brand-blue">
                    {item.tag}
                  </span>
                  <h5 className="font-bold text-xs sm:text-sm text-black dark:text-white tracking-tight mt-0.5 line-clamp-1">
                    {item.name}
                  </h5>
                  <p className="text-[11px] text-black/50 dark:text-white/50 font-sans mt-0.5 line-clamp-1">
                    {item.sub}
                  </p>
                </div>

                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue text-xs font-bold transition-transform group-hover:scale-110">
                  ✓
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee banner */}
          <div className="rounded-xl sm:rounded-2xl border border-brand-yellow/30 bg-brand-yellow/5 dark:bg-brand-yellow/10 p-3 sm:p-3.5 flex items-center gap-3">
            <span className="text-base sm:text-lg">⚡</span>
            <span className="text-[11px] sm:text-xs text-black/75 dark:text-white/75 font-medium leading-relaxed">
              Every asset is 100% royalty-free for commercial client projects, YouTube videos, and personal brand reels.
            </span>
          </div>
        </div>

        {/* Sticky Bottom CTA Row (Always visible on mobile & desktop) */}
        <div className="sticky bottom-0 z-20 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-3.5 bg-white dark:bg-[#0c101c] shadow-[0_-10px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_25px_rgba(0,0,0,0.4)]">
          <div className="flex items-baseline gap-2 text-xs font-mono text-black/70 dark:text-white/70">
            <span>Bundle Price:</span>
            <strong className="text-brand-blue text-lg sm:text-xl font-display font-black">{formatPrice(99)}</strong>
            <span className="text-black/40 dark:text-white/40 line-through text-xs">{formatPrice(1000)}</span>
            <span className="ml-1 rounded bg-rose-500/10 text-rose-500 text-[10px] font-bold px-1.5 py-0.5">90% OFF</span>
          </div>

          <button
            type="button"
            onClick={() => {
              playChimeSound()
              onClose()
              if (onBuy) onBuy()
            }}
            data-cursor="UNLOCK"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-dark px-6 sm:px-8 py-2.5 sm:py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Unlock All 55M+ Assets — {formatPrice(99)}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
