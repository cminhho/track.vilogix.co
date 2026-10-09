import { MessageCircle, RotateCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LEAN_TRACKING_COPY } from '../config/trackingCopy'
import { getTrackingLocale } from '../lib/trackingLocale'
import { buildWhatsAppUrl } from '../site'

const EMBED_TIMEOUT_MS = 10000

/** Tracks iframe load for a carrier embed and flags a timeout so the page never stays blank. */
export function useEmbedLoad(url: string) {
  const [loadedUrl, setLoadedUrl] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [timedOutKey, setTimedOutKey] = useState('')
  const key = `${url}#${attempt}`
  const isLoaded = loadedUrl === key
  const timedOut = !isLoaded && timedOutKey === key

  useEffect(() => {
    if (loadedUrl === key) return
    const timer = window.setTimeout(() => setTimedOutKey(key), EMBED_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [key, loadedUrl])

  return {
    isLoaded,
    timedOut,
    key,
    onLoad: () => setLoadedUrl(key),
    retry: () => setAttempt((value) => value + 1),
  }
}

export function EmbedFallback({ onRetry }: { onRetry: () => void }) {
  const locale = getTrackingLocale(useLocation().search)
  const { embed, supportMessage } = LEAN_TRACKING_COPY[locale]

  return (
    <div className="tracking-embed-fallback" role="alert">
      <h2>{embed.errorTitle}</h2>
      <p>{embed.errorBody}</p>
      <div className="tracking-invalid-actions">
        <button type="button" className="primary-action" onClick={onRetry}>
          {embed.retry} <RotateCw aria-hidden="true" />
        </button>
        <a className="text-action" href={buildWhatsAppUrl(supportMessage)} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" /> {embed.support}
        </a>
      </div>
    </div>
  )
}

export function useEmbedLoadingLabel() {
  return LEAN_TRACKING_COPY[getTrackingLocale(useLocation().search)].embed.loading
}
