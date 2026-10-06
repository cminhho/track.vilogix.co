import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PUBLIC_PAGES } from './public-pages.mjs'

const outputDirectory = resolve(process.cwd(), 'public')
const siteUrl = (process.env.VITE_PUBLIC_SITE_URL || 'https://track.vilogx.co').replace(/\/$/, '')
const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_TARGET_ENV === 'preview'

const robots = isPreview
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

const sitemapEntries = PUBLIC_PAGES
  .map(({ path }) => `  <url><loc>${siteUrl}${path === '/' ? '/' : path}</loc></url>`)
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`

const llmsLinks = PUBLIC_PAGES
  .map(({ path, title, description }) => `- [${title}](${siteUrl}${path === '/' ? '/' : path}): ${description}`)
  .join('\n')

const llms = `# VI LOGIX Shipment Tracking

> Public shipment status lookup for VI LOGIX orders.

Use a VI LOGIX tracking number to view the current status, estimated delivery, route progress, customs checkpoint and shipment activity. Public results exclude recipient contact details, addresses and shipment charges.

## Public pages

${llmsLinks}

## Discovery

- [Sitemap](${siteUrl}/sitemap.xml)
- [Robots](${siteUrl}/robots.txt)
`

await mkdir(outputDirectory, { recursive: true })
await Promise.all([
  writeFile(resolve(outputDirectory, 'robots.txt'), robots),
  writeFile(resolve(outputDirectory, 'sitemap.xml'), sitemap),
  writeFile(resolve(outputDirectory, 'llms.txt'), llms),
])
