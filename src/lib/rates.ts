import {
  DESTINATIONS,
  DESTINATION_RATE_OVERRIDES,
  PRICING_META,
  RATE_BANDS,
  RATE_REVIEW_NOTES,
  REGIONAL_FIXED_RATE_ROWS,
  REGIONAL_PER_KG_RATE_ROWS,
  REGIONAL_RATE_COLUMNS,
  TRANSIT_TIMES,
  type CargoType,
  type Destination,
  type PricingModel,
  type RateBand,
  type Zone,
} from '../data/pricing'
import {
  GLOBAL_DESTINATION_RATE_OVERRIDES,
  GLOBAL_RATE_COLUMNS,
  GLOBAL_RATE_ROWS,
} from '../data/globalPricing'

export const ORIGIN_CODES = ['HCM'] as const
export const CARGO_TYPES = ['goods', 'document'] as const

export type OriginCode = (typeof ORIGIN_CODES)[number]
export type { CargoType, Destination, Zone }

export interface EstimateInput {
  origin: OriginCode
  destinationId: string
  cargoType: CargoType
  actualWeightKg: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
}

export interface WeightSummary {
  actualWeightKg: number
  volumetricWeightKg: number
  chargeableWeightKg: number
  billedWeightKg: number
}

export interface AppliedRate {
  zone: Zone
  source: 'destination_matrix' | 'zone_matrix'
  pricingModel: PricingModel
  minWeightKg: number
  maxWeightKg: number | null
  basePriceVnd: number
  unitPriceVnd: number | null
  transitTime: string
}

export interface EstimateResult extends WeightSummary {
  destination: Destination
  rate: AppliedRate
  calculationLabel: string
}

export class PricingDataError extends Error {}

const isZone = (value: number): value is Zone => Number.isInteger(value) && value >= 1 && value <= 11

