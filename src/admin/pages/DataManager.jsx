import { useRef, useState } from 'react'
import { useContent } from '../../content/ContentContext'
import BackLink from '../components/BackLink'
import { playClickSound, playChimeSound } from '../../lib/soundFx'

export default function DataManager() {
  const { exportJSON, importJSON, resetContent } = useContent()
  const fileInputRef = useRef(null)
  const [message, setMessage] = useState('')

  const handleExport = () => {
    playClickSound()
    const json = exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `san-shift-store-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('✓ Backup file downloaded successfully.')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCopy = async () => {
    playClickSound()
    try {
      await navigator.clipboard.writeText(exportJSON())
      setMessage('✓ JSON copied to clipboard.')
    } catch {
      setMessage('Could not copy — browser blocked clipboard.')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      importJSON(text)
      playChimeSound()
      setMessage('✓ Content restored & updated successfully.')
    } catch {
      setMessage('⚠️ Error: Selected file is not valid JSON content.')
    }
    e.target.value = ''
    setTimeout(() => setMessage(''), 3000)
  }

  const handleReset = () => {
    if (!window.confirm('Reset ALL content back to the original studio defaults? This cannot be undone.')) return
    playClickSound()
    resetContent()
    setMessage('✓ Content reset to studio defaults.')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
        Backup, Restore &amp; Cloud Sync
      </h1>
      <p className="mt-1 text-xs sm:text-sm text-white/50">
        Export and backup your complete store content, products, and configurations.
      </p>

      {message && (
        <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/15 px-4 py-3 text-xs font-mono font-bold text-cyan-400">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Export Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-3">
          <h2 className="font-display text-base font-black text-white uppercase tracking-tight">
            Export Store Backup
          </h2>
          <p className="text-xs text-white/50">
            Download your full catalog, products, prices, and settings as a portable JSON snapshot.
          </p>
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark active:scale-95 px-5 py-2.5 text-xs font-mono font-bold uppercase text-white shadow-lg shadow-brand-blue/30 cursor-pointer"
            >
              📥 Download JSON Backup
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-mono text-white cursor-pointer"
            >
              Copy JSON
            </button>
          </div>
        </div>

        {/* Import Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-3">
          <h2 className="font-display text-base font-black text-white uppercase tracking-tight">
            Import / Restore Backup
          </h2>
          <p className="text-xs text-white/50">
            Restore content from a previously saved JSON file to instantly sync devices.
          </p>
          <div className="pt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-brand-blue file:text-white cursor-pointer"
            />
          </div>
        </div>

        {/* Reset Card */}
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 shadow-xl sm:col-span-2 space-y-2">
          <h2 className="font-display text-base font-black text-red-400 uppercase tracking-tight">
            Danger Zone: Factory Reset
          </h2>
          <p className="text-xs text-red-300/60 font-sans">
            Wipes all edits made in this admin panel and restores the original starting content.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            Reset Everything to Studio Defaults
          </button>
        </div>
      </div>
    </div>
  )
}
