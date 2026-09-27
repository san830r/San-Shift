import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from '../lib/gsapSetup'
import { playClickSound } from '../lib/soundFx'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function FlipChar({ targetChar, delay = 0 }) {
  const [displayChar, setDisplayChar] = useState(targetChar)
  const isNumber = !isNaN(parseInt(targetChar, 10))

  useEffect(() => {
    if (!isNumber || prefersReducedMotion()) return

    const timeout = setTimeout(() => {
      let count = 0
      const maxFlips = 12 + Math.floor(Math.random() * 8)

      const interval = setInterval(() => {
        setDisplayChar(DIGITS[Math.floor(Math.random() * DIGITS.length)])
        count++

        if (count >= maxFlips) {
          clearInterval(interval)
          setDisplayChar(targetChar)
        }
      }, 45)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [targetChar, isNumber, delay])

  if (!isNumber) {
    return <span>{targetChar}</span>
  }

  return (
    <span className="inline-block relative overflow-hidden font-mono font-black">
      <span className="inline-block transition-transform duration-100">
        {displayChar}
      </span>
    </span>
  )
}

export default function SplitFlapCounter({ value, className = '' }) {
  const containerRef = useRef(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        playClickSound()
        setTriggered(true)
      },
    })

    return () => trigger.kill()
  }, [])

  const chars = String(value).split('')

  return (
    <span ref={containerRef} className={`inline-flex items-baseline ${className}`}>
      {chars.map((char, index) => (
        <FlipChar
          key={index}
          targetChar={char}
          delay={triggered ? index * 80 : 999999}
        />
      ))}
    </span>
  )
}
