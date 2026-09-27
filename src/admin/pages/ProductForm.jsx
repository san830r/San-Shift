import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useContent } from '../../content/ContentContext'
import { playClickSound, playChimeSound } from '../../lib/soundFx'
import bundleImage from '../../assets/products/biggest-editing-bundle.webp'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function compressImageFile(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/webp', quality))
      }
      img.onerror = () => resolve(e.target.result)
      img.src = e.target.result
    }
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

export default function ProductForm() {
  const { id } = useParams()
  const isNew = id === undefined
  const { content, updateContent } = useContent()
  const navigate = useNavigate()

  const existing = !isNew ? content.products.find((p) => p.id === id) : null

  const [form, setForm] = useState(() => ({
    id: existing?.id || '',
    name: existing?.name || '',
    category: existing?.category || (content.categories?.[0] || 'Digital Bundles'),
    price: existing?.price ?? 49,
    originalPrice: existing?.originalPrice ?? 499,
    available: existing?.available ?? true,
    image: existing?.image || '',
    driveLink: existing?.driveLink || '',
    tagline: existing?.tagline || '',
    shortDescription: existing?.shortDescription || '',
    stats: existing?.stats || [
      'Verified 4K UHD Assets',
      'Commercial Royalty-Free License',
      'Instant Google Drive Unlock',
    ],
  }))

  const [idTouched, setIdTouched] = useState(!isNew)
  const [newStat, setNewStat] = useState('')
  const [newCatInput, setNewCatInput] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [compressing, setCompressing] = useState(false)

  const discount =
    form.originalPrice && form.price
      ? Math.round((1 - form.price / form.originalPrice) * 100)
      : null

  const handleNameChange = (val) => {
    setForm((prev) => {
      const next = { ...prev, name: val }
      if (!idTouched) next.id = slugify(val)
      return next
    })
  }

  // Handle local image file upload with automatic high-res WebP compression
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 0.85)
      setForm((prev) => ({ ...prev, image: compressedDataUrl }))
      playClickSound()
    } catch (err) {
      console.warn('Compression fallback to FileReader:', err)
      const reader = new FileReader()
      reader.onload = (event) => {
        setForm((prev) => ({ ...prev, image: event.target.result }))
      }
      reader.readAsDataURL(file)
    } finally {
      setCompressing(false)
    }
  }

  const handleAddStat = () => {
    if (!newStat.trim()) return
    playClickSound()
    setForm((prev) => ({ ...prev, stats: [...(prev.stats || []), newStat.trim()] }))
    setNewStat('')
  }

  const handleRemoveStat = (idx) => {
    playClickSound()
    setForm((prev) => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== idx),
    }))
  }

  const handleAddNewCategory = () => {
    if (!newCatInput.trim()) return
    playClickSound()
    const cat = newCatInput.trim()
    const updatedCats = Array.from(new Set([...(content.categories || []), cat]))
    updateContent('categories', updatedCats)
    setForm((prev) => ({ ...prev, category: cat }))
    setNewCatInput('')
    setShowNewCat(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('Product name is required.')
      return
    }

    const finalId = form.id.trim() || slugify(form.name)
    if (isNew && content.products.some((p) => p.id === finalId)) {
      alert('A product with this ID already exists. Please choose a different name or ID.')
      return
    }

    playChimeSound()
    const productToSave = {
      ...form,
      id: finalId,
      price: form.price === '' ? null : Number(form.price),
      originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice),
      image: form.image || bundleImage,
      driveLink: form.driveLink.trim() || content.site.driveLink,
    }

    const nextProducts = isNew
      ? [productToSave, ...content.products]
      : content.products.map((p) => (p.id === id ? productToSave : p))

    updateContent('products', nextProducts)
    navigate('/admin/products')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/products"
            className="text-xs font-mono text-white/50 hover:text-brand-blue flex items-center gap-1 mb-2"
          >
            ← Back to Products
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {isNew ? '+ Create New Product' : `Edit: ${form.name}`}
          </h1>
        </div>

        {!isNew && (
          <Link
            to={`/products/${form.id}`}
            target="_blank"
            className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5"
          >
            <span>Live Product Page</span>
            <span>↗</span>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info Box */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <h2 className="font-display text-base font-black text-white uppercase tracking-tight pb-2 border-b border-white/10">
            1. Core Details &amp; Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. 500+ Cinematic Color LUTs Pack"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                Product URL Slug (ID) *
              </label>
              <input
                type="text"
                required
                value={form.id}
                onChange={(e) => {
                  setIdTouched(true)
                  setForm({ ...form, id: slugify(e.target.value) })
                }}
                placeholder="e.g. cinema-luts-pack"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-mono text-white/80 focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Category Selector with Inline Creator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50">
                Category *
              </label>
              <button
                type="button"
                onClick={() => setShowNewCat(!showNewCat)}
                className="text-[11px] font-mono text-brand-blue hover:underline"
              >
                {showNewCat ? '✕ Cancel' : '+ Create New Category'}
              </button>
            </div>

            {showNewCat ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  placeholder="Enter new category name..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="rounded-xl bg-brand-blue px-4 py-2 text-xs font-mono font-bold text-white uppercase"
                >
                  Save Category
                </button>
              </div>
            ) : (
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0c101c] px-4 py-2.5 text-sm text-white focus:border-brand-blue focus:outline-none cursor-pointer"
              >
                {content.categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tagline & Short Description */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
              Punchy Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="e.g. Hollywood-grade color grades for Premiere, DaVinci & FCP."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
              Full Description
            </label>
            <textarea
              rows={3}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="Detailed description of what the customer receives in this digital pack..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Pricing & Delivery Box */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <h2 className="font-display text-base font-black text-white uppercase tracking-tight pb-2 border-b border-white/10">
            2. Pricing &amp; Google Drive Delivery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="49"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base font-mono font-black text-emerald-400 focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="499"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base font-mono text-white/50 focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div className="pt-4 sm:pt-0">
              {discount ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Calculated Discount
                  </span>
                  <span className="font-display font-black text-xl text-emerald-400">
                    SAVE {discount}%
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-white/30">Regular Price</span>
              )}
            </div>
          </div>

          {/* Availability Status */}
          <div className="pt-2">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-2">
              Catalog Availability
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, available: true })}
                className={`rounded-xl px-4 py-2 text-xs font-mono font-bold border transition-all cursor-pointer ${
                  form.available
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                ● Instant Access / Available Now
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, available: false })}
                className={`rounded-xl px-4 py-2 text-xs font-mono font-bold border transition-all cursor-pointer ${
                  !form.available
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                ○ Coming Soon
              </button>
            </div>
          </div>

          {/* Google Drive Link */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
              Google Drive Folder Link for this Product
            </label>
            <input
              type="url"
              value={form.driveLink}
              onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
              placeholder={content.site.driveLink || 'https://drive.google.com/drive/folders/...'}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-mono text-cyan-400 focus:border-brand-blue focus:outline-none"
            />
            <span className="text-[10px] font-mono text-white/40 block mt-1">
              * If left blank, defaults to master 55M+ Google Drive vault automatically upon UPI confirmation.
            </span>
          </div>
        </div>

        {/* Artwork & Image Upload Box (100% UNCROPPED GUARANTEED) */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <h2 className="font-display text-base font-black text-white uppercase tracking-tight pb-2 border-b border-white/10">
            3. Product Artwork (100% Uncropped Display)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 items-center">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Upload Image from Computer / Phone
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={compressing}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-brand-blue file:text-white cursor-pointer"
                />
                {compressing && (
                  <span className="text-[11px] font-mono text-cyan-400 animate-pulse block mt-1">
                    ⚡ Optimizing &amp; compressing image...
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Or Paste Direct Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              {form.image && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setForm({ ...form, image: '' })
                  }}
                  className="text-[11px] font-mono font-bold text-red-400 hover:text-red-300 hover:underline block pt-1 cursor-pointer"
                >
                  ✕ Remove Custom Photo (Reset to Studio Default)
                </button>
              )}
            </div>

            {/* Live Uncropped Artwork Preview */}
            <div className="rounded-2xl border border-white/15 bg-black/50 p-3 flex flex-col items-center justify-center min-h-[220px]">
              <span className="text-[10px] font-mono text-white/40 mb-2 uppercase">
                Live Uncropped Preview
              </span>
              <img
                src={form.image || bundleImage}
                alt="Preview"
                className="max-h-[200px] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Highlights / Features Box */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <h2 className="font-display text-base font-black text-white uppercase tracking-tight pb-2 border-b border-white/10">
            4. Features &amp; Specifications
          </h2>

          <div className="flex flex-wrap gap-2">
            {form.stats?.map((stat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white"
              >
                <span>{stat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="text-white/40 hover:text-red-400 p-0.5 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md pt-2">
            <input
              type="text"
              value={newStat}
              onChange={(e) => setNewStat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddStat()
                }
              }}
              placeholder="e.g. 500+ .cube LUTs, Sony S-Log3..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddStat}
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Link
            to="/admin/products"
            className="rounded-full px-5 py-2.5 text-xs font-mono font-bold text-white/50 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-brand-blue to-cyan-500 hover:brightness-110 active:scale-95 text-white px-8 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl shadow-brand-blue/40 transition-all cursor-pointer"
          >
            {isNew ? 'Create & Publish Product →' : 'Save Changes →'}
          </button>
        </div>
      </form>
    </div>
  )
}
