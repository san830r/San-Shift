import Reveal from './Reveal'
import { useContent } from '../content/ContentContext'

export default function BrandStrip() {
  const { content } = useContent()

  return (
    <section className="border-y border-black/5 dark:border-white/5 bg-brand-offwhite dark:bg-[#060810] transition-colors duration-300">
      <Reveal>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-4 sm:gap-y-6 px-4 py-6 sm:py-8 text-center sm:px-8 md:grid-cols-4 md:gap-6">
          {content.brandStrip.map((item) => (
            <div key={item} className="flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
              <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-black/65 dark:text-white/65">{item}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
