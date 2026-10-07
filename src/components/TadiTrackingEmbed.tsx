import { useState } from 'react'
import type { TrackingEmbed } from '../config/trackingEmbeds'

type TadiTrackingEmbedProps = {
  embed: TrackingEmbed
}

export function TadiTrackingEmbed({ embed }: TadiTrackingEmbedProps) {
  const [loadedUrl, setLoadedUrl] = useState('')
  const isLoaded = loadedUrl === embed.url

  return (
    <section className="tadi-tracking-view" aria-labelledby="tracking-view-title">
      <h1 id="tracking-view-title" className="tracking-view-title">Shipment tracking</h1>
      <div
        className="tadi-tracking-frame-shell"
        aria-label="Shipment tracking details"
        aria-busy={!isLoaded}
      >
        {!isLoaded && <p className="tadi-tracking-loading" role="status">Loading tracking details…</p>}
        <iframe
          className="tadi-tracking-frame"
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
