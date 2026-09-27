import Reveal from './Reveal'
import { useContent } from '../content/ContentContext'

export default function Benefits() {
  const { content } = useContent()

  return (
    <section className="bg-brand-offwhite dark:bg-[#060810] text-black dark:text-white transition-colors duration-300 py-20 sm:py-28 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
            {content.benefits.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.benefits.items.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 90}>
              <div className="h-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c101c] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue/30 dark:hover:border-brand-blue hover:shadow-lg hover:shadow-brand-blue/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue font-display text-base font-extrabold text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-lg font-extrabold text-black dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/55 dark:text-white/60">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
