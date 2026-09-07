import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'

const EMPTY_SUMMARY = [
  { label: 'Cuentas activas', value: '—', detail: 'Sin datos registrados', tone: 'text-navy' },
  { label: 'Saldo total', value: '—', detail: 'Pendiente de integración', tone: 'text-forest' },
  { label: 'Aportes emitidos', value: '—', detail: 'Sin certificados registrados', tone: 'text-amber-700' },
]

function SummaryCard({ label, value, detail, tone }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </Card>
  )
}

function EmptyState({ type }) {
  const isAccounts = type === 'cuentas'
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/10 text-2xl text-forest">
        {isAccounts ? '₿' : '✦'}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {isAccounts ? 'Aún no hay cuentas de ahorro' : 'Aún no hay certificados de aportación'}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {isAccounts
          ? 'Las cuentas y sus saldos aparecerán aquí cuando se habilite la apertura de cuentas.'
          : 'Los certificados emitidos y sus aportes aparecerán aquí cuando se habilite el módulo.'}
      </p>
      <Button type="button" variant="secondary" size="sm" disabled className="mt-5">
        {isAccounts ? 'Abrir cuenta' : 'Registrar aporte'}
      </Button>
    </div>
  )
}

export default function SavingsModulePage({ personal = false }) {
  const [activeTab, setActiveTab] = useState('cuentas')
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={personal ? 'Mi cuenta' : 'Ahorros y aportes'}
        subtitle={personal
          ? 'Consulta tus cuentas de ahorro, saldos y certificados de aportación.'
          : 'Administra las cuentas de ahorro y los aportes de los socios.'}
        action={
          <Badge variant="amber">Módulo en preparación</Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {EMPTY_SUMMARY.map((item) => <SummaryCard key={item.label} {...item} />)}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Ahorros y aportes">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'cuentas'}
              onClick={() => setActiveTab('cuentas')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'cuentas' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Cuentas de ahorro
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'aportes'}
              onClick={() => setActiveTab('aportes')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'aportes' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Aportes
            </button>
          </div>

          {!personal && (
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={activeTab === 'cuentas' ? 'Buscar por cuenta o socio' : 'Buscar certificado o socio'}
              aria-label="Buscar"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 sm:w-64"
            />
          )}
        </div>

        <div role="tabpanel" aria-label={activeTab === 'cuentas' ? 'Cuentas de ahorro' : 'Aportes'}>
          <EmptyState type={activeTab} />
        </div>
      </Card>

      {!personal && (
        <p className="text-xs text-slate-400">
          La apertura de cuentas, movimientos y emisión de certificados se habilitarán con la integración del backend financiero.
        </p>
      )}
    </div>
  )
}