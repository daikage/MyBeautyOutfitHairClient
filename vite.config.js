import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React app talks to the Express API through these dev proxies, so the
// browser always sees one origin (no CORS surprises) during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});