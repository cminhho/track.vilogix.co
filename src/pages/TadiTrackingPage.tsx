import { useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { TadiTrackingEmbed } from '../components/TadiTrackingEmbed'
import { TrackingUnavailable } from '../components/TrackingUnavailable'
import { getTadiTrackingEmbed } from '../config/trackingEmbeds'

export function TadiTrackingPage() {
  const params = useParams<{ trackingNumber: string }>()
  const embed = getTadiTrackingEmbed(params.trackingNumber ?? '')

  return (
    <>
      <PageMeta
        title="Shipment Tracking | VI LOGIX"
        description="View the latest tracking updates for your shipment."
        noIndex
        path={embed ? `/TDE/${embed.trackingNumber}` : '/'}
        lang="en"
      />
      {embed ? <TadiTrackingEmbed embed={embed} /> : <TrackingUnavailable />}
    </>
  )
}
