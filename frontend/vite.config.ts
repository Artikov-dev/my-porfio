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
  build: {
    // three.js chunk (lazy-loaded) is ~1MB raw; that's expected
    chunkSizeWarningLimit: 1200,
    // No manualChunks: broad `id.includes('react')` matching pulled recharts into the
    // initial bundle. Automatic splitting keeps heavy libs in their lazy route chunks.
  },
})


