import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Uncaught Error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleClearCacheAndReload = () => {
    try {
      localStorage.removeItem('san_shift_site_content')
    } catch {
      // ignore
    }
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#070a13] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl space-y-5">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-brand-blue/20 text-brand-blue flex items-center justify-center text-3xl font-black">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-black font-display uppercase tracking-tight text-white">
                SAN SHIFT — Something went wrong
              </h2>
              <p className="mt-2 text-xs text-white/60 leading-relaxed font-sans">
                {this.state.error?.message || 'An unexpected display error occurred while rendering the page.'}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 rounded-full bg-brand-blue hover:bg-brand-blue-dark text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer shadow-lg shadow-brand-blue/30"
              >
                Reload Website
              </button>
              <button
                type="button"
                onClick={this.handleClearCacheAndReload}
                className="w-full py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-mono font-bold text-white/70 transition-all cursor-pointer"
              >
                Reset Cache & Reload
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
