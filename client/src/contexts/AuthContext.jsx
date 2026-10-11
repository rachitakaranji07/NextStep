import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data?.data?.user || null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const userData = res.data?.data?.user
    setUser(userData)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword: password,
    })
    const userData = res.data?.data?.user
    setUser(userData)
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }

  const updateProfile = async (data) => {
    const res = await api.patch('/auth/profile', data)
    const userData = res.data?.data?.user
    setUser(userData)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
