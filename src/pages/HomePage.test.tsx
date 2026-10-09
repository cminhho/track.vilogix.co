import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppRoutes } from '../App'
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

    expect(screen.getByRole('alert').textContent).toBe('This tracking number is not valid. Check it and try again.')
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('rejects a Viet An number that is not seven digits', () => {
    renderTrackingRoutes()
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), {
      target: { value: 'VAE617216' },
    })
    fireEvent.click(screen.getByRole('button', { name: /track shipment/i }))

    expect(screen.getByRole('alert').textContent).toBe('This tracking number is not valid. Check it and try again.')
    expect(document.querySelector('iframe')).toBeNull()
  })
})

describe('tracking locale', () => {
  it('renders Vietnamese copy from ?lang=vi and keeps the language when opening a vendor page', () => {
    renderTrackingRoutes('/?lang=vi')

    expect(screen.getByRole('heading', { name: 'Theo dõi vận đơn.' })).toBeTruthy()
    fireEvent.change(screen.getByRole('textbox', { name: /mã vận đơn/i }), { target: { value: 'VAE6172162' } })
    fireEvent.click(screen.getByRole('button', { name: /theo dõi/i }))

    expect(screen.getByTitle('Tracking details — 6172162')).toBeTruthy()
  })

  it('localizes validation feedback', () => {
    renderTrackingRoutes('/?lang=vi')
    fireEvent.click(screen.getByRole('button', { name: /theo dõi/i }))

    expect(screen.getByRole('alert').textContent).toBe('Vui lòng nhập mã vận đơn.')
  })

  it('offers a WhatsApp support link only on the unavailable state', () => {
    renderTrackingRoutes('/TDE/no')
    const support = screen.getByRole('link', { name: /ask vi logix on whatsapp/i }) as HTMLAnchorElement
    expect(support.href.startsWith('https://wa.me/')).toBe(true)
    expect(support.rel).toContain('noopener')
  })
})

describe('tracking footer', () => {
  it('links to the main website and WhatsApp support without printing the phone number', () => {
    render(<MemoryRouter initialEntries={['/']}><AppRoutes /></MemoryRouter>)

    const site = screen.getByRole('link', { name: /go to the vi logix website/i }) as HTMLAnchorElement
    expect(site.href).toBe('https://vilogix.co/?utm_source=track&utm_medium=footer&utm_campaign=tracking')

    const help = screen.getByRole('link', { name: /need help\? whatsapp/i }) as HTMLAnchorElement
    expect(help.href.startsWith('https://wa.me/')).toBe(true)
    expect(help.rel).toContain('noopener')
    expect(document.body.textContent).not.toMatch(/\d{10,}/)
  })

  it('does not render the footer on a vendor tracking page', () => {
    render(<MemoryRouter initialEntries={['/VAE/6172162']}><AppRoutes /></MemoryRouter>)

    expect(screen.queryByRole('contentinfo')).toBeNull()
  })
})

describe('quote call to action', () => {
  it('shows one tagged quote link in the header on the home page', () => {
    render(<MemoryRouter initialEntries={['/']}><AppRoutes /></MemoryRouter>)

    const cta = screen.getByRole('link', { name: /contact vi logix/i }) as HTMLAnchorElement
    expect(cta.textContent).toBe('Contact us')
    expect(cta.href).toBe('https://vilogix.co/contact?utm_source=track&utm_medium=header&utm_campaign=tracking&utm_content=lookup')
    expect(screen.queryByRole('link', { name: /ask about this shipment/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /pricing|services|about/i })).toBeNull()
  })

  it('points Vietnamese visitors to the Vietnamese contact page', () => {
    render(<MemoryRouter initialEntries={['/?lang=vi']}><AppRoutes /></MemoryRouter>)

    const cta = screen.getByRole('link', { name: /liên hệ vi logix/i }) as HTMLAnchorElement
    expect(cta.textContent).toBe('Liên hệ')
    expect(cta.href).toBe('https://vilogix.co/vi/lien-he?utm_source=track&utm_medium=header&utm_campaign=tracking&utm_content=lookup')
  })

  it('keeps the quote link in the header of a vendor tracking page', () => {
    render(<MemoryRouter initialEntries={['/VAE/6172162']}><AppRoutes /></MemoryRouter>)

    const cta = screen.getByRole('link', { name: /contact vi logix/i }) as HTMLAnchorElement
    expect(cta.href).toContain('utm_content=embed')
    expect(screen.queryByRole('navigation', { name: /language/i })).toBeNull()
  })

  it('offers a WhatsApp help icon with the tracking number on a vendor page only', () => {
    render(<MemoryRouter initialEntries={['/VAE/6172162']}><AppRoutes /></MemoryRouter>)

    const help = screen.getByRole('link', { name: /ask about this shipment on whatsapp/i }) as HTMLAnchorElement
    expect(help.href.startsWith('https://wa.me/')).toBe(true)
    expect(decodeURIComponent(help.href)).toContain('6172162')
    expect(help.rel).toContain('noopener')
  })
})
