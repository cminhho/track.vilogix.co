const TRACKING_NUMBER_PATTERN = /^IDB2026\d{4}$/
const TRACKING_EMBED_BASE_URL = 'https://track.tadiexpress.com/'

export const normalizeTrackingNumber = (value: string) => value.trim().toUpperCase()

export const hasValidTrackingNumberFormat = (value: string) =>
  TRACKING_NUMBER_PATTERN.test(normalizeTrackingNumber(value))

export const getTrackingEmbedUrl = (value: string) => {
  const trackingNumber = normalizeTrackingNumber(value)
  if (!TRACKING_NUMBER_PATTERN.test(trackingNumber)) return null
  const url = new URL(TRACKING_EMBED_BASE_URL)
  url.searchParams.set('b', trackingNumber)
  return url.toString()
}
