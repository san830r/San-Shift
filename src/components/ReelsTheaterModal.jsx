import { useState, useEffect, useRef } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { stopLenis, startLenis } from '../lib/lenisSetup'
import { isMediaAnImage } from '../content/instagramFeed'
import logoIcon from '../assets/logo-icon-blue-squircle.png'

export default function ReelsTheaterModal({ isOpen, reels = [], initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [likes, setLikes] = useState({})
  const [showHeartBurst, setShowHeartBurst] = useState(false)
  const [hideOverlays, setHideOverlays] = useState(false)
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const videoRef = useRef(null)

  // Update current index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex)
      setIsPlaying(true)
      setIsMuted(false)
      setHideOverlays(false)
      setCaptionExpanded(false)
    }
  }, [isOpen, initialIndex])

  const currentReel = reels[index] || reels[0]

  // Keyboard navigation (Arrow keys + Escape)
  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'm') {
        toggleMute()
      } else if (e.key === 'h' || e.key === 'c') {
        setHideOverlays((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, index, reels.length])

  // Lock body scroll & pause Lenis
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

  if (!isOpen || !currentReel) return null

  const isImage = isMediaAnImage(currentReel.videoUrl || currentReel.imageUrl, currentReel.mediaType)
  const mediaSource = currentReel.videoUrl || currentReel.imageUrl

  const handleNext = () => {
    playClickSound()
    setIndex((prev) => (prev + 1) % reels.length)
    setIsPlaying(true)
    setCaptionExpanded(false)
  }

  const handlePrev = () => {
    playClickSound()
    setIndex((prev) => (prev - 1 + reels.length) % reels.length)
    setIsPlaying(true)
    setCaptionExpanded(false)
  }

  const handleMediaClick = () => {
    // Tapping the media area toggles Clean View Mode (hide/show overlays)
    setHideOverlays((prev) => !prev)
  }

  const togglePlay = () => {
    if (isImage) return
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (isImage) return
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleLike = () => {
    playChimeSound()
    const reelId = currentReel.id
    setLikes((prev) => ({ ...prev, [reelId]: !prev[reelId] }))
    setShowHeartBurst(true)
    setTimeout(() => setShowHeartBurst(false), 900)
  }

  const handleOrderWhatsApp = () => {
    playChimeSound()
    const text = encodeURIComponent(
      `Hi SAN SHIFT! 👋 I was viewing your Instagram post: "${currentReel.title}" (${currentReel.tag}).\n\n` +
      `I want a similar high-retention video edit / design for my brand! Could you share your timeline and pricing?`
    )
    window.open(`https://wa.me/917339467830?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const isCurrentLiked = Boolean(likes[currentReel.id])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SAN SHIFT Instagram Media Theater"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fade-in"
    >
      {/* Background click to close */}
      <div
        onClick={() => {
          playClickSound()
          onClose()
        }}
        className="fixed inset-0 bg-transparent"
        aria-hidden="true"
      />

      {/* Main Theater Frame */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md h-[92vh] max-h-[860px] overflow-hidden rounded-[28px] sm:rounded-[36px] border border-white/20 bg-[#090b11] shadow-[0_30px_90px_rgba(0,56,255,0.4)] text-white">
        
        {/* Top Header Controls - Auto fades when hideOverlays is true */}
        <div
          className={`absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent transition-opacity duration-300 ${
            hideOverlays ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}
        >
          {/* Channel Info */}
          <a
            href="https://www.instagram.com/sanshift"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src={logoIcon}
              alt="SAN SHIFT"
              className="h-7 w-7 rounded-full border border-white/30 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black tracking-wide text-white group-hover:text-brand-yellow transition-colors">
                  sanshift
                </span>
                <span className="text-[10px] text-sky-400">✓</span>
              </div>
              <span className="text-[9px] font-mono text-white/60">
                {currentReel.postedTime || (isImage ? 'Instagram Photo' : 'Instagram Reel')}
              </span>
            </div>
          </a>

          {/* Top Controls: Clean View toggle, Mute, Instagram Link & Close */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setHideOverlays(true)}
              title="Clean View (Hide text & screen overlays)"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 border border-white/20 text-xs text-white/80 hover:text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              👁️
            </button>

            {!isImage && (
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 border border-white/20 text-xs text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            )}

            <a
              href={currentReel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open on Instagram"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 border border-white/20 text-xs text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              ↗
            </a>

            <button
              type="button"
              onClick={() => {
                playClickSound()
                onClose()
              }}
              aria-label="Close Theater"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-xs text-white transition-colors cursor-pointer font-bold ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Clean View Mode Toggle Indicator (Shown when overlays are hidden) */}
        {hideOverlays && (
          <button
            type="button"
            onClick={() => setHideOverlays(false)}
            className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-black/70 border border-white/25 px-3 py-1 text-[10px] font-mono font-bold text-white shadow-lg backdrop-blur-md hover:bg-black/90 transition-all cursor-pointer"
          >
            <span>👁️ Show Details</span>
          </button>
        )}

        {/* Media Viewer Area - Tapping toggles Clean View Mode */}
        <div
          onClick={handleMediaClick}
          className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer select-none"
        >
          {isImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-2 bg-[#05070e]">
              <img
                src={mediaSource}
                alt={currentReel.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={currentReel.videoUrl}
              playsInline
              autoPlay
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          )}

          {/* Pause Indicator overlay (videos only) */}
          {!isImage && !isPlaying && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 border border-white/30 text-white text-2xl shadow-xl">
                ▶
              </div>
            </div>
          )}

          {/* Double-tap / Like heart burst */}
          {showHeartBurst && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center animate-ping">
              <span className="text-7xl drop-shadow-[0_0_20px_#ef4444]">❤️</span>
            </div>
          )}
        </div>

        {/* Right Floating Actions (Like, Comments, Order) - Auto fades when hideOverlays is true */}
        <div
          className={`absolute right-3 bottom-24 z-30 flex flex-col items-center gap-3 transition-opacity duration-300 ${
            hideOverlays ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleLike()
            }}
            className="group flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-125"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
              isCurrentLiked
                ? 'bg-rose-500/80 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
            }`}>
              <span className="text-sm">{isCurrentLiked ? '❤️' : '🤍'}</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-white/90 drop-shadow">
              {currentReel.likes}
            </span>
          </button>

          <a
            href={currentReel.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-sm text-white">
              💬
            </div>
            <span className="text-[9px] font-mono font-bold text-white/90 drop-shadow">
              {currentReel.comments}
            </span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleOrderWhatsApp()
            }}
            title="Order via WhatsApp"
            className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/40 backdrop-blur-md border border-emerald-400/50 text-sm text-white">
              ⚡
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-300 drop-shadow">
              Order
            </span>
          </button>
        </div>

        {/* Compact, Non-Obstructive Bottom Bar - Auto fades when hideOverlays is true */}
        <div
          className={`absolute bottom-0 inset-x-0 z-20 flex flex-col p-3.5 pb-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent transition-opacity duration-300 ${
            hideOverlays ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}
        >
          {/* Meta Line: Tag Badge, Views Count */}
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-brand-blue px-2 py-0.5 text-[8px] font-mono font-black uppercase tracking-wider text-white shadow-sm">
              {currentReel.tag}
            </span>
            <span className="font-mono text-[9px] text-brand-yellow font-bold">
              🔥 {currentReel.views} VIEWS
            </span>
          </div>

          {/* Clean 1-Line Truncated Title (Never covers the screen) */}
          <h4 className="font-display text-xs sm:text-sm font-black text-white truncate max-w-[calc(100%-48px)] leading-snug">
            {currentReel.title}
          </h4>

          {/* Clean 1-Line Caption with Expandable "...more" toggle */}
          <div className="mt-0.5 text-[10px] text-white/75 max-w-[calc(100%-48px)]">
            {!captionExpanded ? (
              <p className="line-clamp-1 leading-tight">
                {currentReel.caption}{' '}
                {currentReel.caption && currentReel.caption.length > 50 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCaptionExpanded(true)
                    }}
                    className="font-bold text-white hover:text-brand-blue cursor-pointer underline ml-1"
                  >
                    more
                  </button>
                )}
              </p>
            ) : (
              <div className="mt-1 max-h-24 overflow-y-auto rounded-lg bg-black/70 border border-white/15 p-2 text-[10px] text-white/90 leading-relaxed shadow-lg backdrop-blur-md">
                <p>{currentReel.caption}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCaptionExpanded(false)
                  }}
                  className="font-bold text-brand-blue hover:underline cursor-pointer mt-1 block"
                >
                  less
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Row: Audio Track + Compact Order CTA */}
          <div className="mt-2.5 flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/50 truncate max-w-[150px]">
              <span>{isImage ? '📸' : '🎵'}</span>
              <span className="truncate">{currentReel.audioTrack}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleOrderWhatsApp()
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 py-1.5 px-3.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span>{isImage ? 'Order This Creative' : 'Order Video'}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Side Prev/Next Navigation Controls for Desktop */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          aria-label="Previous Reel"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-brand-blue hover:border-brand-blue transition-all cursor-pointer"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          aria-label="Next Reel"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-brand-blue hover:border-brand-blue transition-all cursor-pointer"
        >
          ›
        </button>
      </div>
    </div>
  )
}
