import type { AuthSession, DemoUser } from '../types/portal'

const SESSION_KEY = 'vi-express.portal.session.v1'

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user-ops-01',
    name: 'Nguyễn Minh Anh',
    email: 'nhanvien@viexpress.vn',
    password: 'demo123',
    role: 'employee',
    organization: 'VI LOGIX',
  },
  {
    id: 'user-partner-01',
    name: 'Trần Quốc Bảo',
    email: 'doitac@viexpress.vn',
    password: 'demo123',
    role: 'partner',
    partnerId: 'partner-lotus',
    organization: 'Lotus Commerce',
  },
]

const toSession = ({ password: _password, id, ...user }: DemoUser): AuthSession => ({ ...user, userId: id })

export const authenticateDemoUser = (email: string, password: string): AuthSession | null => {
  const normalizedEmail = email.trim().toLowerCase()
  const user = DEMO_USERS.find((candidate) => candidate.email === normalizedEmail && candidate.password === password)
  return user ? toSession(user) : null
}

export const readSession = (): AuthSession | null => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed.userId || !parsed.role || !parsed.email) return null
    return parsed
  } catch {
    return null
  }
}

export const persistSession = (session: AuthSession) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const clearSession = () => window.localStorage.removeItem(SESSION_KEY)
