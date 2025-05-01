import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  optimizeDeps: {
    exclude: [
      'aws-sdk', 
      'nock', 
      'mock-aws-s3', 
      '@mapbox/node-pre-gyp',
      'bcrypt', 
      'jsonwebtoken',
      'mongoose',
    ],
  },
  build: {
    rollupOptions: {
      external: [
        'aws-sdk', 
        'nock', 
        'mock-aws-s3', 
        '@mapbox/node-pre-gyp',
        'bcrypt', 
        'jsonwebtoken',
        'mongoose',
      ],
    },
  },
});
