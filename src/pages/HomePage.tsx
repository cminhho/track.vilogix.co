import { ArrowRight, PackageSearch } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { getApprovedTrackingEmbedUrl, hasValidTrackingNumberFormat, normalizeTrackingNumber } from '../config/trackingEmbeds'

export function HomePage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = normalizeTrackingNumber(trackingNumber)

    if (!normalized) {
      setError('Enter a tracking number.')
      inputRef.current?.focus()
      return
    }

    if (!hasValidTrackingNumberFormat(normalized)) {
      setError('Enter a valid tracking number.')
      inputRef.current?.focus()
      return
    }

    if (!getApprovedTrackingEmbedUrl(normalized)) {
      setError('Tracking number not found. Check the number and try again.')
      inputRef.current?.focus()
      return
    }

    navigate(`/track/${encodeURIComponent(normalized)}`)
  }

  return (
    <>
      <PageMeta
        title="Track Your Shipment | VI LOGIX"
        description="Enter your tracking number to view the latest shipment updates."
        path="/"
        lang="en"
        webApplication={{
          name: 'VI LOGIX Shipment Tracking',
          description: 'A focused shipment tracking lookup for VI LOGIX customers.',
        }}
      />

      <section className="lean-tracking-home" aria-labelledby="tracking-page-title">
        <div className="lean-tracking-panel">
          <div className="lean-tracking-icon" aria-hidden="true"><PackageSearch /></div>
          <p className="eyebrow">VI LOGIX · Shipment tracking</p>
          <h1 id="tracking-page-title">Track your shipment.</h1>
          <p className="lean-tracking-intro">Enter the tracking number from your shipment confirmation.</p>

          <form className="lean-tracking-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="tracking-number">Tracking number</label>
            <div className={`lean-tracking-input-row${error ? ' has-error' : ''}`}>
              <input
                ref={inputRef}
                id="tracking-number"
                name="tracking-number"
                value={trackingNumber}
                onChange={(event) => {
                  setTrackingNumber(event.target.value.toUpperCase())
                  setError('')
                }}
                placeholder="IDB20264384"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'tracking-number-error' : 'tracking-number-hint'}
              />
              <button className="primary-action" type="submit">
                Track shipment <ArrowRight aria-hidden="true" />
              </button>
            </div>
            {error
              ? <p id="tracking-number-error" className="tracking-field-error" role="alert">{error}</p>
              : <p id="tracking-number-hint" className="tracking-field-hint">Enter the complete number from your shipment confirmation.</p>}
          </form>
        </div>
      </section>
    </>
  )
}
