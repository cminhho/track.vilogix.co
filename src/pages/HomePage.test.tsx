import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './HomePage'
import { NotFoundPage } from './NotFoundPage'
import { TadiTrackingPage } from './TadiTrackingPage'
import { VietAnTrackingPage } from './VietAnTrackingPage'

afterEach(cleanup)

const renderTrackingRoutes = (initialEntry = '/') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/TDE/:trackingNumber" element={<TadiTrackingPage />} />
      <Route path="/VAE/:trackingNumber" element={<VietAnTrackingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </MemoryRouter>,
)

describe('lean tracking flow', () => {
  it('keeps validation feedback connected to the tracking field', () => {
    renderTrackingRoutes()
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    const input = screen.getByRole('textbox', { name: /tracking number/i })
    expect(input.getAttribute('placeholder')).toBeNull()
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('tracking-number-error')
    expect(screen.getByRole('alert').textContent).toBe('Enter a tracking number.')
  })

  it('keeps the empty tracking field generic without vendor-specific helper copy', () => {
    renderTrackingRoutes()

    const input = screen.getByRole('textbox', { name: /tracking number/i })
    expect(input.getAttribute('aria-describedby')).toBeNull()
    expect(screen.queryByText(/including TDE or VAE/i)).toBeNull()
  })

  it('opens the TADI tracking page from a prefixed tracking number', () => {
    renderTrackingRoutes()
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), {
      target: { value: 'tdeidb20264388' },
    })
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    expect(screen.getByRole('heading', { name: 'Shipment tracking' })).toBeTruthy()
    expect(screen.queryByText('Track another shipment')).toBeNull()
    expect(screen.queryByText('Tracking details')).toBeNull()
    expect(screen.queryByText('Tracking number')).toBeNull()
    expect(screen.queryByText('IDB20264388')).toBeNull()
    const frame = screen.getByTitle('Tracking details — IDB20264388') as HTMLIFrameElement
    expect(frame.src).toBe('https://track.tadiexpress.com/?b=IDB20264388')
    expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer')
    expect(frame.classList.contains('tadi-tracking-frame')).toBe(true)
    expect(document.querySelector('.vietan-tracking-frame')).toBeNull()
  })

  it('opens the Viet An tracking page from a prefixed tracking number', () => {
    renderTrackingRoutes()
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), {
      target: { value: 'VAE6172162' },
    })
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    const frame = screen.getByTitle('Tracking details — 6172162') as HTMLIFrameElement
    expect(frame.src).toBe('https://vietanexpress.com.vn/TrackingResult.aspx?id=6172162')
    expect(frame.classList.contains('vietan-tracking-frame')).toBe(true)
    expect(document.querySelector('.tadi-tracking-frame')).toBeNull()
    fireEvent.load(frame)
    expect(screen.getByText(/VI LOGIX AWB:/)).toBeTruthy()
  })

  it('renders a direct vendor tracking URL without exposing the code in page metadata', () => {
    renderTrackingRoutes('/TDE/IDB20264388')
    expect(screen.getByTitle('Tracking details — IDB20264388')).toBeTruthy()
    expect(document.title).toBe('Shipment Tracking | VI LOGIX')
  })

  it('rejects a malformed direct tracking URL without creating an iframe', () => {
    renderTrackingRoutes('/TDE/no')
    expect(screen.getByRole('heading', { name: 'Tracking number not found.' })).toBeTruthy()
    expect(screen.queryByTitle(/tracking details/i)).toBeNull()
  })

  it('rejects an unsupported vendor without creating an iframe', () => {
    renderTrackingRoutes('/OTHER/6172162')
    expect(screen.getByRole('heading', { name: 'Page not found.' })).toBeTruthy()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('rejects an unprefixed vendor tracking number on the homepage', () => {
    renderTrackingRoutes()
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), {
      target: { value: 'IDB20269999' },
    })
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    expect(screen.getByRole('alert').textContent).toBe('Enter a valid tracking number.')
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('rejects a Viet An number that is not seven digits', () => {
    renderTrackingRoutes()
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), {
      target: { value: 'VAE617216' },
    })
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    expect(screen.getByRole('alert').textContent).toBe('Enter a valid tracking number.')
    expect(document.querySelector('iframe')).toBeNull()
  })
})
