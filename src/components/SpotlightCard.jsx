import { useState, useRef } from 'react'

/**
 * Apple & Vercel style Spotlight Card
 * Emits an interactive Cyber Blue / Violet spotlight following the cursor,
 * with subtle dynamic illumination along the card borders.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(0, 56, 255, 0.18)',
  borderColor = 'rgba(0, 240, 255, 0.45)',
  as: Component = 'div',
  ...rest
}) {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden group transition-all duration-300 ${className}`}
      {...rest}
    >
      {/* Dynamic Cursor Spotlight Radial Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"
        style={{
          background: isHovered
            ? `radial-gradient(420px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`
            : undefined,
        }}
      />

      {/* Dynamic Border Illumination Mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: isHovered
            ? `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${borderColor}, transparent 75%)`
            : undefined,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Inner Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </Component>
  )
}
