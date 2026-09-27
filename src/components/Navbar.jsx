import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoIcon from '../assets/logo-icon-blue-squircle.png'
import wordmarkDark from '../assets/sanshift-wordmark-dark.png'
import wordmarkWhite from '../assets/sanshift-wordmark-white.png'
import { useTheme } from '../content/ThemeContext'
import { playClickSound } from '../lib/soundFx'
import { openSmartWhatsAppModal } from './SmartWhatsAppModal'
import { IconWhatsapp, IconInstagram, IconYoutube, IconFacebook } from './icons/SocialIcons'

const MAIN_LINKS = [
  { label: 'HOME', id: 'top', sub: 'Studio HQ & Flagship Experience', icon: '⚡', num: '01' },
  { label: 'SERVICES', id: 'services', sub: 'Video Editing, Motion VFX & Growth', icon: '🎬', num: '02' },
  { label: 'CATALOG', to: '/catalog', badge: '55M+ HOT', sub: '55,000,000+ Assets Vault', icon: '📦', num: '03' },
  { label: 'REELS', id: 'reels', sub: 'Viral Hooks & High-Retention Clips', icon: '🔥', num: '04' },
  { label: 'ABOUT', id: 'about', sub: 'Creative Philosophy & Industry Standards', icon: '✨', num: '05' },
  { label: 'CONTACT', id: 'contact', sub: 'Direct WhatsApp & Project Brief', icon: '💬', num: '06' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'Delivery Policy', to: '/delivery-policy' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleNavClick = (id) => (e) => {
    e.preventDefault()
    playClickSound()
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleThemeToggle = () => {
    playClickSound()
    toggleTheme()
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-[#070a13]/85 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_12px_rgba(0,0,0,0.04)]'
          : 'bg-white/40 dark:bg-[#070a13]/40 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-10 lg:px-12 sm:py-3.5">
        {/* Brand Logo & Sub-Route Back Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#top"
            onClick={handleNavClick('top')}
            className="group flex shrink-0 items-center gap-2.5 transition-transform active:scale-98"
            aria-label="SAN SHIFT Homepage"
          >
            <img
              src={logoIcon}
              alt="SAN SHIFT"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-contain shadow-sm transition-transform group-hover:scale-105"
            />
            <img
              src={wordmarkDark}
              alt="SAN SHIFT"
              className="h-4.5 sm:h-5.5 w-auto object-contain dark:hidden"
            />
            <img
              src={wordmarkWhite}
              alt="SAN SHIFT"
              className="h-4.5 sm:h-5.5 w-auto object-contain hidden dark:block"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 xl:gap-7 lg:flex">
          {MAIN_LINKS.map((link) => (
            <li key={link.id || link.to}>
              {link.to ? (
                <Link
                  to={link.to}
                  onClick={() => playClickSound()}
                  className={`relative flex items-center gap-1.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors hover:text-brand-blue dark:hover:text-brand-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all hover:after:w-full ${
                    location.pathname === link.to
                      ? 'text-brand-blue after:w-full after:bg-brand-blue'
                      : 'text-black/75 dark:text-white/75 after:w-0 after:bg-brand-blue'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-brand-yellow/20 border border-brand-yellow/40 px-1.5 py-0.5 text-[8px] font-mono font-black text-amber-600 dark:text-brand-yellow">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <a
                  href={`#${link.id}`}
                  onClick={handleNavClick(link.id)}
                  className="relative flex items-center gap-1.5 py-1 text-xs font-bold uppercase tracking-wider text-black/75 dark:text-white/75 transition-colors hover:text-brand-blue dark:hover:text-brand-blue after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue after:transition-all hover:after:w-full"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-brand-yellow/20 border border-brand-yellow/40 px-1.5 py-0.5 text-[8px] font-mono font-black text-amber-600 dark:text-brand-yellow">
                      {link.badge}
                    </span>
                  )}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Controls, CTA & Menu Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme / Cinema Mode Toggle Button */}
          <button
            type="button"
            onClick={handleThemeToggle}
            data-cursor="THEME"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Cinema Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Cinema Dark Mode'}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.05] text-xs transition-colors hover:border-brand-blue hover:text-brand-blue active:scale-95"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          {/* Primary Let's Talk CTA -> Smart WhatsApp Fast-Pass */}
          <button
            type="button"
            onClick={() => {
              playClickSound()
              openSmartWhatsAppModal()
            }}
            data-cursor="TALK"
            className="group relative hidden items-center gap-2 rounded-full bg-black dark:bg-white px-5 sm:px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white dark:text-black shadow-md transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95 sm:inline-flex"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Let's Talk</span>
            <IconWhatsapp className="h-3.5 w-3.5 text-emerald-400 group-hover:text-white transition-colors" />
          </button>

          {/* Minimal Menu Hamburger Button */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => {
              playClickSound()
              setMenuOpen((v) => !v)
            }}
            className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-black/15 dark:border-white/20 bg-white/80 dark:bg-white/10 text-black dark:text-white transition-colors hover:border-brand-blue hover:text-brand-blue active:scale-95 lg:hidden"
          >
            <div className="flex h-3.5 w-4.5 flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current transition-transform duration-300 ${
                  menuOpen ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-transform duration-300 ${
                  menuOpen ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile & Fullscreen Slide-Down Menu rendered to document.body via Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            id="mobile-nav-portal"
            className={`fixed inset-0 z-[100] h-dvh w-screen bg-[#f8fafc] dark:bg-[#070a13] transition-all duration-300 flex flex-col justify-between p-5 sm:p-7 lg:hidden overflow-hidden ${
              menuOpen
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none -translate-y-4'
            }`}
          >
            {/* Ambient Background Aura Orbs */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />

            {/* Top Bar inside Portal */}
            <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-black/8 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src={logoIcon}
                  alt="SAN SHIFT"
                  className="h-8 w-8 rounded-xl object-contain shadow-sm"
                />
                <div className="flex flex-col">
                  <img
                    src={wordmarkDark}
                    alt="SAN SHIFT"
                    className="h-4 w-auto object-contain dark:hidden"
                  />
                  <img
                    src={wordmarkWhite}
                    alt="SAN SHIFT"
                    className="h-4 w-auto object-contain hidden dark:block"
                  />
                  <span className="text-[9px] font-mono font-bold text-black/40 dark:text-white/40 tracking-widest uppercase">
                    STUDIO ARCHIVE
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  aria-label={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] text-xs transition-transform active:scale-95"
                >
                  <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setMenuOpen(false)
                  }}
                  aria-label="Close menu"
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/10 text-black dark:text-white transition-all hover:bg-rose-500 hover:text-white hover:border-rose-500 active:scale-95 cursor-pointer"
                >
                  <span className="text-sm font-black leading-none group-hover:rotate-90 transition-transform duration-200">✕</span>
                </button>
              </div>
            </div>

            {/* Navigation Links Area */}
            <div className="relative z-10 flex-1 overflow-y-auto py-3.5 my-auto pr-0.5 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-black/45 dark:text-white/45 px-1">
                <span>DIRECTORY MENU</span>
                <span className="text-brand-blue dark:text-cyan-400">● 6 SECTIONS</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {MAIN_LINKS.map((link) => {
                  const isActive = link.to ? location.pathname === link.to : false
                  const itemContent = (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 font-mono text-sm text-brand-blue dark:text-cyan-400 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all">
                          {link.icon}
                        </span>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-cyan-400 transition-colors">
                              {link.label}
                            </span>
                            {link.badge && (
                              <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[9px] font-mono font-black text-white shadow-sm shadow-amber-500/20">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors line-clamp-1">
                            {link.sub}
                          </div>
                        </div>
                      </div>

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-brand-blue group-hover:text-white transition-all group-hover:translate-x-1 shrink-0 ml-2">
                        <span className="font-sans text-xs">→</span>
                      </div>
                    </div>
                  )

                  return (
                    <div key={link.id || link.to}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          onClick={() => {
                            playClickSound()
                            setMenuOpen(false)
                          }}
                          className={`group flex items-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'border-brand-blue/40 bg-brand-blue/10 dark:bg-brand-blue/15 shadow-sm'
                              : 'border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.02] hover:border-brand-blue/30 hover:bg-brand-blue/5 dark:hover:bg-white/[0.05]'
                          }`}
                        >
                          {itemContent}
                        </Link>
                      ) : (
                        <a
                          href={`#${link.id}`}
                          onClick={handleNavClick(link.id)}
                          className="group flex items-center p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.02] hover:border-brand-blue/30 hover:bg-brand-blue/5 dark:hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
                        >
                          {itemContent}
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* VIP Quick Action CTAs */}
              <div className="mt-4 flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setMenuOpen(false)
                    openSmartWhatsAppModal()
                  }}
                  className="group relative flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-4 py-3 text-white shadow-lg shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                      <IconWhatsapp className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black uppercase tracking-wider">
                        Let's Talk on WhatsApp
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-100 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        <span>Instant Creator Support</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-sans text-sm group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <Link
                  to="/catalog"
                  onClick={() => {
                    playClickSound()
                    setMenuOpen(false)
                  }}
                  className="group relative flex w-full items-center justify-between rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-brand-blue/15 px-4 py-3 text-slate-900 dark:text-white shadow-md active:scale-98 hover:border-amber-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-base">
                      ⚡
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-brand-yellow">
                        Unlock 55M+ Vault Bundle
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                        ₹99 Instant Lifetime Access
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black bg-amber-400 text-black px-2 py-0.5 rounded-md">
                    ₹99
                  </span>
                </Link>
              </div>
            </div>

            {/* Footer with Socials & Legal inside Menu */}
            <div className="relative z-10 border-t border-black/10 dark:border-white/10 pt-3 shrink-0 space-y-2.5">
              {/* Studio Status & Social Icons */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>24/7 INSTANT DISPATCH</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href="https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-brand-blue hover:text-white transition-all text-slate-700 dark:text-slate-300"
                    aria-label="Instagram"
                  >
                    <IconInstagram className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@SanShift"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-brand-blue hover:text-white transition-all text-slate-700 dark:text-slate-300"
                    aria-label="YouTube"
                  >
                    <IconYoutube className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://wa.me/917339467830"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-emerald-500 hover:text-white transition-all text-slate-700 dark:text-slate-300"
                    aria-label="WhatsApp"
                  >
                    <IconWhatsapp className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61594267786548"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-brand-blue hover:text-white transition-all text-slate-700 dark:text-slate-300"
                    aria-label="Facebook"
                  >
                    <IconFacebook className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Legal & Copyright */}
              <div className="flex flex-wrap items-center justify-between gap-y-1 text-[10px] text-slate-400 dark:text-slate-500">
                <ul className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {LEGAL_LINKS.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-brand-blue transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="font-mono">SAN SHIFT © {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  )
}
