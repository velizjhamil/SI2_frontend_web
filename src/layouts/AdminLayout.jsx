import AppShell from './components/AppShell'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Socios', path: '/admin/socios' },
  { label: 'Créditos', path: '/admin/creditos' },
  { label: 'Caja', path: '/admin/caja' },
  { label: 'Reportes', path: '/admin/reportes' },
  { label: 'Configuración', path: '/admin/configuracion' },
]

export default function AdminLayout() {
  return <AppShell navItems={NAV_ITEMS} />
}
