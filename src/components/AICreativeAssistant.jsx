import { useState, useRef, useEffect, useId } from 'react'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import DirectCheckoutModal from './DirectCheckoutModal'
import { useContent } from '../content/ContentContext'

const SMART_FAQS = [
  {
    q: 'Does the ₹99 Bundle work on Phone (CapCut / VN)?',
    tamil: 'இந்த ₹99 பண்டில் மொபைல் CapCut & VN-ல் சப்போர்ட் ஆகுமா?',
    a: 'YES! 100% compatible with CapCut, VN, Premiere Pro, DaVinci Resolve, Final Cut Pro, and After Effects. You will get instant Google Drive VIP access with drag-and-drop sound effects, LUTs, and overlays ready to use on both Mobile and PC!',
    cta: 'buy',
  },
  {
    q: 'How do I receive the Google Drive link after payment?',
    tamil: 'பணம் செலுத்திய பிறகு கூகுள் டிரைவ் லிங்க் எப்படி கிடைக்கும்?',
    a: 'Zero waiting time! Once you pay ₹99 via UPI (GPay/PhonePe/Paytm), our automated system verifies your transaction and unlocks your lifetime VIP Google Drive folder link in less than 5 seconds directly on your screen.',
    cta: 'buy',
  },
  {
    q: 'How much does SAN SHIFT charge for Monthly Reels Editing?',
    tamil: 'மாதாந்திர ரீல்ஸ் எடிட்டிங் செய்ய என்ன கட்டணம்?',
    a: 'We offer high-retention cinematic editing packages (8, 15, or 30 reels/month) tailored for personal brands, creators, and businesses with 24-48h turnaround, sound design, and viral hooks. Tap below to chat directly with Founder Naveen on WhatsApp!',
    cta: 'whatsapp',
  },
  {
    q: 'How to get 1M+ views on Instagram Reels in 2026?',
    tamil: 'இன்ஸ்டாகிராம் ரீல்ஸில் 1M+ வியூஸ் எடுப்பது எப்படி?',
    a: 'The algorithm prioritizes 3 factors: 1) A brutal optical hook in the first 1.5 seconds, 2) Fast whoosh & riser sound sync, 3) 85%+ 3-second retention. Use our free Viral Hook Generator and 55M+ Master Bundle to skyrocket your retention!',
    cta: 'hook',
  },
]

