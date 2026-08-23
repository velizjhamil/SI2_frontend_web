import { useEffect } from 'react'
import {
  selectError,
  selectStatus,
  selectUser,
  useAuthStore,
} from '../../core/store/authStore'

function formatRoleName(roleName) {
  if (!roleName) return '—'
  return roleName.toLowerCase().replace(/_/g, ' ')
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-BO', { dateStyle: 'long', timeStyle: 'short' })
}

export default function DashboardContent() {
  const user             = useAuthStore(selectUser)
  const status           = useAuthStore(selectStatus)
  const error            = useAuthStore(selectError)
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser)

  useEffect(() => {
    if (!user) {
      fetchCurrentUser().catch(() => {})
    }
  }, [user, fetchCurrentUser])

  if (!user) {
    if (status === 'loading') {
      return <p className="text-sm text-slate-500">Cargando datos del usuario…</p>
    }
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        No se pudieron cargar los datos del usuario.
        {error ? ` ${error.message}` : ''}
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">
        ¡Bienvenido, {user.nombre}!
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Panel principal de <span className="font-semibold text-forest">CoopIA</span>
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Nombre',        value: user.nombre },
          { label: 'Correo',        value: user.correo,                    extra: 'break-all' },
          { label: 'Rol',           value: formatRoleName(user.rol?.nombre), extra: 'capitalize' },
          { label: 'Miembro desde', value: formatDate(user.fecha_creacion) },
        ].map(({ label, value, extra = '' }) => (
          <div
            key={label}
            className="rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {label}
            </dt>
            <dd className={`mt-1.5 text-sm font-semibold text-slate-900 ${extra}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
