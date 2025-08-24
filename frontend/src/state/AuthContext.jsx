import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import jwtDecode from 'jwt-decode'
import api from '../utils/api.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => token ? jwtDecode(token) : null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setUser(jwtDecode(token))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }, [token])

  const login = useCallback((tok) => setToken(tok), [])
  const logout = useCallback(() => setToken(''), [])

  const value = useMemo(() => ({ token, user, login, logout }), [token, user, login, logout])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() { return useContext(AuthCtx) }
