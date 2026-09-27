import { useState, useMemo } from 'react'
import { useContent } from '../../content/ContentContext'
import {
  sendWhatsAppDelivery,
  sendEmailReceipt,
  buildWhatsAppDeliveryUrl,
} from '../../lib/deliveryService'
import { playClickSound, playChimeSound } from '../../lib/soundFx'

// Default sample orders if no orders exist yet
const INITIAL_DEMO_ORDERS = [
  {
    orderId: 'SS-948102',
    customerName: 'Vignesh M',
    whatsapp: '9840123456',
    email: 'vignesh.edit@gmail.com',
    product: "World's Biggest Editing Bundle",
    amount: 99,
    utr: '429184029184',
    date: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    driveLink: 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
    status: 'Delivered',
  },
  {
    orderId: 'SS-948088',
    customerName: 'Karthik Raja',
    whatsapp: '9789054321',
    email: 'karthik.visuals@gmail.com',
    product: '500+ Cinematic Color LUTs Pack',
    amount: 49,
    utr: '429183991204',
    date: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    driveLink: 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
    status: 'Delivered',
  },
  {
    orderId: 'SS-948045',
    customerName: 'Priya Dharshini',
    whatsapp: '9443211223',
    email: 'priya.content@yahoo.com',
    product: '25,000+ Ultimate Creator SFX Pack',
    amount: 49,
    utr: '429182881944',
    date: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    driveLink: 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
    status: 'Delivered',
  },
  {
    orderId: 'SS-947990',
    customerName: 'Sanjay Kumar',
    whatsapp: '9655499887',
    email: 'sanjay.films@gmail.com',
    product: "World's Biggest Editing Bundle",
    amount: 99,
    utr: '429181772810',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    driveLink: 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
    status: 'Delivered',
  },
]

