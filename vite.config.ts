import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** Serves /api/embed-height in `npm run dev` the same way Vercel does in production. */
function devApi(): Plugin {
  return {
    name: 'dev-api-embed-height',
    configureServer(server) {
      server.middlewares.use('/api/embed-height', async (req, res) => {
        try {
          const { default: handler } = await server.ssrLoadModule('/api/embed-height.ts')
          const requestUrl = (req as { url?: string }).url ?? ''
          const query = Object.fromEntries(
            (requestUrl.split('?')[1] ?? '')
              .split('&')
              .filter(Boolean)
              .map((part) => {
                const [key, value = ''] = part.split('=')
                return [decodeURIComponent(key), decodeURIComponent(value.replace(/\+/g, ' '))]
              }),
          )
          const reply = {
            status(code: number) { res.statusCode = code; return reply },
            setHeader(name: string, value: string) { res.setHeader(name, value) },
            json(body: unknown) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)) },
          }
          await handler({ query }, reply)
        } catch {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end('{"ok":false}')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devApi(),
  ],
})
