import { client } from './client'

export async function listCooperativas({ estado } = {}) {
  const { data } = await client.get('/cooperativas', {
    params: estado ? { estado } : undefined,
  })
  return data
}

export async function getCooperativa(id) {
  const { data } = await client.get(`/cooperativas/${id}`)
  return data
}

export async function createCooperativa(payload) {
  const { data } = await client.post('/cooperativas', payload)
  return data
}

export async function updateCooperativa(id, payload) {
  const { data } = await client.put(`/cooperativas/${id}`, payload)
  return data
}

export async function deactivateCooperativa(id) {
  const { data } = await client.delete(`/cooperativas/${id}`)
  return data
}

export async function reactivateCooperativa(id) {
  const { data } = await client.post(`/cooperativas/${id}/reactivar`)
  return data
}
