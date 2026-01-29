import { defineConfig } from 'vite'

export default defineConfig({
    root: 'webapp',
    server: {
        port: 5173,
        proxy: {
            '/sap': {
                target: 'http://AZKTLDS5CP.kcloud.com:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
