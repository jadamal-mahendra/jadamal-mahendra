import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT || 3001, // use env variable or default to 3001
      open: true, // automatically open the browser
      strictPort: false, // if port is in use, find another
    },
    // build:{
    //   minify: 'esbuild',
    //   rollupOptions:{
    //     output:{
    //       manualChunks:{
    //         react: ['react', 'react-dom'],
    //         'react-icons': ['react-icons'],
    //         'react-scroll-parallax': ['react-scroll-parallax'],
    //         'react-helmet-async': ['react-helmet-async'],
    //         'react-modal': ['react-modal'],
    //         'react-pdf': ['react-pdf'],
            
    //       }
    //     }
    //   }
    // }
  }
})
