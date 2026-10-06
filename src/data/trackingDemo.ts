import type { EmbeddedTrackingRecord, PublicTrackingRecord } from '../types/tracking'

export const DEMO_TRACKING_NUMBER = 'VIE-260927-001'

export const DEMO_TRACKING_RECORDS: readonly PublicTrackingRecord[] = [
  {
    trackingNumber: DEMO_TRACKING_NUMBER,
    status: 'in_transit',
    origin: 'Ho Chi Minh City, Vietnam',
    originVi: 'TP. Hồ Chí Minh, Việt Nam',
    destination: 'Singapore',
    destinationVi: 'Singapore',
    lastUpdatedAt: '2026-09-30T02:15:00.000Z',
    estimatedDelivery: {
      from: '2026-10-02',
      to: '2026-10-03',
      timeZone: 'Asia/Singapore',
      source: 'vilogix_route_estimate',
      updatedAt: '2026-09-30T02:15:00.000Z',
    },
    clearance: {
      state: 'pending',
      updatedAt: '2026-09-30T02:15:00.000Z',
      message: 'Customs clearance is expected after arrival at the destination gateway.',
    },
    documents: [
      { id: 'document-commercial-invoice', type: 'commercial_invoice', label: 'Commercial Invoice', labelVi: 'Hóa đơn thương mại', state: 'available' },
      { id: 'document-packing-list', type: 'packing_list', label: 'Packing List', labelVi: 'Phiếu đóng gói', state: 'available' },
      { id: 'document-awb', type: 'awb_bl', label: 'AWB / BL', labelVi: 'AWB / BL', state: 'available', reference: 'DEMO-AWB-260927' },
      { id: 'document-pod', type: 'proof_of_delivery', label: 'Proof of Delivery', labelVi: 'Bằng chứng giao hàng', state: 'pending' },
    ],
    capabilities: {
      notificationChannels: ['email', 'whatsapp'],
      documentAccess: 'email_otp',
      demoInteractions: true,
    },
    carrier: {
      name: 'Demo shipping partner',
      nameVi: 'Đối tác vận chuyển demo',
      reference: 'SG-DEMO-260927',
      trackingUrl: 'https://example.com/',
    },
    events: [
      {
        id: 'public-event-001',
        status: 'information_received',
        title: 'Shipment information received',
        titleVi: 'Đã nhận thông tin vận đơn',
        description: 'VI LOGIX received the shipment details and handling instructions.',
        descriptionVi: 'VI LOGIX đã nhận thông tin vận đơn và hướng dẫn xử lý.',
        occurredAt: '2026-09-27T03:10:00.000Z',
        location: 'Ho Chi Minh City, Vietnam',
        locationVi: 'TP. Hồ Chí Minh, Việt Nam',
      },
      {
        id: 'public-event-002',
        status: 'received',
        title: 'Goods received',
        titleVi: 'Đã nhận hàng',
        description: 'The goods were received and matched to the shipment record.',
        descriptionVi: 'Hàng đã được tiếp nhận và đối chiếu với thông tin vận đơn.',
        occurredAt: '2026-09-28T04:30:00.000Z',
        location: 'Ho Chi Minh City, Vietnam',
        locationVi: 'TP. Hồ Chí Minh, Việt Nam',
      },
      {
        id: 'public-event-003',
        status: 'prepared',
        title: 'Prepared for dispatch',
        titleVi: 'Đã chuẩn bị gửi',
        description: 'The agreed handling was completed and the shipment was prepared for handover.',
        descriptionVi: 'Các bước xử lý đã thống nhất được hoàn tất và hàng đã sẵn sàng bàn giao.',
        occurredAt: '2026-09-29T07:45:00.000Z',
        location: 'Ho Chi Minh City, Vietnam',
        locationVi: 'TP. Hồ Chí Minh, Việt Nam',
      },
      {
        id: 'public-event-004',
        status: 'in_transit',
        title: 'In international transit',
        titleVi: 'Đang vận chuyển quốc tế',
        description: 'The shipment has left the Vietnam-side handling process and is moving toward its destination.',
        descriptionVi: 'Vận đơn đã rời khâu xử lý tại Việt Nam và đang di chuyển đến điểm nhận.',
        occurredAt: '2026-09-30T02:15:00.000Z',
      },
    ],
  },
]

export const EMBEDDED_TRACKING_RECORDS: readonly EmbeddedTrackingRecord[] = [
  {
    kind: 'embedded',
    trackingNumber: 'IDB20264384',
    createdOn: '2026-08-21',
    company: 'Tadi Express',
    destinationCountry: 'United Kingdom',
    destinationCountryVi: 'Vương quốc Anh',
    shippingRoute: 'Air',
    shippingRouteVi: 'Đường hàng không',
    packages: 1,
    status: 'in_transit',
    embedUrl: 'https://track.tadiexpress.com/?b=IDB20264384',
    embedState: 'unavailable',
  },
]
