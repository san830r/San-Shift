import { useState } from 'react'
import Reveal from './Reveal'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import QuickBriefModal from './QuickBriefModal'
import MarketingRadar3D from './MarketingRadar3D'
import SpotlightCard from './SpotlightCard'

const GOAL_DATA = {
  ecommerce: {
    title: 'E-Commerce & D2C Scaling',
    icon: '🛍️',
    roas: '4.6x - 6.2x',
    adPacing: 'Scale Fast (Meta Catalog + TikTok Ads)',
    deliverables: ['Dynamic Product Ads', 'Abandoned Cart Retargeting', 'High-Converting Video Hooks', 'ROAS Optimization'],
    caseMetric: '+320% Revenue in 60 Days',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    borderGlow: 'border-emerald-500/30',
  },
  personal: {
    title: 'Personal Brand & Authority',
    icon: '🎙️',
    roas: '10x Follower Growth',
    adPacing: 'Organic Algorithm + Targeted Boosts',
    deliverables: ['Viral Short-Form Clips', 'Profile Funnel Optimization', 'Audience Retargeting', 'Monetization Strategy'],
    caseMetric: '50K+ New Followers / Month',
    accentColor: 'text-brand-blue dark:text-sky-400',
    borderGlow: 'border-brand-blue/30',
  },
  leads: {
    title: 'High-Ticket Leads & B2B',
    icon: '💼',
    roas: '5.2x Pipeline Value',
    adPacing: 'Targeted Google Search + Meta Forms',
    deliverables: ['Lead Magnet Funnels', 'Automated Qualification', 'Targeted B2B Creatives', 'Direct Calendar Bookings'],
    caseMetric: '48+ Qualified Calls / Month',
    accentColor: 'text-purple-600 dark:text-purple-400',
    borderGlow: 'border-purple-500/30',
  },
}