export const validatePricingDatabase = (): void => {
  const destinationIds = new Set<string>()
  DESTINATIONS.forEach((destination) => {
    if (!destination.id || destinationIds.has(destination.id)) {
      throw new PricingDataError(`Destination ID bị trùng hoặc trống: ${destination.id}.`)
    }
    destinationIds.add(destination.id)
    if (destination.zone !== null && !isZone(destination.zone)) {
      throw new PricingDataError(`Zone không hợp lệ cho ${destination.name}.`)
    }
    if (destination.status === 'verified' && destination.zone === null) {
      throw new PricingDataError(`${destination.name} được xác minh nhưng chưa có zone.`)
    }
  })

  const reviewKeys = new Set(RATE_REVIEW_NOTES.map((note) =>
    [note.cargoType, note.minWeightKg, note.maxWeightKg, note.zone].join('|'),
  ))

  RATE_BANDS.forEach((rate) => {
    if (rate.prices.length !== 11) {
      throw new PricingDataError(`Bậc ${rate.cargoType} ${rate.maxWeightKg ?? '++'} kg không đủ 11 zone.`)
    }
    if (rate.maxWeightKg !== null && rate.maxWeightKg <= rate.minWeightKg) {
      throw new PricingDataError('Khoảng cân trong pricing database không hợp lệ.')
    }
    rate.prices.forEach((price, zoneIndex) => {
      if (price !== null && (!Number.isFinite(price) || price <= 0)) {
        throw new PricingDataError('Pricing database chứa giá không hợp lệ.')
      }
      const reviewKey = [rate.cargoType, rate.minWeightKg, rate.maxWeightKg, zoneIndex + 1].join('|')
      if (price === null && !reviewKeys.has(reviewKey)) {
        throw new PricingDataError(`Ô giá trống chưa có ghi chú đối soát: ${reviewKey}.`)
      }
    })
  })

  if (REGIONAL_FIXED_RATE_ROWS.length !== 39) {
    throw new PricingDataError('Bảng giá khu vực phải có đủ 39 bậc từ 1 đến 20 kg.')
  }
  REGIONAL_FIXED_RATE_ROWS.forEach((row, index) => {
    const expectedWeight = 1 + index * 0.5
    if (row.maxWeightKg !== expectedWeight) {
      throw new PricingDataError(`Bậc giá khu vực ${row.maxWeightKg} kg không đúng chuỗi 0,5 kg.`)
    }
    if (row.prices.length !== REGIONAL_RATE_COLUMNS.length || row.prices.some((price) => !Number.isFinite(price) || price <= 0)) {
      throw new PricingDataError(`Bậc giá khu vực ${row.maxWeightKg} kg không đủ giá hợp lệ.`)
    }
  })

  REGIONAL_PER_KG_RATE_ROWS.forEach((row, index) => {
    const previous = REGIONAL_PER_KG_RATE_ROWS[index - 1]
    if (previous?.maxWeightKg !== undefined && previous.maxWeightKg !== null && row.minWeightKg !== previous.maxWeightKg + 1) {
      throw new PricingDataError('Các ngưỡng đơn giá/kg khu vực bị thiếu hoặc chồng lấn.')
    }
    if (row.prices.length !== REGIONAL_RATE_COLUMNS.length || row.prices.some((price) => !Number.isFinite(price) || price <= 0)) {
      throw new PricingDataError(`Ngưỡng ${row.minWeightKg} kg khu vực không đủ đơn giá hợp lệ.`)
    }
  })

  Object.entries(DESTINATION_RATE_OVERRIDES).forEach(([destinationId, override]) => {
    if (!DESTINATIONS.some((destination) => destination.id === destinationId)) {
      throw new PricingDataError(`Destination override không tồn tại: ${destinationId}.`)
    }
    if (!REGIONAL_RATE_COLUMNS.includes(override.column)) {
      throw new PricingDataError(`Cột giá khu vực không hợp lệ: ${override.column}.`)
    }
  })

  const expectedGlobalWeights = [
    ...Array.from({ length: 20 }, (_, index) => (index + 1) / 10),
    2.5, 3, 3.5, 4, 4.5, 5,
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]
  if (GLOBAL_RATE_ROWS.length !== expectedGlobalWeights.length) {
    throw new PricingDataError(`Bảng giá global phải có đủ ${expectedGlobalWeights.length} bậc cân.`)
  }
  GLOBAL_RATE_ROWS.forEach((row, index) => {
    if (row.maxWeightKg !== expectedGlobalWeights[index]) {
      throw new PricingDataError(`Bậc giá global ${row.maxWeightKg} kg không đúng chuỗi nguồn.`)
    }
    if (row.prices.length !== GLOBAL_RATE_COLUMNS.length) {
      throw new PricingDataError(`Bậc giá global ${row.maxWeightKg} kg không đủ ${GLOBAL_RATE_COLUMNS.length} cột.`)
    }
    if (row.prices.some((price) => price !== null && (!Number.isFinite(price) || price <= 0))) {
      throw new PricingDataError(`Bậc giá global ${row.maxWeightKg} kg chứa giá không hợp lệ.`)
    }
  })

  Object.entries(GLOBAL_DESTINATION_RATE_OVERRIDES).forEach(([destinationId, override]) => {
    if (!DESTINATIONS.some((destination) => destination.id === destinationId)) {
      throw new PricingDataError(`Global destination override không tồn tại: ${destinationId}.`)
    }
    if (!GLOBAL_RATE_COLUMNS.includes(override.column)) {
      throw new PricingDataError(`Cột giá global không hợp lệ: ${override.column}.`)
    }
  })

  RATE_REVIEW_NOTES.forEach((note) => {
    const rate = RATE_BANDS.find((band) =>
      band.cargoType === note.cargoType &&
      band.minWeightKg === note.minWeightKg &&
      band.maxWeightKg === note.maxWeightKg,
    )
    if (!rate || rate.prices[note.zone - 1] !== null) {
      throw new PricingDataError(`Ghi chú đối soát không khớp ô giá bị khóa: ${note.rawValue}.`)
    }
  })

  for (const cargoType of CARGO_TYPES) {
    const bands = RATE_BANDS.filter((rate) => rate.cargoType === cargoType)
    for (let index = 1; index < bands.length; index += 1) {
      const previous = bands[index - 1]
      const current = bands[index]
      if (previous.maxWeightKg !== current.minWeightKg) {
        throw new PricingDataError(`Bậc cân ${cargoType} bị thiếu hoặc chồng lấn.`)
      }
    }
  }
}

validatePricingDatabase()

