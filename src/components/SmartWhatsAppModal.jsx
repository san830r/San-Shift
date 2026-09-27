import { useState, useEffect } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { stopLenis, startLenis } from '../lib/lenisSetup'
import { IconWhatsapp } from './icons/SocialIcons'

export const SMART_WHATSAPP_CATEGORIES = [
  {
    id: 'reels',
    emoji: '🎬',
    badge: 'Trending 🔥',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    title: 'Commercial Reels & Video Editing',
    desc: 'Cinematic pacing, 3D motion, sound design, Alex Hormozi & Ali Abdaal retention edits',
    tagline: 'Looking for high-impact video editing',
    generateMsg: (name, note) =>
      `Hi SAN SHIFT! 🚀\n\nI'm reaching out from your website.\n\n🎯 *Project Interest:* Commercial Reels & Video Editing\n${name ? `👤 *Name / Brand:* ${name}\n` : ''}${note ? `📝 *Requirements:* ${note}\n` : ''}\nCan we discuss your availability and pricing?`,
  },
  {
    id: 'growth',
    emoji: '🚀',
    badge: 'High ROAS',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    title: 'Brand Growth & Digital Marketing',
    desc: 'High-converting Meta ad creatives, full-funnel strategy, organic views & follower scaling',
    tagline: 'Want to scale reach, leads & conversions',
    generateMsg: (name, note) =>
      `Hi SAN SHIFT! 🚀\n\nI'm reaching out from your website.\n\n🎯 *Project Interest:* Brand Growth & Digital Marketing\n${name ? `👤 *Name / Brand:* ${name}\n` : ''}${note ? `📝 *Goals:* ${note}\n` : ''}\nWe want to scale our brand with performance video assets. Let's talk!`,
  },
  {
    id: 'bundle',
    emoji: '💎',
    badge: '₹99 Instant',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    title: '55M+ Editing Vault Bundle Support',
    desc: 'Lifetime VIP Google Drive access query, UPI verification, or collection questions',
    tagline: '55M+ asset pack access or questions',
    generateMsg: (name, note) =>
      `Hi SAN SHIFT! 💎\n\nI'm reaching out regarding the *55M+ Editing Assets Vault Bundle* (₹99).\n${name ? `👤 *Name:* ${name}\n` : ''}${note ? `📝 *Query:* ${note}\n` : ''}\nCould you help me with the VIP Google Drive access?`,
  },
  {
    id: 'retainer',
    emoji: '🤝',
    badge: 'Monthly Retainer',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    title: 'Dedicated Monthly Creative Retainer',
    desc: 'Dedicated full-time editing team & agency bandwidth reserved for your brand',
    tagline: 'Full-time editing partner on retainer',
    generateMsg: (name, note) =>
      `Hi SAN SHIFT! 🤝\n\nWe are looking for a dedicated *Monthly Creative Retainer* partner for our company.\n${name ? `🏢 *Brand / Handle:* ${name}\n` : ''}${note ? `📝 *Monthly Scope:* ${note}\n` : ''}\nLet's schedule a call to discuss retainer slots and deliverables.`,
  },
  {
    id: 'custom',
    emoji: '💬',
    badge: 'Custom Brief',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    title: 'Custom Creative Project / Other',
    desc: 'Custom motion design, sound effects, thumbnail packages, or bespoke production',
    tagline: 'Have a unique idea or custom brief',
    generateMsg: (name, note) =>
      `Hi SAN SHIFT! 👋\n\nI have a custom creative project requirement.\n${name ? `👤 *Name / Brand:* ${name}\n` : ''}${note ? `📝 *Project Brief:* ${note}\n` : ''}\nLet's connect and discuss details!`,
  },
]

/**
 * Global helper to trigger the Smart WhatsApp Modal from anywhere
 */
export function openSmartWhatsAppModal(category = null) {
  window.dispatchEvent(
    new CustomEvent('open-smart-whatsapp-modal', {
      detail: { category },
    })
  )
}

