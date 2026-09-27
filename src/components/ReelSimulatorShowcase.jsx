import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import QuickBriefModal from './QuickBriefModal'
import { gsap, prefersReducedMotion } from '../lib/gsapSetup'
import { useContent } from '../content/ContentContext'
import { parseVideoUrl } from '../lib/videoParser'
import sanshiftReelVideo from '../assets/reels/sanshift-reel.mp4'

const REEL_PREVIEWS = {
  hook: {
    tag: 'VIRAL HOOK',
    headline: 'Stop Scrolling: The 3-Second Retention Rule',
    caption: 'How SAN SHIFT crafts thumb-stopping video hooks that boost 3-second watch rate above 85%.',
    soundtrack: 'sanshift • Original Audio ↗',
    stats: {
      retention: '94.2%',
      views: '1.4M',
      saves: '38.4K',
      shares: '12.8K',
    },
    accent: 'from-brand-blue to-cyan-500',
    badge: 'bg-brand-blue/20 text-brand-blue border-brand-blue/40',
  },
  story: {
    tag: 'BRAND STORY',
    headline: 'From Zero to High-Ticket Authority',
    caption: 'Cinematic brand storytelling that transforms passive viewers into loyal, paying clients.',
    soundtrack: 'sanshift • Original Audio ↗',
    stats: {
      retention: '91.8%',
      views: '840K',
      saves: '44.1K',
      shares: '9.2K',
    },
    accent: 'from-amber-500 to-brand-yellow',
    badge: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40',
  },
  ad: {
    tag: 'HIGH-CONVERTING AD',
    headline: 'Creative Ad That Tripled Client Revenue',
    caption: 'Direct-response video creative built specifically for Meta & TikTok paid ad campaigns.',
    soundtrack: 'sanshift • Original Audio ↗',
    stats: {
      retention: '88.6%',
      views: '2.1M',
      saves: '29.3K',
      shares: '19.4K',
    },
    accent: 'from-emerald-500 to-teal-400',
    badge: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
  },
}

// Primary native 9:16 vertical reel video
const DEFAULT_CREATIVE_VIDEO = sanshiftReelVideo

