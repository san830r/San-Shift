import { useState, useEffect, useRef } from 'react'
import Reveal from './Reveal'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { useContent } from '../content/ContentContext'
import { DEFAULT_INSTAGRAM_REELS, getInstagramReels, isMediaAnImage } from '../content/instagramFeed'
import ReelsTheaterModal from './ReelsTheaterModal'
import logoIcon from '../assets/logo-icon-blue-squircle.png'

export default function InstagramReelsCarousel() {
  const { content } = useContent()
  const customFeedUrl = content?.site?.instagramFeedUrl
  const customReels = content?.site?.customReels

  const [reels, setReels] = useState(DEFAULT_INSTAGRAM_REELS)
  const [theaterOpen, setTheaterOpen] = useState(false)
  const [selectedReelIndex, setSelectedReelIndex] = useState(0)
  const [hoveredReelId, setHoveredReelId] = useState(null)
  const scrollContainerRef = useRef(null)

  // Option A: Auto-sync loader on mount or when feed URL / custom reels change
  useEffect(() => {
    let isMounted = true
    getInstagramReels(customFeedUrl, customReels).then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setReels(data)
      }
    })
    return () => {
      isMounted = false
    }
  }, [customFeedUrl, customReels])

  const scrollLeft = () => {
    playClickSound()
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    playClickSound()
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  const openTheaterAt = (idx) => {
    playChimeSound()
    setSelectedReelIndex(idx)
    setTheaterOpen(true)
  }

  return (
    <section
      id="reels"
      className="scroll-mt-20 relative overflow-hidden bg-brand-offwhite dark:bg-[#070a13] text-black dark:text-white py-24 sm:py-32 border-t border-black/5 dark:border-white/5 transition-colors duration-300"
    >
      {/* Serene Ambient Backglow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[700px] rounded-full bg-brand-blue/10 dark:bg-brand-blue/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <Reveal className="max-w-2xl">
            {/* Live Feed Status Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black/70 dark:text-white/80 shadow-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
              <span>LIVE INSTAGRAM FEED // @SANSHIFT</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white uppercase leading-tight">
              WATCH OUR LATEST <span className="text-brand-blue">REELS &amp; EDITS</span>
            </h2>

            <p className="mt-3 text-base text-black/60 dark:text-white/60 sm:text-lg">
              Fresh from our studio timeline — thumb-stopping hooks, cinematic color grades, and high-converting Meta &amp; TikTok video creatives.
            </p>
          </Reveal>

          {/* Action Row: Follow on Instagram & Carousel Controls */}
          <Reveal delay={60} className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw=="
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-md shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Follow @sanshift</span>
              <span>↗</span>
            </a>

            {/* Desktop Left/Right Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-black/70 dark:text-white/80 hover:border-brand-blue hover:text-brand-blue dark:hover:border-brand-blue transition-colors cursor-pointer shadow-sm"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-black/70 dark:text-white/80 hover:border-brand-blue hover:text-brand-blue dark:hover:border-brand-blue transition-colors cursor-pointer shadow-sm"
              >
                ›
              </button>
            </div>
          </Reveal>
        </div>

        {/* 3D Glass Smartphone Carousel Strip */}
        <Reveal delay={100}>
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-7 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {reels.map((reel, idx) => {
              const isHovered = hoveredReelId === reel.id
              const isImage = isMediaAnImage(reel.videoUrl || reel.imageUrl, reel.mediaType)
              const mediaSource = reel.videoUrl || reel.imageUrl

              return (
                <div
                  key={reel.id}
                  onMouseEnter={() => setHoveredReelId(reel.id)}
                  onMouseLeave={() => setHoveredReelId(null)}
                  onClick={() => openTheaterAt(idx)}
                  className="group snap-center shrink-0 w-[260px] sm:w-[290px] h-[480px] sm:h-[540px] cursor-pointer transition-all duration-300 transform hover:-translate-y-2 select-none"
                >
                  {/* Smartphone Bezel & Glass Chassis */}
                  <div className="relative w-full h-full rounded-[38px] p-2 bg-[#090b14] border-[4px] border-black/80 dark:border-white/20 shadow-[0_20px_50px_rgba(0,56,255,0.18)] group-hover:shadow-[0_25px_65px_rgba(0,56,255,0.35)] group-hover:border-brand-blue/60 transition-all duration-300 overflow-hidden flex flex-col">
                    {/* Screen Inner Container */}
                    <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black flex flex-col">
                      {/* Dynamic Island Notch */}
                      <div className="absolute top-2 inset-x-0 z-30 flex justify-center pointer-events-none">
                        <div className="h-4 w-20 rounded-full bg-black/90 border border-white/10 flex items-center justify-between px-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="h-2 w-2 rounded-full bg-sky-500/40" />
                        </div>
                      </div>

                      {/* Media Display: Image or Video */}
                      {isImage ? (
                        <img
                          src={mediaSource}
                          alt={reel.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <video
                          src={reel.videoUrl}
                          playsInline
                          muted
                          loop
                          autoPlay
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Screen Gradient Overlay for Readability */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"
                      />

                      {/* Top Header inside Phone Screen */}
                      <div className="absolute top-8 inset-x-0 z-20 flex items-center justify-between px-3.5">
                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full py-1 px-2.5 border border-white/15">
                          <img src={logoIcon} alt="SAN SHIFT" className="h-4 w-4 rounded-full" />
                          <span className="text-[10px] font-bold text-white tracking-wide">
                            sanshift
                          </span>
                          <span className="text-[9px] text-sky-400">✓</span>
                        </div>

                        <span className="rounded-full bg-brand-blue/90 border border-brand-blue-tint/30 px-2 py-0.5 text-[9px] font-mono font-black uppercase text-white shadow-sm">
                          {reel.tag}
                        </span>
                      </div>

                      {/* Center Play / View Button Overlay on Hover */}
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/90 text-white shadow-xl shadow-brand-blue/50 transition-all duration-300 ${
                          isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                        }`}>
                          <span className="text-xl">
                            {isImage ? '📸' : '▶'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Info inside Phone Screen */}
                      <div className="absolute bottom-0 inset-x-0 z-20 p-3.5 pt-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col text-left">
                        {/* Metrics Bar */}
                        <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-white/90 mb-1">
                          <span className="text-brand-yellow font-black">🔥 {reel.views}</span>
                          <span>❤️ {reel.likes}</span>
                          <span>💬 {reel.comments}</span>
                        </div>

                        <h4 className="font-display text-xs sm:text-sm font-black text-white line-clamp-1 leading-snug">
                          {reel.title}
                        </h4>

                        <p className="mt-0.5 text-[10px] text-white/70 line-clamp-2 leading-tight">
                          {reel.caption}
                        </p>

                        {/* Interactive Hint */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2 text-[9px] font-mono text-white/60">
                          <span className="text-brand-blue-tint font-bold">
                            {isImage ? 'TAP TO VIEW' : 'TAP TO WATCH'}
                          </span>
                          <span>
                            {isImage ? 'FULL PHOTO ↗' : '🔊 WITH SOUND →'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Mobile Swipe Hint */}
        <div className="mt-6 flex sm:hidden items-center justify-center gap-2 text-xs font-mono text-black/50 dark:text-white/50">
          <span>👈 Swipe left / right to browse reels 👉</span>
        </div>
      </div>

      {/* Fullscreen Reels Theater Modal */}
      <ReelsTheaterModal
        isOpen={theaterOpen}
        reels={reels}
        initialIndex={selectedReelIndex}
        onClose={() => setTheaterOpen(false)}
      />
    </section>
  )
}
