import { useState, useEffect } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { stopLenis, startLenis } from '../lib/lenisSetup'

export default function BrandDiagnosticModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1) // 1 | 2 | 3 | 4 (Result)
  const [priority, setPriority] = useState('Content Creation')
  const [businessType, setBusinessType] = useState('E-Commerce / D2C')
  const [pace, setPace] = useState('Fast-Track Sprint (48 - 72h)')

  // Lock scroll & pause Lenis
  useEffect(() => {
    if (isOpen) {
      stopLenis()
      document.body.style.overflow = 'hidden'
    } else {
      startLenis()
      document.body.style.overflow = ''
    }
    return () => {
      startLenis()
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelectPriority = (val) => {
    playClickSound()
    setPriority(val)
    setStep(2)
  }

  const handleSelectBusiness = (val) => {
    playClickSound()
    setBusinessType(val)
    setStep(3)
  }

  const handleSelectPace = (val) => {
    playClickSound()
    setPace(val)
    setStep(4)
  }

  const handleLaunchWhatsApp = () => {
    playChimeSound()
    const msg = encodeURIComponent(
      `Hi SAN SHIFT! 👋 I just completed the 10-Second Studio Diagnostic on your website:\n\n` +
      `🎯 *Priority Focus:* ${priority}\n` +
      `🏢 *Business Type:* ${businessType}\n` +
      `⚡ *Delivery Pace:* ${pace}\n\n` +
      `Please share the recommended custom growth blueprint and pricing!`
    )
    window.open(`https://wa.me/917339467830?text=${msg}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  const handleReset = () => {
    playClickSound()
    setStep(1)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={() => {
          playClickSound()
          onClose()
        }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xl transition-opacity"
      />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#0c101c] text-black dark:text-white shadow-[0_30px_90px_rgba(0,56,255,0.22)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/10 px-5 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brand-blue shadow-[0_0_8px_#0038ff] animate-pulse" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">
              10-SECOND BRAND DIAGNOSTIC
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              onClose()
            }}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="shrink-0 h-1 w-full bg-black/5 dark:bg-white/5">
          <div
            className="h-full bg-brand-blue transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar overscroll-contain"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <span className="font-mono text-[11px] font-bold uppercase text-brand-blue">
                QUESTION 01 OF 03
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-snug">
                What is your primary studio priority?
              </h3>
              <p className="text-xs text-black/60 dark:text-white/60 font-sans">
                Select the core pillar you want SAN SHIFT to elevate for you.
              </p>

              <div className="mt-4 flex flex-col gap-2.5">
                {[
                  { title: 'Viral Content Creation', desc: 'Shorts, Reels, Hooks & High-Retention Video', icon: '📱' },
                  { title: 'Digital Marketing & Paid Ads', desc: 'Meta & Google Targeted Ad Campaigns, ROAS Growth', icon: '📈' },
                  { title: 'Digital Products & Toolkits', desc: 'Canva Templates, Presets & Creator Resource Bundles', icon: '⚡' },
                  { title: 'Full Brand Growth Retainer', desc: 'End-to-End Content Engine + Paid Traffic Management', icon: '👑' },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelectPriority(item.title)}
                    className="flex items-center justify-between rounded-2xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 text-left transition-all hover:border-brand-blue hover:bg-brand-blue/5 hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-black dark:text-white">{item.title}</div>
                        <div className="text-[11px] text-black/50 dark:text-white/50">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-brand-blue font-bold text-sm">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <span className="font-mono text-[11px] font-bold uppercase text-brand-blue">
                QUESTION 02 OF 03
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-snug">
                What type of brand or business?
              </h3>
              <p className="text-xs text-black/60 dark:text-white/60 font-sans">
                Helps us customize the ideal audience pacing and funnel architecture.
              </p>

              <div className="mt-4 flex flex-col gap-2.5">
                {[
                  { title: 'E-Commerce / D2C Brand', desc: 'Physical or digital product sellers scaling ROAS', icon: '🛍️' },
                  { title: 'Content Creator / Influencer', desc: 'Personal brands growing high-retention audiences', icon: '🎙️' },
                  { title: 'B2B & High-Ticket Agency', desc: 'Services and consultants generating qualified leads', icon: '💼' },
                  { title: 'Local Business / Startup', desc: 'Local footprint expansion and community traction', icon: '🏢' },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelectBusiness(item.title)}
                    className="flex items-center justify-between rounded-2xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 text-left transition-all hover:border-brand-blue hover:bg-brand-blue/5 hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-black dark:text-white">{item.title}</div>
                        <div className="text-[11px] text-black/50 dark:text-white/50">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-brand-blue font-bold text-sm">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <span className="font-mono text-[11px] font-bold uppercase text-brand-blue">
                QUESTION 03 OF 03
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-snug">
                What is your timeline or delivery pace?
              </h3>
              <p className="text-xs text-black/60 dark:text-white/60 font-sans">
                Select your required turnaround speed.
              </p>

              <div className="mt-4 flex flex-col gap-2.5">
                {[
                  { title: 'Fast-Track Sprint (48 - 72h)', desc: 'Rapid delivery for urgent campaign launches', icon: '⚡' },
                  { title: 'Monthly Retainer Partnership', desc: 'Consistent ongoing content & marketing management', icon: '🔄' },
                  { title: 'Instant Download / Resource Pack', desc: 'Ready-to-use digital assets with immediate access', icon: '📦' },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelectPace(item.title)}
                    className="flex items-center justify-between rounded-2xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 text-left transition-all hover:border-brand-blue hover:bg-brand-blue/5 hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-black dark:text-white">{item.title}</div>
                        <div className="text-[11px] text-black/50 dark:text-white/50">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-brand-blue font-bold text-sm">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RESULT BLUEPRINT */}
          {step === 4 && (
            <div className="space-y-5 text-center animate-fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue text-2xl">
                ✨
              </div>

              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  GROWTH BLUEPRINT GENERATED
                </span>
                <h3 className="mt-1 font-display text-2xl font-black uppercase text-black dark:text-white">
                  Your Custom Roadmap Is Ready
                </h3>
              </div>

              {/* Summary Chip Box */}
              <div className="rounded-2xl border border-black/8 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] p-4 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-black/50 dark:text-white/50">Priority Focus:</span>
                  <span className="font-bold text-black dark:text-white">{priority}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-black/50 dark:text-white/50">Business Model:</span>
                  <span className="font-bold text-black dark:text-white">{businessType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-black/50 dark:text-white/50">Pace Target:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{pace}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 py-4 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
              >
                <span>Receive Blueprint on WhatsApp</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-mono text-black/50 dark:text-white/50 hover:underline"
              >
                Restart Diagnostic ↺
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
