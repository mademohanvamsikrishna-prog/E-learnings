import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'
import { storeTokens as apiStoreTokens, clearTokens as apiClearTokens } from '@/services/api'

const AuthContext = createContext(null)

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'access_token'
const USER_KEY = 'elearn_user'

/** Centralised clear: removes tokens + user from BOTH storages (BUG-07). */
function clearStorage() {
  apiClearTokens()
}

export function AuthProvider({ children }) {
  // Restore user from localStorage on first render (avoids flash of unauthenticated state)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try { return JSON.parse(stored) } catch { return null }
    }
    return null
  })

  // true while we are verifying a stored token against the backend
  // BUG-07 fix: check BOTH sessionStorage and localStorage for an existing token
  const [isInitializing, setIsInitializing] = useState(() =>
    !!(sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY))
  )
  const [isLoading, setIsLoading] = useState(false)

  // ── On mount: re-validate any stored access token ────────────────────────────
  useEffect(() => {
    const hasToken = !!(sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY))
    if (!hasToken) {
      setIsInitializing(false)
      return
    }

    let cancelled = false

    authService
      .getProfile()
      .then((profile) => {
        if (cancelled) return
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
      })
      .catch(() => {
        if (cancelled) return
        // Token is invalid / expired — clear everything
        clearStorage()
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false)
      })

    return () => { cancelled = true }
  }, [])

  // ── Login: POST /auth/login → store tokens → GET /users/me ───────────────────
  // BUG-07 fix: accept `remember` and route to sessionStorage when false
  const login = useCallback(async ({ email, password, remember = true }) => {
    setIsLoading(true)
    try {
      const tokenResponse = await authService.login({ email, password })
      // apiStoreTokens picks localStorage (remember=true) or sessionStorage (remember=false)
      apiStoreTokens(tokenResponse, remember)

      const profile = await authService.getProfile()
      setUser(profile)
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
      return profile
    } catch (err) {
      clearStorage()
      setUser(null)
      // Re-throw so the login page can display the error message
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Register: POST /auth/register → then auto-login ──────────────────────────
  const register = useCallback(async (userData) => {
    setIsLoading(true)
    try {
      // Register first (returns UserResponse, no token)
      await authService.register(userData)

      // Auto-login with the same credentials (always remember on registration)
      const tokenResponse = await authService.login({
        email: userData.email,
        password: userData.password,
      })
      apiStoreTokens(tokenResponse, true)

      const profile = await authService.getProfile()
      setUser(profile)
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
      return profile
    } catch (err) {
      clearStorage()
      setUser(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearStorage()
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isStudent: user?.role === 'STUDENT',
    isInstructor: user?.role === 'INSTRUCTOR',
    isAdmin: user?.role === 'ADMIN',
    /** True while we replay a stored token on first mount */
    isInitializing,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
