import { useState } from 'react'
import { playClickSound } from '../lib/soundFx'
import { openSmartWhatsAppModal } from './SmartWhatsAppModal'

const STATS = [
  { label: 'Total Organic Views Generated', value: '48.6M+', detail: 'Across client reels & campaigns' },
  { label: 'Average Hook Retention Surge', value: '+182%', detail: 'Audience watch-time uplift' },
  { label: 'Delivered Projects & Bundles', value: '1,500+', detail: 'Zero missed delivery deadlines' },
  { label: 'Client Satisfaction Rating', value: '4.98 / 5', detail: 'Based on 500+ creator reviews' },
]

const CATEGORIES = ['ALL', 'VIRAL REELS', 'YOUTUBE & MOTION', 'BRAND SYSTEMS']

const TESTIMONIALS = [
  {
    category: 'VIRAL REELS',
    name: 'Vikram S.',
    role: 'Tech & Lifestyle Creator',
    handle: '@vikramtech',
    metric: '12K → 840K Views in 14 Days',
    quote:
      'SAN SHIFT completely re-engineered my video pacing. The 3D hooks and sound design retained viewers from the very first second. Our subscriber growth tripled in two weeks.',
    avatar: 'VS',
    tag: 'Reel Hook Optimization',
    verified: true,
  },
  {
    category: 'BRAND SYSTEMS',
    name: 'Kavitha R.',
    role: 'Founder, Lumina Digital',
    handle: '@luminadigital',
    metric: '+320% Inbound Lead Conversion',
    quote:
      'They didn’t just design a website; they created an entire futuristic brand language. The anti-gravity 3D aesthetics and typography instantly set us apart from competitors.',
    avatar: 'KR',
    tag: 'Full Brand Rebrand & Web',
    verified: true,
  },
  {
    category: 'YOUTUBE & MOTION',
    name: 'Arjun M.',
    role: 'Finance & Crypto Educator',
    handle: '@arjunfinancial',
    metric: '74% Average Percentage Viewed',
    quote:
      'Editing 15-minute finance breakdowns used to be boring. SAN SHIFT added bespoke 3D charts, kinetic graphics, and punchy SFX that kept retention above 70% consistently.',
    avatar: 'AM',
    tag: 'Longform YouTube Master Edit',
    verified: true,
  },
  {
    category: 'VIRAL REELS',
    name: 'Sneha & Dev',
    role: 'D2C Brand Creators',
    handle: '@shopauric',
    metric: '₹4.2L Sales from 3 Reels',
    quote:
      'The product animation and kinetic typography they built made our new launch look like an Apple ad. The reels generated our highest ROAS to date.',
    avatar: 'SD',
    tag: 'D2C Product Reels',
    verified: true,
  },
  {
    category: 'YOUTUBE & MOTION',
    name: 'Dinesh K.',
    role: 'Motion Designer & Educator',
    handle: '@dinesh_motion',
    metric: '10x Faster Workflow',
    quote:
      'The SAN SHIFT Biggest Editing Bundle has the cleanest project files, SFX, and transition presets I’ve ever seen. It shaved 4 hours off every single client project.',
    avatar: 'DK',
    tag: 'Bundle & Digital Assets',
    verified: true,
  },
  {
    category: 'BRAND SYSTEMS',
    name: 'Naveen P.',
    role: 'Agency Director',
    handle: '@pulseagency',
    metric: 'Same-Day Turnaround Guaranteed',
    quote:
      'SAN SHIFT is our secret weapon agency partner. When we have emergency client campaigns, their 24-hour turnaround and flawless export quality save the day every time.',
    avatar: 'NP',
    tag: 'Agency White-Label Partner',
    verified: true,
  },
]

export default function CreatorProofWall() {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const filtered = activeCategory === 'ALL'
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.category === activeCategory)

  return (
    <section id="proof" className="relative py-24 sm:py-32 bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 border-t border-black/5 dark:border-white/5">
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 dark:bg-brand-blue/15 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-brand-blue">
              <span>Verified Creator Social Proof</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-black dark:text-white leading-[1.05]">
              TRUSTED BY LEADERS. <br />
              <span className="text-brand-blue">VALIDATED BY METRICS.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-black/60 dark:text-white/60">
              Real creators, founders, and agencies scaling their reach, retention, and revenue through the SAN SHIFT creative standard.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playClickSound()
                  setActiveCategory(cat)
                }}
                data-cursor="FILTER"
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                    : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* High-Impact Stat Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-black/8 dark:border-white/10 bg-[#f9faff] dark:bg-white/[0.03] p-6 text-center hover:border-brand-blue/40 transition-colors"
            >
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-brand-blue tracking-tight">
                {s.value}
              </div>
              <div className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                {s.label}
              </div>
              <div className="mt-1 text-[11px] text-black/50 dark:text-white/50">
                {s.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-black/8 dark:border-white/10 bg-white dark:bg-[#0c101c] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-brand-blue/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Metric Badge & Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 px-3 py-1 text-[11px] font-black text-black dark:text-brand-yellow">
                    ⚡ {item.metric}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-black/40 dark:text-white/40">
                    {item.tag}
                  </span>
                </div>

                {/* Quote Content */}
                <p className="text-sm sm:text-[15px] leading-relaxed text-black/80 dark:text-white/80 font-medium">
                  "{item.quote}"
                </p>
              </div>

              {/* Creator Profile */}
              <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue font-black flex items-center justify-center text-sm border border-brand-blue/20">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-black dark:text-white">
                      <span>{item.name}</span>
                      {item.verified && (
                        <svg className="h-3.5 w-3.5 text-brand-blue fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-[11px] text-black/50 dark:text-white/50">
                      {item.role} • <span className="font-mono text-brand-blue">{item.handle}</span>
                    </div>
                  </div>
                </div>

                {/* 5 Star Rating */}
                <div className="flex text-brand-yellow text-xs">
                  {'★★★★★'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 rounded-3xl bg-brand-blue text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl shadow-brand-blue/20">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight">
              READY TO UPGRADE YOUR NUMBERS?
            </h3>
            <p className="mt-3 text-sm sm:text-base text-brand-blue-tint font-medium">
              Join 500+ top creators and ambitious brands who trust SAN SHIFT to elevate their content.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  openSmartWhatsAppModal('reels')
                }}
                className="rounded-full bg-white text-black font-black uppercase tracking-wider px-8 py-3.5 text-xs shadow-lg hover:bg-brand-yellow transition-colors"
              >
                Start Your Project Today ⚡
              </button>
              <a
                href="#comparison"
                onClick={playClickSound}
                className="rounded-full border border-white/30 text-white font-bold uppercase tracking-wider px-6 py-3.5 text-xs hover:bg-white/10 transition-colors"
              >
                Review Quality Showcase
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
