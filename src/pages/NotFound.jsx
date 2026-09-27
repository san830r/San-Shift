import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 text-center sm:px-8 text-black dark:text-white pt-24">
      <span className="font-display text-6xl font-extrabold text-brand-blue">404</span>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-black dark:text-white">Page not found</h1>
      <p className="mt-3 text-black/55 dark:text-white/60">The page you're looking for doesn't exist or has moved.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-blue/30"
      >
        Back to Home
      </Link>
    </div>
  )
}
