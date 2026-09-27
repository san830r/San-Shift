import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useContent } from '../content/ContentContext'
import { useCurrency } from '../content/CurrencyContext'
import { playChimeSound } from '../lib/soundFx'
import DirectCheckoutModal from './DirectCheckoutModal'
import bundleImage from '../assets/products/biggest-editing-bundle.webp'

export default function FloatingMobileBar() {
  const location = useLocation()
  const { content } = useContent()
  const { formatPrice } = useCurrency()
  const [isVisible, setIsVisible] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const product =
    content.products.find((p) => p.id === content.site.featuredProductId) ?? content.products[0]

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past hero (180px) and hide near very bottom footer
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight

      const pastHero = scrollY > 220
      const nearBottom = scrollY + winHeight > docHeight - 120

      setIsVisible(pastHero && !nearBottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!product || location.pathname.startsWith('/products/')) return null

  const handleOpenCheckout = () => {
    playChimeSound()
    setCheckoutOpen(true)
  }

  return (
    <>
      <div
        className={`fixed bottom-4 left-3 right-3 z-40 md:hidden transition-all duration-500 ease-out transform ${
          isVisible && !checkoutOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/20 bg-white/90 dark:bg-[#0c101c]/90 backdrop-blur-2xl p-2 sm:p-2.5 shadow-[0_16px_40px_rgba(0,56,255,0.35)] flex items-center justify-between gap-2 sm:gap-3">
          {/* Ambient Accent Line at Top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-80" />

          {/* Left: Product Thumbnail & Title */}
          <div
            onClick={handleOpenCheckout}
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl overflow-hidden border border-black/10 dark:border-white/15 bg-black">
              <img
                src={product.image || bundleImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
            </div>

            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[11px] sm:text-xs font-black text-black dark:text-white uppercase tracking-tight">
                {product.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-display font-black text-xs sm:text-sm text-brand-blue">
                  {formatPrice(product.price || 99)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-black/40 dark:text-white/40 line-through">
                  {formatPrice(1000)}
                </span>
                <span className="hidden xs:inline-block rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-bold px-1.5 py-0.2">
                  90% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Right: Glowing Action Button */}
          <button
            type="button"
            onClick={handleOpenCheckout}
            className="shrink-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-dark hover:brightness-110 active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-blue/40 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>⚡ GET ACCESS</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Floating Bar Direct Checkout Modal */}
      <DirectCheckoutModal
        isOpen={checkoutOpen}
        product={product}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  )
}
