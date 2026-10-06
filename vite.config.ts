import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const excludeDemoPortal = (): Plugin => ({
  name: 'exclude-demo-portal',
  enforce: 'pre',
  resolveId(source, importer) {
    if (source === './DemoPortalEntry' && importer?.endsWith('/src/App.tsx')) {
      return '\0demo-portal-disabled'
    }
  },
  load(id) {
    if (id === '\0demo-portal-disabled') {
      return 'export default function DemoPortalEntry() { return null }'
    }
  },
})

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '.', '')
  const shouldExcludeDemoPortal = command === 'build' && env.VITE_ENABLE_DEMO_PORTAL !== 'true'

  return {
    plugins: [
      shouldExcludeDemoPortal && excludeDemoPortal(),
      react(),
      tailwindcss(),
    ],
  }
})
