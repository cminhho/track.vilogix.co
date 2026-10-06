import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/portal'

export function ProtectedRoute({ role }: { role?: UserRole }) {
  const { session } = useAuth()
  const location = useLocation()

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role && session.role !== role) return <Navigate to="/app/forbidden" replace />
  return <Outlet />
}
