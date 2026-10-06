import { AlertCircle, Ruler } from 'lucide-react'
import { CARGO_TYPES, DESTINATIONS, DESTINATION_SEARCH_ALIASES } from '../config'
import { PRICING_META } from '../data/pricing'
import type { ShipmentFieldErrors, ShipmentFormState } from '../lib/estimateForm'
import type { CargoType } from '../lib/rates'
import { DestinationCombobox } from './DestinationCombobox'

interface ShipmentFieldsProps {
  form: ShipmentFormState
  errors: ShipmentFieldErrors
  onChange: <K extends keyof ShipmentFormState>(key: K, value: ShipmentFormState[K]) => void
}

const FieldError = ({ id, children }: { id: string; children?: string }) =>
  children ? (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm leading-5 text-[var(--color-carbon-black)]">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  ) : null

export function ShipmentFields({ form, errors, onChange }: ShipmentFieldsProps) {
  return (
    <>
      <div className="origin-summary" role="note">
        <span>Origin</span>
        <strong>Ho Chi Minh City</strong>
      </div>

      <label className="field-label mt-5" htmlFor="cargoType">
        Shipment type
        <select id="cargoType" value={form.cargoType} onChange={(event) => onChange('cargoType', event.target.value as CargoType)} className="form-control">
          {CARGO_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>

      <div className="mt-5">
        <DestinationCombobox destinations={DESTINATIONS} aliases={DESTINATION_SEARCH_ALIASES} value={form.destinationId} onChange={(destinationId) => onChange('destinationId', destinationId)} />
      </div>

      <label className="field-label mt-5" htmlFor="actualWeight">
        Actual weight <span aria-hidden="true">*</span>
        <div className="input-frame input-frame-spaced">
          <input id="actualWeight" type="number" inputMode="decimal" min="0.1" step="0.1" value={form.actualWeight} onChange={(event) => onChange('actualWeight', event.target.value)} aria-invalid={Boolean(errors.actualWeight)} aria-describedby={errors.actualWeight ? 'actualWeight-error' : undefined} placeholder="Example: 1.5" className="form-control form-control-unit" />
          <span className="unit-label">kg</span>
        </div>
        <FieldError id="actualWeight-error">{errors.actualWeight}</FieldError>
      </label>

      <fieldset className="mt-6 border border-[var(--color-concrete-gray)] bg-[var(--color-mist-gray)] p-4 sm:p-5">
        <legend className="technical-label bg-[var(--color-surface)] px-2">Dimensions / optional</legend>
        <div className="dimensions-grid grid grid-cols-3 gap-3">
          {([['length', 'Length'], ['width', 'Width'], ['height', 'Height']] as const).map(([key, label]) => (
            <label key={key} className="field-label" htmlFor={key}>
              {label}
              <div className="input-frame input-frame-spaced">
                <input id={key} type="number" inputMode="decimal" min="0.1" step="0.1" value={form[key]} onChange={(event) => onChange(key, event.target.value)} aria-invalid={Boolean(errors.dimensions)} aria-describedby={errors.dimensions ? 'dimensions-error' : 'dimensions-hint'} placeholder="0" className="form-control form-control-unit-compact" />
                <span className="unit-label unit-label-compact">cm</span>
              </div>
            </label>
          ))}
        </div>
        <FieldError id="dimensions-error">{errors.dimensions}</FieldError>
        <p id="dimensions-hint" className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--color-ash-gray)]">
          <Ruler className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          Volumetric weight = Length × Width × Height ÷ {new Intl.NumberFormat('en-US').format(PRICING_META.volumetricDivisor)}
        </p>
      </fieldset>
    </>
  )
}
