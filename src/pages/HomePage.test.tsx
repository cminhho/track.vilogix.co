import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { DEMO_TRACKING_NUMBER } from '../data/trackingDemo'
import { HomePage } from './HomePage'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
})

describe('tracking homepage', () => {
  it('keeps validation feedback connected to the tracking field', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /^track$/i }))
    const input = screen.getByRole('textbox', { name: /tracking number/i })
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('tracking-number-error')
    expect(screen.getByRole('alert').textContent).toBe('Enter a tracking number.')
  })

  it('writes a shareable query and renders a privacy-safe shipment result', async () => {
    window.history.replaceState({}, '', '/')
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    fireEvent.change(screen.getByRole('textbox', { name: /tracking number/i }), { target: { value: DEMO_TRACKING_NUMBER.toLowerCase() } })
    fireEvent.click(screen.getByRole('button', { name: /^track$/i }))
    expect(await screen.findByRole('heading', { name: 'In transit' })).toBeTruthy()
    expect(screen.getAllByText(DEMO_TRACKING_NUMBER).length).toBeGreaterThan(0)
    expect(screen.getByText('In international transit')).toBeTruthy()
    expect(document.location.pathname).toBe('/')
    expect(document.location.search).toBe(`?tracking=${DEMO_TRACKING_NUMBER}&lang=en`)
    expect(document.body.textContent).not.toContain('recipientPhone')
    expect(screen.queryByText('Get shipment updates')).toBeNull()
    expect(screen.queryByText('Shipment references')).toBeNull()
    expect(screen.queryByText('Shipment documents')).toBeNull()
  })

  it('automatically looks up a tracking number from a shared link', async () => {
    window.history.replaceState({}, '', `/?tracking=${DEMO_TRACKING_NUMBER}`)
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    expect(await screen.findByRole('heading', { name: 'In transit' })).toBeTruthy()
    expect((screen.getByRole('textbox', { name: /tracking number/i }) as HTMLInputElement).value).toBe(DEMO_TRACKING_NUMBER)
  })

  it('copies the customer tracking link from a shipment result', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    window.history.replaceState({}, '', `/?tracking=${DEMO_TRACKING_NUMBER}`)
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    await screen.findByRole('heading', { name: 'In transit' })
    fireEvent.click(screen.getByRole('button', { name: /copy tracking link/i }))
    expect(await screen.findByRole('button', { name: /link copied/i })).toBeTruthy()
    expect(writeText).toHaveBeenCalledWith(`http://localhost:3000/?tracking=${DEMO_TRACKING_NUMBER}&lang=en`)
  })

  it('prioritizes an estimated delivery window and the customs checkpoint', async () => {
    window.history.replaceState({}, '', `/?tracking=${DEMO_TRACKING_NUMBER}`)
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    await screen.findByRole('heading', { name: 'In transit' })
    expect(screen.getByText('Estimated delivery')).toBeTruthy()
    expect(screen.getByText((_, element) => element?.tagName === 'STRONG' && Boolean(element.textContent?.includes('Oct')) && Boolean(element.textContent?.includes('2026')))).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Customs clearance' })).toBeTruthy()
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
  })

  it('keeps the selected Vietnamese locale in the URL and copied tracking link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    window.history.replaceState({}, '', `/?tracking=${DEMO_TRACKING_NUMBER}`)
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    await screen.findByRole('heading', { name: 'In transit' })
    fireEvent.click(screen.getByRole('button', { name: 'VI' }))
    expect(await screen.findByRole('heading', { name: 'Đang vận chuyển' })).toBeTruthy()
    expect(document.location.search).toContain('lang=vi')
    fireEvent.click(screen.getByRole('button', { name: /sao chép link theo dõi/i }))
    expect(writeText).toHaveBeenCalledWith(`http://localhost:3000/?tracking=${DEMO_TRACKING_NUMBER}&lang=vi`)
  })

})
