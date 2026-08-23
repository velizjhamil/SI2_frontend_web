/**
 * Skeleton — animated loading placeholder.
 * Usage: <Skeleton className="h-10 w-full" />
 */
export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-100 ${className}`}
      aria-hidden="true"
    />
  )
}
