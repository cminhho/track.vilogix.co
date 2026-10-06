import { type FormEvent, useRef, useState } from 'react'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { buildWhatsAppInquiryMessage, type WhatsAppInquiry } from '../lib/contact'
import { buildWhatsAppUrl } from '../site'

const SERVICE_OPTIONS = [
  'Receive & Store',
  'Pickup',
  'Product Care',
  'Consolidation',
  'Shipping',
] as const

const INITIAL_FORM: WhatsAppInquiry = {
  name: '',
  goods: '',
  services: [],
  destination: '',
  details: '',
}

export function ContactPage() {
  const [form, setForm] = useState<WhatsAppInquiry>(INITIAL_FORM)
  const [serviceError, setServiceError] = useState(false)
  const serviceGroupRef = useRef<HTMLFieldSetElement>(null)

  const update = <K extends keyof WhatsAppInquiry>(key: K, value: WhatsAppInquiry[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleService = (service: string) => {
    setServiceError(false)
    setForm((current) => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter((item) => item !== service)
        : [...current.services, service],
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.services.length === 0) {
      setServiceError(true)
      serviceGroupRef.current?.focus()
      return
    }

    const whatsappUrl = buildWhatsAppUrl(buildWhatsAppInquiryMessage(form))
    window.location.assign(whatsappUrl)
  }

  return (
    <>
      <PageMeta
        title="Vietnam Fulfillment & Shipping Quote | VI LOGIX"
        description="Request a scope review for receiving, storage, product care, consolidation, packing and international shipping from Ho Chi Minh City."
        path="/contact"
        lang="en"
      />
      <section className="contact-page content-section">
        <div className="contact-shell">
          <div className="contact-intro">
            <MessageCircle size={30} strokeWidth={1.7} aria-hidden="true" />
            <p className="eyebrow">Thu Duc · Ho Chi Minh City</p>
            <h1>Request a Vietnam fulfillment and shipping quote.</h1>
            <p>Tell us what you have purchased, which suppliers will send it, what handling you need, and where the shipment is going.</p>
            <div className="contact-journey" aria-label="Inquiry process">
              <span><strong>01</strong> Fill in</span>
              <span><strong>02</strong> Review</span>
              <span><strong>03</strong> WhatsApp</span>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-heading">
              <p className="eyebrow">Shipment brief</p>
              <h2>Share the essentials.</h2>
            </div>

            <label className="field-label">Your name
              <input
                className="form-control"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
              />
            </label>

            <div className="contact-field-row">
              <label className="field-label">What are you shipping?
                <input
                  className="form-control"
                  name="goods"
                  placeholder="For example: apparel, accessories or homeware"
                  required
                  value={form.goods}
                  onChange={(event) => update('goods', event.target.value)}
                />
              </label>

              <label className="field-label">Destination
                <input
                  className="form-control"
                  name="destination"
                  autoComplete="country-name"
                  placeholder="Country or city"
                  required
                  value={form.destination}
                  onChange={(event) => update('destination', event.target.value)}
                />
              </label>
            </div>

            <fieldset
              ref={serviceGroupRef}
              className="contact-service-fieldset"
              tabIndex={-1}
              aria-invalid={serviceError}
              aria-describedby={serviceError ? 'service-error' : 'service-help'}
            >
              <legend>Services needed</legend>
              <p id="service-help">Choose all that apply.</p>
              <div className="contact-service-options">
                {SERVICE_OPTIONS.map((service) => (
                  <label key={service} className="contact-service-option">
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      checked={form.services.includes(service)}
                      onChange={() => toggleService(service)}
                    />
                    <span aria-hidden="true"><Check size={13} strokeWidth={2.4} /></span>
                    {service}
                  </label>
                ))}
              </div>
              {serviceError && <p id="service-error" className="contact-field-error" role="alert">Choose at least one service.</p>}
            </fieldset>

            <label className="field-label">Message / shipment details
              <textarea
                className="form-control"
                name="details"
                rows={4}
                placeholder="Supplier list, parcel count, quantity, timing, handling instructions, preferred route, or anything else we should know"
                value={form.details}
                onChange={(event) => update('details', event.target.value)}
              />
            </label>

            <button type="submit" className="primary-action"><MessageCircle size={18} aria-hidden="true" />Continue to WhatsApp <ArrowRight size={17} aria-hidden="true" /></button>
            <p className="contact-form-note">You’ll review the message before sending it on WhatsApp. We respond to quote requests within 1 business day.</p>
          </form>
        </div>
      </section>
    </>
  )
}
