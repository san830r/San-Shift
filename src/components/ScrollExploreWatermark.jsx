export default function ScrollExploreWatermark() {
  const scrollToNext = () => {
    const nextSection = document.getElementById('reels') || document.getElementById('catalog') || document.getElementById('contact')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative overflow-hidden pt-12 pb-6 text-center select-none">
      {/* Scroll to explore pill button */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        <button
          type="button"
          onClick={scrollToNext}
          aria-label="Scroll to explore more"
          className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-black/40 dark:border-white/50 p-1 transition-colors group-hover:border-brand-blue">
            <span className="h-1.5 w-1 rounded-full bg-black/60 dark:bg-white/70 animate-bounce group-hover:bg-brand-blue" />
          </div>
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-black/60 dark:text-white/60 group-hover:text-brand-blue transition-colors">
            Scroll To Explore
          </span>
        </button>
      </div>

      {/* Mountain Range Backdrop with Giant Watermark */}
      <div className="relative -mt-4 w-full h-32 sm:h-44 overflow-hidden pointer-events-none">
        {/* Giant SANSHIFT Watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 font-display text-[5.5rem] sm:text-[9rem] md:text-[11rem] font-black uppercase tracking-tight text-black/[0.04] dark:text-white/[0.04] select-none leading-none pointer-events-none text-center"
        >
          SANSHIFT
        </div>

        {/* Mountain Silhouette SVG */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-24 sm:h-32 text-[#111728] dark:text-[#05070e]"
          viewBox="0 0 1440 180"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 180 L0 120 L120 70 L240 110 L380 40 L520 100 L680 20 L820 90 L980 30 L1120 85 L1260 45 L1440 115 L1440 180 Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M0 180 L0 140 L160 100 L320 135 L480 80 L640 120 L800 65 L960 110 L1140 75 L1300 115 L1440 95 L1440 180 Z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>

        {/* Subtle Blue Rim Light on Peak */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-brand-blue/15 to-transparent blur-xl"
        />
      </div>
    </div>
  )
}
