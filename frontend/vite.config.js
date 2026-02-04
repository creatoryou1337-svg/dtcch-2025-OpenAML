import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // обязательно для Render и GitHub Pages
  server: {
    proxy: {
      '/api': {
        target: 'https://dtcch-2025-openaml.onrender.com',  // твой бэкенд URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
