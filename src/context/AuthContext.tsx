import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { authenticateDemoUser, clearSession, persistSession, readSession } from '../lib/auth'
import type { AuthSession } from '../types/portal'

interface AuthContextValue {
  session: AuthSession | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readSession())

  const value = useMemo<AuthContextValue>(() => ({
    session,
    login: (email, password) => {
      const authenticated = authenticateDemoUser(email, password)
      if (!authenticated) return false
      persistSession(authenticated)
      setSession(authenticated)
      return true
    },
    logout: () => {
      clearSession()
      setSession(null)
    },
  }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
