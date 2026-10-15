import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

/**
 * Axios instance pre-configured for the backend API.
 * Automatically attaches the JWT token from localStorage or sessionStorage.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Token storage helpers ─────────────────────────────────────────────────────
// Reads from sessionStorage first ("remember me" off), then localStorage.
export function getAccessToken() {
  return sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
}
export function getRefreshToken() {
  return sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token')
}
export function storeTokens(tokenResponse, remember = true) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('access_token', tokenResponse.access_token)
  storage.setItem('refresh_token', tokenResponse.refresh_token)
}
export function clearTokens() {
  ;['access_token', 'refresh_token', 'elearn_user'].forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })
}

// ── Request interceptor: attach Bearer token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: BUG-02 — token refresh before logout ────────────────
let _isRefreshing = false
let _refreshQueue = [] // requests waiting for new token

function _processQueue(error, newToken = null) {
  _refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(newToken),
  )
  _refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only attempt refresh on 401 errors that haven't been retried yet
    // and that are NOT the refresh endpoint itself (to avoid infinite loops)
    if (
      error.response?.status === 401 &&
      !original._retry &&
      original.url !== '/auth/refresh'
    ) {
      if (_isRefreshing) {
        // Queue this request until the ongoing refresh completes
        return new Promise((resolve, reject) => {
          _refreshQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return api(original)
          })
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      _isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        // No refresh token stored — force logout
        clearTokens()
        _isRefreshing = false
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        // Preserve "remember me" preference: check which storage held the old token
        const usedLocal = !!localStorage.getItem('refresh_token')
        storeTokens(data, usedLocal)

        api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
        original.headers.Authorization = `Bearer ${data.access_token}`

        _processQueue(null, data.access_token)
        _isRefreshing = false

        return api(original)
      } catch (refreshError) {
        _processQueue(refreshError, null)
        _isRefreshing = false
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
