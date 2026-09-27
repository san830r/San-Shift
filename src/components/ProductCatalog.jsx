import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import ProductCard from './ProductCard'
import DirectCheckoutModal from './DirectCheckoutModal'
import { useContent } from '../content/ContentContext'
import { playClickSound } from '../lib/soundFx'

export default function ProductCatalog() {
  const { content } = useContent()
  const [active, setActive] = useState('All')
  const [checkoutProduct, setCheckoutProduct] = useState(null)

  const filtered = useMemo(
    () => (active === 'All' ? content.products : content.products.filter((p) => p.category === active)),
    [active, content.products],
  )

  const handleCategoryClick = (cat) => {
    playClickSound()
    setActive(cat)
  }

  return (
    <section id="catalog" className="scroll-mt-24 bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-20 sm:py-28 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase text-black/60 dark:text-white/60 mb-4">
            Curated Assets & Tools
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
            EXPLORE THE SAN SHIFT CATALOG
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/55 dark:text-white/60 sm:text-lg">
            Professional digital resources built to speed up your creative workflow with instant Google Drive delivery.
          </p>
        </Reveal>

        {/* Apple-Style Segmented Category Tabs */}
        <Reveal delay={80}>
          <div id="categories" className="mt-10 flex scroll-mt-24 justify-center">
            <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] p-1.5 backdrop-blur-md">
              {['All', ...content.categories].map((cat) => {
                const isActive = active === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`relative rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 scale-[1.02]'
                        : 'text-black/60 dark:text-white/65 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <ProductCard
                product={product}
                onInstantBuy={(p) => setCheckoutProduct(p)}
              />
            </Reveal>
          ))}
        </div>

        {/* High-Impact 55M+ Master Vault Explorer CTA */}
        <Reveal delay={120} className="mt-16 text-center">
          <div className="relative inline-flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 via-purple-500/10 to-brand-yellow/10 dark:from-brand-blue/20 dark:via-purple-500/15 dark:to-brand-yellow/15 backdrop-blur-xl max-w-4xl mx-auto w-full shadow-2xl">
            <div className="text-left space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue text-[10px] font-mono font-black uppercase">
                ⚡ 55,000,000+ ASSETS ARCHIVE
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white">
                Looking for the Complete Master Vault?
              </h3>
              <p className="text-xs sm:text-sm text-black/60 dark:text-white/60">
                Explore our full dedicated catalog page with live multi-filter search, folder explorer, and comparison specs.
              </p>
            </div>
            <Link
              to="/catalog"
              onClick={() => playClickSound()}
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-brand-blue text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Explore 55M+ Catalog</span>
              <span className="font-sans text-sm">→</span>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Instant Checkout Lightbox for Catalog Items */}
      {checkoutProduct && (
        <DirectCheckoutModal
          isOpen={Boolean(checkoutProduct)}
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </section>
  )
}
