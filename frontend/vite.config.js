import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // для Render
  server: {
    proxy: {
      '/api': {
        target: 'https://dtcch-2025-openaml.onrender.com', // твой бэкенд URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
