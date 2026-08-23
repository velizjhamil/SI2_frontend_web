import AppShell from './components/AppShell'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/contador/dashboard' },
  { label: 'Reportes', path: '/contador/reportes' },
  { label: 'Cumplimiento', path: '/contador/cumplimiento' },
]

export default function ContadorLayout() {
  return <AppShell navItems={NAV_ITEMS} />
}
