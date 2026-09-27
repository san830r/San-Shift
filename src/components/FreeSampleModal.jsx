import { useState, useEffect } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'

export default function FreeSampleModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleOpen = () => {
    playChimeSound()
    setIsOpen(true)
  }

  const handleClose = () => {
    playClickSound()
    setIsOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    playChimeSound()
    setSubmitted(true)

    const message = encodeURIComponent(
      `Hi SAN SHIFT! 👋 I would like to download the *Free Creator Teaser Pack* (15 LUTs & SFX).\n\n` +
      `👤 Name: ${name || 'Creator'}\n` +
      `📱 Contact: ${contact || 'N/A'}\n\n` +
      `Please send me the direct access link!`
    )

    setTimeout(() => {
      window.open(`https://wa.me/917339467830?text=${message}`, '_blank', 'noopener,noreferrer')
    }, 400)
  }

  return (
    <>
      {/* Floating Bottom-Right Pill Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleOpen}
          data-cursor="FREE PACK"
          className="group relative flex items-center gap-2.5 rounded-full border-2 border-brand-yellow/80 bg-black/90 dark:bg-black text-white px-5 py-3 shadow-[0_4px_25px_rgba(255,212,0,0.35)] transition-all hover:scale-105 active:scale-95"
          aria-label="Get Free Creator Teaser Pack"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-yellow" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-brand-yellow">
            🎁 FREE CREATOR PACK
          </span>
          <span className="hidden sm:inline text-[11px] font-bold text-white/70">
            [15 LUTs + SFX]
          </span>
        </button>
      </div>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-white dark:bg-[#0c101c] p-6 sm:p-8 text-black dark:text-white shadow-2xl transition-all overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Corner Glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-brand-blue/20 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-brand-yellow/15 blur-[60px]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="pr-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/50 bg-brand-yellow/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black dark:text-brand-yellow">
                    ⚡ 100% FREE CREATOR ASSETS
                  </div>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
                    DOWNLOAD THE <br />
                    <span className="text-brand-blue">CREATOR STARTER PACK.</span>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-black/60 dark:text-white/60 font-medium">
                    Test the SAN SHIFT production quality in your own edits today at zero cost.
                  </p>
                </div>

                {/* Pack Contents Preview List */}
                <div className="mt-5 space-y-2 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] p-4 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-black/80 dark:text-white/80">
                    <span className="text-brand-blue font-bold">✓</span>
                    <span>5 Cinematic Arri / Sony Rec.709 LUTs (.cube)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-black/80 dark:text-white/80">
                    <span className="text-brand-blue font-bold">✓</span>
                    <span>8 High-Impact Risers, Sub-Bass Whooshes & Glitches (.wav)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-black/80 dark:text-white/80">
                    <span className="text-brand-blue font-bold">✓</span>
                    <span>2 Kinetic Typography Hook Presets for Premiere / AE</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-black/80 dark:text-white/80">
                    <span className="text-brand-blue font-bold">✓</span>
                    <span>"The 3-Second Retention Blueprint" PDF Guide</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe / @creatorhandle"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
                      WhatsApp or Email
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210 or you@creator.com"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>

                  <button
                    type="submit"
                    data-cursor="DOWNLOAD"
                    className="w-full mt-2 rounded-full bg-brand-blue hover:bg-brand-blue-dark py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Instant WhatsApp Download</span>
                    <span>→</span>
                  </button>
                </form>

                <p className="mt-3 text-center text-[10px] text-black/40 dark:text-white/40">
                  Instant direct file access. Zero spam. Lifetime personal & commercial license.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-3xl">
                  🎁
                </div>
                <h3 className="mt-4 font-display text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                  You're All Set!
                </h3>
                <p className="mt-2 text-sm text-black/70 dark:text-white/70 max-w-xs mx-auto">
                  Opening your WhatsApp chat with our direct download package...
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 text-xs font-black uppercase tracking-wider hover:opacity-90"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
