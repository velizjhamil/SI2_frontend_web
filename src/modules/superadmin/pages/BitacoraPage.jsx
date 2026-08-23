import AdminDashboard from '../../admin/pages/AdminDashboard'

/**
 * El SuperAdmin ve el mismo dashboard global de estadísticas y bitácora.
 * Como su cooperativa_id es null, el backend devuelve datos de toda la plataforma.
 */
export default function BitacoraPage() {
  return <AdminDashboard />
}
