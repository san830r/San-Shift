export function IconMarketing({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="14" width="5" height="10" rx="1.5" fill="currentColor" fillOpacity="0.85" />
      <rect x="11.5" y="9" width="5" height="15" rx="1.5" fill="#0038ff" />
      <rect x="19" y="4" width="5" height="20" rx="1.5" fill="#ffd400" />
    </svg>
  )
}

export function IconContent({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="15" height="16" rx="3.5" fill="#050505" />
      <path d="M18 11.5L25 7.5V20.5L18 16.5V11.5Z" fill="#0038ff" />
      <circle cx="10.5" cy="14" r="3" fill="white" />
    </svg>
  )
}

export function IconVideo({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4" width="22" height="20" rx="4" fill="#050505" />
      <rect x="5.5" y="6.5" width="17" height="15" rx="2.5" fill="#12151e" />
      <path d="M12 10.5L18 14L12 17.5V10.5Z" fill="#0038ff" />
    </svg>
  )
}

export function IconMotion({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="12" height="12" rx="3" fill="#0038ff" fillOpacity="0.9" />
      <rect x="12" y="12" width="12" height="12" rx="3" fill="#050505" />
      <rect x="8" y="8" width="12" height="12" rx="3" stroke="#ffd400" strokeWidth="1.8" />
    </svg>
  )
}

export function IconPhoto({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="22" height="18" rx="4" fill="#050505" />
      <circle cx="9.5" cy="10.5" r="2.5" fill="#ffd400" />
      <path d="M5 21L12 14L16 18L19 15L23 21H5Z" fill="#0038ff" />
    </svg>
  )
}

export function IconDigitalProducts({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path d="M9 10V7A5 5 0 0 1 19 7V10" stroke="#ffd400" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="4" y="10" width="20" height="15" rx="3.5" fill="#050505" />
      <path d="M11 15H17" stroke="#0038ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconWebsite({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="22" height="18" rx="4" fill="#050505" />
      <path d="M10 11L7 14L10 17" stroke="#0038ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 11L21 14L18 17" stroke="#0038ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9.5L13 18.5" stroke="#ffd400" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconGrowth({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 3C14 3 21 6 21 14C21 17.5 19 20 19 20L14 17L9 20C9 20 7 17.5 7 14C7 6 14 3 14 3Z"
        fill="#050505"
      />
      <circle cx="14" cy="11" r="2.5" fill="#0038ff" />
      <path d="M14 20V25M11 23L14 26L17 23" stroke="#ffd400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconEditing({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4" width="22" height="20" rx="4" fill="#050505" />
      <rect x="5.5" y="6.5" width="17" height="10" rx="2" fill="#12151e" />
      <path d="M11.5 9L16.5 11.5L11.5 14V9Z" fill="#0038ff" />
      {/* timeline tracks + keyframes */}
      <line x1="5.5" y1="19.5" x2="22.5" y2="19.5" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="9.5" cy="19.5" r="2" fill="#0038ff" />
      <circle cx="15.5" cy="19.5" r="2" fill="#ffd400" />
      <circle cx="20" cy="19.5" r="1.5" fill="#ffffff" fillOpacity="0.8" />
    </svg>
  )
}

export const SERVICE_ICONS = {
  'Digital Marketing': IconMarketing,
  'Content Creation': IconContent,
  'Editing': IconEditing,
  'Video Editing': IconVideo,
  'Motion Graphics': IconMotion,
  'Photo Editing': IconPhoto,
  'Digital Products': IconDigitalProducts,
  'Website Building': IconWebsite,
  'Brand Growth': IconGrowth,
}

