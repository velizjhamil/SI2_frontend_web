import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

let getToken = () => null
let handleUnauthorized = null

export function configureAuthInterceptors({ tokenGetter, onUnauthorized }) {
  getToken = tokenGetter ?? (() => null)
  handleUnauthorized = onUnauthorized ?? null
}

export const client = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const skipHandling = error.config?.skipUnauthorizedHandling === true
    if (status === 401 && !skipHandling && handleUnauthorized) {
      handleUnauthorized(error)
    }
    return Promise.reject(error)
  },
)
