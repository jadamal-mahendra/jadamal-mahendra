import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      react(),
      nodePolyfills(),
    ],
    server: {
      port: env.VITE_PORT || 3001, // use env variable or default to 3001
      open: true, // automatically open the browser
      strictPort: false, // if port is in use, find another
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        },
        plugins: [
          {
            name: 'node-globals-polyfill',
            setup(build) {
              build.onResolve({ filter: /_stream_duplex/ }, args => ({ path: require.resolve('readable-stream/duplex') }))
              build.onResolve({ filter: /_stream_passthrough/ }, args => ({ path: require.resolve('readable-stream/passthrough') }))
              build.onResolve({ filter: /_stream_readable/ }, args => ({ path: require.resolve('readable-stream/readable') }))
              build.onResolve({ filter: /_stream_writable/ }, args => ({ path: require.resolve('readable-stream/writable') }))
              build.onResolve({ filter: /_stream_transform/ }, args => ({ path: require.resolve('readable-stream/transform') }))
              build.onResolve({ filter: /^stream$/ }, args => ({ path: require.resolve('readable-stream') }))
              build.onResolve({ filter: /^util$/ }, args => ({ path: require.resolve('util') }))
              build.onResolve({ filter: /^buffer$/ }, args => ({ path: require.resolve('buffer/') }))
            },
          },
        ]
      }
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
