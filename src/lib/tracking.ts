import { DEMO_TRACKING_RECORDS, EMBEDDED_TRACKING_RECORDS } from '../data/trackingDemo'
import type { EmbeddedTrackingRecord, PublicTrackingStatus, TrackingDataSource, TrackingLocale, TrackingLookupResult, TrackingRecord } from '../types/tracking'

export const TRACKING_NUMBER_PATTERN = /^[A-Z0-9-]{6,40}$/

export const PUBLIC_STATUS_LABELS: Record<PublicTrackingStatus, string> = {
  information_received: 'Information received',
  received: 'Goods received',
  prepared: 'Prepared for dispatch',
  in_transit: 'In transit',
  customs_clearance: 'Customs clearance',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const TRACKING_PROGRESS_STEPS: readonly PublicTrackingStatus[] = [
  'information_received',
  'received',
  'prepared',
  'in_transit',
  'customs_clearance',
  'out_for_delivery',
  'delivered',
]

export const normalizeTrackingNumber = (value: string) => value.trim().toUpperCase()

export const isEmbeddedTrackingRecord = (record: TrackingRecord): record is EmbeddedTrackingRecord =>
  'kind' in record && record.kind === 'embedded'

export const buildTrackingShareUrl = (trackingNumber: string, origin: string, locale?: TrackingLocale) => {
  const url = new URL('/', origin)
  url.searchParams.set('tracking', normalizeTrackingNumber(trackingNumber))
  if (locale) url.searchParams.set('lang', locale)
  return url.toString()
}

export const validateTrackingNumber = (value: string) => {
  const normalized = normalizeTrackingNumber(value)
  if (!normalized) return 'Enter a tracking number.'
  if (!TRACKING_NUMBER_PATTERN.test(normalized)) {
    return 'Use 6–40 letters, numbers, or hyphens only.'
  }
  return ''
}

const demoRecords = new Map([...DEMO_TRACKING_RECORDS, ...EMBEDDED_TRACKING_RECORDS].map((record) => [record.trackingNumber, record]))

export const demoTrackingDataSource: TrackingDataSource = {
  async lookup(trackingNumber): Promise<TrackingLookupResult> {
    const delay = import.meta.env.MODE === 'test' ? 0 : 420
    if (delay) await new Promise((resolve) => window.setTimeout(resolve, delay))
    const record = demoRecords.get(normalizeTrackingNumber(trackingNumber))
    if (!record) return { kind: 'not_found' }
    const publicRecord = structuredClone(record)
    if (isEmbeddedTrackingRecord(publicRecord)) return { kind: 'found', record: publicRecord }
    const demoInteractionsEnabled = import.meta.env.DEV || import.meta.env.MODE === 'test'
    if (!demoInteractionsEnabled) {
      publicRecord.capabilities = {
        notificationChannels: [],
        documentAccess: 'none',
        demoInteractions: false,
      }
    }
    return { kind: 'found', record: publicRecord }
  },
}

export const lookupTrackingNumber = (
  trackingNumber: string,
  source: TrackingDataSource = demoTrackingDataSource,
) => source.lookup(normalizeTrackingNumber(trackingNumber))
