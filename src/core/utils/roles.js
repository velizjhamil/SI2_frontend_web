/**
 * Mapeo canónico de nombres de rol (devueltos por FastAPI en MAYÚSCULAS)
 * hacia los prefijos de ruta del frontend.
 *
 * Roles soportados (6 base del sistema Multi-Tenant):
 *   SUPERADMIN       → /superadmin/...
 *   ADMINISTRADOR    → /admin/...
 *   CAJERO           → /cajero/...
 *   OFICIAL_CREDITO  → /oficial/...
 *   CONTADOR         → /contador/...
 *   SOCIO            → /socio/...
 *
 * La normalización es case-insensitive para tolerar variantes.
 */

const ROLE_PREFIXES = {
  // Nivel SaaS
  superadmin: 'superadmin',

  // Nivel cooperativa
  administrador: 'admin',
  cajero: 'cajero',
  oficial_credito: 'oficial',
  contador: 'contador',
  socio: 'socio',

  // Aliases legacy (por si existen usuarios del seed anterior)
  asesor: 'asesor',
  asesor_credito: 'asesor',
}

/** Rutas de inicio que NO siguen el patrón /<prefix>/dashboard */
const ROLE_HOME_OVERRIDES = {
  superadmin: '/superadmin/cooperativas',
}

/** Normaliza el nombre de rol a minúsculas sin espacios externos. */
export function normalizeRole(roleName) {
  return roleName ? roleName.trim().toLowerCase() : ''
}

/** Devuelve el prefijo de ruta para el rol o null si no es reconocido. */
export function getRolePrefix(roleName) {
  return ROLE_PREFIXES[normalizeRole(roleName)] ?? null
}

/** Devuelve la ruta home del rol (respeta overrides) o null si el rol es desconocido. */
export function getRoleHomePath(roleName) {
  const normalized = normalizeRole(roleName)
  if (ROLE_HOME_OVERRIDES[normalized]) return ROLE_HOME_OVERRIDES[normalized]
  const prefix = getRolePrefix(normalized)
  return prefix ? `/${prefix}/dashboard` : null
}
