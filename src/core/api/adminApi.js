import { client } from './client'

/** Obtiene las estadísticas de resumen para el dashboard del admin. */
export async function fetchAdminStats() {
  const { data } = await client.get('/admin/stats')
  return data
}

/**
 * Obtiene los registros de la bitácora de auditoría.
 * @param {Object} params
 * @param {number} [params.limite=50]
 * @param {number} [params.offset=0]
 * @param {string} [params.modulo] - Filtrar por módulo
 */
export async function fetchBitacora({ limite = 50, offset = 0, modulo } = {}) {
  const params = { limite, offset }
  if (modulo) params.modulo = modulo
  const { data } = await client.get('/admin/bitacora', { params })
  return data
}

/** Obtiene los módulos disponibles en la bitácora (dinámico desde BD). */
export async function fetchModulos() {
  const { data } = await client.get('/admin/modulos')
  return data
}

/** Registra un nuevo socio (KYC). */
export async function registrarSocio(datosSocio) {
  const { data } = await client.post('/socios/registro', datosSocio)
  return data
}

/**
 * Lista los socios registrados (SSD Flujo 2, paso 6: "actualiza lista de socios").
 * @param {Object} params
 * @param {number} [params.limite=50]
 * @param {number} [params.offset=0]
 */
export async function fetchSocios({ limite = 50, offset = 0 } = {}) {
  const params = { limite, offset }
  const { data } = await client.get('/socios/', { params })
  return data
}
