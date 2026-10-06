const TRACKING_NUMBER_PATTERN = /^IDB\d{8}$/

const TRACKING_EMBED_URLS: Readonly<Record<string, string>> = {
  IDB20264384: 'https://track.tadiexpress.com/?b=IDB20264384',
}

export const normalizeTrackingNumber = (value: string) => value.trim().toUpperCase()

export const hasValidTrackingNumberFormat = (value: string) =>
  TRACKING_NUMBER_PATTERN.test(normalizeTrackingNumber(value))

export const getApprovedTrackingEmbedUrl = (value: string) =>
  TRACKING_EMBED_URLS[normalizeTrackingNumber(value)] ?? null
