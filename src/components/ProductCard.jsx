import { Link } from 'react-router-dom'
import { CATEGORY_ICONS } from './icons/CategoryIcons'
import { playClickSound } from '../lib/soundFx'
import HolographicCard from './HolographicCard'
import { useCurrency } from '../content/CurrencyContext'

const CATEGORY_STYLES = {
  'Color & LUTs': {
    gradient: 'from-[#ff2a5f]/20 via-[#8b5cf6]/25 to-[#0038ff]/20',
    iconBg: 'bg-gradient-to-tr from-[#ff2a5f] to-[#8b5cf6]',
    chipText: 'CINEMATIC 3D LUTs',
    subText: 'Apple Log & S-Log3 Calibrated',
    accentColor: '#ff2a5f',
  },
  'Sound Design & SFX': {
    gradient: 'from-[#00d2ff]/20 via-[#0038ff]/25 to-[#7c3aed]/20',
    iconBg: 'bg-gradient-to-tr from-[#00d2ff] to-[#0038ff]',
    chipText: '24-BIT LOSSLESS AUDIO',
    subText: 'Foley, Risers & UI Feedback',
    accentColor: '#00d2ff',
  },
  'Reels & Social Media': {
    gradient: 'from-[#ec4899]/20 via-[#f43f5e]/25 to-[#f97316]/20',
    iconBg: 'bg-gradient-to-tr from-[#ec4899] to-[#f97316]',
    chipText: '4K VIRAL ARCHIVE',
    subText: 'Faceless Trending Clips',
    accentColor: '#f43f5e',
  },
  'Fonts & Typography': {
    gradient: 'from-[#f59e0b]/20 via-[#d97706]/25 to-[#b45309]/20',
    iconBg: 'bg-gradient-to-tr from-[#f59e0b] to-[#d97706]',
    chipText: 'COMMERCIAL TYPE',
    subText: 'Aesthetic Display Fonts',
    accentColor: '#f59e0b',
  },
  'Canva & Templates': {
    gradient: 'from-[#06b6d4]/20 via-[#3b82f6]/25 to-[#6366f1]/20',
    iconBg: 'bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6]',
    chipText: 'DRAG & DROP CANVA',
    subText: 'Carousels & Social Layouts',
    accentColor: '#06b6d4',
  },
  'Video & Motion': {
    gradient: 'from-[#10b981]/20 via-[#06b6d4]/25 to-[#3b82f6]/20',
    iconBg: 'bg-gradient-to-tr from-[#10b981] to-[#06b6d4]',
    chipText: 'PRO 4K OVERLAYS',
    subText: 'VFX Glitch & Film Burns',
    accentColor: '#10b981',
  },
  '3D Assets & Mockups': {
    gradient: 'from-[#a855f7]/20 via-[#6366f1]/25 to-[#ec4899]/20',
    iconBg: 'bg-gradient-to-tr from-[#a855f7] to-[#ec4899]',
    chipText: '3D CLAY & ISOMETRIC',
    subText: 'Figma & Blender Ready',
    accentColor: '#a855f7',
  },
  'Digital Bundles': {
    gradient: 'from-brand-blue/20 via-purple-600/25 to-amber-500/20',
    iconBg: 'bg-gradient-to-tr from-brand-blue to-purple-600',
    chipText: 'FLAGSHIP MASTER PACK',
    subText: '55,000,000+ Assets Inside',
    accentColor: '#0038ff',
  },
}

