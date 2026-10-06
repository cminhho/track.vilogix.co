import type { AuthSession, ShipmentDraftInput, ShipmentRecord, ShipmentStatus } from '../types/portal'

const STORAGE_KEY = 'vi-express.portal.shipments.v1'

export const STATUS_ORDER: ShipmentStatus[] = [
  'draft',
  'pending',
  'received',
  'in_transit',
  'out_for_delivery',
  'completed',
]

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  draft: 'Nháp',
  pending: 'Chờ tiếp nhận',
  received: 'Đã nhận hàng',
  in_transit: 'Đang vận chuyển',
  out_for_delivery: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
}

const seedShipments: ShipmentRecord[] = [
  {
    id: 'shipment-001', reference: 'VIE-260927-001', partnerId: 'partner-lotus', partnerName: 'Lotus Commerce',
    senderName: 'Trần Quốc Bảo', senderPhone: '0900 000 101', recipientName: 'Avery Morgan', recipientPhone: '+65 8000 0101',
    recipientAddress: '12 Orchard Road, Singapore', destinationId: 'singapore', destinationName: 'Singapore', cargoType: 'goods',
    actualWeight: '3.2', length: '32', width: '24', height: '18', description: 'Mẫu hàng may mặc', status: 'in_transit',
    estimate: null,
    createdAt: '2026-09-24T02:15:00.000Z', updatedAt: '2026-09-27T03:10:00.000Z',
    events: [
      { id: 'ev-001-a', status: 'draft', note: 'Vận đơn được tạo.', createdAt: '2026-09-24T02:15:00.000Z', createdBy: 'Trần Quốc Bảo' },
      { id: 'ev-001-b', status: 'pending', note: 'Đối tác gửi yêu cầu tiếp nhận.', createdAt: '2026-09-24T02:22:00.000Z', createdBy: 'Trần Quốc Bảo' },
      { id: 'ev-001-c', status: 'received', note: 'Kiện hàng đã được tiếp nhận tại điểm gửi.', createdAt: '2026-09-25T04:00:00.000Z', createdBy: 'Nguyễn Minh Anh' },
      { id: 'ev-001-d', status: 'in_transit', note: 'Kiện hàng đang trên hành trình quốc tế.', createdAt: '2026-09-27T03:10:00.000Z', createdBy: 'Nguyễn Minh Anh' },
    ],
  },
  {
    id: 'shipment-002', reference: 'VIE-260926-002', partnerId: 'partner-lotus', partnerName: 'Lotus Commerce',
    senderName: 'Trần Quốc Bảo', senderPhone: '0900 000 101', recipientName: 'Jordan Lee', recipientPhone: '+82 10 0000 0102',
    recipientAddress: 'Mapo-gu, Seoul, South Korea', destinationId: 'korea-rep-of-south', destinationName: 'Korea, Rep. of (South)', cargoType: 'document',
    actualWeight: '0.7', length: '', width: '', height: '', description: 'Tài liệu thương mại', status: 'pending',
    estimate: null, createdAt: '2026-09-26T08:40:00.000Z', updatedAt: '2026-09-26T09:05:00.000Z',
    events: [
      { id: 'ev-002-a', status: 'draft', note: 'Vận đơn được tạo.', createdAt: '2026-09-26T08:40:00.000Z', createdBy: 'Trần Quốc Bảo' },
      { id: 'ev-002-b', status: 'pending', note: 'Đối tác gửi yêu cầu tiếp nhận.', createdAt: '2026-09-26T09:05:00.000Z', createdBy: 'Trần Quốc Bảo' },
    ],
  },
  {
    id: 'shipment-003', reference: 'VIE-260927-003', partnerId: 'partner-lotus', partnerName: 'Lotus Commerce',
    senderName: 'Trần Quốc Bảo', senderPhone: '0900 000 101', recipientName: 'Taylor Smith', recipientPhone: '+61 400 000 103',
    recipientAddress: 'George Street, Sydney, Australia', destinationId: 'australia', destinationName: 'Australia', cargoType: 'goods',
    actualWeight: '1.5', length: '24', width: '18', height: '12', description: 'Phụ kiện thời trang', status: 'draft',
    estimate: null, createdAt: '2026-09-27T06:20:00.000Z', updatedAt: '2026-09-27T06:20:00.000Z',
    events: [{ id: 'ev-003-a', status: 'draft', note: 'Vận đơn được tạo.', createdAt: '2026-09-27T06:20:00.000Z', createdBy: 'Trần Quốc Bảo' }],
  },
  {
    id: 'shipment-004', reference: 'VIE-260922-004', partnerId: 'partner-orbit', partnerName: 'Orbit Sourcing',
    senderName: 'Lê Thanh Hà', senderPhone: '0900 000 202', recipientName: 'Morgan Reed', recipientPhone: '+44 7000 000104',
    recipientAddress: 'King Street, London, United Kingdom', destinationId: 'united-kingdom', destinationName: 'United Kingdom', cargoType: 'goods',
    actualWeight: '5', length: '40', width: '30', height: '24', description: 'Mẫu sản phẩm trưng bày', status: 'out_for_delivery',
    estimate: null, createdAt: '2026-09-22T01:30:00.000Z', updatedAt: '2026-09-27T01:15:00.000Z',
    events: [
      { id: 'ev-004-a', status: 'draft', note: 'Vận đơn được tạo.', createdAt: '2026-09-22T01:30:00.000Z', createdBy: 'Lê Thanh Hà' },
      { id: 'ev-004-b', status: 'pending', note: 'Yêu cầu tiếp nhận đã gửi.', createdAt: '2026-09-22T02:00:00.000Z', createdBy: 'Lê Thanh Hà' },
      { id: 'ev-004-c', status: 'received', note: 'VI LOGIX đã nhận kiện.', createdAt: '2026-09-23T03:10:00.000Z', createdBy: 'Nguyễn Minh Anh' },
      { id: 'ev-004-d', status: 'in_transit', note: 'Kiện hàng đang trên hành trình quốc tế.', createdAt: '2026-09-24T04:45:00.000Z', createdBy: 'Nguyễn Minh Anh' },
      { id: 'ev-004-e', status: 'out_for_delivery', note: 'Kiện hàng đang được giao tại điểm đến.', createdAt: '2026-09-27T01:15:00.000Z', createdBy: 'Nguyễn Minh Anh' },
    ],
  },
]

