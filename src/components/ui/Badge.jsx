/**
 * Badge — pill de estado / módulo.
 *
 * Props:
 *   variant: 'green' | 'navy' | 'amber' | 'red' | 'slate' | 'teal' | 'purple' | 'rose' | 'indigo' | 'orange' | 'pink'
 *   className: string (extra overrides)
 */

const VARIANTS = {
  green:  'bg-emerald-50  text-emerald-700  ring-emerald-200',
  navy:   'bg-blue-50     text-navy         ring-blue-200',
  amber:  'bg-amber-50    text-amber-700    ring-amber-200',
  red:    'bg-red-50      text-red-700      ring-red-200',
  slate:  'bg-slate-100   text-slate-600    ring-slate-200',
  teal:   'bg-teal-50     text-teal-700     ring-teal-200',
  purple: 'bg-purple-50   text-purple-700   ring-purple-200',
  rose:   'bg-rose-50     text-rose-700     ring-rose-200',
  indigo: 'bg-indigo-50   text-indigo-700   ring-indigo-200',
  orange: 'bg-orange-50   text-orange-700   ring-orange-200',
  pink:   'bg-pink-50     text-pink-700     ring-pink-200',
}

export default function Badge({ variant = 'slate', children, className = '' }) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset'
  return (
    <span className={`${base} ${VARIANTS[variant] ?? VARIANTS.slate} ${className}`}>
      {children}
    </span>
  )
}
