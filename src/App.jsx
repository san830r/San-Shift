import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ContentProvider } from './content/ContentContext'
import { ThemeProvider } from './content/ThemeContext'
import { CurrencyProvider } from './content/CurrencyContext'
import { initSoundState } from './lib/soundFx'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import AnamorphicLensFollower from './components/AnamorphicLensFollower'
import FloatingMobileBar from './components/FloatingMobileBar'
import AICreativeAssistant from './components/AICreativeAssistant'
import SmartWhatsAppModal from './components/SmartWhatsAppModal'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import Refund from './pages/legal/Refund'
import DeliveryPolicy from './pages/legal/DeliveryPolicy'
import NotFound from './pages/NotFound'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import Products from './admin/pages/Products'
import ProductForm from './admin/pages/ProductForm'
import Orders from './admin/pages/Orders'
import Leads from './admin/pages/Leads'
import Vaults from './admin/pages/Vaults'
import Homepage from './admin/pages/Homepage'
import FAQManager from './admin/pages/FAQManager'
import Legal from './admin/pages/Legal'
import Settings from './admin/pages/Settings'
import DataManager from './admin/pages/DataManager'
import { initLenis, destroyLenis, scrollToTarget } from './lib/lenisSetup'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        scrollToTarget(el, { offset: -70, duration: 1.2 })
      }
      return
    }
    scrollToTarget(0, { immediate: true })
  }, [pathname, hash])

  return null
}

function PublicSite() {
  useEffect(() => {
    initLenis()
    return () => {
      destroyLenis()
    }
  }, [])

  return (
    <>
      <AnamorphicLensFollower />
      <ScrollProgress />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <FloatingMobileBar />
      <AICreativeAssistant />
      <SmartWhatsAppModal />
      <Footer />
    </>
  )
}

function AdminSite() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="leads" element={<Leads />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="vaults" element={<Vaults />} />
        <Route path="homepage" element={<Homepage />} />
        <Route path="faq" element={<FAQManager />} />
        <Route path="legal" element={<Legal />} />
        <Route path="settings" element={<Settings />} />
        <Route path="data" element={<DataManager />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  useEffect(() => {
    initSoundState()
  }, [])

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <ContentProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/admin/*" element={<AdminSite />} />
              <Route path="/*" element={<PublicSite />} />
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </CurrencyProvider>
    </ThemeProvider>
  )
}