export default function Orders() {
  const { content, updateContent } = useContent()
  const { formatPrice } = useCurrency()

  const [searchQuery, setSearchQuery] = useState('')
  const [productFilter, setProductFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    whatsapp: '',
    email: '',
    product: "World's Biggest Editing Bundle",
    amount: 99,
    utr: '',
    driveLink: content?.site?.driveLink || 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
  })

  // Load and merge local and stored orders
  const orders = useMemo(() => {
    let local = []
    try {
      local = JSON.parse(localStorage.getItem('sanshift_orders') || 'null')
    } catch {
      local = null
    }

    const cloud = Array.isArray(content?.site?.orders) ? content.site.orders : []
    const combined = [...(local || INITIAL_DEMO_ORDERS), ...cloud]

    const map = new Map()
    for (const ord of combined) {
      if (ord && ord.orderId && !map.has(ord.orderId)) {
        map.set(ord.orderId, ord)
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    )
  }, [content?.site?.orders])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return orders.filter((o) => {
      const matchSearch =
        !q ||
        o.orderId?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.whatsapp?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.utr?.toLowerCase().includes(q) ||
        o.product?.toLowerCase().includes(q)

      if (!matchSearch) return false

      if (productFilter !== 'all' && o.product !== productFilter) {
        return false
      }

      return true
    })
  }, [orders, searchQuery, productFilter])

  // Revenue metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

  const persistOrders = (nextOrders) => {
    localStorage.setItem('sanshift_orders', JSON.stringify(nextOrders))
    updateContent('site.orders', nextOrders)
  }

  const handleCreateManualOrder = (e) => {
    e.preventDefault()
    if (!newOrder.customerName.trim() || !newOrder.whatsapp.trim()) {
      alert('Please enter customer name and WhatsApp number.')
      return
    }

    playChimeSound()
    const orderToSave = {
      orderId: `SS-${Date.now().toString().slice(-6)}`,
      customerName: newOrder.customerName.trim(),
      whatsapp: newOrder.whatsapp.replace(/\D/g, '').slice(-10),
      email: newOrder.email.trim(),
      product: newOrder.product,
      amount: Number(newOrder.amount) || 99,
      utr: newOrder.utr.trim() || `MANUAL-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      driveLink: newOrder.driveLink || content?.site?.driveLink,
      status: 'Delivered',
    }

    const next = [orderToSave, ...orders]
    persistOrders(next)
    setModalOpen(false)
    setNewOrder({
      customerName: '',
      whatsapp: '',
      email: '',
      product: "World's Biggest Editing Bundle",
      amount: 99,
      utr: '',
      driveLink: content?.site?.driveLink || 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
    })

    // Prompt to open WhatsApp directly with link
    if (window.confirm('Order logged! Open WhatsApp to send VIP access link to this customer now?')) {
      const waUrl = buildWhatsAppDeliveryUrl(orderToSave, orderToSave.driveLink)
      window.open(waUrl, '_blank')
    }
  }

  const handleDeleteOrder = (orderId) => {
    if (!window.confirm(`Delete order ${orderId}? This cannot be undone.`)) return
    const next = orders.filter((o) => o.orderId !== orderId)
    persistOrders(next)
  }

  const handleResendWhatsApp = async (ord) => {
    playClickSound()
    const res = await sendWhatsAppDelivery(ord, content?.site?.automation?.whatsapp)
    if (res.success) {
      alert(`✓ Automated WhatsApp message sent to +91 ${ord.whatsapp}!`)
    } else {
      // Fallback direct WhatsApp link targeted to customer
      const waUrl = buildWhatsAppDeliveryUrl(ord, ord.driveLink || content?.site?.driveLink)
      window.open(waUrl, '_blank')
    }
  }

  const handleResendEmail = async (ord) => {
    if (!ord.email) {
      alert('⚠️ No email recorded for this customer.')
      return
    }
    playClickSound()
    const res = await sendEmailReceipt(ord, content?.site?.automation?.email)
    if (res.success) {
      alert(`✓ Official receipt & Drive link emailed to ${ord.email}!`)
    } else {
      alert(`⚠️ Email delivery failed: ${res.message || res.reason}\nPlease check Resend API key in Site Settings.`)
    }
  }

  const handleExportCsv = () => {
    playClickSound()
    if (orders.length === 0) return
    const headers = ['Order ID', 'Customer Name', 'WhatsApp', 'Email', 'Product', 'Amount (INR)', 'UTR', 'Date', 'Status']
    const rows = orders.map((o) => [
      o.orderId,
      `"${o.customerName || ''}"`,
      `"${o.whatsapp || ''}"`,
      `"${o.email || ''}"`,
      `"${o.product || ''}"`,
      o.amount,
      `"${o.utr || ''}"`,
      o.date,
      o.status || 'Delivered',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `sanshift_orders_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Orders &amp; Revenue CRM
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Real-time Direct UPI orders, UTR verification, and automated Google Drive deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-mono font-bold text-white transition-all cursor-pointer"
          >
            📥 Export CSV
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark active:scale-95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all cursor-pointer"
          >
            + Log Manual Order
          </button>
        </div>
      </div>

      {/* Financial KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Total Revenue
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {formatPrice(totalRevenue)}
          </p>
          <span className="text-[10px] font-mono text-emerald-500/80 mt-1 block">
            ✓ 0% Gateway Commission Lost
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Total Orders
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-brand-blue mt-1">
            {orders.length}
          </p>
          <span className="text-[10px] font-mono text-white/40 mt-1 block">
            Direct UPI &amp; App Unlocks
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Average Order Value
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-brand-yellow mt-1">
            {formatPrice(avgOrderValue)}
          </p>
          <span className="text-[10px] font-mono text-white/40 mt-1 block">
            Per Creator Transaction
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Auto-Delivery Rate
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-purple-400 mt-1">
            100%
          </p>
          <span className="text-[10px] font-mono text-purple-400/80 mt-1 block">
            Instant Google Drive Link Access
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/40">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Customer, UTR, Order ID, Phone..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-9 py-2 text-xs font-sans text-white placeholder:text-white/40 focus:border-brand-blue focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-white/80 focus:border-brand-blue focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0c101c]">All Products</option>
            {content.products.map((p) => (
              <option key={p.id} value={p.name} className="bg-[#0c101c]">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0c101c] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono text-[11px] uppercase">
                <th className="py-3 px-4">Order ID &amp; Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">UTR Ref</th>
                <th className="py-3 px-4">Drive Access</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-white/[0.02] transition-colors">
                  {/* Order ID & Date */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-brand-blue block">
                      {ord.orderId}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {ord.date ? new Date(ord.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </span>
                  </td>

                  {/* Customer details */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">
                      {ord.customerName}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`https://wa.me/91${ord.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                        title="Open WhatsApp Chat"
                      >
                        <span>💬 +91 {ord.whatsapp}</span>
                      </a>
                    </div>
                    {ord.email && (
                      <span className="text-[10px] font-mono text-white/40 block truncate max-w-[160px]">
                        {ord.email}
                      </span>
                    )}
                  </td>

                  {/* Product */}
                  <td className="py-3.5 px-4">
                    <span className="text-white/80 font-medium block max-w-xs truncate">
                      {ord.product}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <span className="font-display font-black text-sm text-emerald-400">
                      {formatPrice(ord.amount)}
                    </span>
                  </td>

                  {/* UTR */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {ord.utr || 'AUTO-APP'}
                    </span>
                  </td>

                  {/* Drive status */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                      <span>✓</span> Unlocked
                    </span>
                  </td>

                  {/* Quick actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleResendWhatsApp(ord)}
                        title="Resend WhatsApp Access Message"
                        className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-2.5 py-1 text-[11px] font-mono font-bold transition-all cursor-pointer"
                      >
                        📲 WA
                      </button>
                      {ord.email && (
                        <button
                          type="button"
                          onClick={() => handleResendEmail(ord)}
                          title="Resend Email Receipt"
                          className="rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 text-cyan-400 px-2.5 py-1 text-[11px] font-mono font-bold transition-all cursor-pointer"
                        >
                          ✉️ Email
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(ord.orderId)}
                        title="Delete Order"
                        className="rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 px-2 py-1 text-[11px] font-mono transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40 font-mono">
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Order Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0c101c] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-lg font-black text-white uppercase">
                Log Offline / Manual UPI Order
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  placeholder="e.g. Vignesh Kumar"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  WhatsApp Number (10 digits) *
                </label>
                <input
                  type="tel"
                  required
                  value={newOrder.whatsapp}
                  onChange={(e) => setNewOrder({ ...newOrder, whatsapp: e.target.value })}
                  placeholder="e.g. 9840123456"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={newOrder.email}
                  onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                  placeholder="customer@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                    Product
                  </label>
                  <select
                    value={newOrder.product}
                    onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0c101c] px-3 py-2 text-xs text-white focus:border-brand-blue focus:outline-none cursor-pointer"
                  >
                    {content.products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newOrder.amount}
                    onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  UPI UTR / Reference No.
                </label>
                <input
                  type="text"
                  value={newOrder.utr}
                  onChange={(e) => setNewOrder({ ...newOrder, utr: e.target.value })}
                  placeholder="e.g. 429184029184"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-mono text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-blue/30 cursor-pointer"
                >
                  Save &amp; Send Link →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
