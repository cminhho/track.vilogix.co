import { useEffect, useState, type CSSProperties } from 'react'
import type { TrackingEmbed } from '../config/trackingEmbeds'
import { estimateVietAnHeight, fetchVietAnCounts, type VietAnCounts } from '../lib/embedHeight'
import { EmbedFallback, useEmbedLoad, useEmbedLoadingLabel } from './useEmbedLoad'

type VietAnTrackingEmbedProps = {
  embed: TrackingEmbed
}

const PHONE_QUERY = '(max-width: 480px)'

export function VietAnTrackingEmbed({ embed }: VietAnTrackingEmbedProps) {
  const { isLoaded, timedOut, key, onLoad, retry } = useEmbedLoad(embed.url)
  const loadingLabel = useEmbedLoadingLabel()
  const [counts, setCounts] = useState<VietAnCounts | null>(null)
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(PHONE_QUERY).matches)

  // Server-side row count lets the crop end right under the last event, so the vendor footer never shows.
  useEffect(() => {
    const controller = new AbortController()
    setCounts(null)
    fetchVietAnCounts(embed.trackingNumber, controller.signal).then((result) => { if (!controller.signal.aborted) setCounts(result) })
    return () => controller.abort()
  }, [embed.trackingNumber])

  useEffect(() => {
    const query = window.matchMedia?.(PHONE_QUERY)
    if (!query) return
    const onChange = () => setPhone(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const fitHeight = counts ? estimateVietAnHeight(counts, phone) : null
  const style = fitHeight ? ({ '--vietan-fit-height': `${fitHeight}px` } as CSSProperties) : undefined

  return (
    <section
      className={`vietan-tracking-view${fitHeight ? ' is-fit' : ''}`}
      style={style}
      aria-labelledby="tracking-view-title"
    >
      <h1 id="tracking-view-title" className="tracking-view-title">Shipment tracking</h1>
      <div
        className="vietan-tracking-frame-shell"
        aria-label="Shipment tracking details"
        aria-busy={!isLoaded}
      >
        {isLoaded && (
          <div className="vietan-tracking-brand-mask" aria-hidden="true">
            VI LOGIX AWB: <strong>{embed.trackingNumber}</strong>
          </div>
        )}
        {!isLoaded && !timedOut && <p className="vietan-tracking-loading" role="status">{loadingLabel}</p>}
        {timedOut && <EmbedFallback onRetry={retry} />}
        <div className="vietan-tracking-frame-clip">
          <iframe
            key={key}
            className="vietan-tracking-frame"
            src={embed.url}
            title={`Tracking details — ${embed.trackingNumber}`}
            loading="eager"
            referrerPolicy="no-referrer"
            onLoad={onLoad}
          />
        </div>
      </div>
    </section>
  )
}
