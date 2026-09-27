import { useState, useMemo } from 'react'
import { playClickSound } from '../lib/soundFx'
import { useCurrency } from '../content/CurrencyContext'

export default function GrowthSimulator() {
  const [views, setViews] = useState(45000)
  const [retention, setRetention] = useState(24)
  const [revenue, setRevenue] = useState(40000)
  const { formatPrice } = useCurrency()

  const projections = useMemo(() => {
    // 182% average retention surge
    const projectedRetention = Math.min(88, Math.round(retention * 2.4))
    // 3.4x organic reach expansion multiplier from algorithmic watch time
    const projectedViews = Math.round(views * 3.4)
    // Projected revenue lift proportional to reach expansion and conversion hooks
    const projectedRevenue = Math.round(revenue * 2.8)
    const revenueSurge = projectedRevenue - revenue

    return {
      projectedRetention,
      projectedViews,
      projectedRevenue,
      revenueSurge,
    }
  }, [views, retention, revenue])

  const handleSendToWhatsApp = () => {
    playClickSound()
    const msg = encodeURIComponent(
      `Hello SAN SHIFT! 📈\n\nI just simulated my channel growth on your website:\n\n` +
      `📊 *Current Stats:*\n` +
      `- Monthly Views: ${views.toLocaleString()}\n` +
      `- Current Retention: ${retention}%\n` +
      `- Current Monthly Revenue: ₹${revenue.toLocaleString('en-IN')}\n\n` +
      `🚀 *SAN SHIFT Projected Scale:*\n` +
      `- Target Retention: ${projections.projectedRetention}%\n` +
      `- Projected Reach: ${projections.projectedViews.toLocaleString()} views\n` +
      `- Estimated Revenue: ₹${projections.projectedRevenue.toLocaleString('en-IN')}\n\n` +
      `How can we execute this sprint for my brand?`
    )
    window.open(`https://wa.me/917339467830?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="simulator" className="relative py-24 sm:py-32 bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 border-t border-black/5 dark:border-white/5">
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 dark:bg-brand-blue/15 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-brand-blue">
            <span>Growth Intelligence Tool</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl text-black dark:text-white leading-[1.05]">
            CREATOR &amp; BRAND <br />
            <span className="text-brand-blue">GROWTH SIMULATOR.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-black/60 dark:text-white/60">
            Slide your channel's current numbers below to calculate how upgrading your video pacing, 3D hooks, and audio design unlocks explosive algorithmic reach.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Controls Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-8 rounded-3xl border border-black/8 dark:border-white/10 bg-brand-offwhite/50 dark:bg-white/5 p-6 sm:p-10">
            
            {/* Slider 1: Views */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-black/70 dark:text-white/70">
                  Current Monthly Views / Impressions
                </label>
                <span className="font-mono text-base font-black text-brand-blue">
                  {views.toLocaleString()} Views
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-black/15 dark:bg-white/20 accent-brand-blue cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-black/40 dark:text-white/40 mt-1">
                <span>5K</span>
                <span>250K</span>
                <span>500K+</span>
              </div>
            </div>

            {/* Slider 2: Average Retention */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-black/70 dark:text-white/70">
                  Current Average Video Retention
                </label>
                <span className="font-mono text-base font-black text-brand-yellow-dark dark:text-brand-yellow">
                  {retention}% Average Viewed
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={retention}
                onChange={(e) => setRetention(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-black/15 dark:bg-white/20 accent-brand-yellow cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-black/40 dark:text-white/40 mt-1">
                <span>10% (High Drop-off)</span>
                <span>30% (Average)</span>
                <span>50% (Strong)</span>
              </div>
            </div>

            {/* Slider 3: Current Monthly Revenue */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-black/70 dark:text-white/70">
                  Current Monthly Revenue from Content
                </label>
                <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                  {formatPrice(revenue)} / mo
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-black/15 dark:bg-white/20 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-black/40 dark:text-white/40 mt-1">
                <span>₹10K</span>
                <span>₹2.5L</span>
                <span>₹5L+</span>
              </div>
            </div>

          </div>

          {/* Results Projection Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border-2 border-brand-blue bg-[#0c101c] text-white p-7 sm:p-9 shadow-2xl overflow-hidden">
              
              {/* Corner Glow */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-brand-blue/30 blur-[50px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-yellow">
                    PROJECTED IMPACT WITH SAN SHIFT
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                {/* 3 Metric Cards */}
                <div className="mt-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-white/50 uppercase block">Target Video Retention</span>
                      <span className="text-xs text-white/40">From {retention}% baseline</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-black text-brand-yellow">
                        {projections.projectedRetention}%
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 block">+182% Surge</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-white/50 uppercase block">Projected Organic Reach</span>
                      <span className="text-xs text-white/40">Watch-time algorithm boost</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-black text-brand-blue-tint">
                        {projections.projectedViews.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-brand-blue block">3.4x Reach</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-blue/15 border border-brand-blue/40 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-white/70 uppercase block">Estimated Revenue Lift</span>
                      <span className="text-xs text-white/50">Monthly upside</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-black text-emerald-400">
                        +{formatPrice(projections.revenueSurge)}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300 block">Per Month</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  data-cursor="SCALE"
                  className="mt-7 w-full flex items-center justify-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-dark py-4 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-brand-blue/40 active:scale-95 transition-all"
                >
                  <span>Send My Projections to WhatsApp</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
