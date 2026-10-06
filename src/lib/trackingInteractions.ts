import type { TrackingActionResult, TrackingInteractionService, TrackingLocale } from '../types/tracking'

const demoInteractionsEnabled = import.meta.env.DEV || import.meta.env.MODE === 'test'
const wait = async () => {
  if (import.meta.env.MODE !== 'test') await new Promise((resolve) => window.setTimeout(resolve, 450))
}

const unavailable = <T>(locale: TrackingLocale = 'en'): TrackingActionResult<T> => ({
  kind: 'unavailable',
  message: locale === 'vi' ? 'Tính năng này chưa được kết nối trên môi trường hiện tại.' : 'This feature is not connected in the current environment.',
})

export const demoTrackingInteractionService: TrackingInteractionService = {
  async subscribe(input) {
    await wait()
    if (!demoInteractionsEnabled) return unavailable(input.locale)
    if (!input.consent) {
      return { kind: 'validation_error', message: input.locale === 'vi' ? 'Bạn cần đồng ý trước khi nhận thông báo.' : 'Consent is required before notifications can be enabled.' }
    }
    const isValid = input.channel === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.destination)
      : /^\+?[0-9\s()-]{8,20}$/.test(input.destination)
    if (!isValid) {
      return { kind: 'validation_error', message: input.locale === 'vi' ? 'Kiểm tra lại thông tin nhận thông báo.' : 'Check the notification destination and try again.' }
    }
    return { kind: 'success', data: { channel: input.channel } }
  },

  async requestDocumentOtp(_trackingNumber, locale) {
    await wait()
    if (!demoInteractionsEnabled) return unavailable(locale)
    return {
      kind: 'success',
      data: {
        challengeId: `demo-challenge-${Date.now()}`,
        maskedEmail: 'a***@example.test',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    }
  },

  async verifyDocumentOtp(challengeId, code) {
    await wait()
    if (!demoInteractionsEnabled) return unavailable()
    if (!challengeId.startsWith('demo-challenge-')) return { kind: 'expired', message: 'The verification request has expired. Request a new code.' }
    if (!/^\d{6}$/.test(code)) return { kind: 'validation_error', message: 'Enter a 6-digit verification code.' }
    return {
      kind: 'success',
      data: {
        accessToken: `demo-access-${Date.now()}`,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    }
  },

  async getDocumentDownloadUrl(trackingNumber, documentId, accessToken) {
    await wait()
    if (!demoInteractionsEnabled) return unavailable()
    if (!accessToken.startsWith('demo-access-')) return { kind: 'expired', message: 'Document access has expired. Verify again.' }
    const content = `VI LOGIX demo document\nShipment: ${trackingNumber}\nDocument: ${documentId}\n\nThis file contains demo data only.`
    return { kind: 'success', data: { url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}` } }
  },
}

export const trackingInteractionService: TrackingInteractionService = demoTrackingInteractionService
