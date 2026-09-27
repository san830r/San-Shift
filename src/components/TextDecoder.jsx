import { useEffect, useRef, useState, useCallback } from 'react'
import { prefersReducedMotion } from '../lib/gsapSetup'
import { playClickSound } from '../lib/soundFx'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function TextDecoder({
  text,
  className = '',
  triggerOnHover = true,
  autoStart = true,
  speed = 30,
}) {
  const [displayText, setDisplayText] = useState(text)
  const isScramblingRef = useRef(false)
  const elementRef = useRef(null)

  const scramble = useCallback(() => {
    if (prefersReducedMotion() || isScramblingRef.current) return
    isScramblingRef.current = true

    let iteration = 0
    const targetLength = text.length

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration) {
              return text[index]
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
      )

      if (iteration >= targetLength) {
        clearInterval(interval)
        isScramblingRef.current = false
        setDisplayText(text)
      }

      iteration += 1 / 2
    }, speed)
  }, [text, speed])

  useEffect(() => {
    if (!autoStart) return
    const el = elementRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playClickSound()
            scramble()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [autoStart, scramble])

  return (
    <span
      ref={elementRef}
      onMouseEnter={triggerOnHover ? scramble : undefined}
      className={`font-mono transition-colors select-none ${className}`}
    >
      {displayText}
    </span>
  )
}
