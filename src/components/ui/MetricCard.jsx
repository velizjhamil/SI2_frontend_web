/**
 * MetricCard — tarjeta de métrica premium CoopIA.
 *
 * Características de diseño:
 *   - rounded-3xl para bordes orgánicos
 *   - bg-white con sombra muy suave (sin bordes duros)
 *   - Ícono con fondo de color suave, no gradiente agresivo
 *   - Jerarquía: label pequeño/muted → valor hero grande → delta opcional
 *
 * Props:
 *   label:    string
 *   value:    string | number
 *   icon:     string (emoji) o node
 *   iconBg:   string  — clase Tailwind para el bg del ícono (ej: 'bg-coopia-green-soft')
 *   iconColor:string  — clase Tailwind para el color del ícono (ej: 'text-coopia-green')
 *   delta:    string  — texto de delta opcional (ej: '+12%')
 *   deltaPos: boolean — true = verde, false = rojo
 *   to:       string  — si se pasa, envuelve en Link
 */
import { Link } from 'react-router-dom'

export default function MetricCard({
  label,
  value,
  icon,
  iconBg    = 'bg-coopia-green-soft',
  iconColor = 'text-coopia-green',
  delta,
  deltaPos  = true,
  to,
}) {
  const inner = (
    <div className="group relative overflow-hidden rounded-3xl bg-coopia-card p-6 shadow-metric transition-all duration-200 hover:shadow-card-hover">
      {/* Ícono */}
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
        <span className={`text-xl ${iconColor}`} aria-hidden="true">{icon}</span>
      </div>

      {/* Label */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-coopia-muted">
        {label}
      </p>

      {/* Valor hero */}
      <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-coopia-navy">
        {value ?? <span className="text-slate-300 font-sans text-2xl">—</span>}
      </p>

      {/* Delta opcional */}
      {delta && (
        <p className={`mt-1.5 text-xs font-semibold ${deltaPos ? 'text-emerald-600' : 'text-red-500'}`}>
          {delta}
        </p>
      )}
    </div>
  )

  return to ? <Link to={to} className="block">{inner}</Link> : inner
}
