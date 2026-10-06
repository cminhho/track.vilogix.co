import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clipboard,
  Clock3,
  FileCheck2,
  Globe2,
  Link2,
  PackageCheck,
  Plane,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Truck,
  XCircle,
} from 'lucide-react'
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import {
  buildTrackingShareUrl,
  lookupTrackingNumber,
  normalizeTrackingNumber,
  TRACKING_PROGRESS_STEPS,
  validateTrackingNumber,
} from '../lib/tracking'
import { copyText } from '../lib/clipboard'
import { getTrackingLocale, TRACKING_COPY, useTrackingLocale } from '../lib/trackingLocale'
import { buildWhatsAppUrl } from '../site'
import type { PublicTrackingRecord, TrackingLocale } from '../types/tracking'

type ViewState = 'idle' | 'loading' | 'found' | 'not_found' | 'error'

const statusIcons = {
  information_received: Clipboard,
  received: PackageCheck,
  prepared: ShieldCheck,
  in_transit: Plane,
  customs_clearance: FileCheck2,
  out_for_delivery: Truck,
  delivered: Check,
  cancelled: XCircle,
}

const formatDateTime = (value: string, locale: TrackingLocale) => new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Ho_Chi_Minh',
}).format(new Date(value))

const formatEstimatedDelivery = (from: string, to: string, timeZone: string, locale: TrackingLocale) => {
  const formatter = new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', { dateStyle: 'medium', timeZone })
  const fromDate = new Date(`${from}T12:00:00.000Z`)
  const toDate = new Date(`${to}T12:00:00.000Z`)
  return from === to ? formatter.format(fromDate) : formatter.formatRange(fromDate, toDate)
}

const validateTrackingNumberForLocale = (value: string, locale: TrackingLocale) => {
  const error = validateTrackingNumber(value)
  if (!error || locale === 'en') return error
  return error === 'Enter a tracking number.' ? 'Nhập mã vận đơn.' : 'Chỉ dùng 6–40 chữ cái, số hoặc dấu gạch nối.'
}

