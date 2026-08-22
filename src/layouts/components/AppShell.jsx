import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { selectUser, useAuthStore } from '../../core/store/authStore'

function formatRoleName(roleName) {
  if (!roleName) return ''
  return roleName.toLowerCase().replace(/_/g, ' ')
}

export default function AppShell({ navItems = [] }) {
  const navigate = useNavigate()
  const user = useAuthStore(selectUser)
  const logout = useAuthStore((state) => state.logout)

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="flex w-64 shrink-0 flex-col bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <p className="text-lg font-bold text-white">SI2</p>
          <p className="mt-0.5 text-xs text-slate-400">Cooperativa</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
          <h2 className="text-sm font-semibold text-slate-500">
            Sistema Integral Cooperativo
          </h2>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.nombre}</p>
                <p className="text-xs capitalize text-slate-500">
                  {formatRoleName(user.rol?.nombre)}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
