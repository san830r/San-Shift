import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import Services from '../components/Services'
import InstagramReelsCarousel from '../components/InstagramReelsCarousel'
import MarketingFunnelShowcase from '../components/MarketingFunnelShowcase'
import BrandDiagnosticModal from '../components/BrandDiagnosticModal'
import FeaturedProduct from '../components/FeaturedProduct'
import ViralHookGenerator from '../components/ViralHookGenerator'
import Curved3DCarousel from '../components/Curved3DCarousel'
import FeatureStack from '../components/FeatureStack'
import Marquee from '../components/Marquee'
import BrandStrip from '../components/BrandStrip'
import ProductCatalog from '../components/ProductCatalog'
import BrandStatement from '../components/BrandStatement'
import Benefits from '../components/Benefits'
import HowItWorks from '../components/HowItWorks'
import About from '../components/About'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

export default function Home() {
  const location = useLocation()
  const [diagnosticOpen, setDiagnosticOpen] = useState(false)

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(timer)
  }, [location.hash])

  return (
    <>
      {/* 1. Clean, High-End Professional Hero Section */}
      <Hero />

      {/* 2. Flagship Digital Product — Mega Bundle (3D Box, Crown, 99₹ Only, 7 Checklist) */}
      <FeaturedProduct />

      {/* 3. Live Instagram Feed & Reels Showcase (3D Glass Phone Carousel) */}
      <InstagramReelsCarousel />

      {/* 4. EVERYTHING YOUR BRAND NEEDS TO GROW (Curved 3D Showcase & Explore Products) */}
      <Curved3DCarousel />

      {/* 5. Core Services (5-Discipline Interactive 3D Service Cards) */}
      <Services />

      {/* 6. Feature Stack & Product Catalog */}
      <FeatureStack />
      <Marquee />
      <BrandStrip />
      <ProductCatalog />

      {/* 7. Free Interactive Viral Reel Hook Generator */}
      <ViralHookGenerator />

      {/* 8. Brand Statement, Benefits & How It Works */}
      <BrandStatement />
      <Benefits />
      <HowItWorks />

      {/* 9. About & FAQ */}
      <About />
      <FAQ />

      {/* 10. Digital Marketing Engine & ROAS Radar ("PRECISION MARKETING. MEASURABLE ROI.") — Placed at the end */}
      <MarketingFunnelShowcase />

      {/* 11. Contact Us */}
      <Contact />

      {/* Interactive 10-Second Brand Growth Diagnostic Modal */}
      <BrandDiagnosticModal
        isOpen={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
      />
    </>
  )
}
