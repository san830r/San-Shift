import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { defaultContent } from './defaultContent'
import { supabase } from '../lib/supabaseClient'

const LOCAL_STORAGE_KEY = 'san_shift_site_content_v4'

function deepClone(value) {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value))
}

function deepMerge(base, override) {
  if (Array.isArray(base)) return override !== undefined ? override : base
  if (typeof base === 'object' && base !== null && typeof override === 'object' && override !== null) {
    const result = { ...base }
    for (const key of Object.keys(override)) {
      result[key] = deepMerge(base[key], override[key])
    }
    return result
  }
  return override !== undefined ? override : base
}

function deepSet(obj, keys, value) {
  const next = deepClone(obj)
  let cursor = next
  for (let i = 0; i < keys.length - 1; i += 1) {
    cursor = cursor[keys[i]]
  }
  cursor[keys[keys.length - 1]] = value
  return next
}

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price === null ? null : Number(row.price),
    originalPrice: row.original_price === null ? null : Number(row.original_price),
    available: row.available,
    image: row.image ?? '',
    tagline: row.tagline ?? '',
    shortDescription: row.short_description ?? '',
    stats: row.stats ?? [],
  }
}

function productToRow(product, index) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price === '' || product.price === undefined ? null : product.price,
    original_price: product.originalPrice === '' || product.originalPrice === undefined ? null : product.originalPrice,
    available: !!product.available,
    image: product.image ?? '',
    tagline: product.tagline ?? '',
    short_description: product.shortDescription ?? '',
    stats: product.stats ?? [],
    sort_order: index,
  }
}

async function persistProducts(nextProducts, prevProducts) {
  const nextIds = new Set(nextProducts.map((p) => p.id))
  const removedIds = (prevProducts || []).map((p) => p.id).filter((id) => !nextIds.has(id))

  if (removedIds.length > 0) {
    const { error } = await supabase.from('products').delete().in('id', removedIds)
    if (error) throw error
  }

  if (nextProducts.length > 0) {
    const rows = nextProducts.map((p, i) => productToRow(p, i))
    const { error } = await supabase.from('products').upsert(rows)
    if (error) throw error
  }
}

async function persistSiteContent(rest) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 1, data: rest, updated_at: new Date().toISOString() })
  if (error) throw error
}

function omitProducts(obj) {
  const { products: _products, ...rest } = obj
  return rest
}

async function persistAll(next, prev) {
  await Promise.all([persistProducts(next.products, prev?.products), persistSiteContent(omitProducts(next))])
}

function saveLocal(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Could not save to localStorage:', e)
  }
}

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (local) {
        const parsed = JSON.parse(local)
        return deepMerge(deepClone(defaultContent), parsed)
      }
    } catch (e) {
      console.warn('Could not load site content from localStorage:', e)
    }
    return deepClone(defaultContent)
  })
  const contentRef = useRef(content)

  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [productsRes, siteRes] = await Promise.all([
          supabase.from('products').select('*').order('sort_order', { ascending: true }),
          supabase.from('site_content').select('data').eq('id', 1).maybeSingle(),
        ])
        if (cancelled) return

        if (productsRes?.error) console.info('Supabase products check:', productsRes.error.message)
        if (siteRes?.error) console.info('Supabase site content check:', siteRes.error.message)

        const fetchedProducts = productsRes?.data ? productsRes.data.map(rowToProduct) : null
        const siteData = siteRes?.data?.data

        setContent((prev) => {
          let merged = prev
          if (siteData && Object.keys(siteData).length > 0) merged = deepMerge(merged, siteData)
          if (fetchedProducts) merged = { ...merged, products: fetchedProducts }
          return merged
        })
      } catch {
        // Fallback already loaded from localStorage or defaultContent
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const updateContent = useCallback((path, value) => {
    const keys = Array.isArray(path) ? path : path.split('.')
    const prev = contentRef.current
    const next = deepSet(prev, keys, value)
    contentRef.current = next
    setContent(next)
    saveLocal(next)

    const persistPromise =
      keys[0] === 'products' ? persistProducts(next.products, prev.products) : persistSiteContent(omitProducts(next))

    persistPromise.catch((err) => {
      console.info('Supabase sync skipped/deferred (persisted locally):', err?.message || err)
    })
  }, [])

  const replaceContent = useCallback((next) => {
    const prev = contentRef.current
    contentRef.current = next
    setContent(next)
    saveLocal(next)
    persistAll(next, prev).catch((err) => {
      console.info('Supabase sync skipped/deferred (persisted locally):', err?.message || err)
    })
  }, [])

  const resetContent = useCallback(() => {
    const prev = contentRef.current
    const fresh = deepClone(defaultContent)
    contentRef.current = fresh
    setContent(fresh)
    saveLocal(fresh)
    persistAll(fresh, prev).catch((err) => {
      console.info('Supabase sync skipped/deferred (persisted locally):', err?.message || err)
    })
  }, [])

  const resetSection = useCallback((key) => {
    setContent((prev) => {
      const next = { ...prev, [key]: deepClone(defaultContent[key]) }
      contentRef.current = next
      saveLocal(next)
      const persistPromise =
        key === 'products' ? persistProducts(next.products, prev.products) : persistSiteContent(omitProducts(next))
      persistPromise.catch((err) => {
        console.info('Supabase sync skipped/deferred (persisted locally):', err?.message || err)
      })
      return next
    })
  }, [])

  const exportJSON = useCallback(() => JSON.stringify(content, null, 2), [content])

  const importJSON = useCallback((json) => {
    const parsed = JSON.parse(json)
    const prev = contentRef.current
    const next = deepMerge(deepClone(defaultContent), parsed)
    contentRef.current = next
    setContent(next)
    saveLocal(next)
    persistAll(next, prev).catch((err) => {
      console.info('Supabase sync skipped/deferred (persisted locally):', err?.message || err)
    })
  }, [])

  const value = useMemo(
    () => ({ content, setContent, updateContent, replaceContent, resetContent, resetSection, exportJSON, importJSON }),
    [content, updateContent, replaceContent, resetContent, resetSection, exportJSON, importJSON],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within a ContentProvider')
  return ctx
}
