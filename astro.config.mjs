import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkAnnotations from './src/plugins/remark-annotations.mjs';
// https://astro.build/config
export default defineConfig({
  site: 'https://thbrdy.dev',
  markdown: {
    remarkPlugins: [remarkAnnotations],
  },
  integrations: [react(), mdx()]
});