import {fileURLToPath,URL} from "node:url";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'pdfjs',
              test: /node_modules[\\/]pdfjs-dist/,
              priority: 20
            },
            {
              name: 'codemirror',
              test: /node_modules[\\/](@codemirror|codemirror)/,
              priority: 20
            },
            {
              name: 'lucide',
              test: /node_modules[\\/]lucide-vue-next/,
              priority: 20
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10
            }
          ]
        }
      }
    }
  }
})

