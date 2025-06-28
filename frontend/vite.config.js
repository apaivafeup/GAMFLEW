import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import get from 'lodash/get'

// https://vitejs.dev/config/


export default defineConfig({
  plugins: [
    vue({
      template: {
        plugins: {
        },
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag == 'LoadingIcon' // (return true)
          }
        },
        build: {
          rollupOptions: {
            output: {
              manualChunks: {
                'vue': ['vue'],
                'vue-router': ['vue-router'],
                'lodash': ['lodash']
              }
            }
          }
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',  // Docker service name
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: '',
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})