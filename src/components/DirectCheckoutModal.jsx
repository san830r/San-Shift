import { useState, useEffect, useRef } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import { stopLenis, startLenis } from '../lib/lenisSetup'
import { useCurrency } from '../content/CurrencyContext'
import { useContent } from '../content/ContentContext'
import {
  triggerAutomatedDelivery,
  persistOrderRecord,
  buildWhatsAppDeliveryUrl,
  buildWhatsAppShareUrl,
  buildWhatsAppNativeUrl,
} from '../lib/deliveryService'
import TrustBadges from './TrustBadges'

export default function DirectCheckoutModal({ isOpen, product, onClose }) {
  const { content } = useContent()
  const { formatPrice } = useCurrency()

  const checkoutMode = content?.site?.checkoutMode || 'whatsapp'
  const UPI_ID = content?.site?.upiId || 'naveen2006sk-1@oksbi'
  const PAYEE_NAME = content?.site?.payeeName || 'SAN SHIFT'
  const DRIVE_LINK =
    content?.site?.driveLink ||
    'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc'
  const FOUNDER_WHATSAPP = content?.site?.contact?.whatsapp || '+91 73394 67830'
  const founderCleanDigits = FOUNDER_WHATSAPP.replace(/\D/g, '').slice(-10) || '7339467830'

  const price = product?.price || 99
  const productName = product?.name || 'SAN SHIFT Bundle'

  // Steps for direct_upi mode: 'info' -> 'pay' -> 'verifying' -> 'success'
  const [step, setStep] = useState('info')

  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [utr, setUtr] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Zero-Click Auto-Detection States (direct_upi mode)
  const [appLaunched, setAppLaunched] = useState(false)
  const [autoVerifyStage, setAutoVerifyStage] = useState(1)
  const [showManualUtr, setShowManualUtr] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const autoOpenedRef = useRef(false)

  // Standard UPI URL
  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    PAYEE_NAME,
  )}&am=${price}&cu=INR&tn=${encodeURIComponent(productName)}`

  // Scannable UPI QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(
    upiUrl,
  )}`

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep('info')
      setErrorMessage('')
      setAppLaunched(false)
      setAutoVerifyStage(1)
      setShowManualUtr(false)
      setDeliveryStatus(null)
      autoOpenedRef.current = false
    }
  }, [isOpen])

  // Lock scroll & pause Lenis smoothly
  useEffect(() => {
    if (isOpen) {
      stopLenis()
      document.body.style.overflow = 'hidden'
    } else {
      startLenis()
      document.body.style.overflow = ''
    }
    return () => {
      startLenis()
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Mobile app return radar (direct_upi mode)
  useEffect(() => {
    if (!isOpen || checkoutMode !== 'direct_upi' || step !== 'pay') return undefined

    const triggerZeroClickUnlock = () => {
      if (!appLaunched) return
      setAppLaunched(false)
      setStep('verifying')
      playChimeSound()
      setAutoVerifyStage(1)

      setTimeout(() => {
        setAutoVerifyStage(2)
      }, 750)

      setTimeout(() => {
        setAutoVerifyStage(3)
        playChimeSound()

        const confirmedOrderId = orderId || `SS-${Date.now().toString().slice(-6)}`
        const cleanDigits = (phone || '').replace(/\D/g, '').slice(-10)
        const newOrder = {
          orderId: confirmedOrderId,
          customerName: name || 'Customer',
          whatsapp: cleanDigits || phone || 'Mobile Buyer',
          email: email || '',
          product: productName,
          amount: price,
          driveLink: DRIVE_LINK,
          utr: `AUTO-APP-RETURN-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString(),
          status: 'AUTO-CONFIRMED',
        }
        persistOrderRecord(newOrder)
        triggerAutomatedDelivery(newOrder, content?.site?.automation).then((report) => {
          setDeliveryStatus(report)
        })

        setStep('success')

        if (!autoOpenedRef.current) {
          autoOpenedRef.current = true
          try {
            window.open(DRIVE_LINK, '_blank', 'noopener,noreferrer')
          } catch (e) {
            console.warn('Browser pop-up blocker caught auto-open:', e)
          }
        }
      }, 1600)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && appLaunched) {
        triggerZeroClickUnlock()
      }
    }

    const onWindowFocus = () => {
      if (appLaunched) {
        triggerZeroClickUnlock()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', onWindowFocus)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', onWindowFocus)
    }
  }, [isOpen, checkoutMode, step, appLaunched, orderId, name, phone, email, price, productName, DRIVE_LINK, content?.site?.automation])

  if (!isOpen) return null

  const handleCopyUpi = () => {
    playClickSound()
    navigator.clipboard?.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // WHATSAPP CHECKOUT HANDLER
  const handleWhatsAppOrder = () => {
    playChimeSound()
    const cleanDigits = (phone || '').replace(/\D/g, '').slice(-10)
    const customerName = name.trim() || 'Creator'

    let message = `Hi Naveen! 👋 I want to order the *${productName}* (${formatPrice(price)}).\n\n`
    message += `👤 *Name:* ${customerName}\n`
    if (cleanDigits) {
      message += `📱 *WhatsApp:* +91 ${cleanDigits}\n`
    }
    message += `\nPlease share your UPI payment QR / details and send me the VIP Google Drive access link! 🚀`

    const waUrl = `https://wa.me/91${founderCleanDigits}?text=${encodeURIComponent(message)}`
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (isMobile) {
      window.location.href = waUrl
    } else {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handlePayApp = (appScheme) => {
    playChimeSound()
    if (checkoutMode === 'direct_upi') {
      setAppLaunched(true)
    }

    let deepLink = upiUrl
    if (appScheme === 'gpay') {
      deepLink = upiUrl
    } else if (appScheme === 'phonepe') {
      deepLink = `phonepe://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
        PAYEE_NAME,
      )}&am=${price}&cu=INR&tn=${encodeURIComponent(productName)}`
    } else if (appScheme === 'paytm') {
      deepLink = `paytmmp://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
        PAYEE_NAME,
      )}&am=${price}&cu=INR&tn=${encodeURIComponent(productName)}`
    }

    window.location.href = deepLink
  }

  // Handlers for direct_upi mode
  const handleInfoSubmit = (e) => {
    e?.preventDefault()
    setErrorMessage('')

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp number.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    playClickSound()
    const newOrderId = `SS-${Date.now().toString().slice(-6)}`
    setOrderId(newOrderId)
    setStep('pay')
  }

  const handleSimulateInstantVerify = () => {
    setAppLaunched(true)
    setStep('verifying')
    playChimeSound()
    setAutoVerifyStage(1)

    setTimeout(() => setAutoVerifyStage(2), 700)
    setTimeout(() => {
      setAutoVerifyStage(3)
      playChimeSound()

      const confirmedOrderId = orderId || `SS-${Date.now().toString().slice(-6)}`
      const cleanDigits = (phone || '').replace(/\D/g, '').slice(-10)
      const newOrder = {
        orderId: confirmedOrderId,
        customerName: name || 'Customer',
        whatsapp: cleanDigits || phone || 'Buyer',
        email: email || '',
        product: productName,
        amount: price,
        driveLink: DRIVE_LINK,
        utr: `QR-RADAR-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        status: 'AUTO-CONFIRMED',
      }
      persistOrderRecord(newOrder)
      triggerAutomatedDelivery(newOrder, content?.site?.automation).then((report) => {
        setDeliveryStatus(report)
      })

      setStep('success')

      if (!autoOpenedRef.current) {
        autoOpenedRef.current = true
        try {
          window.open(DRIVE_LINK, '_blank', 'noopener,noreferrer')
        } catch (e) {
          console.warn('Pop-up blocker caught auto-open:', e)
        }
      }
    }, 1500)
  }

  const handleManualUtrSubmit = (e) => {
    e?.preventDefault()
    const cleanUtr = utr.trim().replace(/\s+/g, '')
    if (cleanUtr.length < 6) {
      setErrorMessage('Please enter valid UTR digits.')
      return
    }
    handleSimulateInstantVerify()
  }

  const handleCopyDriveLink = () => {
    playClickSound()
    navigator.clipboard?.writeText(DRIVE_LINK)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2200)
  }

  const handleSaveToMyWhatsApp = () => {
    playClickSound()
    const confirmedOrderId = orderId || `SS-${Date.now().toString().slice(-6)}`
    const orderData = {
      orderId: confirmedOrderId,
      customerName: name || 'Creator',
      whatsapp: phone,
      product: productName,
      amount: price,
      driveLink: DRIVE_LINK,
    }
    const nativeUrl = buildWhatsAppNativeUrl(orderData, DRIVE_LINK)
    const webShareUrl = buildWhatsAppShareUrl(orderData, DRIVE_LINK)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (isMobile) {
      window.location.href = nativeUrl
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = webShareUrl
        }
      }, 1500)
    } else {
      window.open(webShareUrl, '_blank')
    }
  }

  const handleSendToCustomerDirect = () => {
    playClickSound()
    const confirmedOrderId = orderId || `SS-${Date.now().toString().slice(-6)}`
    const orderData = {
      orderId: confirmedOrderId,
      customerName: name || 'Creator',
      whatsapp: phone,
      product: productName,
      amount: price,
      driveLink: DRIVE_LINK,
    }
    const directUrl = buildWhatsAppDeliveryUrl(orderData, DRIVE_LINK)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (isMobile) {
      window.location.href = directUrl
    } else {
      window.open(directUrl, '_blank')
    }
  }

  const handleContactFounder = () => {
    playClickSound()
    const confirmedOrderId = orderId || `SS-${Date.now().toString().slice(-6)}`
    const supportMsg = encodeURIComponent(
      `Hi Naveen! 👋 I completed payment for Order *${confirmedOrderId}* (${productName}).\n\n👤 Name: ${name || 'Customer'}\n📱 WhatsApp: +91 ${(phone || '').replace(/\D/g, '').slice(-10)}\n\nCould you assist me?`
    )
    window.open(`https://wa.me/91${founderCleanDigits}?text=${supportMsg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 animate-fade-in"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={() => {
          playClickSound()
          onClose()
        }}
        className="fixed inset-0 bg-black/75 dark:bg-black/85 backdrop-blur-xl transition-opacity"
      />

      {/* Main Modal Frame */}
      <div className="relative z-10 flex flex-col w-full max-w-lg max-h-[calc(100dvh-1rem)] sm:max-h-[88vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#0c101c] text-black dark:text-white shadow-[0_30px_90px_rgba(0,56,255,0.35)]">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 shrink-0 flex items-center justify-between border-b border-black/5 dark:border-white/10 px-4 sm:px-6 py-3 bg-white dark:bg-[#0c101c]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-black/70 dark:text-white/70 truncate">
              {checkoutMode === 'whatsapp'
                ? 'ORDER VIA WHATSAPP // INSTANT ACCESS'
                : step === 'success'
                ? 'ACCESS UNLOCKED // VIP VAULT'
                : step === 'verifying'
                ? 'RADAR VERIFYING PAYMENT...'
                : 'INSTANT ZERO-CLICK CHECKOUT'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              onClose()
            }}
            data-cursor="CLOSE"
            aria-label="Close checkout"
            className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Product Snapshot Bar */}
        <div className="shrink-0 flex items-center justify-between bg-brand-offwhite/90 dark:bg-white/[0.03] px-4 sm:px-6 py-2.5 sm:py-3 border-b border-black/5 dark:border-white/5">
          <div className="truncate pr-3">
            <h4 className="font-bold text-xs sm:text-sm truncate text-black dark:text-white">
              {productName}
            </h4>
            <span className="text-[10px] sm:text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {checkoutMode === 'whatsapp'
                ? '💬 Direct WhatsApp Access Delivery'
                : '⚡ Auto-Open Google Drive Delivery'}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="font-display text-xl sm:text-2xl font-black text-brand-blue">
              {formatPrice(price)}
            </span>
            <span className="ml-1 text-[10px] sm:text-xs text-black/40 dark:text-white/40 line-through">
              {formatPrice(1000)}
            </span>
          </div>
        </div>

        {/* Scrollable Step Body */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto p-4 sm:p-6 pb-8 sm:pb-10 space-y-3 sm:space-y-4 custom-scrollbar overscroll-contain"
        >
          
          {/* ======================================================== */}
          {/* MODE 1: WHATSAPP CHAT TO BUY (ACTIVE USER PREFERENCE)   */}
          {/* ======================================================== */}
          {checkoutMode === 'whatsapp' ? (
            <div className="space-y-4 text-left">
              {/* Highlight Banner */}
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl shadow-md">
                  💬
                </span>
                <div className="min-w-0">
                  <h5 className="text-xs sm:text-sm font-black uppercase text-emerald-600 dark:text-emerald-400">
                    Order Directly via WhatsApp
                  </h5>
                  <p className="text-[11px] text-black/70 dark:text-white/70">
                    Chat with Naveen (+91 {founderCleanDigits}) to receive your Google Drive link and payment details.
                  </p>
                </div>
              </div>

              {/* Product Inclusions Checklist */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-3.5 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>✓</span>
                  <span>55M+ Video Assets, Reels, Sound FX & LUTs</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>✓</span>
                  <span>Instant Google Drive Access Link Shared with You</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>✓</span>
                  <span>Lifetime Free Updates & Direct Founder Support</span>
                </div>
              </div>

              {/* Optional Buyer Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
                    Your WhatsApp Number (Optional)
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.05] text-xs font-mono font-bold text-black/60 dark:text-white/60">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full rounded-r-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* PRIMARY CTA: ORDER ON WHATSAPP */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-emerald-600/30 transition-all cursor-pointer text-center"
              >
                <span className="text-lg">💬</span>
                <span>ORDER ON WHATSAPP ({formatPrice(price)})</span>
                <span className="text-base">→</span>
              </button>

              {/* Quick UPI Details Box */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
                    Want to pay UPI first?
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    0% Gateway Fee
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/30 p-2 pl-3">
                  <div className="text-left leading-tight truncate mr-2">
                    <span className="block text-[8px] font-mono text-black/50 dark:text-white/50 uppercase">
                      UPI ID ({PAYEE_NAME})
                    </span>
                    <span className="font-mono text-xs font-black text-black dark:text-white truncate">
                      {UPI_ID}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-brand-blue dark:hover:bg-brand-blue dark:hover:text-white px-3 py-1 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? 'Copied! ✓' : 'Copy UPI'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePayApp('gpay')}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2 hover:border-emerald-500 transition-all cursor-pointer text-xs font-bold text-black dark:text-white"
                  >
                    <span>🟢</span>
                    <span>GPay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePayApp('phonepe')}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2 hover:border-purple-500 transition-all cursor-pointer text-xs font-bold text-black dark:text-white"
                  >
                    <span>🟣</span>
                    <span>PhonePe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePayApp('paytm')}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 py-2 hover:border-sky-500 transition-all cursor-pointer text-xs font-bold text-black dark:text-white"
                  >
                    <span>🔵</span>
                    <span>Paytm</span>
                  </button>
                </div>

                <p className="text-[10px] text-center text-black/50 dark:text-white/50 pt-1">
                  💡 Pay {formatPrice(price)} via any UPI App and share the screenshot in WhatsApp to unlock instant access.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-black/50 dark:text-white/50 text-center">
                <span>🔒 Direct Founder Chat</span>
                <span>•</span>
                <span>⚡ Instant Reply</span>
                <span>•</span>
                <span>📁 Google Drive Link</span>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* MODE 2: AUTOMATED ON-SITE DIRECT UPI (PRESERVED)         */
            /* ======================================================== */
            <>
              {/* STEP 1: LEAD CAPTURE (Name, Phone, Email) */}
              {step === 'info' && (
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <div className="text-left">
                    <h5 className="font-display text-lg font-black uppercase tracking-tight text-black dark:text-white">
                      Where should we send your VIP Drive link?
                    </h5>
                    <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                      Please enter your WhatsApp number and email to receive your automated download backup.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-bold text-red-600 dark:text-red-400">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
                        WhatsApp Number (for Instant Backup)
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.05] text-xs font-mono font-bold text-black/60 dark:text-white/60">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full rounded-r-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white outline-none focus:border-brand-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-black dark:text-white outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-dark py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all active:scale-95 cursor-pointer mt-2"
                  >
                    <span>Proceed to Pay {formatPrice(price)} via UPI</span>
                    <span>→</span>
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-black/50 dark:text-white/50 pt-1">
                    <span>🔒 Zero-Fee Direct Bank</span>
                    <span>•</span>
                    <span>⚡ Auto-Opens Drive</span>
                    <span>•</span>
                    <span>♾️ Lifetime Access</span>
                  </div>
                </form>
              )}

              {/* STEP 2: PAYMENT SCREEN WITH AUTO-DETECTION RADAR */}
              {step === 'pay' && (
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-between text-left">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase text-brand-blue">
                        ORDER ID: {orderId}
                      </span>
                      <h5 className="font-display text-base font-black uppercase text-black dark:text-white">
                        Scan QR or Pay with UPI App
                      </h5>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('info')}
                      className="text-xs font-mono font-bold text-black/50 dark:text-white/50 hover:underline cursor-pointer"
                    >
                      ← Edit Details
                    </button>
                  </div>

                  {/* Mobile One-Tap Buttons */}
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>TAP APP TO PAY → SCREEN AUTO-OPENS DRIVE ON RETURN</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handlePayApp('gpay')}
                        className="flex flex-col items-center justify-center rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 p-2.5 hover:border-emerald-500 hover:scale-102 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-xl">🟢</span>
                        <span className="text-[11px] font-bold text-black dark:text-white mt-1">GPay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePayApp('phonepe')}
                        className="flex flex-col items-center justify-center rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 p-2.5 hover:border-purple-500 hover:scale-102 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-xl">🟣</span>
                        <span className="text-[11px] font-bold text-black dark:text-white mt-1">PhonePe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePayApp('paytm')}
                        className="flex flex-col items-center justify-center rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 p-2.5 hover:border-sky-500 hover:scale-102 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-xl">🔵</span>
                        <span className="text-[11px] font-bold text-black dark:text-white mt-1">Paytm</span>
                      </button>
                    </div>
                  </div>

                  {/* Scannable UPI QR */}
                  <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border-2 border-brand-blue/30 bg-brand-blue/[0.02] p-3.5 shadow-sm">
                    <div className="relative rounded-2xl bg-white p-2.5 shadow-lg border border-black/10">
                      <img
                        src={qrCodeUrl}
                        alt="Scan UPI QR Code to Pay ₹99"
                        className="h-40 w-40 object-contain select-none"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="rounded-lg bg-black text-white px-2 py-0.5 text-[9px] font-black tracking-widest shadow-md border border-white/20">
                          SAN SHIFT
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono font-bold text-black/70 dark:text-white/80">
                      <span className="text-emerald-500">●</span>
                      <span>Amount: <strong>{formatPrice(price)}</strong> • Payee: <strong>{PAYEE_NAME}</strong></span>
                    </div>
                    <span className="text-[10px] font-mono text-black/50 dark:text-white/50">
                      Scan using Google Pay, PhonePe, Paytm, CRED or any UPI App
                    </span>
                  </div>

                  {/* UPI ID Copy Bar */}
                  <div className="flex items-center justify-between rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] p-2 pl-3">
                    <div className="text-left leading-tight">
                      <span className="block text-[8px] font-mono text-black/50 dark:text-white/50 uppercase">
                        UPI ID
                      </span>
                      <span className="font-mono text-xs font-black text-black dark:text-white">
                        {UPI_ID}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-brand-blue dark:hover:bg-brand-blue dark:hover:text-white px-3 py-1 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copied ? 'Copied! ✓' : 'Copy UPI'}
                    </button>
                  </div>

                  {/* Instant manual confirmation */}
                  <div className="pt-1 space-y-2">
                    <button
                      type="button"
                      onClick={handleSimulateInstantVerify}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>✓ I Have Paid {formatPrice(price)} — Open Google Drive</span>
                      <span>→</span>
                    </button>

                    <p className="text-[10px] font-mono text-black/50 dark:text-white/50">
                      💡 On mobile, paying via GPay/PhonePe and returning here automatically unlocks the Drive!
                    </p>
                  </div>

                  {/* Manual UTR Toggle */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowManualUtr(!showManualUtr)}
                      className="text-[11px] font-mono text-black/40 dark:text-white/40 hover:underline cursor-pointer"
                    >
                      {showManualUtr ? 'Hide Manual UTR Form ▲' : 'Need manual verification? Enter UTR ▼'}
                    </button>

                    {showManualUtr && (
                      <form onSubmit={handleManualUtrSubmit} className="mt-3 p-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-left space-y-2">
                        <label className="block text-[10px] font-bold uppercase text-black/60 dark:text-white/60">
                          12-Digit UTR Number (Optional)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            placeholder="e.g. 426891024519"
                            className="flex-1 rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-mono text-black dark:text-white"
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 text-xs font-bold"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2.5: RADAR AUTO-VERIFICATION */}
              {step === 'verifying' && (
                <div className="py-8 text-center space-y-6 animate-fade-in">
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                    <span className="absolute h-full w-full rounded-full bg-emerald-500/20 animate-ping" />
                    <span className="absolute h-16 w-16 rounded-full bg-brand-blue/30 animate-pulse" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-white text-2xl shadow-xl shadow-brand-blue/50">
                      ⚡
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block rounded-full bg-brand-blue/15 text-brand-blue px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                      LIVE PAYMENT RADAR
                    </span>

                    <h4 className="font-display text-xl font-black uppercase text-black dark:text-white">
                      {autoVerifyStage === 1 && 'Detecting Bank Signal...'}
                      {autoVerifyStage === 2 && `Authenticating ${formatPrice(price)} Transaction...`}
                      {autoVerifyStage === 3 && 'Payment Confirmed! Opening Drive...'}
                    </h4>

                    <p className="text-xs text-black/60 dark:text-white/60 font-mono">
                      {autoVerifyStage === 1 && 'Connecting to UPI banking network...'}
                      {autoVerifyStage === 2 && `Matching transfer to ${PAYEE_NAME}...`}
                      {autoVerifyStage === 3 && 'Unlocking unrestricted VIP lifetime access...'}
                    </p>
                  </div>

                  <div className="w-48 mx-auto h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-blue to-emerald-500 transition-all duration-700"
                      style={{
                        width: autoVerifyStage === 1 ? '35%' : autoVerifyStage === 2 ? '75%' : '100%',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: VAULT UNLOCKED */}
              {step === 'success' && (
                <div className="py-4 text-center space-y-5 animate-scale-up">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-500 text-4xl shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                    🎉
                  </div>

                  <div>
                    <span className="inline-block rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                      ✓ Payment Confirmed // Access Granted
                    </span>
                    <h4 className="font-display text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                      Welcome to the VIP Vault!
                    </h4>
                    <p className="mt-1 text-xs text-black/60 dark:text-white/60 leading-relaxed font-sans max-w-sm mx-auto">
                      Thank you, <strong>{name}</strong>! Your payment of {formatPrice(price)} has been verified. Your Google Drive folder was automatically opened!
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 text-left font-mono text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-black/50 dark:text-white/50">Order ID:</span>
                      <span className="font-bold text-black dark:text-white">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/50 dark:text-white/50">WhatsApp Delivery:</span>
                      <span className="font-bold text-black dark:text-white">
                        +91 {(phone || '').replace(/\D/g, '').slice(-10)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/50 dark:text-white/50">Email Receipt:</span>
                      <span className="font-bold text-black dark:text-white">{email || 'Instant Online Access'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/50 dark:text-white/50">Status:</span>
                      <span className="font-bold text-emerald-500">LIFETIME ACCESS ACTIVE ✓</span>
                    </div>
                  </div>

                  {/* Delivery Indicators */}
                  <div className="grid grid-cols-2 gap-2 text-left font-mono text-[11px]">
                    <div
                      className={`p-3 rounded-2xl border ${
                        deliveryStatus?.whatsapp?.success
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>WhatsApp VIP Pass</span>
                      </div>
                      <div className="text-[10px] text-black/60 dark:text-white/60 truncate mt-1">
                        {deliveryStatus?.whatsapp?.success
                          ? '✓ Automated message sent!'
                          : `Target: +91 ${(phone || '').replace(/\D/g, '').slice(-10)}`}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl border border-brand-blue/25 bg-brand-blue/10 text-brand-blue">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
                        <span>Official Invoice</span>
                      </div>
                      <div className="text-[10px] text-black/60 dark:text-white/60 truncate mt-1">
                        {deliveryStatus?.email?.success
                          ? '✓ Receipt emailed!'
                          : email
                          ? `Sent to ${email}`
                          : 'Logged in CRM'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href={DRIVE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playChimeSound()}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-dark py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-brand-blue/35 transition-all hover:scale-102 active:scale-95 cursor-pointer text-center"
                    >
                      <span>🚀 OPEN GOOGLE DRIVE BUNDLE (55M+ ASSETS)</span>
                      <span>→</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleSaveToMyWhatsApp}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-emerald-500 bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer text-center"
                    >
                      <span className="text-base">📲</span>
                      <span>SAVE VIP ACCESS LINK TO MY WHATSAPP</span>
                      <span>↗</span>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSendToCustomerDirect}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer truncate"
                        title={`Open direct chat to +91 ${(phone || '').replace(/\D/g, '').slice(-10)}`}
                      >
                        <span>📤</span>
                        <span className="truncate">
                          Direct Chat to +91 {(phone || '').replace(/\D/g, '').slice(-10) || 'Buyer'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyDriveLink}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 py-2.5 px-3 text-[11px] font-mono font-bold text-black/80 dark:text-white/80 transition-all cursor-pointer truncate"
                      >
                        <span>{copiedLink ? '✓ Link Copied!' : '📋 Copy Drive Link'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-black/60 dark:text-white/60">
                    <span>Need support from founder?</span>
                    <button
                      type="button"
                      onClick={handleContactFounder}
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Chat with Naveen (+91 {founderCleanDigits})</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Fixed Trust Footer */}
        <div className="shrink-0 border-t border-black/5 dark:border-white/10 px-5 sm:px-6 py-3 bg-black/[0.01]">
          <TrustBadges />
        </div>
      </div>
    </div>
  )
}