function generateSmartAIResponse(rawQuery, content) {
  const query = rawQuery.trim()
  const lower = query.toLowerCase()
  const phone = content?.site?.contact?.whatsapp || '+91 73394 67830'
  const email = content?.site?.contact?.email || 'hello.sanshift@gmail.com'

  // 1. Contact / Phone Number / Call / Mobile / WhatsApp
  if (
    lower.includes('contact') ||
    lower.includes('contuct') ||
    lower.includes('cantact') ||
    lower.includes('phone') ||
    lower.includes('phn') ||
    lower.includes('call') ||
    lower.includes('number') ||
    (lower.includes('no') && (lower.includes('contact') || lower.includes('phn') || lower.includes('call') || lower.includes('mob'))) ||
    lower.includes('mobile') ||
    lower.includes('reach') ||
    lower.includes('whatsapp')
  ) {
    return `📞 Here are the official SAN SHIFT contact details:\n\n• Phone / WhatsApp: ${phone} (Founder Naveen)\n• Official Email: ${email}\n• Instagram: @sanshift\n• Working Hours: Mon–Sat, 9:00 AM – 9:00 PM IST\n\nYou can tap the green "WHATSAPP" button below to chat with us directly!`
  }

  // 2. Email / Mail / Gmail
  if (
    lower.includes('email') ||
    lower.includes('e-mail') ||
    lower.includes('mail') ||
    lower.includes('gmail')
  ) {
    return `📧 Our official email address is:\n\n👉 ${email}\n\nYou can email us your project brief, raw footage links (Drive/Dropbox), or business inquiries. We usually reply within 2 to 4 hours!`
  }

  // 3. Photo Editing / Photoshop / Lightroom / Thumbnails
  if (
    lower.includes('photo') ||
    lower.includes('photoshop') ||
    lower.includes('lightroom') ||
    lower.includes('retouch') ||
    lower.includes('thumbnail') ||
    lower.includes('poster')
  ) {
    return `🎨 Yes! SAN SHIFT provides high-end Photo Editing & Graphic Solutions:\n\n• High-End Portrait & Beauty Skin Retouching (Natural skin texture, zero plastic blur)\n• High-CTR Viral YouTube & Instagram Thumbnails (Ali Abdaal / MrBeast style)\n• E-Commerce Product Photography Color Grading\n• Cinema Posters & Branding Graphics\n\n💡 BONUS: Our ₹99 Master Bundle includes 500+ Lightroom Mobile/PC presets, LUTs, and textures ready to use!`
  }

  // 4. Video Editing / Reels / Shorts / Turnaround
  if (
    lower.includes('video') ||
    lower.includes('reel') ||
    lower.includes('short') ||
    lower.includes('edit') ||
    lower.includes('turnaround')
  ) {
    return `🎬 SAN SHIFT is a premier video editing agency. We craft:\n\n• 60FPS 4K Viral Reels (Hormozi kinetic captions, Ali Abdaal clean minimal, Vox documentary)\n• Cinematic sound design (Whooshes, Risers, Sub-drops synced to speech)\n• Fast 24–48 hour delivery turnaround\n\nMonthly packages start from ₹15,000/month. Or grab our 55M+ Master Vault for ₹99 to edit yourself!`
  }

  // 5. Pricing / Cost / Rates / Packages / Discount / Offer
  if (
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('rate') ||
    lower.includes('how much') ||
    lower.includes('charge') ||
    lower.includes('fee') ||
    lower.includes('package') ||
    lower.includes('discount') ||
    lower.includes('offer') ||
    lower.includes('₹') ||
    lower.includes('99')
  ) {
    return `💰 Here is our transparent pricing:\n\n1. 55M+ Master Creator Bundle: Just ₹99 (90% OFF flash sale, Original ₹1,000) with lifetime access.\n2. Monthly Reels Editing: Custom retainers for 8, 15, or 30 reels/month tailored to your brand.\n3. Custom Web Development: From ₹15,000 for ultra-fast, modern React/Vite websites.\n\nTap below to grab the ₹99 pack or discuss custom retainer pricing on WhatsApp!`
  }

  // 6. Compatibility / Software / CapCut / VN / Premiere / Phone
  if (
    lower.includes('capcut') ||
    lower.includes('vn') ||
    lower.includes('phone') ||
    lower.includes('mobile') ||
    lower.includes('premiere') ||
    lower.includes('davinci') ||
    lower.includes('final cut') ||
    lower.includes('after effects') ||
    lower.includes('pc') ||
    lower.includes('laptop') ||
    lower.includes('software')
  ) {
    return `📱 100% Compatible with ALL major tools:\n\n• Mobile: CapCut (Android/iOS), VN Editor, InShot, KineMaster\n• PC / Mac: Adobe Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro\n\nAll files (WAV/MP3 sound effects, CUBE LUTs, PNG overlays, TTF fonts) are standard universal formats that import in 1 click!`
  }

  // 7. Payment / Google Drive Link / Delivery / UPI / GPay
  if (
    lower.includes('drive') ||
    lower.includes('link') ||
    lower.includes('delivery') ||
    lower.includes('payment') ||
    lower.includes('how to pay') ||
    lower.includes('upi') ||
    lower.includes('gpay') ||
    lower.includes('phonepe') ||
    lower.includes('paytm')
  ) {
    return `⚡ Automated Zero-Wait Instant Delivery:\n\n1. Click "GET 55M+ BUNDLE (₹99)" below or on the site.\n2. Pay ₹99 via UPI to naveen2006sk-1@oksbi (GPay, PhonePe, Paytm).\n3. Our system verifies your payment in < 5 seconds and displays your VIP Google Drive folder link right on your screen!\n\nYou can also download or bookmark it for lifetime access.`
  }

  // 8. Founder / Who Started / Naveen / Location / Office
  if (
    lower.includes('founder') ||
    lower.includes('owner') ||
    lower.includes('naveen') ||
    lower.includes('who are you') ||
    lower.includes('who is') ||
    lower.includes('location') ||
    lower.includes('office') ||
    lower.includes('where are') ||
    lower.includes('coimbatore') ||
    lower.includes('tamil nadu')
  ) {
    return `⚡ SAN SHIFT was founded by Naveen (Creative Director & Growth Strategist), based out of Coimbatore, Tamil Nadu, India.\n\nWe operate as a global creative studio helping creators, personal brands, and businesses scale their reach and revenue through cinematic content and digital growth funnels.`
  }

  // 9. Website Building / Web Development / Developer
  if (
    lower.includes('web') ||
    lower.includes('website') ||
    lower.includes('developer') ||
    lower.includes('ui') ||
    lower.includes('ux') ||
    lower.includes('design')
  ) {
    return `🌐 Yes, SAN SHIFT builds high-converting, modern websites:\n\n• Lightning-fast React, Vite & Tailwind architecture\n• 3D animations, GSAP kinetic interactions, and Awwwards-style UI\n• 100/100 Google PageSpeed optimization & SEO\n• Built-in UPI / Razorpay / Stripe payment checkout\n\nWant a website built like SAN SHIFT? Tap WhatsApp to discuss your project!`
  }

  // 10. Greetings & Friendly Small Talk (English & Tamil)
  if (
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower.includes('vanakkam') ||
    lower.includes('வணக்கம்') ||
    lower.includes('good morning') ||
    lower.includes('good evening')
  ) {
    return `வணக்கம் & Hello! 👋 I am SAN SHIFT AI.\n\nHow can I help you today? You can ask me about:\n• 🎬 55M+ Master Editing Bundle (₹99)\n• 📈 Monthly Reels Editing & Content Growth\n• 🎨 Photo Editing & Thumbnails\n• 📞 Contacting Founder Naveen directly on WhatsApp!`
  }

  // 11. Tamil Conversations / Questions
  if (
    lower.includes('tamil') ||
    lower.includes('sollu') ||
    lower.includes('eppadi') ||
    lower.includes('nalla') ||
    lower.includes('panna')
  ) {
    return `கண்டிப்பா! 😊 SAN SHIFT உங்களுக்கு 3 முக்கிய சேவைகளை வழங்குகிறது:\n\n1. 55M+ வீடியோ எடிட்டிங் மாஸ்டர் பண்டில் — வெறும் ₹99 மட்டுமே (Google Drive VIP Access).\n2. மாதாந்திர ரீல்ஸ் எடிட்டிங் — இன்ஸ்டாகிராமில் வைரல் ஆகும் சினிமாடிக் எடிட்டிங்.\n3. வெப்சைட் டெவலப்மென்ட் & டிஜிட்டல் மார்க்கெட்டிங்.\n\nஉங்களுக்கு என்ன உதவி வேணும்னு சொல்லுங்க, அல்லது கீழே உள்ள WHATSAPP பட்டனை க்ளிக் செய்து நவீனுடன் நேரடியாக பேசுங்கள்!`
  }

  // 12. Dynamic Reel Ideas Generator within Chatbot
  if (
    lower.includes('idea') ||
    lower.includes('hook') ||
    lower.includes('content') ||
    lower.includes('suggest') ||
    lower.includes('topic')
  ) {
    return `🔥 Here are 3 viral content ideas you can shoot today:\n\n1. "The 1 Costly Mistake in your niche costing people thousands every month..." (Fear of Loss Hook)\n2. "If I had to restart my journey in 2026, here is the 3-step cheat sheet I would follow..." (Curiosity Blueprint)\n3. "How the top 1% do this in 60 seconds vs how 99% waste 3 hours..." (Pro vs Noob Contrast)\n\n💡 Want the sound effects, whooshes, and cinematic LUTs to edit these? Tap "GET 55M+ BUNDLE" below for just ₹99!`
  }

  // 13. High-Intelligence Contextual Fallback
  return `Got it! Regarding "${query}":\n\nAt SAN SHIFT, we help creators, agencies, and businesses scale with cinematic video editing, viral reels production, digital products, and high-performance websites.\n\n• For immediate assistance: Tap the green "WHATSAPP" button below to chat with Founder Naveen directly.\n• For video editing assets: Grab our 55M+ Master Editing Vault for just ₹99!\n\nLet me know if you would like pricing details, client portfolio samples, or editing guidance!`
}

