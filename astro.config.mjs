import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';

export default defineConfig({
  site: site.productionUrl || undefined,
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: { build: { assetsInlineLimit: 0 } },
});
