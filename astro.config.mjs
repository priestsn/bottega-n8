// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      // permette l'accesso via tunnel/cloudflare e domini esterni in preview
      allowedHosts: true,
    },
  },
  prefetch: true,
});