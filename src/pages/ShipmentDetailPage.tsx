import { ArrowLeft, ArrowRight, Ban, CalendarDays, MapPin, Package, Pencil, Phone, Scale, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { ShipmentStatusBadge } from '../components/ShipmentStatusBadge'
import { useAuth } from '../context/AuthContext'
import { changeShipmentStatus, findShipment, nextShipmentStatus, STATUS_LABELS } from '../lib/shipments'
import { formatVnd } from '../lib/rates'
import type { ShipmentRecord } from '../types/portal'

const formatDateTime = (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function ShipmentDetailPage() {
  const { id = '' } = useParams()
  const { session } = useAuth()
  const [shipment, setShipment] = useState<ShipmentRecord | null>(() => findShipment(id))
  if (!session) return null
  if (!shipment || (session.role === 'partner' && shipment.partnerId !== session.partnerId)) return <Navigate to="/app/forbidden" replace />

  const nextStatus = nextShipmentStatus(shipment.status)
  const updateStatus = (status: Parameters<typeof changeShipmentStatus>[1]) => {
    const next = changeShipmentStatus(shipment.id, status, session)
    if (next) setShipment(next)
  }

  return (
    <>
      <PageMeta title={`${shipment.reference} | VI LOGIX`} description="Chi tiết vận đơn VI LOGIX." noIndex />
      <Link to="/app/shipments" className="portal-back"><ArrowLeft aria-hidden="true" /> Tất cả vận đơn</Link>
      <header className="shipment-detail-header">
        <div><p className="eyebrow">Chi tiết vận đơn</p><h1>{shipment.reference}</h1><p>Tạo ngày {formatDateTime(shipment.createdAt)} · {shipment.partnerName}</p></div>
        <div className="shipment-detail-actions"><ShipmentStatusBadge status={shipment.status} />{shipment.status === 'draft' && <Link to={`/app/shipments/${shipment.id}/edit`} className="ghost-pill"><Pencil aria-hidden="true" /> Sửa bản nháp</Link>}</div>
      </header>

      <div className="shipment-detail-grid">
        <div className="shipment-detail-main">
          <section className="detail-route">
            <div><span className="route-node route-node-origin" /><small>Điểm gửi</small><strong>TP. Hồ Chí Minh</strong><p>{shipment.senderName} · {shipment.senderPhone}</p></div>
            <span className="route-line"><ArrowRight aria-hidden="true" /></span>
            <div><span className="route-node route-node-destination" /><small>Điểm nhận</small><strong>{shipment.destinationName}</strong><p>{shipment.recipientName} · {shipment.recipientPhone}</p></div>
          </section>

          <section className="portal-section detail-section"><div className="portal-section-head"><div><p className="eyebrow">Thông tin giao nhận</p><h2>Người nhận và kiện hàng</h2></div></div>
            <dl className="detail-data-grid">
              <div><dt><UserRound aria-hidden="true" />Người nhận</dt><dd>{shipment.recipientName}</dd></div>
              <div><dt><Phone aria-hidden="true" />Điện thoại</dt><dd>{shipment.recipientPhone}</dd></div>
              <div className="field-span-2"><dt><MapPin aria-hidden="true" />Địa chỉ</dt><dd>{shipment.recipientAddress}</dd></div>
              <div><dt><Package aria-hidden="true" />Loại kiện</dt><dd>{shipment.cargoType === 'goods' ? 'Hàng hóa' : 'Tài liệu'}</dd></div>
              <div><dt><Scale aria-hidden="true" />Trọng lượng</dt><dd>{shipment.actualWeight} kg</dd></div>
              <div className="field-span-2"><dt>Nội dung</dt><dd>{shipment.description}</dd></div>
            </dl>
          </section>

          <section className="portal-section detail-section"><div className="portal-section-head"><div><p className="eyebrow">Lịch sử hành trình</p><h2>Cập nhật trạng thái</h2></div></div>
            <ol className="shipment-timeline">{[...shipment.events].reverse().map((event, index) => <li key={event.id} className={index === 0 ? 'current' : ''}><span /><div><ShipmentStatusBadge status={event.status} /><p>{event.note}</p><small><CalendarDays aria-hidden="true" />{formatDateTime(event.createdAt)} · {event.createdBy}</small></div></li>)}</ol>
          </section>
        </div>

        <aside className="shipment-side-stack">
          <section className="portal-section shipment-summary"><p className="eyebrow">Tóm tắt cước</p>{shipment.estimate ? <dl><div><dt>Cân tính cước</dt><dd>{shipment.estimate.billedWeightKg} kg</dd></div><div><dt>Thời gian dự kiến</dt><dd>{shipment.estimate.transitTime}</dd></div><div className="estimate-total"><dt>Cước tham khảo</dt><dd>{formatVnd(shipment.estimate.basePriceVnd)}</dd></div></dl> : <div className="summary-empty">Vận đơn chưa có snapshot cước tham khảo.</div>}<small>Mức cuối cùng cần xác nhận theo điều kiện thực tế.</small></section>

          {session.role === 'employee' && shipment.status !== 'completed' && shipment.status !== 'cancelled' && <section className="portal-section status-actions"><p className="eyebrow">Thao tác vận hành</p><h2>Cập nhật hành trình</h2><p>Chỉ chuyển theo bước kế tiếp để giữ lịch sử nhất quán.</p>{nextStatus && <button type="button" className="primary-pill" onClick={() => updateStatus(nextStatus)}>Chuyển sang {STATUS_LABELS[nextStatus]} <ArrowRight aria-hidden="true" /></button>}<button type="button" className="danger-action" onClick={() => updateStatus('cancelled')}><Ban aria-hidden="true" /> Hủy vận đơn</button></section>}

          {session.role === 'partner' && shipment.status === 'draft' && <section className="portal-section status-actions"><p className="eyebrow">Bản nháp</p><h2>Chưa gửi tiếp nhận</h2><p>Bổ sung đủ dữ liệu trước khi chuyển yêu cầu cho VI LOGIX.</p><Link to={`/app/shipments/${shipment.id}/edit`} className="primary-pill">Tiếp tục hoàn thiện <ArrowRight aria-hidden="true" /></Link><button type="button" className="danger-action" onClick={() => updateStatus('cancelled')}><Ban aria-hidden="true" /> Hủy bản nháp</button></section>}
        </aside>
      </div>
    </>
  )
}
