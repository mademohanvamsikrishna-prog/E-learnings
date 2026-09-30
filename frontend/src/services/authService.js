import api from '@/services/api'

export const authService = {
  /** Register a new account */
  register: (data) => api.post('/auth/register', data).then(r => r.data),

  /** Login and retrieve JWT tokens */
  login: (data) => api.post('/auth/login', data).then(r => r.data),

  /** Fetch the current authenticated user's profile */
  getProfile: () => api.get('/users/me').then(r => r.data),

  /** Refresh access token */
  refreshToken: (refresh_token) =>
    api.post('/auth/refresh', { refresh_token }).then(r => r.data),
}
