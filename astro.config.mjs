import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://schatten007.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
