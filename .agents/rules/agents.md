---
trigger: always_on
---

# CLAUDE.md

This file provides guidance to AI when working with code in this repository.

## Project Overview

"Logos & Ethos" is a Vietnamese-language blog about the intersection of Mathematics and Philosophy. Built with Next.js 15 (App Router), React 19, Tailwind CSS v4, and Motion (Framer Motion successor). Originally scaffolded from Google AI Studio.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- `npm run clean` — Clear Next.js cache


## Architecture

- **app/page.tsx** — Main landing page (client component). Renders nav, featured post, recent posts grid, and footer. All blog data comes from `lib/blog-data.ts`.
- **app/blog/[slug]/page.tsx** — Dynamic blog post detail page.
- **app/layout.tsx** — Root layout. Loads three Google Fonts (Source Serif 4, DM Sans, IBM Plex Mono) as CSS variables (`--font-serif`, `--font-sans`, `--font-mono`). HTML lang is `vi`.
- **lib/blog-data.ts** — Static blog post data (no CMS/API). `BlogPost` interface with slug, title, category, excerpt, content, image, author, date.
- **components/ThemeToggle.tsx** — Dark/light theme toggle.
- **hooks/use-mobile.ts** — Mobile breakpoint detection hook.

## Key Technical Details

- Tailwind v4 uses `@tailwindcss/postcss` plugin (not the classic `tailwindcss` PostCSS plugin). Config is in `postcss.config.mjs` and `app/globals.css`, not `tailwind.config.js`.
- CSS custom properties (`--border-color`, `--background`, `--foreground`, etc.) drive theming in `globals.css`.
- `motion` package (not `framer-motion`) is used for animations and is listed in `transpilePackages` in `next.config.ts`.
- Images use `picsum.photos` placeholder service (allowed in `next.config.ts` remote patterns).
- Build output is `standalone` mode for containerized deployment.
- ESLint ignores errors during builds (`ignoreDuringBuilds: true`).
