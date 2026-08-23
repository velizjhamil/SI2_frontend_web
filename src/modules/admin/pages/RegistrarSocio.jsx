import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrarSocio } from '../../../core/api/adminApi'
import AlertBanner from '../../../components/ui/AlertBanner'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { FormField, Input, Textarea } from '../../../components/ui/FormField'

// ── Estado inicial y validación ────────────────────────────────────────────

const INITIAL = {
  ci:       '',
  nombre:   '',
  apellido: '',
  correo:   '',
  telefono: '',
  direccion: '',
}

function validate(form) {
  const errors = {}
  if (!form.ci.trim() || form.ci.trim().length < 5)
    errors.ci = 'La CI debe tener al menos 5 caracteres'
  if (!form.nombre.trim() || form.nombre.trim().length < 2)
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
  if (!form.apellido.trim() || form.apellido.trim().length < 2)
    errors.apellido = 'El apellido debe tener al menos 2 caracteres'
  if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
    errors.correo = 'Correo electrónico no válido'
  return errors
}

// ── Componente principal ───────────────────────────────────────────────────

export default function RegistrarSocio() {
  const navigate = useNavigate()

  const [form,        setForm]        = useState(INITIAL)
  const [errors,      setErrors]      = useState({})
  const [loading,     setLoading]     = useState(false)
  const [success,     setSuccess]     = useState(null)   // { socio, bitacora_id }
  const [serverError, setServerError] = useState(null)

  function handleChange(e) {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError(null)

    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setLoading(true)
    try {
      const payload = {
        ci:        form.ci.trim(),
        nombre:    form.nombre.trim(),
        apellido:  form.apellido.trim(),
        correo:    form.correo.trim()    || null,
        telefono:  form.telefono.trim()  || null,
        direccion: form.direccion.trim() || null,
      }
      const result = await registrarSocio(payload)
      setSuccess(result)
      setForm(INITIAL)
      setErrors({})
    } catch (err) {
      setServerError(
        err?.response?.data?.detail ?? err.message ?? 'Error al registrar el socio'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">

      {/* ── Encabezado ── */}
      <div className="mb-8 flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => navigate('/admin/socios')}
        >
          ← Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registrar Nuevo Socio</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Completa el formulario KYC para afiliar un nuevo socio a la cooperativa.
          </p>
        </div>
      </div>

      {/* ── Banner de éxito ── */}
      {success && (
        <AlertBanner
          variant="success"
          title="Socio registrado correctamente"
          className="mb-6"
        >
          <p>
            <strong>{success.socio.nombre} {success.socio.apellido}</strong>
            {' '}(CI: {success.socio.ci}) — ID #{success.socio.id}
          </p>
          {success.bitacora_id && (
            <p className="mt-0.5 text-xs">Bitácora #{success.bitacora_id} registrada.</p>
          )}
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setSuccess(null)}
              className="bg-forest hover:bg-forest-2 focus-visible:ring-forest"
            >
              Registrar otro
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/admin/socios')}
            >
              Ver lista de socios
            </Button>
          </div>
        </AlertBanner>
      )}

      {/* ── Error del servidor ── */}
      {serverError && (
        <AlertBanner
          variant="error"
          title="Error al registrar"
          onClose={() => setServerError(null)}
          className="mb-6"
        >
          {serverError}
        </AlertBanner>
      )}

      {/* ── Formulario ── */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>

          {/* Sección: Identidad */}
          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Datos de Identidad
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="ci" label="Cédula de Identidad" required error={errors.ci}>
                <Input
                  id="ci"
                  placeholder="Ej. 12345678"
                  value={form.ci}
                  onChange={handleChange}
                  hasError={!!errors.ci}
                  maxLength={20}
                  autoComplete="off"
                />
              </FormField>

              <FormField id="nombre" label="Nombre(s)" required error={errors.nombre}>
                <Input
                  id="nombre"
                  placeholder="Ej. Juan Carlos"
                  value={form.nombre}
                  onChange={handleChange}
                  hasError={!!errors.nombre}
                  maxLength={100}
                />
              </FormField>

              <FormField id="apellido" label="Apellido(s)" required error={errors.apellido}>
                <Input
                  id="apellido"
                  placeholder="Ej. Pérez Sánchez"
                  value={form.apellido}
                  onChange={handleChange}
                  hasError={!!errors.apellido}
                  maxLength={100}
                />
              </FormField>

              <FormField id="correo" label="Correo Electrónico" error={errors.correo}>
                <Input
                  id="correo"
                  type="email"
                  placeholder="socio@ejemplo.com"
                  value={form.correo}
                  onChange={handleChange}
                  hasError={!!errors.correo}
                  maxLength={150}
                />
              </FormField>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Sección: Contacto */}
          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Datos de Contacto
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="telefono" label="Teléfono / Celular" error={errors.telefono}>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="Ej. 77712345"
                  value={form.telefono}
                  onChange={handleChange}
                  hasError={!!errors.telefono}
                  maxLength={20}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField id="direccion" label="Dirección" error={errors.direccion}>
                  <Textarea
                    id="direccion"
                    placeholder="Ej. Av. 6 de Agosto #123, La Paz"
                    value={form.direccion}
                    onChange={handleChange}
                    hasError={!!errors.direccion}
                    rows={2}
                    maxLength={500}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* ── Acciones ── */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => { setForm(INITIAL); setErrors({}); setServerError(null) }}
            >
              Limpiar
            </Button>
            <Button
              id="btn-submit-socio"
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="bg-navy hover:bg-navy-2 focus-visible:ring-navy px-8"
            >
              {loading ? 'Registrando…' : 'Registrar Socio'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
