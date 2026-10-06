import { ArrowLeft, PackageSearch } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { getApprovedTrackingEmbedUrl, normalizeTrackingNumber } from '../config/trackingEmbeds'

export function TrackingPage() {
  const params = useParams<{ trackingNumber: string }>()
  const trackingNumber = normalizeTrackingNumber(params.trackingNumber ?? '')
  const embeddedUrl = getApprovedTrackingEmbedUrl(trackingNumber)

  return (
    <>
      <PageMeta
        title="Shipment Tracking | VI LOGIX"
        description="View the latest tracking updates for your shipment."
        noIndex
        path={embeddedUrl ? `/track/${trackingNumber}` : '/track'}
        lang="en"
      />

      {embeddedUrl ? (
        <section className="tracking-view" aria-labelledby="tracking-view-title">
          <h1 id="tracking-view-title" className="tracking-view-title">Shipment tracking</h1>
          <div className="tracking-frame-shell" aria-label="Shipment tracking details">
            <p className="tracking-frame-loading">Loading tracking details…</p>
            <iframe
              className="tracking-frame"
              src={embeddedUrl}
              title={`Tracking details — ${trackingNumber}`}
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      ) : (
        <section className="tracking-invalid" aria-labelledby="tracking-invalid-title">
          <PackageSearch aria-hidden="true" />
          <p className="eyebrow">Tracking unavailable</p>
          <h1 id="tracking-invalid-title">Tracking number not found.</h1>
          <p>Check the complete tracking number and try again.</p>
          <Link className="primary-action" to="/">Return to tracking <ArrowLeft aria-hidden="true" /></Link>
        </section>
      )}
    </>
  )
}
