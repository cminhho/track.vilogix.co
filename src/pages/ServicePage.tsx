import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, MapPin, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { LogisticsImage } from '../components/LogisticsImage'
import { PageMeta } from '../components/PageMeta'
import { PUBLIC_MEDIA } from '../data/publicMedia'
import { getServiceBySlug } from '../data/services'
import { PUBLIC_CONTACT_ACTION_LABEL } from '../site'
import { NotFoundPage } from './NotFoundPage'

export function ServicePage() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) return <NotFoundPage />

  const media = PUBLIC_MEDIA[service.mediaKey]

  return (
    <>
      <PageMeta
        title={service.title}
        description={service.description}
        path={service.path}
        lang="en"
        faqItems={service.faqItems}
        service={{
          name: service.h1,
          description: service.description,
          serviceType: service.serviceTypes,
          areaServed: service.areaServed,
        }}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: service.h1, path: service.path },
        ]}
      />

      <div className="service-page-hero-band">
        <section className="service-page-hero content-section">
          <div className="service-page-hero-copy">
            <Link to="/#services" className="text-action"><ArrowLeft size={16} aria-hidden="true" />All services</Link>
            <p className="eyebrow">{service.eyebrow}</p>
            <h1>{service.h1}</h1>
            <p>{service.lead}</p>
            <div className="hero-actions">
              <Link to="/contact" className="primary-action">{PUBLIC_CONTACT_ACTION_LABEL} <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
            <p className="service-response-note"><Clock3 size={17} aria-hidden="true" />We respond to quote requests within 1 business day.</p>
          </div>
          <figure className="service-page-hero-media">
            <LogisticsImage asset={media} priority sizes="(min-width: 1024px) 46vw, 100vw" />
            <figcaption>Illustrative operational photography. The exact handling scope is confirmed for each shipment.</figcaption>
          </figure>
        </section>
      </div>

      <section className="service-page-fact-rail" aria-label={`${service.h1} facts`}>
        {service.facts.map(({ label, value }, index) => (
          <div key={label}><span>0{index + 1} · {label}</span><strong>{value}</strong></div>
        ))}
      </section>

      <section className="content-section service-page-overview">
        <div className="service-page-overview-intro">
          <p className="eyebrow">What this service does</p>
          <h2>{service.summaryHeading}</h2>
          <p>{service.summary}</p>
          <div className="service-page-location"><MapPin size={18} aria-hidden="true" /><span>Vietnam-side handling in Thu Duc, Ho Chi Minh City</span></div>
        </div>
        <ol className="service-page-steps">
          {service.steps.map(({ title, copy }, index) => (
            <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="service-page-scope-section">
        <div className="content-section service-page-scope-grid">
          <div>
            <p className="eyebrow">Included when agreed</p>
            <h2>Tasks matched to your shipment brief.</h2>
            <ul>
              {service.included.map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Scope boundaries</p>
            <h2>What must be confirmed first.</h2>
            <ul>
              {service.boundaries.map((item) => <li key={item}><ShieldCheck size={18} aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {service.coordination ? (
        <section className="service-coordination-section">
          <div className="content-section service-coordination-layout">
            <div><p className="eyebrow">Route-dependent handover</p><h2>{service.coordination.heading}</h2><p>{service.coordination.copy}</p></div>
            <ul>{service.coordination.modes.map((mode, index) => <li key={mode}><span>0{index + 1}</span>{mode}</li>)}</ul>
          </div>
        </section>
      ) : null}

      <section className="faq-section service-page-faq">
        <div className="content-section faq-layout">
          <div className="faq-intro">
            <p className="eyebrow">Service questions</p>
            <h2>What buyers ask before goods move.</h2>
            <p>These answers define the operating boundary. Shipment-specific acceptance, tasks, timing, and charges are confirmed in writing.</p>
          </div>
          <div className="faq-list">
            {service.faqItems.map(({ question, answer }, index) => (
              <details key={question} open={index === 0}>
                <summary><span>{question}</span><span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta service-page-closing-cta">
        <div><p className="eyebrow">Plan the shipment</p><h2>Confirm the goods, work, destination, and route.</h2><p>Send the shipment essentials for a written scope review. We respond to quote requests within 1 business day.</p></div>
        <Link to="/contact" className="primary-action">Request a Shipment Quote <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
    </>
  )
}