const write = (shipments: ShipmentRecord[]) => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments))

export const listShipments = (): ShipmentRecord[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      write(seedShipments)
      return structuredClone(seedShipments)
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) throw new Error('Invalid shipment store')
    return parsed as ShipmentRecord[]
  } catch {
    write(seedShipments)
    return structuredClone(seedShipments)
  }
}

export const visibleShipmentsFor = (session: AuthSession) => {
  const shipments = listShipments()
  return session.role === 'employee' ? shipments : shipments.filter((item) => item.partnerId === session.partnerId)
}

export const findShipment = (id: string) => listShipments().find((item) => item.id === id) ?? null

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const createShipment = (input: ShipmentDraftInput, actor: AuthSession, submit: boolean) => {
  const shipments = listShipments()
  const now = new Date().toISOString()
  const sequence = String(shipments.length + 1).padStart(3, '0')
  const date = now.slice(2, 10).replaceAll('-', '')
  const status: ShipmentStatus = submit ? 'pending' : 'draft'
  const securedInput = actor.role === 'partner' && actor.partnerId
    ? { ...input, partnerId: actor.partnerId, partnerName: actor.organization }
    : input
  const record: ShipmentRecord = {
    ...securedInput,
    id: makeId(),
    reference: `VIE-${date}-${sequence}`,
    status,
    createdAt: now,
    updatedAt: now,
    events: [{ id: makeId(), status, note: submit ? 'Vận đơn được tạo và gửi tiếp nhận.' : 'Vận đơn nháp được tạo.', createdAt: now, createdBy: actor.name }],
  }
  write([record, ...shipments])
  return record
}

export const updateDraftShipment = (id: string, input: ShipmentDraftInput, actor: AuthSession, submit: boolean) => {
  const shipments = listShipments()
  const current = shipments.find((item) => item.id === id)
  if (!current || current.status !== 'draft' || (actor.role === 'partner' && current.partnerId !== actor.partnerId)) return null
  const now = new Date().toISOString()
  const status: ShipmentStatus = submit ? 'pending' : 'draft'
  const next: ShipmentRecord = {
    ...current,
    ...input,
    status,
    updatedAt: now,
    events: submit
      ? [...current.events, { id: makeId(), status, note: 'Đối tác gửi yêu cầu tiếp nhận.', createdAt: now, createdBy: actor.name }]
      : current.events,
  }
  write(shipments.map((item) => item.id === id ? next : item))
  return next
}

export const nextShipmentStatus = (status: ShipmentStatus): ShipmentStatus | null => {
  const index = STATUS_ORDER.indexOf(status)
  return index >= 0 && index < STATUS_ORDER.length - 1 ? STATUS_ORDER[index + 1] : null
}

export const changeShipmentStatus = (id: string, status: ShipmentStatus, actor: AuthSession) => {
  const shipments = listShipments()
  const current = shipments.find((item) => item.id === id)
  if (!current || current.status === 'completed' || current.status === 'cancelled') return null
  const partnerCanCancelOwnDraft = actor.role === 'partner'
    && actor.partnerId === current.partnerId
    && current.status === 'draft'
    && status === 'cancelled'
  if (actor.role !== 'employee' && !partnerCanCancelOwnDraft) return null
  const allowed = status === 'cancelled' || nextShipmentStatus(current.status) === status
  if (!allowed) return null
  const now = new Date().toISOString()
  const next: ShipmentRecord = {
    ...current,
    status,
    updatedAt: now,
    events: [...current.events, { id: makeId(), status, note: status === 'cancelled' ? 'Vận đơn đã được hủy.' : `Cập nhật trạng thái: ${STATUS_LABELS[status]}.`, createdAt: now, createdBy: actor.name }],
  }
  write(shipments.map((item) => item.id === id ? next : item))
  return next
}
