import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../../../core/api/authApi'
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

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 ' +
  'placeholder-slate-400 outline-none transition duration-150 ' +
  'focus:border-navy focus:ring-2 focus:ring-navy/20 ' +
  'disabled:bg-slate-50 disabled:text-slate-400'

export default function ForgotPasswordPage() {
  const [correo,        setCorreo]        = useState('')
  const [submitting,    setSubmitting]    = useState(false)
  const [successMsg,    setSuccessMsg]    = useState(null)
  const [errorMessage,  setErrorMessage]  = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccessMsg(null)
    setErrorMessage(null)
    setSubmitting(true)
    try {
      const data = await requestPasswordReset(correo)
      // data = { message, delivered, debug_token (opcional, modo dev) }
      if (data?.debug_token) {
        // Modo sin SMTP: el backend nos devuelve el token para probar.
        const link = `${window.location.origin}/recuperar/${data.debug_token}`
        setSuccessMsg(
          'Modo desarrollo (sin SMTP configurado): el enlace generado es ' +
          `${link} . Cópialo y ábrelo en tu navegador para continuar.`
        )
      } else if (data?.delivered === false) {
        setSuccessMsg(
          'Solicitud registrada, pero no pudimos entregar el correo al SMTP. ' +
          'Revisa la configuración del servidor (SMTP_USER / SMTP_PASSWORD) o ' +
          'los logs del backend. Si el problema persiste, contacta al administrador.'
        )
      } else {
        setSuccessMsg(
          'Si el correo está registrado, enviaremos un enlace de recuperación ' +
          'en los próximos minutos. Revisa también la carpeta de spam.',
        )
      }
      setCorreo('')
    } catch (error) {
      if (error.response?.status === 422) {
        setErrorMessage('Verifica que el correo tenga un formato válido.')
      } else {
        setErrorMessage(
          'No se pudo procesar la solicitud. Intente nuevamente en unos minutos.',
        )
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
          Recuperar contraseña
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Te enviaremos un enlace para crear una nueva contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
            disabled={submitting}
          />
        </div>

        {errorMessage && (
          <AlertBanner
            variant="error"
            onClose={() => setErrorMessage(null)}
          >
            {errorMessage}
          </AlertBanner>
        )}

        {successMsg && (
          <AlertBanner
            variant="success"
            onClose={() => setSuccessMsg(null)}
          >
            {successMsg}
          </AlertBanner>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          className="w-full bg-forest hover:bg-forest-2 focus-visible:ring-forest"
        >
          {submitting ? 'Enviando…' : 'Enviar enlace de recuperación'}
        </Button>
      </form>

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
