import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/SiteChrome'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { DEMO_PORTAL_ENABLED } from './site'

const DemoPortalEntry = DEMO_PORTAL_ENABLED
  ? lazy(() => import('./DemoPortalEntry'))
  : null

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        {!DemoPortalEntry && <Route path="*" element={<NotFoundPage />} />}
      </Route>
      {DemoPortalEntry && (
        <Route
          path="*"
          element={<Suspense fallback={null}><DemoPortalEntry /></Suspense>}
        />
      )}
    </Routes>
  )
}

function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}

export default App
