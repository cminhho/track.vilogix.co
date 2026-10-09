import { ArrowRight, PackageSearch } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { LEAN_TRACKING_COPY } from '../config/trackingCopy'
import { getTrackingLocale, withTrackingLang } from '../lib/trackingLocale'

export function NotFoundPage() {
  const locale = getTrackingLocale(useLocation().search)
  const { notFound } = LEAN_TRACKING_COPY[locale]

  return (
    <section className="tracking-invalid" aria-labelledby="tracking-404-title">
      <PageMeta title="Page not found | VI LOGIX" description="The page you requested does not exist." noIndex lang={locale} />
      <PackageSearch aria-hidden="true" />
      <p className="eyebrow">{notFound.eyebrow}</p>
      <h1 id="tracking-404-title">{notFound.title}</h1>
      <p>{notFound.body}</p>
      <div className="tracking-invalid-actions">
        <Link className="primary-action" to={withTrackingLang('/', locale)}>{notFound.back} <ArrowRight aria-hidden="true" /></Link>
      </div>
    </section>
  )
}
