import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En produccion el bundle se sirve detras de nginx y /api se proxifica al server.
// En desarrollo el dev server de Vite hace el proxy a localhost:3000 (o al
// contenedor "server" cuando se levanta con docker compose dev).
const apiProxyTarget = process.env.VITE_API_PROXY ?? 'http://localhost:3000'
const apiUrl = process.env.VITE_API_URL ?? '/api'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
})
