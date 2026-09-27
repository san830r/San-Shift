import { useState } from 'react'
import Reveal from './Reveal'
import { useContent } from '../content/ContentContext'
import { playClickSound } from '../lib/soundFx'

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-black/10 dark:border-white/10">
      <button
        type="button"
        onClick={() => {
          playClickSound()
          onToggle()
        }}
        aria-expanded={isOpen}
        data-cursor="EXPAND"
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-base font-bold text-black dark:text-white sm:text-lg">{item.q}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 dark:border-white/20 text-lg font-bold text-black dark:text-white transition-transform duration-300 ${
            isOpen ? 'rotate-45 border-brand-blue dark:border-brand-blue text-brand-blue dark:text-brand-blue' : ''
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-black/60 dark:text-white/60 sm:text-base">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { content } = useContent()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="scroll-mt-24 bg-white dark:bg-[#070a13] text-black dark:text-white transition-colors duration-300 py-20 sm:py-28 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            {content.faqs.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
