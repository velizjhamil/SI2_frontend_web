import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  selectIsAuthenticated,
  selectUser,
  useAuthStore,
} from '../core/store/authStore'
import { getRoleHomePath, getRolePrefix } from '../core/utils/roles'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

export function GuestRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectUser)

  if (isAuthenticated) {
    return <Navigate to={getRoleHomePath(user?.rol?.nombre) ?? '/'} replace />
  }
  return <Outlet />
}

export function RoleRoute({ allow }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectUser)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (getRolePrefix(user?.rol?.nombre) !== allow) {
    return <Navigate to={getRoleHomePath(user?.rol?.nombre) ?? '/'} replace />
  }
  return <Outlet />
}

export function RootRedirect() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectUser)
  const clearSession = useAuthStore((state) => state.clearSession)
  const homePath = getRoleHomePath(user?.rol?.nombre)

  useEffect(() => {
    if (isAuthenticated && !homePath) {
      clearSession()
    }
  }, [isAuthenticated, homePath, clearSession])

  if (!isAuthenticated || !homePath) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to={homePath} replace />
}
