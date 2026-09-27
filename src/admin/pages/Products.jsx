import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../../content/ContentContext'
import { useCurrency } from '../../content/CurrencyContext'
import { playClickSound, playChimeSound } from '../../lib/soundFx'
import bundleImage from '../../assets/products/biggest-editing-bundle.webp'

function CategoriesPanel() {
  const { content, updateContent } = useContent()
  const [categories, setCategories] = useState(content.categories || [])
  const [newCat, setNewCat] = useState('')
  const [saved, setSaved] = useState(false)

  const handleAdd = () => {
    if (!newCat.trim()) return
    playClickSound()
    const next = [...categories, newCat.trim()]
    setCategories(next)
    setNewCat('')
    updateContent('categories', next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleRemove = (cat) => {
    if (!window.confirm(`Delete category "${cat}"?`)) return
    playClickSound()
    const next = categories.filter((c) => c !== cat)
    setCategories(next)
    updateContent('categories', next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white uppercase tracking-tight">
            Catalog Categories ({categories.length})
          </h2>
          <p className="mt-1 text-xs text-white/50">
            Controls the interactive category filter pills on the live /catalog page.
          </p>
        </div>
        {saved && <span className="text-xs font-mono font-bold text-emerald-400">✓ Saved!</span>}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-mono font-bold text-white"
          >
            <span>{cat}</span>
            <button
              type="button"
              onClick={() => handleRemove(cat)}
              className="text-white/40 hover:text-red-400 transition-colors p-0.5 text-xs"
              title="Delete category"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="pt-2 flex items-center gap-2 max-w-md">
        <input
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="New Category Name (e.g. AI Prompts, Motion Graphics)..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:border-brand-blue focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white px-4 py-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer shrink-0"
        >
          + Add
        </button>
      </div>
    </div>
  )
}

export default function Products() {
  const { content, updateContent } = useContent()
  const { formatPrice } = useCurrency()

  const removeProduct = (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    playClickSound()
    updateContent(
      'products',
      content.products.filter((p) => p.id !== id),
    )
  }

  const toggleAvailable = (id) => {
    playChimeSound()
    updateContent(
      'products',
      content.products.map((p) => (p.id === id ? { ...p, available: !p.available } : p)),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Products &amp; Vaults ({content.products.length})
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Manage, price, and upload digital asset bundles with instant Google Drive delivery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/vaults"
            className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-mono font-bold text-white transition-all"
          >
            📁 36 Vault Folders
          </Link>
          <Link
            to="/admin/products/new"
            className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark active:scale-95 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all cursor-pointer"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* Product List Cards */}
      <div className="space-y-3.5">
        {content.products.map((product) => {
          const discount =
            product.originalPrice && product.price
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : null

          return (
            <div
              key={product.id}
              className="rounded-3xl border border-white/10 bg-[#0c101c] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-blue/40 transition-all shadow-lg"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* 100% Uncropped Thumbnail Preview Box */}
                <div className="h-20 w-24 sm:h-24 sm:w-32 shrink-0 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-1.5">
                  <img
                    src={product.image || bundleImage}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="rounded-full bg-brand-blue/15 border border-brand-blue/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-brand-blue uppercase">
                      {product.category || 'DIGITAL PACK'}
                    </span>
                    {product.id === 'biggest-editing-pack' && (
                      <span className="rounded-full bg-amber-500/20 text-brand-yellow px-2 py-0.5 text-[10px] font-mono font-bold">
                        👑 Flagship Vault
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-black text-base sm:text-lg text-white truncate">
                    {product.name}
                  </h3>

                  <p className="text-xs text-white/50 truncate max-w-xl font-sans mt-0.5">
                    {product.tagline || product.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                    <span className="font-display font-black text-base text-emerald-400">
                      {product.price ? formatPrice(product.price) : 'Free / Included'}
                    </span>
                    {product.originalPrice && (
                      <span className="text-white/40 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {discount && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                {/* Availability Toggle */}
                <button
                  type="button"
                  onClick={() => toggleAvailable(product.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    product.available
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                  }`}
                >
                  {product.available ? '● Instant Access' : '○ Coming Soon'}
                </button>

                {/* View on Live Site */}
                <Link
                  to={`/products/${product.id}`}
                  target="_blank"
                  className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-mono font-bold text-white transition-all"
                  title="Preview on Live Site"
                >
                  Live ↗
                </Link>

                {/* Edit */}
                <Link
                  to={`/admin/products/${product.id}`}
                  className="rounded-full bg-brand-blue hover:bg-brand-blue-dark active:scale-95 px-4 py-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider transition-all cursor-pointer"
                >
                  Edit
                </Link>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="rounded-full border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 text-white/40 px-3 py-1.5 text-xs font-mono transition-all cursor-pointer"
                  title="Delete Product"
                >
                  ✕
                </button>
              </div>
            </div>
          )
        })}

        {content.products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center text-white/40 font-mono">
            No products in catalog yet. Click &ldquo;+ Add New Product&rdquo; above!
          </div>
        )}
      </div>

      {/* Category Manager */}
      <CategoriesPanel />
    </div>
  )
}
