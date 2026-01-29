import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sap': {
        target: 'http://AZKTLDS5CP.kcloud.com:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
