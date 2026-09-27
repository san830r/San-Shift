# ⚡ SAN SHIFT — Shift The Standard

> **All-In-One Creative Agency & Digital Growth Platform**  
> High-retention video editing, performance marketing, brand scaling, and a 55M+ creator digital asset vault.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-000000?style=flat-square)](https://lenis.darkroom.engineering)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel_Ready-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

---

## 🌟 Highlights & Key Features

- **🎬 3D Interactive Hero Experience**: Smooth looping gradient typography (*"SHIFT THE STANDARD"*), magnetic CTA buttons, dynamic sound FX, and responsive layouts.
- **💎 5 Core Services Showcase**: Interactive cursor-following spotlight cards with bespoke color schemes (Cyan Blue, Sunset Amber, Neon Purple, Cyber Emerald, Electric Rose).
- **📦 55M+ Digital Asset Vault & Catalog**: Dedicated `/catalog` page showcasing digital packs (LUTs, SFX, 4K overlays, viral reels, pro fonts) with 1:1 big artwork presentation and instant checkout.
- **⚡ Smart 1-Click Checkout**: Direct UPI QR payment with instant Google Drive asset delivery and WhatsApp automation.
- **🔒 Executive Admin Dashboard (`/admin`)**: Private backend portal to manage products, pricing, orders, leads CRM, FAQs, and site content in real-time.
- **📱 Fluid Mobile Experience**: Lenis smooth-scroll with modal touch trapping, mobile navigation sheet, and responsive touch gestures.
- **🌓 Dynamic Light & Dark Mode**: Persistent theme switching with automatic system preference detection.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI framework with React Router v7 |
| **Vite 8** | Next-generation frontend tooling and instant HMR |
| **Tailwind CSS v4** | Modern CSS theme engine with custom animations |
| **GSAP & ScrollTrigger** | High-performance magnetic physics and cinematic scroll triggers |
| **Lenis** | Studio-grade smooth scroll engine |
| **Supabase** | Cloud Postgres database, Row Level Security, and live sync |
| **HTML5 Audio API** | Subtle sound design and UI haptic feedback |

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/san-shift.git
cd san-shift
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist` directory.

---

## 🌐 Deploy to Vercel

### Option A: Via GitHub (Recommended)
1. Push this repository to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new) and click **Import** next to your `san-shift` repository.
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**. Your site will be live within 60 seconds!

### Option B: Via Vercel CLI
```bash
npx vercel login
npx vercel --prod
```

---

## 📂 Project Structure

```
san-shift/
├── public/                 # Static assets, favicons, cover posters
├── src/
│   ├── admin/              # Private Admin Dashboard (/admin)
│   ├── assets/             # Brand logos, wordmarks, and media reels
│   ├── components/         # Reusable UI components & interactive widgets
│   ├── content/            # Global content state & default JSON models
│   ├── lib/                # GSAP, Lenis, Supabase, and sound FX helpers
│   ├── pages/              # Route pages (Home, Catalog, ProductDetail, Legal)
│   ├── App.jsx             # Top-level router & layout orchestration
│   ├── index.css           # Tailwind v4 theme definitions & keyframes
│   └── main.jsx            # Application entrypoint
├── vercel.json             # Vercel SPA routing configuration
├── vite.config.js          # Vite configuration
└── package.json            # Project manifest & scripts
```

---

## 📄 License & Credits

© 2026 **SAN SHIFT**. All rights reserved.  
Crafted with passion for creators, editors, and modern brands.
