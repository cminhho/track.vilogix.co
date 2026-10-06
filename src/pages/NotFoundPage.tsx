import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { PUBLIC_CONTACT_ACTION_LABEL } from '../site'

export function NotFoundPage() {
  return (
    <section className="page-intro min-h-[65vh] items-center">
      <PageMeta title="Page not found | VI LOGIX" description="The page you requested does not exist on the VI LOGIX website." noIndex lang="en" />
      <div><p className="eyebrow">Error 404</p><h1>Page not found.</h1><p>The address may have changed or the page may no longer exist.</p></div>
      <div className="hero-actions"><Link to="/" className="primary-action">Return Home</Link><Link to="/contact" className="secondary-action">{PUBLIC_CONTACT_ACTION_LABEL}</Link></div>
    </section>
  )
}
