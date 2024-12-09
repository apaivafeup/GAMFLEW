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
  base: '',
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})