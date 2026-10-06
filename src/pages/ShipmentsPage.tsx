import { ArrowRight, Filter, PackagePlus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { ShipmentStatusBadge } from '../components/ShipmentStatusBadge'
import { useAuth } from '../context/AuthContext'
import { STATUS_LABELS, visibleShipmentsFor } from '../lib/shipments'
import type { ShipmentStatus } from '../types/portal'

const formatDate = (value: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

export function ShipmentsPage() {
  const { session } = useAuth()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ShipmentStatus | 'all'>('all')
  if (!session) return null

  const shipments = visibleShipmentsFor(session)
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi')
    return shipments.filter((item) => {
      const matchesStatus = status === 'all' || item.status === status
      const matchesQuery = !normalized || [item.reference, item.recipientName, item.destinationName, item.partnerName].some((value) => value.toLocaleLowerCase('vi').includes(normalized))
      return matchesStatus && matchesQuery
    })
  }, [query, shipments, status])

  return (
    <>
      <PageMeta title="Danh sách vận đơn | VI LOGIX" description="Quản lý vận đơn VI LOGIX." noIndex />
      <header className="portal-page-header compact">
        <div><p className="eyebrow">Quản lý vận đơn</p><h1>Vận đơn</h1><p>{session.role === 'employee' ? 'Tìm, kiểm tra và cập nhật hành trình của tất cả đối tác.' : 'Tạo và theo dõi các vận đơn thuộc tài khoản của doanh nghiệp.'}</p></div>
        <Link to="/app/shipments/new" className="primary-pill"><PackagePlus aria-hidden="true" /> Tạo vận đơn</Link>
      </header>

      <section className="shipment-toolbar" aria-label="Tìm và lọc vận đơn">
        <label><span className="sr-only">Tìm vận đơn</span><Search aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mã vận đơn, người nhận, điểm đến..." /></label>
        <label><Filter aria-hidden="true" /><span className="sr-only">Lọc theo trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value as ShipmentStatus | 'all')}><option value="all">Tất cả trạng thái</option>{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <span className="result-count">{filtered.length} kết quả</span>
      </section>

      <section className="shipment-table-wrap">
        <table className="shipment-table"><thead><tr><th>Vận đơn</th><th>Người nhận</th><th>Điểm đến</th>{session.role === 'employee' && <th>Đối tác</th>}<th>Cập nhật</th><th>Trạng thái</th><th><span className="sr-only">Mở</span></th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.id}><td data-label="Vận đơn"><strong>{item.reference}</strong><small>{item.cargoType === 'goods' ? 'Hàng hóa' : 'Tài liệu'} · {item.actualWeight} kg</small></td><td data-label="Người nhận"><strong>{item.recipientName}</strong><small>{item.recipientPhone}</small></td><td data-label="Điểm đến">{item.destinationName}</td>{session.role === 'employee' && <td data-label="Đối tác">{item.partnerName}</td>}<td data-label="Cập nhật">{formatDate(item.updatedAt)}</td><td data-label="Trạng thái"><ShipmentStatusBadge status={item.status} /></td><td className="shipment-open-cell"><Link to={`/app/shipments/${item.id}`} aria-label={`Mở ${item.reference}`}>Mở <ArrowRight aria-hidden="true" /></Link></td></tr>)}</tbody>
        </table>
        {filtered.length === 0 && <div className="portal-empty"><Search aria-hidden="true" /><h3>Không tìm thấy vận đơn</h3><p>Thử đổi từ khóa hoặc chọn trạng thái khác.</p></div>}
      </section>
    </>
  )
}
