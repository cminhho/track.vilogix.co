import { type FormEvent, useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, Calculator, Save } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { ShipmentFields } from '../components/ShipmentFields'
import { useAuth } from '../context/AuthContext'
import { DESTINATIONS } from '../config'
import { estimateShipmentForm, initialShipmentForm, validateShipmentForm, type ShipmentFieldErrors, type ShipmentFormState } from '../lib/estimateForm'
import { createShipment, findShipment, updateDraftShipment } from '../lib/shipments'
import { formatVnd, formatWeight, type EstimateResult } from '../lib/rates'
import type { ShipmentDraftInput } from '../types/portal'

const partners = [
  { id: 'partner-lotus', name: 'Lotus Commerce' },
  { id: 'partner-orbit', name: 'Orbit Sourcing' },
]

export function ShipmentFormPage() {
  const { session } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? findShipment(id) : null
  const initialShipment = useMemo<ShipmentFormState>(() => existing ? {
    destinationId: existing.destinationId, cargoType: existing.cargoType, actualWeight: existing.actualWeight,
    length: existing.length, width: existing.width, height: existing.height,
  } : initialShipmentForm, [existing])
  const [shipment, setShipment] = useState(initialShipment)
  const [details, setDetails] = useState({
    partnerId: existing?.partnerId ?? session?.partnerId ?? 'partner-lotus',
    senderName: existing?.senderName ?? session?.name ?? '', senderPhone: existing?.senderPhone ?? '',
    recipientName: existing?.recipientName ?? '', recipientPhone: existing?.recipientPhone ?? '',
    recipientAddress: existing?.recipientAddress ?? '', description: existing?.description ?? '',
  })
  const [errors, setErrors] = useState<ShipmentFieldErrors>({})
  const [detailError, setDetailError] = useState('')
  const [estimate, setEstimate] = useState<EstimateResult | null>(null)

  if (!session) return null
  if (id && (!existing || existing.status !== 'draft' || (session.role === 'partner' && existing.partnerId !== session.partnerId))) return <Navigate to="/app/forbidden" replace />

  const updateShipment = <K extends keyof ShipmentFormState>(key: K, value: ShipmentFormState[K]) => {
    setShipment((current) => ({ ...current, [key]: value }))
    setErrors({})
    setEstimate(null)
  }

  const calculate = () => {
    const nextErrors = validateShipmentForm(shipment)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return null
    try {
      const result = estimateShipmentForm(shipment)
      setEstimate(result)
      return result
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Chưa thể tính cước cho thông tin này.')
      return null
    }
  }

  const save = (event: FormEvent, submit: boolean) => {
    event.preventDefault()
    const nextErrors = validateShipmentForm(shipment)
    setErrors(nextErrors)
    if (!details.senderName.trim() || !details.senderPhone.trim() || !details.recipientName.trim() || !details.recipientPhone.trim() || !details.recipientAddress.trim() || !details.description.trim()) {
      setDetailError('Vui lòng nhập đủ thông tin người gửi, người nhận, địa chỉ và mô tả kiện hàng.')
      return
    }
    if (Object.keys(nextErrors).length) {
      setDetailError('Kiểm tra lại trọng lượng và kích thước kiện hàng.')
      return
    }
    let rate = estimate
    if (!rate) {
      try { rate = estimateShipmentForm(shipment) } catch { rate = null }
    }
    const partner = partners.find((item) => item.id === details.partnerId) ?? partners[0]
    const destination = DESTINATIONS.find((item) => item.id === shipment.destinationId)
    const input: ShipmentDraftInput = {
      partnerId: partner.id, partnerName: partner.name,
      senderName: details.senderName.trim(), senderPhone: details.senderPhone.trim(), recipientName: details.recipientName.trim(), recipientPhone: details.recipientPhone.trim(),
      recipientAddress: details.recipientAddress.trim(), description: details.description.trim(), ...shipment,
      destinationName: destination?.name ?? shipment.destinationId,
      estimate: rate ? { basePriceVnd: rate.rate.basePriceVnd, billedWeightKg: rate.billedWeightKg, transitTime: rate.rate.transitTime, destinationName: rate.destination.name, source: rate.rate.source } : null,
    }
    const record = existing ? updateDraftShipment(existing.id, input, session, submit) : createShipment(input, session, submit)
    if (record) navigate(`/app/shipments/${record.id}`)
  }

  return (
    <>
      <PageMeta title={`${existing ? 'Sửa' : 'Tạo'} vận đơn | VI LOGIX`} description="Chuẩn bị thông tin vận đơn VI LOGIX." noIndex />
      <Link to={existing ? `/app/shipments/${existing.id}` : '/app/shipments'} className="portal-back"><ArrowLeft aria-hidden="true" /> Quay lại vận đơn</Link>
      <header className="portal-page-header compact"><div><p className="eyebrow">{existing ? existing.reference : 'Vận đơn mới'}</p><h1>{existing ? 'Sửa vận đơn nháp' : 'Tạo vận đơn'}</h1><p>Chuẩn bị thông tin giao nhận và kiểm tra mức cước đang có trước khi gửi tiếp nhận.</p></div></header>

      {detailError && <div className="portal-alert" role="alert"><AlertCircle aria-hidden="true" />{detailError}</div>}
      <form className="shipment-create-grid" onSubmit={(event) => save(event, false)} noValidate>
        <div className="portal-form-stack">
          {session.role === 'employee' && <section className="portal-form-section"><div className="portal-form-heading"><span>01</span><div><h2>Đối tác</h2><p>Đơn vị sở hữu vận đơn.</p></div></div><label>Đối tác<select value={details.partnerId} onChange={(event) => setDetails((current) => ({ ...current, partnerId: event.target.value }))}>{partners.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></section>}
          <section className="portal-form-section"><div className="portal-form-heading"><span>{session.role === 'employee' ? '02' : '01'}</span><div><h2>Liên hệ giao nhận</h2><p>Thông tin dùng để phối hợp nhận và giao kiện.</p></div></div>
            <div className="portal-field-grid"><label>Người gửi<input value={details.senderName} onChange={(event) => setDetails((current) => ({ ...current, senderName: event.target.value }))} autoComplete="name" /></label><label>Điện thoại người gửi<input value={details.senderPhone} onChange={(event) => setDetails((current) => ({ ...current, senderPhone: event.target.value }))} inputMode="tel" autoComplete="tel" /></label><label>Người nhận<input value={details.recipientName} onChange={(event) => setDetails((current) => ({ ...current, recipientName: event.target.value }))} /></label><label>Điện thoại người nhận<input value={details.recipientPhone} onChange={(event) => setDetails((current) => ({ ...current, recipientPhone: event.target.value }))} inputMode="tel" /></label><label className="field-span-2">Địa chỉ nhận<textarea value={details.recipientAddress} onChange={(event) => setDetails((current) => ({ ...current, recipientAddress: event.target.value }))} rows={3} /></label></div>
          </section>
          <section className="portal-form-section"><div className="portal-form-heading"><span>{session.role === 'employee' ? '03' : '02'}</span><div><h2>Thông tin kiện hàng</h2><p>Dữ liệu dùng để xác định cân tính cước.</p></div></div><ShipmentFields form={shipment} errors={errors} onChange={updateShipment} /><label className="portal-description">Mô tả nội dung kiện<textarea value={details.description} onChange={(event) => setDetails((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Ví dụ: mẫu hàng may mặc, không chứa pin hoặc chất lỏng" /></label></section>
        </div>

        <aside className="shipment-estimate-panel">
          <div><p className="eyebrow">Kiểm tra cước</p><h2>Mức tham khảo</h2><p>Kết quả dùng dữ liệu cước express hiện có.</p></div>
          {estimate ? <dl><div><dt>Tuyến</dt><dd>TP. Hồ Chí Minh → {estimate.destination.name}</dd></div><div><dt>Cân tính cước</dt><dd>{formatWeight(estimate.billedWeightKg)} kg</dd></div><div><dt>Thời gian</dt><dd>{estimate.rate.transitTime}</dd></div><div className="estimate-total"><dt>Cước tham khảo</dt><dd>{formatVnd(estimate.rate.basePriceVnd)}</dd></div></dl> : <div className="estimate-await"><Calculator aria-hidden="true" /><strong>Chưa có kết quả</strong><span>Kiểm tra thông tin kiện để xem cước.</span></div>}
          <button type="button" className="ghost-pill" onClick={calculate}><Calculator aria-hidden="true" /> Ước tính cước</button>
          <div className="shipment-form-actions"><button type="submit" className="ghost-pill"><Save aria-hidden="true" /> Lưu bản nháp</button><button type="button" className="primary-pill" onClick={(event) => save(event, true)}>Gửi tiếp nhận <ArrowRight aria-hidden="true" /></button></div>
          <small>Cước cuối cùng còn phụ thuộc địa chỉ giao, nội dung kiện và điều kiện thực tế.</small>
        </aside>
      </form>
    </>
  )
}
