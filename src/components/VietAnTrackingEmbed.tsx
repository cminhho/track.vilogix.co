import { useState } from 'react'
import type { TrackingEmbed } from '../config/trackingEmbeds'

type VietAnTrackingEmbedProps = {
  embed: TrackingEmbed
}

export function VietAnTrackingEmbed({ embed }: VietAnTrackingEmbedProps) {
  const [loadedUrl, setLoadedUrl] = useState('')
  const isLoaded = loadedUrl === embed.url

  return (
    <section className="vietan-tracking-view" aria-labelledby="tracking-view-title">
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
        {!isLoaded && <p className="vietan-tracking-loading" role="status">Loading tracking details…</p>}
        <iframe
          className="vietan-tracking-frame"
          src={embed.url}
          title={`Tracking details — ${embed.trackingNumber}`}
          loading="eager"
          referrerPolicy="no-referrer"
          onLoad={() => setLoadedUrl(embed.url)}
        />
      </div>
    </section>
  )
}
