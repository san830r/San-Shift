import { useState } from 'react'
import { playClickSound } from '../lib/soundFx'

const CATEGORIES = [
  {
    id: 'video-editing',
    title: 'Video Editing',
    subtitle: 'Assets & Presets',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'purple',
  },
  {
    id: 'design-templates',
    title: 'Design Templates',
    subtitle: 'Canva & Graphics',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'cyan',
  },
  {
    id: 'social-media',
    title: 'Social Media',
    subtitle: 'Reels & Content',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: 'amber',
  },
  {
    id: 'ebooks-learning',
    title: 'Ebooks & Learning',
    subtitle: 'Knowledge Hub',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'blue',
  },
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    subtitle: 'Animations & VFX',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    color: 'fuchsia',
  },
  {
    id: 'business-tools',
    title: 'Business Tools',
    subtitle: 'Productivity Pack',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'emerald',
  },
]

export default function CategoryPillsBar() {
  const [activeCategory, setActiveCategory] = useState('video-editing')

  const handleSelect = (id) => {
    playClickSound()
    setActiveCategory(id)
    const catalogEl = document.getElementById('catalog') || document.getElementById('product')
    catalogEl?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollRight = () => {
    playClickSound()
    const container = document.getElementById('category-pills-scroll')
    if (container) {
      container.scrollBy({ left: 240, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative z-10 mx-auto mt-6 sm:mt-8 max-w-[1300px] px-4 sm:px-8">
      <div className="flex items-center gap-3">
        {/* Horizontal scroll container */}
        <div
          id="category-pills-scroll"
          className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                className={`group flex items-center gap-3 shrink-0 rounded-2xl px-4 py-3 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#0b0e19] text-white shadow-lg shadow-black/15 ring-1 ring-white/15'
                    : 'bg-white dark:bg-[#0c101c] text-black dark:text-white border border-black/[0.08] dark:border-white/10 hover:border-brand-blue/40 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Icon wrapper */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'bg-purple-500/25 text-purple-300'
                      : cat.color === 'cyan'
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                      : cat.color === 'amber'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : cat.color === 'blue'
                      ? 'bg-blue-500/15 text-brand-blue'
                      : cat.color === 'fuchsia'
                      ? 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {cat.icon}
                </div>

                {/* Text */}
                <div className="text-left">
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-black dark:text-white'}`}>
                    {cat.title}
                  </div>
                  <div className={`text-[10px] font-medium leading-tight ${isActive ? 'text-white/60' : 'text-black/50 dark:text-white/50'}`}>
                    {cat.subtitle}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Scroll right arrow circle */}
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll categories right"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#0c101c] text-black dark:text-white shadow-sm transition-all hover:bg-brand-blue hover:text-white hover:border-brand-blue active:scale-95 cursor-pointer"
        >
          <span className="font-sans text-sm font-bold">→</span>
        </button>
      </div>
    </section>
  )
}
