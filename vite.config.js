import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
