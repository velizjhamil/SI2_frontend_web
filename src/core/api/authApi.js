import { client } from './client'

export async function login({ correo, contrasena }) {
  const { data } = await client.post(
    '/auth/login',
    { correo: correo.trim().toLowerCase(), contrasena },
    { skipUnauthorizedHandling: true },
  )
  return data
}

export async function fetchMe() {
  const { data } = await client.get('/auth/me')
  return data
}

export async function logout() {
  const { data } = await client.post('/auth/logout', {}, { skipUnauthorizedHandling: true })
  return data
}