export default function SmartWhatsAppModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('reels')
  const [clientName, setClientName] = useState('')
  const [clientNote, setClientNote] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const activeCategory =
    SMART_WHATSAPP_CATEGORIES.find((c) => c.id === selectedId) || SMART_WHATSAPP_CATEGORIES[0]

  const finalMessage = activeCategory.generateMsg(clientName.trim(), clientNote.trim())

  // Listen for global window trigger
  useEffect(() => {
    const handleOpen = (e) => {
      const cat = e.detail?.category
      if (cat) {
        const found = SMART_WHATSAPP_CATEGORIES.find(
          (c) => c.id === cat || c.title.toLowerCase().includes(String(cat).toLowerCase())
        )
        if (found) setSelectedId(found.id)
      }
      playChimeSound()
      setIsOpen(true)
    }

    window.addEventListener('open-smart-whatsapp-modal', handleOpen)
    return () => window.removeEventListener('open-smart-whatsapp-modal', handleOpen)
  }, [])

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Lock scroll & pause Lenis smoothly
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

  if (!isOpen) return null

  const handleLaunchWhatsApp = () => {
    playChimeSound()

    // 1. Automatically log lead into Admin Panel CRM (sanshift_leads)
    try {
      const existing = JSON.parse(localStorage.getItem('sanshift_leads') || '[]')
      const newLead = {
        id: `WA-${Date.now().toString().slice(-4)}`,
        name: clientName.trim() || 'WhatsApp Inquirer',
        phone: '',
        email: '',
        service: activeCategory.title,
        budget: activeCategory.badge,
        message: clientNote.trim() || `Inquired via WhatsApp for: ${activeCategory.title}`,
        date: new Date().toISOString(),
        status: 'New',
      }
      localStorage.setItem('sanshift_leads', JSON.stringify([newLead, ...existing]))
    } catch (err) {
      console.warn('Could not save WhatsApp lead locally:', err)
    }

    // 2. Open WhatsApp in new tab
    const url = `https://wa.me/917339467830?text=${encodeURIComponent(finalMessage)}`
    window.open(url, '_blank', 'noopener,noreferrer')

    // Close modal
    setIsOpen(false)
  }

  const handleScrollToContact = () => {
    playClickSound()
    setIsOpen(false)
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/#contact'
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 animate-fade-in"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={() => {
          playClickSound()
          setIsOpen(false)
        }}
        className="fixed inset-0 bg-black/75 backdrop-blur-xl transition-opacity"
      />

      {/* Main Glassmorphic Modal Container */}
      <div className="relative z-10 flex flex-col w-full max-w-2xl max-h-[calc(100dvh-1rem)] sm:max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0a0e1c] text-white shadow-[0_30px_90px_rgba(0,56,255,0.25)]">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl" />

        {/* Modal Header */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-7 py-3 sm:py-4 bg-[#0c1122]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-lg shadow-emerald-500/25">
              <IconWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 border border-[#0c1122]" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Priority VIP Desk
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/40">•</span>
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Now
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-black tracking-tight text-white truncate">
                LET'S TALK — DIRECT WHATSAPP
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              setIsOpen(false)
            }}
            className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          data-lenis-prevent="true"
          className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-7 pt-3.5 sm:pt-5 pb-8 sm:pb-10 space-y-3.5 sm:space-y-5 custom-scrollbar overscroll-contain"
        >
          
          {/* Subtitle Banner */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-2.5 sm:p-3.5 flex items-center justify-between gap-3">
            <p className="text-[11px] sm:text-xs text-emerald-200/90 leading-relaxed">
              ⚡ <strong>Instant Agency Connection:</strong> Select what you need below. We'll format a custom WhatsApp message so the SAN SHIFT team knows your project requirements instantly!
            </p>
            <span className="hidden sm:inline-block shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
              Avg. &lt; 5m reply
            </span>
          </div>

          {/* Section: Category Selection */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white/50 mb-2">
              1. What can SAN SHIFT build for you?
            </label>
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
              {SMART_WHATSAPP_CATEGORIES.map((cat) => {
                const isSelected = selectedId === cat.id
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      playClickSound()
                      setSelectedId(cat.id)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        playClickSound()
                        setSelectedId(cat.id)
                      }
                    }}
                    className={`cursor-pointer text-left rounded-xl p-2.5 sm:p-3.5 transition-all duration-200 border flex items-start gap-2.5 sm:gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-500/10 shadow-[0_0_20px_rgba(37,211,102,0.15)] ring-1 ring-emerald-400/50'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 text-lg sm:text-xl border border-white/10">
                      {cat.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                        <h3 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                          {cat.title}
                        </h3>
                        <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${cat.badgeColor}`}>
                          {cat.badge}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="shrink-0 self-center">
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500 text-white'
                            : 'border-white/20 bg-transparent'
                        }`}
                      >
                        {isSelected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-black" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section: Optional Details */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-white/50 mb-2.5">
              2. Your Details (Optional — Skip to Jump In)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Your Name or Brand Handle (e.g. Arun / Nova)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-emerald-400 focus:bg-white/[0.07] transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Short Note or Budget (e.g. 10 reels this month)"
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-emerald-400 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: WhatsApp Message Live Preview Toggle */}
          <div className="rounded-xl border border-white/10 bg-[#070a14] p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white/70 flex items-center gap-1.5">
                <span className="text-emerald-400">💬</span> Message Live Preview
              </span>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                {showPreview ? 'Hide Preview' : 'Show Full Preview'}
              </button>
            </div>

            {showPreview ? (
              <div className="mt-3 rounded-lg border border-emerald-500/20 bg-[#0f1523] p-3 text-xs text-emerald-100 font-mono whitespace-pre-wrap leading-relaxed">
                {finalMessage}
              </div>
            ) : (
              <p className="mt-1 text-[11px] text-white/40 truncate font-mono">
                "{finalMessage.split('\n')[0]} {finalMessage.split('\n')[2]}"
              </p>
            )}
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="relative z-10 shrink-0 border-t border-white/10 bg-[#0c1122] px-4 sm:px-7 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleLaunchWhatsApp}
              data-cursor="WHATSAPP"
              className="group relative flex w-full flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-5 py-3 sm:py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(37,211,102,0.45)] active:scale-95"
            >
              <IconWhatsapp className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span>Launch WhatsApp Chat Now</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 font-sans text-sm">
                ⚡
              </span>
            </button>

            <button
              type="button"
              onClick={handleScrollToContact}
              className="w-full sm:w-auto text-[11px] sm:text-xs font-semibold text-white/50 hover:text-white px-2 py-1.5 transition-colors whitespace-nowrap text-center"
            >
              Or fill traditional form ↓
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
