import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { getInsightBySlug } from '../data/insights'
import { PUBLIC_CONTACT_ACTION_LABEL } from '../site'
import { NotFoundPage } from './NotFoundPage'

export function BlogArticlePage() {
  const { slug } = useParams()
  const article = getInsightBySlug(slug)

  if (!article) return <NotFoundPage />

  const articlePath = `/blog/${article.slug}`
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Fulfillment insights', path: '/#blog' },
    { name: article.title, path: articlePath },
  ]

  return (
    <>
      <PageMeta title={`${article.title} | VI LOGIX`} description={article.description} path={articlePath} lang="en" ogType="article" breadcrumbs={breadcrumbs} />
      <article className="insight-article">
        <header className="insight-header">
          <nav className="insight-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#blog"><ArrowLeft size={14} aria-hidden="true" />Fulfillment insights</Link></li>
              <li aria-current="page">Guide</li>
            </ol>
          </nav>
          <p className="eyebrow">{article.category} · {article.readingTime}</p>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </header>

        <div className="insight-layout">
          <div className="insight-body">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.points && (
                  <ul>
                    {section.points.map((point) => <li key={point}><CheckCircle2 size={18} aria-hidden="true" />{point}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <aside className="insight-takeaway" aria-label="Key takeaway">
            <p className="eyebrow">Key takeaway</p>
            <p>{article.takeaway}</p>
            <Link to="/contact" className="primary-action">{PUBLIC_CONTACT_ACTION_LABEL} <ArrowRight size={17} aria-hidden="true" /></Link>
          </aside>
        </div>
      </article>
    </>
  )
}
