import { useState, useMemo } from 'react'
import { playClickSound, playChimeSound } from '../../lib/soundFx'

const INITIAL_DEMO_LEADS = [
  {
    id: 'LEAD-104',
    name: 'Rahul Sharma',
    phone: '9841077665',
    email: 'rahul@brandpulse.in',
    service: 'Commercial Reels & Brand Growth',
    budget: '₹25,000 - ₹50,000',
    message: 'Need 10 high-retention cinematic reels per month for our e-commerce clothing brand.',
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'New',
  },
  {
    id: 'LEAD-103',
    name: 'Dinesh V',
    phone: '9444122334',
    email: 'dinesh@growthmedia.com',
    service: 'Full YouTube Production & Editing',
    budget: '₹15,000 - ₹30,000',
    message: 'Looking for a long-term video editor for our business podcast channel. Need pacing like Ali Abdaal.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'In Discussion',
  },
  {
    id: 'LEAD-102',
    name: 'Ananya S',
    phone: '9790844556',
    email: 'ananya.design@studio.com',
    service: '3D Motion Graphics & Animation',
    budget: '₹40,000+',
    message: 'Need high-end 3D product animation teaser for our luxury perfume brand launch.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    status: 'Converted',
  },
]

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Commercial Reels & Social Content',
    budget: '',
    message: '',
  })

  // Load leads from localStorage or default
  const [leads, setLeads] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sanshift_leads') || 'null')
      return stored && Array.isArray(stored) && stored.length > 0 ? stored : INITIAL_DEMO_LEADS
    } catch {
      return INITIAL_DEMO_LEADS
    }
  })

  const persistLeads = (nextLeads) => {
    setLeads(nextLeads)
    localStorage.setItem('sanshift_leads', JSON.stringify(nextLeads))
  }

  const filteredLeads = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return leads.filter((l) => {
      const matchSearch =
        !q ||
        l.name?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.service?.toLowerCase().includes(q) ||
        l.message?.toLowerCase().includes(q)

      if (!matchSearch) return false

      if (statusFilter !== 'all' && l.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [leads, searchQuery, statusFilter])

  const handleStatusChange = (id, newStatus) => {
    playClickSound()
    const next = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    persistLeads(next)
  }

  const handleDeleteLead = (id) => {
    if (!window.confirm('Delete this client lead?')) return
    const next = leads.filter((l) => l.id !== id)
    persistLeads(next)
  }

  const handleAddManualLead = (e) => {
    e.preventDefault()
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      alert('Client Name and Phone are required.')
      return
    }

    playChimeSound()
    const leadToSave = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: newLead.name.trim(),
      phone: newLead.phone.replace(/\D/g, '').slice(-10),
      email: newLead.email.trim(),
      service: newLead.service,
      budget: newLead.budget || 'Custom Quote',
      message: newLead.message || 'Direct lead captured via WhatsApp / DM.',
      date: new Date().toISOString(),
      status: 'New',
    }

    const next = [leadToSave, ...leads]
    persistLeads(next)
    setModalOpen(false)
    setNewLead({
      name: '',
      phone: '',
      email: '',
      service: 'Commercial Reels & Social Content',
      budget: '',
      message: '',
    })
  }

  const handleWhatsAppChat = (lead) => {
    playClickSound()
    const text = encodeURIComponent(
      `Hi ${lead.name}! 👋 This is Naveen from SAN SHIFT.\n\nThank you for reaching out regarding your project: *${lead.service}*.\n\nCould you please share a few reference videos or your timeline so we can discuss the best approach?`
    )
    window.open(`https://wa.me/91${lead.phone}?text=${text}`, '_blank')
  }

  const newCount = leads.filter((l) => l.status === 'New').length
  const inDiscussionCount = leads.filter((l) => l.status === 'In Discussion').length
  const convertedCount = leads.filter((l) => l.status === 'Converted').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Client Inquiries &amp; Leads
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            High-value agency leads for video editing, commercial reels, and brand marketing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark active:scale-95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          + Add New Lead / DM
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Total Inquiries
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
            {leads.length}
          </p>
          <span className="text-[10px] font-mono text-white/40 mt-1 block">
            Website &amp; WhatsApp Briefs
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            New Leads (Action Needed)
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-amber-400 mt-1">
            {newCount}
          </p>
          <span className="text-[10px] font-mono text-amber-500/80 mt-1 block">
            Waiting for Reply
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            In Discussion
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-brand-blue mt-1">
            {inDiscussionCount}
          </p>
          <span className="text-[10px] font-mono text-white/40 mt-1 block">
            Pricing / Timeline Shared
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-5 shadow-lg">
          <span className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block">
            Deals Converted
          </span>
          <p className="font-display text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {convertedCount}
          </p>
          <span className="text-[10px] font-mono text-emerald-400/80 mt-1 block">
            Paid Retainer Clients
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/40">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by Client Name, Phone, Service..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-white/80 focus:border-brand-blue focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0c101c]">All Statuses</option>
            <option value="New" className="bg-[#0c101c]">New</option>
            <option value="In Discussion" className="bg-[#0c101c]">In Discussion</option>
            <option value="Converted" className="bg-[#0c101c]">Converted</option>
            <option value="Archived" className="bg-[#0c101c]">Archived</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0c101c] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono text-[11px] uppercase">
                <th className="py-3 px-4">Lead ID &amp; Date</th>
                <th className="py-3 px-4">Client Contact</th>
                <th className="py-3 px-4">Service Required</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Message / Brief</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-brand-blue block">
                      {lead.id}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {lead.date ? new Date(lead.date).toLocaleDateString('en-IN') : '—'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">
                      {lead.name}
                    </span>
                    <a
                      href={`https://wa.me/91${lead.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      💬 +91 {lead.phone}
                    </a>
                    {lead.email && (
                      <span className="text-[10px] font-mono text-white/40 block truncate max-w-[150px]">
                        {lead.email}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white/90 block max-w-xs">
                      {lead.service}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-brand-yellow font-bold">
                      {lead.budget || 'Custom Quote'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-white/60 line-clamp-2 max-w-xs font-sans text-xs">
                      {lead.message || '—'}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold border focus:outline-none cursor-pointer ${
                        lead.status === 'New'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                          : lead.status === 'Converted'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : lead.status === 'In Discussion'
                          ? 'bg-brand-blue/15 border-brand-blue/40 text-cyan-400'
                          : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      <option value="New" className="bg-[#0c101c] text-white">New</option>
                      <option value="In Discussion" className="bg-[#0c101c] text-white">In Discussion</option>
                      <option value="Converted" className="bg-[#0c101c] text-white">Converted</option>
                      <option value="Archived" className="bg-[#0c101c] text-white">Archived</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppChat(lead)}
                        className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        💬 Reply WA
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLead(lead.id)}
                        className="rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 px-2 py-1.5 text-xs font-mono transition-all cursor-pointer"
                        title="Delete Lead"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40 font-mono">
                    No client leads match this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Lead Logging Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0c101c] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-lg font-black text-white uppercase">
                Add Client Lead / DM Inquiry
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualLead} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Client / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="e.g. John Doe / Brand Name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
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
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="client@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Service Needed
                </label>
                <select
                  value={newLead.service}
                  onChange={(e) => setNewLead({ ...newLead, service: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0c101c] px-3 py-2 text-xs text-white focus:border-brand-blue focus:outline-none cursor-pointer"
                >
                  <option value="Commercial Reels & Social Content">Commercial Reels &amp; Social Content</option>
                  <option value="Full YouTube Video Editing">Full YouTube Video Editing</option>
                  <option value="3D Motion Graphics & Animation">3D Motion Graphics &amp; Animation</option>
                  <option value="Complete Brand Identity & Marketing">Complete Brand Identity &amp; Marketing</option>
                  <option value="Custom Digital Asset Bundle">Custom Digital Asset Bundle</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Budget Expectation
                </label>
                <input
                  type="text"
                  value={newLead.budget}
                  onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                  placeholder="e.g. ₹20,000 / month"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1">
                  Message / Requirements
                </label>
                <textarea
                  rows={3}
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  placeholder="Details about client needs, deadline, etc."
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
                  Save Lead →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
