const TRACK_LAYOUTS = [
  [
    { left: 4, width: 34 },
    { left: 42, width: 22, active: true },
    { left: 68, width: 28 },
  ],
  [
    { left: 6, width: 46, active: true },
    { left: 56, width: 20 },
    { left: 80, width: 14 },
  ],
  [
    { left: 4, width: 20 },
    { left: 28, width: 30 },
    { left: 62, width: 34, active: true },
  ],
  [
    { left: 4, width: 58, active: true },
    { left: 66, width: 30 },
  ],
]

function PlayIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9 7v10l8-5-8-5Z" />
    </svg>
  )
}

export default function EditingTimelineMockup({ tracks, playheadPercent = 42 }) {
  const labels = tracks.map((t) => t.title)

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-brand-yellow" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 truncate text-[10px] font-semibold uppercase tracking-widest text-white/35">
          san_shift_edit.timeline
        </span>
      </div>

      <div className="relative mb-5 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-black/20 ring-1 ring-white/10">
        <div className="absolute inset-0 flex items-end justify-center gap-1 px-8 pb-4 opacity-40">
          {[6, 10, 5, 12, 8, 4, 9, 6, 11, 7].map((h, i) => (
            <span key={i} className="w-1.5 rounded-full bg-white" style={{ height: `${h * 4}px` }} />
          ))}
        </div>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
          <PlayIcon className="h-4 w-4 translate-x-0.5 text-white" />
        </span>
      </div>

      <div className="relative flex flex-1 flex-col justify-center gap-2.5">
        <div
          className="pointer-events-none absolute -top-1 bottom-0 z-10 w-px bg-brand-yellow"
          style={{ left: `${playheadPercent}%` }}
        >
          <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-brand-yellow" />
        </div>

        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="w-16 shrink-0 text-[9px] font-semibold leading-tight text-white/55 sm:w-20 sm:text-[10px]">
              {label}
            </span>
            <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-white/10">
              {TRACK_LAYOUTS[i % TRACK_LAYOUTS.length].map((seg, j) => (
                <span
                  key={j}
                  className={`absolute inset-y-0.5 rounded-sm ${seg.active ? 'bg-brand-yellow/85' : 'bg-white/25'}`}
                  style={{ left: `${seg.left}%`, width: `${seg.width}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
