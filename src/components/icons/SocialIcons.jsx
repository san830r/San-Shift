export function IconInstagram({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function IconFacebook({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M13.6 21v-6.8h2.1l.3-2.5h-2.4V9.9c0-.72.2-1.22 1.24-1.22h1.32V6.44c-.23-.03-1-.1-1.9-.1-1.9 0-3.2 1.16-3.2 3.28v1.98H8.9v2.5h2.16V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconWhatsapp({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-3.55-6.64L20 4l-.9 3.34A7.96 7.96 0 0 1 20 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.6c0-.5.4-1 .9-1h.6c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.4.9 1.1 1.6 2 2l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.2.1.4.3.4.5v.6c0 .5-.5.9-1 .9-2.9 0-5.4-2.4-6-5.1Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconYoutube({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 9.6v4.8l4.2-2.4-4.2-2.4Z" fill="currentColor" />
    </svg>
  )
}
