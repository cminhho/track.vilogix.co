import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Building2,
  CheckCircle2,
  PackageCheck,
  Plane,
  ShoppingBag,
  Store,
  Warehouse,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { LogisticsImage } from '../components/LogisticsImage'
import { PageMeta } from '../components/PageMeta'
import { PUBLIC_MEDIA } from '../data/publicMedia'
import {
  PUBLIC_CONTACT_ACTION_LABEL,
  PUBLIC_VI_MADE_URL,
  PUBLIC_VI_PICK_URL,
} from '../site'

const positioningPoints = [
  ['01', 'Customer-owned goods', 'You purchase. We receive and manage.'],
  ['02', 'Controlled handling', 'Goods are received, recorded, checked and prepared according to the agreed scope.'],
  ['03', 'Transparent scope', 'Handling, storage, consolidation, packing and shipping are quoted based on the actual requirements.'],
]

const audiences = [
  { icon: ShoppingBag, title: 'International Buyers', copy: 'Consolidate purchases from multiple Vietnamese suppliers.' },
  { icon: Store, title: 'Brands & Retailers', copy: 'Use Vietnam as a sourcing, production and fulfillment base.' },
  { icon: Boxes, title: 'Wholesale Buyers', copy: 'Combine bulk orders and prepare efficient international shipments.' },
  { icon: Building2, title: 'Online Sellers', copy: 'Store, manage and ship inventory from Vietnam.' },
]

const coreServices = [
  { number: '01', icon: PackageCheck, title: 'Receiving & Pickup', copy: 'Receive domestic deliveries or coordinate collection from supplier, factory and store addresses.' },
  { number: '02', icon: Warehouse, title: 'Storage & Product Care', copy: 'Record, store, inspect, count, measure, photograph, repack and label goods to an agreed brief.' },
  { number: '03', icon: Boxes, title: 'Consolidation & Fulfillment', copy: 'Combine goods from multiple sources and prepare each shipment to reduce unnecessary handling and packaging.' },
  { number: '04', icon: Plane, title: 'International Shipping', copy: 'Coordinate shipment preparation and carrier handover for air, sea or express delivery.' },
]

const workflow = [
  ['01', 'Receive & Record', 'We receive supplier deliveries or arranged pickups, then record the parcels and goods against the confirmed shipment scope.'],
  ['02', 'Store & Care', 'We store the goods and carry out the requested checks, photos, measurements, labeling or repacking.'],
  ['03', 'Consolidate & Prepare', 'We combine items from multiple sources, remove unnecessary packaging and prepare the final shipment configuration.'],
  ['04', 'Coordinate & Ship', 'We prepare and coordinate shipment documentation, packing details and carrier handover for the selected route.'],
]

