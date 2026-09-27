import { useState, useEffect } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { stopLenis, startLenis } from '../lib/lenisSetup'

const SERVICES_LIST = [
  '01. Content Creation',
  '02. Digital Marketing',
  '03. Editing (Video, Photo, Motion)',
  '04. Digital Products',
  '05. Brand Growth',
]

const TIMELINES = [
  '⚡ Express Sprint (48 Hours)',
  '📅 Standard Delivery (1-2 Weeks)',
  '🔄 Monthly Creative Retainer',
  '🚀 Full Scale Partnership',
]

export default function QuickBriefModal({ isOpen, initialService = null, onClose }) {
  const [selectedService, setSelectedService] = useState(SERVICES_LIST[0])
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINES[0])
  const [brandName, setBrandName] = useState('')
  const [notes, setNotes] = useState('')

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
    if (initialService) {
      const match = SERVICES_LIST.find((s) => s.toLowerCase().includes(initialService.toLowerCase()))
      if (match) setSelectedService(match)
    }
  }, [initialService])

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

  const handleSend = (e) => {
    e.preventDefault()
    playChimeSound()

    // Persist lead to Admin Panel Leads CRM
    try {
      const existing = JSON.parse(localStorage.getItem('sanshift_leads') || '[]')
      const newLead = {
        id: `LEAD-${Date.now().toString().slice(-4)}`,
        name: brandName?.trim() || 'Brand Partner',
        phone: '',
        email: '',
        service: selectedService || 'Creative Capabilities',
        budget: selectedTimeline || 'Standard Delivery',
        message: notes?.trim() || `Inquiry for ${selectedService} (${selectedTimeline})`,
        date: new Date().toISOString(),
        status: 'New',
      }
      localStorage.setItem('sanshift_leads', JSON.stringify([newLead, ...existing]))
    } catch (err) {
      console.warn('Could not save brief lead locally:', err)
    }

    const text = encodeURIComponent(
      `Hi SAN SHIFT! 👋\n\n` +
      `I'm inquiring about your creative capabilities:\n` +
      `🎯 *Core Capability:* ${selectedService}\n` +
      `⏱️ *Timeline / Pace:* ${selectedTimeline}\n` +
      (brandName ? `🏷️ *Brand / Handle:* ${brandName}\n` : '') +
      (notes ? `📝 *Project Details:* ${notes}\n\n` : '\n') +
      `Could we discuss your next opening and deliverables?`
    )

    window.open(`https://wa.me/917339467830?text=${text}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in"
    >
      {/* Soft Blurred Backdrop */}
      <div
        onClick={() => {
          playClickSound()
          onClose()
        }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xl transition-opacity"
      />

      {/* Main Dialog with Strict Viewport Boundaries */}
      <div className="relative z-10 flex flex-col w-full max-w-xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#0c101c] text-black dark:text-white shadow-[0_25px_70px_rgba(0,56,255,0.25)]">
        {/* Header - Always Fixed at Top */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/10 px-5 sm:px-6 py-3.5 sm:py-4 bg-white dark:bg-[#0c101c]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand-blue shadow-[0_0_6px_#0038ff]" />
            <span className="font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">
              START A PROJECT // DIRECT BRIEF
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              onClose()
            }}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="quick-brief-form"
          onSubmit={handleSend}
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 custom-scrollbar overscroll-contain"
        >
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              Let's Build Something <span className="text-brand-blue">Exceptional</span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-black/60 dark:text-white/60">
              Select your requirements and launch directly to WhatsApp in 1 click.
            </p>
          </div>

          {/* 1. Select Service */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black/50 dark:text-white/50 mb-2">
              Select Capability
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICES_LIST.map((srv) => (
                <button
                  key={srv}
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setSelectedService(srv)
                  }}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition-all cursor-pointer ${
                    selectedService === srv
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25'
                      : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="truncate">{srv}</span>
                  {selectedService === srv && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Select Timeline */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black/50 dark:text-white/50 mb-2">
              Pace &amp; Timeline
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIMELINES.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setSelectedTimeline(time)
                  }}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold text-left transition-all cursor-pointer ${
                    selectedTimeline === time
                      ? 'border border-brand-blue bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20'
                      : 'border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-black/70 dark:text-white/70 hover:border-black/20'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Brand Handle & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black/60 dark:text-white/60 mb-1.5">
                Brand / Instagram Handle <span className="text-black/35 dark:text-white/35">(Optional)</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="@yourbrand"
                className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04] px-3.5 py-2 text-sm outline-none focus:border-brand-blue text-black dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black/60 dark:text-white/60 mb-1.5">
                Quick Project Note <span className="text-black/35 dark:text-white/35">(Optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 5 viral reels + color grade"
                className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04] px-3.5 py-2 text-sm outline-none focus:border-brand-blue text-black dark:text-white"
              />
            </div>
          </div>
        </form>

        {/* Footer with Submit Button - Always Fixed at Bottom (Never Cut Off) */}
        <div className="shrink-0 border-t border-black/5 dark:border-white/10 p-4 sm:p-5 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-md">
          <button
            type="submit"
            form="quick-brief-form"
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-blue hover:bg-brand-blue-dark py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Launch WhatsApp Brief</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
