import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      // Exclude Node-only modules
      external: [
        'aws-sdk',
        'mock-aws-s3',
        'nock',
      ]
    },
    // Ignore .html files if found
    loader: {
      '.html': 'ignore'
    }
  }
})
