export const SITE_NAME = 'VI LOGIX'

const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim()

export const SITE_URL = (configuredSiteUrl || 'https://track.vilogx.co').replace(/\/$/, '')

const configuredWhatsAppNumber = import.meta.env.VITE_PUBLIC_WHATSAPP_NUMBER?.trim()
const configuredInstagramUrl = import.meta.env.VITE_PUBLIC_INSTAGRAM_URL?.trim()
const configuredViPickUrl = import.meta.env.VITE_PUBLIC_VI_PICK_URL?.trim()
const configuredViMadeUrl = import.meta.env.VITE_PUBLIC_VI_MADE_URL?.trim()

export const PUBLIC_WHATSAPP_NUMBER = (configuredWhatsAppNumber || '84943466897').replace(/\D/g, '')
export const PUBLIC_INSTAGRAM_URL = configuredInstagramUrl || 'https://www.instagram.com/vilogix/'
export const PUBLIC_VI_PICK_URL = configuredViPickUrl || 'https://www.picksbyvi.com/'
export const PUBLIC_VI_MADE_URL = configuredViMadeUrl || 'https://vimade-site.vercel.app/'
export const PUBLIC_CONTACT_EMAIL = 'hello@vilogix.com'
export const PUBLIC_CONTACT_ACTION_LABEL = 'Get a Quote'
export const buildWhatsAppUrl = (message: string) => `https://wa.me/${PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
