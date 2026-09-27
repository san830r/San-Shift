import { useState } from 'react'
import { useContent } from '../../content/ContentContext'
import { playClickSound, playChimeSound } from '../../lib/soundFx'

export default function Vaults() {
  const { content, updateContent } = useContent()
  const [items, setItems] = useState(content.whatsInside || [])
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')

  const handleUpdate = (index, field, value) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    setItems(next)
  }

  const handleRemove = (index) => {
    if (!window.confirm(`Remove "${items[index]?.title}" from the inventory?`)) return
    playClickSound()
    const next = items.filter((_, idx) => idx !== index)
    setItems(next)
  }

  const handleAdd = () => {
    playClickSound()
    setItems([{ title: 'New Asset Collection', desc: 'Verified creator resources.' }, ...items])
  }

  const handleSave = () => {
    playChimeSound()
    updateContent('whatsInside', items.filter((i) => i.title.trim()))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const filtered = items.filter(
    (i) =>
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.desc?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            55M+ Master Vault Folders ({items.length})
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Manage the 36 inventory sub-collections and Google Drive folders displayed across the Catalog and Homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono font-bold text-white transition-all cursor-pointer"
          >
            + Add New Folder
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark active:scale-95 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all cursor-pointer"
          >
            {saved ? '✓ Saved to Cloud!' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/40">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vault folders (e.g. Sound Effects, Anime, Presets, Fonts)..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs font-sans text-white placeholder:text-white/40 focus:border-brand-blue focus:outline-none"
          />
        </div>
        <span className="text-xs font-mono text-white/40 shrink-0">
          Showing {filtered.length} of {items.length} Folders
        </span>
      </div>

      {/* Grid of Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((item, idx) => {
          const originalIdx = items.indexOf(item)
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 flex flex-col justify-between gap-3 hover:border-brand-blue/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">📁</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(originalIdx)}
                    className="text-white/30 hover:text-red-400 text-xs transition-colors p-1"
                    title="Remove folder"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleUpdate(originalIdx, 'title', e.target.value)}
                  placeholder="Folder / Pack Title"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-display font-bold text-sm text-white focus:border-brand-blue focus:outline-none"
                />
                <input
                  type="text"
                  value={item.desc}
                  onChange={(e) => handleUpdate(originalIdx, 'desc', e.target.value)}
                  placeholder="Short description"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/70 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-white/40">
                <span>Drive Category #{originalIdx + 1}</span>
                <span className="text-emerald-400">Verified</span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-white/40 font-mono text-xs">
          No folders match your search.
        </div>
      )}
    </div>
  )
}
