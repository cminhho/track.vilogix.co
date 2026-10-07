import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/SiteChrome'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TadiTrackingPage } from './pages/TadiTrackingPage'
import { VietAnTrackingPage } from './pages/VietAnTrackingPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="TDE/:trackingNumber" element={<TadiTrackingPage />} />
        <Route path="VAE/:trackingNumber" element={<VietAnTrackingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}

export default App
