/**
 * AlertBanner — banner de feedback (error / éxito / info / warning).
 *
 * Props:
 *   variant: 'error' | 'success' | 'info' | 'warning'
 *   title:   string (opcional)
 *   onClose: función (opcional — muestra ×)
 *   children: contenido del mensaje
 */

const CONFIG = {
  error: {
    wrap:  'border-red-200   bg-red-50',
    icon:  '⚠️',
    title: 'text-red-800',
    body:  'text-red-700',
    close: 'text-red-400 hover:text-red-600',
  },
  success: {
    wrap:  'border-emerald-200 bg-emerald-50',
    icon:  '✅',
    title: 'text-emerald-800',
    body:  'text-emerald-700',
    close: 'text-emerald-400 hover:text-emerald-600',
  },
  info: {
    wrap:  'border-blue-200  bg-blue-50',
    icon:  'ℹ️',
    title: 'text-blue-800',
    body:  'text-blue-700',
    close: 'text-blue-400 hover:text-blue-600',
  },
  warning: {
    wrap:  'border-amber-200 bg-amber-50',
    icon:  '⚡',
    title: 'text-amber-800',
    body:  'text-amber-700',
    close: 'text-amber-400 hover:text-amber-600',
  },
}

export default function AlertBanner({
  variant  = 'error',
  title,
  onClose,
  children,
  className = '',
}) {
  const c = CONFIG[variant] ?? CONFIG.error

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border px-5 py-4 animate-slide-up ${c.wrap} ${className}`}
    >
      <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
        {c.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-sm font-semibold ${c.title}`}>{title}</p>
        )}
        <div className={`text-sm ${title ? 'mt-0.5' : ''} ${c.body}`}>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className={`shrink-0 text-lg leading-none transition ${c.close}`}
        >
          ×
        </button>
      )}
    </div>
  )
}
