import { useState, useId } from 'react'
import Reveal from './Reveal'
import { playClickSound, playChimeSound } from '../lib/soundFx'
import DirectCheckoutModal from './DirectCheckoutModal'
import { useContent } from '../content/ContentContext'

const NICHES = [
  { id: 'business', label: '💼 Business & E-Com', icon: '📈' },
  { id: 'fitness', label: '💪 Fitness & Health', icon: '🏋️' },
  { id: 'finance', label: '💰 Money & Finance', icon: '💳' },
  { id: 'tech', label: '🤖 Tech & AI', icon: '⚡' },
  { id: 'creator', label: '🎬 Creators & Editing', icon: '🔥' },
  { id: 'lifestyle', label: '✨ Lifestyle & Motivation', icon: '🚀' },
]

const HOOK_PRESETS = {
  business: [
    {
      hook: 'If I had to start a business with ₹0 in 2026, here is the exact 3-step blueprint nobody shares...',
      tamil: '2026-ல் என்கிட்ட ஒரு ரூபாய் கூட இல்லாம ஒரு பிசினஸ் தொடங்கணும்னா, நான் இததான் செய்வேன்...',
      score: 98,
      type: 'Curiosity & Blueprint',
    },
    {
      hook: 'Stop running Instagram ads until you fix this one fatal checkout mistake costing you 70% of sales.',
      tamil: 'இந்த ஒரு தப்பை சரி செய்யாம இன்ஸ்டா ஆட்ஸ் ஓட்டவே ஓட்டாதீங்க, உங்க பணம் வீணாகும்...',
      score: 95,
      type: 'Fear of Loss',
    },
    {
      hook: 'The secret pricing trick 9-figure brands use that makes customers say YES without thinking twice.',
      tamil: 'பெரிய பிராண்டுகள் வாடிக்கையாளர்களை உடனே வாங்க வைக்கும் அந்த சைக்காலஜி ட்ரிக் இதுதான்...',
      score: 94,
      type: 'Psychological Hook',
    },
    {
      hook: '3 boring businesses that are quietly making college students ₹1,00,000 every single month in India.',
      tamil: 'காலேஜ் படிக்கும்போதே மாசம் 1 லட்சம் வரை சம்பாதிக்க உதவும் 3 ரகசிய பிசினஸ் ஐடியாக்கள்...',
      score: 97,
      type: 'Relatable Aspiration',
    },
  ],
  fitness: [
    {
      hook: 'The real reason your belly fat refuses to drop, even though you cut carbs completely...',
      tamil: 'சாப்பாட்டைக் குறைச்சாலும் தொப்பை குறையாம இருக்க உண்மையான காரணம் இதுதான்...',
      score: 96,
      type: 'Myth Buster',
    },
    {
      hook: 'Do NOT touch another protein shake until you watch this 30-second absorption test.',
      tamil: 'ப்ரோட்டீன் ஷேக் குடிக்கிறதுக்கு முன்னாடி இந்த 30 செகண்ட் வீடியோவை கண்டிப்பா பாருங்க...',
      score: 94,
      type: 'Urgent Warning',
    },
    {
      hook: 'How to lose 5kg in 30 days without starving or giving up your favorite weekend biryani.',
      tamil: 'பிடிச்ச சாப்பாட்டை விடாமலே 30 நாளில் 5 கிலோ எடை குறைப்பது எப்படி?',
      score: 98,
      type: 'High-Reward Contrast',
    },
  ],
  finance: [
    {
      hook: 'If you earn ₹25,000/month, the Indian tax system has a legal loophole you probably don’t know about.',
      tamil: 'உங்க சம்பளம் ₹25,000-ஆ? அப்போ இந்த லீகல் டாக்ஸ் சேவிங் ட்ரிக் உங்களுக்குத் தெரியணும்...',
      score: 97,
      type: 'Insider Secret',
    },
    {
      hook: 'The 24-hour money rule that saved me over ₹3,50,000 on impulsive shopping this year.',
      tamil: 'தேவையில்லாத செலவுகளைத் தடுத்து இந்த வருஷம் 3.5 லட்சத்தை சேமிக்க வச்ச 24 மணி நேர ரூல்...',
      score: 93,
      type: 'Actionable Story',
    },
    {
      hook: 'Why buying gold jewellery in 2026 is mathematically worse than this one underrated asset...',
      tamil: 'இப்போ தங்கம் வாங்குறதை விட அதிக லாபம் தரும் இந்த ஒரு முதலீடு பத்தி தெரியுமா?',
      score: 96,
      type: 'Controversial Debate',
    },
  ],
  tech: [
    {
      hook: 'This brand new AI tool feels illegal to know, and it will replace 80% of video editors who refuse to adapt.',
      tamil: 'இந்த புது AI டூல் பத்தி தெரிஞ்சா மிரண்டு போயிருவீங்க, எடிட்டிங் வேலையையே சுலபமாக்கிடுச்சு...',
      score: 99,
      type: 'Trend & Threat',
    },
    {
      hook: 'Google does NOT want you to find this secret URL, but it automates 4 hours of your daily work.',
      tamil: 'கூகுளின் இந்த ரகசிய அம்சம் உங்க தினசரி வேலையை பாதியாகக் குறைக்கும்...',
      score: 95,
      type: 'Hidden Shortcut',
    },
    {
      hook: 'The exact prompt I used to turn ChatGPT into a ₹50,000/month freelance copywriting machine.',
      tamil: 'ChatGPT-யை பயன்படுத்தி ஃப்ரீலான்சிங் மூலம் பணம் சம்பாதிக்க நான் பயன்படுத்திய ப்ராம்ப்ட்...',
      score: 96,
      type: 'Case Study',
    },
  ],
  creator: [
    {
      hook: 'Your reels are NOT flopping because of the algorithm — it is because your first 1.5 seconds lack this optical trigger.',
      tamil: 'உங்க ரீல்ஸ் வியூஸ் போகாததுக்கு அல்காரிதம் காரணம் இல்ல; முதல் 2 வினாடியில் இந்த தப்பு பண்றீங்க...',
      score: 99,
      type: 'Brutal Truth',
    },
    {
      hook: 'I analyzed 100 reels that crossed 10M+ views, and every single one used this exact sound transition trick.',
      tamil: '1 கோடி வியூஸ் போன 100 ரீல்ஸை ஆராய்ச்சி பண்ணேன், எல்லாரும் இந்த 1 சவுண்ட் ட்ரிக்கத்தான் யூஸ் பண்றாங்க...',
      score: 98,
      type: 'Data-Backed Secret',
    },
    {
      hook: 'How to make a ₹10,000 phone look like a ₹3,00,000 Sony FX3 cinematic camera with just 2 CapCut adjustments.',
      tamil: 'சாதாரண போன் கேமராவை சினிமா தியேட்டர் கேமரா போல மாற்றும் 2 எடிட்டிங் ட்ரிக்ஸ்...',
      score: 97,
      type: 'Aspirational Hack',
    },
  ],
  lifestyle: [
    {
      hook: 'The 3 brutal habits that are secretly draining your dopamine and ruining your 20s.',
      tamil: 'உங்களுடைய கவனத்தையும் ஆற்றலையும் கொஞ்சம் கொஞ்சமாக அழிக்கும் 3 பழக்கங்கள்...',
      score: 95,
      type: 'Mindset Realization',
    },
    {
      hook: 'If you feel permanently exhausted even after 8 hours of sleep, watch this immediately.',
      tamil: '8 மணி நேரம் தூங்கினாலும் உடம்பு சோர்வாவே இருக்கா? அப்போ இத கண்டிப்பா தெரிஞ்சுக்கோங்க...',
      score: 97,
      type: 'High-Empathy Diagnosis',
    },
  ],
}

