import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import TrustBadges from '../components/TrustBadges'
import EditingTimelineMockup from '../components/EditingTimelineMockup'
import DirectCheckoutModal from '../components/DirectCheckoutModal'
import { useContent } from '../content/ContentContext'
import { useCurrency } from '../content/CurrencyContext'
import { playClickSound } from '../lib/soundFx'

const SECTIONS = [
  {
    title: "Who It's For",
    body: 'Built for creators, video editors and content professionals who want reliable, ready-to-use resources without spending hours building assets from scratch.',
  },
  {
    title: 'How It Works',
    body: 'Purchase the pack, receive access to your digital files, and drop the resources straight into your existing editing workflow.',
  },
  {
    title: 'What You Receive',
    body: 'Access to the full collection of premium editing resources included in this pack, delivered digitally after purchase.',
  },
  {
    title: 'Compatibility',
    body: '[EDITABLE: list the specific software/versions this pack is compatible with, e.g. your editing app of choice.]',
  },
  {
    title: 'Delivery Information',
    body: '[EDITABLE: describe exactly how and when the digital product is delivered after purchase.]',
  },
]

const PRODUCT_FAQ = [
  {
    q: 'Is this a one-time payment?',
    a: 'Yes, this is a one-time purchase for lifetime access to the included resources.',
  },
  {
    q: 'Do I need special software to use this?',
    a: '[EDITABLE: confirm the specific software required to use these resources.]',
  },
  {
    q: 'What is the refund policy?',
    a: 'See our Refund Policy page for full details.',
  },
]

