export type TrackingVendor = 'TDE' | 'VAE'

type TrackingProvider = {
  trackingNumberPattern: RegExp
  buildEmbedUrl: (trackingNumber: string) => string
}

export type ParsedTrackingInput = {
  vendor: TrackingVendor
  trackingNumber: string
}

export type TrackingEmbed = ParsedTrackingInput & {
  url: string
}

const TRACKING_PROVIDERS: Record<TrackingVendor, TrackingProvider> = {
  TDE: {
    trackingNumberPattern: /^IDB2026\d{4}$/,
    buildEmbedUrl: (trackingNumber) => {
      const url = new URL('https://track.tadiexpress.com/')
      url.searchParams.set('b', trackingNumber)
      return url.toString()
    },
  },
  VAE: {
    trackingNumberPattern: /^\d{7}$/,
    buildEmbedUrl: (trackingNumber) => {
      const url = new URL('https://vietanexpress.com.vn/TrackingResult.aspx')
      url.searchParams.set('id', trackingNumber)
      return url.toString()
    },
  },
}

const TRACKING_INPUT_PATTERNS: Array<{ vendor: TrackingVendor; pattern: RegExp }> = [
  { vendor: 'TDE', pattern: /^TDE(IDB2026\d{4})$/ },
  { vendor: 'VAE', pattern: /^VAE(\d{7})$/ },
]

export const normalizeTrackingNumber = (value: string) => value.trim().toUpperCase()

export const parseTrackingInput = (value: string): ParsedTrackingInput | null => {
  const normalized = normalizeTrackingNumber(value)

  for (const { vendor, pattern } of TRACKING_INPUT_PATTERNS) {
    const match = normalized.match(pattern)
    if (match) return { vendor, trackingNumber: match[1] }
  }

  return null
}

const getTrackingEmbed = (vendor: TrackingVendor, trackingNumberValue: string): TrackingEmbed | null => {
  const provider = TRACKING_PROVIDERS[vendor]
  const trackingNumber = normalizeTrackingNumber(trackingNumberValue)

  if (!provider || !provider.trackingNumberPattern.test(trackingNumber)) return null

  return {
    vendor,
    trackingNumber,
    url: provider.buildEmbedUrl(trackingNumber),
  }
}

export const getTadiTrackingEmbed = (trackingNumber: string) => getTrackingEmbed('TDE', trackingNumber)

export const getVietAnTrackingEmbed = (trackingNumber: string) => getTrackingEmbed('VAE', trackingNumber)
