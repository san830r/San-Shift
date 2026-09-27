import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import DirectCheckoutModal from '../components/DirectCheckoutModal'
import { useContent } from '../content/ContentContext'
import { useCurrency } from '../content/CurrencyContext'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import bundleImage from '../assets/products/biggest-editing-bundle.webp'

// Utility to assign contextual icons to any category dynamically
function getCategoryIcon(cat) {
  const c = (cat || '').toLowerCase()
  if (c.includes('bundle') || c.includes('all')) return '💎'
  if (c.includes('video') || c.includes('motion') || c.includes('vfx')) return '🎬'
  if (c.includes('preset') || c.includes('lut') || c.includes('color')) return '🎨'
  if (c.includes('audio') || c.includes('sound') || c.includes('sfx')) return '🎧'
  if (c.includes('reel') || c.includes('canva') || c.includes('social') || c.includes('template')) return '📱'
  if (c.includes('font') || c.includes('text') || c.includes('typography')) return '🔤'
  if (c.includes('3d') || c.includes('mockup') || c.includes('icon')) return '✨'
  if (c.includes('mobile') || c.includes('capcut')) return '📲'
  if (c.includes('photo') || c.includes('wallpaper')) return '📸'
  return '📦'
}

export default function Catalog() {
  const navigate = useNavigate()
  const { content } = useContent()
  const { formatPrice } = useCurrency()

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const flagshipProduct =
    content.products.find((p) => p.id === content.site.featuredProductId) ?? content.products[0]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleOpenCheckout = (product) => {
    playChimeSound()
    setSelectedProduct(product)
    setCheckoutOpen(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 pt-28 pb-24">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-brand-blue/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/4 h-[550px] w-[550px] rounded-full bg-purple-600/10 dark:bg-purple-600/15 blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        {/* Top Back Action Bar */}
        <div className="mb-8 sm:mb-10 pt-1">
          <button
            type="button"
            onClick={() => {
              playClickSound()
              navigate('/')
            }}
            className="group inline-flex items-center gap-2.5 rounded-full border border-black/10 dark:border-white/15 bg-white/90 dark:bg-white/5 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-mono font-black uppercase tracking-wider text-black dark:text-white shadow-sm hover:border-brand-blue hover:text-brand-blue dark:hover:border-brand-blue dark:hover:text-cyan-400 hover:shadow-md hover:shadow-brand-blue/20 active:scale-95 transition-all cursor-pointer"
          >
            <span className="font-sans text-sm sm:text-base transition-transform duration-300 group-hover:-translate-x-1.5 text-brand-blue dark:text-cyan-400 font-bold">←</span>
            <span>BACK TO HOME</span>
          </button>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-brand-offwhite dark:bg-white/5 px-3.5 py-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black/75 dark:text-white/80 shadow-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span>THE ARCHIVE // 55,000,000+ VERIFIED ASSETS</span>
            </div>

            <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.95] text-black dark:text-white">
              EXPLORE THE <span className="animate-shimmer-text">SAN SHIFT VAULT</span>
            </h1>

            <p className="mt-4 sm:mt-5 text-xs sm:text-base lg:text-lg leading-relaxed text-black/65 dark:text-white/70 font-sans max-w-2xl mx-auto">
              Everything high-retention video editors and viral creators need in one place. Hollywood sound design, cinematic color LUTs, motion overlays, and creator toolkits with instant lifetime Google Drive delivery.
            </p>
          </Reveal>

          {/* Quick HUD Metrics Bar */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto text-center font-mono">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-brand-offwhite/80 dark:bg-white/[0.03] p-2.5 sm:p-3 backdrop-blur-md">
              <span className="block font-display text-lg sm:text-2xl font-black text-brand-blue">
                55M+
              </span>
              <span className="text-[10px] sm:text-[11px] text-black/60 dark:text-white/60 uppercase">
                Digital Assets
              </span>
            </div>
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-brand-offwhite/80 dark:bg-white/[0.03] p-2.5 sm:p-3 backdrop-blur-md">
              <span className="block font-display text-lg sm:text-2xl font-black text-emerald-500">
                0%
              </span>
              <span className="text-[10px] sm:text-[11px] text-black/60 dark:text-white/60 uppercase">
                Gateway Fee (UPI)
              </span>
            </div>
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-brand-offwhite/80 dark:bg-white/[0.03] p-2.5 sm:p-3 backdrop-blur-md">
              <span className="block font-display text-lg sm:text-2xl font-black text-purple-500">
                &lt; 5s
              </span>
              <span className="text-[10px] sm:text-[11px] text-black/60 dark:text-white/60 uppercase">
                Instant Drive Unlock
              </span>
            </div>
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-brand-offwhite/80 dark:bg-white/[0.03] p-2.5 sm:p-3 backdrop-blur-md">
              <span className="block font-display text-lg sm:text-2xl font-black text-brand-yellow">
                100%
              </span>
              <span className="text-[10px] sm:text-[11px] text-black/60 dark:text-white/60 uppercase">
                Commercial License
              </span>
            </div>
          </div>
        </div>

        {/* Flagship Crown Jewel Banner (₹99 Biggest Editing Bundle) — 100% FULL UNCROPPED RATIO */}
        {flagshipProduct && (
          <Reveal delay={100}>
            <div className="mb-10 sm:mb-14 rounded-3xl border-2 border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 via-[#0c101c] to-purple-900/10 p-4 sm:p-8 lg:p-10 shadow-[0_25px_80px_rgba(0,56,255,0.25)] relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] items-center gap-6 sm:gap-8">
                {/* Left: 100% Complete Uncropped Artwork Chassis */}
                <div className="relative group mx-auto w-full flex items-center justify-center">
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/60 backdrop-blur-md w-full flex items-center justify-center p-2 sm:p-4">
                    <img
                      src={flagshipProduct.image || bundleImage}
                      alt={flagshipProduct.name}
                      className="w-full h-auto max-h-[520px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                </div>

                {/* Right: Flagship Specs, Badges & 1-Click Buy */}
                <div className="flex flex-col items-start text-white">
                  {/* Status Badges placed above title (NEVER covering the image!) */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                    <span className="rounded-full bg-emerald-500 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase shadow-md shadow-emerald-500/20">
                      🔥 ALL-IN-ONE MASTER VAULT
                    </span>
                    <span className="rounded-full bg-brand-yellow/20 border border-brand-yellow/40 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold text-brand-yellow">
                      ⚡ FLASH SALE — 90% OFF
                    </span>
                  </div>

                  <h2 className="font-display text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                    {flagshipProduct.name}
                  </h2>

                  <p className="mt-2 text-xs sm:text-base text-white/75 font-sans leading-relaxed">
                    {flagshipProduct.shortDescription ||
                      'The ultimate collection of resources for video editing, content creation and digital marketing. 55M+ assets, sound effects, transitions, fonts, and Canva templates in one instant lifetime Google Drive link.'}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-3.5 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 w-full">
                    {[
                      '🎬 1L+ Video Assets',
                      '🎧 25K+ Sound FX',
                      '🎨 500+ Cinema LUTs',
                      '📱 30K+ Viral Reels',
                      '🔤 5K+ Pro Fonts',
                      '⚡ 3L+ Canva Templates',
                    ].map((feat) => (
                      <div
                        key={feat}
                        className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-mono font-medium text-white/80"
                      >
                        {feat}
                      </div>
                    ))}
                  </div>

                  {/* Price Bar & Instant Action */}
                  <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 w-full">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-black text-2xl sm:text-4xl text-white">
                          {formatPrice(flagshipProduct.price || 99)}
                        </span>
                        <span className="font-mono text-xs sm:text-sm text-white/40 line-through">
                          {formatPrice(flagshipProduct.originalPrice || 1000)}
                        </span>
                        <span className="rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5">
                          SAVE 90%
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/50 block mt-0.5">
                        One-Time Direct UPI Payment • Instant Google Drive Access
                      </span>
                    </div>

                    <div className="w-full sm:w-auto sm:flex-1 flex justify-start sm:justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenCheckout(flagshipProduct)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-cyan-500 hover:brightness-110 active:scale-95 text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl shadow-brand-blue/40 transition-all cursor-pointer"
                      >
                        <span>⚡ UNLOCK FULL VAULT (₹99)</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Products Grid Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 pt-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-blue dark:text-cyan-400 mb-1">
              <span>⚡ VERIFIED PACKS</span>
              <span>•</span>
              <span>INSTANT DIGITAL DELIVERY</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
              ALL DIGITAL VAULTS ({content.products.length})
            </h2>
          </div>
        </div>

        {/* Product Cards Presentation — Big, Bold, Attractive Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-16">
          {content.products.map((p) => {
            const isFlagship = p.id === 'biggest-editing-pack'
            return (
              <div
                key={p.id}
                className="group relative rounded-3xl border border-black/10 dark:border-white/15 bg-brand-offwhite/90 dark:bg-[#0c101c]/90 backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 hover:border-brand-blue/50 hover:shadow-2xl hover:shadow-brand-blue/15 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Badges: Category + Availability */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 border border-brand-blue/30 px-3 py-1 text-[11px] font-mono font-bold text-brand-blue dark:text-cyan-400 uppercase tracking-wider truncate">
                      {p.category || 'DIGITAL PACK'}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-mono font-bold shrink-0 ${
                        p.available
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 border border-black/10 dark:border-white/15'
                      }`}
                    >
                      {p.available ? '● INSTANT ACCESS' : 'COMING SOON'}
                    </span>
                  </div>

                  {/* Big Artwork Box — 1:1 Aspect Ratio, Zero Letterboxing, Edge-to-Edge inside card */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 mb-4 border border-black/10 dark:border-white/10 shadow-sm group-hover:border-brand-blue/40 group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-black/35 dark:text-white/35">
                        <span className="text-5xl mb-2">{getCategoryIcon(p.category)}</span>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider">
                          {p.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Title & Desc */}
                  <h3 className="font-display font-black text-lg sm:text-xl text-black dark:text-white uppercase tracking-tight leading-snug">
                    {p.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-black/60 dark:text-white/60 font-sans leading-relaxed line-clamp-2">
                    {p.shortDescription || p.tagline}
                  </p>
                </div>

                {/* Bottom Action Section */}
                <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
                  <div>
                    {p.price ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display font-black text-xl text-brand-blue">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="font-mono text-xs text-black/40 dark:text-white/40 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-brand-yellow font-bold uppercase">
                        Included in Bundle
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${p.id}`}
                      className="rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-3.5 py-2 text-[11px] font-mono font-bold text-black/70 dark:text-white/80 transition-colors"
                    >
                      SPECS
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(p)}
                      className="rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-dark hover:brightness-110 active:scale-95 text-white px-4 py-2 text-xs font-black uppercase tracking-wider shadow-md shadow-brand-blue/30 transition-all cursor-pointer"
                    >
                      {isFlagship ? '⚡ GET (₹99)' : `BUY (${formatPrice(p.price)})`}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 36 Asset Sub-Collections Explorer (Inside the 55M+ Vault) */}
        <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-brand-offwhite/60 dark:bg-[#0c101c]/60 backdrop-blur-2xl p-6 sm:p-10 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-cyan-400">
              COMPLETE INVENTORY BREAKDOWN
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white mt-1">
              WHAT’S PACKED INSIDE THE <span className="animate-shimmer-text">55M+ VAULT</span>
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-black/60 dark:text-white/60 font-sans">
              All 36 categories below are unlocked immediately in one master Google Drive folder upon checkout.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {content.whatsInside?.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-3 text-center transition-all hover:border-brand-blue/40 hover:scale-102"
              >
                <div className="font-mono text-base mb-1">📁</div>
                <div className="font-display font-bold text-xs text-black dark:text-white truncate">
                  {item.title}
                </div>
                <div className="text-[10px] font-mono text-black/40 dark:text-white/40 mt-0.5">
                  Verified Pack
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => handleOpenCheckout(flagshipProduct)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-dark hover:brightness-110 active:scale-95 text-white px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl shadow-brand-blue/40 transition-all cursor-pointer"
            >
              <span>ACCESS ALL 36 CATEGORIES NOW — JUST ₹99</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Comparison Matrix: Free Internet Torrents vs SAN SHIFT Vault */}
        <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#0c101c] p-6 sm:p-10 mb-16 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
              RANDOM INTERNET DOWNLOADS <span className="text-red-500">VS</span> SAN SHIFT VIP
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-black/60 dark:text-white/60 font-sans">
              Why 1,500+ video editors and creators switched to SAN SHIFT.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 font-mono text-[11px] uppercase">
                  <th className="pb-3">Feature</th>
                  <th className="pb-3 text-red-500">Free Downloads / Torrents</th>
                  <th className="pb-3 text-emerald-500 font-bold">SAN SHIFT VIP Vault</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                <tr>
                  <td className="py-3 font-bold text-black dark:text-white">File Organization</td>
                  <td className="py-3 text-black/50 dark:text-white/50">Messy, chaotic filenames, random folders</td>
                  <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">✓ 36 Clean Categorized Folders</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-black dark:text-white">Download Speed</td>
                  <td className="py-3 text-black/50 dark:text-white/50">Slow ads, broken links, 100 captcha gates</td>
                  <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">✓ Direct High-Speed Google Drive</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-black dark:text-white">Commercial License</td>
                  <td className="py-3 text-black/50 dark:text-white/50">Copyright strike risk on YouTube &amp; Reels</td>
                  <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">✓ 100% Royalty-Free Commercial Use</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-black dark:text-white">Format Quality</td>
                  <td className="py-3 text-black/50 dark:text-white/50">Compressed, 720p, watermarked previews</td>
                  <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">✓ 4K UHD Mastered &amp; 32-Bit WAV Audio</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-black dark:text-white">Future Updates</td>
                  <td className="py-3 text-black/50 dark:text-white/50">None, links die in 2 weeks</td>
                  <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">✓ Lifetime Access &amp; New Asset Drops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Direct Checkout Modal */}
      {selectedProduct && (
        <DirectCheckoutModal
          isOpen={checkoutOpen}
          product={selectedProduct}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  )
}
