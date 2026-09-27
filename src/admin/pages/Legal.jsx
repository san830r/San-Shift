import { useState } from 'react'
import { useContent } from '../../content/ContentContext'
import { Field, TextInput, TextArea, SaveBar } from '../components/Fields'
import BackLink from '../components/BackLink'
import { playClickSound, playChimeSound } from '../../lib/soundFx'

const PAGES = [
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'refund', label: 'Refund Policy' },
  { key: 'delivery', label: 'Digital Product Delivery Policy' },
]

function LegalPagePanel({ pageKey, label }) {
  const { content, updateContent } = useContent()
  const [page, setPage] = useState(content.legal[pageKey])
  const [saved, setSaved] = useState(false)

  const setSection = (i, field, value) => {
    const sections = [...page.sections]
    sections[i] = { ...sections[i], [field]: value }
    setPage({ ...page, sections })
  }
  const removeSection = (i) => {
    playClickSound()
    setPage({ ...page, sections: page.sections.filter((_, idx) => idx !== i) })
  }
  const addSection = () => {
    playClickSound()
    setPage({ ...page, sections: [...page.sections, { heading: '', body: '' }] })
  }

  const save = () => {
    playChimeSound()
    updateContent(['legal', pageKey], page)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
      <h2 className="font-display text-lg font-black text-white uppercase tracking-tight pb-2 border-b border-white/10">
        {label}
      </h2>

      <div className="space-y-4">
        <Field label="Page Title">
          <TextInput value={page.title} onChange={(v) => setPage({ ...page, title: v })} />
        </Field>
        <Field label="Last Updated Text">
          <TextInput value={page.updated} onChange={(v) => setPage({ ...page, updated: v })} />
        </Field>
        <Field label="Intro Paragraph">
          <TextArea value={page.intro} onChange={(v) => setPage({ ...page, intro: v })} rows={2} />
        </Field>

        <div className="space-y-3 pt-2">
          {page.sections.map((section, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  value={section.heading}
                  onChange={(e) => setSection(i, 'heading', e.target.value)}
                  placeholder="Section heading"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-white outline-none focus:border-brand-blue"
                />
                <button
                  type="button"
                  onClick={() => removeSection(i)}
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono font-bold text-white/40 hover:text-red-400 hover:border-red-500/40 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <textarea
                value={section.body}
                onChange={(e) => setSection(i, 'body', e.target.value)}
                rows={2}
                placeholder="Section text"
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/80 outline-none focus:border-brand-blue"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="rounded-full border border-dashed border-white/20 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wide text-white/60 hover:border-brand-blue hover:text-brand-blue cursor-pointer"
          >
            + Add Section
          </button>
        </div>
      </div>

      <SaveBar saved={saved} onSave={save} />
    </div>
  )
}

export default function Legal() {
  return (
    <div className="space-y-6">
      <BackLink />
      <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
        Legal Policies &amp; Terms
      </h1>
      <p className="mt-1 text-xs sm:text-sm text-white/50">
        Edit Privacy Policy, Terms &amp; Conditions, Refund Policy, and Instant Digital Product Delivery policy.
      </p>

      <div className="space-y-6">
        {PAGES.map((p) => (
          <LegalPagePanel key={p.key} pageKey={p.key} label={p.label} />
        ))}
      </div>
    </div>
  )
}