const shipmentInputs = [
  ['01', 'What arrives', 'Supplier list, expected parcel count, product type, quantity, declared value, packaging, and any batteries, liquids or fragile items.'],
  ['02', 'What we do', 'Receiving, inspection, counting, photography, measurement, labeling, repacking, consolidation, and storage tasks are confirmed against your written brief.'],
  ['03', 'What it costs', 'Handling, storage, packing, and international shipping charges are itemised for the agreed work rather than assumed from a generic package.'],
  ['04', 'Where it goes', 'Destination, preferred shipping method, route, and importer information are confirmed before final packing and carrier handover.'],
]

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About VI LOGIX | Vietnam Fulfillment for International Buyers"
        description="VI LOGIX handles the Vietnam side of your supply chain: receiving, storage, product care, consolidation and international shipping from Ho Chi Minh City."
        path="/about"
        lang="en"
      />

      <div className="about-hero-band">
        <section className="page-intro about-intro public-photo-intro">
          <div className="about-hero-copy">
            <p className="eyebrow">About VI LOGIX</p>
            <h1>A fulfillment warehouse in Ho Chi Minh City for goods you already own.</h1>
            <p>From our receiving location in Thu Duc, VI LOGIX helps international buyers, brands, and businesses record, store, check, consolidate, and prepare goods they have already purchased for international shipping.</p>
            <div className="hero-actions">
              <Link to="/contact" className="primary-action">{PUBLIC_CONTACT_ACTION_LABEL} <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
          <figure className="about-intro-media">
            <LogisticsImage asset={PUBLIC_MEDIA.inventoryScan} sizes="(min-width: 1024px) 46vw, 100vw" />
            <figcaption className="scope-panel">
              <p className="eyebrow">Vietnam-side operations</p>
              <strong>Local infrastructure for goods you already own.</strong>
              <span>One Thu Duc receiving point for storage, product care, consolidation and international shipment preparation.</span>
            </figcaption>
          </figure>
        </section>
      </div>

      <section className="content-section about-positioning-section">
        <div className="about-positioning-layout">
          <div className="about-positioning-copy">
            <p className="eyebrow">What VI LOGIX does</p>
            <h2>You buy the goods. We handle everything on the Vietnam side.</h2>
            <p>VI LOGIX is a Vietnam-based fulfillment and logistics partner for customers and businesses that already source or purchase goods in Vietnam. We provide the local infrastructure in Thu Duc to receive, record, manage, consolidate and prepare those goods for shipping to the United States, the United Kingdom and Europe, Australia, Canada, the Middle East, and other supported destinations.</p>
          </div>
          <div className="principle-list about-principle-list">
            {positioningPoints.map(([number, title, copy]) => (
              <article key={title}>
                <CheckCircle2 size={21} strokeWidth={1.8} aria-hidden="true" />
                <div><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
        <aside className="service-boundary-note" aria-label="VI LOGIX service boundary">
          <div>
            <p className="eyebrow">Where we begin</p>
            <h3>Already purchased? We handle the rest.</h3>
            <p>VI LOGIX starts where purchasing ends. We receive and manage goods you have already purchased from suppliers, factories, stores or marketplaces in Vietnam.</p>
          </div>
          <a href={PUBLIC_VI_PICK_URL} target="_blank" rel="noreferrer">
            Need help finding and purchasing products? Visit VI PICK <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </aside>
      </section>

      <section className="about-audience-section">
        <div className="content-section">
          <div className="section-header">
            <div><p className="eyebrow">Who we work with</p><h2>Built for businesses and buyers sourcing from Vietnam.</h2></div>
            <p>A practical Vietnam base for customers managing goods across one or many local suppliers.</p>
          </div>
          <div className="about-audience-grid">
            {audiences.map(({ icon: Icon, title, copy }, index) => (
              <article key={title}>
                <div className="about-audience-marker"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /><span>0{index + 1}</span></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section about-services-section">
        <div className="section-header compact">
          <div><p className="eyebrow">Our core services</p><h2>One operating base. Four connected services.</h2></div>
        </div>
        <div className="about-service-list">
          {coreServices.map(({ number, icon: Icon, title, copy }) => (
            <article key={title}>
              <div className="about-service-marker"><span>{number}</span><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></div>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-workflow-section">
        <div className="content-section about-workflow-layout">
          <div className="scope-boundary-intro">
            <p className="eyebrow">How we operate</p>
            <h2>How we manage your goods.</h2>
            <p>Every shipment follows a confirmed handling scope, so the work at each stage matches the goods and their destination.</p>
          </div>
          <ol className="workflow-list about-workflow-list">
            {workflow.map(([number, title, copy]) => <li key={title}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section className="scope-boundary-section">
        <div className="content-section scope-boundary-layout">
          <div className="scope-boundary-intro">
            <p className="eyebrow">Written scope confirmation</p>
            <h2>How we confirm your shipment before handling begins.</h2>
            <p>We agree these four parts in writing so the goods, work, charges, destination, and route are clear before anything is handled or dispatched.</p>
          </div>
          <div>
            <ol className="scope-boundary-list">
              {shipmentInputs.map(([number, title, copy]) => <li key={title}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}
            </ol>
            <div className="scope-operational-notes">
              <p>Nothing is handled or dispatched until the applicable scope is agreed in writing.</p>
              <p>Import permits, duties, taxes and destination clearance remain with the buyer or importer unless agreed otherwise in writing.</p>
              <p>Handling does not include product certification, testing or regulatory approval unless separately agreed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-conversion-section">
        <div className="content-section ecosystem-section">
          <div className="section-header">
            <div><p className="eyebrow">The VI ecosystem</p><h2>Three independently usable Vietnam-side services.</h2></div>
            <p>VI PICK, VI MADE, and VI LOGIX are related service lines. Use one independently or connect the stages that match your project.</p>
          </div>
          <div className="ecosystem-links">
            <a href={PUBLIC_VI_PICK_URL} target="_blank" rel="noreferrer">
              <span>Buy & source</span>
              <strong>VI PICK <ArrowUpRight size={18} aria-hidden="true" /></strong>
              <p>Need help finding and purchasing products from Vietnam? VI PICK provides sourcing and personal shopping services.</p>
            </a>
            <a href={PUBLIC_VI_MADE_URL} target="_blank" rel="noreferrer">
              <span>Develop & produce</span>
              <strong>VI MADE <ArrowUpRight size={18} aria-hidden="true" /></strong>
              <p>Need product development or production coordination in Vietnam? VI MADE works with brands and Vietnam production partners.</p>
            </a>
          </div>
        </div>
        <div className="closing-cta about-closing-cta">
          <div><p className="eyebrow">Plan your fulfillment</p><h2>Already purchased goods in Vietnam?</h2><p>Tell us what you need to receive, manage, consolidate and ship. We respond to quote requests within 1 business day.</p></div>
          <div className="hero-actions">
            <Link to="/contact" className="primary-action">{PUBLIC_CONTACT_ACTION_LABEL} <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
