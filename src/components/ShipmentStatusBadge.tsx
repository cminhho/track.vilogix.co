import { CheckCircle2, CircleDashed, Clock3, PackageCheck, Plane, Truck, XCircle } from 'lucide-react'
import { STATUS_LABELS } from '../lib/shipments'
import type { ShipmentStatus } from '../types/portal'

const icons = {
  draft: CircleDashed,
  pending: Clock3,
  received: PackageCheck,
  in_transit: Plane,
  out_for_delivery: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
}

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
  const Icon = icons[status]
  return <span className={`shipment-status status-${status}`}><Icon aria-hidden="true" />{STATUS_LABELS[status]}</span>
}
