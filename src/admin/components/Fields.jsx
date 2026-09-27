export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-mono font-bold uppercase tracking-widest text-white/60">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs font-sans text-white/40">{hint}</span>}
    </label>
  )
}

export function TextInput({ value, onChange, type = 'text', placeholder, ...rest }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber : e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
      {...rest}
    />
  )
}

export function TextArea({ value, onChange, rows = 3, placeholder }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
    />
  )
}

export function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-[#0c101c] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-brand-blue cursor-pointer"
    >
      {options.map((opt) => {
        const optVal = typeof opt === 'object' && opt !== null ? opt.value : opt
        const optLabel = typeof opt === 'object' && opt !== null ? opt.label : opt
        return (
          <option key={optVal} value={optVal} className="bg-[#0c101c] text-white">
            {optLabel}
          </option>
        )
      })}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 cursor-pointer"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-blue shadow-md shadow-brand-blue/40' : 'bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
      {label && <span className="text-sm font-semibold text-white/80">{label}</span>}
    </button>
  )
}

export function StringListEditor({ items, onChange, placeholder = 'New item' }) {
  const setAt = (i, value) => {
    const next = [...items]
    next[i] = value
    onChange(next)
  }
  const removeAt = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, ''])

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => setAt(i, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-blue"
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/40 hover:border-red-500/40 hover:text-red-400 cursor-pointer"
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-full border border-dashed border-white/20 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wide text-white/60 hover:border-brand-blue hover:text-brand-blue cursor-pointer"
      >
        + Add
      </button>
    </div>
  )
}

export function SaveBar({ onSave, onReset, saved }) {
  return (
    <div className="sticky bottom-4 z-10 mt-8 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0c101c]/95 backdrop-blur-xl px-5 py-4 shadow-2xl">
      <span
        className={`text-sm font-mono font-bold transition-opacity ${
          saved ? 'text-emerald-400 opacity-100' : 'opacity-0'
        }`}
      >
        ✓ All Changes Saved
      </span>
      <div className="flex gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-mono font-bold text-white/60 hover:text-white cursor-pointer"
          >
            Reset Section
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-gradient-to-r from-brand-blue to-cyan-500 hover:brightness-110 active:scale-95 px-6 py-2.5 text-xs font-mono font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 cursor-pointer transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
