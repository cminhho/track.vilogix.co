import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PUBLIC_PAGES } from './public-pages.mjs'

const root = process.cwd()
const dist = resolve(root, 'dist')
const siteUrl = (process.env.VITE_PUBLIC_SITE_URL || 'https://track.vilogx.co').replace(/\/$/, '')

const [html, robots, sitemap, llms, vercelConfig, assetNames] = await Promise.all([
  readFile(resolve(dist, 'index.html'), 'utf8'),
  readFile(resolve(dist, 'robots.txt'), 'utf8'),
  readFile(resolve(dist, 'sitemap.xml'), 'utf8'),
  readFile(resolve(dist, 'llms.txt'), 'utf8'),
  readFile(resolve(root, 'vercel.json'), 'utf8'),
  readdir(resolve(dist, 'assets')),
])

const javascript = (await Promise.all(
  assetNames.filter((name) => name.endsWith('.js')).map((name) => readFile(resolve(dist, 'assets', name), 'utf8')),
)).join('\n')

const requireText = (content, expected, label) => {
  if (!content.includes(expected)) throw new Error(`${label} is missing: ${expected}`)
}

requireText(html, `<link rel="canonical" href="${siteUrl}/"`, 'Homepage canonical')
requireText(html, 'property="og:title"', 'Open Graph metadata')
requireText(html, 'name="twitter:card"', 'Twitter card metadata')
requireText(html, 'href="/favicon.svg"', 'Favicon')
requireText(robots, `Sitemap: ${siteUrl}/sitemap.xml`, 'robots.txt sitemap directive')
for (const page of PUBLIC_PAGES) {
  const canonicalUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const routeHtml = page.path === '/'
    ? html
    : await readFile(resolve(dist, page.path.slice(1), 'index.html'), 'utf8')

  requireText(sitemap, `<loc>${canonicalUrl}</loc>`, 'Sitemap route')
  requireText(llms, `](${canonicalUrl})`, 'llms.txt route')
  requireText(routeHtml, `<link rel="canonical" href="${canonicalUrl}"`, `${page.path} canonical`)
  requireText(routeHtml, `content="${page.description.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`, `${page.path} description`)
  requireText(routeHtml, 'id="page-structured-data"', `${page.path} structured data`)
  requireText(routeHtml, 'id="root"><', `${page.path} static rendered content`)
  requireText(javascript, page.kind === 'article' ? page.title.replace(/ \| VI LOGIX$/, '') : page.title, `${page.path} client title`)
  requireText(javascript, page.description, `${page.path} client description`)

  const headingCount = (routeHtml.match(/<h1(?:\s|>)/g) || []).length
  if (headingCount !== 1) throw new Error(`${page.path} must contain exactly one statically rendered h1; found ${headingCount}`)

  const structuredDataMatch = routeHtml.match(/<script id="page-structured-data" type="application\/ld\+json">([^<]+)<\/script>/)
  if (!structuredDataMatch) throw new Error(`${page.path} is missing parseable structured data`)
  const structuredData = JSON.parse(structuredDataMatch[1])
  if (structuredData['@context'] !== 'https://schema.org' || !Array.isArray(structuredData['@graph'])) {
    throw new Error(`${page.path} structured data does not contain a Schema.org graph`)
  }
  const schemaTypes = structuredData['@graph'].flatMap((node) => Array.isArray(node['@type']) ? node['@type'] : [node['@type']])
  if (!schemaTypes.includes('Organization') || !schemaTypes.includes('WebSite')) {
    throw new Error(`${page.path} structured data is missing Organization or WebSite context`)
  }
  if (!schemaTypes.includes('LocalBusiness')) throw new Error(`${page.path} structured data is missing LocalBusiness context`)
  const organization = structuredData['@graph'].find((node) => {
    const nodeTypes = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
    return nodeTypes.includes('Organization')
  })
  if (organization?.address?.addressLocality !== 'Thu Duc' || organization?.address?.addressRegion !== 'Ho Chi Minh City' || organization?.address?.addressCountry !== 'VN') {
    throw new Error(`${page.path} LocalBusiness address must use the verified Thu Duc, Ho Chi Minh City locality`)
  }
  if (!organization?.email || !organization?.telephone || organization?.contactPoint?.contactType !== 'customer service') {
    throw new Error(`${page.path} LocalBusiness is missing a verified contact channel`)
  }
  if ('openingHours' in organization || 'openingHoursSpecification' in organization || 'streetAddress' in (organization.address || {})) {
    throw new Error(`${page.path} LocalBusiness contains an unverified address or opening-hours field`)
  }
  if (page.kind === 'article') {
    for (const requiredType of ['BlogPosting', 'BreadcrumbList']) {
      if (!schemaTypes.includes(requiredType)) throw new Error(`${page.path} structured data is missing ${requiredType}`)
    }
    requireText(routeHtml, 'aria-label="Breadcrumb"', `${page.path} visible breadcrumb`)
  }
  if (page.kind === 'home' && !schemaTypes.includes('WebApplication')) {
    throw new Error('Homepage structured data is missing the tracking WebApplication')
  }
  if (page.kind === 'service') {
    for (const requiredType of ['Service', 'BreadcrumbList', 'FAQPage']) {
      if (!schemaTypes.includes(requiredType)) throw new Error(`${page.path} structured data is missing ${requiredType}`)
    }
  }
  if (page.kind === 'service') {
    if (!schemaTypes.includes('FAQPage')) throw new Error(`${page.path} structured data is missing FAQPage`)
    const faqPage = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage')
    const expectedQuestions = 4
    if (!Array.isArray(faqPage?.mainEntity) || faqPage.mainEntity.length !== expectedQuestions) {
      throw new Error(`${page.path} FAQPage must contain exactly ${expectedQuestions} questions`)
    }
    const rootStart = routeHtml.indexOf('<div id="root">')
    const rootEnd = routeHtml.indexOf('<script type="module"', rootStart)
    const renderedRoot = routeHtml.slice(rootStart, rootEnd)
    for (const item of faqPage.mainEntity) {
      if (item?.['@type'] !== 'Question' || item.acceptedAnswer?.['@type'] !== 'Answer') {
        throw new Error(`${page.path} FAQPage contains an invalid question or answer`)
      }
      requireText(renderedRoot, item.name, `Visible ${page.path} FAQ question`)
      requireText(renderedRoot, item.acceptedAnswer.text, `Visible ${page.path} FAQ answer`)
    }
  }
  for (const unsupportedCarrier of ['DHL', 'FedEx', 'Vietnam Post', 'Vietnam Airlines Cargo', 'VNPT', 'Viettel Post']) {
    if (routeHtml.includes(unsupportedCarrier)) throw new Error(`${page.path} contains unsupported public carrier claim: ${unsupportedCarrier}`)
  }
  if (/\b\d+\s*[–-]\s*\d+\s*(?:business\s+)?days\b/i.test(routeHtml)) {
    throw new Error(`${page.path} contains an unsupported fixed transit-time range`)
  }
  for (const forbiddenType of ['AggregateRating', 'Review']) {
    if (schemaTypes.includes(forbiddenType)) throw new Error(`${page.path} contains unsupported ${forbiddenType} structured data`)
  }
}

