import { IconLock, IconBolt, IconTag } from './icons/MiscIcons'

const ITEMS = [
  { label: 'Secure Checkout', Icon: IconLock },
  { label: 'Instant Delivery', Icon: IconBolt },
  { label: 'One-Time Payment', Icon: IconTag },
]

export default function TrustBadges({ className = '', tone = 'auto' }) {
  const textColor =
    tone === 'dark'
      ? 'text-white'
      : 'text-black/70 dark:text-white'

  const iconColor =
    tone === 'dark'
      ? 'text-brand-yellow'
      : 'text-brand-blue dark:text-blue-400'

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {ITEMS.map(({ label, Icon }) => (
        <span key={label} className={`flex items-center gap-1.5 text-xs font-semibold ${textColor}`}>
          <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
          {label}
        </span>
      ))}
    </div>
  )
}
