import { access, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PUBLIC_PAGES } from './public-pages.mjs'

const root = process.cwd()
const dist = resolve(root, 'dist')
const privateRobotsDirective = 'noindex, nofollow, noarchive, nosnippet, noimageindex'

const [html, robots, vercelConfig, assetNames] = await Promise.all([
  readFile(resolve(dist, 'index.html'), 'utf8'),
  readFile(resolve(dist, 'robots.txt'), 'utf8'),
  readFile(resolve(root, 'vercel.json'), 'utf8'),
  readdir(resolve(dist, 'assets')),
])

const javascript = (await Promise.all(
  assetNames.filter((name) => name.endsWith('.js')).map((name) => readFile(resolve(dist, 'assets', name), 'utf8')),
)).join('\n')

const requireText = (content, expected, label) => {
  if (!content.includes(expected)) throw new Error(`${label} is missing: ${expected}`)
}

const requireMissingFile = async (path, label) => {
  try {
    await access(path)
  } catch {
    return
  }
  throw new Error(`${label} must not be published`)
}

requireText(html, `content="${privateRobotsDirective}"`, 'Homepage robots meta')
requireText(html, 'href="/favicon.svg"', 'Favicon')
requireText(robots, 'User-agent: *\nDisallow: /', 'robots.txt site-wide block')
if (/\bAllow:\s*\//.test(robots)) throw new Error('robots.txt must not allow the site')
if (/Sitemap:/i.test(robots)) throw new Error('robots.txt must not advertise a sitemap')
requireText(vercelConfig, '"X-Robots-Tag"', 'Vercel crawler header')
requireText(vercelConfig, privateRobotsDirective, 'Vercel private robots directive')

await Promise.all([
  requireMissingFile(resolve(dist, 'sitemap.xml'), 'sitemap.xml'),
  requireMissingFile(resolve(dist, 'llms.txt'), 'llms.txt'),
])

for (const page of PUBLIC_PAGES) {
  const routeHtml = page.path === '/'
    ? html
    : await readFile(resolve(dist, page.path.slice(1), 'index.html'), 'utf8')
  const rootStart = routeHtml.indexOf('<div id="root">')
  const rootEnd = routeHtml.indexOf('<script type="module"', rootStart)
  const renderedRoot = routeHtml.slice(rootStart, rootEnd)

  requireText(routeHtml, `content="${privateRobotsDirective}"`, `${page.path} robots meta`)
  requireText(routeHtml, `content="${page.description.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`, `${page.path} description`)
  requireText(routeHtml, 'id="root"><', `${page.path} static rendered content`)
  requireText(javascript, page.title, `${page.path} client title`)
  requireText(javascript, page.description, `${page.path} client description`)

  if (routeHtml.includes('rel="canonical"')) throw new Error(`${page.path} must not declare a canonical URL`)
  if (routeHtml.includes('property="og:url"')) throw new Error(`${page.path} must not declare an Open Graph URL`)
  if (routeHtml.includes('id="page-structured-data"') || routeHtml.includes('application/ld+json')) {
    throw new Error(`${page.path} must not publish structured data`)
  }

  const headingCount = (routeHtml.match(/<h1(?:\s|>)/g) || []).length
  if (headingCount !== 1) throw new Error(`${page.path} must contain exactly one statically rendered h1; found ${headingCount}`)

  for (const unsupportedCarrier of ['DHL', 'FedEx', 'Vietnam Post', 'Vietnam Airlines Cargo', 'VNPT', 'Viettel Post']) {
    if (renderedRoot.includes(unsupportedCarrier)) throw new Error(`${page.path} contains unsupported public carrier claim: ${unsupportedCarrier}`)
  }
  if (/\b\d+\s*[–-]\s*\d+\s*(?:business\s+)?days\b/i.test(renderedRoot)) {
    throw new Error(`${page.path} contains an unsupported fixed transit-time range`)
  }
}

requireText(vercelConfig, '"source": "/TDE/:trackingNumber(IDB2026\\\\d{4})"', 'TADI tracking route rewrite')
requireText(vercelConfig, '"source": "/VAE/:trackingNumber(\\\\d{7})"', 'Viet An tracking route rewrite')
requireText(vercelConfig, '"destination": "/index.html"', 'Tracking route destination')
if (vercelConfig.includes('/track/:trackingNumber')) throw new Error('Legacy tracking route must not be configured')
if (vercelConfig.includes('"redirects"')) throw new Error('Tracking site must not configure redirects')

const notFoundHtml = await readFile(resolve(dist, '404.html'), 'utf8')
requireText(notFoundHtml, 'content="noindex, nofollow"', 'Static 404 noindex')
if (notFoundHtml.includes('rel="canonical"')) throw new Error('Static 404 must not declare a canonical URL')
if (notFoundHtml.includes('property="og:url"')) throw new Error('Static 404 must not declare an Open Graph URL')

for (const forbidden of ['demo123', 'nhanvien@viexpress.vn', 'doitac@viexpress.vn', '19008095', 'international-express-undated-v1']) {
  if (javascript.includes(forbidden)) throw new Error(`Production bundle contains forbidden demo or unverified contact data: ${forbidden}`)
}
if (javascript.includes('Vietnam fulfillment operations')) throw new Error('Production bundle contains a stock-photo caption that implies VI LOGIX operations')
requireText(javascript, 'Track your shipment.', 'Lean tracking homepage')
requireText(javascript, 'TDE/:trackingNumber', 'TADI tracking page route')
requireText(javascript, 'VAE/:trackingNumber', 'Viet An tracking page route')
requireText(javascript, 'IDB2026', 'Configured TADI tracking pattern')
requireText(javascript, 'https://track.tadiexpress.com/', 'Embedded tracking source origin')
requireText(javascript, 'https://vietanexpress.com.vn/TrackingResult.aspx', 'Embedded Viet An source origin')
if (javascript.includes('Simone Ku')) throw new Error('Production bundle exposes consignee identity')
if (javascript.includes('+84 94 346 6897')) throw new Error('Production bundle contains the formatted WhatsApp number as display text')

console.log('Private-site smoke checks passed.')
