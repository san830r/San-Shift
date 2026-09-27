import { createContext, useContext, useState, useEffect } from 'react'

const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($)' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, label: 'AED (د.إ)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: 'EUR (€)' },
}

const CurrencyContext = createContext({
  currency: CURRENCIES.INR,
  setCurrencyCode: () => {},
  formatPrice: (inr) => `₹${inr}`,
  currencies: CURRENCIES,
})

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState('INR')

  useEffect(() => {
    const saved = localStorage.getItem('san_shift_currency')
    if (saved && CURRENCIES[saved]) {
      setCurrencyCode(saved)
    }
  }, [])

  const handleSetCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyCode(code)
      localStorage.setItem('san_shift_currency', code)
    }
  }

  const currentCurrency = CURRENCIES[currencyCode] || CURRENCIES.INR

  const formatPrice = (inrAmount) => {
    if (inrAmount === null || inrAmount === undefined) return '—'
    const num = typeof inrAmount === 'string' ? parseFloat(inrAmount.replace(/,/g, '')) : inrAmount
    if (isNaN(num)) return inrAmount

    const converted = Math.round(num * currentCurrency.rate)
    if (currentCurrency.code === 'INR') {
      return `₹${num.toLocaleString('en-IN')}`
    }
    return `${currentCurrency.symbol}${converted.toLocaleString()}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency: currentCurrency,
        setCurrencyCode: handleSetCurrency,
        formatPrice,
        currencies: CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
