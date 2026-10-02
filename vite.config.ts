import react from '@vitejs/plugin-react'
import {defineConfig, loadEnv} from 'vite'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  // The backend is a separate app now (meme-api), so in development Vite
  // forwards /api to it. That keeps every browser request same-origin, which
  // means CORS never enters the picture locally and the setup matches the
  // relative-path default used in production.
  const env = loadEnv(mode, '.', 'VITE_')

  return {
    // Sub-path deploys need this. GitHub Pages serves a project site from
    // /<repo>/, so without it every asset reference resolves to /assets/... and
    // the page loads with no JS or CSS. Leave it '/' on root hosts (Vercel,
    // Netlify, Cloudflare Pages) — the default, so nothing changes there.
    base: env.VITE_BASE_PATH || '/',

    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
  }
})