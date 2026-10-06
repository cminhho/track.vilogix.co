import { mkdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve(process.cwd(), 'public')
const robots = 'User-agent: *\nDisallow: /\n'

await mkdir(outputDirectory, { recursive: true })
await Promise.all([
  writeFile(resolve(outputDirectory, 'robots.txt'), robots),
  rm(resolve(outputDirectory, 'sitemap.xml'), { force: true }),
  rm(resolve(outputDirectory, 'llms.txt'), { force: true }),
])