export default function ProductCard({ product, onInstantBuy }) {
  const { id, name, category, tagline, price, originalPrice, available, image } = product
  const { formatPrice } = useCurrency()
  const CategoryIcon = CATEGORY_ICONS[category]
  const styleInfo = CATEGORY_STYLES[category] || CATEGORY_STYLES['Digital Bundles']

  return (
    <HolographicCard className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c101c] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-blue/15 dark:hover:border-brand-blue">
      {/* 1. Header Meta: Category + Availability Badge (Placed ABOVE image, NEVER covering artwork!) */}
      <div className="flex items-center justify-between gap-2 px-4 sm:px-5 pt-4 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 border border-brand-blue/25 px-2.5 py-1 text-[10px] font-mono font-bold text-brand-blue dark:text-cyan-400 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue dark:bg-cyan-400" />
          {category}
        </span>
        {!available ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
            ⚡ DROPPING NEXT
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AVAILABLE NOW
          </span>
        )}
      </div>

      {/* 2. Grand Uncropped Showcase Stage (Large & Ultra-Premium) */}
      <div className="px-2.5 sm:px-3">
        <div className="relative w-full h-[390px] sm:h-[430px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-slate-100/60 dark:from-white/[0.03] dark:via-white/[0.01] dark:to-transparent border border-black/[0.06] dark:border-white/10 flex items-center justify-center p-1.5 sm:p-2 group-hover:border-brand-blue/30 group-hover:shadow-lg group-hover:shadow-brand-blue/5 transition-all duration-300">
          {image ? (
            <>
              {/* Soft Ambient Color Glow (Matches poster colors naturally) */}
              <img
                src={image}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 dark:opacity-35 scale-125 saturate-150 select-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-white/20 dark:bg-black/30 select-none" />

              {/* Large, Uncropped, Accurate Ratio Hero Poster */}
              <img
                src={image}
                alt={name}
                loading="lazy"
                className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-xl drop-shadow-[0_12px_28px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />

              {/* Specular sheen sweep on hover */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
            </>
          ) : (
            /* Dynamic Category Placeholder for products without uploaded images */
            <div
              className={`relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br ${
                styleInfo.gradient
              } flex flex-col items-center justify-center p-8 text-center select-none`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -right-8 h-44 w-44 rounded-full blur-3xl opacity-40"
                style={{ backgroundColor: styleInfo.accentColor || '#0038ff' }}
              />
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
                  styleInfo.iconBg
                } text-white shadow-2xl shadow-black/30 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
              >
                {CategoryIcon ? <CategoryIcon className="h-10 w-10" /> : <span className="text-4xl">⚡</span>}
              </div>
              <span className="relative z-10 mt-4 font-mono text-xs font-bold text-black/60 dark:text-white/60 tracking-wider uppercase">
                {styleInfo.chipText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Sub-tags & Ratings (Placed below image, cleanly separated) */}
      <div className="flex items-center justify-between text-[11px] font-mono px-4 sm:px-5 pt-3 text-slate-500 dark:text-slate-400">
        <span className="truncate max-w-[65%] font-medium">
          {styleInfo.subText}
        </span>
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
          ★ 4.9 RATED
        </span>
      </div>

      {/* 4. Card Body: Title, Tagline, Price & Actions */}
      <div className="flex flex-1 flex-col px-4 sm:px-5 pb-5 pt-1.5">
        <h3 className="font-display text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="mt-1 flex-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
          {tagline}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/5">
          {available ? (
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-mono font-bold uppercase text-amber-500">
              PRICE ON DROP
            </span>
          )}

          {available ? (
            <div className="flex items-center gap-2">
              <Link
                to={`/products/${id}`}
                onClick={playClickSound}
                data-cursor="VIEW"
                className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-black/10 dark:hover:bg-white/10"
              >
                Details
              </Link>
              {onInstantBuy && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    onInstantBuy(product)
                  }}
                  data-cursor="BUY"
                  className="inline-flex items-center justify-center gap-1 rounded-full bg-brand-blue px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-brand-blue-dark active:scale-95 shadow-md shadow-brand-blue/30 cursor-pointer"
                >
                  <span>⚡ Buy</span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClickSound()
                window.location.href = '#contact'
              }}
              className="inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/20 cursor-pointer"
            >
              <span>🔔 Waitlist</span>
            </button>
          )}
        </div>
      </div>
    </HolographicCard>
  )
}