export default function AICreativeAssistant() {
  const customQueryInputId = useId()
  const { content } = useContent()
  const product =
    content.products.find((p) => p.id === content.site.featuredProductId) ?? content.products[0]

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hey! I am the SAN SHIFT AI Creative Assistant. ⚡ How can I help you scale your content, videos, or digital growth today?',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleToggle = () => {
    playClickSound()
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasUnread(false)
      playChimeSound()
    }
  }

  const handleAsk = (query, answerText = null) => {
    playClickSound()
    const userMsg = { sender: 'user', text: query }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = answerText || generateSmartAIResponse(query, content)
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }])
      setIsTyping(false)
      playChimeSound()
    }, 450)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    const text = inputText.trim()
    setInputText('')
    handleAsk(text)
  }

  const openWhatsApp = () => {
    playClickSound()
    const phone = content.site?.contact?.whatsapp?.replace(/[^0-9]/g, '') || '917339467830'
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      'Hi SAN SHIFT, I was chatting with your AI assistant on your website and want to discuss custom services & bundles!',
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-5 z-40">
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Open SAN SHIFT AI Creative Assistant"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-blue via-indigo-600 to-cyan-400 p-0.5 text-white shadow-[0_10px_35px_rgba(0,56,255,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          {/* Inner Circle */}
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0d18] transition-colors group-hover:bg-opacity-80">
            {isOpen ? (
              <span className="text-xl font-bold">✕</span>
            ) : (
              <span className="text-2xl animate-pulse">🤖</span>
            )}
          </div>

          {/* Unread Ping Dot */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#070a13]" />
            </span>
          )}

          {/* Hover Tooltip */}
          <div className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded-xl bg-black/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono font-bold text-white border border-white/10 shadow-xl hidden sm:block">
            Ask SAN SHIFT AI ⚡
          </div>
        </button>
      </div>

      {/* Slide-Up Chat Terminal Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-20 sm:bottom-24 sm:right-6 sm:inset-x-auto sm:w-[410px] max-h-[min(580px,calc(100dvh-6rem))] h-[78vh] z-50 flex flex-col rounded-3xl border border-black/10 dark:border-white/20 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,56,255,0.35)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-black/10 dark:border-white/10 bg-brand-blue/[0.04] dark:bg-white/[0.03]">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-blue to-cyan-400 text-white shadow-md shadow-brand-blue/30 text-lg sm:text-xl">
                🤖
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c101c]" />
              </div>
              <div>
                <h3 className="font-display text-xs sm:text-sm font-black uppercase tracking-tight text-black dark:text-white">
                  SAN SHIFT AI BRAIN
                </h3>
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE • 24/7 ADVISOR
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black/60 dark:text-white/60 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 font-sans text-xs sm:text-[13px] leading-relaxed">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-brand-blue text-white rounded-br-none'
                      : 'bg-black/5 dark:bg-white/10 text-black dark:text-white rounded-bl-none border border-black/5 dark:border-white/10'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none bg-black/5 dark:bg-white/10 px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-blue animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-brand-blue animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-brand-blue animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 sm:px-4 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar flex gap-2">
            {SMART_FAQS.map((faq) => (
              <button
                key={faq.q}
                type="button"
                onClick={() => handleAsk(faq.q, faq.a)}
                className="shrink-0 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 hover:border-brand-blue px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-medium text-black/70 dark:text-white/80 transition-colors cursor-pointer"
              >
                💡 {faq.q}
              </button>
            ))}
          </div>

          {/* Direct Action Bar */}
          <div className="px-3 sm:px-4 py-2 border-t border-black/5 dark:border-white/5 bg-brand-blue/[0.03] flex items-center justify-between gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                playChimeSound()
                setCheckoutOpen(true)
              }}
              className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white px-2.5 sm:px-3 py-2 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider shadow-md shadow-brand-blue/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer truncate"
            >
              <span>⚡ GET 55M+ BUNDLE (₹99)</span>
            </button>

            <button
              type="button"
              onClick={openWhatsApp}
              className="shrink-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 sm:px-3 py-2 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>💬 WHATSAPP</span>
            </button>
          </div>

          {/* Custom Input Box */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#090d18] flex items-center gap-2"
          >
            <label htmlFor={customQueryInputId} className="sr-only">
              Ask custom question
            </label>
            <input
              id={customQueryInputId}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about SAN SHIFT services or bundles..."
              className="flex-1 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3.5 py-2.5 text-xs text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:border-brand-blue focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue disabled:opacity-40 text-white hover:brightness-110 transition-all cursor-pointer"
            >
              <span>➤</span>
            </button>
          </form>
        </div>
      )}

      {/* Direct Checkout Modal Hook */}
      {product && (
        <DirectCheckoutModal
          isOpen={checkoutOpen}
          product={product}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  )
}
