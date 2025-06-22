import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Proxy API calls to backend during development
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios']
        }
      }
    }
  },

  // Preview server configuration
  preview: {
    host: '0.0.0.0',
    port: 4173
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
}) 