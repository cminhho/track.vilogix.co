import { describe, expect, it } from 'vitest'
import { parseVietAnCounts } from '../../api/embed-height'
import { estimateVietAnHeight } from './embedHeight'

const row = (time: string, text: string) => `<tr><td>${time}</td><td>${text}</td><td>HO CHI MINH - VN</td></tr>`

const page = (body: string) => `
  <div>VI LOGIX AWB: 6172162 Status: Customs update (2026-10-08 20:51) Ship date: <td>2026-10-07</td></div>
  <table><tr><th>Date/time</th><th>Activity</th><th>Location</th></tr>${body}</table>
  <div class="content-footer"><p>Copyright © 2025 - Viet An Express 10:30</p></div>
  <div class="chat-menu"><span>2026-01-01</span></div>`

describe('Viet An height estimate', () => {
  it('counts distinct dates and event rows after the table header, ignoring header and footer', () => {
    const html = page(
      `<tr><td colspan="3">2026-10-08</td></tr>${row('20:51', 'Customs update')}${row('18:38', 'Arrived')}` +
      `<tr><td colspan="3">2026-10-07</td></tr>${row('22:11', 'Sort')}`,
    )
    expect(parseVietAnCounts(html)).toEqual({ events: 3, dates: 2 })
  })

  it('ignores collapsed rows the vendor keeps in the markup (class ch_hide)', () => {
    const html = page(
      `<tr class='ch_show'><td colspan="3">2026-10-08</td></tr><tr class='ch_hide'><td>23:59</td><td>x</td></tr>` +
      `<tr class='ch_hide'><td colspan="3">2026-10-08</td></tr><tr class='ch_show'><td>20:51</td><td>Customs</td></tr>` +
      `<tr class='ch_hide'><td colspan="3">2026-10-08</td></tr><tr class='ch_show'><td>18:38</td><td>Arrived</td></tr>`,
    )
    expect(parseVietAnCounts(html)).toEqual({ events: 2, dates: 1 })
  })

  it('returns null when the table is missing', () => {
    expect(parseVietAnCounts('<html>nothing here</html>')).toBeNull()
  })

  it('grows with more updates so the crop stays under the last event', () => {
    const few = estimateVietAnHeight({ events: 2, dates: 1 }, false)
    const many = estimateVietAnHeight({ events: 12, dates: 3 }, false)
    expect(many).toBeGreaterThan(few)
    expect(estimateVietAnHeight({ events: 9, dates: 2 }, false)).toBe(529)
    expect(estimateVietAnHeight({ events: 10, dates: 2 }, true)).toBeGreaterThan(estimateVietAnHeight({ events: 10, dates: 2 }, false))
  })
})
