import Reveal from './Reveal'
import logoMark from '../assets/logo-mark.png'
import { useContent } from '../content/ContentContext'

export default function About() {
  const { content } = useContent()

  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-20 sm:py-28 lg:py-32 border-t border-black/5 dark:border-white/5">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-blue/6 dark:bg-brand-blue/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left: Anti-gravity floating branded artifact */}
        <Reveal className="flex justify-center lg:justify-start">
          <div className="relative">
            <div className="animate-float-slow relative flex h-60 w-60 sm:h-72 sm:w-72 items-center justify-center rounded-3xl border border-black/10 dark:border-white/15 bg-brand-offwhite dark:bg-[#0c101c] p-6 shadow-[0_20px_50px_-15px_rgba(0,56,255,0.2)]">
              <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-brand-blue/15 via-transparent to-brand-yellow/15" />
              <img
                src={logoMark}
                alt="SAN SHIFT"
                className="relative h-28 w-28 sm:h-36 sm:w-36 object-contain filter drop-shadow-[0_4px_16px_rgba(0,56,255,0.4)]"
              />
            </div>

            {/* Floating micro accent pill */}
            <div className="animate-float absolute -bottom-3 -right-3 z-10 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#101424] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black dark:text-white shadow-md">
              <span className="text-brand-blue mr-1.5">●</span>EST. 2025
            </div>
          </div>
        </Reveal>

        {/* Right: Editorial narrative */}
        <Reveal delay={100}>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-blue" />
            <span className="text-xs font-black uppercase tracking-widest text-black/50 dark:text-white/50">
              {content.about.eyebrow || 'ABOUT SAN SHIFT'}
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-black dark:text-white">
            {content.about.heading || 'SHIFT THE WAY YOU CREATE.'}
          </h2>

          <div className="mt-6 space-y-4">
            {content.about.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="max-w-xl text-base sm:text-lg leading-relaxed text-black/65 dark:text-white/70 font-sans"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-6 pt-4 border-t border-black/5 dark:border-white/10">
            <div>
              <div className="font-display text-2xl font-black text-black dark:text-white">100%</div>
              <div className="text-xs uppercase tracking-wider text-black/40 dark:text-white/40 font-bold">Original Workflows</div>
            </div>
            <div className="h-8 w-px bg-black/10 dark:bg-white/10" />
            <div>
              <div className="font-display text-2xl font-black text-brand-blue">Global</div>
              <div className="text-xs uppercase tracking-wider text-black/40 dark:text-white/40 font-bold">Creative Reach</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
