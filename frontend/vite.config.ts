import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules')) {
    //         return id.toString().split('node_modules/')[1].split('/')[0].toString()
    //       }
    //     }
    //   }
    // }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // target: 'http://172.20.0.3:8080',
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        cookiePathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
