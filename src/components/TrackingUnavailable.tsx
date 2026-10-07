import { ArrowLeft, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TrackingUnavailable() {
  return (
    <section className="tracking-invalid" aria-labelledby="tracking-invalid-title">
      <PackageSearch aria-hidden="true" />
      <p className="eyebrow">Tracking unavailable</p>
      <h1 id="tracking-invalid-title">Tracking number not found.</h1>
      <p>Check the complete tracking number and try again.</p>
      <Link className="primary-action" to="/">Return to tracking <ArrowLeft aria-hidden="true" /></Link>
    </section>
  )
}
