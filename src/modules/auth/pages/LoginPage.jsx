import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  selectStatus,
  useAuthStore,
} from '../../../core/store/authStore'
import { getRoleHomePath, getRolePrefix } from '../../../core/utils/roles'

function resolveErrorMessage(error) {
  if (error.response) {
    if (error.response.status === 401) {
      return error.response.data?.detail ?? 'Correo o contraseña incorrectos'
    }
    return 'Error del servidor. Intente nuevamente en unos minutos.'
  }
  return 'No se pudo conectar con el servidor. Verifique su conexión e intente de nuevo.'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const status = useAuthStore(selectStatus)
  const login = useAuthStore((state) => state.login)

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const isLoading = status === 'loading'

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage(null)
    try {
      await login(correo, contrasena)
      const user = useAuthStore.getState().user
      const prefix = getRolePrefix(user?.rol?.nombre)
      const fallbackPath = getRoleHomePath(user?.rol?.nombre) ?? '/'
      const fromPath = location.state?.from?.pathname
      const target =
        prefix && fromPath && fromPath.startsWith(`/${prefix}/`)
          ? fromPath
          : fallbackPath
      navigate(target, { replace: true })
    } catch (error) {
      setErrorMessage(resolveErrorMessage(error))
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">SI2</h1>
        <p className="mt-1 text-sm text-slate-500">
          Plataforma de Gestión Integral para Cooperativas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="correo"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            autoComplete="email"
            required
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            placeholder="usuario@cooperativa.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="contrasena"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            autoComplete="current-password"
            required
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
