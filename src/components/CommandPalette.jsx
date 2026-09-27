import { useState, useEffect, useRef } from 'react'
import { playClickSound, playChimeSound, toggleSound } from '../lib/soundFx'
import { useTheme } from '../content/ThemeContext'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { toggleTheme } = useTheme()
  const inputRef = useRef(null)

  const COMMANDS = [
    {
      id: 'services',
      title: 'Explore Our 5 Core Capabilities',
      category: 'NAVIGATION',
      action: () => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
      },
    },
    {
      id: 'catalog',
      title: 'Browse Digital Products & Editing Packs',
      category: 'COMMERCE',
      action: () => {
        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
      },
    },
    {
      id: 'benefits',
      title: 'Why SAN SHIFT: Built For Creators',
      category: 'ABOUT',
      action: () => {
        document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })
      },
    },
    {
      id: 'about',
      title: 'Our Mission & Creative Studio Story',
      category: 'ABOUT',
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      },
    },
    {
      id: 'contact',
      title: 'Get In Touch / Start A Project',
      category: 'INQUIRY',
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      },
    },
    {
      id: 'theme',
      title: 'Toggle Cinema Mode (Dark / Light Theme)',
      category: 'SYSTEM',
      action: () => {
        toggleTheme()
      },
    },
    {
      id: 'sound',
      title: 'Toggle Micro-Audio Sound Effects',
      category: 'AUDIO',
      action: () => {
        toggleSound()
      },
    },
    {
      id: 'whatsapp',
      title: 'Direct Chat with SAN SHIFT on WhatsApp',
      category: 'DIRECT BOOKING',
      action: () => {
        window.open('https://wa.me/917339467830?text=Hi%20SAN%20SHIFT!%20I%20want%20to%20inquire%20about%20your%20services.', '_blank')
      },
    },
  ]

  const filtered = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        playChimeSound()
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
    }
  }, [isOpen])

  const executeCommand = (cmd) => {
    playClickSound()
    cmd.action()
    setIsOpen(false)
  }

  const handleKeyDownList = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault()
      executeCommand(filtered[selectedIndex])
    }
  }

  return (
    <>
      {/* Floating Header Shortcut Pill Trigger */}
      <button
        type="button"
        onClick={() => {
          playChimeSound()
          setIsOpen(true)
        }}
        data-cursor="COMMANDS"
        title="Open Command Palette (Ctrl+K)"
        className="hidden md:inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.05] px-3 py-1.5 text-[11px] font-mono font-bold text-black/60 dark:text-white/60 hover:border-brand-blue hover:text-brand-blue transition-colors"
      >
        <span className="text-[10px] bg-black/10 dark:bg-white/15 px-1.5 py-0.5 rounded">⌘K</span>
        <span>COMMANDS</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-white/20 bg-[#0c101c] text-white shadow-2xl overflow-hidden font-sans"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownList}
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <span className="text-brand-blue font-bold font-mono text-base">❯</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or jump to feature..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/30 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-white/40 uppercase">ESC TO CLOSE</span>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.map((cmd, idx) => (
                <div
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer text-xs transition-colors ${
                    selectedIndex === idx
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-brand-yellow font-bold">›</span>
                    <span className="font-bold">{cmd.title}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${selectedIndex === idx ? 'text-white/80' : 'text-white/40'}`}>
                    {cmd.category}
                  </span>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-xs text-white/40 font-mono">
                  No matching commands found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 text-[10px] font-mono text-white/40 bg-black/40">
              <span>Use ↑↓ to navigate • ↵ to select</span>
              <span className="text-brand-blue font-bold">SAN SHIFT TERMINAL v2.5</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
