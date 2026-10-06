import { describe, expect, it } from 'vitest'
import { DEMO_TRACKING_NUMBER } from '../data/trackingDemo'
import type { TrackingDataSource } from '../types/tracking'
import { buildTrackingShareUrl, lookupTrackingNumber, normalizeTrackingNumber, TRACKING_PROGRESS_STEPS, validateTrackingNumber } from './tracking'

describe('public tracking', () => {
  it('normalizes user input', () => {
    expect(normalizeTrackingNumber('  vie-260927-001  ')).toBe(DEMO_TRACKING_NUMBER)
  })

  it('builds a shareable tracking link without changing the canonical path', () => {
    expect(buildTrackingShareUrl(' vie-260927-001 ', 'https://track.vilogx.co')).toBe(
      `https://track.vilogx.co/?tracking=${DEMO_TRACKING_NUMBER}`,
    )
    expect(buildTrackingShareUrl(DEMO_TRACKING_NUMBER, 'https://track.vilogx.co', 'vi')).toBe(
      `https://track.vilogx.co/?tracking=${DEMO_TRACKING_NUMBER}&lang=vi`,
    )
  })

  it('places customs clearance between international transit and last-mile delivery', () => {
    expect(TRACKING_PROGRESS_STEPS).toEqual([
      'information_received', 'received', 'prepared', 'in_transit', 'customs_clearance', 'out_for_delivery', 'delivered',
    ])
  })

  it('validates empty, malformed, and supported tracking numbers', () => {
    expect(validateTrackingNumber('')).toBe('Enter a tracking number.')
    expect(validateTrackingNumber('VIE 001')).toBe('Use 6–40 letters, numbers, or hyphens only.')
    expect(validateTrackingNumber(DEMO_TRACKING_NUMBER)).toBe('')
  })

  it('returns only the privacy-safe public shipment view', async () => {
    const result = await lookupTrackingNumber(DEMO_TRACKING_NUMBER)
    expect(result.kind).toBe('found')
    if (result.kind !== 'found') return
    expect(result.record).not.toHaveProperty('recipientName')
    expect(result.record).not.toHaveProperty('recipientPhone')
    expect(result.record).not.toHaveProperty('recipientAddress')
    if (!('kind' in result.record)) expect(result.record.events.every((event) => !('createdBy' in event))).toBe(true)
  })

  it('returns the embedded partner record without recipient identity', async () => {
    const result = await lookupTrackingNumber('idb20264384')
    expect(result.kind).toBe('found')
    if (result.kind !== 'found') return
    expect(result.record).toMatchObject({
      kind: 'embedded',
      trackingNumber: 'IDB20264384',
      destinationCountry: 'United Kingdom',
      shippingRoute: 'Air',
      packages: 1,
      embedUrl: 'https://track.tadiexpress.com/?b=IDB20264384',
      embedState: 'unavailable',
    })
    expect(result.record).not.toHaveProperty('recipientName')
  })

  it('normalizes the number before calling a replaceable data source', async () => {
    let received = ''
    const source: TrackingDataSource = {
      lookup: async (trackingNumber) => {
        received = trackingNumber
        return { kind: 'not_found' }
      },
    }
    expect(await lookupTrackingNumber('  custom-123  ', source)).toEqual({ kind: 'not_found' })
    expect(received).toBe('CUSTOM-123')
  })
})
