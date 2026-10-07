import { useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { TrackingUnavailable } from '../components/TrackingUnavailable'
import { VietAnTrackingEmbed } from '../components/VietAnTrackingEmbed'
import { getVietAnTrackingEmbed } from '../config/trackingEmbeds'

export function VietAnTrackingPage() {
  const params = useParams<{ trackingNumber: string }>()
  const embed = getVietAnTrackingEmbed(params.trackingNumber ?? '')

  return (
    <>
      <PageMeta
        title="Shipment Tracking | VI LOGIX"
        description="View the latest tracking updates for your shipment."
        noIndex
        path={embed ? `/VAE/${embed.trackingNumber}` : '/'}
        lang="en"
      />
      {embed ? <VietAnTrackingEmbed embed={embed} /> : <TrackingUnavailable />}
    </>
  )
}
