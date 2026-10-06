import type { CargoType, EstimateResult } from './rates'

export interface CustomerQuoteInput {
  originLabel: string
  cargoType: CargoType
  result: EstimateResult
  quotedPriceVnd?: number
}

const formatEnglishVnd = (amount: number) => `VND ${new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
}).format(amount)}`

const formatEnglishWeight = (weight: number) => new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
}).format(weight)

const formatEnglishTransitTime = (transitTime: string) =>
  transitTime.replace(/\s*ngày$/i, ' business days')

export const buildCustomerQuote = ({
  originLabel,
  cargoType,
  result,
  quotedPriceVnd,
}: CustomerQuoteInput) => {
  const displayedPriceVnd = quotedPriceVnd ?? result.rate.basePriceVnd

  return [
    'Hello, please find your international shipping estimate below:',
    '',
    `Route: ${originLabel} → ${result.destination.name}`,
    `Shipment: ${cargoType === 'document' ? 'Documents' : 'Goods'} · ${formatEnglishWeight(result.billedWeightKg)} kg chargeable weight`,
    'Rate basis: Current shipping partner estimate',
    `Estimated shipping fee: ${formatEnglishVnd(displayedPriceVnd)}`,
    'Includes: VAT and import duties',
    `Estimated transit time: ${formatEnglishTransitTime(result.rate.transitTime)}`,
    '',
    'Important notes:',
    '• This estimate is based on the shipping partner’s current rate and includes VAT and import duties.',
    '• The final price may change depending on the delivery zone for the recipient’s exact address.',
    '• The final fee will be confirmed after the shipping partner verifies the parcel’s actual weight, dimensions, destination address, contents, and destination requirements.',
    '• Fuel, remote-area, and special-handling surcharges may apply. Fuel surcharges may change with prevailing fuel prices.',
    '• Transit time excludes the pickup day, holidays, and customs delays. Remote areas may take 2–3 extra business days.',
  ].join('\n')
}
