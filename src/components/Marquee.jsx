import { useContent } from '../content/ContentContext'

export default function Marquee() {
  const { content } = useContent()
  const marqueeItems = content.marquee || [
    'PREMIUM DIGITAL RESOURCES',
    'CREATOR FOCUSED',
    'INSTANT ACCESS',
    'BUILT FOR EDITORS',
    'SHIFT THE STANDARD',
  ]
  const track = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems]

  return (
    <div className="relative overflow-hidden border-y border-brand-blue-dark bg-brand-blue py-4.5 sm:py-5 shadow-lg shadow-brand-blue/20">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white"
          >
            <span>{item}</span>
            <span className="text-brand-yellow font-sans text-sm sm:text-base animate-pulse" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
