import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { confirmPasswordReset } from '../../../core/api/authApi'
import Button from '../../../components/ui/Button'
import AlertBanner from '../../../components/ui/AlertBanner'

function BrandMark() {
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

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

const PASSWORD_MIN = 6

function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '—', color: 'bg-slate-200' }
  let score = 0
  if (pwd.length >= PASSWORD_MIN) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  const labels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte', 'Muy fuerte']
  const colors = [
    'bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500',
  ]
  return {
    score,
    label: labels[Math.min(score, labels.length - 1)],
    color: colors[Math.min(score, colors.length - 1)],
  }
}

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [nueva,             setNueva]            = useState('')
  const [confirmacion,      setConfirmacion]     = useState('')
  const [mostrarNueva,      setMostrarNueva]     = useState(false)
  const [mostrarConf,       setMostrarConf]      = useState(false)
  const [submitting,        setSubmitting]       = useState(false)
  const [success,           setSuccess]          = useState(false)
  const [errorMessage,      setErrorMessage]     = useState(null)

  const tokenValido = useMemo(() => Boolean(token && token.trim().length > 0), [token])
  const strength    = useMemo(() => getPasswordStrength(nueva), [nueva])

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage(null)

    if (!tokenValido) {
      setErrorMessage('El enlace de recuperación no es válido.')
      return
    }
    if (nueva.length < PASSWORD_MIN) {
      setErrorMessage(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`)
      return
    }
    if (nueva !== confirmacion) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      await confirmPasswordReset({ token, nueva_contrasena: nueva })
      setSuccess(true)
      // Redirige al login tras un breve delay para que el usuario vea el éxito
      setTimeout(() => navigate('/login', { replace: true }), 2500)
    } catch (error) {
      const status = error.response?.status
      const detail = error.response?.data?.detail
      if (status === 400 || status === 422) {
        setErrorMessage(detail ?? 'El enlace es inválido o ha expirado.')
      } else if (status === 410) {
        setErrorMessage('El enlace ha expirado. Solicita uno nuevo.')
      } else {
        setErrorMessage('No se pudo restablecer la contraseña. Intente nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full rounded-3xl bg-white/95 backdrop-blur-sm p-8 shadow-[0_24px_64px_rgba(0,0,0,0.25)]">
      <BrandMark />

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Crear nueva contraseña
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa y confirma tu nueva contraseña.
        </p>
      </div>

      {!tokenValido ? (
        <AlertBanner variant="error">
          El enlace de recuperación no es válido. Solicita uno nuevo desde la
          pantalla de inicio de sesión.
        </AlertBanner>
      ) : success ? (
        <AlertBanner variant="success" title="¡Contraseña actualizada!">
          Te redirigiremos al inicio de sesión en unos segundos.
        </AlertBanner>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Nueva contraseña */}
          <div>
            <label
              htmlFor="nueva"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="nueva"
                type={mostrarNueva ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={PASSWORD_MIN}
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`${FIELD_CLASS} pr-11`}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setMostrarNueva((v) => !v)}
                disabled={submitting}
                aria-label={mostrarNueva ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={mostrarNueva}
                title={mostrarNueva ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-slate-400 transition hover:text-navy focus:outline-none focus-visible:text-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                <EyeIcon open={mostrarNueva} />
              </button>
            </div>
            {nueva && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full transition-all duration-200 ${strength.color}`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirmación */}
          <div>
            <label
              htmlFor="confirmacion"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmacion"
                type={mostrarConf ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmacion}
                onChange={(e) => setConfirmacion(e.target.value)}
                placeholder="••••••••"
                className={`${FIELD_CLASS} pr-11`}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setMostrarConf((v) => !v)}
                disabled={submitting}
                aria-label={mostrarConf ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={mostrarConf}
                title={mostrarConf ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-slate-400 transition hover:text-navy focus:outline-none focus-visible:text-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                <EyeIcon open={mostrarConf} />
              </button>
            </div>
          </div>

          {errorMessage && (
            <AlertBanner
              variant="error"
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </AlertBanner>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            className="w-full bg-forest hover:bg-forest-2 focus-visible:ring-forest"
          >
            {submitting ? 'Guardando…' : 'Guardar nueva contraseña'}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-slate-500">
        <Link
          to="/login"
          className="font-medium text-navy hover:text-navy-2 hover:underline"
        >
          ← Volver a iniciar sesión
        </Link>
      </div>

      <p className="mt-6 text-center text-[11px] text-slate-400">
        CoopIA © {new Date().getFullYear()} · Sistema protegido
      </p>
    </div>
  )
}
