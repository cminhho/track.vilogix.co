import { describe, expect, it } from 'vitest'
import { demoTrackingInteractionService } from './trackingInteractions'

describe('demo tracking interactions', () => {
  it('requires explicit consent and validates notification destinations', async () => {
    expect(await demoTrackingInteractionService.subscribe({ trackingNumber: 'VIE-260927-001', channel: 'email', destination: 'ops@example.test', locale: 'en', consent: false })).toMatchObject({ kind: 'validation_error' })
    expect(await demoTrackingInteractionService.subscribe({ trackingNumber: 'VIE-260927-001', channel: 'email', destination: 'not-an-email', locale: 'en', consent: true })).toMatchObject({ kind: 'validation_error' })
    expect(await demoTrackingInteractionService.subscribe({ trackingNumber: 'VIE-260927-001', channel: 'whatsapp', destination: '+84901234567', locale: 'vi', consent: true })).toEqual({ kind: 'success', data: { channel: 'whatsapp' } })
  })

  it('requires OTP verification before returning a demo document URL', async () => {
    const request = await demoTrackingInteractionService.requestDocumentOtp('VIE-260927-001', 'en')
    expect(request.kind).toBe('success')
    if (request.kind !== 'success') return
    expect(request.data.maskedEmail).not.toContain('recipient')
    expect(await demoTrackingInteractionService.verifyDocumentOtp(request.data.challengeId, '123')).toMatchObject({ kind: 'validation_error' })
    const verification = await demoTrackingInteractionService.verifyDocumentOtp(request.data.challengeId, '123456')
    expect(verification.kind).toBe('success')
    if (verification.kind !== 'success') return
    const download = await demoTrackingInteractionService.getDocumentDownloadUrl('VIE-260927-001', 'document-commercial-invoice', verification.data.accessToken)
    expect(download.kind).toBe('success')
    if (download.kind === 'success') expect(download.data.url.startsWith('data:text/plain')).toBe(true)
  })

  it('rejects expired or unknown OTP challenges and access tokens', async () => {
    expect(await demoTrackingInteractionService.verifyDocumentOtp('unknown', '123456')).toMatchObject({ kind: 'expired' })
    expect(await demoTrackingInteractionService.getDocumentDownloadUrl('VIE-260927-001', 'document-commercial-invoice', 'unknown')).toMatchObject({ kind: 'expired' })
  })
})
