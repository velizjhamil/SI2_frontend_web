import { Navigate, Route, Routes } from 'react-router-dom'
import {
  GuestRoute,
  ProtectedRoute,
  RoleRoute,
  RootRedirect,
} from './guards'
import AdminLayout from '../layouts/AdminLayout'
import AsesorLayout from '../layouts/AsesorLayout'
import AuthLayout from '../layouts/AuthLayout'
import SocioLayout from '../layouts/SocioLayout'

import LoginPage from '../modules/auth/pages/LoginPage'

import AdminCajaPage from '../modules/admin/pages/CajaPage'
import AdminConfiguracionPage from '../modules/admin/pages/ConfiguracionPage'
import AdminCreditosPage from '../modules/admin/pages/CreditosPage'
import AdminDashboardPage from '../modules/admin/pages/DashboardPage'
import AdminReportesPage from '../modules/admin/pages/ReportesPage'
import AdminSociosPage from '../modules/admin/pages/SociosPage'

import AsesorCajaPage from '../modules/asesor/pages/CajaPage'
import AsesorCreditosPage from '../modules/asesor/pages/CreditosPage'
import AsesorDashboardPage from '../modules/asesor/pages/DashboardPage'
import AsesorSociosPage from '../modules/asesor/pages/SociosPage'

import SocioDashboardPage from '../modules/socio/pages/DashboardPage'
import SocioMiCuentaPage from '../modules/socio/pages/MiCuentaPage'
import SocioMisCreditosPage from '../modules/socio/pages/MisCreditosPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<RoleRoute allow="admin" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="socios" element={<AdminSociosPage />} />
            <Route path="creditos" element={<AdminCreditosPage />} />
            <Route path="caja" element={<AdminCajaPage />} />
            <Route path="reportes" element={<AdminReportesPage />} />
            <Route path="configuracion" element={<AdminConfiguracionPage />} />
          </Route>
        </Route>

        <Route path="/asesor" element={<RoleRoute allow="asesor" />}>
          <Route element={<AsesorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AsesorDashboardPage />} />
            <Route path="socios" element={<AsesorSociosPage />} />
            <Route path="creditos" element={<AsesorCreditosPage />} />
            <Route path="caja" element={<AsesorCajaPage />} />
          </Route>
        </Route>

        <Route path="/socio" element={<RoleRoute allow="socio" />}>
          <Route element={<SocioLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SocioDashboardPage />} />
            <Route path="mi-cuenta" element={<SocioMiCuentaPage />} />
            <Route path="mis-creditos" element={<SocioMisCreditosPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
