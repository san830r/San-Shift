import { useContent } from '../content/ContentContext'
import SplitFlapCounter from './SplitFlapCounter'

function StatItem({ value, label, isLast }) {
  return (
    <div className={`relative flex flex-col items-center justify-center py-6 px-4 text-center sm:py-8 ${!isLast ? 'border-b sm:border-b-0 sm:border-r border-black/10 dark:border-white/10' : ''}`}>
      <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-brand-blue drop-shadow-[0_2px_10px_rgba(0,56,255,0.15)]">
        <SplitFlapCounter value={value} />
      </span>
      <span className="mt-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-black/60 dark:text-white/70">
        {label}
      </span>
    </div>
  )
}

export default function AgencyStats() {
  const { content } = useContent()
  const stats = content.agencyStats || []

  return (
    <section className="relative border-y border-black/8 dark:border-white/10 bg-white dark:bg-[#070a13] py-8 sm:py-12 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              isLast={i === stats.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
