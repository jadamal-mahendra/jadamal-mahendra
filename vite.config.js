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
    }
  }
})
