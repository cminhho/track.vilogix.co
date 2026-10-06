import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { PUBLIC_PAGES } from './public-pages.mjs'

const root = process.cwd()
const distDirectory = resolve(root, 'dist')
const serverDirectory = resolve(root, '.seo-ssr')
const siteUrl = (process.env.VITE_PUBLIC_SITE_URL || 'https://track.vilogx.co').replace(/\/$/, '')
const instagramUrl = process.env.VITE_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/vilogix/'
const contactEmail = 'hello@vilogix.com'
const contactNumber = (process.env.VITE_PUBLIC_WHATSAPP_NUMBER || '84943466897').replace(/\D/g, '')
const socialImage = `${siteUrl}/images/logistics/warehouse-hero-1600.webp`
const socialImageAlt = 'Warehouse aisle illustrating VI LOGIX fulfillment and logistics services in Vietnam'

const template = await readFile(resolve(distDirectory, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(resolve(serverDirectory, 'entry-server.js')).href)

const escapeAttribute = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const replaceNamedMeta = (html, name, content) => html.replace(
  new RegExp(`<meta name="${name}" content="[^"]*"\\s*/?>`),
  `<meta name="${name}" content="${escapeAttribute(content)}" />`,
)

const replacePropertyMeta = (html, property, content) => html.replace(
  new RegExp(`<meta property="${property}" content="[^"]*"\\s*/?>`),
  `<meta property="${property}" content="${escapeAttribute(content)}" />`,
)

const buildStructuredData = (page) => {
  const url = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const pageNode = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
  }

  const graph = [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${siteUrl}/#organization`,
      name: 'VI LOGIX',
      url: `${siteUrl}/`,
      email: contactEmail,
      telephone: `+${contactNumber}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Thu Duc',
        addressRegion: 'Ho Chi Minh City',
        addressCountry: 'VN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: contactEmail,
        telephone: `+${contactNumber}`,
        availableLanguage: ['English', 'Vietnamese'],
      },
      sameAs: [instagramUrl],
      description: 'Vietnam fulfillment and consolidation in Thu Duc, Ho Chi Minh City for international buyers managing goods they already own.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: 'VI LOGIX',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en',
    },
    pageNode,
  ]

  if (page.kind === 'home') {
    const applicationId = `${url}#tracking-application`
    graph.push({
      '@type': 'WebApplication',
      '@id': applicationId,
      url,
      name: 'VI LOGIX Shipment Tracking',
      description: 'Public shipment status lookup for VI LOGIX fulfillment and international logistics movements.',
      applicationCategory: 'BusinessApplication',
      browserRequirements: 'Requires JavaScript',
      isPartOf: { '@id': `${siteUrl}/#website` },
      provider: { '@id': `${siteUrl}/#organization` },
    })
    pageNode.mainEntity = { '@id': applicationId }

  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

const buildHtml = (page) => {
  const canonicalUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const ogType = page.kind === 'article' ? 'article' : 'website'
  const renderedApp = render(page.path)
  const jsonLd = JSON.stringify(buildStructuredData(page)).replaceAll('<', '\\u003c')

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttribute(page.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`)
    .replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`)

  html = replaceNamedMeta(html, 'description', page.description)
  html = replaceNamedMeta(html, 'robots', 'index, follow, max-image-preview:large')
  html = replaceNamedMeta(html, 'twitter:card', 'summary_large_image')
  html = replaceNamedMeta(html, 'twitter:title', page.title)
  html = replaceNamedMeta(html, 'twitter:description', page.description)
  html = replaceNamedMeta(html, 'twitter:image', socialImage)
  html = replaceNamedMeta(html, 'twitter:image:alt', socialImageAlt)
  html = replacePropertyMeta(html, 'og:type', ogType)
  html = replacePropertyMeta(html, 'og:title', page.title)
  html = replacePropertyMeta(html, 'og:description', page.description)
  html = replacePropertyMeta(html, 'og:url', canonicalUrl)
  html = replacePropertyMeta(html, 'og:image', socialImage)
  html = replacePropertyMeta(html, 'og:image:alt', socialImageAlt)
  html = html.replace('</head>', `    <script id="page-structured-data" type="application/ld+json">${jsonLd}</script>\n  </head>`)

  return html
}

for (const page of PUBLIC_PAGES) {
  const outputPath = page.path === '/'
    ? resolve(distDirectory, 'index.html')
    : resolve(distDirectory, page.path.slice(1), 'index.html')
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, buildHtml(page))
}

let notFoundHtml = template
  .replace(/<title>[^<]*<\/title>/, '<title>Page not found | VI LOGIX</title>')
  .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, '')
  .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, '')
  .replace('<div id="root"></div>', `<div id="root">${render('/404')}</div>`)
notFoundHtml = replaceNamedMeta(notFoundHtml, 'description', 'The page you requested does not exist on the VI LOGIX website.')
notFoundHtml = replaceNamedMeta(notFoundHtml, 'robots', 'noindex, nofollow')
notFoundHtml = replaceNamedMeta(notFoundHtml, 'twitter:title', 'Page not found | VI LOGIX')
notFoundHtml = replaceNamedMeta(notFoundHtml, 'twitter:description', 'The page you requested does not exist on the VI LOGIX website.')
notFoundHtml = replacePropertyMeta(notFoundHtml, 'og:title', 'Page not found | VI LOGIX')
notFoundHtml = replacePropertyMeta(notFoundHtml, 'og:description', 'The page you requested does not exist on the VI LOGIX website.')
await writeFile(resolve(distDirectory, '404.html'), notFoundHtml)

await rm(serverDirectory, { recursive: true, force: true })

console.log(`Generated static HTML for ${PUBLIC_PAGES.length} indexable routes plus 404.html.`)
