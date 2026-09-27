import { useState } from 'react'
import Reveal from './Reveal'
import { useContent } from '../content/ContentContext'
import { IconFacebook, IconInstagram, IconWhatsapp, IconYoutube } from './icons/SocialIcons'
import { playClickSound } from '../lib/soundFx'

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
]

function IconEmail({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Contact() {
  const { content } = useContent()
  const { contact: CONTACT = {}, socials: SOCIALS = {} } = content.site
  const CHANNELS = [
    { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: IconEmail, external: false },
    { label: 'Instagram', value: CONTACT.instagram, href: SOCIALS.instagram, Icon: IconInstagram, external: true },
    { label: 'YouTube', value: CONTACT.youtube || '@SanShift', href: SOCIALS.youtube || 'https://www.youtube.com/@SanShift', Icon: IconYoutube, external: true },
    { label: 'Facebook', value: CONTACT.facebook, href: SOCIALS.facebook, Icon: IconFacebook, external: true },
    { label: 'WhatsApp', value: CONTACT.whatsapp, href: SOCIALS.whatsapp, Icon: IconWhatsapp, external: true },
  ]
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    playClickSound()

    // Persist lead to Admin Panel Leads CRM
    try {
      const existing = JSON.parse(localStorage.getItem('sanshift_leads') || '[]')
      const newLead = {
        id: `LEAD-${Date.now().toString().slice(-4)}`,
        name: form.name.trim() || 'Anonymous Client',
        phone: '',
        email: form.email.trim(),
        service: 'Website Contact Inquiry',
        budget: 'Inquiry',
        message: form.message.trim(),
        date: new Date().toISOString(),
        status: 'New',
      }
      localStorage.setItem('sanshift_leads', JSON.stringify([newLead, ...existing]))
    } catch (err) {
      console.warn('Could not save lead locally:', err)
    }

    const subject = encodeURIComponent(`New message from ${form.name || 'San Shift website'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-brand-offwhite dark:bg-[#060810] text-black dark:text-white transition-colors duration-300 py-16 sm:py-28 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Get in Touch</span>
          <h2 className="mt-3 sm:mt-4 font-display text-2xl xs:text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
            CONTACT US
          </h2>
          <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base leading-relaxed text-black/55 dark:text-white/60">
            Questions about a product, custom production, or agency retainer? Reach out — we're happy to help.
          </p>

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            {CHANNELS.map(({ label, value, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                onClick={playClickSound}
                data-cursor="CONTACT"
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c101c] p-3 sm:p-4 transition-colors hover:border-brand-blue dark:hover:border-brand-blue min-w-0"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">{label}</p>
                  <p className="text-xs sm:text-sm font-semibold text-black dark:text-white truncate">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c101c] p-4 sm:p-8 shadow-sm"
          >
            {FIELDS.map((field) => (
              <div key={field.name} className="mb-5">
                <label
                  htmlFor={field.name}
                  className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/50"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-3 text-sm text-black dark:text-white outline-none transition-colors focus:border-brand-blue"
                />
              </div>
            ))}

            <div className="mb-6">
              <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/50">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
                className="w-full resize-none rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-3 text-sm text-black dark:text-white outline-none transition-colors focus:border-brand-blue"
              />
            </div>

            <button
              type="submit"
              data-cursor="SEND"
              className="w-full rounded-full bg-brand-blue px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-brand-blue-dark active:scale-95 shadow-lg shadow-brand-blue/20"
            >
              Send Message
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
