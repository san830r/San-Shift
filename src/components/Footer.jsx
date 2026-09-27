import { Link } from 'react-router-dom'
import logoIcon from '../assets/logo-icon-blue-squircle.png'
import wordmarkWhite from '../assets/sanshift-wordmark-white.png'
import { useContent } from '../content/ContentContext'
import { IconFacebook, IconInstagram, IconWhatsapp, IconYoutube } from './icons/SocialIcons'
import { playClickSound } from '../lib/soundFx'

const NAV = [
  { label: 'Home', id: 'top' },
  { label: 'Services', id: 'services' },
  { label: '55M+ Digital Catalog', to: '/catalog' },
  { label: 'Reels Showcase', id: 'reels' },
  { label: 'About', id: 'about' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
]

const LEGAL = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'Digital Product Delivery Policy', to: '/delivery-policy' },
]

export default function Footer() {
  const { content } = useContent()
  const SOCIALS = content.site.socials || {}
  const SOCIAL_LINKS = [
    { label: 'Facebook', href: SOCIALS.facebook, Icon: IconFacebook },
    { label: 'Instagram', href: SOCIALS.instagram, Icon: IconInstagram },
    { label: 'YouTube', href: SOCIALS.youtube, Icon: IconYoutube },
    { label: 'WhatsApp', href: SOCIALS.whatsapp, Icon: IconWhatsapp },
  ]

  const handleAnchor = (id) => (e) => {
    e.preventDefault()
    playClickSound()
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden bg-[#07080b] pt-14 sm:pt-16 pb-28 sm:pb-8 text-white border-t border-white/10">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-brand-blue/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 pb-10 sm:pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src={logoIcon}
                alt="SAN SHIFT"
                className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl object-contain shadow-sm"
              />
              <img
                src={wordmarkWhite}
                alt="SAN SHIFT"
                className="h-5 sm:h-5.5 w-auto object-contain"
              />
            </div>
            <p className="mt-3.5 sm:mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-white/55 font-sans">
              SHIFT THE STANDARD. Creative ideas, digital execution and real growth for creators and brands.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Navigation</h4>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.id || item.to}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      onClick={() => playClickSound()}
                      className="text-sm font-medium text-white/70 transition-colors hover:text-brand-blue"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={`#${item.id}`}
                      onClick={handleAnchor(item.id)}
                      className="text-sm font-medium text-white/70 transition-colors hover:text-brand-blue"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Legal &amp; Policy</h4>
            <ul className="mt-4 space-y-2.5">
              {LEGAL.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm font-medium text-white/70 transition-colors hover:text-brand-blue">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Connect &amp; Social</h4>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-all hover:border-brand-blue hover:bg-brand-blue hover:text-white"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                Direct: {content.site?.contact?.email || 'hello.sanshift@gmail.com'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-xs text-white/40">
          <p>© {new Date().getFullYear()} SAN SHIFT. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-white/60 tracking-wider">SHIFT THE STANDARD.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
