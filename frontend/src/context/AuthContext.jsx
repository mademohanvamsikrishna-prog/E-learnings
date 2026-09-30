import { createContext, useContext, useState, useEffect } from 'react'
import { mockUser, mockInstructor } from '@/data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Default to guest (null) so users start unauthenticated on the Landing Page
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('elearn_user')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('elearn_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('elearn_user')
    }
  }, [user])

  const login = async ({ email, password, role = 'STUDENT' }) => {
    setIsLoading(true)
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    const selectedUser = role === 'INSTRUCTOR'
      ? { ...mockInstructor, email: email || mockInstructor.email }
      : { ...mockUser, email: email || mockUser.email }
    setUser(selectedUser)
    setIsLoading(false)
    return selectedUser
  }

  const register = async (userData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newUser = {
      ...(userData.role === 'INSTRUCTOR' ? mockInstructor : mockUser),
      name: userData.name || mockUser.name,
      email: userData.email || mockUser.email,
      role: userData.role || 'STUDENT',
    }
    setUser(newUser)
    setIsLoading(false)
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('elearn_user')
  }

  // Handy evaluator helper to easily switch between Student and Instructor roles
  const switchRole = (newRole) => {
    if (newRole === 'INSTRUCTOR') {
      setUser((prev) => ({
        ...mockInstructor,
        email: prev?.email || mockInstructor.email,
      }))
    } else {
      setUser((prev) => ({
        ...mockUser,
        email: prev?.email || mockUser.email,
      }))
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isStudent: user?.role === 'STUDENT',
    isInstructor: user?.role === 'INSTRUCTOR',
    isLoading,
    login,
    register,
    logout,
    switchRole,
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
