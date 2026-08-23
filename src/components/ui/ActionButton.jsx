/**
 * ActionButton — botón de acción CoopIA.
 *
 * Variantes:
 *   'primary'   → dorado (coopia-accent) con texto navy oscuro, rounded-full
 *   'secondary' → blanco/borde sutil, rounded-full
 *   'ghost'     → transparente, hover con bg suave
 *   'danger'    → rojo, rounded-full
 *
 * Tamaños: 'sm' | 'md' | 'lg'
 * Props: loading, disabled, as (para wrapper externo)
 */

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full ' +
  'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
  'active:scale-[0.96] select-none'

const VARIANTS = {
  primary:
    'bg-coopia-accent text-coopia-navy hover:bg-coopia-accent-hover ' +
    'focus-visible:ring-coopia-accent shadow-sm',
  secondary:
    'bg-white text-coopia-navy ring-1 ring-inset ring-slate-200 ' +
    'hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost:
    'bg-transparent text-coopia-navy hover:bg-slate-100 focus-visible:ring-slate-300',
  danger:
    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400 shadow-sm',
}

const SIZES = {
  sm: 'text-xs  px-4   py-1.5',
  md: 'text-sm  px-6   py-2',
  lg: 'text-sm  px-7   py-2.5',
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

export default function ActionButton({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
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
