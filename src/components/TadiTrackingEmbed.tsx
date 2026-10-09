import type { TrackingEmbed } from '../config/trackingEmbeds'
import { EmbedFallback, useEmbedLoad, useEmbedLoadingLabel } from './useEmbedLoad'

type TadiTrackingEmbedProps = {
  embed: TrackingEmbed
}

export function TadiTrackingEmbed({ embed }: TadiTrackingEmbedProps) {
  const { isLoaded, timedOut, key, onLoad, retry } = useEmbedLoad(embed.url)
  const loadingLabel = useEmbedLoadingLabel()

  return (
    <section className="tadi-tracking-view" aria-labelledby="tracking-view-title">
      <h1 id="tracking-view-title" className="tracking-view-title">Shipment tracking</h1>
      <div
        className="tadi-tracking-frame-shell"
        aria-label="Shipment tracking details"
        aria-busy={!isLoaded}
      >
        {!isLoaded && !timedOut && <p className="tadi-tracking-loading" role="status">{loadingLabel}</p>}
        {timedOut && <EmbedFallback onRetry={retry} />}
        <div className="tadi-tracking-frame-clip">
          <iframe
            key={key}
            className="tadi-tracking-frame"
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
