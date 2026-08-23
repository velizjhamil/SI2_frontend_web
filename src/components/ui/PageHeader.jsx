/**
 * PageHeader — encabezado de página estándar CoopIA.
 *
 * Props:
 *   title:    string  — título principal (h1)
 *   subtitle: string  — descripción corta (opcional)
 *   action:   node    — slot de acción derecha (botón, Link, etc.)
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="shrink-0">{action}</div>
      )}
    </div>
  )
}
