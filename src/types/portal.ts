import type { CargoType } from '../lib/rates'

export type UserRole = 'employee' | 'partner'

export interface DemoUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  partnerId?: string
  organization: string
}

export interface AuthSession {
  userId: string
  name: string
  email: string
  role: UserRole
  partnerId?: string
  organization: string
}

export type ShipmentStatus =
  | 'draft'
  | 'pending'
  | 'received'
  | 'in_transit'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'

export interface ShipmentEvent {
  id: string
  status: ShipmentStatus
  note: string
  createdAt: string
  createdBy: string
}

export interface ShipmentEstimateSnapshot {
  basePriceVnd: number
  billedWeightKg: number
  transitTime: string
  destinationName: string
  source: 'destination_matrix' | 'zone_matrix'
}

export interface ShipmentRecord {
  id: string
  reference: string
  partnerId: string
  partnerName: string
  senderName: string
  senderPhone: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  destinationId: string
  destinationName: string
  cargoType: CargoType
  actualWeight: string
  length: string
  width: string
  height: string
  description: string
  status: ShipmentStatus
  estimate: ShipmentEstimateSnapshot | null
  createdAt: string
  updatedAt: string
  events: ShipmentEvent[]
}

export type ShipmentDraftInput = Omit<
  ShipmentRecord,
  'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt' | 'events'
>
