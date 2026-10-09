export type VietAnCounts = { events: number; dates: number }

/**
 * Visible height (px) of the Viet An result below the cropped vendor header, ending at the last event row.
 * Row metrics were measured on the live page: desktop layout (62rem iframe) vs phone layout (≤480px).
 */
const METRICS = {
  desktop: { base: 229, date: 28, event: 27.1 },
  phone: { base: 270, date: 27, event: 47 },
} as const

export const estimateVietAnHeight = ({ events, dates }: VietAnCounts, phone: boolean) => {
  const m = phone ? METRICS.phone : METRICS.desktop
  return Math.ceil(m.base + dates * m.date + events * m.event)
}

export async function fetchVietAnCounts(trackingNumber: string, signal?: AbortSignal): Promise<VietAnCounts | null> {
  try {
    const response = await fetch(`/api/embed-height?no=${encodeURIComponent(trackingNumber)}`, { signal })
    if (!response.ok) return null
    const data = (await response.json()) as { ok?: boolean } & Partial<VietAnCounts>
    return data.ok && data.events && data.dates ? { events: data.events, dates: data.dates } : null
  } catch {
    return null
  }
}
