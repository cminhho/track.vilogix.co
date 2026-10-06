import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './HomePage'
import { TrackingPage } from './TrackingPage'

afterEach(cleanup)

const renderTrackingRoutes = (initialEntry = '/') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/track/:trackingNumber" element={<TrackingPage />} />
    </Routes>
  </MemoryRouter>,
)

describe('lean tracking flow', () => {
  it('keeps validation feedback connected to the tracking field', () => {
    renderTrackingRoutes()
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    const input = screen.getByRole('textbox', { name: /tracking number/i })
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('tracking-number-error')
    expect(screen.getByRole('alert').textContent).toBe('Enter a tracking number.')
  })

  it('opens the dedicated tracking page and embeds the supplied bill', () => {
    renderTrackingRoutes()
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), {
      target: { value: 'idb20264384' },
    })
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    expect(screen.getByRole('heading', { name: 'Shipment tracking' })).toBeTruthy()
    expect(screen.queryByText('Track another shipment')).toBeNull()
    expect(screen.queryByText('Tracking details')).toBeNull()
    expect(screen.queryByText('Tracking number')).toBeNull()
    expect(screen.queryByText('IDB20264384')).toBeNull()
    const frame = screen.getByTitle('Tracking details — IDB20264384') as HTMLIFrameElement
    expect(frame.src).toBe('https://track.tadiexpress.com/?b=IDB20264384')
  })

  it('renders a direct tracking URL without exposing the code in page metadata', () => {
    renderTrackingRoutes('/track/IDB20264384')
    expect(screen.getByTitle('Tracking details — IDB20264384')).toBeTruthy()
    expect(document.title).toBe('Shipment Tracking | VI LOGIX')
  })

  it('rejects a malformed direct tracking URL without creating an iframe', () => {
    renderTrackingRoutes('/track/no')
    expect(screen.getByRole('heading', { name: 'Tracking number not found.' })).toBeTruthy()
    expect(screen.queryByTitle(/tracking details/i)).toBeNull()
  })

  it('rejects an unapproved IDB number without loading the TADI domain', () => {
    renderTrackingRoutes('/track/IDB2026XXXX')
    expect(screen.getByRole('heading', { name: 'Tracking number not found.' })).toBeTruthy()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('keeps an unknown well-formed number on the homepage with an inline error', () => {
    renderTrackingRoutes()
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), {
      target: { value: 'IDB20269999' },
    })
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    expect(screen.getByRole('alert').textContent).toBe('Tracking number not found. Check the number and try again.')
    expect(document.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Track your shipment.' })).toBeTruthy()
  })
})
