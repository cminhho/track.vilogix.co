import { ArrowLeft, MessageCircle, PackageSearch } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { LEAN_TRACKING_COPY } from '../config/trackingCopy'
import { getTrackingLocale, withTrackingLang } from '../lib/trackingLocale'
import { buildWhatsAppUrl } from '../site'

export function TrackingUnavailable() {
  const locale = getTrackingLocale(useLocation().search)
  const { unavailable, supportMessage } = LEAN_TRACKING_COPY[locale]

  return (
    <section className="tracking-invalid" aria-labelledby="tracking-invalid-title">
      <PackageSearch aria-hidden="true" />
      <p className="eyebrow">{unavailable.eyebrow}</p>
      <h1 id="tracking-invalid-title">{unavailable.title}</h1>
      <p>{unavailable.body}</p>
      <div className="tracking-invalid-actions">
        <Link className="primary-action" to={withTrackingLang('/', locale)}>{unavailable.back} <ArrowLeft aria-hidden="true" /></Link>
        <a className="text-action" href={buildWhatsAppUrl(supportMessage)} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" /> {unavailable.support}
        </a>
      </div>
    </section>
  )
}
