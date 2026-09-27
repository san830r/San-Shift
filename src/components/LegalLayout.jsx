import { Link } from 'react-router-dom'

export default function LegalLayout({ title, updated = 'Last updated: [EDITABLE DATE]', children }) {
  return (
    <section className="bg-white dark:bg-[#070a13] text-black dark:text-white pt-28 pb-24 sm:pt-36 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link to="/" className="text-sm font-semibold text-black/50 dark:text-white/50 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">
          ← Back to Home
        </Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-black/40 dark:text-white/40">{updated}</p>
        <div className="prose-legal mt-10 space-y-6 text-base leading-relaxed text-black/70 dark:text-white/75">{children}</div>
      </div>
    </section>
  )
}
