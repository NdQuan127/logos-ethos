---
trigger: always_on
---

# Repository Guidelines

## Project Structure & Module Organization
This project is a Next.js App Router site.
- `app/`: route entry points and layouts (`page.tsx`, `layout.tsx`, `blog/[slug]/page.tsx`).
- `components/`: reusable UI components in PascalCase files (for example, `Navbar.tsx`, `ArticleCard.tsx`).
- `lib/`: shared utilities and content loaders (`mdx.ts`, `image-utils.ts`, `constants.ts`).
- `content/blog/`: MDX posts; each filename becomes the post slug.
- Root config: `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `netlify.toml`.

## Build, Test, and Development Commands
Use Node.js 20+ and npm 10+.
- `npm install`: install dependencies.
- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run build`: create a production build.
- `npm run start`: serve the production build locally.
- `npm run lint`: run ESLint checks across the repo.
- `npm run clean`: clear Next.js build cache/artifacts.

## Coding Style & Naming Conventions
- Language: TypeScript/TSX with `strict` mode enabled in `tsconfig.json`.
- Imports: prefer the `@/*` path alias for internal modules.
- Style observed in repo: 2-space indentation and single quotes in TS/TSX files.
- Naming:
  - Components: PascalCase (`HeroSection.tsx`).
  - Utilities/modules: lowercase or kebab-case (`blog-data.ts`).
  - Route folders and content slugs: lowercase (`blog/[slug]`, `dinh-ly-godel.mdx`).
- Run `npm run lint` before opening a PR.

## Testing Guidelines
There is currently no automated test framework configured (no Jest/Vitest scripts).
- Minimum validation before PR:
  - Run `npm run lint`.
  - Manually verify `/`, `/about`, `/blog`, and one `/blog/[slug]` page.
  - If you change `lib/mdx.ts`, verify post ordering and frontmatter parsing.
- If adding tests, use `*.test.ts` or `*.test.tsx` naming and document new commands in `package.json`.

## Commit & Pull Request Guidelines
Git history currently uses short lowercase summaries (for example, `update`, `initial commit`).
- Prefer clearer, scoped, imperative commits going forward, such as:
  - `feat(blog): add MDX frontmatter validation`
  - `fix(layout): correct mobile navbar spacing`
- PRs should include:
  - what changed and why,
  - linked issue (if any),
  - screenshots/GIFs for UI changes,
  - concise manual test steps.
Keep PR scope focused; separate content-only MDX edits from code refactors when possible.
