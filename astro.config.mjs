// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Pubblicato su GitHub Pages come progetto: vive in /bottega-n8/
  site: 'https://priestsn.github.io',
  base: '/bottega-n8',

  server: {
    // permette l'accesso via tunnel/cloudflare e domini esterni in preview
    host: true,
    allowedHosts: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
