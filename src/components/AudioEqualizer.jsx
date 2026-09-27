import { useEffect, useState } from 'react'

export default function AudioEqualizer({ active = false, barCount = 5, className = '' }) {
  const [heights, setHeights] = useState(Array(barCount).fill(30))

  useEffect(() => {
    if (!active) {
      setHeights(Array(barCount).fill(25))
      return
    }

    const interval = setInterval(() => {
      setHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 75) + 25)
      )
    }, 110)

    return () => clearInterval(interval)
  }, [active, barCount])

  return (
    <div className={`inline-flex items-end gap-0.5 h-3.5 ${className}`} aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-0.5 rounded-full bg-brand-blue dark:bg-brand-yellow transition-[height] duration-100 ease-out"
          style={{ height: `${active ? h : 20}%` }}
        />
      ))}
    </div>
  )
}
