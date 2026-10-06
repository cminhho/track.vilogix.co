import { ArrowRight, ClipboardList, PackageCheck, PackagePlus, Plane } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { ShipmentStatusBadge } from '../components/ShipmentStatusBadge'
import { useAuth } from '../context/AuthContext'
import { visibleShipmentsFor } from '../lib/shipments'

const formatDate = (value: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))

export function DashboardPage() {
  const { session } = useAuth()
  if (!session) return null
  const shipments = visibleShipmentsFor(session)
  const counts = {
    active: shipments.filter((item) => ['pending', 'received', 'in_transit', 'out_for_delivery'].includes(item.status)).length,
    transit: shipments.filter((item) => item.status === 'in_transit').length,
    completed: shipments.filter((item) => item.status === 'completed').length,
  }

  return (
    <>
      <PageMeta title="Tổng quan vận hành | VI LOGIX" description="Tổng quan vận đơn VI LOGIX." noIndex />
      <header className="portal-page-header">
        <div><p className="eyebrow">Tổng quan vận hành</p><h1>Xin chào, {session.name.split(' ').at(-1)}.</h1><p>{session.role === 'employee' ? 'Theo dõi toàn bộ vận đơn và các yêu cầu đang chờ xử lý.' : 'Theo dõi vận đơn của doanh nghiệp và chuẩn bị yêu cầu gửi mới.'}</p></div>
        <Link to="/app/shipments/new" className="primary-pill"><PackagePlus aria-hidden="true" /> Tạo vận đơn</Link>
      </header>

      <section className="ops-snapshot" aria-label="Tóm tắt vận đơn">
        <div><span><ClipboardList aria-hidden="true" />Tổng vận đơn</span><strong>{shipments.length}</strong><small>Trong dữ liệu hiện tại</small></div>
        <div><span><PackageCheck aria-hidden="true" />Đang xử lý</span><strong>{counts.active}</strong><small>Từ tiếp nhận đến đang giao</small></div>
        <div><span><Plane aria-hidden="true" />Đang vận chuyển</span><strong>{counts.transit}</strong><small>Trên hành trình quốc tế</small></div>
        <div><span>Hoàn tất</span><strong>{counts.completed}</strong><small>Đã giao thành công</small></div>
      </section>

      <section className="portal-section">
        <div className="portal-section-head"><div><p className="eyebrow">Cập nhật gần đây</p><h2>Vận đơn mới nhất</h2></div><Link to="/app/shipments">Xem tất cả <ArrowRight aria-hidden="true" /></Link></div>
        <div className="shipment-table-wrap">
          <table className="shipment-table"><thead><tr><th>Mã vận đơn</th><th>Người nhận</th><th>Điểm đến</th><th>Cập nhật</th><th>Trạng thái</th><th><span className="sr-only">Mở</span></th></tr></thead>
            <tbody>{shipments.slice(0, 5).map((item) => <tr key={item.id}><td data-label="Vận đơn"><strong>{item.reference}</strong><small>{item.partnerName}</small></td><td data-label="Người nhận">{item.recipientName}</td><td data-label="Điểm đến">{item.destinationName}</td><td data-label="Cập nhật">{formatDate(item.updatedAt)}</td><td data-label="Trạng thái"><ShipmentStatusBadge status={item.status} /></td><td className="shipment-open-cell"><Link to={`/app/shipments/${item.id}`} aria-label={`Mở ${item.reference}`}>Mở <ArrowRight aria-hidden="true" /></Link></td></tr>)}</tbody>
          </table>
          {shipments.length === 0 && <div className="portal-empty"><PackagePlus aria-hidden="true" /><h3>Chưa có vận đơn</h3><p>Tạo vận đơn đầu tiên để bắt đầu theo dõi hành trình.</p></div>}
        </div>
      </section>
    </>
  )
}
