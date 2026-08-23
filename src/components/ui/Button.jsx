/**
 * Button — botón reutilizable CoopIA.
 *
 * Props:
 *   variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 *   size:    'sm' | 'md' | 'lg'
 *   loading: boolean
 *   as:      'button' | 'a' (para enlaces con Link de react-router)
 */

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl ' +
  'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ' +
  'active:scale-[0.97] select-none'

const VARIANTS = {
  primary:
    'bg-navy text-white hover:bg-navy-2 focus-visible:ring-navy ' +
    'shadow-[0_1px_2px_rgba(30,58,95,0.2)]',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 ' +
    'hover:bg-slate-50 focus-visible:ring-slate-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
}

const SIZES = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-sm px-5 py-2.5',
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

export default function Button({
  variant = 'primary',
  size    = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
