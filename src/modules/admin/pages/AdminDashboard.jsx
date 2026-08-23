import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminStats, fetchBitacora, fetchModulos } from '../../../core/api/adminApi'
import { selectUser, useAuthStore } from '../../../core/store/authStore'
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
  return new Date(value).toLocaleString('es-BO', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const MODULE_BADGE = {
  USUARIO:      'navy',
  SOCIO:        'green',
  CAJA:         'amber',
  CREDITO:      'purple',
  CREDITOS:     'purple',
  REPORTE:      'indigo',
  ROL:          'rose',
  SISTEMA:      'slate',
  CONTABILIDAD: 'teal',
  TRANSACCION:  'orange',
  DPF:          'pink',
}

function moduloBadgeVariant(modulo) {
  return MODULE_BADGE[modulo?.toUpperCase()] ?? 'slate'
}

// ── StatCard ───────────────────────────────────────────────────────────────

const STAT_GRADIENTS = {
  forest: 'from-forest   to-forest-2',
  navy:   'from-navy     to-navy-2',
  teal:   'from-teal-600 to-teal-700',
  amber:  'from-amber-500 to-amber-600',
}

function StatCard({ label, value, icon, gradient = 'navy', to }) {
  const inner = (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-card transition-all duration-200 hover:shadow-card-hover">
      {/* Ícono con gradiente CoopIA */}
      <div
        className={`absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${STAT_GRADIENTS[gradient]} text-xl text-white select-none shadow-sm`}
      >
        {icon}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2.5 font-mono text-4xl font-bold tabular-nums text-slate-900">
        {value ?? <span className="text-slate-300">—</span>}
      </p>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

// ── Columnas Bitácora ──────────────────────────────────────────────────────

const BITACORA_COLS = [
  { key: 'fecha',       label: 'Fecha',       cellClassName: 'whitespace-nowrap text-slate-500' },
  { key: 'modulo',      label: 'Módulo' },
  { key: 'accion',      label: 'Acción',      cellClassName: 'font-mono text-xs' },
  { key: 'usuario',     label: 'Usuario' },
  { key: 'descripcion', label: 'Descripción', cellClassName: 'max-w-xs truncate text-slate-500' },
  { key: 'ip',          label: 'IP',          cellClassName: 'font-mono text-xs text-slate-400' },
]

// ── Componente principal ───────────────────────────────────────────────────

export default function AdminDashboard() {
  const user = useAuthStore(selectUser)

  const [stats,        setStats]        = useState(null)
  const [bitacora,     setBitacora]     = useState([])
  const [modulos,      setModulos]      = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingBit,   setLoadingBit]   = useState(true)
  const [errorStats,   setErrorStats]   = useState(null)
  const [errorBit,     setErrorBit]     = useState(null)
  const [filtroModulo, setFiltroModulo] = useState('')

  useEffect(() => {
    setLoadingStats(true)
    setErrorStats(null)
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setErrorStats(err?.response?.data?.detail ?? err.message ?? 'Error al cargar estadísticas'))
      .finally(() => setLoadingStats(false))
  }, [])

  useEffect(() => {
    fetchModulos()
      .then(setModulos)
      .catch(() => {})
  }, [])

  const cargarBitacora = useCallback(() => {
    setLoadingBit(true)
    setErrorBit(null)
    fetchBitacora({ limite: 50, modulo: filtroModulo || undefined })
      .then(setBitacora)
      .catch((err) => setErrorBit(err?.response?.data?.detail ?? err.message ?? 'Error al cargar bitácora'))
      .finally(() => setLoadingBit(false))
  }, [filtroModulo])

  useEffect(() => { cargarBitacora() }, [cargarBitacora])

  // Mapear registros a filas de la tabla
  const bitacoraRows = bitacora.map((reg) => ({
    id:          reg.id,
    fecha:       formatDate(reg.fecha_hora),
    modulo:      <Badge variant={moduloBadgeVariant(reg.modulo)}>{reg.modulo}</Badge>,
    accion:      reg.accion,
    usuario:     reg.usuario_nombre ?? `#${reg.usuario_id}`,
    descripcion: reg.descripcion ?? '—',
    ip:          reg.ip ?? '—',
  }))

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Encabezado ── */}
      <PageHeader
        title="Panel de Administración"
        subtitle={
          <>
            Bienvenido,{' '}
            <span className="font-semibold text-slate-700">{user?.nombre}</span>
            {' — '}
            <span className="capitalize text-slate-600">
              {user?.rol?.nombre?.toLowerCase().replace(/_/g, ' ')}
            </span>
          </>
        }
        action={
          <Link
            to="socios/nuevo"
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

      {/* ── Tarjetas de resumen ── */}
      {loadingStats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : errorStats ? (
        <AlertBanner
          variant="error"
          title="Error al cargar estadísticas"
          onClose={() => {
            setLoadingStats(true)
            fetchAdminStats().then(setStats).catch((e) => setErrorStats(e.message)).finally(() => setLoadingStats(false))
          }}
        >
          {errorStats}
          <button
            onClick={() => {
              setLoadingStats(true)
              fetchAdminStats().then(setStats).catch((e) => setErrorStats(e.message)).finally(() => setLoadingStats(false))
            }}
            className="ml-2 underline font-medium"
          >
            Reintentar
          </button>
        </AlertBanner>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Socios"        value={stats?.total_socios}    icon="👥" gradient="forest" />
          <StatCard label="Socios Activos"      value={stats?.socios_activos}  icon="✅" gradient="teal"   />
          <StatCard label="Cuentas Activas"     value={stats?.cuentas_activas} icon="🏦" gradient="navy"   />
          <StatCard label="Usuarios en Sistema" value={stats?.total_usuarios}  icon="🔑" gradient="amber"  />
        </div>
      )}

      {/* ── Bitácora del sistema ── */}
      <Card>
        {/* Header de sección */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Bitácora del Sistema</h2>
            <p className="text-xs text-slate-400">Registro de auditoría — actividad reciente</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              id="filtro-modulo"
              value={filtroModulo}
              onChange={(e) => setFiltroModulo(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/20"
            >
              <option value="">Todos los módulos</option>
              {modulos.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={cargarBitacora}
              title="Recargar bitácora"
              aria-label="Recargar bitácora"
            >
              ↻
            </Button>
          </div>
        </div>

        {/* Cuerpo */}
        {loadingBit ? (
          <div className="space-y-2 p-6">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : errorBit ? (
          <div className="px-6 py-8">
            <AlertBanner variant="error" onClose={() => setErrorBit(null)}>
              {errorBit}
              <button onClick={cargarBitacora} className="ml-2 underline font-medium">Reintentar</button>
            </AlertBanner>
          </div>
        ) : (
          <DataTable
            columns={BITACORA_COLS}
            rows={bitacoraRows}
            emptyMessage={
              filtroModulo
                ? `No hay registros para el módulo "${filtroModulo}".`
                : 'No hay registros en la bitácora.'
            }
          />
        )}
      </Card>
    </div>
  )
}
