const ROLE_PREFIXES = {
  administrador: 'admin',
  asesor: 'asesor',
  asesor_credito: 'asesor',
  socio: 'socio',
}

export function normalizeRole(roleName) {
  return roleName ? roleName.trim().toLowerCase() : ''
}

export function getRolePrefix(roleName) {
  return ROLE_PREFIXES[normalizeRole(roleName)] ?? null
}

export function getRoleHomePath(roleName) {
  const prefix = getRolePrefix(roleName)
  return prefix ? `/${prefix}/dashboard` : null
}
