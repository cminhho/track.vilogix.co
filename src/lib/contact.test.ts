import { describe, expect, it } from 'vitest'
import { buildWhatsAppInquiryMessage } from './contact'
import { buildWhatsAppUrl } from '../site'

describe('WhatsApp inquiry message', () => {
  it('creates one short message and removes extra whitespace', () => {
    const message = buildWhatsAppInquiryMessage({
      name: '  Maya  ',
      goods: '  Fashion accessories ',
      services: ['Product Care', 'Consolidation', 'Shipping'],
      destination: ' Australia ',
      details: 'Three cartons;   inspect and consolidate.',
    })

    expect(message).toBe("Hello VI LOGIX, I'm Maya. Goods: Fashion accessories. Services: Product Care, Consolidation, Shipping. Destination: Australia. Details: Three cartons; inspect and consolidate.")
    expect(decodeURIComponent(buildWhatsAppUrl(message))).toBe(`https://wa.me/84943466897?text=${message}`)
  })

  it('keeps the message concise when additional details are empty', () => {
    expect(buildWhatsAppInquiryMessage({
      name: 'Noah',
      goods: 'Shoes',
      services: ['Receive & Store'],
      destination: 'Singapore',
      details: '   ',
    })).toBe("Hello VI LOGIX, I'm Noah. Goods: Shoes. Services: Receive & Store. Destination: Singapore.")
  })
})
