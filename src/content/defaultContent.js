import bundleImage from '../assets/products/biggest-editing-bundle.webp'
import sanshiftReelVideo from '../assets/reels/sanshift-reel.mp4'

export const defaultContent = {
  site: {
    paymentLink: 'PAYMENT_LINK_HERE',
    upiId: 'naveen2006sk-1@oksbi',
    payeeName: 'SAN SHIFT',
    driveLink: 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc',
    featuredProductId: 'biggest-editing-pack',
    featuredUrgencyText: '⚡ Early-Bird Batch: Only 14 Lifetime Passes Left at ₹99!',
    featuredRatingText: '4.9/5 (1,240+ Editors)',
    checkoutMode: 'whatsapp', // 'whatsapp' (chat to buy) or 'direct_upi' (automated on-site checkout)
    contact: {
      email: 'hello.sanshift@gmail.com',
      instagram: '@sanshift',
      whatsapp: '+91 73394 67830',
      facebook: 'San Shift',
      youtube: '@SanShift',
    },
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=61594267786548',
      instagram: 'https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw==',
      youtube: 'https://www.youtube.com/@SanShift',
      whatsapp: 'https://wa.me/917339467830',
    },
    instagramFeedUrl: '',
    customReels: [],
    featuredReel: {
      url: sanshiftReelVideo,
      instagramUrl: 'https://www.instagram.com/reel/DYNPLTZE5Ob/',
      caption: 'How SAN SHIFT crafts thumb-stopping video hooks that boost 3-second watch rate above 85%.',
      creator: 'sanshift',
      likes: '11.2K',
      comments: '1,248',
      shares: '12.8K',
    },
    automation: {
      whatsapp: {
        enabled: true,
        provider: 'green-api',
        instanceId: '710722745793',
        apiToken: 'c3c18f88dab44b3d9c634020256f5e4a892ae6549fea4980bc',
        messageTemplate: `🎉 *SAN SHIFT VIP VAULT UNLOCKED!*\n\nHi {name}! Welcome to the VIP Vault.\nYour payment of *₹{amount}* for *{productName}* is confirmed! ✓\n\n📦 *Order ID:* {orderId}\n💰 *Amount Paid:* ₹{amount}\n\n━━━━━━━━━━━━━━━━━━━━━━\n🚀 *YOUR VIP GOOGLE DRIVE ACCESS LINK:*\n{driveLink}\n━━━━━━━━━━━━━━━━━━━━━━\n\n⭐ *How to use:* Click the link above to download all 55M+ video editing assets, viral reels, LUTs & templates.\n⭐ Add shortcut to your Google Drive for lifetime free updates!\n\n💬 Need help? Reply directly to this WhatsApp message!`,
      },
      email: {
        enabled: true,
        provider: 'resend',
        apiKey: '',
        fromEmail: 'orders@sanshift.com',
        subject: '🎉 Your VIP Access Pass & Official Receipt — {productName}',
      },
    },
  },

  categories: [
    'Digital Bundles',
    'Color & LUTs',
    'Sound Design & SFX',
    'Reels & Social Media',
    'Fonts & Typography',
    'Canva & Templates',
    'Video & Motion',
    'Mobile Editing',
    '3D Assets & Mockups',
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

  products: [
    {
      id: 'biggest-editing-pack',
      name: "World's Biggest Editing Bundle",
      category: 'Digital Bundles',
      price: 99,
      originalPrice: 1000,
      available: true,
      image: bundleImage,
      tagline: 'Edit. Create. Inspire. — All in one pack.',
      shortDescription:
        'The ultimate collection of resources for video editing, content creation and digital marketing — 55M+ assets in one lifetime Google Drive link.',
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
      id: 'cinema-luts-masterpack',
      name: '500+ Cinematic Color LUTs Pack',
      category: 'Color & LUTs',
      price: 49,
      originalPrice: 499,
      available: true,
      image: bundleImage,
      tagline: 'Hollywood-grade color grades for Premiere, DaVinci & FCP.',
      shortDescription:
        'Cinematic color grades calibrated for Sony, Canon, iPhone and LOG footage. Instant one-click drag and drop grading.',
      stats: ['500+ .cube LUTs', 'Sony S-Log3 & Apple Log', 'Teal & Orange, Moody, Vintage', 'Lifetime Free Updates'],
    },
    {
      id: 'ultimate-sfx-soundboard',
      name: '25,000+ Ultimate Creator SFX Pack',
      category: 'Sound Design & SFX',
      price: 49,
      originalPrice: 399,
      available: true,
      image: bundleImage,
      tagline: 'Risers, hits, whooshes, UI pops and viral creator audio.',
      shortDescription:
        'Lossless 24-bit WAV sound effects engineered for retention-focused YouTube videos, Reels and commercial edits.',
      stats: ['25K+ Lossless Audio Files', 'Whooshes, Risers & Braams', 'Foley & UI Feedback Pops', '100% Royalty Free'],
    },
    {
      id: 'viral-reels-30k-vault',
      name: '30,000+ Ready-to-Post Viral Reels Vault',
      category: 'Reels & Social Media',
      price: 49,
      originalPrice: 699,
      available: true,
      image: bundleImage,
      tagline: 'High-retention 4K motivational, luxury and tech reel clips.',
      shortDescription:
        'Faceless reels library ready to post immediately. Includes motivational quotes, luxury aesthetics, AI voiceovers and viral hooks.',
      stats: ['30,000+ 4K Reels', 'Without Any Watermarks', 'Trending Niches Included', 'Instant Drive Delivery'],
    },
    {
      id: 'pro-fonts-typography',
      name: '5,000+ Aesthetic Creator Fonts Collection',
      category: 'Fonts & Typography',
      price: 49,
      originalPrice: 399,
      available: true,
      image: bundleImage,
      tagline: 'High-impact bold, retro, luxury serif and sans-serif fonts.',
      shortDescription:
        'Commercial license typography library for striking YouTube thumbnails, posters, brand identity and video titles.',
      stats: ['5,000+ TTF/OTF Fonts', 'Commercial License Included', 'Thumbnail Header Specials', 'Multi-Language Glyphs'],
    },
    {
      id: 'canva-pro-marketing-kit',
      name: '3 Lakh+ Canva Social & Business Templates',
      category: 'Canva & Templates',
      price: 49,
      originalPrice: 499,
      available: true,
      image: bundleImage,
      tagline: 'Editable carousel, banner, story and marketing templates.',
      shortDescription:
        'Fully customizable Canva templates for coaches, agencies, content creators and businesses. Just click and edit in Canva free or pro.',
      stats: ['3 Lakh+ Templates', 'One-Click Canva Import', 'Instagram Carousels & Stories', 'Presentation Pitch Decks'],
    },
    {
      id: 'vfx-motion-elements',
      name: '1,450+ 4K VFX Overlays & Transition Assets',
      category: 'Video & Motion',
      price: 49,
      originalPrice: 499,
      available: true,
      image: bundleImage,
      tagline: 'Film burns, glitch transitions, glass overlays & particles.',
      shortDescription:
        'Alpha channel transparent overlays that instantly give raw video clips a high-budget cinematic aesthetic.',
      stats: ['1,450+ 4K Assets', 'Alpha Channel ProRes / MP4', 'Glitch & Film Grain', 'Drag & Drop Blend Modes'],
    },
    {
      id: 'anime-vfx-sfx-pack',
      name: 'Anime Action VFX, Speed Lines & Punch SFX',
      category: 'Video & Motion',
      price: 49,
      originalPrice: 299,
      available: true,
      image: bundleImage,
      tagline: 'Anime shockwaves, speed lines, lightning & impact sounds.',
      shortDescription:
        'The essential pack for high-energy gaming edits, anime reels and fast-paced dynamic YouTube shorts.',
      stats: ['350+ Speed Lines & Sparks', 'Impact Sounds & Booms', 'Transparent Alpha MOVs', 'Compatible With CapCut'],
    },
    {
      id: 'mobile-capcut-presets',
      name: 'Mobile CapCut & VN Master Presets Kit',
      category: 'Mobile Editing',
      price: 49,
      originalPrice: 299,
      available: true,
      image: bundleImage,
      tagline: 'One-click mobile color styles, keyframe presets & shakes.',
      shortDescription:
        'Crafted specifically for mobile creators editing on iPhone and Android via CapCut, VN and Alight Motion.',
      stats: ['Mobile-Optimized LUTs', 'Shake & Zoom Animations', 'Easy XML & QR Presets', 'Beginner Friendly'],
    },
    {
      id: '3d-mockups-icons',
      name: '3D Tech & Device Mockups Library',
      category: '3D Assets & Mockups',
      price: 49,
      originalPrice: 399,
      available: true,
      image: bundleImage,
      tagline: 'Isometric 3D illustrations, iPhone clay mockups & icons.',
      shortDescription:
        'High-resolution transparent PNG and PSD mockups to showcase apps, websites, digital products and agency portfolios.',
      stats: ['1,000+ 3D Elements', 'High-Res Transparent PNG', 'Figma & PSD Smart Objects', 'Modern Clay & Glass Styles'],
    },
  ],

  hero: {
    badge: 'CONTENT • MARKETING • EDITING • DIGITAL PRODUCTS • BRAND GROWTH',
    headline: 'SHIFT\nTHE\nSTANDARD.',
    highlightWord: 'SHIFT',
    subtext:
      'Content creation, digital marketing, editing, digital products and brand growth — built to help creators and businesses grow in the digital world.',
    primaryCta: 'Explore Our Services',
    secondaryCta: 'View Our Work',
    footnote: 'Scroll to explore',
    floatingNotes: [
      ['CONTENT', 'MARKETING', 'EDITING', 'DIGITAL PRODUCTS', 'BRAND GROWTH'],
      ['CREATE', 'MARKET', 'EDIT', 'GROW'],
      ['FOR', 'CREATORS', 'BRANDS', 'BUSINESSES', '& YOU'],
    ],
  },

  growthShowcase: {
    badge: 'WHAT WE DO FOR YOU',
    heading: 'EVERYTHING YOUR BRAND',
    headingHighlight: 'NEEDS TO GROW.',
    subtext:
      'No complicated jargon. Clear, high-impact services designed to get you views, followers, customers, and sales.',
    cards: [
      {
        id: 1,
        title: 'Viral Reels & Shorts',
        subtitle: 'Get Millions of Views & Followers',
        category: 'CONTENT CREATION',
        metric: 'VIRAL HOOKS',
        accent: 'from-blue-600 via-indigo-600 to-cyan-500',
        icon: '📱',
        desc: 'High-energy 30-60 second vertical videos with animated subtitles, trending sound effects, and psychology-backed hooks that blow up your reach on Instagram & YouTube.',
        bullets: ['Dynamic Subtitles & Emojis', 'Trending Audio & Studio SFX', '24-48h Express Delivery'],
        serviceKey: 'Content Creation',
        ctaText: 'Order Viral Reels →',
      },
      {
        id: 2,
        title: 'Paid Ads That Bring Sales',
        subtitle: 'Convert Viewers Into Paying Customers',
        category: 'DIGITAL MARKETING',
        metric: '4X - 6X ROAS',
        accent: 'from-emerald-500 via-teal-600 to-blue-700',
        icon: '🛍️',
        desc: 'High-converting video ads engineered specifically for Meta (Facebook & Instagram) and Google that stop the scroll, lower your ad costs, and scale your revenue.',
        bullets: ['Thumb-Stopping Video Hooks', 'Clear Call-To-Actions', 'Full Ad Funnel Retargeting'],
        serviceKey: 'Digital Marketing',
        ctaText: 'Launch Video Ads →',
      },
      {
        id: 3,
        title: 'YouTube & Podcast Videos',
        subtitle: 'Keep Viewers Hooked Till The End',
        category: 'VIDEO EDITING',
        metric: 'HIGH RETENTION',
        accent: 'from-amber-500 via-rose-600 to-purple-800',
        icon: '🎬',
        desc: 'Professional full-length YouTube and podcast video editing with smooth B-rolls, crystal-clear studio audio cleaning, custom sound design, and engaging pacing.',
        bullets: ['Cinema-Grade Audio Cleaning', 'Dynamic B-Roll & Visuals', 'Click-Worthy Packaging'],
        serviceKey: 'Editing',
        ctaText: 'Edit My Video →',
      },
      {
        id: 4,
        title: "World's Biggest Editing Pack",
        subtitle: '55 Million+ Creative Assets (Lifetime)',
        category: 'DIGITAL PRODUCT',
        metric: '₹99 ONLY',
        accent: 'from-purple-600 via-pink-600 to-amber-500',
        icon: '📦',
        desc: 'Instant lifetime Google Drive access to 4,500+ Cinematic LUTs, 10,000+ Studio Sound FX, Transitions, Premiere Pro, After Effects, and Canva templates.',
        bullets: ['Instant Cloud Drive Download', '100% Commercial Lifetime License', 'All Software Supported'],
        isProduct: true,
        ctaText: 'Get The Bundle (₹99) →',
      },
      {
        id: 5,
        title: 'Complete Brand Growth Engine',
        subtitle: 'Full-Service Social Media & Video Partner',
        category: 'BRAND SCALING',
        metric: 'ALL-IN-ONE',
        accent: 'from-cyan-500 via-blue-600 to-slate-900',
        icon: '🚀',
        desc: 'We handle your entire content calendar, daily viral video production, graphic design, and social media advertising so you can focus 100% on running your business.',
        bullets: ['Monthly Video & Post Calendar', 'Dedicated Video Editor & Strategist', 'End-to-End Business Growth'],
        serviceKey: 'Brand Growth',
        ctaText: 'Partner With Us →',
      },
    ],
  },

  services: {
    heading: 'WHAT WE DO',
    subheading: 'Five core capabilities. One creative direction.',
    items: [
      {
        id: 'content',
        number: '01',
        title: 'Content Creation',
        desc: 'Create engaging content for creators, brands and digital audiences.',
        subChips: ['Shorts & Reels', 'Audience Building', 'Viral Concepts', 'Creative Direction'],
      },
      {
        id: 'marketing',
        number: '02',
        title: 'Digital Marketing',
        desc: 'Build reach, visibility and digital growth through strategic marketing.',
        subChips: ['Reach & Scale', 'Paid & Organic', 'Funnel Strategy', 'Campaign Growth'],
      },
      {
        id: 'editing',
        number: '03',
        title: 'Editing',
        desc: 'Professional video, photo and creative editing for digital content.',
        subChips: ['Video Editing', 'Photo Editing', 'Motion Graphics', 'Sound Design'],
        highlightSubservices: true,
      },
      {
        id: 'products',
        number: '04',
        title: 'Digital Products',
        desc: 'Create, market and sell valuable digital products and resources.',
        subChips: ['Asset Packs', 'Preset Libraries', 'Templates', 'Creator Toolkits'],
      },
      {
        id: 'growth',
        number: '05',
        title: 'Brand Growth',
        desc: 'Build stronger digital presence, audience visibility and brand growth.',
        subChips: ['Digital Presence', 'Audience Retention', 'Visual Authority', 'Brand Scaling'],
      },
    ],
  },

  agencyStats: [
    { value: '500+', label: 'Projects' },
    { value: '1K+', label: 'Creators' },
    { value: '50+', label: 'Brands' },
    { value: '100%', label: 'Results Focused' },
  ],

  creativeProcess: {
    heading: 'IDEA → CREATE → REFINE → GROW',
    subheading: 'A continuous cycle designed for rapid iteration, premium execution, and exponential brand scale.',
    steps: [
      {
        number: '01',
        title: 'IDEA',
        desc: 'Uncovering the strategic hook, visual direction, and digital opportunities.',
      },
      {
        number: '02',
        title: 'CREATE',
        desc: 'Content creation, asset design, and digital product conceptualization.',
      },
      {
        number: '03',
        title: 'REFINE',
        desc: 'Professional video editing, photo enhancement, motion graphics, and sound design.',
      },
      {
        number: '04',
        title: 'GROW',
        desc: 'Strategic digital marketing, audience retention, and consistent brand scale.',
      },
    ],
  },

  featureStack: {
    heading: 'FROM IDEA\nTO IMPACT.',
    cards: ['CONTENT', 'MARKETING', 'EDITING', 'DIGITAL PRODUCTS', 'BRAND GROWTH'],
  },

  brandStatement: {
    heading: 'WE CREATE.\nWE EDIT.\nWE GROW.',
    text: 'From content creation and editing to digital marketing, digital products and brand growth — SAN SHIFT helps creators and businesses turn ideas into digital results.',
    cta: "Let's Grow Together",
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
      intro:
        'These Terms & Conditions govern your use of the San Shift website and the purchase of digital products from San Shift.',
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
      intro:
        'Because San Shift products are digital and delivered instantly, our refund policy is outlined below. [EDITABLE: replace with your finalized refund policy.]',
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
      intro:
        'This policy explains how San Shift delivers digital products after purchase. [EDITABLE: replace with your finalized delivery process.]',
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
