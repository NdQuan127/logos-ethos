import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';

const site = process.env.SITE_URL ?? 'https://logos-ethos.netlify.app';

export default defineConfig({
  site,
  trailingSlash: 'always',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  // written on separate lines. Keep the HTML-aware behaviour the templates rely on.
  compressHTML: true,
  integrations: [mdx(), sitemap()],
  markdown: {
    // Sätteri (the Astro 7 default) has no first-party math support yet, so
    // keep the remark/rehype pipeline for KaTeX. MDX inherits this processor.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeSlug],
      remarkRehype: {
        footnoteLabel: 'Chú thích',
        footnoteBackLabel: (index) => `Quay lại chỗ tham chiếu ${index + 1}`,
      },
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
