import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../../content/ContentContext'
import { useCurrency } from '../../content/CurrencyContext'
import { Field, TextInput, TextArea, Select, StringListEditor, SaveBar } from '../components/Fields'
import BackLink from '../components/BackLink'
import bundleImage from '../../assets/products/biggest-editing-bundle.webp'

function Panel({ title, desc, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0c101c] p-6 shadow-xl space-y-4">
      <h2 className="font-display text-lg font-black text-white uppercase tracking-tight">{title}</h2>
      {desc && <p className="mt-1 text-xs text-white/50">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}

function useSavedFlash() {
  const [saved, setSaved] = useState(false)
  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  return [saved, flash]
}

/* ================= 1. HERO SECTION PANEL ================= */
function HeroPanel() {
  const { content, updateContent } = useContent()
  const [hero, setHero] = useState(content.hero)
  const [saved, flash] = useSavedFlash()

  return (
    <Panel title="Hero Section" desc="The grand top banner visitors see first upon landing.">
      <Field label="Badge Text">
        <TextInput value={hero.badge} onChange={(v) => setHero({ ...hero, badge: v })} />
      </Field>
      <Field label="Headline" hint="Use line breaks to position each row. The highlight word below gets colored brand-blue.">
        <TextArea
          value={hero.headline}
          onChange={(v) => setHero({ ...hero, headline: v })}
          rows={3}
        />
      </Field>
      <Field label="Highlight Word" hint="This exact word is styled in radiant blue.">
        <TextInput value={hero.highlightWord} onChange={(v) => setHero({ ...hero, highlightWord: v })} />
      </Field>
      <Field label="Subtext">
        <TextArea value={hero.subtext} onChange={(v) => setHero({ ...hero, subtext: v })} rows={2} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Primary Button Text">
          <TextInput value={hero.primaryCta} onChange={(v) => setHero({ ...hero, primaryCta: v })} />
        </Field>
        <Field label="Secondary Button Text">
          <TextInput value={hero.secondaryCta} onChange={(v) => setHero({ ...hero, secondaryCta: v })} />
        </Field>
      </div>
      <Field label="Footnote Text">
        <TextInput value={hero.footnote} onChange={(v) => setHero({ ...hero, footnote: v })} />
      </Field>
      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('hero', hero)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 2. FEATURED PRODUCT PANEL ================= */
function FeaturedProductPanel() {
  const { content, updateContent } = useContent()
  const { formatPrice } = useCurrency()
  const [site, setSite] = useState(content.site)
  const [saved, flash] = useSavedFlash()

  const currentProductId = site.featuredProductId || content.products?.[0]?.id
  const currentProduct = content.products?.find((p) => p.id === currentProductId) || content.products?.[0]

  const productOptions = (content.products || []).map((p) => ({
    value: p.id,
    label: `${p.name} (₹${p.price})`,
  }))

  const discount =
    currentProduct?.originalPrice && currentProduct?.price
      ? Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100)
      : null

  return (
    <Panel
      title="Flagship Featured Product Showcase"
      desc="Control which digital asset bundle is featured on the homepage in the grand 3D holographic showcase."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Choose Featured Product" hint="Select from all products in your catalog.">
          <Select
            value={currentProductId}
            onChange={(val) => setSite({ ...site, featuredProductId: val })}
            options={productOptions}
          />
        </Field>
        <Field label="Urgency Banner Notice" hint="High-converting urgency text displayed above the title.">
          <TextInput
            value={site.featuredUrgencyText || ''}
            onChange={(v) => setSite({ ...site, featuredUrgencyText: v })}
            placeholder="⚡ Early-Bird Batch: Only 14 Lifetime Passes Left at ₹99!"
          />
        </Field>
      </div>

      <Field label="Social Proof Rating Text" hint="Rating & customer count shown on the badge.">
        <TextInput
          value={site.featuredRatingText || ''}
          onChange={(v) => setSite({ ...site, featuredRatingText: v })}
          placeholder="4.9/5 (1,240+ Editors)"
        />
      </Field>

      {/* Selected Product Live Preview Card */}
      {currentProduct && (
        <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="h-20 w-24 shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-1">
            <img
              src={currentProduct.image || bundleImage}
              alt={currentProduct.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase text-brand-blue bg-brand-blue/15 px-2 py-0.5 rounded-full border border-brand-blue/30">
                {currentProduct.category || 'DIGITAL PACK'}
              </span>
              {discount && (
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  {discount}% OFF
                </span>
              )}
            </div>
            <h4 className="font-display font-black text-sm sm:text-base text-white truncate">
              {currentProduct.name}
            </h4>
            <div className="flex items-center gap-3 mt-1 text-xs font-mono text-white/60">
              <span className="text-emerald-400 font-bold">
                {currentProduct.price ? formatPrice(currentProduct.price) : 'Free'}
              </span>
              {currentProduct.originalPrice && (
                <span className="line-through text-white/40">
                  {formatPrice(currentProduct.originalPrice)}
                </span>
              )}
              <span>• Drive Link Connected</span>
            </div>
          </div>
          <Link
            to={`/admin/products/${currentProduct.id}`}
            className="shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all"
          >
            Edit Product Details ↗
          </Link>
        </div>
      )}

      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('site', site)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 3. GROWTH SHOWCASE PANEL (3D CURVED CAROUSEL) ================= */
function GrowthShowcasePanel() {
  const { content, updateContent } = useContent()
  const [data, setData] = useState(
    content.growthShowcase || {
      badge: 'WHAT WE DO FOR YOU',
      heading: 'EVERYTHING YOUR BRAND',
      headingHighlight: 'NEEDS TO GROW.',
      subtext: 'No complicated jargon. Clear, high-impact services designed to get you views, followers, customers, and sales.',
      cards: [],
    }
  )
  const [selectedCardIdx, setSelectedCardIdx] = useState(0)
  const [saved, flash] = useSavedFlash()

  const cards = data.cards || []
  const activeCard = cards[selectedCardIdx] || cards[0]

  const updateActiveCard = (field, val) => {
    const nextCards = [...cards]
    nextCards[selectedCardIdx] = { ...nextCards[selectedCardIdx], [field]: val }
    setData({ ...data, cards: nextCards })
  }

  const setBullets = (bullets) => {
    updateActiveCard('bullets', bullets)
  }

  return (
    <Panel
      title='Growth Showcase ("EVERYTHING YOUR BRAND NEEDS TO GROW")'
      desc="The interactive 3D curved carousel positioned directly below Reels showcasing your core growth offerings."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Section Badge">
          <TextInput
            value={data.badge}
            onChange={(v) => setData({ ...data, badge: v })}
            placeholder="WHAT WE DO FOR YOU"
          />
        </Field>
        <Field label="Main Heading">
          <TextInput
            value={data.heading}
            onChange={(v) => setData({ ...data, heading: v })}
            placeholder="EVERYTHING YOUR BRAND"
          />
        </Field>
        <Field label="Highlight Text (Blue)">
          <TextInput
            value={data.headingHighlight}
            onChange={(v) => setData({ ...data, headingHighlight: v })}
            placeholder="NEEDS TO GROW."
          />
        </Field>
      </div>

      <Field label="Subtext Paragraph">
        <TextArea
          value={data.subtext}
          onChange={(v) => setData({ ...data, subtext: v })}
          rows={2}
          placeholder="No complicated jargon..."
        />
      </Field>

      {/* Card Selector Tabs */}
      <div className="pt-2 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70">
            Showcase Cards ({cards.length})
          </span>
          <span className="text-xs font-mono text-brand-blue">
            Card {selectedCardIdx + 1} of {cards.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {cards.map((card, idx) => (
            <button
              key={card.id || idx}
              type="button"
              onClick={() => setSelectedCardIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCardIdx === idx
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span>{card.icon || '⚡'}</span>
              <span>{card.title || `Card ${idx + 1}`}</span>
            </button>
          ))}
        </div>

        {/* Selected Card Editor */}
        {activeCard && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Card Title">
                <TextInput
                  value={activeCard.title || ''}
                  onChange={(v) => updateActiveCard('title', v)}
                  placeholder="e.g. Viral Reels & Shorts"
                />
              </Field>
              <Field label="Subtitle / Promise">
                <TextInput
                  value={activeCard.subtitle || ''}
                  onChange={(v) => updateActiveCard('subtitle', v)}
                  placeholder="e.g. Get Millions of Views"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Icon Emoji">
                  <TextInput
                    value={activeCard.icon || ''}
                    onChange={(v) => updateActiveCard('icon', v)}
                    placeholder="📱"
                  />
                </Field>
                <Field label="Metric Chip">
                  <TextInput
                    value={activeCard.metric || ''}
                    onChange={(v) => updateActiveCard('metric', v)}
                    placeholder="VIRAL HOOKS"
                  />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Category Tag">
                <TextInput
                  value={activeCard.category || ''}
                  onChange={(v) => updateActiveCard('category', v)}
                  placeholder="CONTENT CREATION"
                />
              </Field>
              <Field label="CTA Button Text">
                <TextInput
                  value={activeCard.ctaText || ''}
                  onChange={(v) => updateActiveCard('ctaText', v)}
                  placeholder="Order Viral Reels →"
                />
              </Field>
            </div>

            <Field label="Detailed Description">
              <TextArea
                value={activeCard.desc || ''}
                onChange={(v) => updateActiveCard('desc', v)}
                rows={2}
                placeholder="High-energy 30-60 second vertical videos..."
              />
            </Field>

            <Field label="Bullet Points (Features Included)">
              <StringListEditor
                items={activeCard.bullets || []}
                onChange={setBullets}
                placeholder="Add bullet point (e.g. Dynamic Subtitles & Emojis)..."
              />
            </Field>
          </div>
        )}
      </div>

      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('growthShowcase', data)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 4. CORE SERVICES PANEL (5 DISCIPLINES) ================= */
function ServicesPanel() {
  const { content, updateContent } = useContent()
  const [services, setServices] = useState(
    content.services || {
      heading: 'WHAT WE DO',
      subheading: 'Five core capabilities. One creative direction.',
      items: [],
    }
  )
  const [saved, flash] = useSavedFlash()

  const setItem = (i, field, value) => {
    const items = [...(services.items || [])]
    items[i] = { ...items[i], [field]: value }
    setServices({ ...services, items })
  }

  const setSubChips = (i, chips) => {
    const items = [...(services.items || [])]
    items[i] = { ...items[i], subChips: chips }
    setServices({ ...services, items })
  }

  return (
    <Panel title="Services Section (5 Core Disciplines)" desc="The 5 primary capabilities displayed on the homepage.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Heading">
          <TextInput value={services.heading} onChange={(v) => setServices({ ...services, heading: v })} />
        </Field>
        <Field label="Subheading">
          <TextInput value={services.subheading} onChange={(v) => setServices({ ...services, subheading: v })} />
        </Field>
      </div>

      <div className="space-y-4 pt-2">
        {(services.items || []).map((item, i) => (
          <div key={item.id || i} className="rounded-2xl border border-white/10 p-4 space-y-3 bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-white/50">
              <span className="text-brand-blue">{item.number || `0${i + 1}`} // DISCIPLINE</span>
              <span className="text-white font-bold">{item.title}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <Field label="Title">
                  <TextInput
                    value={item.title}
                    onChange={(v) => setItem(i, 'title', v)}
                    placeholder="Service Title"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <TextInput
                    value={item.desc}
                    onChange={(v) => setItem(i, 'desc', v)}
                    placeholder="Description"
                  />
                </Field>
              </div>
            </div>
            <Field label="Sub-Pills / Specializations (Chips)">
              <StringListEditor
                items={item.subChips || []}
                onChange={(chips) => setSubChips(i, chips)}
                placeholder="e.g. Viral Concepts, Reels..."
              />
            </Field>
          </div>
        ))}
      </div>

      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('services', services)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 5. CREATIVE PROCESS PANEL ================= */
function CreativeProcessPanel() {
  const { content, updateContent } = useContent()
  const [processData, setProcessData] = useState(
    content.creativeProcess || {
      heading: 'IDEA → CREATE → REFINE → GROW',
      subheading: 'A continuous cycle designed for rapid iteration, premium execution, and exponential brand scale.',
      steps: [
        { number: '01', title: 'IDEA', desc: 'Uncovering the strategic hook, visual direction, and digital opportunities.' },
        { number: '02', title: 'CREATE', desc: 'Content creation, asset design, and digital product conceptualization.' },
        { number: '03', title: 'REFINE', desc: 'Professional video editing, photo enhancement, motion graphics, and sound design.' },
        { number: '04', title: 'GROW', desc: 'Strategic digital marketing, audience retention, and consistent brand scale.' },
      ],
    }
  )
  const [saved, flash] = useSavedFlash()

  const setStep = (i, field, value) => {
    const steps = [...processData.steps]
    steps[i] = { ...steps[i], [field]: value }
    setProcessData({ ...processData, steps })
  }

  return (
    <Panel
      title='Creative Process Pipeline ("IDEA → CREATE → REFINE → GROW")'
      desc="The connected SVG pipeline section showcasing how San Shift executes from start to finish."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Heading">
          <TextInput
            value={processData.heading}
            onChange={(v) => setProcessData({ ...processData, heading: v })}
          />
        </Field>
        <Field label="Subheading">
          <TextInput
            value={processData.subheading}
            onChange={(v) => setProcessData({ ...processData, subheading: v })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {processData.steps.map((step, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-3.5 bg-white/[0.02] space-y-2">
            <span className="text-[10px] font-mono font-bold text-brand-blue uppercase">
              Step {step.number || `0${i + 1}`}
            </span>
            <TextInput
              value={step.title}
              onChange={(v) => setStep(i, 'title', v)}
              placeholder="Step Title"
            />
            <TextArea
              value={step.desc}
              onChange={(v) => setStep(i, 'desc', v)}
              placeholder="Step Description"
              rows={2}
            />
          </div>
        ))}
      </div>

      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('creativeProcess', processData)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 6. BRAND STATEMENT PANEL ================= */
function BrandStatementPanel() {
  const { content, updateContent } = useContent()
  const [brandStatement, setBrandStatement] = useState(
    content.brandStatement || {
      heading: 'WE CREATE.\nWE BUILD.\nWE GROW.',
      text: 'From content creation and editing to digital marketing, digital products and brand growth — SAN SHIFT helps creators and businesses turn ideas into digital results.',
      cta: "Let's Grow Together",
    }
  )
  const [saved, flash] = useSavedFlash()

  return (
    <Panel
      title='Brand Statement / Manifesto'
      desc='The large typography statement section: "WE CREATE. WE BUILD. WE GROW."'
    >
      <Field label="Big Headline" hint="One line per row. The middle row is rendered in brand blue.">
        <TextArea
          value={brandStatement.heading}
          onChange={(v) => setBrandStatement({ ...brandStatement, heading: v })}
          rows={3}
        />
      </Field>
      <Field label="Description Text">
        <TextArea
          value={brandStatement.text}
          onChange={(v) => setBrandStatement({ ...brandStatement, text: v })}
          rows={2}
        />
      </Field>
      <Field label="CTA Button Text">
        <TextInput
          value={brandStatement.cta}
          onChange={(v) => setBrandStatement({ ...brandStatement, cta: v })}
          placeholder="Let's Grow Together"
        />
      </Field>
      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('brandStatement', brandStatement)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 7. TRUST STRIP & MARQUEE PANELS ================= */
function BrandStripPanel() {
  const { content, updateContent } = useContent()
  const [items, setItems] = useState(content.brandStrip || [])
  const [saved, flash] = useSavedFlash()

  return (
    <Panel title="Trust Badges Strip" desc="Small trust badges shown horizontally below the hero.">
      <StringListEditor items={items} onChange={setItems} placeholder="e.g. Instant Access" />
      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('brandStrip', items.filter((i) => i.trim()))
          flash()
        }}
      />
    </Panel>
  )
}

function MarqueePanel() {
  const { content, updateContent } = useContent()
  const [items, setItems] = useState(content.marquee || [])
  const [saved, flash] = useSavedFlash()

  return (
    <Panel title="Scrolling Marquee Ticker" desc="The continuous scrolling ticker banner across the screen.">
      <StringListEditor items={items} onChange={setItems} placeholder="e.g. CREATOR FOCUSED" />
      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('marquee', items.filter((i) => i.trim()))
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 8. ABOUT SECTION PANEL ================= */
function AboutPanel() {
  const { content, updateContent } = useContent()
  const [about, setAbout] = useState(content.about)
  const [saved, flash] = useSavedFlash()

  return (
    <Panel title="About Section" desc="Company description & philosophy on the homepage.">
      <Field label="Eyebrow Label">
        <TextInput value={about.eyebrow} onChange={(v) => setAbout({ ...about, eyebrow: v })} />
      </Field>
      <Field label="Heading">
        <TextInput value={about.heading} onChange={(v) => setAbout({ ...about, heading: v })} />
      </Field>
      <Field label="Paragraphs" hint="Each row is a separate paragraph.">
        <StringListEditor
          items={about.paragraphs}
          onChange={(v) => setAbout({ ...about, paragraphs: v })}
          placeholder="Write a paragraph..."
        />
      </Field>
      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('about', { ...about, paragraphs: about.paragraphs.filter((p) => p.trim()) })
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 9. BENEFITS PANEL ("Why San Shift") ================= */
function BenefitsPanel() {
  const { content, updateContent } = useContent()
  const [benefits, setBenefits] = useState(content.benefits)
  const [saved, flash] = useSavedFlash()

  const setItem = (i, field, value) => {
    const items = [...benefits.items]
    items[i] = { ...items[i], [field]: value }
    setBenefits({ ...benefits, items })
  }
  const removeItem = (i) => setBenefits({ ...benefits, items: benefits.items.filter((_, idx) => idx !== i) })
  const addItem = () => setBenefits({ ...benefits, items: [...benefits.items, { title: '', desc: '' }] })

  return (
    <Panel title='"Why San Shift" Benefits Grid'>
      <Field label="Heading">
        <TextInput value={benefits.heading} onChange={(v) => setBenefits({ ...benefits, heading: v })} />
      </Field>
      <div className="space-y-3">
        {benefits.items.map((item, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:items-center">
            <input
              value={item.title}
              onChange={(e) => setItem(i, 'title', e.target.value)}
              placeholder="Benefit Title"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-blue sm:w-48"
            />
            <input
              value={item.desc}
              onChange={(e) => setItem(i, 'desc', e.target.value)}
              placeholder="Description"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-blue"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="shrink-0 self-end rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-white/50 hover:border-red-400 hover:text-red-400 sm:self-auto"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-dashed border-white/20 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide text-white/60 hover:border-brand-blue hover:text-brand-blue cursor-pointer"
        >
          + Add Benefit
        </button>
      </div>
      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('benefits', benefits)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 10. HOW IT WORKS PANEL ================= */
function HowItWorksPanel() {
  const { content, updateContent } = useContent()
  const [howItWorks, setHowItWorks] = useState(content.howItWorks)
  const [saved, flash] = useSavedFlash()

  const setStep = (i, field, value) => {
    const steps = [...howItWorks.steps]
    steps[i] = { ...steps[i], [field]: value }
    setHowItWorks({ ...howItWorks, steps })
  }
  const removeStep = (i) => setHowItWorks({ ...howItWorks, steps: howItWorks.steps.filter((_, idx) => idx !== i) })
  const addStep = () => setHowItWorks({ ...howItWorks, steps: [...howItWorks.steps, { title: '', desc: '' }] })

  return (
    <Panel title='"How It Works" Steps'>
      <Field label="Heading">
        <TextInput value={howItWorks.heading} onChange={(v) => setHowItWorks({ ...howItWorks, heading: v })} />
      </Field>
      <div className="space-y-3">
        {howItWorks.steps.map((step, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:items-center">
            <span className="shrink-0 text-xs font-mono font-bold text-brand-blue sm:w-16">Step {i + 1}</span>
            <input
              value={step.title}
              onChange={(e) => setStep(i, 'title', e.target.value)}
              placeholder="Title"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-blue sm:w-48"
            />
            <input
              value={step.desc}
              onChange={(e) => setStep(i, 'desc', e.target.value)}
              placeholder="Description"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-blue"
            />
            <button
              type="button"
              onClick={() => removeStep(i)}
              className="shrink-0 self-end rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-white/50 hover:border-red-400 hover:text-red-400 sm:self-auto"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="rounded-full border border-dashed border-white/20 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide text-white/60 hover:border-brand-blue hover:text-brand-blue cursor-pointer"
        >
          + Add Step
        </button>
      </div>
      <SaveBar
        saved={saved}
        onSave={() => {
          updateContent('howItWorks', howItWorks)
          flash()
        }}
      />
    </Panel>
  )
}

/* ================= 11. MAIN HOMEPAGE CMS CONTROLLER ================= */
export default function Homepage() {
  return (
    <div className="space-y-6">
      <BackLink />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Homepage Content CMS
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Edit every headline, service, showcase card, and statement across the live store.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* 1. Hero Section */}
        <HeroPanel />

        {/* 2. Flagship Featured Product Selector */}
        <FeaturedProductPanel />

        {/* 3. Everything Your Brand Needs To Grow (3D Carousel) */}
        <GrowthShowcasePanel />

        {/* 4. Core Services (5 Disciplines) */}
        <ServicesPanel />

        {/* 5. Creative Process Pipeline */}
        <CreativeProcessPanel />

        {/* 6. Brand Statement Manifesto */}
        <BrandStatementPanel />

        {/* 7. Benefits ("Why San Shift") */}
        <BenefitsPanel />

        {/* 8. How It Works */}
        <HowItWorksPanel />

        {/* 9. About Section */}
        <AboutPanel />

        {/* 10. Trust Badges Strip */}
        <BrandStripPanel />

        {/* 11. Scrolling Marquee */}
        <MarqueePanel />
      </div>
    </div>
  )
}