export default function MarketingFunnelShowcase() {
  const [selectedGoal, setSelectedGoal] = useState('ecommerce') // 'ecommerce' | 'personal' | 'leads'
  const [briefOpen, setBriefOpen] = useState(false)
  const current = GOAL_DATA[selectedGoal]

  const handleSelectGoal = (key) => {
    playClickSound()
    setSelectedGoal(key)
  }

  const handleInquire = () => {
    playChimeSound()
    setBriefOpen(true)
  }

  return (
    <section id="marketing" className="relative overflow-hidden bg-white dark:bg-[#070a13] py-20 sm:py-28 border-t border-black/5 dark:border-white/5 text-black dark:text-white transition-colors duration-300">
      {/* Diffused ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-1/4 h-80 w-80 rounded-full bg-emerald-500/5 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-10 bottom-1/4 h-80 w-80 rounded-full bg-brand-blue/5 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            DIGITAL MARKETING & GROWTH ENGINE
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
            PRECISION MARKETING. MEASURABLE ROI.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/60 dark:text-white/60 sm:text-lg">
            We build profitable paid ad campaigns and organic growth funnels on Meta, Google, and TikTok that convert views into recurring revenue.
          </p>
        </Reveal>

        {/* Goal Selector Pill Bar */}
        <Reveal delay={60} className="mt-10 flex justify-center">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] p-1.5 backdrop-blur-md">
            {[
              { id: 'ecommerce', label: 'E-Commerce / D2C', icon: '🛍️' },
              { id: 'personal', label: 'Personal Brand', icon: '🎙️' },
              { id: 'leads', label: 'High-Ticket Leads', icon: '💼' },
            ].map((tab) => {
              const isActive = selectedGoal === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectGoal(tab.id)}
                  data-cursor="GOAL"
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-md scale-[1.02]'
                      : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* 3-Step Growth Pipeline Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Stage 1 */}
          <Reveal delay={80}>
            <SpotlightCard
              spotlightColor="rgba(0, 56, 255, 0.18)"
              borderColor="rgba(0, 240, 255, 0.6)"
              className="flex h-full flex-col justify-between rounded-3xl border border-black/8 dark:border-white/10 bg-brand-offwhite/50 dark:bg-[#0c101c] p-7 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-brand-blue">STAGE 01</span>
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-black uppercase text-black dark:text-white">
                  Attention Capture
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-black/60 dark:text-white/60">
                  Targeted creative hooks and video ads designed to stop the scroll and capture qualified buyer intent.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10">
                <span className="text-[11px] font-mono font-bold text-black/40 dark:text-white/40">DELIVERABLE</span>
                <p className="mt-1 text-xs font-bold text-black dark:text-white">10+ Creative Ad Variations // Meta & TikTok</p>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Stage 2 */}
          <Reveal delay={120}>
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.18)"
              borderColor="rgba(52, 211, 153, 0.6)"
              className="flex h-full flex-col justify-between rounded-3xl border border-black/8 dark:border-white/10 bg-brand-offwhite/50 dark:bg-[#0c101c] p-7 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">STAGE 02</span>
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-black uppercase text-black dark:text-white">
                  Paid Traffic & Retargeting
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-black/60 dark:text-white/60">
                  Precision targeting across Meta Ads Manager, Google Search, and YouTube with custom audience segmentation.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10">
                <span className="text-[11px] font-mono font-bold text-black/40 dark:text-white/40">DELIVERABLE</span>
                <p className="mt-1 text-xs font-bold text-black dark:text-white">Full Funnel Pixel Tracking & Retargeting Rigs</p>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Stage 3 */}
          <Reveal delay={160}>
            <SpotlightCard
              spotlightColor="rgba(147, 51, 234, 0.18)"
              borderColor="rgba(192, 132, 252, 0.6)"
              className="flex h-full flex-col justify-between rounded-3xl border border-black/8 dark:border-white/10 bg-brand-offwhite/50 dark:bg-[#0c101c] p-7 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400">STAGE 03</span>
                  <span className="text-xl">📈</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-black uppercase text-black dark:text-white">
                  Conversion & Scale
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-black/60 dark:text-white/60">
                  Landing page optimization and ROAS scaling to ensure every rupee spent returns profitable revenue.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10">
                <span className="text-[11px] font-mono font-bold text-black/40 dark:text-white/40">DELIVERABLE</span>
                <p className="mt-1 text-xs font-bold text-black dark:text-white">Weekly Performance Dashboard & ROI Reports</p>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Dynamic Strategy Summary Card with 3D Orbital Radar */}
        <Reveal delay={180} className="mt-8">
          <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-brand-offwhite/80 dark:bg-[#0b0f1d] p-6 sm:p-8 backdrop-blur-xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Strategy Info */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{current.icon}</span>
                  <h4 className="font-display text-xl sm:text-2xl font-black uppercase text-black dark:text-white">
                    {current.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 font-sans">
                  Targeted strategy: <span className="font-bold text-black dark:text-white">{current.adPacing}</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {current.deliverables.map((item, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-1 text-xs font-medium text-black/75 dark:text-white/75"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Center Column: 3D Marketing Orbit Radar */}
              <div className="lg:col-span-4 flex justify-center py-2">
                <MarketingRadar3D goal={selectedGoal} />
              </div>

              {/* Right Column: ROI Metrics & CTA */}
              <div className="lg:col-span-3 shrink-0 text-left lg:text-right border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10 pt-4 lg:pt-0 lg:pl-8 space-y-4">
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                    TARGET ROAS / IMPACT
                  </span>
                  <div className={`font-display text-3xl sm:text-4xl font-black ${current.accentColor}`}>
                    {current.roas}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    {current.caseMetric}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInquire}
                  data-cursor="INQUIRE"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-600/25 transition-all active:scale-95"
                >
                  <span>Discuss Marketing Plan</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Brief Modal */}
      <QuickBriefModal
        isOpen={briefOpen}
        defaultService="Digital Marketing"
        onClose={() => setBriefOpen(false)}
      />
    </section>
  )
}