export const calculateWeights = (
  input: Pick<EstimateInput, 'actualWeightKg' | 'lengthCm' | 'widthCm' | 'heightCm'>,
  cargoType: CargoType = 'goods',
): WeightSummary => {
  if (!Number.isFinite(input.actualWeightKg) || input.actualWeightKg <= 0) {
    throw new Error('Actual weight must be greater than 0 kg.')
  }

  const dimensions = [input.lengthCm, input.widthCm, input.heightCm]
  const enteredDimensions = dimensions.filter((dimension) => dimension !== undefined)
  if (enteredDimensions.length > 0 && enteredDimensions.length < 3) {
    throw new Error('Enter length, width, and height together, or leave all three blank.')
  }
  if (enteredDimensions.some((dimension) => !Number.isFinite(dimension) || Number(dimension) <= 0)) {
    throw new Error('Parcel dimensions must be greater than 0 cm.')
  }

  const volumetricWeightKg = enteredDimensions.length === 3
    ? (input.lengthCm! * input.widthCm! * input.heightCm!) / PRICING_META.volumetricDivisor
    : 0
  const chargeableWeightKg = Math.max(input.actualWeightKg, volumetricWeightKg)
  const billedWeightKg = cargoType === 'goods' && chargeableWeightKg > 20
    ? Math.ceil(chargeableWeightKg)
    : Math.ceil(chargeableWeightKg * 2) / 2

  return { actualWeightKg: input.actualWeightKg, volumetricWeightKg, chargeableWeightKg, billedWeightKg }
}

const findBand = (cargoType: CargoType, billedWeightKg: number): RateBand | undefined =>
  RATE_BANDS.find((band) =>
    band.cargoType === cargoType &&
    billedWeightKg > band.minWeightKg &&
    (band.maxWeightKg === null || billedWeightKg <= band.maxWeightKg),
  )

const findDestinationOverrideRate = (destinationId: string, billedWeightKg: number) => {
  const override = DESTINATION_RATE_OVERRIDES[destinationId]
  if (!override) return undefined

  const columnIndex = REGIONAL_RATE_COLUMNS.indexOf(override.column)
  if (billedWeightKg <= 20) {
    const rowIndex = REGIONAL_FIXED_RATE_ROWS.findIndex((row) => billedWeightKg <= row.maxWeightKg)
    if (rowIndex < 0) return undefined
    const row = REGIONAL_FIXED_RATE_ROWS[rowIndex]
    return {
      pricingModel: 'fixed' as const,
      minWeightKg: rowIndex === 0 ? 0 : REGIONAL_FIXED_RATE_ROWS[rowIndex - 1].maxWeightKg,
      maxWeightKg: row.maxWeightKg,
      basePriceVnd: row.prices[columnIndex],
      unitPriceVnd: null,
      transitTime: override.transitTime,
      calculationLabel: `Bậc đến ${formatWeight(row.maxWeightKg)} kg`,
    }
  }

  const row = REGIONAL_PER_KG_RATE_ROWS.find((candidate) =>
    billedWeightKg >= candidate.minWeightKg &&
    (candidate.maxWeightKg === null || billedWeightKg <= candidate.maxWeightKg),
  )
  if (!row) return undefined
  const unitPriceVnd = row.prices[columnIndex]
  return {
    pricingModel: 'per_kg' as const,
    minWeightKg: row.minWeightKg - 1,
    maxWeightKg: row.maxWeightKg,
    basePriceVnd: billedWeightKg * unitPriceVnd,
    unitPriceVnd,
    transitTime: override.transitTime,
    calculationLabel: `${formatWeight(billedWeightKg)} kg × ${formatVnd(unitPriceVnd)}/kg`,
  }
}

const findGlobalDestinationOverrideRate = (destinationId: string, billedWeightKg: number) => {
  const override = GLOBAL_DESTINATION_RATE_OVERRIDES[destinationId]
  if (!override) return undefined

  const columnIndex = GLOBAL_RATE_COLUMNS.indexOf(override.column)
  const rowIndex = GLOBAL_RATE_ROWS.findIndex((row) => billedWeightKg <= row.maxWeightKg)
  if (rowIndex < 0) return undefined
  const row = GLOBAL_RATE_ROWS[rowIndex]
  const basePriceVnd = row.prices[columnIndex]
  if (basePriceVnd === null) return undefined

  return {
    pricingModel: 'fixed' as const,
    minWeightKg: rowIndex === 0 ? 0 : GLOBAL_RATE_ROWS[rowIndex - 1].maxWeightKg,
    maxWeightKg: row.maxWeightKg,
    basePriceVnd,
    unitPriceVnd: null,
    transitTime: override.transitTime,
    calculationLabel: `Bậc đến ${formatWeight(row.maxWeightKg)} kg`,
  }
}

export const findDestination = (destinationId: string): Destination | undefined =>
  DESTINATIONS.find((destination) => destination.id === destinationId)

