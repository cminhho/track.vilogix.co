import { useEffect } from 'react'
import type { FaqItem } from '../data/homeFaq'
import { PUBLIC_CONTACT_EMAIL, PUBLIC_INSTAGRAM_URL, PUBLIC_WHATSAPP_NUMBER, SITE_NAME, SITE_URL } from '../site'

interface PageMetaProps {
  title: string
  description: string
  noIndex?: boolean
  path?: string
  lang?: 'en' | 'vi'
  ogType?: 'website' | 'article'
  faqItems?: readonly FaqItem[]
  service?: {
    name: string
    description: string
    serviceType: readonly string[]
    areaServed: readonly string[]
  }
  webApplication?: {
    name: string
    description: string
  }
  breadcrumbs?: readonly {
    name: string
    path: string
  }[]
}

const SOCIAL_IMAGE_PATH = '/images/logistics/warehouse-hero-1600.webp'
const SOCIAL_IMAGE_ALT = 'Warehouse aisle illustrating VI LOGIX fulfillment and logistics services in Vietnam'

const setNamedMeta = (name: string, content: string) => {
  const existing = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  const meta = existing ?? document.createElement('meta')
  if (!existing) {
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}

const setPropertyMeta = (property: string, content: string) => {
  const existing = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  const meta = existing ?? document.createElement('meta')
  if (!existing) {
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.content = content
}

const buildStructuredData = (
  title: string,
  description: string,
  path: string,
  ogType: 'website' | 'article',
  faqItems?: readonly FaqItem[],
  service?: PageMetaProps['service'],
  webApplication?: PageMetaProps['webApplication'],
  breadcrumbs?: PageMetaProps['breadcrumbs'],
) => {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  const url = `${SITE_URL}${normalizedPath}`
  const pageSchema: Record<string, unknown> = {
    '@type': path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  }

  const graph: Record<string, unknown>[] = [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      email: PUBLIC_CONTACT_EMAIL,
      telephone: `+${PUBLIC_WHATSAPP_NUMBER}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Thu Duc',
        addressRegion: 'Ho Chi Minh City',
        addressCountry: 'VN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: PUBLIC_CONTACT_EMAIL,
        telephone: `+${PUBLIC_WHATSAPP_NUMBER}`,
        availableLanguage: ['English', 'Vietnamese'],
      },
      sameAs: [PUBLIC_INSTAGRAM_URL],
      description: 'Vietnam fulfillment and consolidation in Thu Duc, Ho Chi Minh City for international buyers managing goods they already own.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
    pageSchema,
  ]

  if (ogType === 'article') {
    pageSchema.mainEntity = { '@id': `${url}#article` }
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      url,
      headline: title.replace(/ \| VI LOGIX$/, ''),
      description,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
    })
  }

  if (webApplication) {
    const applicationId = `${url}#tracking-application`
    graph.push({
      '@type': 'WebApplication',
      '@id': applicationId,
      url,
      name: webApplication.name,
      description: webApplication.description,
      applicationCategory: 'BusinessApplication',
      browserRequirements: 'Requires JavaScript',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      provider: { '@id': `${SITE_URL}/#organization` },
    })
    pageSchema.mainEntity = { '@id': applicationId }
  }

  if (service) {
    const serviceId = `${url}#service`
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      url,
      name: service.name,
      description: service.description,
      serviceType: service.serviceType,
      areaServed: service.areaServed,
      provider: { '@id': `${SITE_URL}/#organization` },
    })
    pageSchema.mainEntity = { '@id': serviceId }
  }

  if (breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map(({ name, path: itemPath }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: `${SITE_URL}${itemPath === '/' ? '/' : `/${itemPath.replace(/^\/+|\/+$/g, '')}`}`,
      })),
    })
  }

  if (faqItems?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      url: `${url}#faq`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: faqItems.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    })
    pageSchema.hasPart = { '@id': `${url}#faq` }
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function PageMeta({ title, description, noIndex = false, path = '/', lang = 'vi', ogType = 'website', faqItems, service, webApplication, breadcrumbs }: PageMetaProps) {
  useEffect(() => {
    const socialImage = `${SITE_URL}${SOCIAL_IMAGE_PATH}`
    document.title = title
    document.documentElement.lang = lang
    setNamedMeta('description', description)
    setNamedMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setNamedMeta('twitter:card', 'summary_large_image')
    setNamedMeta('twitter:title', title)
    setNamedMeta('twitter:description', description)
    setNamedMeta('twitter:image', socialImage)
    setNamedMeta('twitter:image:alt', SOCIAL_IMAGE_ALT)
    setPropertyMeta('og:type', ogType)
    setPropertyMeta('og:title', title)
    setPropertyMeta('og:description', description)
    setPropertyMeta('og:site_name', SITE_NAME)
    setPropertyMeta('og:locale', lang === 'en' ? 'en_US' : 'vi_VN')
    setPropertyMeta('og:image', socialImage)
    setPropertyMeta('og:image:width', '1600')
    setPropertyMeta('og:image:height', '1000')
    setPropertyMeta('og:image:alt', SOCIAL_IMAGE_ALT)

    const existingStructuredData = document.querySelector<HTMLScriptElement>('#page-structured-data')
    if (noIndex) {
      existingStructuredData?.remove()
    } else {
      const structuredData = existingStructuredData ?? document.createElement('script')
      structuredData.id = 'page-structured-data'
      structuredData.type = 'application/ld+json'
      structuredData.text = JSON.stringify(buildStructuredData(title, description, path, ogType, faqItems, service, webApplication, breadcrumbs))
      if (!existingStructuredData) document.head.appendChild(structuredData)
    }

    const existingCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (noIndex) {
      existingCanonical?.remove()
      document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.remove()
    } else {
      const canonical = existingCanonical ?? document.createElement('link')
      if (!existingCanonical) {
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
      const canonicalUrl = `${SITE_URL}${normalizedPath}`
      canonical.href = canonicalUrl
      setPropertyMeta('og:url', canonicalUrl)
    }
  }, [breadcrumbs, description, faqItems, lang, noIndex, ogType, path, service, title, webApplication])

  return null
}
