import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // Optimize for better performance
    minify: 'esbuild', // Use esbuild instead of terser for faster builds
  },
  server: {
    port: 3000,
  },
  // Add SEO-friendly HTML generation
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
