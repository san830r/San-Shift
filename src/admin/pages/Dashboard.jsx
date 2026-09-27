import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../../content/ContentContext'
import { useCurrency } from '../../content/CurrencyContext'
import {
  sendWhatsAppDelivery,
  sendEmailReceipt,
  buildWhatsAppDeliveryUrl,
} from '../../lib/deliveryService'
import { playClickSound } from '../../lib/soundFx'

export default function Dashboard() {
  const { content } = useContent()
  const { formatPrice } = useCurrency()

  // Load orders
  const orders = useMemo(() => {
    let local = []
    try {
      local = JSON.parse(localStorage.getItem('sanshift_orders') || 'null')
    } catch {
      local = null
    }
    const cloud = Array.isArray(content?.site?.orders) ? content.site.orders : []
    const combined = [...(local || []), ...cloud]
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

  // Load leads
  const leads = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sanshift_leads') || 'null')
      return stored && Array.isArray(stored) ? stored : []
    } catch {
      return []
    }
  }, [])

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
  const availableProducts = content.products.filter((p) => p.available).length
  const newLeadsCount = leads.filter((l) => l.status === 'New').length

  const handleResendWhatsApp = async (ord) => {
    playClickSound()
    const res = await sendWhatsAppDelivery(ord, content?.site?.automation?.whatsapp)
    if (res.success) {
      alert(`✓ Automated WhatsApp message sent to +91 ${ord.whatsapp}!`)
    } else {
      const waUrl = buildWhatsAppDeliveryUrl(ord, ord.driveLink || content?.site?.driveLink)
      window.open(waUrl, '_blank')
    }
  }

  const handleResendEmail = async (ord) => {
    if (!ord.email) {
      alert('⚠️ No email recorded for this order.')
      return
    }
    playClickSound()
    const res = await sendEmailReceipt(ord, content?.site?.automation?.email)
    if (res.success) {
      alert(`✓ Official receipt & Drive link emailed to ${ord.email}!`)
    } else {
      alert(`⚠️ Email delivery failed: ${res.message || res.reason}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold uppercase mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>EXECUTIVE COMMAND CENTER // LIVE PRODUCTION</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
            SAN SHIFT <span className="text-brand-blue">HEADQUARTERS</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50 font-sans">
            Real-time direct UPI revenue, Google Drive instant deliveries, client leads, and digital inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark active:scale-95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all"
          >
            + Add Product
          </Link>
          <a
            href="/catalog"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5"
          >
            <span>Live Catalog</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Direct UPI Revenue
          </span>
          <p className="font-display text-3xl sm:text-4xl font-black text-emerald-400 mt-2">
            {formatPrice(totalRevenue)}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-white/5 pt-2">
            <span className="text-white/40">Zero Gateway Cuts</span>
            <span className="text-emerald-400 font-bold">100% In Bank</span>
          </div>
        </div>

        {/* Paid Orders */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Paid Creator Orders
          </span>
          <p className="font-display text-3xl sm:text-4xl font-black text-brand-blue mt-2">
            {orders.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-white/5 pt-2">
            <span className="text-white/40">Instant Drive Deliveries</span>
            <Link to="/admin/orders" className="text-brand-blue hover:underline font-bold">
              View All →
            </Link>
          </div>
        </div>

        {/* Client Inquiries */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Agency Client Leads
          </span>
          <p className="font-display text-3xl sm:text-4xl font-black text-amber-400 mt-2">
            {leads.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-white/5 pt-2">
            <span className="text-amber-400/90 font-bold">{newLeadsCount} New to Reply</span>
            <Link to="/admin/leads" className="text-amber-400 hover:underline font-bold">
              Open CRM →
            </Link>
          </div>
        </div>

        {/* Total Assets / Catalog */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Active Digital Packs
          </span>
          <p className="font-display text-3xl sm:text-4xl font-black text-purple-400 mt-2">
            {availableProducts}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-white/5 pt-2">
            <span className="text-white/40">In 55M+ Master Vault</span>
            <Link to="/admin/products" className="text-purple-400 hover:underline font-bold">
              Manage →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Command Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          to="/admin/products"
          className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 text-center hover:border-brand-blue/50 hover:bg-white/[0.02] transition-all group"
        >
          <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">📦</span>
          <span className="font-display font-bold text-xs text-white uppercase block">
            Products
          </span>
          <span className="text-[10px] font-mono text-white/40">
            {content.products.length} Packs
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 text-center hover:border-brand-blue/50 hover:bg-white/[0.02] transition-all group"
        >
          <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">💰</span>
          <span className="font-display font-bold text-xs text-white uppercase block">
            Orders CRM
          </span>
          <span className="text-[10px] font-mono text-white/40">
            {orders.length} Transactions
          </span>
        </Link>

        <Link
          to="/admin/leads"
          className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 text-center hover:border-brand-blue/50 hover:bg-white/[0.02] transition-all group"
        >
          <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">🎯</span>
          <span className="font-display font-bold text-xs text-white uppercase block">
            Client Leads
          </span>
          <span className="text-[10px] font-mono text-amber-400">
            {leads.length} Inquiries
          </span>
        </Link>

        <Link
          to="/admin/vaults"
          className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 text-center hover:border-brand-blue/50 hover:bg-white/[0.02] transition-all group"
        >
          <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">📁</span>
          <span className="font-display font-bold text-xs text-white uppercase block">
            Vault Folders
          </span>
          <span className="text-[10px] font-mono text-white/40">
            {content.whatsInside?.length || 36} Sub-packs
          </span>
        </Link>

        <Link
          to="/admin/settings"
          className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 text-center hover:border-brand-blue/50 hover:bg-white/[0.02] transition-all group"
        >
          <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">⚡</span>
          <span className="font-display font-bold text-xs text-white uppercase block">
            UPI &amp; Bots
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            Automation Ready
          </span>
        </Link>

        <Link
          to="/admin/data"
          className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 text-center hover:border-brand-blue/50 hover:bg-white/[0.02] transition-all group"
        >
          <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">💾</span>
          <span className="font-display font-bold text-xs text-white uppercase block">
            Backup &amp; Sync
          </span>
          <span className="text-[10px] font-mono text-white/40">
            Cloud JSON
          </span>
        </Link>
      </div>

      {/* Two Column Layout: Recent Orders & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
        {/* Left Column: Recent Orders */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-display text-lg font-black text-white uppercase tracking-tight">
                Recent Orders &amp; Drive Deliveries
              </h2>
              <span className="text-[11px] font-mono text-white/40">
                Latest transactions verified via direct UPI
              </span>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-mono font-bold text-brand-blue hover:underline"
            >
              View Full CRM →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((ord) => (
              <div
                key={ord.orderId}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center justify-between gap-3 hover:border-brand-blue/30 transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-white truncate">
                      {ord.customerName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
                      ✓ Delivered
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-white/50">
                    <span className="truncate max-w-[180px]">{ord.product}</span>
                    <span>•</span>
                    <a
                      href={`https://wa.me/91${ord.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] text-emerald-400 hover:underline"
                    >
                      +91 {ord.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-display font-black text-sm text-white">
                    {formatPrice(ord.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleResendWhatsApp(ord)}
                    title="Resend WhatsApp Link"
                    className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 p-1.5 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    💬 WA
                  </button>
                  {ord.email && (
                    <button
                      type="button"
                      onClick={() => handleResendEmail(ord)}
                      title="Resend Email"
                      className="rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 text-cyan-400 p-1.5 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      ✉️
                    </button>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <p className="text-center py-8 text-xs font-mono text-white/40">
                No orders logged yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Recent Client Leads */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-display text-lg font-black text-white uppercase tracking-tight">
                Recent Client Leads
              </h2>
              <span className="text-[11px] font-mono text-white/40">
                Agency video inquiries waiting for reply
              </span>
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-mono font-bold text-amber-400 hover:underline"
            >
              Open Pipeline →
            </Link>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1.5 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-white">
                    {lead.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold ${
                      lead.status === 'New'
                        ? 'bg-amber-500/20 text-amber-400'
                        : lead.status === 'Converted'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-brand-blue/20 text-cyan-400'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-white/60 truncate font-sans">
                  {lead.service}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-brand-yellow font-bold">{lead.budget}</span>
                  <a
                    href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name}! This is Naveen from SAN SHIFT regarding your video editing inquiry.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>💬 Chat on WA</span>
                  </a>
                </div>
              </div>
            ))}

            {leads.length === 0 && (
              <p className="text-center py-8 text-xs font-mono text-white/40">
                No client leads yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
