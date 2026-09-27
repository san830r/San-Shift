import { useState } from 'react'
import { useContent } from '../../content/ContentContext'
import { SaveBar } from '../components/Fields'
import BackLink from '../components/BackLink'
import { playClickSound, playChimeSound } from '../../lib/soundFx'

export default function FAQManager() {
  const { content, updateContent } = useContent()
  const [faqs, setFaqs] = useState(content.faqs || [])
  const [saved, setSaved] = useState(false)

  const setAt = (i, field, value) => {
    const next = [...faqs]
    next[i] = { ...next[i], [field]: value }
    setFaqs(next)
  }

  const removeAt = (i) => {
    playClickSound()
    setFaqs(faqs.filter((_, idx) => idx !== i))
  }

  const add = () => {
    playClickSound()
    setFaqs([...faqs, { q: '', a: '' }])
  }

  const move = (i, dir) => {
    playClickSound()
    const next = [...faqs]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setFaqs(next)
  }

  const save = () => {
    playChimeSound()
    updateContent(
      'faqs',
      faqs.filter((f) => f.q.trim() && f.a.trim())
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
        FAQ Manager ({faqs.length})
      </h1>
      <p className="mt-1 text-xs sm:text-sm text-white/50">
        Frequently asked questions displayed in the accordion on the homepage and customer help sections.
      </p>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-[#0c101c] p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <input
                  value={item.q}
                  onChange={(e) => setAt(i, 'q', e.target.value)}
                  placeholder="Question"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white outline-none focus:border-brand-blue"
                />
                <textarea
                  value={item.a}
                  onChange={(e) => setAt(i, 'a', e.target.value)}
                  placeholder="Answer"
                  rows={2}
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white/80 outline-none focus:border-brand-blue"
                />
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono font-bold text-white/60 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === faqs.length - 1}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono font-bold text-white/60 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono font-bold text-white/40 hover:border-red-500/40 hover:text-red-400 cursor-pointer"
                  title="Remove FAQ"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="rounded-full border border-dashed border-white/20 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wide text-white/60 hover:border-brand-blue hover:text-brand-blue cursor-pointer"
        >
          + Add Question
        </button>
      </div>

      <SaveBar saved={saved} onSave={save} />
    </div>
  )
}
