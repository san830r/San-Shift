export default function HeroMetricsBar() {
  const metrics = [
    {
      id: 'assets',
      value: '1M+',
      label: 'Digital Assets',
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'creators',
      value: '50K+',
      label: 'Happy Creators',
      iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'delivery',
      value: '99%',
      label: 'Instant Delivery',
      iconBg: 'bg-amber-500/15 text-amber-500 dark:text-amber-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'support',
      value: '24/7',
      label: 'Support',
      iconBg: 'bg-pink-500/15 text-pink-500 dark:text-pink-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.657a9 9 0 01-2.121-6.364" />
        </svg>
      ),
    },
  ]

  return (
    <div className="relative z-20 mx-auto -mt-6 sm:-mt-8 max-w-[1240px] px-4 sm:px-8">
      <div className="rounded-3xl border border-black/[0.08] dark:border-white/12 bg-white/90 dark:bg-[#0c101c]/90 p-4 sm:p-5 shadow-[0_12px_40px_-10px_rgba(0,56,255,0.08),0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-black/[0.06] dark:divide-white/[0.08]">
          {metrics.map((m, idx) => (
            <div
              key={m.id}
              className={`flex items-center gap-3.5 sm:gap-4 ${
                idx > 1 ? 'pt-3 sm:pt-0' : ''
              } ${idx > 0 ? 'sm:pl-6' : ''}`}
            >
              <div
                className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl ${m.iconBg} shadow-sm transition-transform hover:scale-105`}
              >
                {m.icon}
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white leading-none">
                  {m.value}
                </div>
                <div className="mt-1 text-xs font-semibold text-black/55 dark:text-white/60">
                  {m.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
