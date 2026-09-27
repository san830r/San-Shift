import { useState, useMemo } from 'react'
import { playClickSound } from '../lib/soundFx'

const SERVICES = [
  { id: 'content', name: 'Content Creation (Shorts & Reels)', basePrice: 2499, unit: 'per reel', baseDays: 2 },
  { id: 'editing', name: 'Video, Photo & Motion Editing', basePrice: 5999, unit: 'per edit', baseDays: 4 },
  { id: 'marketing', name: 'Digital Marketing & Reach Sprint', basePrice: 7999, unit: 'per campaign', baseDays: 5 },
  { id: 'products', name: 'Digital Product & Asset Launch', basePrice: 8999, unit: 'per launch kit', baseDays: 5 },
  { id: 'branding', name: 'Brand Growth & Digital Presence', basePrice: 9999, unit: 'complete sprint', baseDays: 7 },
  { id: 'retainer', name: 'Full Agency Creative Retainer', basePrice: 29999, unit: 'per month', baseDays: 30 },
]

const VOLUMES = {
  content: [
    { label: '3 Reels Starter Pack', multiplier: 2.8, count: 3 },
    { label: '10 Reels Growth Sprint', multiplier: 8.5, count: 10, popular: true },
    { label: '25 Reels Viral Takeover', multiplier: 20, count: 25 },
  ],
  editing: [
    { label: '1 Deep-Dive Edit (Video/Motion)', multiplier: 1, count: 1 },
    { label: '4 High-End Edits Monthly Pack', multiplier: 3.6, count: 4, popular: true },
    { label: '8 Multi-Platform Edits Pack', multiplier: 6.8, count: 8 },
  ],
  marketing: [
    { label: 'Launch Sprint (1 Campaign)', multiplier: 1, count: 1 },
    { label: 'Multi-Channel Scale (2-4 Weeks)', multiplier: 1.8, count: 1, popular: true },
    { label: 'Full Quarterly Growth Engine', multiplier: 2.6, count: 1 },
  ],
  products: [
    { label: '1 Digital Asset Pack Kit', multiplier: 1, count: 1 },
    { label: 'Full Product Packaging + Assets', multiplier: 1.7, count: 1, popular: true },
    { label: 'Complete Creator Storefront & Assets', multiplier: 2.4, count: 1 },
  ],
  branding: [
    { label: 'Digital Presence & Visual Direction', multiplier: 1, count: 1 },
    { label: 'Complete Brand Growth Suite', multiplier: 1.6, count: 1, popular: true },
    { label: 'Authority Scaling Ecosystem', multiplier: 2.2, count: 1 },
  ],
  retainer: [
    { label: 'Standard Monthly Retainer (15 Edits + Design)', multiplier: 1, count: 1 },
    { label: 'Pro Scale Retainer (30 Edits + Motion + Strategy)', multiplier: 1.8, count: 1, popular: true },
    { label: 'Full Dedicated Creative Partner', multiplier: 2.5, count: 1 },
  ],
}

const TURNAROUNDS = [
  { id: 'standard', name: 'Standard Delivery', priceMultiplier: 1.0, timeText: 'Standard Pace', badge: null },
  { id: 'rush', name: 'Express Rush (48h)', priceMultiplier: 1.25, timeText: '48 Hours Rush', badge: '⚡ FAST' },
  { id: 'priority', name: 'VIP Priority (24h)', priceMultiplier: 1.5, timeText: '24 Hours Same-Day', badge: '🔥 VIP' },
]

const ADDONS = [
  { id: 'sfx', name: 'Custom Hollywood SFX & Sound Design', price: 1499 },
  { id: '3d_elem', name: '3D Floating Objects & Kinetic Motion', price: 2499 },
  { id: 'subtitles', name: 'Alex Hormozi Style Kinetic Captions', price: 999 },
  { id: 'source', name: 'Full Project Source Files (Pr/Ae/Figma)', price: 1999 },
  { id: 'thumbnail', name: 'High-CTR YouTube/Reel Cover Designs', price: 1199 },
]

