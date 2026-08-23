import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSocios } from '../../../core/api/adminApi'
import AlertBanner from '../../../components/ui/AlertBanner'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import DataTable from '../../../components/ui/DataTable'
import PageHeader from '../../../components/ui/PageHeader'
import Skeleton from '../../../components/ui/Skeleton'

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-BO', { dateStyle: 'medium' })
}

function estadoVariant(estado) {
  return estado === 'ACTIVO' ? 'green' : 'slate'
}

// ── Columnas ───────────────────────────────────────────────────────────────

const SOCIOS_COLS = [
  { key: 'ci',       label: 'CI',               cellClassName: 'whitespace-nowrap font-mono text-xs' },
  { key: 'nombre',   label: 'Nombre' },
  { key: 'contacto', label: 'Contacto' },
  { key: 'estado',   label: 'Estado' },
  { key: 'fecha',    label: 'Fecha registro',    cellClassName: 'whitespace-nowrap text-slate-500' },
]

// ── Componente principal ───────────────────────────────────────────────────

export default function SociosPage() {
  const [socios,  setSocios]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const cargarSocios = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchSocios({ limite: 100 })
      .then(setSocios)
      .catch((err) => setError(err?.response?.data?.detail ?? err.message ?? 'Error al cargar socios'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargarSocios() }, [cargarSocios])

  // Mapear socios a filas de la tabla
  const rows = socios.map((s) => ({
    id:       s.id,
    ci:       s.ci,
    nombre: (
      <span>
        <span className="font-semibold text-slate-900">{s.nombre} {s.apellido}</span>
        <span className="ml-2 text-xs text-slate-400">#{s.id}</span>
      </span>
    ),
    contacto: (
      <div>
        <div className="text-slate-700">{s.correo ?? '—'}</div>
        {s.telefono && <div className="text-xs text-slate-400">{s.telefono}</div>}
      </div>
    ),
    estado: <Badge variant={estadoVariant(s.estado)}>{s.estado}</Badge>,
    fecha:  formatDate(s.fecha_registro),
  }))

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Encabezado ── */}
      <PageHeader
        title="Socios"
        subtitle="Listado de miembros afiliados a la cooperativa (KYC)."
        action={
          <Link
            to="/admin/socios/nuevo"
            id="btn-nuevo-socio"
            className={
              'inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white ' +
              'shadow-sm transition-all duration-150 hover:bg-navy-2 active:scale-[0.97]'
            }
          >
            + Nuevo Socio
          </Link>
        }
      />

      {/* ── Tabla de socios ── */}
      <Card>
        {/* Header de sección */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Registro de Socios</h2>
            <p className="text-xs text-slate-400">
              {loading ? 'Cargando…' : `${socios.length} socio(s) registrado(s)`}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={cargarSocios}
            title="Recargar"
            aria-label="Recargar lista de socios"
          >
            ↻
          </Button>
        </div>

        {/* Cuerpo */}
        {loading ? (
          <div className="space-y-2 p-6">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : error ? (
          <div className="px-6 py-8">
            <AlertBanner variant="error" onClose={() => setError(null)}>
              {error}
              <button onClick={cargarSocios} className="ml-2 underline font-medium">Reintentar</button>
            </AlertBanner>
          </div>
        ) : socios.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-400">Aún no hay socios registrados.</p>
            <Link
              to="/admin/socios/nuevo"
              className="mt-4 inline-flex items-center rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-2 transition"
            >
              Registrar el primer socio
            </Link>
          </div>
        ) : (
          <DataTable columns={SOCIOS_COLS} rows={rows} />
        )}
      </Card>
    </div>
  )
}