export const estimateRate = (input: EstimateInput): EstimateResult => {
  if (!ORIGIN_CODES.includes(input.origin)) throw new Error('This origin is not supported.')

  const destination = findDestination(input.destinationId)
  if (!destination) throw new Error('The destination was not found in the pricing database.')
  if (destination.status === 'unavailable' || destination.zone === null) {
    throw new Error(`${destination.name} has no verified rate zone. Please request a manual quote.`)
  }
  if (destination.status === 'review_required') {
    throw new Error(`The rate zone for ${destination.name} is under review and cannot be quoted automatically.`)
  }

  const calculatedWeights = calculateWeights(input, input.cargoType)
  const usesGlobalDestinationMatrix = input.cargoType === 'goods' && destination.id in GLOBAL_DESTINATION_RATE_OVERRIDES
  const globalBilledWeightKg = calculatedWeights.chargeableWeightKg <= 2
    ? Math.ceil((calculatedWeights.chargeableWeightKg - 1e-9) * 10) / 10
    : calculatedWeights.chargeableWeightKg <= 5
      ? Math.ceil((calculatedWeights.chargeableWeightKg - 1e-9) * 2) / 2
      : Math.ceil(calculatedWeights.chargeableWeightKg - 1e-9)
  const weights = usesGlobalDestinationMatrix
    ? { ...calculatedWeights, billedWeightKg: globalBilledWeightKg }
    : calculatedWeights
  if (input.cargoType === 'document' && weights.billedWeightKg > 2) {
    throw new Error('Automatic document rates are available up to 2 kg. Please request a manual quote.')
  }

  const hasDestinationOverride = input.cargoType === 'goods' && (
    destination.id in DESTINATION_RATE_OVERRIDES ||
    destination.id in GLOBAL_DESTINATION_RATE_OVERRIDES
  )
  const destinationOverrideRate = input.cargoType === 'goods'
    ? findDestinationOverrideRate(destination.id, weights.billedWeightKg) ??
      findGlobalDestinationOverrideRate(destination.id, weights.billedWeightKg)
    : undefined

  if (hasDestinationOverride && !destinationOverrideRate) {
    throw new Error(`No verified destination rate is available for ${destination.name} at ${formatWeight(weights.billedWeightKg)} kg. Please request a manual quote.`)
  }

  if (destinationOverrideRate) {
    return {
      ...weights,
      destination,
      rate: {
        zone: destination.zone,
        source: 'destination_matrix',
        pricingModel: destinationOverrideRate.pricingModel,
        minWeightKg: destinationOverrideRate.minWeightKg,
        maxWeightKg: destinationOverrideRate.maxWeightKg,
        basePriceVnd: destinationOverrideRate.basePriceVnd,
        unitPriceVnd: destinationOverrideRate.unitPriceVnd,
        transitTime: destinationOverrideRate.transitTime,
      },
      calculationLabel: destinationOverrideRate.calculationLabel,
    }
  }

  const band = findBand(input.cargoType, weights.billedWeightKg)
  if (!band) throw new Error('No verified rate band is available for this chargeable weight.')

  const unitPriceVnd = band.prices[destination.zone - 1]
  if (unitPriceVnd === null) {
    throw new Error(`The Zone ${destination.zone} rate for this weight is under review and cannot be quoted automatically.`)
  }

  const basePriceVnd = band.pricingModel === 'per_kg'
    ? weights.billedWeightKg * unitPriceVnd
    : unitPriceVnd
  const transitTime = TRANSIT_TIMES[input.cargoType][destination.zone - 1]
  const calculationLabel = band.pricingModel === 'per_kg'
    ? `${formatWeight(weights.billedWeightKg)} kg × ${formatVnd(unitPriceVnd)}/kg`
    : `Bậc đến ${formatWeight(band.maxWeightKg!)} kg`

  return {
    ...weights,
    destination,
    rate: {
      zone: destination.zone,
      source: 'zone_matrix',
      pricingModel: band.pricingModel,
      minWeightKg: band.minWeightKg,
      maxWeightKg: band.maxWeightKg,
      basePriceVnd,
      unitPriceVnd: band.pricingModel === 'per_kg' ? unitPriceVnd : null,
      transitTime,
    },
    calculationLabel,
  }
}

export const formatVnd = (amount: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(amount)

export const formatWeight = (weight: number) => new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 2,
}).format(weight)

export const formatTransitTimeEnglish = (transitTime: string) =>
  transitTime.replace(/\s*ngày$/i, ' business days')
