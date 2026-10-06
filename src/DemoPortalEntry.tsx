import { Navigate, Route, Routes } from 'react-router-dom'
import { PortalLayout } from './components/PortalLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicLayout } from './components/SiteChrome'
import { AuthProvider } from './context/AuthContext'
import { DashboardPage } from './pages/DashboardPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { InternalQuotePage } from './pages/InternalQuotePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ShipmentDetailPage } from './pages/ShipmentDetailPage'
import { ShipmentFormPage } from './pages/ShipmentFormPage'
import { ShipmentsPage } from './pages/ShipmentsPage'

export default function DemoPortalEntry() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<PortalLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="shipments" element={<ShipmentsPage />} />
            <Route path="shipments/new" element={<ShipmentFormPage />} />
            <Route path="shipments/:id" element={<ShipmentDetailPage />} />
            <Route path="shipments/:id/edit" element={<ShipmentFormPage />} />
            <Route path="forbidden" element={<ForbiddenPage />} />
            <Route element={<ProtectedRoute role="employee" />}>
              <Route path="quotes" element={<InternalQuotePage standalone={false} />} />
            </Route>
          </Route>
          <Route path="internal/quote" element={<Navigate to="/app/quotes" replace />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