export default function ProjectEstimator() {
  const [selectedService, setSelectedService] = useState('content')
  const [selectedVolumeIdx, setSelectedVolumeIdx] = useState(1) // Default to popular
  const [selectedSpeed, setSelectedSpeed] = useState('standard')
  const [selectedAddons, setSelectedAddons] = useState(['sfx', '3d_elem'])

  const service = SERVICES.find((s) => s.id === selectedService) || SERVICES[0]
  const volumeOptions = VOLUMES[selectedService] || VOLUMES.content
  const currentVolume = volumeOptions[selectedVolumeIdx] || volumeOptions[0]
  const turnaround = TURNAROUNDS.find((t) => t.id === selectedSpeed) || TURNAROUNDS[0]

  const toggleAddon = (id) => {
    playClickSound()
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const { calculatedPrice, estimatedDays } = useMemo(() => {
    const base = service.basePrice * currentVolume.multiplier
    const addonTotal = selectedAddons.reduce((sum, id) => {
      const a = ADDONS.find((x) => x.id === id)
      return sum + (a ? a.price : 0)
    }, 0)
    const subtotal = (base + addonTotal) * turnaround.priceMultiplier
    const rounded = Math.round(subtotal / 100) * 100

    let days = service.baseDays
    if (turnaround.id === 'rush') days = Math.max(2, Math.round(days * 0.5))
    if (turnaround.id === 'priority') days = 1

    return { calculatedPrice: rounded, estimatedDays: days }
  }, [service, currentVolume, turnaround, selectedAddons])

  const handleWhatsAppQuote = () => {
    playClickSound()
    const addonNames = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'None'

    const message = encodeURIComponent(
      `Hello SAN SHIFT! 👋\n\nI just configured my project scope on your website:\n\n` +
      `📌 *Service:* ${service.name}\n` +
      `📦 *Scope / Volume:* ${currentVolume.label}\n` +
      `⚡ *Turnaround:* ${turnaround.name}\n` +
      `✨ *Add-ons:* ${addonNames}\n` +
      `💰 *Estimated Budget:* ₹${calculatedPrice.toLocaleString('en-IN')}\n\n` +
      `Can we discuss timeline and kick off our project?`
    )
    window.open(`https://wa.me/917339467830?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="estimator" className="relative py-24 sm:py-32 bg-[#fafbfe] dark:bg-[#060810] text-black dark:text-white transition-colors duration-300 border-t border-black/5 dark:border-white/5">
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 dark:bg-brand-blue/15 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-brand-blue">
            <span>Transparent Pricing • Instant Scope</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-black dark:text-white leading-[1.05]">
            CALCULATE YOUR PROJECT <br />
            <span className="text-brand-blue">INSTANT ESTIMATE.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-black/60 dark:text-white/60">
            No endless waiting for sales calls. Configure your requirements in 15 seconds, see realistic pricing, and lock in your project slot directly on WhatsApp.
          </p>
        </div>

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Service Type */}
            <div className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-brand-blue">
                  STEP 01 // SELECT SERVICE
                </span>
                <span className="text-xs text-black/40 dark:text-white/40 font-mono">6 Categories</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setSelectedService(s.id)
                      setSelectedVolumeIdx(0)
                    }}
                    data-cursor="SELECT"
                    className={`p-3.5 rounded-2xl text-left border transition-all active:scale-95 flex flex-col justify-between ${
                      selectedService === s.id
                        ? 'border-brand-blue bg-brand-blue/8 dark:bg-brand-blue/20 shadow-md shadow-brand-blue/10 scale-102'
                        : 'border-black/5 dark:border-white/10 hover:border-brand-blue/30 bg-black/[0.02] dark:bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-black text-black dark:text-white leading-tight">
                      {s.name}
                    </span>
                    <span className="mt-2 text-[10px] font-mono text-black/50 dark:text-white/50">
                      Starts ₹{s.basePrice.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Deliverable Scope / Volume */}
            <div className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-brand-blue">
                  STEP 02 // DELIVERABLE VOLUME
                </span>
                <span className="text-xs text-black/40 dark:text-white/40 font-mono">Custom Sizing</span>
              </div>
              <div className="space-y-3">
                {volumeOptions.map((vol, idx) => (
                  <button
                    key={vol.label}
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setSelectedVolumeIdx(idx)
                    }}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      selectedVolumeIdx === idx
                        ? 'border-brand-blue bg-brand-blue/8 dark:bg-brand-blue/20 shadow-sm'
                        : 'border-black/5 dark:border-white/10 hover:border-black/15 bg-black/[0.02] dark:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          selectedVolumeIdx === idx ? 'border-brand-blue' : 'border-black/30 dark:border-white/30'
                        }`}
                      >
                        {selectedVolumeIdx === idx && (
                          <div className="h-2 w-2 rounded-full bg-brand-blue" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-black dark:text-white">
                        {vol.label}
                      </span>
                    </div>
                    {vol.popular && (
                      <span className="text-[10px] font-black uppercase tracking-wider rounded-full bg-brand-yellow px-2.5 py-0.5 text-black">
                        RECOMMENDED
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Turnaround Speed */}
            <div className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-black uppercase tracking-wider text-brand-blue block mb-4">
                STEP 03 // DELIVERY TIMELINE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TURNAROUNDS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setSelectedSpeed(t.id)
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      selectedSpeed === t.id
                        ? 'border-brand-blue bg-brand-blue/8 dark:bg-brand-blue/20'
                        : 'border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-black dark:text-white">{t.name}</span>
                      {t.badge && (
                        <span className="text-[9px] font-black text-brand-blue">{t.badge}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Creative Add-ons */}
            <div className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-black uppercase tracking-wider text-brand-blue block mb-4">
                STEP 04 // OPTIONAL HIGH-IMPACT ADD-ONS
              </span>
              <div className="space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id)
                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'border-brand-blue/60 bg-brand-blue/5 dark:bg-brand-blue/15'
                          : 'border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-brand-blue border-brand-blue text-white' : 'border-black/30 dark:border-white/30'
                          }`}
                        >
                          {isChecked && <span className="text-xs font-bold leading-none">✓</span>}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-black dark:text-white">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-black/60 dark:text-white/60">
                        +₹{addon.price.toLocaleString('en-IN')}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Sticky Estimate Summary Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-3xl border-2 border-black dark:border-brand-blue bg-white dark:bg-[#0c101c] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-brand-blue/15 dark:bg-brand-blue/30 rounded-bl-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                  <span className="text-[11px] font-black uppercase tracking-widest text-brand-blue">
                    PROJECT SUMMARY
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Slot Available
                  </span>
                </div>

                {/* Scope Breakdown */}
                <div className="mt-6 space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-black/70 dark:text-white/70">
                    <span>Service:</span>
                    <span className="font-bold text-black dark:text-white text-right">{service.name}</span>
                  </div>
                  <div className="flex justify-between text-black/70 dark:text-white/70">
                    <span>Scope:</span>
                    <span className="font-bold text-black dark:text-white text-right">{currentVolume.label}</span>
                  </div>
                  <div className="flex justify-between text-black/70 dark:text-white/70">
                    <span>Turnaround:</span>
                    <span className="font-bold text-black dark:text-white text-right">{turnaround.timeText}</span>
                  </div>
                  <div className="flex justify-between text-black/70 dark:text-white/70">
                    <span>Add-ons:</span>
                    <span className="font-bold text-brand-blue text-right">{selectedAddons.length} Selected</span>
                  </div>
                </div>

                {/* Timeline Box */}
                <div className="mt-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] p-3.5 flex items-center justify-between border border-black/5 dark:border-white/5">
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">Estimated Delivery:</span>
                  <span className="text-xs font-mono font-bold text-black dark:text-white">
                    {estimatedDays === 1 ? 'Within 24 Hours' : `${estimatedDays} Business Days`}
                  </span>
                </div>

                {/* Big Price Tag */}
                <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-black/50 dark:text-white/50 block">
                    ESTIMATED INVESTMENT
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
                      ₹{calculatedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-mono text-black/50 dark:text-white/50">
                      INR + GST
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-black/40 dark:text-white/40">
                    *Final price guaranteed upon WhatsApp project confirmation.
                  </p>
                </div>

                {/* CTA WhatsApp Button */}
                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppQuote}
                    data-cursor="QUOTE"
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-dark py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-brand-blue/30 active:scale-95 transition-all"
                  >
                    <span>Lock In Scope on WhatsApp</span>
                    <span>→</span>
                  </button>

                  <a
                    href="#contact"
                    onClick={playClickSound}
                    className="w-full flex items-center justify-center rounded-full border border-black/15 dark:border-white/20 py-3 text-xs font-black uppercase tracking-wider text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    Or Send Custom Brief via Form
                  </a>
                </div>

                {/* Trust guarantee micro note */}
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-black/50 dark:text-white/50 text-center">
                  <span>⚡ 100% Satisfaction Guarantee</span>
                  <span>•</span>
                  <span>Unlimited Revisions on V1</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
