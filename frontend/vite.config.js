import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import get from 'lodash/get'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine if we're running locally
  const isLocal = env.LOCAL === 'true' || env.LOCAL === 'True'
  
  // Select the appropriate API link
  const apiTarget = isLocal ? env.VITE_API_LINK_LOCAL : env.VITE_API_LINK_REMOTE

  return {
    plugins: [
      vue({
        template: {
          plugins: {},
          compilerOptions: {
            isCustomElement: (tag) => {
              return tag == 'LoadingIcon'
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
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
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
    },
    base: '',
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    }
  }
})