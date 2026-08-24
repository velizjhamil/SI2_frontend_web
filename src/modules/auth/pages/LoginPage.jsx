import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  selectStatus,
  useAuthStore,
} from '../../../core/store/authStore'
import { getRoleHomePath, getRolePrefix } from '../../../core/utils/roles'
import Button from '../../../components/ui/Button'
import AlertBanner from '../../../components/ui/AlertBanner'

function resolveErrorMessage(error) {
  if (error.response) {
    if (error.response.status === 401) {
      return error.response.data?.detail ?? 'Correo o contraseña incorrectos'
    }
    return 'Error del servidor. Intente nuevamente en unos minutos.'
  }
  return 'No se pudo conectar con el servidor. Verifique su conexión e intente de nuevo.'
}

// ── Ícono CoopIA (escudo + hoja) ─────────────────────────────────────────
function CoopIALoginMark() {
  return (
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest shadow-[0_4px_20px_rgba(26,71,49,0.4)]">
      <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M14 2L4 6.5V14c0 5.5 4 9.8 10 12 6-2.2 10-6.5 10-12V6.5L14 2Z"
          fill="rgba(255,255,255,0.15)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />
        <path
          d="M14 8c0 0-5 2.5-5 7.5 0 2.5 2 4 5 5 3-1 5-2.5 5-5C19 10.5 14 8 14 8Z"
          fill="#4ade80"
          opacity="0.9"
        />
      </svg>
    </div>
  )
}

// ── Ícono ojo (mostrar) / ojo tachado (ocultar) ──────────────────────────
function EyeIcon({ open }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 ' +
  'placeholder-slate-400 outline-none transition duration-150 ' +
  'focus:border-navy focus:ring-2 focus:ring-navy/20 ' +
  'disabled:bg-slate-50 disabled:text-slate-400'

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const status    = useAuthStore(selectStatus)
  const login     = useAuthStore((state) => state.login)

  const [correo,         setCorreo]         = useState('')
  const [contrasena,     setContrasena]     = useState('')
  const [mostrarPass,    setMostrarPass]    = useState(false)
  const [errorMessage,   setErrorMessage]   = useState(null)

  const isLoading = status === 'loading'

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage(null)
    try {
      await login(correo, contrasena)
      const user       = useAuthStore.getState().user
      const prefix     = getRolePrefix(user?.rol?.nombre)
      const fallback   = getRoleHomePath(user?.rol?.nombre) ?? '/'
      const fromPath   = location.state?.from?.pathname
      const target     =
        prefix && fromPath && fromPath.startsWith(`/${prefix}/`)
          ? fromPath
          : fallback
      navigate(target, { replace: true })
    } catch (error) {
      setErrorMessage(resolveErrorMessage(error))
    }
  }

  return (
    <div className="w-full rounded-3xl bg-white/95 backdrop-blur-sm p-8 shadow-[0_24px_64px_rgba(0,0,0,0.25)]">

      {/* Logo + nombre */}
      <CoopIALoginMark />
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          CoopIA
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Plataforma de Gestión Integral para Cooperativas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Correo */}
        <div>
          <label
            htmlFor="correo"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            autoComplete="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="usuario@cooperativa.com"
            className={FIELD_CLASS}
            disabled={isLoading}
          />
        </div>

        {/* Contraseña */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="contrasena"
              className="block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>
            <Link
              to="/recuperar"
              className="text-xs font-medium text-navy hover:text-navy-2 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              id="contrasena"
              type={mostrarPass ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              className={`${FIELD_CLASS} pr-11`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setMostrarPass((v) => !v)}
              disabled={isLoading}
              aria-label={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={mostrarPass}
              title={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-slate-400 transition hover:text-navy focus:outline-none focus-visible:text-navy disabled:cursor-not-allowed disabled:opacity-50"
            >
              <EyeIcon open={mostrarPass} />
            </button>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <AlertBanner
            variant="error"
            onClose={() => setErrorMessage(null)}
          >
            {errorMessage}
          </AlertBanner>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full bg-forest hover:bg-forest-2 focus-visible:ring-forest mt-1"
        >
          {isLoading ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] text-slate-400">
        CoopIA © {new Date().getFullYear()} · Sistema protegido
      </p>
    </div>
  )
}
