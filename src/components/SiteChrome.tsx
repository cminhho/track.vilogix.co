import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LEAN_TRACKING_COPY } from '../config/trackingCopy'
import { getTrackingLocale } from '../lib/trackingLocale'
import { buildMainSiteUrl, buildWhatsAppUrl } from '../site'
import type { TrackingLocale } from '../types/tracking'
import { BrandMark } from './BrandMark'

function LanguageSwitch({ locale, pathname, placement }: { locale: TrackingLocale; pathname: string; placement: 'header' | 'footer' | 'menu' }) {
  const copy = LEAN_TRACKING_COPY[locale]
  const options: Array<{ code: TrackingLocale; label: string; search: string }> = [
    { code: 'en', label: copy.language.en, search: '' },
    { code: 'vi', label: copy.language.vi, search: '?lang=vi' },
  ]

  return (
    <nav className={`tracking-lang tracking-lang--${placement}`} aria-label={copy.language.label}>
      {options.map(({ code, label, search }) => (
        <Link
          key={code}
          to={{ pathname, search }}
          lang={code}
          aria-current={locale === code ? 'true' : undefined}
          className={locale === code ? 'is-active' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

/**
 * Header actions. ≥720px: inline (language, WhatsApp icon on vendor pages, CTA).
 * <720px: one menu toggle that opens a panel with the same actions as full-width rows.
 */
function TrackingHeader({ locale, pathname, showLanguage }: { locale: TrackingLocale; pathname: string; showLanguage: boolean }) {
  const { header, footer, supportMessage } = LEAN_TRACKING_COPY[locale]
  const trackingNumber = showLanguage ? '' : pathname.split('/').filter(Boolean)[1] ?? ''
  const content = showLanguage ? 'lookup' : 'embed'
  const quoteHref = buildMainSiteUrl('quote', locale, 'header', content)
  const helpHref = buildWhatsAppUrl(trackingNumber ? header.helpMessage.replace('{number}', trackingNumber) : supportMessage)
  const helpLabel = trackingNumber ? header.help : footer.help
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname, location.search])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header site-header-tracking sticky top-0 z-40">
      <div className="site-header-inner">
        <div className="header-brand-cluster"><BrandMark /></div>
        <div className="tracking-header-actions">
          {showLanguage && <LanguageSwitch locale={locale} pathname={pathname} placement="header" />}
          {trackingNumber && (
            <a className="tracking-help-icon" href={helpHref} target="_blank" rel="noopener noreferrer" aria-label={header.help} title={header.help}>
              <MessageCircle aria-hidden="true" />
            </a>
          )}
          <a className="header-cta tracking-quote-cta" href={quoteHref} aria-label={header.quoteLabel}>{header.quote}</a>
        </div>
        <button
          type="button"
          className="tracking-menu-btn"
          aria-expanded={open}
          aria-controls="tracking-menu"
          aria-label={open ? header.menuClose : header.menuOpen}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div id="tracking-menu" className="tracking-menu" hidden={!open}>
        <a href={helpHref} target="_blank" rel="noopener noreferrer" className="tracking-menu-row">
          <MessageCircle aria-hidden="true" /> {helpLabel}
        </a>
        <a href={buildMainSiteUrl('home', locale, 'header', content)} className="tracking-menu-row">
          <ArrowUpRight aria-hidden="true" /> {footer.website}
        </a>
        {showLanguage && (
          <div className="tracking-menu-row tracking-menu-row--lang">
            <LanguageSwitch locale={locale} pathname={pathname} placement="menu" />
          </div>
        )}
        <div className="tracking-menu-cta">
          <a className="header-cta tracking-quote-cta" href={quoteHref} aria-label={header.quoteLabel}>{header.quote}</a>
        </div>
      </div>
    </header>
  )
}

function TrackingFooter({ locale, pathname }: { locale: TrackingLocale; pathname: string }) {
  const { footer, supportMessage } = LEAN_TRACKING_COPY[locale]

  return (
    <footer className="tracking-footer">
      <p className="tracking-footer-legal">
        <span>© {new Date().getFullYear()} VI LOGIX</span>
        <span aria-hidden="true">·</span>
        <span>{footer.tagline}</span>
      </p>
      <nav className="tracking-footer-links" aria-label={footer.website}>
        <a href={buildMainSiteUrl('home', locale, 'footer')} aria-label={footer.websiteLabel}>{footer.website} <ArrowUpRight aria-hidden="true" /></a>
        <a href={buildWhatsAppUrl(supportMessage)} target="_blank" rel="noopener noreferrer">{footer.help}</a>
      </nav>
      <LanguageSwitch locale={locale} pathname={pathname} placement="footer" />
    </footer>
  )
}

export function PublicLayout() {
  const location = useLocation()
  const isTrackingPage = /^\/(?:TDE\/IDB2026\d{4}|VAE\/\d{7})\/?$/i.test(location.pathname)
  const locale = getTrackingLocale(location.search)
  const copy = LEAN_TRACKING_COPY[locale]

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className={`site-shell${isTrackingPage ? ' tracking-page-shell' : ''}`}>
      <a href="#main-content" className="skip-link">{copy.skipToContent}</a>
      <TrackingHeader locale={locale} pathname={location.pathname} showLanguage={!isTrackingPage} />
      <main id="main-content" className="site-main"><Outlet /></main>
      {!isTrackingPage && <TrackingFooter locale={locale} pathname={location.pathname} />}
    </div>
  )
}
