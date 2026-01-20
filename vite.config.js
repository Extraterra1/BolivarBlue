import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['apple-touch-icon.png', 'icon-maskable-192x192.png', 'icon-maskable-512x512.png'],
      manifest: {
        name: 'BolivarBlue',
        short_name: 'BolivarBlue',
        description: 'Real-time exchange rates for the Venezuelan Bolívar',
        theme_color: '#0066FF',
        background_color: '#001a33',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/bcv-api\.rafnixg\.dev\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'bcv-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/p2p\.binance\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'binance-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api/bcv': {
        target: 'https://bcv-api.rafnixg.dev',
        changeOrigin: true,
        rewrite: () => '/rates/'
      },
      '/api/binance': {
        target: 'https://p2p.binance.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/binance/, '/bapi/c2c/v2/friendly/c2c/adv/search')
      }
    }
  }
});
