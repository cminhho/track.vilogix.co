import { estimateRate, type CargoType, type EstimateResult } from './rates'

export interface ShipmentFormState {
  destinationId: string
  cargoType: CargoType
  actualWeight: string
  length: string
  width: string
  height: string
}

export type ShipmentFieldErrors = Partial<Record<'actualWeight' | 'dimensions', string>>

export const initialShipmentForm: ShipmentFormState = {
  destinationId: 'singapore',
  cargoType: 'goods',
  actualWeight: '',
  length: '',
  width: '',
  height: '',
}

export const validateShipmentForm = (form: ShipmentFormState): ShipmentFieldErrors => {
  const errors: ShipmentFieldErrors = {}
  const actualWeight = Number(form.actualWeight)
  const dimensions = [form.length, form.width, form.height]
  const enteredDimensions = dimensions.filter((value) => value !== '')

  if (!form.actualWeight || !Number.isFinite(actualWeight) || actualWeight <= 0) {
    errors.actualWeight = 'Enter an actual weight greater than 0 kg.'
  }
  if (enteredDimensions.length > 0 && enteredDimensions.length < 3) {
    errors.dimensions = 'Enter length, width, and height together, or leave all three blank.'
  } else if (enteredDimensions.some((value) => !Number.isFinite(Number(value)) || Number(value) <= 0)) {
    errors.dimensions = 'Each dimension must be greater than 0 cm.'
  }

  return errors
}

export const estimateShipmentForm = (form: ShipmentFormState): EstimateResult => estimateRate({
  origin: 'HCM',
  destinationId: form.destinationId,
  cargoType: form.cargoType,
  actualWeightKg: Number(form.actualWeight),
  lengthCm: form.length ? Number(form.length) : undefined,
  widthCm: form.width ? Number(form.width) : undefined,
  heightCm: form.height ? Number(form.height) : undefined,
})
