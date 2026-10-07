import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TRACKING_COPY, useTrackingLocale } from '../lib/trackingLocale'
import { BrandMark } from './BrandMark'

function TrackingHeader() {
  return (
    <header className="site-header site-header-tracking sticky top-0 z-40">
      <div className="site-header-inner">
        <div className="header-brand-cluster"><BrandMark /></div>
      </div>
    </header>
  )
}

function TrackingFooter() {
  return (
    <footer className="tracking-footer">
      <BrandMark />
      <span>© {new Date().getFullYear()} VI LOGIX</span>
    </footer>
  )
}

export function PublicLayout() {
  const location = useLocation()
  const isTrackingPage = /^\/(?:TDE\/IDB2026\d{4}|VAE\/\d{7})\/?$/i.test(location.pathname)
  const locale = useTrackingLocale(location.pathname === '/' ? location.search : '')
  const copy = TRACKING_COPY[locale]

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }, [location.pathname])

  return (
    <div className={`site-shell${isTrackingPage ? ' tracking-page-shell' : ''}`}>
      <a href="#main-content" className="skip-link">{copy.skipToContent}</a>
      <TrackingHeader />
      <main id="main-content" className="site-main"><Outlet /></main>
      {!isTrackingPage && <TrackingFooter />}
    </div>
  )
}
