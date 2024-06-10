import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '_redirects',
          dest: '.',
        },
      ],
    }),
  ],
  server: {
    proxy: {
      '/agc': {
        target: process.env.VITE_VICI,
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/agc/, '') // Ajuste de la ruta
      },
    },
  },
});
