export const SITE_NAME = 'VI LOGIX'

const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim()

export const SITE_URL = (configuredSiteUrl || 'https://track.vilogx.co').replace(/\/$/, '')

const configuredWhatsAppNumber = import.meta.env.VITE_PUBLIC_WHATSAPP_NUMBER?.trim()
const configuredInstagramUrl = import.meta.env.VITE_PUBLIC_INSTAGRAM_URL?.trim()
const configuredViPickUrl = import.meta.env.VITE_PUBLIC_VI_PICK_URL?.trim()
const configuredMainSiteUrl = import.meta.env.VITE_PUBLIC_MAIN_SITE_URL?.trim()
const configuredViMadeUrl = import.meta.env.VITE_PUBLIC_VI_MADE_URL?.trim()

export const PUBLIC_WHATSAPP_NUMBER = (configuredWhatsAppNumber || '84943466897').replace(/\D/g, '')
export const PUBLIC_MAIN_SITE_URL = (configuredMainSiteUrl || 'https://vilogix.co').replace(/\/$/, '')
export const PUBLIC_INSTAGRAM_URL = configuredInstagramUrl || 'https://www.instagram.com/vilogix/'
export const PUBLIC_VI_PICK_URL = configuredViPickUrl || 'https://www.picksbyvi.com/'
export const PUBLIC_VI_MADE_URL = configuredViMadeUrl || 'https://vimade-site.vercel.app/'
export const PUBLIC_CONTACT_EMAIL = 'hello@vilogix.com'
export const PUBLIC_CONTACT_ACTION_LABEL = 'Get a Quote'
export const buildWhatsAppUrl = (message: string) => `https://wa.me/${PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export type MainSiteMedium = 'header' | 'footer'

/** Main-site destinations used by tracking. Quote requests go to the contact form; `source` tags the lead. */
export const buildMainSiteUrl = (
  target: 'home' | 'quote',
  locale: 'en' | 'vi',
  medium: MainSiteMedium,
  content?: 'lookup' | 'embed',
) => {
  const path = target === 'quote' ? (locale === 'vi' ? '/vi/lien-he' : '/contact') : (locale === 'vi' ? '/vi' : '/')
  const url = new URL(path, `${PUBLIC_MAIN_SITE_URL}/`)
  url.searchParams.set('utm_source', 'track')
  url.searchParams.set('utm_medium', medium)
  url.searchParams.set('utm_campaign', 'tracking')
  if (content) url.searchParams.set('utm_content', content)
  return url.toString()
}
