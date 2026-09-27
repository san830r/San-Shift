import { playClickSound } from '../lib/soundFx'

export default function StudioSlotHUD() {
  const handleReserve = () => {
    playClickSound()
    const msg = encodeURIComponent("Hi SAN SHIFT! 👋 I'm checking to see if you have a priority sprint slot open for my project this week.")
    window.open(`https://wa.me/917339467830?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12 my-6">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0c101c]/80 backdrop-blur-xl p-3.5 sm:p-4 shadow-sm transition-all hover:border-brand-blue/30">
        
        {/* Ambient subtle glow */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-emerald-500/10 blur-xl" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Left Live Status */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div className="font-bold text-black dark:text-white uppercase tracking-wider text-[11px] sm:text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 mr-1.5">● LIVE CAPACITY:</span>
              <span>2 OF 5 SPRINT SLOTS REMAINING THIS WEEK</span>
            </div>
          </div>

          {/* Center Metrics */}
          <div className="hidden md:flex items-center gap-6 text-[11px] font-mono text-black/60 dark:text-white/60">
            <span>⏱️ Avg Turnaround: <strong className="text-black dark:text-white">28h</strong></span>
            <span>•</span>
            <span>🛡️ Lifetime Support: <strong className="text-black dark:text-white">Active</strong></span>
          </div>

          {/* Right Action */}
          <button
            type="button"
            onClick={handleReserve}
            data-cursor="RESERVE"
            className="inline-flex items-center gap-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-brand-blue dark:hover:bg-brand-blue dark:hover:text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm"
          >
            <span>Lock Slot on WhatsApp</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
