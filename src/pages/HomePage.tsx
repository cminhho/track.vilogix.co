import { ArrowRight, PackageSearch } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { parseTrackingInput } from '../config/trackingEmbeds'
import { LEAN_TRACKING_COPY } from '../config/trackingCopy'
import { getTrackingLocale, withTrackingLang } from '../lib/trackingLocale'

export function HomePage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const locale = getTrackingLocale(search)
  const copy = LEAN_TRACKING_COPY[locale].home
  const inputRef = useRef<HTMLInputElement>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = trackingNumber.trim().toUpperCase()

    if (!normalized) {
      setError(copy.errorEmpty)
      inputRef.current?.focus()
      return
    }

    const parsed = parseTrackingInput(normalized)
    if (!parsed) {
      setError(copy.errorInvalid)
      inputRef.current?.focus()
      return
    }

    navigate(withTrackingLang(`/${parsed.vendor}/${encodeURIComponent(parsed.trackingNumber)}`, locale))
  }

  return (
    <>
      <PageMeta
        title={copy.pageTitle}
        description={copy.pageDescription}
        noIndex
        path="/"
        lang={locale}
      />

      <section className="tracking-page" aria-labelledby="tracking-page-title">
        <div className="contact-shell tracking-shell">
          <div className="contact-intro">
            <PackageSearch size={30} strokeWidth={1.7} aria-hidden="true" />
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 id="tracking-page-title">{copy.title}</h1>
            <p>{copy.intro}</p>
          </div>

          <form className="contact-form" role="search" aria-labelledby="tracking-form-title" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-heading">
              <p className="eyebrow">{copy.formEyebrow}</p>
              <h2 id="tracking-form-title">{copy.formTitle}</h2>
            </div>
            <label className="field-label" htmlFor="tracking-number">
              {copy.label}
              <input
                ref={inputRef}
                id="tracking-number"
                name="tracking-number"
                className="form-control"
                value={trackingNumber}
                onChange={(event) => {
                  setTrackingNumber(event.target.value.toUpperCase())
                  setError('')
                }}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'tracking-number-error' : undefined}
              />
            </label>
            {error && <p id="tracking-number-error" className="tracking-field-error" role="alert">{error}</p>}
            <button className="primary-action" type="submit">
              {copy.submit} <ArrowRight aria-hidden="true" />
            </button>
            <p className="contact-form-note">{copy.note}</p>
          </form>
        </div>
      </section>
    </>
  )
}
