import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path' // Import path module

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  const API_PORT = env.API_PORT || 3002; // Get API port for proxy

  return {
    plugins: [
      tsconfigPaths(),
      react()
    ],
    resolve: { // Add resolve section
      alias: {
        '@': path.resolve(__dirname, './src'), // Define @ alias
      },
    },
    server: {
      port: parseInt(env.VITE_PORT || '3001', 10), // Parse port to number
      open: true, // automatically open the browser
      strictPort: false, // if port is in use, find another
      // Add proxy configuration
      proxy: {
        // string shorthand: /api -> http://localhost:3002/api
        '/api': {
          target: `http://localhost:${API_PORT}`,
          changeOrigin: true, // needed for virtual hosted sites
          secure: false,      // if using http
          // Optional: rewrite path if backend doesn't expect /api prefix
          // rewrite: (path) => path.replace(/^\/api/, '') 
        }
      }
    },

    build:{
      minify: 'esbuild',
      rollupOptions:{
        output:{
          manualChunks:{
            react: ['react', 'react-dom'],
            'react-router': ['react-router-dom'],
            'react-icons': ['react-icons'],
            // 'react-scroll-parallax': ['react-scroll-parallax'],
            // 'react-helmet-async': ['react-helmet-async'],
            // 'react-modal': ['react-modal'],
            // 'react-pdf': ['react-pdf'],
            
          }
        }
      }
    }
  }
})
