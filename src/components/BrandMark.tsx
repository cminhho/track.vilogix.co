import { Link } from 'react-router-dom'

export function BrandMark({ to = '/' }: { to?: string | null }) {
  const content = (
    <span className="logo-copy"><strong><span>VI</span> LOGIX</strong><small>Fulfillment &amp; Logistics</small></span>
  )

  if (to === null) return <div className="logo-plate" aria-label="VI LOGIX">{content}</div>

  return <Link to={to} className="logo-plate" aria-label="VI LOGIX — Home">{content}</Link>
}
