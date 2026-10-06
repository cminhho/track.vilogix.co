export type PublicTrackingStatus =
  | 'information_received'
  | 'received'
  | 'prepared'
  | 'in_transit'
  | 'customs_clearance'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type TrackingLocale = 'en' | 'vi'

export type CustomsClearanceState = 'pending' | 'in_progress' | 'cleared' | 'action_required'

export type TrackingNotificationChannel = 'email' | 'whatsapp'

export type TrackingDocumentType = 'commercial_invoice' | 'packing_list' | 'awb_bl' | 'proof_of_delivery'

export type TrackingDocumentState = 'available' | 'pending' | 'not_applicable'

export interface PublicTrackingEvent {
  id: string
  status: PublicTrackingStatus
  title: string
  titleVi?: string
  description: string
  descriptionVi?: string
  occurredAt: string
  location?: string
  locationVi?: string
}

export interface EstimatedDeliveryWindow {
  from: string
  to: string
  timeZone: string
  source: 'carrier' | 'vilogix_route_estimate'
  updatedAt: string
}

export interface PublicCustomsClearance {
  state: CustomsClearanceState
  updatedAt: string
  message?: string
  actionLabel?: string
}

export interface PublicTrackingDocument {
  id: string
  type: TrackingDocumentType
  label: string
  labelVi?: string
  state: TrackingDocumentState
  reference?: string
}

export interface PublicTrackingCapabilities {
  notificationChannels: TrackingNotificationChannel[]
  documentAccess: 'email_otp' | 'none'
  demoInteractions: boolean
}

export interface PublicTrackingRecord {
  trackingNumber: string
  status: PublicTrackingStatus
  origin: string
  originVi?: string
  destination: string
  destinationVi?: string
  lastUpdatedAt: string
  estimatedDelivery?: EstimatedDeliveryWindow
  clearance?: PublicCustomsClearance
  documents?: PublicTrackingDocument[]
  capabilities: PublicTrackingCapabilities
  carrier?: {
    name: string
    nameVi?: string
    reference: string
    trackingUrl: string
  }
  events: PublicTrackingEvent[]
}

export type TrackingLookupResult =
  | { kind: 'found'; record: PublicTrackingRecord }
  | { kind: 'not_found' }

export interface TrackingDataSource {
  lookup: (trackingNumber: string) => Promise<TrackingLookupResult>
}

export type TrackingActionFailure = {
  kind: 'validation_error' | 'expired' | 'rate_limited' | 'unavailable'
  message: string
}

export type TrackingActionResult<T> = { kind: 'success'; data: T } | TrackingActionFailure

export interface TrackingSubscriptionInput {
  trackingNumber: string
  channel: TrackingNotificationChannel
  destination: string
  locale: TrackingLocale
  consent: boolean
}

export interface TrackingInteractionService {
  subscribe: (input: TrackingSubscriptionInput) => Promise<TrackingActionResult<{ channel: TrackingNotificationChannel }>>
  requestDocumentOtp: (trackingNumber: string, locale: TrackingLocale) => Promise<TrackingActionResult<{ challengeId: string; maskedEmail: string; expiresAt: string }>>
  verifyDocumentOtp: (challengeId: string, code: string) => Promise<TrackingActionResult<{ accessToken: string; expiresAt: string }>>
  getDocumentDownloadUrl: (trackingNumber: string, documentId: string, accessToken: string) => Promise<TrackingActionResult<{ url: string }>>
}
