import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/predict': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/api/scamshield': {
        target: 'http://74.225.145.225:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scamshield/, '')
      }
    }
  }
})
