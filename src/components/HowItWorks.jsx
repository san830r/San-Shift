import Reveal from './Reveal'
import { useContent } from '../content/ContentContext'

export default function HowItWorks() {
  const { content } = useContent()

  return (
    <section className="bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-20 sm:py-28 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
            {content.howItWorks.heading}
          </h2>
        </Reveal>

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent md:block"
          />
          {content.howItWorks.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-black dark:bg-[#101424] font-display text-lg font-extrabold text-brand-yellow ring-8 ring-white dark:ring-[#070a13] border border-white/10">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-display text-xl font-extrabold text-black dark:text-white">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-black/55 dark:text-white/60">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