const sitemapUrlCount = (sitemap.match(/<url>/g) || []).length
if (sitemapUrlCount !== PUBLIC_PAGES.length) throw new Error(`Sitemap must contain ${PUBLIC_PAGES.length} public URLs; found ${sitemapUrlCount}`)
for (const page of PUBLIC_PAGES.filter(({ path }) => path !== '/')) {
  requireText(vercelConfig, `"source": "${page.path}"`, `${page.path} Vercel route`)
  requireText(vercelConfig, `"destination": "${page.path}/index.html"`, `${page.path} static HTML rewrite`)
}
if (vercelConfig.includes('"source": "/(.*)"')) throw new Error('Vercel must not rewrite unknown paths to homepage HTML')

const notFoundHtml = await readFile(resolve(dist, '404.html'), 'utf8')
requireText(notFoundHtml, 'content="noindex, nofollow"', 'Static 404 noindex')
if (notFoundHtml.includes('rel="canonical"')) throw new Error('Static 404 must not declare a canonical URL')
if (notFoundHtml.includes('property="og:url"')) throw new Error('Static 404 must not declare an Open Graph URL')

for (const forbidden of ['demo123', 'nhanvien@viexpress.vn', 'doitac@viexpress.vn', '19008095', 'international-express-undated-v1']) {
  if (javascript.includes(forbidden)) throw new Error(`Production bundle contains forbidden demo or unverified contact data: ${forbidden}`)
}
if (javascript.includes('Vietnam fulfillment operations')) throw new Error('Production bundle contains a stock-photo caption that implies VI LOGIX operations')
requireText(javascript, 'Copy tracking link', 'Tracking share action')
requireText(javascript, 'Estimated delivery', 'Tracking ETA guidance')
requireText(javascript, 'Customs clearance', 'International clearance checkpoint')
requireText(javascript, 'Theo dõi vận đơn', 'Vietnamese tracking locale')
if (javascript.includes('+84 94 346 6897')) throw new Error('Production bundle contains the formatted WhatsApp number as display text')

console.log('Release smoke checks passed.')
