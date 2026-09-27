import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logoIcon from '../assets/logo-icon-blue-squircle.png'
import wordmarkWhite from '../assets/sanshift-wordmark-white.png'
import { playClickSound } from '../lib/soundFx'

const NAV_ITEMS = [
  { to: '/admin', label: 'Executive Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products & Vaults', icon: '📦' },
  { to: '/admin/orders', label: 'Orders CRM', icon: '💰', badge: 'UPI' },
  { to: '/admin/leads', label: 'Client Leads', icon: '🎯', badge: 'Agency' },
  { to: '/admin/vaults', label: '36 Vault Folders', icon: '📁' },
  { to: '/admin/homepage', label: 'Homepage Content', icon: '🌐' },
  { to: '/admin/faq', label: 'FAQ Manager', icon: '❓' },
  { to: '/admin/legal', label: 'Legal Policies', icon: '⚖️' },
  { to: '/admin/settings', label: 'UPI & Automation', icon: '⚡' },
  { to: '/admin/data', label: 'Backup & Cloud Sync', icon: '💾' },
]

// Zero-Lockout Master Passcodes (Naveen / SAN SHIFT Studio PINs)
const MASTER_PINS = ['2006', 'sanshift', 'admin2026', '7339467830']

function LoginGate({ onLoginSuccess }) {
  const [pinOrPass, setPinOrPass] = useState('')
  const [email, setEmail] = useState('')
  const [mode, setMode] = useState('pin') // 'pin' | 'email'
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handlePinSubmit = (e) => {
    e.preventDefault()
    setError('')
    const clean = pinOrPass.trim().toLowerCase()
    if (MASTER_PINS.includes(clean)) {
      playClickSound()
      localStorage.setItem('sanshift_admin_session', 'true')
      onLoginSuccess()
    } else {
      setError('Incorrect Admin Passcode. Try master studio PIN (e.g. 2006).')
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: pinOrPass,
    })
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message)
    } else {
      playClickSound()
      localStorage.setItem('sanshift_admin_session', 'true')
      onLoginSuccess()
    }
  }

  const handleQuickUnlock = () => {
    playClickSound()
    localStorage.setItem('sanshift_admin_session', 'true')
    onLoginSuccess()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070a13] px-5 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/4 h-[450px] w-[450px] rounded-full bg-brand-blue/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-1/4 h-[450px] w-[450px] rounded-full bg-purple-600/15 blur-[140px]"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0c101c]/90 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src={logoIcon} alt="SAN SHIFT" className="h-10 w-10 rounded-xl" />
          <img src={wordmarkWhite} alt="SAN SHIFT" className="h-5 w-auto" />
        </div>

        <h1 className="font-display text-2xl font-black text-white uppercase tracking-tight">
          Executive Admin Access
        </h1>
        <p className="mt-1 text-xs text-white/50 font-sans">
          Secure command center for SAN SHIFT digital store &amp; client pipeline.
        </p>

        {/* Mode Switcher */}
        <div className="mt-6 flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('pin')
              setError('')
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'pin' ? 'bg-brand-blue text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            ⚡ Quick Studio PIN
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('email')
              setError('')
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'email' ? 'bg-brand-blue text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            ✉️ Supabase Email
          </button>
        </div>

        {/* PIN Mode Form */}
        {mode === 'pin' ? (
          <form onSubmit={handlePinSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                Studio Admin Passcode / PIN
              </label>
              <input
                type="password"
                required
                autoFocus
                value={pinOrPass}
                onChange={(e) => setPinOrPass(e.target.value)}
                placeholder="Enter PIN (e.g. 2006)"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-mono text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none tracking-widest text-center"
              />
              <span className="block mt-1.5 text-[10px] font-mono text-white/40 text-center">
                Default Master PIN: <span className="text-brand-yellow font-bold">2006</span>
              </span>
            </div>

            {error && <p className="text-xs font-mono text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-cyan-500 hover:brightness-110 active:scale-95 py-3 text-xs font-mono font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all cursor-pointer"
            >
              Unlock Dashboard →
            </button>

            {/* 1-Click Studio Bypass for Naveen */}
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2 text-[11px] font-mono text-white/40 hover:text-brand-blue transition-colors text-center"
            >
              ⚡ 1-Click Studio Fast Pass (Authorized Admin)
            </button>
          </form>
        ) : (
          /* Email Mode Form */
          <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sanshift.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={pinOrPass}
                onChange={(e) => setPinOrPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-brand-blue focus:outline-none"
              />
            </div>

            {error && <p className="text-xs font-mono text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-blue hover:bg-brand-blue-dark py-3 text-xs font-mono font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting ? 'Authenticating…' : 'Sign In via Cloud →'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <Link
            to="/"
            className="text-xs font-mono text-white/40 hover:text-brand-blue transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sanshift_admin_session') === 'true'
  })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    // Also listen to Supabase auth in background
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setIsAuthenticated(true)
    })
  }, [])

  if (!isAuthenticated) {
    return <LoginGate onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  const handleLogout = () => {
    playClickSound()
    localStorage.removeItem('sanshift_admin_session')
    supabase.auth.signOut().catch(() => {})
    setIsAuthenticated(false)
  }

  return (
    <div className="flex min-h-screen bg-[#070a13] text-white font-sans antialiased">
      {/* Desktop Luxury Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0c101c] border-r border-white/10 lg:flex">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoIcon} alt="SAN SHIFT" className="h-8 w-8 rounded-xl object-contain shadow-sm" />
            <img src={wordmarkWhite} alt="SAN SHIFT" className="h-4.5 w-auto object-contain" />
          </Link>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-blue">
              Executive OS v3.0
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Live" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 scale-[1.01]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[9px] font-mono text-brand-yellow">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/5 space-y-1.5">
          <a
            href="/catalog"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-mono text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>Live Catalog</span>
            <span>↗</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-mono text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
          >
            <span>Sign Out</span>
            <span>⎋</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0c101c]/95 backdrop-blur-xl px-5 py-3.5 lg:hidden">
          <div className="flex items-center gap-2.5">
            <img src={logoIcon} alt="SAN SHIFT" className="h-7 w-7 rounded-lg" />
            <img src={wordmarkWhite} alt="SAN SHIFT" className="h-4 w-auto" />
            <span className="text-[10px] font-mono font-bold text-brand-blue ml-1 uppercase">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/catalog"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-white/60 hover:text-white px-2 py-1"
            >
              Store ↗
            </a>
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="rounded-lg border border-white/15 p-1.5 text-xs text-white"
            >
              {mobileNavOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Down Menu */}
        {mobileNavOpen && (
          <div className="lg:hidden border-b border-white/10 bg-[#0c101c] p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2 text-xs font-mono font-bold ${
                    isActive ? 'bg-brand-blue text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {item.badge && <span className="text-[10px] text-brand-yellow">{item.badge}</span>}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <a href="/" target="_blank" className="text-xs font-mono text-white/60">
                View Site ↗
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-mono text-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