function StickyBuyBar({ product, onBuyClick }) {
  const { formatPrice } = useCurrency()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-md transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-black dark:text-white sm:text-base">{product.name}</p>
          <p className="text-xs font-semibold text-black/50 dark:text-white/50">
            <span className="font-display text-base font-extrabold text-brand-blue">{formatPrice(product.price)}</span>{' '}
            one-time
          </p>
        </div>
        <button
          type="button"
          onClick={onBuyClick}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-all hover:bg-brand-blue-dark active:scale-95 sm:px-8 sm:text-sm shadow-md shadow-brand-blue/30 cursor-pointer"
        >
          Instant Checkout
        </button>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { content } = useContent()
  const { formatPrice } = useCurrency()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const product = content.products.find((p) => p.id === id)
  const whatsInside = content.whatsInside

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [id])

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center text-black dark:text-white">
        <h1 className="font-display text-3xl font-extrabold text-black dark:text-white">Product not found</h1>
        <p className="mt-4 text-black/60 dark:text-white/60">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/#catalog"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-blue/30"
        >
          Back to Catalog
        </Link>
      </div>
    )
  }

  return (
    <>
      <section className="bg-brand-offwhite dark:bg-[#070a13] text-black dark:text-white pt-24 pb-14 sm:pt-36 sm:pb-20 transition-colors duration-300">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <Link
            to="/#catalog"
            className="group inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 py-1.5 pl-3 pr-3.5 sm:py-2 sm:pl-3 sm:pr-4 text-xs sm:text-sm font-semibold text-black/70 dark:text-white/80 shadow-sm transition-all hover:-translate-x-0.5 hover:border-brand-blue/40 hover:text-brand-blue dark:hover:text-brand-blue hover:shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Catalog
          </Link>

          <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-black/40 backdrop-blur-md shadow-xl border border-black/5 dark:border-white/10 flex items-center justify-center p-2.5 sm:p-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="block w-full h-auto max-h-[600px] object-contain rounded-xl sm:rounded-2xl"
                />
              ) : (
                <div className="aspect-square w-full bg-gradient-to-br from-brand-blue to-brand-blue-deep p-6 rounded-2xl">
                  <EditingTimelineMockup tracks={(product.included ?? whatsInside).slice(0, 4)} />
                </div>
              )}
              {!product.image && product.originalPrice && (
                <span className="absolute right-4 top-4 rounded-full bg-brand-yellow px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-black shadow-lg">
                  {Math.round(100 - (product.price / product.originalPrice) * 100)}% Off
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-blue">{product.category}</span>
              <h1 className="mt-2.5 sm:mt-3 font-display text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white leading-tight">
                {product.name.toUpperCase()}
              </h1>

              {product.available ? (
                <>
                  <p className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-black/70 dark:text-white/70">{product.tagline}</p>

                  {product.stats && (
                    <ul className="mt-4 sm:mt-5 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                      {product.stats.map((stat) => (
                        <li key={stat} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-black/70 dark:text-white/75">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-brand-blue" />
                          {stat}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 sm:mt-6 flex items-baseline gap-2 sm:gap-3">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-black dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base sm:text-lg font-semibold text-black/35 dark:text-white/35 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-medium text-black/50 dark:text-white/50">one-time purchase</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setCheckoutOpen(true)
                    }}
                    className="mt-6 sm:mt-8 inline-flex w-full items-center justify-center rounded-full bg-brand-blue px-6 sm:px-8 py-3.5 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-brand-blue-dark hover:shadow-xl hover:shadow-brand-blue/30 active:scale-95 sm:w-auto cursor-pointer"
                  >
                    Get the Bundle — {formatPrice(product.price)}
                  </button>
                  <TrustBadges className="mt-4" />
                </>
              ) : (
                <>
                  <p className="mt-4 text-lg font-semibold text-black/70 dark:text-white/70">{product.tagline}</p>
                  <span className="mt-6 inline-flex items-center rounded-full bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-xs font-bold uppercase tracking-wide">
                    Coming Soon
                  </span>
                  <p className="mt-4 max-w-md text-sm text-black/50 dark:text-white/60">
                    This product isn't available for purchase yet. Check back soon or explore the World's Biggest
                    Editing Bundle, available now.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {product.available && (
        <>
          <section className="bg-white dark:bg-[#0b0e17] py-16 sm:py-24 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
            <div className="mx-auto max-w-5xl px-4 sm:px-8">
              <Reveal>
                <h2 className="font-display text-2xl font-extrabold text-black dark:text-white sm:text-3xl">What's Inside</h2>
                <p className="mt-2 max-w-xl text-xs sm:text-base text-black/55 dark:text-white/60">
                  Premium editing resources organized to fit right into your workflow.
                </p>
              </Reveal>
              <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
                {whatsInside.map((item, i) => (
                  <Reveal key={item.title} delay={i * 50}>
                    <div className="flex h-full flex-col gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-brand-offwhite dark:bg-white/[0.04] p-3.5 sm:p-5 transition-colors hover:border-brand-blue/40">
                      <span className="h-2 w-2 rounded-full bg-brand-blue" />
                      <h3 className="font-display text-xs sm:text-sm font-extrabold text-black dark:text-white">{item.title}</h3>
                      <p className="text-[11px] sm:text-xs leading-relaxed text-black/50 dark:text-white/60">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-brand-offwhite dark:bg-[#070a13] py-16 sm:py-24 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
            <div className="mx-auto max-w-3xl px-4 sm:px-8">
              {SECTIONS.map((section, i) => (
                <Reveal key={section.title} delay={i * 60} className="mb-8 sm:mb-10 last:mb-0">
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-black dark:text-white">{section.title}</h3>
                  <p className="mt-2 text-xs sm:text-base text-black/60 dark:text-white/70">{section.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-[#0b0e17] py-16 sm:py-24 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
            <div className="mx-auto max-w-3xl px-4 sm:px-8">
              <Reveal>
                <h2 className="text-center font-display text-2xl font-extrabold text-black dark:text-white sm:text-3xl">FAQ</h2>
              </Reveal>
              <div className="mt-8 divide-y divide-black/10 dark:divide-white/10 border-t border-black/10 dark:border-white/10">
                {PRODUCT_FAQ.map((item) => (
                  <div key={item.q} className="py-5">
                    <p className="font-display text-base font-bold text-black dark:text-white">{item.q}</p>
                    <p className="mt-1.5 text-sm text-black/55 dark:text-white/60">{item.a}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-black dark:bg-[#0f1424] border border-white/10 p-10 text-center shadow-xl">
                <p className="font-display text-xl font-extrabold text-white">Ready to elevate your edits?</p>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setCheckoutOpen(true)
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition-all hover:brightness-95 active:scale-95 cursor-pointer shadow-lg shadow-brand-yellow/20"
                >
                  Get the Bundle — {formatPrice(product.price)}
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {product.available && (
        <>
          <div className="h-16" aria-hidden="true" />
          <StickyBuyBar
            product={product}
            onBuyClick={() => {
              playClickSound()
              setCheckoutOpen(true)
            }}
          />
        </>
      )}

      {/* Direct Instant Checkout Modal */}
      <DirectCheckoutModal
        isOpen={checkoutOpen}
        product={product}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  )
}