export default function ReelSimulatorShowcase() {
  const { content } = useContent()
  const initialUrl = content?.site?.featuredReel?.url || sanshiftReelVideo

  const [activeTab, setActiveTab] = useState('hook') // 'hook' | 'story' | 'ad'
  const [briefOpen, setBriefOpen] = useState(false)
  const [exploded, setExploded] = useState(false) // Default to clean flat Reels format for natural playback

  // Video playback & Link state
  const [reelUrl, setReelUrl] = useState(initialUrl)
  const [inputUrl, setInputUrl] = useState('https://www.instagram.com/reel/DYNPLTZE5Ob/')
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(20)
  const [likesCount, setLikesCount] = useState(11208) // exact 11,208 likes from reel
  const [hasLiked, setHasLiked] = useState(false)
  const [showHeartBurst, setShowHeartBurst] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)

  const current = REEL_PREVIEWS[activeTab]
  const phoneContainerRef = useRef(null)
  const phoneFrameRef = useRef(null)
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  // Parsed media source
  const parsed = parseVideoUrl(reelUrl)
  const isInstagram = parsed?.type === 'instagram'
  const isDirectVideo = !isInstagram && parsed?.type !== 'youtube'

  // Sync initial content update if defaultContent changes
  useEffect(() => {
    if (content?.site?.featuredReel?.url && !reelUrl) {
      setReelUrl(content.site.featuredReel.url)
      setInputUrl(content.site.featuredReel.url)
    }
  }, [content?.site?.featuredReel?.url, reelUrl])

  // 3D Parallax Tilt with quickTo
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const container = phoneContainerRef.current
    const phone = phoneFrameRef.current
    if (!container || !phone) return undefined

    const rotateX = gsap.quickTo(phone, 'rotationX', { duration: 0.7, ease: 'power2.out' })
    const rotateY = gsap.quickTo(phone, 'rotationY', { duration: 0.7, ease: 'power2.out' })

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      rotateX(-ny * 20)
      rotateY(nx * 22)
    }

    const handleMouseLeave = () => {
      rotateX(0)
      rotateY(0)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleTabChange = (key) => {
    playClickSound()
    setActiveTab(key)
  }

  const handleLaunchCampaign = () => {
    playChimeSound()
    setBriefOpen(true)
  }

  const toggleExploded = () => {
    playClickSound()
    setExploded((prev) => !prev)
  }

  const handleApplyUrl = (e) => {
    e?.preventDefault()
    playClickSound()
    const clean = inputUrl.trim()
    if (clean) {
      if (clean.includes('DYNPLTZE5Ob')) {
        setReelUrl(sanshiftReelVideo)
      } else {
        setReelUrl(clean)
      }
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setReelUrl(objectUrl)
      setInputUrl(file.name)
      playChimeSound()
    }
  }

  const handleTogglePlay = (e) => {
    e?.stopPropagation()
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
      playClickSound()
    }
  }

  const handleToggleMute = (e) => {
    e?.stopPropagation()
    if (videoRef.current) {
      const nextMuted = !isMuted
      videoRef.current.muted = nextMuted
      setIsMuted(nextMuted)
      if (nextMuted) {
        playClickSound()
      } else {
        playChimeSound()
      }
    }
  }

  const handleLike = (e) => {
    e?.stopPropagation()
    playChimeSound()
    setHasLiked((prev) => !prev)
    setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1))
    setShowHeartBurst(true)
    setTimeout(() => setShowHeartBurst(false), 900)
  }

  const handleFollow = (e) => {
    e?.stopPropagation()
    playClickSound()
    setIsFollowed((prev) => !prev)
  }

  const handleShare = (e) => {
    e?.stopPropagation()
    playClickSound()
    if (reelUrl) {
      navigator.clipboard?.writeText(reelUrl)
    }
  }

  const handleSeek = (e) => {
    e?.stopPropagation()
    if (!videoRef.current || !videoRef.current.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    videoRef.current.currentTime = percent * videoRef.current.duration
    setProgress(percent * 100)
  }

  return (
    <section id="reels" className="relative overflow-hidden bg-brand-offwhite/50 dark:bg-[#080b14] py-20 sm:py-28 border-t border-black/5 dark:border-white/5">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-brand-blue/6 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-emerald-500/6 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
            <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
            CONTENT CREATION SHOWCASE
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
            CONTENT THAT STOPS THE THUMB.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/60 dark:text-white/60 sm:text-lg">
            We architect high-retention video content, viral hooks, and brand narratives engineered to build massive audience trust.
          </p>
        </Reveal>

        {/* Interactive Device Grid */}
        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Controls & Metrics Column (5 cols) */}
          <Reveal className="lg:col-span-5 space-y-5">
            {/* Quick Reel Link & Video Setup Bar */}
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0c101c]/90 p-4 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70 flex items-center gap-1.5">
                  <span className="text-sm">🎬</span>
                  <span>REEL VIDEO SOURCE</span>
                </span>
                {isInstagram ? (
                  <span className="text-[10px] font-mono font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    INSTAGRAM REEL
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    9:16 REELS PLAYER
                  </span>
                )}
              </div>

              <form onSubmit={handleApplyUrl} className="flex gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Paste Instagram Reel URL or MP4 link..."
                  className="flex-1 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] px-3.5 py-2.5 text-xs font-mono text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 outline-none focus:border-brand-blue transition-colors"
                />
                <button
                  type="submit"
                  data-cursor="PLAY"
                  className="shrink-0 rounded-xl bg-brand-blue hover:bg-brand-blue-dark px-4 py-2.5 text-xs font-black uppercase text-white shadow-md shadow-brand-blue/20 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>▶</span>
                  <span>Load</span>
                </button>
              </form>

              {/* Upload file or direct option */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/mov"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-blue hover:underline"
                >
                  <span>📁 Upload Reel File (.mp4)</span>
                </button>

                <a
                  href="https://www.instagram.com/reel/DYNPLTZE5Ob/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-rose-500 hover:underline font-bold"
                >
                  View on Instagram ↗
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                  CONTENT CONVERSION PACING
                </span>
                <button
                  type="button"
                  onClick={toggleExploded}
                  data-cursor="TOGGLE"
                  className="rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/5 px-2.5 py-0.5 text-[10px] font-mono font-bold text-black/60 dark:text-white/70 hover:border-brand-blue hover:text-brand-blue transition-colors"
                >
                  3D Depth: {exploded ? 'EXPLODED ●' : 'REELS FLAT ○'}
                </button>
              </div>

              {/* Format Switcher Pills */}
              <div className="mt-3 flex flex-col gap-2.5">
                {[
                  { id: 'hook', label: '01. Viral Hook (Top-of-Funnel)', icon: '⚡' },
                  { id: 'story', label: '02. Cinematic Brand Story', icon: '🎬' },
                  { id: 'ad', label: '03. High-Converting Paid Ad', icon: '📈' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      activeTab === item.id
                        ? 'border-brand-blue bg-white dark:bg-[#0f1424] text-black dark:text-white shadow-lg shadow-brand-blue/10 scale-[1.01]'
                        : 'border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        activeTab === item.id ? 'text-brand-blue' : 'text-black/30 dark:text-white/30'
                      }`}
                    >
                      {activeTab === item.id ? 'ACTIVE ●' : 'VIEW →'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Metrics Card */}
            <div className="rounded-3xl border border-black/8 dark:border-white/10 bg-white/90 dark:bg-[#0c101c]/90 p-6 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
                  ESTIMATED RETENTION & REACH
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  TOP 1% INDUSTRY
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-black/50 dark:text-white/50 font-medium">Average Watch Time</div>
                  <div className="mt-1 font-display text-2xl font-black text-brand-blue">
                    {current.stats.retention}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-black/50 dark:text-white/50 font-medium">Reel Views</div>
                  <div className="mt-1 font-display text-2xl font-black text-black dark:text-white">
                    {current.stats.views}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-black/50 dark:text-white/50 font-medium">Bookmarks / Saves</div>
                  <div className="mt-1 font-display text-xl font-black text-black dark:text-white">
                    {current.stats.saves}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-black/50 dark:text-white/50 font-medium">Direct Shares</div>
                  <div className="mt-1 font-display text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {current.stats.shares}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchCampaign}
                data-cursor="INQUIRE"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue-dark transition-all active:scale-95"
              >
                <span>Create Content For My Brand</span>
                <span>→</span>
              </button>
            </div>
          </Reveal>

          {/* Interactive 3D Smartphone with Pure 100% Instagram Reels Format (7 cols) */}
          <Reveal delay={100} className="lg:col-span-7 flex justify-center">
            <div
              ref={phoneContainerRef}
              className="relative py-6 sm:py-10 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              style={{ perspective: '1400px' }}
            >
              {/* Floating 3D Phone Rig */}
              <div
                ref={phoneFrameRef}
                className="relative w-full max-w-[320px] sm:max-w-[360px] preserve-3d transition-transform duration-200"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 3D Titanium Phone Chassis */}
                <div
                  className="relative aspect-[9/16] w-full rounded-[44px] bg-gradient-to-br from-[#1d222e] via-[#0d1017] to-[#040608] p-3 border border-white/20 shadow-[0_35px_90px_rgba(0,56,255,0.28),0_15px_30px_rgba(0,0,0,0.35)]"
                  style={{
                    transform: 'translateZ(0px)',
                  }}
                >
                  {/* Subtle rim highlight reflection */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[44px] border border-white/10"
                  />

                  {/* 4K Screen Panel: Pure Instagram Reels Format */}
                  <div
                    className="relative h-full w-full overflow-hidden rounded-[34px] bg-black text-white flex flex-col justify-between shadow-2xl transition-transform duration-500"
                    style={{
                      transform: exploded ? 'translateZ(24px)' : 'translateZ(4px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* VIDEO PLAYER LAYER */}
                    {isInstagram ? (
                      /* Cropped Instagram Embed that strips desktop header/footer to fit 9:16 phone */
                      <div className="absolute inset-0 z-0 overflow-hidden rounded-[34px] bg-black">
                        <iframe
                          src={parsed.embedUrl}
                          title="Instagram Reel"
                          className="w-full h-[142%] -mt-[54px] border-0 rounded-[34px] pointer-events-auto"
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                          scrolling="no"
                        />
                      </div>
                    ) : parsed?.type === 'youtube' ? (
                      <div className="absolute inset-0 z-0 overflow-hidden rounded-[34px] bg-black">
                        <iframe
                          src={parsed.embedUrl}
                          title="YouTube Short"
                          className="w-full h-full border-0 rounded-[34px] pointer-events-auto"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      /* Native High-Performance 9:16 HTML5 Video Player */
                      <div
                        className="absolute inset-0 z-0 overflow-hidden rounded-[34px] bg-black cursor-pointer"
                        onClick={handleTogglePlay}
                      >
                        <video
                          ref={videoRef}
                          src={parsed?.url || DEFAULT_CREATIVE_VIDEO}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          onTimeUpdate={(e) => {
                            if (e.target.duration) {
                              setProgress((e.target.currentTime / e.target.duration) * 100)
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                        {/* Soft ambient Reels vignette so bottom caption is crisp and readable */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />

                        {/* Centered Play icon pulse when paused */}
                        {!isPlaying && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white text-2xl border border-white/20 shadow-2xl pl-1 animate-scale-in">
                              ▶
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TOP STATUS BAR: Dynamic Island & Reels Header */}
                    <div
                      className="relative z-30 pt-3 px-3 transition-transform duration-500 pointer-events-auto"
                      style={{
                        transform: exploded ? 'translateZ(38px)' : 'translateZ(8px)',
                      }}
                    >
                      {/* Dynamic Island in center */}
                      <div className="mx-auto mb-2 h-4.5 w-26 rounded-full bg-black/95 flex items-center justify-between px-2.5 shadow-md border border-white/10 pointer-events-none">
                        <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
                        <span className="text-[8px] font-mono font-bold text-white/70 tracking-wider">
                          4K LIVE
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#202738]" />
                      </div>

                      {/* Reels Top Navigation */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5 drop-shadow-md">
                          <span className="font-display text-base font-extrabold tracking-tight text-white">
                            Reels
                          </span>
                          <span className="text-[10px] text-white/70">▼</span>
                        </div>

                        {/* Sound Toggle Button */}
                        {isDirectVideo && (
                          <button
                            type="button"
                            onClick={handleToggleMute}
                            data-cursor="AUDIO"
                            className="flex items-center gap-1.5 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white border border-white/20 shadow-lg transition-all active:scale-95"
                          >
                            <span>{isMuted ? '🔇' : '🔊'}</span>
                            <span>{isMuted ? 'Tap for Sound' : 'Sound ON'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* AUTHENTIC REELS OVERLAY: Bottom Metadata & Right Action Stack */}
                    <div
                      className="relative z-30 flex items-end justify-between p-3.5 pb-3 pointer-events-none transition-transform duration-500"
                      style={{
                        transform: exploded ? 'translateZ(46px)' : 'translateZ(10px)',
                      }}
                    >
                      {/* BOTTOM-LEFT: Creator Avatar, Handle, Follow, Caption & Audio Ticker */}
                      <div className="max-w-[72%] space-y-2 pointer-events-auto text-left">
                        {/* Creator Handle & Follow Pill */}
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[1.5px] shadow-md">
                            <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white">
                              S
                            </div>
                          </div>
                          <span className="text-xs font-bold text-white drop-shadow-md">
                            {content?.site?.contact?.instagram?.replace(/^@/, '') || 'sanshift'}
                          </span>
                          <button
                            type="button"
                            onClick={handleFollow}
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-sm transition-all active:scale-95 ${
                              isFollowed
                                ? 'border-white/20 bg-white/20 text-white/80'
                                : 'border-white/50 bg-white/10 hover:bg-white/25 text-white'
                            }`}
                          >
                            {isFollowed ? 'Following' : 'Follow'}
                          </button>
                        </div>

                        {/* Reel Caption */}
                        <p className="text-xs text-white/95 leading-snug drop-shadow-md font-sans line-clamp-2">
                          {current.caption}
                        </p>

                        {/* Music Audio Tag */}
                        <div className="flex items-center gap-1.5 text-[10px] text-white/85 font-mono drop-shadow-sm">
                          <span>🎵</span>
                          <span className="truncate">{current.soundtrack}</span>
                        </div>
                      </div>

                      {/* BOTTOM-RIGHT: Vertical Action Column (Like, Comment, Share, More, Spinning Disc) */}
                      <div className="flex flex-col items-center gap-3.5 text-white pointer-events-auto">
                        {/* Heart / Like Button */}
                        <button
                          type="button"
                          onClick={handleLike}
                          data-cursor="LIKE"
                          className="flex flex-col items-center group transition-transform active:scale-125"
                        >
                          <span
                            className={`text-2xl filter drop-shadow-md transition-all ${
                              hasLiked ? 'scale-115 text-rose-500' : 'text-white'
                            }`}
                          >
                            {hasLiked ? '❤️' : '🤍'}
                          </span>
                          <span className="text-[10px] font-bold mt-0.5 drop-shadow-md">
                            {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}
                          </span>
                        </button>

                        {/* Comment Button */}
                        <div className="flex flex-col items-center">
                          <span className="text-2xl drop-shadow-md">💬</span>
                          <span className="text-[10px] font-bold mt-0.5 drop-shadow-md">1.2K</span>
                        </div>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={handleShare}
                          data-cursor="SHARE"
                          title="Copy Link"
                          className="flex flex-col items-center transition-transform active:scale-95"
                        >
                          <span className="text-2xl drop-shadow-md">✈️</span>
                          <span className="text-[10px] font-bold mt-0.5 drop-shadow-md">Share</span>
                        </button>

                        {/* Options ⋯ */}
                        <button
                          type="button"
                          className="text-lg font-bold tracking-widest text-white/85 hover:text-white drop-shadow-md"
                        >
                          ⋯
                        </button>

                        {/* Spinning Audio Vinyl Disc in Corner */}
                        <div className="relative flex items-center justify-center pt-0.5">
                          <div
                            className={`h-7 w-7 rounded-full border border-white/25 bg-black p-0.5 shadow-lg ${
                              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                            }`}
                          >
                            <div className="h-full w-full rounded-full bg-gradient-to-tr from-brand-blue to-cyan-400 flex items-center justify-center text-[7px] font-black text-white">
                              S
                            </div>
                          </div>
                          {/* Animated floating music note */}
                          {isPlaying && !isMuted && (
                            <span className="absolute -top-2.5 -right-1 text-[9px] animate-bounce">
                              🎵
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* REELS BOTTOM SCRUBBER LINE */}
                    <div
                      className="absolute bottom-0 left-0 right-0 z-40 h-1 bg-white/20 cursor-pointer overflow-hidden"
                      onClick={handleSeek}
                      title="Seek video"
                    >
                      <div
                        className="h-full bg-white transition-all shadow-[0_0_6px_#ffffff]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Floating Heart Burst Effect */}
                    {showHeartBurst && (
                      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                        <span className="text-6xl animate-ping opacity-90 drop-shadow-2xl">
                          ❤️
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Micro instruction pill */}
                <div className="mt-3 text-center flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 font-mono text-[10px] font-medium text-black/50 dark:text-white/50 backdrop-blur-sm">
                    <span>✦ Move cursor to tilt 3D phone</span>
                  </span>
                  {isDirectVideo && (
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 font-mono text-[10px] font-bold text-brand-blue">
                      <span>Tap screen to play/pause</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Brief Modal */}
      <QuickBriefModal
        isOpen={briefOpen}
        defaultService="Content Creation"
        onClose={() => setBriefOpen(false)}
      />
    </section>
  )
}
