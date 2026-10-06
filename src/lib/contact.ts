export interface WhatsAppInquiry {
  name: string
  goods: string
  services: string[]
  destination: string
  details: string
}

const compact = (value: string) => value.trim().replace(/\s+/g, ' ')

export const buildWhatsAppInquiryMessage = (inquiry: WhatsAppInquiry) => {
  const details = compact(inquiry.details)
  const serviceList = inquiry.services.map(compact).filter(Boolean).join(', ')

  return [
    `Hello VI LOGIX, I'm ${compact(inquiry.name)}.`,
    `Goods: ${compact(inquiry.goods)}.`,
    `Services: ${serviceList}.`,
    `Destination: ${compact(inquiry.destination)}.`,
    details ? `Details: ${details}` : '',
  ].filter(Boolean).join(' ')
}