function TrackingResult({ record, locale }: { record: PublicTrackingRecord; locale: TrackingLocale }) {
  const copy = TRACKING_COPY[locale]
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const reachedStatuses = new Set(record.events.map((event) => event.status))
  const reversedEvents = [...record.events].reverse()
  const [latestEvent, ...earlierEvents] = reversedEvents
  const CurrentStatusIcon = statusIcons[record.status]
  const shareUrl = buildTrackingShareUrl(record.trackingNumber, window.location.origin, locale)
  const clearanceMessage = record.clearance ? {
    pending: copy.clearance.pendingMessage,
    in_progress: copy.clearance.inProgressMessage,
    cleared: copy.clearance.clearedMessage,
    action_required: copy.clearance.actionMessage,
  }[record.clearance.state] : ''

  const copyTrackingLink = async () => {
    try {
      await copyText(shareUrl)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <section className="tracking-result" aria-labelledby="tracking-result-title">
      <header className="tracking-result-header">
        <div className="tracking-current-status">
          <span className={`tracking-current-icon public-status-${record.status}`}><CurrentStatusIcon aria-hidden="true" /></span>
          <div>
            <p className="eyebrow">{copy.result.currentStatus}</p>
            <h2 id="tracking-result-title">{copy.status[record.status]}</h2>
            <p className="tracking-status-meta"><strong>{record.trackingNumber}</strong><span aria-hidden="true"> · </span>{copy.result.updated} {formatDateTime(record.lastUpdatedAt, locale)} ({copy.result.vietnamTime})</p>
            <div className="tracking-eta">
              <CalendarDays aria-hidden="true" />
              <div>
                <span>{copy.result.estimatedDelivery}</span>
                <strong>{record.estimatedDelivery ? formatEstimatedDelivery(record.estimatedDelivery.from, record.estimatedDelivery.to, record.estimatedDelivery.timeZone, locale) : copy.result.estimateUnavailable}</strong>
                {record.estimatedDelivery && <small>{copy.result.estimateCaveat}</small>}
              </div>
            </div>
          </div>
        </div>
        <div className="tracking-result-actions">
          <button type="button" className="secondary-action" onClick={() => void copyTrackingLink()}>
            {copyState === 'copied' ? <CheckCircle2 aria-hidden="true" /> : <Link2 aria-hidden="true" />}
            {copyState === 'copied' ? copy.result.linkCopied : copyState === 'error' ? copy.result.copyFailed : copy.result.copyLink}
          </button>
          <span className="sr-only" aria-live="polite">{copyState === 'error' ? 'The tracking link could not be copied.' : copyState === 'copied' ? 'Tracking link copied.' : ''}</span>
        </div>
      </header>

      <div className="tracking-route" aria-label={locale === 'vi' ? `Hành trình từ ${record.originVi ?? record.origin} đến ${record.destinationVi ?? record.destination}` : `Route from ${record.origin} to ${record.destination}`}>
        <div><span className="tracking-route-node" /><small>{copy.result.origin}</small><strong>{locale === 'vi' ? record.originVi ?? record.origin : record.origin}</strong></div>
        <span className="tracking-route-line"><ArrowRight size={18} aria-hidden="true" /></span>
        <div><span className="tracking-route-node tracking-route-node-destination" /><small>{copy.result.destination}</small><strong>{locale === 'vi' ? record.destinationVi ?? record.destination : record.destination}</strong></div>
      </div>

      {record.status === 'cancelled' ? (
        <div className="tracking-cancelled" role="status">
          <XCircle aria-hidden="true" />
          <div><strong>{copy.result.cancelledTitle}</strong><p>{copy.result.cancelledDescription}</p></div>
        </div>
      ) : (
        <ol className="tracking-progress" aria-label={copy.result.progress}>
          {TRACKING_PROGRESS_STEPS.map((status) => {
            const Icon = statusIcons[status]
            const reached = reachedStatuses.has(status)
            const current = record.status === status
            return (
              <li key={status} className={`${reached ? 'is-reached' : ''}${current ? ' is-current' : ''}`} aria-current={current ? 'step' : undefined}>
                <span className="tracking-progress-icon">{reached ? <Icon aria-hidden="true" /> : <Circle aria-hidden="true" />}</span>
                <span>{copy.status[status]}</span>
              </li>
            )
          })}
        </ol>
      )}

      {record.clearance && record.status !== 'cancelled' && (
        <section className={`tracking-clearance is-${record.clearance.state}`} aria-labelledby="tracking-clearance-title">
          {record.clearance.state === 'action_required' ? <ShieldAlert aria-hidden="true" /> : <FileCheck2 aria-hidden="true" />}
          <div><p className="eyebrow">{copy.clearance.eyebrow}</p><h3 id="tracking-clearance-title">{copy.clearance.title}</h3><strong>{copy.clearance[record.clearance.state]}</strong><p>{clearanceMessage}</p></div>
        </section>
      )}

      <div className="tracking-detail-grid">
        <section className="tracking-history" aria-labelledby="tracking-history-title">
          <div className="tracking-section-heading">
            <div><p className="eyebrow">{copy.activity.eyebrow}</p><h3 id="tracking-history-title">{copy.activity.latest}</h3></div>
            <Clock3 aria-hidden="true" />
          </div>
          {latestEvent && (
            <article className="tracking-latest-event">
              <span className="tracking-history-marker" />
              <div>
                <div className="tracking-event-heading"><strong>{locale === 'vi' ? latestEvent.titleVi ?? latestEvent.title : latestEvent.title}</strong><span>{copy.activity.latestBadge}</span></div>
                <p>{locale === 'vi' ? latestEvent.descriptionVi ?? latestEvent.description : latestEvent.description}</p>
                <small><CalendarDays aria-hidden="true" />{formatDateTime(latestEvent.occurredAt, locale)}{latestEvent.location ? ` · ${locale === 'vi' ? latestEvent.locationVi ?? latestEvent.location : latestEvent.location}` : ''}</small>
              </div>
            </article>
          )}
          {earlierEvents.length > 0 && (
            <details className="tracking-history-details">
              <summary><span>{copy.activity.earlier}</span><small>{earlierEvents.length} {earlierEvents.length === 1 ? copy.activity.update : copy.activity.updates}</small></summary>
              <ol>
                {earlierEvents.map((event) => (
                  <li key={event.id}>
                <span className="tracking-history-marker" />
                <div>
                  <div className="tracking-event-heading"><strong>{locale === 'vi' ? event.titleVi ?? event.title : event.title}</strong></div>
                  <p>{locale === 'vi' ? event.descriptionVi ?? event.description : event.description}</p>
                  <small><CalendarDays aria-hidden="true" />{formatDateTime(event.occurredAt, locale)}{event.location ? ` · ${locale === 'vi' ? event.locationVi ?? event.location : event.location}` : ''}</small>
                </div>
              </li>
                ))}
              </ol>
            </details>
          )}
        </section>

      </div>
    </section>
  )
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedLocale = getTrackingLocale(searchParams.toString())
  const locale = useTrackingLocale(searchParams.toString())
  const copy = TRACKING_COPY[locale]
  const sharedTrackingNumber = searchParams.get('tracking') ?? ''
  const [trackingNumber, setTrackingNumber] = useState('')
  const [submittedNumber, setSubmittedNumber] = useState('')
  const [validationError, setValidationError] = useState('')
  const [viewState, setViewState] = useState<ViewState>('idle')
  const [record, setRecord] = useState<PublicTrackingRecord | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const runLookup = useCallback(async (value: string) => {
    const normalized = normalizeTrackingNumber(value)
    setSubmittedNumber(normalized)
    setRecord(null)
    setViewState('loading')
    try {
      const result = await lookupTrackingNumber(normalized)
      if (result.kind === 'found') {
        setRecord(result.record)
        setViewState('found')
      } else {
        setViewState('not_found')
      }
    } catch {
      setViewState('error')
    }
  }, [])

  useEffect(() => {
    if (!sharedTrackingNumber) return
    const normalized = normalizeTrackingNumber(sharedTrackingNumber)
    const error = validateTrackingNumberForLocale(normalized, requestedLocale)
    setTrackingNumber(normalized)
    if (error) {
      setValidationError(error)
      setViewState('idle')
      return
    }
    setValidationError('')
    void runLookup(normalized)
  }, [runLookup, sharedTrackingNumber])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (viewState === 'loading') return
    const error = validateTrackingNumberForLocale(trackingNumber, locale)
    if (error) {
      setValidationError(error)
      setViewState('idle')
      inputRef.current?.focus()
      return
    }
    setValidationError('')
    const normalized = normalizeTrackingNumber(trackingNumber)
    if (sharedTrackingNumber === normalized) void runLookup(normalized)
    else setSearchParams({ tracking: normalized, lang: locale })
  }

  const supportNumber = submittedNumber || normalizeTrackingNumber(trackingNumber)
  const genericSupportUrl = buildWhatsAppUrl(locale === 'vi'
    ? `Xin chào VI LOGIX, tôi cần hỗ trợ theo dõi${supportNumber ? ` vận đơn ${supportNumber}` : ' một vận đơn'}.`
    : `Hello VI LOGIX, I need help tracking${supportNumber ? ` shipment ${supportNumber}` : ' a shipment'}.`)

  const setLocale = (nextLocale: TrackingLocale) => {
    const next = new URLSearchParams(searchParams)
    next.set('lang', nextLocale)
    setSearchParams(next, { replace: true })
  }

  return (
    <>
      <PageMeta
        title={copy.pageTitle}
        description={copy.pageDescription}
        path="/"
        lang={locale}
        webApplication={{ name: locale === 'vi' ? 'Theo dõi vận đơn VI LOGIX' : 'VI LOGIX Shipment Tracking', description: copy.webApplicationDescription }}
      />

      <section className="tracking-hero" aria-labelledby="tracking-page-title">
        <div className="tracking-hero-inner">
          <div className="tracking-hero-copy">
            <div className="tracking-hero-kicker"><p className="eyebrow">{copy.hero.eyebrow}</p><div className="tracking-language" role="group" aria-label={copy.languageLabel}><Globe2 aria-hidden="true" />{(['vi', 'en'] as const).map((item) => <button key={item} type="button" aria-pressed={locale === item} onClick={() => setLocale(item)}>{item.toUpperCase()}</button>)}</div></div>
            <h1 id="tracking-page-title">{copy.hero.title}</h1>
          </div>

          <div className="tracking-lookup-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="tracking-form-label"><label htmlFor="tracking-number">{copy.form.trackingNumber}</label></div>
              <div className={`tracking-input-row${validationError ? ' has-error' : ''}`}>
                <input
                  ref={inputRef}
                  id="tracking-number"
                  name="tracking-number"
                  value={trackingNumber}
                  onChange={(event) => { setTrackingNumber(event.target.value.toUpperCase()); setValidationError('') }}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  inputMode="text"
                  placeholder={copy.form.placeholder}
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? 'tracking-number-error' : undefined}
                />
                <button type="submit" className="primary-action" disabled={viewState === 'loading'} aria-busy={viewState === 'loading'}>
                  {viewState === 'loading' ? copy.form.checking : copy.form.track}
                  {viewState !== 'loading' && <ArrowRight aria-hidden="true" />}
                </button>
              </div>
              {validationError && <p id="tracking-number-error" className="tracking-field-error" role="alert">{validationError}</p>}
            </form>
          </div>
        </div>
      </section>

      <div className="tracking-feedback" role="status" aria-live="polite" aria-atomic="true">
        {viewState === 'loading' && <div className="tracking-loading"><span /><p>{copy.feedback.lookingFor} <strong>{submittedNumber}</strong>…</p></div>}
        {viewState === 'found' && record && <span className="sr-only">{copy.feedback.shipmentFound} {copy.status[record.status]}.</span>}
      </div>

      <div className="tracking-result-focus">
        {viewState === 'found' && record && <TrackingResult key={`${record.trackingNumber}-${locale}`} record={record} locale={locale} />}
        {viewState === 'not_found' && (
          <section className="tracking-state-card" role="status" aria-labelledby="tracking-not-found-title">
            <Search aria-hidden="true" /><p className="eyebrow">{copy.feedback.noShipment}</p>
            <h2 id="tracking-not-found-title">{copy.feedback.checkNumber}</h2>
            <p>{copy.feedback.notFoundPrefix} <strong>{submittedNumber}</strong>. {locale === 'vi' ? 'Hãy kiểm tra từng ký tự hoặc liên hệ VI LOGIX nếu vận đơn vừa được tạo.' : 'Confirm every letter and number, or contact VI LOGIX if the shipment was created recently.'}</p>
            <div><button type="button" className="secondary-action" onClick={() => inputRef.current?.focus()}>{copy.feedback.editNumber}</button><a href={genericSupportUrl} target="_blank" rel="noreferrer" className="text-action">{copy.feedback.contactSupport} <ArrowRight aria-hidden="true" /></a></div>
          </section>
        )}
        {viewState === 'error' && (
          <section className="tracking-state-card tracking-error-card" role="alert" aria-labelledby="tracking-error-title">
            <XCircle aria-hidden="true" /><p className="eyebrow">{copy.feedback.unavailable}</p>
            <h2 id="tracking-error-title">{copy.feedback.couldNotLoad}</h2>
            <p>{copy.feedback.retryDescription}</p>
            <div><button type="button" className="secondary-action" onClick={() => void runLookup(submittedNumber)}><RotateCcw aria-hidden="true" /> {copy.feedback.retry}</button><a href={genericSupportUrl} target="_blank" rel="noreferrer" className="text-action">{copy.feedback.contactSupport} <ArrowRight aria-hidden="true" /></a></div>
          </section>
        )}
      </div>

    </>
  )
}
