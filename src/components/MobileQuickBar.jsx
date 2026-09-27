import { useEffect, useState } from 'react'
import { useContent } from '../content/ContentContext'
import { playClickSound } from '../lib/soundFx'

export default function MobileQuickBar() {
  const { content } = useContent()
  const product =
    content?.products?.find((p) => p.id === content?.site?.featuredProductId) ??
    content?.products?.[0]

  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return
      // Show when user scrolls past 260px and hide near bottom
      const scrolled = window.scrollY > 260
      setVisible(scrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  if (!product || dismissed) return null

  const handleDismiss = (e) => {
    e.stopPropagation()
    playClickSound()
    setDismissed(true)
  }

  return (
    <aside
      aria-label="Quick mobile bundle access"
      className={`fixed bottom-3 inset-x-3 z-40 max-w-sm mx-auto sm:hidden transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative flex items-center justify-between rounded-full bg-[#0b0e17]/95 border border-white/20 p-1.5 pl-3.5 shadow-[0_12px_36px_rgba(0,56,255,0.4)] backdrop-blur-2xl text-white">
        {/* Subtle pulse edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-brand-blue/30 via-transparent to-brand-yellow/30 opacity-70"
        />

        {/* Left info */}
        <div className="relative z-10 flex items-center gap-2 overflow-hidden">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-xs text-brand-blue-tint border border-brand-blue/30">
            📦
          </span>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[11px] font-black uppercase tracking-tight text-white truncate">
              Digital Products & Bundles
            </span>
            <span className="text-[9px] font-mono text-brand-yellow font-bold mt-0.5">
              CREATIVE ASSETS • TEMPLATES • LUTS
            </span>
          </div>
        </div>

        {/* Right action & close */}
        <div className="relative z-10 flex items-center gap-1 shrink-0 ml-2">
          <a
            href="#product"
            onClick={() => {
              document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center gap-1 rounded-full bg-brand-blue px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-white shadow-md shadow-brand-blue/40 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Explore</span>
            <span>→</span>
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss quick bar"
            className="flex h-6 w-6 items-center justify-center rounded-full text-white/40 hover:text-white text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  )
}
