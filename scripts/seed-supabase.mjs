// One-time migration: pushes the site's original default content into Supabase.
// Run once, after `supabase/schema.sql` has been applied:
//
//   npm run seed
//
// Uses the service role key (server-side only, bypasses RLS) from .env —
// never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
//
// This intentionally duplicates the shape of src/content/defaultContent.js
// rather than importing it, because that file imports a .webp asset via
// Vite's bundler pipeline, which plain Node can't resolve. If you change
// defaultContent.js before running this for the first time, mirror the
// change here too.

import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env (see .env.example).')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function uploadBundleImage() {
  const filePath = path.join(__dirname, '..', 'src', 'assets', 'products', 'biggest-editing-bundle.webp')
  const file = readFileSync(filePath)
  const storagePath = 'biggest-editing-bundle.webp'
  const { error } = await supabase.storage
    .from('product-images')
    .upload(storagePath, file, { contentType: 'image/webp', upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(storagePath)
  return data.publicUrl
}

function buildSeed(bundleImageUrl) {
  const products = [
    {
      id: 'biggest-editing-pack',
      name: "World's Biggest Editing Bundle",
      category: 'Digital Bundles',
      price: 99,
      original_price: 1000,
      available: true,
      image: bundleImageUrl,
      tagline: 'Edit. Create. Inspire. — All in one pack.',
      short_description:
        'The ultimate collection of resources for video editing, content creation and digital marketing — one pack, endless creativity.',
      stats: [
        '55M+ Digital Products',
        '3 Lakh+ Ebooks & Articles',
        '30K+ Viral Reels',
        '1 Lakh+ Video Editing Assets',
        '1,450+ Motion Graphics & Motivational Reels',
        '3 Lakh+ Canva Templates',
      ],
    },
    {
      id: 'premium-presets-vol-1',
      name: 'Premium Presets Vol. 1',
      category: 'Premium Presets',
      price: null,
      original_price: null,
      available: false,
      image: '',
      tagline: 'Color grading presets for modern content.',
      short_description: 'A curated set of premium presets built for consistent, professional-grade color grading.',
      stats: [],
    },
    {
      id: 'video-resource-kit',
      name: 'Video Resource Kit',
      category: 'Video Resources',
      price: null,
      original_price: null,
      available: false,
      image: '',
      tagline: 'Core video resources for everyday editing.',
      short_description: 'Essential video resources built to support fast, reliable content production.',
      stats: [],
    },
    {
      id: 'design-asset-library',
      name: 'Design Asset Library',
      category: 'Design Assets',
      price: null,
      original_price: null,
      available: false,
      image: '',
      tagline: 'Design assets for creators and editors.',
      short_description: 'A growing library of design assets for thumbnails, graphics and layouts.',
      stats: [],
    },
    {
      id: 'creator-tools-suite',
      name: 'Creator Tools Suite',
      category: 'Creator Tools',
      price: null,
      original_price: null,
      available: false,
      image: '',
      tagline: 'Tools built around real creator workflows.',
      short_description: 'A suite of practical tools designed to simplify the content creation process.',
      stats: [],
    },
    {
      id: 'digital-bundle-pro',
      name: 'Digital Bundle Pro',
      category: 'Digital Bundles',
      price: null,
      original_price: null,
      available: false,
      image: '',
      tagline: 'Bundled resources for complete workflows.',
      short_description: 'A bundled collection combining multiple resource types into one complete package.',
      stats: [],
    },
  ].map((p, i) => ({ ...p, sort_order: i }))

  const siteContentData = {
    site: {
      paymentLink: 'PAYMENT_LINK_HERE',
      featuredProductId: 'biggest-editing-pack',
      contact: {
        email: 'hello.sanshift@gmail.com',
        instagram: '@sanshift',
        whatsapp: '+91 73394 67830',
        facebook: 'San Shift',
      },
      socials: {
        facebook: 'https://www.facebook.com/profile.php?id=61594267786548',
        instagram: 'https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw==',
        youtube: 'https://www.youtube.com/@SanShift',
        whatsapp: 'https://wa.me/917339467830',
      },
    },
    categories: [
      'Editing Packs',
      'Premium Presets',
      'Video Resources',
      'Design Assets',
      'Creator Tools',
      'Digital Bundles',
    ],
    whatsInside: [
      { title: 'Video Editing Assets', desc: 'Premium assets for every edit.' },
      { title: 'Motion Graphics', desc: 'Animated elements for titles & scenes.' },
      { title: 'Transitions & Effects', desc: 'Smooth transitions and creative effects.' },
      { title: 'Sound Effects & Music', desc: 'Audio and music for your projects.' },
      { title: 'LUTs & Color Grades', desc: 'Cinematic color grading presets.' },
      { title: 'Templates', desc: 'Blog, thumbnail & social templates.' },
      { title: 'Canva Templates', desc: 'Editable templates built for Canva.' },
      { title: 'Ebooks & Articles', desc: 'A library of ebooks and articles.' },
      { title: 'Fonts Collection', desc: 'Premium fonts for every project.' },
      { title: 'PNG & Icons', desc: 'Transparent PNGs and icon packs.' },
      { title: 'Reels Templates', desc: 'Trending templates for Reels.' },
      { title: 'YouTube Assets', desc: 'Thumbnails, banners & YouTube assets.' },
      { title: 'Social Media Templates', desc: 'Templates for every social platform.' },
      { title: 'Marketing Materials', desc: 'Ready-to-use marketing creatives.' },
      { title: 'Logo Templates', desc: 'Editable logo design templates.' },
      { title: 'Graphic Design Assets', desc: 'Assets for everyday design work.' },
      { title: 'Presentation Templates', desc: 'Professional presentation templates.' },
      { title: 'Overlays & Borders', desc: 'Creative overlays and border frames.' },
      { title: 'Backgrounds & Wallpapers', desc: 'High-quality backgrounds and wallpapers.' },
      { title: 'Mockups', desc: 'Realistic product and device mockups.' },
      { title: '3D Assets', desc: 'Ready-to-use 3D design assets.' },
      { title: 'Text Effects', desc: 'Stylized, editable text effects.' },
      { title: 'Stock Videos', desc: 'Royalty-free stock video clips.' },
      { title: 'Stock Photos', desc: 'High-resolution stock photography.' },
      { title: 'AI Tools Guide', desc: 'Guides for popular AI tools.' },
      { title: 'Mobile Editing Pack', desc: 'Editing resources for mobile apps.' },
      { title: 'Lightroom Presets', desc: 'One-click presets for Lightroom.' },
      { title: 'CapCut Templates', desc: 'Ready-to-use CapCut templates.' },
      { title: 'Cinematic Textures', desc: 'Film grain and cinematic textures.' },
      { title: 'Business & Productivity', desc: 'Templates for business and productivity.' },
      { title: 'Motivational Reels', desc: 'Ready-to-post motivational reel content.' },
      { title: 'VFX & Elements', desc: 'Visual effects elements for editing.' },
      { title: 'Game Assets', desc: 'Assets for game design projects.' },
      { title: 'Web Templates', desc: 'Templates for websites and landing pages.' },
      { title: 'Code Snippets', desc: 'Handy code snippets and templates.' },
      { title: 'And Much More', desc: 'Plus a growing library of extras.' },
    ],
    hero: {
      badge: 'All Creative & Digital Solutions',
      headline: 'SHIFT\nTHE\nSTANDARD.',
      highlightWord: 'SHIFT',
      subtext:
        'Creative tools. Digital solutions. Real growth. Everything you need to create, build and grow in the digital world.',
      primaryCta: 'Explore Our Services',
      secondaryCta: 'View Our Work',
      footnote: 'Scroll to explore',
      floatingNotes: [
        ['IDEAS', 'TOOLS', 'STRATEGY', 'GROWTH'],
        ['CREATE', 'EDIT', 'GROW', 'REPEAT'],
        ['FOR', 'CREATORS', 'BRANDS', 'BUSINESSES', '& YOU'],
      ],
    },
    services: {
      heading: 'WHAT WE DO',
      subheading: 'Creative ideas. Digital execution.\nEverything your brand needs to grow.',
      items: [
        { title: 'Digital Marketing', desc: 'Build visibility, reach and measurable growth.' },
        { title: 'Content Creation', desc: 'Create content that captures attention and builds identity.' },
        { title: 'Video Editing', desc: 'Transform raw footage into engaging visual stories.' },
        { title: 'Motion Graphics', desc: 'Bring ideas to life through motion and visual effects.' },
        { title: 'Photo Editing', desc: 'Professional visual editing for brands and creators.' },
        { title: 'Digital Products', desc: 'Create, package and sell valuable digital products.' },
        { title: 'Website Building', desc: 'Build modern, responsive websites that convert.' },
        { title: 'Brand Growth', desc: 'Combine creativity, strategy and digital execution.' },
      ],
    },
    agencyStats: [
      { value: '500+', label: 'Projects' },
      { value: '1K+', label: 'Creators' },
      { value: '50+', label: 'Brands' },
      { value: '100%', label: 'Results Focused' },
    ],
    featureStack: {
      heading: 'FROM IDEA\nTO IMPACT.',
      cards: ['CREATE', 'BUILD', 'EDIT', 'MARKET', 'SELL', 'GROW'],
    },
    brandStatement: {
      heading: 'WE CREATE.\nWE BUILD.\nWE GROW.',
      text: 'From creative execution to digital growth, SAN SHIFT helps creators, brands and businesses turn ideas into digital results.',
      cta: "Let's Build Together",
    },
    brandStrip: ['Digital Products', 'Creative Resources', 'Instant Access', 'Creator Focused'],
    marquee: ['PREMIUM DIGITAL RESOURCES', 'CREATOR FOCUSED', 'INSTANT ACCESS', 'BUILT FOR EDITORS'],
    about: {
      eyebrow: 'About San Shift',
      heading: 'SHIFT THE WAY YOU CREATE.',
      paragraphs: [
        'San Shift is a digital creative brand focused on providing practical, premium resources for editors, creators and content professionals.',
        'Every product is built around real editing and content-production needs — designed to help you move faster without compromising on quality.',
      ],
    },
    benefits: {
      heading: 'BUILT FOR CREATORS WHO WANT TO SHIFT THEIR CONTENT.',
      items: [
        { title: 'Fast Workflow', desc: 'Save editing time with ready-to-use creative resources.' },
        { title: 'Premium Quality', desc: 'Designed for modern content creation workflows.' },
        { title: 'Creator Focused', desc: 'Built around real editing and content-production needs.' },
        { title: 'Easy Access', desc: 'Simple digital purchasing and delivery experience.' },
      ],
    },
    howItWorks: {
      heading: 'HOW IT WORKS',
      steps: [
        { title: 'Choose', desc: 'Browse the San Shift catalog.' },
        { title: 'Purchase', desc: 'Select your digital product and complete payment.' },
        { title: 'Create', desc: 'Access your resources and start creating.' },
      ],
    },
    faqs: [
      {
        q: 'What is San Shift?',
        a: 'San Shift is a digital creative brand that provides premium editing resources, creative assets and digital tools built for creators, editors and content professionals.',
      },
      {
        q: "What is included in the World's Biggest Editing Bundle?",
        a: "The World's Biggest Editing Bundle includes a huge collection of digital resources — video editing assets, motion graphics, transitions, presets, templates, ebooks and much more. Full details are available on the product page.",
      },
      {
        q: 'How will I receive my digital product?',
        a: 'Digital products are delivered electronically after purchase. [EDITABLE: add your exact delivery method — e.g. instant download link, email delivery, or access page.]',
      },
      {
        q: 'Is this a physical product?',
        a: 'No. All San Shift products are digital and delivered electronically — there is no physical shipment.',
      },
      {
        q: 'Can I use the resources for content creation?',
        a: 'Yes, resources are intended for use in your own content creation and editing projects. [EDITABLE: add specific usage/licensing terms here.]',
      },
      {
        q: 'What payment methods are available?',
        a: '[EDITABLE: list the payment methods you accept, e.g. UPI, cards, net banking, once your payment link is connected.]',
      },
      {
        q: 'What is your refund policy?',
        a: '[EDITABLE: add your refund policy details here. See the Refund Policy page for the full placeholder.]',
      },
    ],
    legal: {
      privacy: {
        title: 'Privacy Policy',
        updated: 'Last updated: [EDITABLE DATE]',
        intro:
          'This Privacy Policy explains how San Shift ("we", "us") collects, uses and protects information when you visit this website or purchase a digital product.',
        sections: [
          {
            heading: 'Information We Collect',
            body: '[EDITABLE: describe what information you collect — e.g. name, email address, and any details submitted through the contact form or at checkout.]',
          },
          {
            heading: 'How We Use Information',
            body: '[EDITABLE: describe how collected information is used — e.g. to deliver digital products, respond to inquiries, and improve our services.]',
          },
          {
            heading: 'Third-Party Services',
            body: '[EDITABLE: list any third-party services used for payments, analytics, or delivery, and how they handle data.]',
          },
        ],
      },
      terms: {
        title: 'Terms & Conditions',
        updated: 'Last updated: [EDITABLE DATE]',
        intro: 'These Terms & Conditions govern your use of the San Shift website and the purchase of digital products from San Shift.',
        sections: [
          {
            heading: 'Use of Products',
            body: '[EDITABLE: describe how customers may use purchased digital products, including any licensing or usage restrictions.]',
          },
          {
            heading: 'Intellectual Property',
            body: 'All resources, branding and content on this website remain the property of San Shift unless otherwise stated. [EDITABLE: expand with your specific IP terms.]',
          },
          { heading: 'Payments', body: '[EDITABLE: describe accepted payment methods and any applicable taxes or fees.]' },
          { heading: 'Limitation of Liability', body: '[EDITABLE: add your liability limitation terms here.]' },
        ],
      },
      refund: {
        title: 'Refund Policy',
        updated: 'Last updated: [EDITABLE DATE]',
        intro: 'Because San Shift products are digital and delivered instantly, our refund policy is outlined below. [EDITABLE: replace with your finalized refund policy.]',
        sections: [
          {
            heading: 'Eligibility',
            body: '[EDITABLE: describe the conditions under which a refund may or may not be issued.]',
          },
          {
            heading: 'How to Request a Refund',
            body: '[EDITABLE: add your request process and timeframe. Customers will be told to contact your support email.]',
          },
          { heading: 'Processing Time', body: '[EDITABLE: state how long refunds take to process once approved.]' },
        ],
      },
      delivery: {
        title: 'Digital Product Delivery Policy',
        updated: 'Last updated: [EDITABLE DATE]',
        intro: 'This policy explains how San Shift delivers digital products after purchase. [EDITABLE: replace with your finalized delivery process.]',
        sections: [
          {
            heading: 'Delivery Method',
            body: '[EDITABLE: describe exactly how digital products are delivered — e.g. instant download, email link, access page.]',
          },
          {
            heading: 'Delivery Time',
            body: '[EDITABLE: state how quickly customers receive access after completing payment.]',
          },
          {
            heading: 'Access Issues',
            body: "If you experience any issue accessing your purchase, contact us and we'll help resolve it.",
          },
        ],
      },
    },
  }

  return { products, siteContentData }
}

async function main() {
  console.log('Uploading bundle product image to Storage…')
  const bundleImageUrl = await uploadBundleImage()

  const { products, siteContentData } = buildSeed(bundleImageUrl)

  console.log(`Seeding ${products.length} products…`)
  const { error: productsError } = await supabase.from('products').upsert(products)
  if (productsError) throw productsError

  console.log('Seeding site content…')
  const { error: siteError } = await supabase
    .from('site_content')
    .upsert({ id: 1, data: siteContentData, updated_at: new Date().toISOString() })
  if (siteError) throw siteError

  console.log('Done. Your Supabase project now has the default San Shift content.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
