import { Link } from 'react-router-dom'

export default function BackLink({ to = '/admin', label = 'Back to Dashboard' }) {
  return (
    <Link
      to={to}
      className="mb-4 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white/60 hover:text-brand-blue transition-colors"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  )
}
