import { beforeEach, describe, expect, it } from 'vitest'
import { authenticateDemoUser, clearSession, persistSession, readSession } from './auth'

describe('demo authentication', () => {
  beforeEach(() => window.localStorage.clear())

  it('authenticates both known roles and rejects an invalid password', () => {
    expect(authenticateDemoUser('NHANVIEN@VIEXPRESS.VN', 'demo123')?.role).toBe('employee')
    expect(authenticateDemoUser('doitac@viexpress.vn', 'demo123')?.role).toBe('partner')
    expect(authenticateDemoUser('doitac@viexpress.vn', 'wrong')).toBeNull()
  })

  it('persists and clears a session', () => {
    const session = authenticateDemoUser('nhanvien@viexpress.vn', 'demo123')!
    persistSession(session)
    expect(readSession()).toEqual(session)
    clearSession()
    expect(readSession()).toBeNull()
  })

  it('ignores malformed stored sessions', () => {
    window.localStorage.setItem('vi-express.portal.session.v1', '{broken')
    expect(readSession()).toBeNull()
  })
})
