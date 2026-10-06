import { type FormEvent, useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  Clipboard,
  LockKeyhole,
  PlugZap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { PageMeta } from '../components/PageMeta'
import { ShipmentFields } from '../components/ShipmentFields'
import { copyText } from '../lib/clipboard'
import {
  estimateShipmentForm,
  initialShipmentForm,
  validateShipmentForm,
  type ShipmentFieldErrors,
  type ShipmentFormState,
} from '../lib/estimateForm'
import { buildCustomerQuote } from '../lib/quote'
import { formatVnd, formatWeight, type EstimateResult } from '../lib/rates'

type CopyState = 'idle' | 'success' | 'error'

const pendingCarriers = [
  { id: 'dhl', name: 'DHL Express', detail: 'Cần MyDHL account và API production' },
  { id: 'ups', name: 'UPS', detail: 'Cần UPS account và Rating API' },
] as const

export function InternalQuotePage({ standalone = true }: { standalone?: boolean }) {
  const [form, setForm] = useState<ShipmentFormState>(initialShipmentForm)
  const [fieldErrors, setFieldErrors] = useState<ShipmentFieldErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [result, setResult] = useState<EstimateResult | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [serviceFee, setServiceFee] = useState('')
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const copyTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)
  }, [])

  const update = <K extends keyof ShipmentFormState>(key: K, value: ShipmentFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors({})
    setGlobalError('')
    setResult(null)
    setSubmitted(false)
    setServiceFee('')
    setCopyState('idle')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validateShipmentForm(form)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setResult(null)
      setSubmitted(true)
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    try {
      setResult(estimateShipmentForm(form))
      setGlobalError('')
      setCopyState('idle')
      setSubmitted(true)
      requestAnimationFrame(() => resultRef.current?.focus())
    } catch (error) {
      setResult(null)
      setGlobalError(error instanceof Error ? error.message : 'Không thể tính cước. Vui lòng kiểm tra lại dữ liệu.')
      setSubmitted(true)
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
    }
  }

  const serviceFeeVnd = serviceFee === '' ? 0 : Number(serviceFee)
  const validServiceFee = Number.isFinite(serviceFeeVnd) && serviceFeeVnd >= 0
  const quotedPriceVnd = result && validServiceFee ? result.rate.basePriceVnd + serviceFeeVnd : null

  const handleCopy = async () => {
    if (!result || quotedPriceVnd === null) return
    const quote = buildCustomerQuote({
      originLabel: 'Ho Chi Minh City, Vietnam',
      cargoType: form.cargoType,
      result,
      quotedPriceVnd,
    })

    try {
      await copyText(quote)
      setCopyState('success')
    } catch {
      setCopyState('error')
    }

    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)
    copyTimerRef.current = window.setTimeout(() => setCopyState('idle'), 2500)
  }

  return (
    <div className={`internal-shell${standalone ? '' : ' internal-shell-embedded'}`}>
      <PageMeta title="Bàn báo giá | VI LOGIX" description="Công cụ báo giá nội bộ VI LOGIX." noIndex />
      {standalone && <a href="#internal-main" className="skip-link">Bỏ qua điều hướng</a>}

      {standalone && <header className="internal-header">
        <div className="internal-header-inner">
          <div className="internal-brand-group">
            <BrandMark to={null} />
            <span aria-hidden="true" />
            <div><strong>Vận hành</strong><small>Bàn báo giá</small></div>
          </div>
          <Link to="/estimate" className="internal-return-link">
            <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
            <span className="internal-return-label-full">Công cụ công khai</span>
            <span className="internal-return-label-short">Công khai</span>
          </Link>
        </div>
      </header>}

      <main id="internal-main" className="internal-main">
        <section className="internal-intro" aria-labelledby="internal-title">
          <div>
            <p className="eyebrow"><LockKeyhole size={14} aria-hidden="true" /> Không gian vận hành</p>
            <h1 id="internal-title">Chuẩn bị báo giá sẵn sàng gửi khách.</h1>
            <p>Kiểm tra cước nền, chọn nguồn giá và thêm phí dịch vụ trước khi gửi báo giá cho khách.</p>
          </div>
          <dl className="internal-status-strip" aria-label="Trạng thái hệ thống báo giá">
            <div><dt>Nguồn giá</dt><dd><span className="status-dot status-dot-ready" />Bảng giá nội bộ</dd></div>
            <div><dt>Kết nối hãng</dt><dd><span className="status-dot" />0 / 2 hoạt động</dd></div>
            <div><dt>Thuế & nhập khẩu</dt><dd><span className="status-dot status-dot-ready" />Đã gồm</dd></div>
          </dl>
        </section>

        <div className="internal-quote-grid">
          <form onSubmit={handleSubmit} noValidate className="internal-panel internal-form-panel">
            <div className="internal-panel-heading">
              <div>
                <p className="eyebrow">01 · Kiện hàng</p>
                <h2>Thông tin kiện hàng</h2>
              </div>
              <Calculator size={22} strokeWidth={1.7} aria-hidden="true" />
            </div>

            {submitted && (Object.keys(fieldErrors).length > 0 || globalError) && (
              <div ref={errorSummaryRef} tabIndex={-1} role="alert" aria-labelledby="internal-error-title" className="internal-error-summary">
                <p id="internal-error-title"><AlertCircle size={16} aria-hidden="true" /> Không thể ước tính cước</p>
                {globalError ? <span>{globalError}</span> : (
                  <ul>
                    {fieldErrors.actualWeight && <li><a href="#actualWeight">{fieldErrors.actualWeight}</a></li>}
                    {fieldErrors.dimensions && <li><a href="#length">{fieldErrors.dimensions}</a></li>}
                  </ul>
                )}
              </div>
            )}

            <ShipmentFields form={form} errors={fieldErrors} onChange={update} />

            <button type="submit" className="primary-pill form-action mt-6 w-full">
              So sánh nguồn giá <ArrowRight size={17} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </form>

          <section className="internal-results" aria-labelledby="carrier-heading">
            <fieldset className="internal-panel carrier-panel">
              <legend className="sr-only">Chọn nguồn giá</legend>
              <div className="internal-panel-heading internal-panel-heading-compact">
                <div>
                  <p className="eyebrow">02 · Nguồn giá</p>
                  <h2 id="carrier-heading">So sánh nhà vận chuyển</h2>
                </div>
                <PlugZap size={22} strokeWidth={1.7} aria-hidden="true" />
              </div>

              <div className="carrier-list">
                <label className="carrier-option carrier-option-active">
                  <input type="radio" name="carrier" value="vi-express" checked readOnly />
                  <span className="carrier-monogram" aria-hidden="true">VI</span>
                  <span className="carrier-copy">
                    <strong>VI LOGIX</strong>
                    <small>{result
                      ? result.rate.source === 'destination_matrix'
                        ? 'Bảng theo điểm đến · giá trực tiếp'
                        : `Bảng nội bộ · Vùng ${result.rate.zone}`
                      : 'Bảng nội bộ · sẵn sàng'}</small>
                  </span>
                  <span className="carrier-rate">
                    <small>Cước nền</small>
                    <strong>{result ? formatVnd(result.rate.basePriceVnd) : '—'}</strong>
                  </span>
                  <span className="carrier-state carrier-state-ready">Sẵn sàng</span>
                </label>

                {pendingCarriers.map((carrier) => (
                  <label key={carrier.id} className="carrier-option carrier-option-disabled" aria-disabled="true">
                    <input type="radio" name="carrier" value={carrier.id} disabled />
                    <span className="carrier-monogram" aria-hidden="true">{carrier.id === 'dhl' ? 'D' : 'U'}</span>
                    <span className="carrier-copy"><strong>{carrier.name}</strong><small>{carrier.detail}</small></span>
                    <span className="carrier-rate"><small>Giá tài khoản</small><strong>—</strong></span>
                    <span className="carrier-state">Chưa kết nối</span>
                  </label>
                ))}
              </div>
              <p className="carrier-disclaimer">Không hiển thị giá giả. DHL và UPS chỉ được bật sau khi có account rate hoặc API production đã xác minh.</p>
            </fieldset>

            <section className="internal-panel quote-output" aria-labelledby="quote-output-heading">
              {result ? (
                <div ref={resultRef} tabIndex={-1} className="quote-output-ready" aria-live="polite">
                  <div className="internal-panel-heading internal-panel-heading-compact">
                    <div>
                      <p className="eyebrow">03 · Báo giá khách hàng</p>
                      <h2 id="quote-output-heading">Giá gửi khách</h2>
                    </div>
                    <span className="status-badge status-badge-info">Bản nháp</span>
                  </div>

                  <div className="quote-route">
                    <strong>TP. Hồ Chí Minh → {result.destination.name}</strong>
                    <span>{formatWeight(result.billedWeightKg)} kg · {result.rate.transitTime}</span>
                  </div>

                  <dl className="quote-breakdown">
                    <div><dt>Cước nền express</dt><dd>{formatVnd(result.rate.basePriceVnd)}</dd></div>
                    <div>
                      <dt>
                        <label htmlFor="serviceFee">Phí dịch vụ VI LOGIX</label>
                        <small>Cộng trực tiếp vào giá gửi khách</small>
                      </dt>
                      <dd>
                        <div className="input-frame">
                          <input id="serviceFee" type="number" inputMode="numeric" min="0" step="1000" value={serviceFee} onChange={(event) => { setServiceFee(event.target.value); setCopyState('idle') }} aria-invalid={!validServiceFee} aria-describedby={!validServiceFee ? 'serviceFee-error' : 'serviceFee-hint'} placeholder="0" className="form-control form-control-unit quote-fee-input" />
                          <span className="unit-label">VND</span>
                        </div>
                        <span id={validServiceFee ? 'serviceFee-hint' : 'serviceFee-error'} className={`quote-fee-hint${validServiceFee ? '' : ' quote-fee-error'}`}>
                          {validServiceFee ? 'Nhập 0 nếu không cộng phí.' : 'Phí dịch vụ phải từ 0 trở lên.'}
                        </span>
                      </dd>
                    </div>
                    <div className="quote-total">
                      <dt><span>Giá dự kiến gửi khách</span><small>Đã gồm VAT và thuế nhập khẩu</small></dt>
                      <dd>{quotedPriceVnd !== null ? formatVnd(quotedPriceVnd) : '—'}</dd>
                    </div>
                  </dl>

                  <button type="button" onClick={handleCopy} disabled={!validServiceFee} className="primary-pill w-full">
                    {copyState === 'success' ? <Check size={17} strokeWidth={1.7} aria-hidden="true" /> : <Clipboard size={17} strokeWidth={1.7} aria-hidden="true" />}
                    {copyState === 'success' ? 'Đã sao chép báo giá' : 'Sao chép bản gửi khách'}
                  </button>
                  <p className="copy-feedback" aria-live="polite">
                    {copyState === 'success' && <><Check size={14} aria-hidden="true" />Bản tiếng Anh đã sẵn sàng để gửi.</>}
                    {copyState === 'error' && <><AlertCircle size={14} aria-hidden="true" />Không thể sao chép. Vui lòng thử lại.</>}
                  </p>
                </div>
              ) : (
                <div className="quote-output-empty">
                  <div className="internal-panel-heading internal-panel-heading-compact">
                    <div>
                      <p className="eyebrow">03 · Báo giá khách hàng</p>
                      <h2 id="quote-output-heading">Giá gửi khách</h2>
                    </div>
                    <Clipboard size={22} strokeWidth={1.7} aria-hidden="true" />
                  </div>
                  <div>
                    <strong>Chưa có báo giá</strong>
                    <p>Nhập thông tin kiện hàng để lấy cước nền, sau đó thêm phí dịch vụ và copy nội dung gửi khách.</p>
                  </div>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </div>
  )
}
