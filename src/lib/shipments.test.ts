import { beforeEach, describe, expect, it } from 'vitest'
import type { AuthSession, ShipmentDraftInput } from '../types/portal'
import { changeShipmentStatus, createShipment, listShipments, nextShipmentStatus, updateDraftShipment, visibleShipmentsFor } from './shipments'

const employee: AuthSession = { userId: 'employee', name: 'Nhân viên', email: 'staff@example.test', role: 'employee', organization: 'VI LOGIX' }
const partner: AuthSession = { userId: 'partner', name: 'Đối tác', email: 'partner@example.test', role: 'partner', partnerId: 'partner-lotus', organization: 'Lotus Commerce' }

const draftInput: ShipmentDraftInput = {
  partnerId: 'partner-orbit', partnerName: 'Orbit Sourcing', senderName: 'Người gửi', senderPhone: '0900000000',
  recipientName: 'Người nhận', recipientPhone: '+6500000000', recipientAddress: 'Singapore', destinationId: 'singapore',
  destinationName: 'Singapore', cargoType: 'goods', actualWeight: '1', length: '', width: '', height: '', description: 'Mẫu hàng', estimate: null,
}

describe('shipment repository', () => {
  beforeEach(() => window.localStorage.clear())

  it('seeds once and limits partner visibility', () => {
    expect(listShipments()).toHaveLength(4)
    expect(listShipments()).toHaveLength(4)
    expect(visibleShipmentsFor(partner).every((item) => item.partnerId === partner.partnerId)).toBe(true)
    expect(visibleShipmentsFor(employee)).toHaveLength(4)
  })

  it('forces partner ownership when creating a shipment', () => {
    const created = createShipment(draftInput, partner, false)
    expect(created.partnerId).toBe('partner-lotus')
    expect(created.partnerName).toBe('Lotus Commerce')
    expect(created.status).toBe('draft')
  })

  it('allows a partner to submit only their own draft', () => {
    const ownDraft = createShipment(draftInput, partner, false)
    expect(updateDraftShipment(ownDraft.id, { ...draftInput, partnerId: 'partner-lotus' }, partner, true)?.status).toBe('pending')
    const otherDraft = listShipments().find((item) => item.partnerId === 'partner-orbit')!
    expect(updateDraftShipment(otherDraft.id, draftInput, partner, true)).toBeNull()
  })

  it('allows a partner to cancel only their own draft', () => {
    const ownDraft = createShipment(draftInput, partner, false)
    expect(changeShipmentStatus(ownDraft.id, 'cancelled', partner)?.status).toBe('cancelled')
    const submitted = createShipment(draftInput, partner, true)
    expect(changeShipmentStatus(submitted.id, 'cancelled', partner)).toBeNull()
  })

  it('enforces sequential staff status transitions and terminal states', () => {
    const created = createShipment(draftInput, employee, true)
    expect(nextShipmentStatus(created.status)).toBe('received')
    expect(changeShipmentStatus(created.id, 'in_transit', employee)).toBeNull()
    expect(changeShipmentStatus(created.id, 'received', partner)).toBeNull()
    const received = changeShipmentStatus(created.id, 'received', employee)
    expect(received?.status).toBe('received')
    const cancelled = changeShipmentStatus(created.id, 'cancelled', employee)
    expect(cancelled?.status).toBe('cancelled')
    expect(changeShipmentStatus(created.id, 'in_transit', employee)).toBeNull()
  })

  it('recovers from malformed storage with safe seed data', () => {
    window.localStorage.setItem('vi-express.portal.shipments.v1', 'not-json')
    expect(listShipments()).toHaveLength(4)
  })
})
