import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { rehypeBlocks } from './src/lib/rehype-blocks.ts';
import { remarkDisplayMath } from './src/lib/remark-display-math.ts';

/** Flags posts that contain math, so ArticleLayout loads the KaTeX stylesheet only where needed. */
function remarkHasMath() {
  const hasMath = (node) => node.type === 'math' || node.type === 'inlineMath' || node.children?.some(hasMath);
  return (tree, file) => {
    file.data.astro.frontmatter.hasMath = hasMath(tree);
  };
}

const site = process.env.SITE_URL ?? 'https://logos-ethos.netlify.app';

export default defineConfig({
  site,
  trailingSlash: 'always',
  // Astro 7 defaults to 'jsx', which drops whitespace between inline elements
  // written on separate lines. Keep the HTML-aware behaviour the templates rely on.
  compressHTML: true,
  // The list of every post moved to the home page.
  redirects: { '/blog': '/' },
  image: {
    // Markdown images get a srcset sized to the reading column instead of shipping
    // the original width (the HSRS figures are 5560px wide).
    layout: 'constrained',
    responsiveStyles: false,
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    // Sätteri (the Astro 7 default) has no first-party math support yet, so
    // keep the remark/rehype pipeline for KaTeX. MDX inherits this processor.
    processor: unified({
      remarkPlugins: [remarkMath, remarkDisplayMath, remarkHasMath],
      rehypePlugins: [rehypeKatex, rehypeSlug, rehypeBlocks],
      remarkRehype: {
        footnoteLabel: 'Chú thích',
        footnoteBackLabel: (index) => `Quay lại chỗ tham chiếu ${index + 1}`,
      },
    }),
    // Both themes are emitted as CSS variables; prose.css picks one per theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-default' },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Imported lazily (tooltips, the palette); pre-bundle them at start-up so the
    // dev server does not re-optimise mid-session and break the dynamic import.
    optimizeDeps: {
      include: ['@floating-ui/dom', 'react', 'react/jsx-runtime', 'react-dom/client', 'cmdk', '@radix-ui/react-dialog'],
    },
    build: {
      rollupOptions: {
        // cmdk and Radix mark their modules "use client" for React Server
        // Components; it means nothing in a browser bundle.
        onwarn(warning, warn) {
          if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning);
        },
      },
    },
  },
});