function generateAiHooks(rawTopic) {
  const topic = rawTopic.trim()
  const lower = topic.toLowerCase()

  // Tailored high-impact presets for photo editing & visual arts
  if (lower.includes('photo') || lower.includes('lightroom') || lower.includes('photoshop') || lower.includes('retouch')) {
    return [
      {
        hook: 'The Camera RAW color grading trick that makes smartphone photos look like a ₹2,00,000 Sony camera shoot.',
        tamil: 'சாதாரண போன் போட்டோவை சினிமா தியேட்டர் போஸ்டர் போல மாற்றும் 2 போட்டோஷாப் கலர் கிரேடிங் ரகசியங்கள்...',
        score: 99,
        type: 'Visual Contrast',
      },
      {
        hook: 'Stop manually retouching skin! This one micro-adjustment gives you high-end model skin texture in 10 seconds.',
        tamil: 'போட்டோ எடிட்டிங்கில் மணி கணக்கில் வேலை செய்யாம, 10 நொடியில் மாடல் ஸ்கின் டெக்ஸ்சர் எடுக்கும் ரகசிய ட்ரிக்...',
        score: 98,
        type: 'Time-Saver Hack',
      },
      {
        hook: '3 Lightroom sliders 90% of editors completely ignore that instantly kill dull, muddy lighting in portraits.',
        tamil: 'லைட்ரூமில் இந்த 3 ஸ்லைடரை மட்டும் யூஸ் பண்ணிடாதீங்க, போட்டோ குவாலிட்டி மொத்தமா பாழாகிடும்...',
        score: 96,
        type: 'Costly Mistake',
      },
      {
        hook: 'The thumbnail photo composition formula that skyrocketed our YouTube click-through rate from 3% to 12.4%.',
        tamil: 'யூடியூப் தம்ப்னைல் போட்டோவை உடனே க்ளிக் பண்ண வைக்க பெரிய கிரியேட்டர்கள் பயன்படுத்தும் அந்த 1 ஃபார்முலா...',
        score: 97,
        type: 'High-CTR Formula',
      },
    ]
  }

  // Tailored presets for gym / fitness
  if (lower.includes('gym') || lower.includes('workout') || lower.includes('diet') || lower.includes('weight')) {
    return [
      {
        hook: 'If you are doing this common exercise in the gym, you are destroying your lower back for zero muscle gain.',
        tamil: 'ஜிம்முக்கு போய் இந்த 1 தப்பை மட்டும் பண்ணிடாதீங்க, உடம்பு ஏறுவதற்கு பதிலா முதுகு வலிதான் மிஞ்சும்...',
        score: 98,
        type: 'Urgent Warning',
      },
      {
        hook: 'The 3-ingredient morning drink that suppressed my cravings and helped me drop 4kg in 21 days.',
        tamil: 'பசியைக் கட்டுப்படுத்தி 21 நாட்களில் 4 கிலோ குறைக்க உதவிய அந்த 3 பொருள் காலை ட்ரிங்க்...',
        score: 97,
        type: 'Quick Blueprint',
      },
      {
        hook: 'Why 90% of people quit the gym within 30 days, and the 2-minute psychological rule to never miss a day.',
        tamil: '90% பேர் ஜிம்முக்கு போறதை 1 மாசத்துல நிறுத்திடுறாங்க! ஆனா இந்த 2 நிமிட சைக்காலஜி ட்ரிக் அதை மாற்றும்...',
        score: 95,
        type: 'Behavioral Truth',
      },
      {
        hook: 'Stop lifting heavy weights until your form passes this simple 10-second wall test.',
        tamil: 'வெயிட் தூக்குறதுக்கு முன்னாடி இந்த 10 செகண்ட் டெஸ்ட் பண்ணி பாருங்க, காயம் ஏற்படாம தப்பிக்கலாம்...',
        score: 96,
        type: 'High-Curiosity Test',
      },
    ]
  }

  // Tailored presets for food / cafe / cooking
  if (lower.includes('food') || lower.includes('biryani') || lower.includes('tea') || lower.includes('coffee') || lower.includes('restaurant')) {
    return [
      {
        hook: 'The 1 secret spice top restaurant chefs add right at the end that changes the entire aroma forever.',
        tamil: 'பெரிய ஹோட்டல் செஃப்கள் கடைசியாக சேர்க்கும் அந்த 1 ரகசிய மசாலாதான் சுவையை இரட்டிப்பாக்குது...',
        score: 98,
        type: 'Chef Secret',
      },
      {
        hook: 'I tried the most hyped ₹50 street food in town to see if it is genuinely worth the crazy crowd...',
        tamil: 'ஊரெல்லாம் கொண்டாடுற அந்த ₹50 ஸ்ட்ரீட் ஃபுட் உண்மையிலேயே அவ்வளவு வர்த்தா? நேர்ல போய் பார்த்தேன்...',
        score: 99,
        type: 'Honest Review',
      },
      {
        hook: 'Never cook this dish with high flame! This single kitchen mistake makes your gravy turn bitter and oily.',
        tamil: 'ஹை ஃபிளேமில் இந்த உணவை மட்டும் சமைக்காதீங்க! கிரேவி கசப்பாவும் எண்ணெயாகவும் மாற இதுதான் காரணம்...',
        score: 94,
        type: 'Critical Mistake',
      },
      {
        hook: 'How this tiny street shop quietly makes ₹3,00,000 every single month selling just one signature dish.',
        tamil: 'ஒரே ஒரு ஸ்பெஷல் உணவை மட்டும் வித்து மாசம் 3 லட்சம் சம்பாதிக்கும் இந்த கடையின் பிசினஸ் ரகசியம்...',
        score: 97,
        type: 'Case Study',
      },
    ]
  }

  // Dynamic generative synthesizer for ANY custom topic
  return [
    {
      hook: `If I had to learn ${topic} completely from scratch in 2026, here is the exact 3-step cheat sheet I would use...`,
      tamil: `2026-ல் ${topic} ஆரம்பத்திலிருந்தே கத்துக்கணும்னா, நான் பயன்படுத்தும் அந்த 3 ரகசிய குறுக்கு வழிகள் இதுதான்...`,
      score: 99,
      type: 'Curiosity Blueprint',
    },
    {
      hook: `Stop doing ${topic} like this! This one rookie mistake is secretly ruining 80% of your results and reach.`,
      tamil: `இப்படி மட்டும் ${topic} பண்ணிடாதீங்க! இந்த 1 தப்பு உங்க உழைப்பையும் நேரத்தையும் மொத்தமா வீணாக்கும்...`,
      score: 97,
      type: 'Costly Mistake',
    },
    {
      hook: `How top 1% experts master ${topic} in 60 seconds, while beginners waste 3 hours on complicated steps.`,
      tamil: `தொடக்கத்துல 3 மணி நேரம் ஆகுற ${topic}-ஐ, அனுபவமுள்ள நிபுணர்கள் வெறும் 60 நொடியில் எப்படி முடிக்கிறாங்க தெரியுமா?`,
      score: 98,
      type: 'Insider Hack',
    },
    {
      hook: `The untold secret about ${topic} nobody in the industry wants to share, but this single tweak changes everything.`,
      tamil: `இண்டஸ்ட்ரில யாரும் சொல்லிக் கொடுக்காத ${topic} பற்றிய அந்த 1 ரகசியம் இதுதான், இதை மாத்தினா எல்லாமே மாறும்...`,
      score: 96,
      type: 'Unfiltered Truth',
    },
  ]
}

