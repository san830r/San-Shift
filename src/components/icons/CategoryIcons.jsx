function IconEditingPacks({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="9" width="7" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="9" width="7" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="0.5 3" />
    </svg>
  )
}

function IconPremiumPresets({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 12h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 18h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="6" r="2" fill="currentColor" />
      <circle cx="16" cy="12" r="2" fill="currentColor" />
      <circle cx="11" cy="18" r="2" fill="currentColor" />
    </svg>
  )
}

function IconVideoResources({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.2 8.7v6.6l5.6-3.3-5.6-3.3Z" fill="currentColor" />
    </svg>
  )
}

function IconDesignAssets({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="16.5" r="4.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconCreatorTools({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconDigitalBundles({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 8 12 4l9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 8v8l9 4 9-4V8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 12v8" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export const CATEGORY_ICONS = {
  'Editing Packs': IconEditingPacks,
  'Premium Presets': IconPremiumPresets,
  'Video Resources': IconVideoResources,
  'Design Assets': IconDesignAssets,
  'Creator Tools': IconCreatorTools,
  'Digital Bundles': IconDigitalBundles,
}
