import { useState } from 'react'
import { useContent } from '../../content/ContentContext'
import { Field, TextInput, TextArea, Select, Toggle, SaveBar } from '../components/Fields'
import BackLink from '../components/BackLink'
import { DEFAULT_INSTAGRAM_REELS } from '../../content/instagramFeed'
import { sendWhatsAppDelivery, sendEmailReceipt } from '../../lib/deliveryService'

export default function Settings() {
  const { content, updateContent } = useContent()
  const [site, setSite] = useState(content.site)
  const [saved, setSaved] = useState(false)

  // Current list of custom reels or studio default reels
  const activeReels =
    Array.isArray(site.customReels) && site.customReels.length > 0
      ? site.customReels
      : DEFAULT_INSTAGRAM_REELS

  const set = (path) => (value) => {
    setSite((prev) => {
      const next = { ...prev }
      let cursor = next
      const keys = path.split('.')
      for (let i = 0; i < keys.length - 1; i += 1) {
        cursor[keys[i]] = { ...cursor[keys[i]] }
        cursor = cursor[keys[i]]
      }
      cursor[keys[keys.length - 1]] = value
      return next
    })
  }

  const handleUpdateReel = (index, key, value) => {
    const nextList = [...activeReels]
    nextList[index] = { ...nextList[index], [key]: value }
    setSite((prev) => ({ ...prev, customReels: nextList }))
  }

  const handleFileUploadForReel = (index, file) => {
    if (!file) return
    const isImg = file.type.startsWith('image/')
    const url = URL.createObjectURL(file)
    const nextList = [...activeReels]
    nextList[index] = {
      ...nextList[index],
      videoUrl: url,
      imageUrl: isImg ? url : nextList[index].imageUrl,
      mediaType: isImg ? 'IMAGE' : 'VIDEO',
      title: nextList[index].title || file.name.replace(/\.[^/.]+$/, ''),
    }
    setSite((prev) => ({ ...prev, customReels: nextList }))
  }

  const handleAddReel = () => {
    const newReel = {
      id: `sanshift-custom-${Date.now()}`,
      title: 'New SAN SHIFT Post',
      tag: 'NEW DROP',
      mediaType: 'VIDEO',
      videoUrl: DEFAULT_INSTAGRAM_REELS[0].videoUrl,
      imageUrl: '',
      instagramUrl: 'https://www.instagram.com/sanshift',
      views: '1.2M',
      likes: '15.4K',
      comments: '840',
      caption: 'Creative video showcase by SAN SHIFT. Designed to stop the scroll.',
      audioTrack: 'sanshift • Original Audio',
      postedTime: 'Just now',
    }
    const nextList = [newReel, ...activeReels]
    setSite((prev) => ({ ...prev, customReels: nextList }))
  }

  const handleRemoveReel = (index) => {
    const nextList = activeReels.filter((_, i) => i !== index)
    setSite((prev) => ({ ...prev, customReels: nextList }))
  }

  const handleResetReelsToDefault = () => {
    if (window.confirm('Reset reels list to studio default playlist?')) {
      setSite((prev) => ({ ...prev, customReels: DEFAULT_INSTAGRAM_REELS }))
    }
  }

  const [testingWa, setTestingWa] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)

  const handleTestWhatsApp = async () => {
    const testNum = prompt('Enter 10-digit WhatsApp number to test:', '7339467830')
    if (!testNum) return
    setTestingWa(true)
    const res = await sendWhatsAppDelivery(
      {
        customerName: 'Admin Test',
        whatsapp: testNum,
        orderId: 'TEST-001',
        amount: 99,
        product: "World's Biggest Editing Bundle",
        driveLink: site.driveLink || 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
      },
      site.automation?.whatsapp
    )
    setTestingWa(false)
    if (res.success) {
      alert('✓ Test WhatsApp message sent successfully!')
    } else {
      alert(`⚠️ WhatsApp test failed: ${res.message || res.reason}\nCheck your Instance ID and Token.`)
    }
  }

  const handleTestEmail = async () => {
    const testMail = prompt('Enter Email address to receive test receipt:', 'hello.sanshift@gmail.com')
    if (!testMail) return
    setTestingEmail(true)
    const res = await sendEmailReceipt(
      {
        customerName: 'Admin Test',
        email: testMail,
        orderId: 'TEST-001',
        amount: 99,
        product: "World's Biggest Editing Bundle",
        driveLink: site.driveLink || 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
      },
      site.automation?.email
    )
    setTestingEmail(false)
    if (res.success) {
      alert('✓ Test Email receipt sent successfully!')
    } else {
      alert(`⚠️ Email test failed: ${res.message || res.reason}\nCheck your Resend API Key.`)
    }
  }

  const save = () => {
    updateContent('site', site)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Generate live UPI link for preview
  const liveUpiId = site.upiId || 'naveen2006sk-1@oksbi'
  const livePayee = encodeURIComponent(site.payeeName || 'SAN SHIFT')
  const qrString = `upi://pay?pa=${liveUpiId}&pn=${livePayee}&am=99&cu=INR&tn=SAN%20SHIFT%20Vault`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrString)}&margin=4`

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            UPI, Automation &amp; Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Control direct UPI payments, Green-API WhatsApp delivery, Resend receipts, contact info, and Instagram feed.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Payments & Instant Vault */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-display text-lg font-black text-white uppercase tracking-tight">
                Direct UPI Gateway &amp; Drive Vault
              </h2>
              <p className="text-xs text-white/50">
                0% commission direct bank transfer via GPay, PhonePe, Paytm, BHIM.
              </p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-mono font-bold ${
              (site.checkoutMode || 'whatsapp') === 'whatsapp'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-brand-blue/10 text-brand-blue border-brand-blue/30'
            }`}>
              {(site.checkoutMode || 'whatsapp') === 'whatsapp'
                ? '💬 WhatsApp Chat to Buy Active'
                : '⚡ Direct UPI Auto-Checkout Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 items-center">
            <div className="space-y-4">
              <Field
                label="Customer Checkout Route (WhatsApp vs Automated UPI)"
                hint="WhatsApp Chat to Buy routes orders to your personal WhatsApp (+91 73394 67830). Direct UPI enables on-site QR & auto-radar verification."
              >
                <Select
                  value={site.checkoutMode || 'whatsapp'}
                  onChange={set('checkoutMode')}
                  options={[
                    {
                      value: 'whatsapp',
                      label: '💬 WhatsApp Chat to Buy (Active — Chat with Naveen to buy & receive Drive link)',
                    },
                    {
                      value: 'direct_upi',
                      label: '⚡ Direct UPI Instant Checkout (Automated on-site QR & auto-radar verification)',
                    },
                  ]}
                />
              </Field>

              <Field
                label="UPI ID (VPA) for Direct Bank Credit"
                hint="Payments via GPay, PhonePe, Paytm QR go directly to this UPI ID without any gateway cut."
              >
                <TextInput
                  value={site.upiId || 'naveen2006sk-1@oksbi'}
                  onChange={set('upiId')}
                  placeholder="yourname@upi"
                />
              </Field>

              <Field label="Payee Name" hint="Name displayed on the GPay / PhonePe payment screen.">
                <TextInput
                  value={site.payeeName || 'SAN SHIFT'}
                  onChange={set('payeeName')}
                  placeholder="SAN SHIFT"
                />
              </Field>

              <Field
                label="Master Google Drive VIP Download Link"
                hint="Delivered automatically on-screen and via WhatsApp immediately upon verified payment."
              >
                <TextInput
                  value={site.driveLink || 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc'}
                  onChange={set('driveLink')}
                  placeholder="https://drive.google.com/drive/folders/..."
                />
              </Field>

              <Field label="Featured Product" hint="Which product shows in the homepage Featured Product hero.">
                <Select
                  value={site.featuredProductId}
                  onChange={set('featuredProductId')}
                  options={content.products.map((p) => p.id)}
                />
              </Field>
            </div>

            {/* Live QR Code Preview */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono text-white/50 uppercase mb-2">
                Live Dynamic UPI QR Preview
              </span>
              <img
                src={qrUrl}
                alt="UPI QR Code"
                className="h-36 w-36 rounded-xl bg-white p-1 shadow-lg"
              />
              <span className="text-[11px] font-mono text-brand-yellow font-bold mt-2">
                {site.upiId || 'naveen2006sk-1@oksbi'}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                Direct to {site.payeeName || 'SAN SHIFT'}
              </span>
            </div>
          </div>
        </div>

        {/* Automated WhatsApp & Email Instant Delivery Engine */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-display text-lg font-black text-white uppercase tracking-tight">
                🤖 Automated Instant Delivery Engine (WhatsApp + Email)
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Automatically deliver Google Drive VIP links &amp; official receipts to customers immediately upon payment.
              </p>
            </div>
            <span className="rounded-full bg-brand-blue/15 text-brand-blue border border-brand-blue/30 px-3 py-1 text-xs font-mono font-bold">
              Zero Manual Work
            </span>
          </div>

          {/* WhatsApp Automation Section */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📲</span>
                <h3 className="font-display text-sm font-black text-white uppercase tracking-wide">
                  Automated WhatsApp Delivery (Green-API)
                </h3>
              </div>
              <Toggle
                checked={site.automation?.whatsapp?.enabled ?? true}
                onChange={(val) => set('automation.whatsapp.enabled')(val)}
                label="Enable"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Provider"
                hint="Green-API (connects your phone), UltraMsg, Meta Cloud API, or Webhook"
              >
                <Select
                  value={site.automation?.whatsapp?.provider || 'green-api'}
                  onChange={set('automation.whatsapp.provider')}
                  options={['green-api', 'ultramsg', 'meta', 'webhook']}
                />
              </Field>

              <Field
                label={
                  site.automation?.whatsapp?.provider === 'meta'
                    ? 'Phone Number ID'
                    : site.automation?.whatsapp?.provider === 'webhook'
                    ? 'Webhook Label / Mode'
                    : 'Instance ID'
                }
                hint={
                  site.automation?.whatsapp?.provider === 'meta'
                    ? 'From Meta WhatsApp App -> API Setup -> Phone number ID'
                    : site.automation?.whatsapp?.provider === 'ultramsg'
                    ? 'From UltraMsg console (e.g. instance12345)'
                    : site.automation?.whatsapp?.provider === 'webhook'
                    ? 'Optional identifier'
                    : 'From your Green API dashboard (idInstance)'
                }
              >
                <TextInput
                  value={site.automation?.whatsapp?.instanceId || ''}
                  onChange={set('automation.whatsapp.instanceId')}
                  placeholder={
                    site.automation?.whatsapp?.provider === 'meta'
                      ? 'e.g. 109283746592019'
                      : site.automation?.whatsapp?.provider === 'ultramsg'
                      ? 'e.g. instance98432'
                      : 'e.g. 7103859214'
                  }
                />
              </Field>
            </div>

            <Field
              label={
                site.automation?.whatsapp?.provider === 'webhook'
                  ? 'Webhook Endpoint URL'
                  : site.automation?.whatsapp?.provider === 'meta'
                  ? 'Meta Permanent System User Token'
                  : 'API Token / Secret Key'
              }
              hint={
                site.automation?.whatsapp?.provider === 'webhook'
                  ? 'Zapier / Make / n8n / Pabbly webhook URL'
                  : site.automation?.whatsapp?.provider === 'meta'
                  ? 'Bearer Token from Meta Business Manager'
                  : 'apiTokenInstance from provider dashboard'
              }
            >
              <TextInput
                type={site.automation?.whatsapp?.provider === 'webhook' ? 'text' : 'password'}
                value={site.automation?.whatsapp?.apiToken || ''}
                onChange={set('automation.whatsapp.apiToken')}
                placeholder={
                  site.automation?.whatsapp?.provider === 'webhook'
                    ? 'https://hook.eu1.make.com/...'
                    : 'Paste your API token here'
                }
              />
            </Field>

            <Field
              label="WhatsApp Message Template"
              hint="Available tags: {name}, {orderId}, {amount}, {productName}, {driveLink}"
            >
              <TextArea
                rows={6}
                value={site.automation?.whatsapp?.messageTemplate || ''}
                onChange={set('automation.whatsapp.messageTemplate')}
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="text-[11px] text-white/50 space-y-1 max-w-lg">
                <p>
                  💡 <strong>Automatic Zero-Click Delivery:</strong> Sign up for free on{' '}
                  <a
                    href="https://green-api.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline font-bold"
                  >
                    green-api.com
                  </a>
                  , scan the QR code with WhatsApp on your phone (+91 73394 67830), and paste your Instance ID &amp; Token above.
                </p>
                <p className="text-white/40">
                  ⚡ <strong>Universal 1-Tap Fallback:</strong> If no bot credentials are set, the checkout success screen and admin orders allow 1-tap WhatsApp delivery directly to the buyer from any phone!
                </p>
              </div>
              <button
                type="button"
                onClick={handleTestWhatsApp}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                {testingWa ? 'Sending...' : 'Test WhatsApp Bot'}
              </button>
            </div>
          </div>

          {/* Email Automation Section */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">✉️</span>
                <h3 className="font-display text-sm font-black text-white uppercase tracking-wide">
                  Automated Email Receipt &amp; Invoicing (Resend)
                </h3>
              </div>
              <Toggle
                checked={site.automation?.email?.enabled ?? true}
                onChange={(val) => set('automation.email.enabled')(val)}
                label="Enable"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Provider" hint="Resend (Recommended - 3,000 free emails/mo) or Webhook">
                <Select
                  value={site.automation?.email?.provider || 'resend'}
                  onChange={set('automation.email.provider')}
                  options={['resend', 'webhook']}
                />
              </Field>

              <Field label="Sender Email ('From')" hint="Verified sender or onboarding@resend.dev">
                <TextInput
                  value={site.automation?.email?.fromEmail || 'orders@sanshift.com'}
                  onChange={set('automation.email.fromEmail')}
                  placeholder="orders@sanshift.com"
                />
              </Field>
            </div>

            <Field label="Resend API Key" hint="Starts with re_ (Get free at resend.com)">
              <TextInput
                type="password"
                value={site.automation?.email?.apiKey || ''}
                onChange={set('automation.email.apiKey')}
                placeholder="re_xxxxxxxxxxxx"
              />
            </Field>

            <Field label="Email Subject Line" hint="Available tags: {productName}, {orderId}">
              <TextInput
                value={site.automation?.email?.subject || '🎉 Your VIP Access Pass & Official Receipt — {productName}'}
                onChange={set('automation.email.subject')}
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
              <div className="text-[11px] text-white/40">
                💡 Free Setup: Sign up on <strong>resend.com</strong>, grab API Key, paste it here. All buyers will get branded receipts!
              </div>
              <button
                type="button"
                onClick={handleTestEmail}
                className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white px-4 py-2 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                {testingEmail ? 'Sending...' : 'Test Email Receipt'}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <h2 className="font-display text-lg font-black text-white uppercase tracking-tight pb-2 border-b border-white/10">
            Agency Contact Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Field label="Email">
              <TextInput value={site.contact.email} onChange={set('contact.email')} />
            </Field>
            <Field label="Instagram Handle">
              <TextInput value={site.contact.instagram} onChange={set('contact.instagram')} />
            </Field>
            <Field label="YouTube Channel / Handle">
              <TextInput value={site.contact.youtube || '@SanShift'} onChange={set('contact.youtube')} />
            </Field>
            <Field label="Facebook Name">
              <TextInput value={site.contact.facebook} onChange={set('contact.facebook')} />
            </Field>
            <Field label="WhatsApp Display Number">
              <TextInput value={site.contact.whatsapp} onChange={set('contact.whatsapp')} />
            </Field>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <h2 className="font-display text-lg font-black text-white uppercase tracking-tight pb-2 border-b border-white/10">
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Facebook URL">
              <TextInput value={site.socials.facebook} onChange={set('socials.facebook')} />
            </Field>
            <Field label="Instagram URL">
              <TextInput value={site.socials.instagram} onChange={set('socials.instagram')} />
            </Field>
            <Field label="YouTube URL">
              <TextInput value={site.socials.youtube} onChange={set('socials.youtube')} />
            </Field>
            <Field label="WhatsApp Direct Link">
              <TextInput value={site.socials.whatsapp} onChange={set('socials.whatsapp')} />
            </Field>
          </div>
        </div>

        {/* Instagram Posts & Reels Management */}
        <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
            <div>
              <h2 className="font-display text-lg font-black text-white uppercase tracking-tight">
                Homepage Reels &amp; Showcase Carousel ({activeReels.length})
              </h2>
              <p className="mt-1 text-xs text-white/50">
                Manage your active Instagram showcase posts with video (.mp4) or photo (.png, .jpg) media.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetReelsToDefault}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white cursor-pointer"
              >
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleAddReel}
                className="rounded-xl bg-brand-blue px-4 py-1.5 text-xs font-mono font-bold text-white uppercase hover:bg-brand-blue-dark cursor-pointer shadow-sm"
              >
                + Add Post
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {activeReels.map((reel, index) => (
              <div
                key={reel.id || index}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 space-y-3 transition-colors hover:border-brand-blue/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-white text-xs font-mono font-bold">
                      {index + 1}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/80">
                      {reel.mediaType || 'VIDEO'} • {reel.tag}
                    </span>
                  </div>
                  {activeReels.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReel(index)}
                      className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer px-2 py-1"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-white/50 mb-1">
                      Post Title
                    </label>
                    <input
                      type="text"
                      value={reel.title || ''}
                      onChange={(e) => handleUpdateReel(index, 'title', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-brand-blue"
                      placeholder="Title"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-white/50 mb-1">
                      Category Tag (Badge)
                    </label>
                    <input
                      type="text"
                      value={reel.tag || ''}
                      onChange={(e) => handleUpdateReel(index, 'tag', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-brand-blue"
                      placeholder="e.g. VIRAL HOOK, COLOR GRADING"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-white/50 mb-1">
                      Instagram Post / Reel Link
                    </label>
                    <input
                      type="text"
                      value={reel.instagramUrl || ''}
                      onChange={(e) => handleUpdateReel(index, 'instagramUrl', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-brand-blue"
                      placeholder="https://www.instagram.com/reel/..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-white/50 mb-1">
                      Media Type
                    </label>
                    <select
                      value={reel.mediaType || 'VIDEO'}
                      onChange={(e) => handleUpdateReel(index, 'mediaType', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0c101c] px-3 py-2 text-xs text-white outline-none focus:border-brand-blue cursor-pointer"
                    >
                      <option value="VIDEO">Video (.mp4, reel)</option>
                      <option value="IMAGE">Photo / Graphic (.jpg, .png)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-white/50 mb-1">
                    Media File or Video URL
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={reel.videoUrl || reel.imageUrl || ''}
                      onChange={(e) => {
                        handleUpdateReel(index, 'videoUrl', e.target.value)
                        handleUpdateReel(index, 'imageUrl', e.target.value)
                      }}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white outline-none focus:border-brand-blue truncate"
                      placeholder="Video URL, Image URL, or upload file below"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-white hover:bg-white/10 cursor-pointer shrink-0">
                      <span>📁 Upload File</span>
                      <input
                        type="file"
                        accept="video/*,image/*"
                        className="hidden"
                        onChange={(e) => handleFileUploadForReel(index, e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-white/40 mb-0.5">
                      Views
                    </label>
                    <input
                      type="text"
                      value={reel.views || ''}
                      onChange={(e) => handleUpdateReel(index, 'views', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white"
                      placeholder="1.4M"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-white/40 mb-0.5">
                      Likes
                    </label>
                    <input
                      type="text"
                      value={reel.likes || ''}
                      onChange={(e) => handleUpdateReel(index, 'likes', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white"
                      placeholder="14.2K"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-white/40 mb-0.5">
                      Comments
                    </label>
                    <input
                      type="text"
                      value={reel.comments || ''}
                      onChange={(e) => handleUpdateReel(index, 'comments', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white"
                      placeholder="1,280"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-white/40 mb-0.5">
                      Posted Time
                    </label>
                    <input
                      type="text"
                      value={reel.postedTime || ''}
                      onChange={(e) => handleUpdateReel(index, 'postedTime', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white"
                      placeholder="2 days ago"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SaveBar saved={saved} onSave={save} />
    </div>
  )
}