export default function ViralHookGenerator() {
  const customTopicInputId = useId()
  const { content } = useContent()
  const product =
    content.products.find((p) => p.id === content.site.featuredProductId) ?? content.products[0]

  const [activeNiche, setActiveNiche] = useState('creator')
  const [customTopic, setCustomTopic] = useState('')
  const [activeGeneratedTopic, setActiveGeneratedTopic] = useState('')
  const [customGeneratedHooks, setCustomGeneratedHooks] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [showTamil, setShowTamil] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const activeHooks = customGeneratedHooks || HOOK_PRESETS[activeNiche] || HOOK_PRESETS.creator

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text)
    playClickSound()
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!customTopic.trim()) return
    playClickSound()
    setIsGenerating(true)

    setTimeout(() => {
      const generated = generateAiHooks(customTopic.trim())
      setCustomGeneratedHooks(generated)
      setActiveGeneratedTopic(customTopic.trim())
      setIsGenerating(false)
      playChimeSound()
    }, 450)
  }

  const handleResetToNiche = (nicheId) => {
    playClickSound()
    setActiveNiche(nicheId)
    setCustomGeneratedHooks(null)
    setActiveGeneratedTopic('')
  }

  return (
    <section
      id="viral-hook-engine"
      className="relative overflow-hidden bg-white dark:bg-[#070a13] text-black dark:text-white py-24 sm:py-32 border-t border-black/5 dark:border-white/5 transition-colors duration-300"
    >
      {/* Ambient background glow orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-brand-blue/10 dark:bg-brand-blue/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-1/3 h-96 w-96 rounded-full bg-brand-yellow/10 dark:bg-brand-yellow/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-brand-offwhite dark:bg-white/5 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black/75 dark:text-white/80 shadow-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(0,56,255,0.8)] animate-pulse" />
              <span>FREE CREATOR ENGINE // 3-SECOND RETENTION</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-black dark:text-white">
              VIRAL REEL <span className="animate-shimmer-text">HOOK GENERATOR</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-black/65 dark:text-white/70 font-sans">
              The first 3 seconds decide if your reel hits 1M+ views or gets swiped away. Generate psychological, high-retention hooks engineered for Instagram &amp; YouTube.
            </p>
          </Reveal>
        </div>

        {/* Generator Workspace Card */}
        <Reveal delay={100}>
          <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-brand-offwhite/80 dark:bg-[#0c101c]/80 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,56,255,0.12)]">
            {/* Top Toolbar: Niches & Language Toggle */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
              {/* Niche Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {NICHES.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleResetToNiche(n.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeNiche === n.id && !customGeneratedHooks
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 scale-105'
                        : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{n.icon}</span> {n.label}
                  </button>
                ))}
              </div>

              {/* Language Switcher Pill */}
              <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 p-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setShowTamil(false)
                  }}
                  className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
                    !showTamil
                      ? 'bg-white dark:bg-white/20 text-brand-blue dark:text-white shadow-sm'
                      : 'text-black/50 dark:text-white/50'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setShowTamil(true)
                  }}
                  className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
                    showTamil
                      ? 'bg-brand-yellow text-black font-black shadow-sm'
                      : 'text-black/50 dark:text-white/50'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            {/* Custom Input Bar */}
            <form onSubmit={handleGenerate} className="mt-6 flex flex-col sm:flex-row gap-3">
              <label htmlFor={customTopicInputId} className="sr-only">
                Enter video topic or keyword
              </label>
              <div className="relative flex-1">
                <input
                  id={customTopicInputId}
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Or enter your custom topic (e.g., 'photo editing', 'gym workout', 'coffee cafe')..."
                  className="w-full rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-5 py-3.5 text-xs sm:text-sm font-sans text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-blue-dark hover:brightness-110 active:scale-95 px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-brand-blue/30 transition-all cursor-pointer"
              >
                <span>⚡ GENERATE HOOKS</span>
              </button>
            </form>

            {/* Active AI Generated Banner */}
            {activeGeneratedTopic && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 dark:bg-brand-blue/15 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-blue dark:text-cyan-400">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>✨ AI GENERATED 4 VIRAL HOOKS FOR: "{activeGeneratedTopic.toUpperCase()}"</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setCustomGeneratedHooks(null)
                    setActiveGeneratedTopic('')
                    setCustomTopic('')
                  }}
                  className="text-[11px] font-mono font-bold text-black/60 dark:text-white/60 hover:text-red-500 cursor-pointer"
                >
                  ✕ Clear &amp; Reset
                </button>
              </div>
            )}

            {/* Results Grid */}
            <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${isGenerating ? 'opacity-40' : 'opacity-100'}`}>
              {activeHooks.map((item, idx) => (
                <div
                  key={item.hook}
                  className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:border-brand-blue/40 hover:shadow-lg hover:shadow-brand-blue/10 flex flex-col justify-between gap-4"
                >
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-cyan-400 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {item.type}
                    </span>

                    {/* Viral Retention Score */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400">
                      <span>🔥 {item.score}% RETENTION</span>
                    </div>
                  </div>

                  {/* Hook Text */}
                  <p className="text-sm sm:text-base font-display font-bold leading-snug text-black dark:text-white">
                    "{showTamil ? item.tamil : item.hook}"
                  </p>

                  {/* Bottom Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-[11px] font-mono text-black/40 dark:text-white/40">
                      Ideal length: 2.8s
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(showTamil ? item.tamil : item.hook, idx)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue dark:hover:text-white px-3.5 py-1 text-xs font-mono font-bold text-black/70 dark:text-white/80 transition-all cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <span className="text-emerald-500">✓</span>
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>COPY HOOK</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Conversion Banner for ₹99 Master Bundle */}
            <div className="mt-8 rounded-2xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 via-purple-600/10 to-brand-blue/10 dark:bg-gradient-to-r dark:from-brand-blue/15 dark:via-purple-600/15 dark:to-brand-blue/15 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-brand-blue text-white flex items-center justify-center text-2xl shadow-lg shadow-brand-blue/40">
                  🎬
                </div>
                <div>
                  <h4 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-black dark:text-white">
                    Hooks are only 10% of the game. You need Hollywood sound &amp; visuals.
                  </h4>
                  <p className="text-xs text-black/60 dark:text-white/60 font-sans mt-0.5">
                    Get 55M+ whoosh hits, cinematic LUTs, transitions &amp; viral fonts used by top 1% creators.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playChimeSound()
                  setCheckoutOpen(true)
                }}
                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-dark hover:brightness-110 active:scale-95 text-white px-6 py-3 text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-blue/40 transition-all cursor-pointer"
              >
                <span>GET 55M+ ASSETS — ₹99</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Direct Checkout Modal */}
      {product && (
        <DirectCheckoutModal
          isOpen={checkoutOpen}
          product={product}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </section>
  )
}
