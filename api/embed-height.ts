/**
 * Viet An result pages are cross-origin, so the browser cannot measure how tall the tracking table is.
 * This function fetches the result page on the server and counts the date headers and event rows, so
 * the client can crop the embed exactly under the last event (hiding the vendor footer, copyright and chat).
 *
 * The parser is deliberately tolerant: it only looks at the markup after the "Date/time" column header and
 * counts cells that contain nothing but a time (HH:MM) or a date (YYYY-MM-DD). Any failure returns
 * `{ ok: false }` and the client falls back to its fixed crop height.
 */

const VIET_AN_URL = 'https://vietanexpress.com.vn/TrackingResult.aspx'
const FETCH_TIMEOUT_MS = 4000

export type VietAnCounts = { events: number; dates: number }

export function parseVietAnCounts(html: string): VietAnCounts | null {
  const start = html.search(/Date\s*\/\s*time/i)
  if (start < 0) return null

  // Stop at the vendor footer so its copyright year or chat markup never counts.
  const rest = html.slice(start)
  const footer = rest.search(/class=["'][^"']*(content-footer|chat-menu)/i)
  const table = footer > 0 ? rest.slice(0, footer) : rest

  // Strict: only the first cell of each row counts, so times/dates inside other cells (or elsewhere on the page) are ignored.
  // The vendor keeps collapsed rows in the markup with class `ch_hide` (e.g. 23:59 placeholders and duplicate
  // date headers); only rows that are not hidden take up space.
  const firstCells = [...table.matchAll(/<tr\b([^>]*)>\s*<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
    .filter((m) => !/\bch_hide\b/.test(m[1]))
    .map((m) => m[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim())
  const events = firstCells.filter((text) => /^\d{1,2}:\d{2}(?::\d{2})?$/.test(text)).length
  const dates = new Set(firstCells.filter((text) => /^\d{4}-\d{2}-\d{2}$/.test(text))).size
  if (events > 0) return { events, dates: Math.max(dates, 1) }

  // Fallback for non-<tr> markup: cells that contain nothing but a time or a date.
  const looseEvents = (table.match(/>\s*\d{1,2}:\d{2}(?::\d{2})?\s*</g) ?? []).length
  const looseDates = new Set(table.match(/>\s*\d{4}-\d{2}-\d{2}\s*</g) ?? []).size
  return looseEvents > 0 ? { events: looseEvents, dates: Math.max(looseDates, 1) } : null
}

type Req = { query?: Record<string, string | string[] | undefined> }
type Res = {
  status: (code: number) => Res
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
}

export default async function handler(req: Req, res: Res) {
  const raw = req.query?.no
  const no = Array.isArray(raw) ? raw[0] : raw
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

  if (!no || !/^\d{7}$/.test(no)) {
    res.status(400).json({ ok: false })
    return
  }

  try {
    const url = new URL(VIET_AN_URL)
    url.searchParams.set('id', no)
    const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VILOGIX-track)' } })
    if (!response.ok) throw new Error(`upstream ${response.status}`)
    const html = await response.text()
    const counts = parseVietAnCounts(html)
    const debug = req.query?.debug === '1'
      ? { rows: [...html.slice(Math.max(html.search(/Date\s*\/\s*time/i), 0)).matchAll(/<tr\b([^>]*)>\s*<t[dh]\b([^>]*)>([\s\S]*?)<\/t[dh]>/gi)].slice(0, 40).map((m) => `${m[1].trim()} | ${m[2].trim()} | ${m[3].replace(/<[^>]*>/g, '').trim().slice(0, 30)}`) }
      : {}
    res.status(200).json(counts ? { ok: true, ...counts, ...debug } : { ok: false, ...debug })
  } catch {
    res.status(200).json({ ok: false })
  }
}
