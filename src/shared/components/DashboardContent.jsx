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
  const user = useAuthStore(selectUser)
  const status = useAuthStore(selectStatus)
  const error = useAuthStore(selectError)
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser)

  useEffect(() => {
    if (!user) {
      fetchCurrentUser().catch(() => {})
    }
  }, [user, fetchCurrentUser])

  if (!user) {
    if (status === 'loading') {
      return (
        <p className="text-sm text-slate-500">Cargando datos del usuario…</p>
      )
    }
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        No se pudieron cargar los datos del usuario.
        {error ? ` ${error.message}` : ''}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        ¡Bienvenido, {user.nombre}!
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Panel principal del sistema SI2
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Nombre
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{user.nombre}</dd>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Correo
          </dt>
          <dd className="mt-1 text-sm font-semibold break-all text-slate-900">
            {user.correo}
          </dd>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Rol
          </dt>
          <dd className="mt-1 text-sm font-semibold capitalize text-slate-900">
            {formatRoleName(user.rol?.nombre)}
          </dd>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Miembro desde
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {formatDate(user.fecha_creacion)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
