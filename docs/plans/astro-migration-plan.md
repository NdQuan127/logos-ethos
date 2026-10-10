# Plan: Migrate Logos & Ethos From Next Static Export To Astro
> Created: 2026-05-25

## Overview
This plan migrates Logos & Ethos from a Next.js static-export site to an Astro static site while preserving the existing public routes, Vietnamese editorial design, MDX articles, SEO metadata, and deploy behaviour. The migration uses Astro content collections for blog data, `.astro` components for static UI, and small client scripts only for interactions that need browser APIs. The scope includes deleting Next-era code and generated output after Astro reaches route and build parity. The scope excludes redesign, CMS work, and rewriting article substance.

## Design Principles
- Public URL parity is non-negotiable: `/`, `/about/`, `/blog/`, `/blog/[slug]/`, `/robots.txt`, `/sitemap.xml`, canonical URLs, and trailing slash behaviour must match the current static export.
- Static HTML is the default: Astro components render the layout, article cards, article pages, and MDX chrome; browser JavaScript is allowed only for menu, theme, reading progress, table of contents, share, bookmark, code copy, and scroll animation.
- Content metadata has one source of truth: blog frontmatter is validated through Astro content collections; no custom `gray-matter` parser remains after cleanup.
- Legacy deletion is gated by evidence: Next files, dependencies, and build output are removed only after Astro build, route file checks, and visual smoke checks pass.
- Product migration stays separate from agent tooling churn: `.agents/`, `.antigravitycli/`, `.codex/`, and `prototypes/` are not staged or cleaned in this plan unless the user explicitly widens scope.

## Scope
### Must Have
- Replace Next app routes with Astro routes under `src/pages/`.
- Move blog MDX into an Astro content collection with a typed schema.
- Preserve existing article frontmatter fields: `title`, `category`, `excerpt`, `date`, `image`.
- Preserve math rendering through `remark-math` and `rehype-katex`.
- Preserve MDX custom presentation: heading IDs, callouts, pull quotes, sidenotes, code blocks, related posts, and article footer actions.
- Preserve dark mode, mobile navigation, reading progress, table of contents, share, bookmark, and scroll animations with targeted browser scripts.
- Update package scripts, TypeScript config, lint/check commands, Netlify publish directory, and asset cache headers for Astro.
- Delete Next-specific code, configs, dependencies, generated outputs, and README claims after Astro parity is proven.
- Provide repeatable verification commands for build, static route output, dependency cleanup, and local preview.

### Must NOT Have
- Do not redesign the site or introduce a new visual direction.
- Do not add a CMS, database, search index, comments, analytics, auth, newsletter, or server runtime.
- Do not rewrite article content beyond frontmatter/path changes needed for Astro.
- Do not preserve a permanent Next fallback app after the Astro site reaches parity.
- Do not stage unrelated `.agents/` or prototype changes during the product migration.

## Decisions
| Decision | Rationale | Considered & Rejected |
|---|---|---|
| Use a full Astro replacement instead of a hybrid Next/Astro setup | The site is a content publication with static pages and narrow browser interactions; a hybrid keeps two routing systems and weakens cleanup value. | Keep Next for pages and embed Astro islands (rejected: Astro is not designed as a child router inside Next); run Astro in a subdirectory (rejected: duplicates deployment and SEO config). |
| Move `content/blog/*.mdx` to `src/content/blog/*.mdx` | Astro conventions place source pages and content under `src/`; this keeps collection config, page routes, and imports inside one source tree. | Keep root `content/blog` with a custom loader base (rejected: works, but keeps pre-migration structure and makes source ownership less obvious). |
| Use Astro content collections with `glob()` and Zod schema | Build-time validation catches missing frontmatter before deploy and replaces `lib/mdx.ts` plus `gray-matter`. | Keep manual parsing with `gray-matter` (rejected: duplicates Astro’s content API); use MDX files as direct pages (rejected: harder to build listing, related posts, reading time, and schema validation). |
| Convert static TSX components to `.astro` components | Components such as article cards, hero, footer, grid lines, and layout do not need React runtime. | Keep `@astrojs/react` permanently (rejected: ships React for UI that can be static); rewrite everything as raw HTML in pages (rejected: makes reuse and review harder). |
| Use targeted vanilla scripts for current interactions | The current interactions are DOM/browser API work with small state; they do not require React hooks once the page is static. | Keep React islands for `Navbar`, `ThemeToggle`, `TOC`, `BookmarkButton`, and `ShareButton` (rejected: React becomes the main client dependency); remove interactions (rejected: feature regression). |
| Use `rehype-slug` for heading IDs | Astro/MDX can add stable heading anchors during render, which removes the per-render React heading factory in `app/blog/[slug]/page.tsx`. | Keep heading ID generation in MDX component overrides (rejected: harder in Astro and duplicates a standard rehype responsibility). |
| Use `lucide-astro` for icons | It keeps the current Lucide visual language without pulling `lucide-react` and React types into the final app. | Inline every icon manually (rejected: more maintenance); keep `lucide-react` (rejected: conflicts with the no global React goal). |
| Use Astro’s default static output to `dist/` and set `trailingSlash: "always"` | Current deploy uses static output and trailing slash paths; Astro can emit the same route shape. | Keep publishing `out/` (rejected: this is a Next convention and makes cleanup ambiguous); remove trailing slashes (rejected: route and canonical drift). |
| Keep Netlify as the canonical deploy target unless a tracked Firebase config exists | The repo contains `netlify.toml`, `SITE_URL` defaults to a Netlify URL, and no `firebase.json` was found in the baseline scan. | Keep `firebase-tools` because README mentions Firebase (rejected until a tracked Firebase deploy config appears); introduce another host (rejected: outside migration scope). |

---

## Phase 0: Baseline And Worktree Guard

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Current framework:** Next.js App Router with `output: "export"` in `next.config.ts`.
> - **Current content:** Three MDX files in `content/blog/`.
> - **Current generated output:** `out/` exists and current build reports about 114-117 kB First Load JS for main routes.
> - **Current deploy file:** `netlify.toml` publishes `out/`.
> - **Known repo noise:** `README.md` is modified; prior full `git status` showed `.agents/` churn unrelated to product migration.
> - **Pattern/convention to follow:** Do not stage unrelated user or tool changes.

### Step 0.1: Capture Current Build Baseline — `out/`, `.next/`, `package.json`
- **Why:** The migration needs a concrete before/after comparison; current Next already static-exports successfully, so performance claims must be measured against build output rather than assumed.
- **What:** Run `npm run build`, capture the route table, run `du -sh out .next node_modules`, and record the largest JS/CSS/HTML outputs with `/usr/bin/find out -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -printf '%s %p\n' | sort -nr | head -40`.
- **Gotcha:** `out/` and `.next/` are generated and ignored; do not stage them.
- **Accept:** The baseline note records: build exit code `0`, the route list, First Load JS for `/`, `/blog`, `/blog/[slug]`, and directory sizes for `out`, `.next`, and `node_modules`.

### Step 0.2: Freeze The Migration Boundary — `git status`
- **Why:** The repo has unrelated agent/tooling changes; migration commits need a clean product diff so rollback and review remain intelligible.
- **What:** Run `git status --short`, then record a product-only scope: `package.json`, `package-lock.json`, `tsconfig.json`, `netlify.toml`, `README.md`, `app/`, `components/`, `content/`, `lib/`, `public/`, and new `src/` or `docs/` files.
- **Gotcha:** `.agents/`, `.antigravitycli/`, `.codex/`, and `prototypes/` are outside product migration in this plan.
- **Accept:** A reviewer can run `git diff --stat -- package.json package-lock.json tsconfig.json netlify.toml README.md app components content lib public src docs` and see only product migration files.

### Files
| Action | Path | Notes |
|---|---|---|
| Read | `package.json` | Capture Next dependencies and scripts. |
| Read | `next.config.ts` | Capture static export and trailing slash behaviour. |
| Read | `netlify.toml` | Capture current publish directory and `_next` cache headers. |
| Read | `content/blog/*.mdx` | Capture current article inventory and frontmatter fields. |

---

## Phase 1: Astro Scaffold Beside Next

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Current app still runs on Next:** `npm run build` creates `out/`.
> - **No Astro files exist yet:** create `astro.config.mjs`, `src/`, and Astro scripts without deleting Next files.
> - **Current CSS:** `app/globals.css` and `app/fonts.css` contain design tokens and fontsource imports.
> - **Current dependency mode:** npm with `package-lock.json`.
> - **Pattern/convention to follow:** Keep temporary Next scripts during scaffold so parity can be checked.

### Step 1.1: Add Astro Dependencies And Transitional Scripts — `package.json`
- **Why:** A transitional script set lets the implementer compare Next and Astro outputs in the same branch before deleting legacy code.
- **What:** Install `astro`, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/check`, `@tailwindcss/vite`, `lucide-astro`, `rehype-slug`, and `katex`. Keep existing Next dependencies for this phase. Change scripts to include `dev:next`, `build:next`, `dev`, `build`, `preview`, `check`, and `lint`.
- **Gotcha:** `package-lock.json` changes substantially; review it for package-manager drift and accidental registry changes.
- **Accept:** `npm run build:next` still exits `0`, and `npm exec astro -- --version` prints an Astro version.
- **Rollback:** Restore package files with `git restore package.json package-lock.json`.

### Step 1.2: Add Astro Config — `astro.config.mjs`
- **Why:** Routing, trailing slash output, integrations, Markdown plugins, and sitemap site URL need a single Astro-owned configuration.
- **What:** Create `astro.config.mjs` with `site: process.env.SITE_URL ?? 'https://logos-ethos.netlify.app'`, `trailingSlash: 'always'`, integrations `[mdx(), sitemap()]`, Vite Tailwind plugin, and Markdown config for `remark-math`, `rehype-katex`, and `rehype-slug`.
- **Accept:** `npm run build` reaches Astro config loading and does not fail on missing integration imports.
- **Rollback:** Delete `astro.config.mjs` and restore package files from Step 1.1.

### Step 1.3: Create Astro Source Shell — `src/`
- **Why:** Astro expects routes, layouts, components, styles, scripts, and content config under `src/`; creating the shell first gives later phases stable paths.
- **What:** Create `src/env.d.ts`, `src/pages/`, `src/layouts/`, `src/components/`, `src/components/mdx/`, `src/lib/`, `src/styles/`, and `src/scripts/`. Copy `app/globals.css` to `src/styles/global.css` and `app/fonts.css` to `src/styles/fonts.css` without changing selectors yet.
- **Accept:** `src/styles/global.css` contains the existing design tokens, and `src/styles/fonts.css` imports the same fontsource packages.
- **Rollback:** Remove the new `src/` tree and keep existing `app/` untouched.

### Step 1.4: Update TypeScript For Astro — `tsconfig.json`
- **Why:** Astro generates types under `.astro/` and uses Vite-style imports; the old Next TypeScript plugin becomes legacy after scaffold.
- **What:** Update `tsconfig.json` to include `src/**/*.astro`, `src/**/*.ts`, `src/**/*.tsx`, and `.astro/types.d.ts`. Keep strict mode. Keep path alias `@/*` but remap it to `./src/*` once imports move to `src/`.
- **Gotcha:** Remapping `@/*` before moving imports can break Next files. Use relative imports in new Astro files during transition or delay alias remap until Phase 7.
- **Accept:** `npm run check` runs Astro type checking and reports only expected missing page/content files during scaffold, not config parse errors.
- **Rollback:** Restore `tsconfig.json` with `git restore tsconfig.json`.

### Files
| Action | Path | Notes |
|---|---|---|
| Modify | `package.json` | Add Astro scripts and dependencies while retaining Next scripts. |
| Modify | `package-lock.json` | npm dependency lock update. |
| Create | `astro.config.mjs` | Astro integrations, Markdown plugins, site URL, trailing slash. |
| Create | `src/env.d.ts` | Astro type reference. |
| Create | `src/styles/global.css` | Copied from `app/globals.css`. |
| Create | `src/styles/fonts.css` | Copied from `app/fonts.css`. |
| Modify | `tsconfig.json` | Astro type coverage. |

---

## Phase 2: Content Collection And Blog Data Layer

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Astro scaffold exists:** `astro.config.mjs`, `src/`, and Astro scripts exist.
> - **Next source still exists:** `app/`, `components/`, `content/`, and `lib/` remain available for reference.
> - **Existing content fields:** `title`, `category`, `excerpt`, `date`, `image`.
> - **Current helper behaviour:** `lib/mdx.ts` sorts by ISO date descending and computes Vietnamese reading time at 200 words per minute.
> - **Pattern/convention to follow:** Replace manual parsing with collection APIs; keep rendered dates as Vietnamese strings.

### Step 2.1: Move MDX Into Astro Content — `src/content/blog/`
- **Why:** Astro content collections work best when content lives under `src/content`; this makes the content tree part of the Astro source graph.
- **What:** Move `content/blog/cogito-ergo-sum.mdx`, `content/blog/dinh-ly-godel.mdx`, and `content/blog/van-de-cua-toi-voi-agentic-engineering.mdx` to `src/content/blog/` with the same filenames and frontmatter.
- **Accept:** `/usr/bin/find src/content/blog -maxdepth 1 -name '*.mdx' | wc -l` prints `3`.
- **Rollback:** Move the files back to `content/blog/` and remove empty `src/content/blog/`.

### Step 2.2: Define The Blog Collection — `src/content.config.ts`
- **Why:** The schema replaces runtime frontmatter assumptions with build-time validation, which is the main content-maintenance gain of Astro.
- **What:** Create `src/content.config.ts` with `defineCollection`, `glob({ pattern: '**/*.mdx', base: './src/content/blog' })`, and a Zod schema for `title`, `category`, `excerpt`, `date: z.coerce.date()`, and `image`.
- **Accept:** `npm run check` fails if any blog entry is missing one of the required fields and passes collection schema validation for the three current entries.
- **Rollback:** Delete `src/content.config.ts` and move content back in Step 2.1.

### Step 2.3: Port Blog Helpers — `src/lib/blog.ts`
- **Why:** Pages need sorted post lists, formatted dates, reading time, and related-post scoring without importing old Next-era `lib/mdx.ts`.
- **What:** Create helpers: `getAllPosts()`, `getPostBySlug(slug)`, `getPostSummaries()`, `getRelatedPosts(currentSlug, category, limit)`, `formatVietnameseDate(date)`, and `calculateReadingTime(body)`. Use collection entries as inputs and expose a view model with `slug`, `title`, `category`, `excerpt`, `date`, `isoDate`, `image`, and `readingTime`.
- **Gotcha:** `CollectionEntry<'blog'>` exposes `body` and `data` differently from raw `gray-matter`; use Astro’s entry shape rather than reading files from disk.
- **Accept:** A temporary `src/pages/debug-posts.astro` or a one-off `npm run check` assertion confirms the helper returns `3` posts sorted newest-first by `isoDate`.
- **Rollback:** Delete `src/lib/blog.ts`; no public route depends on it until Phase 3.

### Step 2.4: Remove Root Content Only After Routes Compile — `content/blog/`
- **Why:** Deleting the old content directory too early makes it harder to compare the new collection output against the old Next output.
- **What:** Keep root `content/blog/` until the blog index and article route build in Phase 4. Delete it in Phase 7 after route parity passes.
- **Accept:** At the end of this phase, either the files exist in both places for comparison or the move is tracked cleanly as `R content/blog/*.mdx -> src/content/blog/*.mdx`.

### Files
| Action | Path | Notes |
|---|---|---|
| Move | `content/blog/*.mdx` to `src/content/blog/*.mdx` | Preserve filenames and frontmatter. |
| Create | `src/content.config.ts` | Collection loader and schema. |
| Create | `src/lib/blog.ts` | Sorting, date formatting, reading time, related posts. |

---

## Phase 3: Static Layout And Shared UI

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Astro content helpers exist:** `src/lib/blog.ts` exposes sorted posts and summaries.
> - **CSS exists under Astro:** `src/styles/global.css` and `src/styles/fonts.css` are copied from Next.
> - **Current design source:** Next components in `components/` and pages in `app/`.
> - **Interaction policy:** Static UI becomes `.astro`; browser-only behaviour moves to scripts in Phase 5.
> - **Pattern/convention to follow:** Preserve class names and CSS custom properties unless a class references Next-only behaviour.

### Step 3.1: Build Base Layout — `src/layouts/BaseLayout.astro`
- **Why:** Next metadata and layout APIs need an Astro equivalent before any page can own title, description, canonical, Open Graph, theme colour, fonts, and KaTeX CSS.
- **What:** Create `BaseLayout.astro` accepting `title`, `description`, `canonicalPath`, `image`, `type`, and optional JSON-LD. Import `src/styles/fonts.css`, `src/styles/global.css`, and `katex/dist/katex.min.css`. Add the preconnect/dns-prefetch links for `https://picsum.photos` while current frontmatter still uses remote images.
- **Accept:** A temporary page using `BaseLayout` outputs `<html lang="vi">`, the two `theme-color` tags, a canonical link, and font CSS in the built HTML.
- **Rollback:** Delete `src/layouts/BaseLayout.astro`.

### Step 3.2: Port Static Chrome Components — `src/components/`
- **Why:** Navbar shell, footer, grid lines, hero, featured section, article cards, quote section, and about content are reusable static presentation; Astro can render them without a React runtime.
- **What:** Convert `GridLines`, `Footer`, `HeroSection`, `FeaturedSection`, `ArticleCard`, `QuoteSection`, and the static part of `Navbar` into `.astro` components. Replace `next/link` with `<a>`, `next/image` with `<img>` for remote image parity, and `lucide-react` icons with `lucide-astro`.
- **Gotcha:** Astro components use `<slot />` instead of React `children`; props must be declared from `Astro.props`.
- **Accept:** `npm run build` emits HTML for a temporary index page that includes the brand, nav links, hero, one featured post, article cards, and footer without `_next` references.
- **Rollback:** Delete the new static component files; Next components remain in `components/`.

### Step 3.3: Port Main Routes — `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/blog/index.astro`
- **Why:** These routes establish static page parity before the complex article route and MDX rendering enter the migration.
- **What:** Create homepage using `getAllPosts()` with the newest post as featured, `/about/` from `app/about/page.tsx`, and `/blog/` from `app/blog/page.tsx`. Preserve headings, Vietnamese copy, class names, and accessible labels.
- **Accept:** `npm run build` emits `dist/index.html`, `dist/about/index.html`, and `dist/blog/index.html`. `grep -R "_next" dist/index.html dist/about/index.html dist/blog/index.html` returns no matches.
- **Rollback:** Delete the three Astro page files and keep Next routes.

### Step 3.4: Port Error Pages — `src/pages/404.astro`
- **Why:** Next `not-found.tsx` and `error.tsx` do not run in Astro; static hosting still needs a branded 404 page.
- **What:** Create `src/pages/404.astro` based on `app/not-found.tsx`, using `BaseLayout`, static links, and existing visual classes.
- **Accept:** `npm run build` emits `dist/404.html` or `dist/404/index.html` according to Astro output, and the page contains a link back to `/`.
- **Rollback:** Delete `src/pages/404.astro`.

### Files
| Action | Path | Notes |
|---|---|---|
| Create | `src/layouts/BaseLayout.astro` | Global HTML shell and metadata. |
| Create | `src/components/*.astro` | Static presentation components. |
| Create | `src/pages/index.astro` | Homepage. |
| Create | `src/pages/about.astro` | About page. |
| Create | `src/pages/blog/index.astro` | Blog listing. |
| Create | `src/pages/404.astro` | Static not found page. |

---

## Phase 4: Article Route, MDX Rendering, And Article Chrome

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Base layout and static components exist:** pages can render static chrome without React.
> - **Blog collection exists:** `src/content/blog/*.mdx` is validated by `src/content.config.ts`.
> - **Article reference implementation:** `app/blog/[slug]/page.tsx` contains metadata, JSON-LD, heading overrides, related posts, image block, TOC, reading progress, share, and bookmark.
> - **Markdown plugins configured:** `remark-math`, `rehype-katex`, and `rehype-slug` are in `astro.config.mjs`.
> - **Pattern/convention to follow:** Preserve visible article layout and move browser behaviour to Phase 5.

### Step 4.1: Create Dynamic Article Route — `src/pages/blog/[slug].astro`
- **Why:** The article route is the core migration risk: it combines static paths, MDX rendering, SEO, JSON-LD, related posts, and article-specific layout.
- **What:** Use `getStaticPaths()` to return every blog slug. Use `getEntry()` and `render()` from `astro:content` to render MDX content. Build article metadata from frontmatter and helper-derived reading time. Use `BaseLayout` for page metadata and inject Article JSON-LD.
- **Gotcha:** Astro `params.slug` must match collection entry IDs. Confirm filenames remain slug-safe and do not include nested paths.
- **Accept:** `npm run build` emits `dist/blog/cogito-ergo-sum/index.html`, `dist/blog/dinh-ly-godel/index.html`, and `dist/blog/van-de-cua-toi-voi-agentic-engineering/index.html`.
- **Rollback:** Delete `src/pages/blog/[slug].astro`; previous static routes still build.

### Step 4.2: Port MDX Components — `src/components/mdx/`
- **Why:** Existing article authoring may depend on callouts, pull quotes, sidenotes, and enhanced code blocks even if current posts use a subset of them.
- **What:** Convert `Callout` and `PullQuote` to `.astro`. Convert `Sidenote` to an Astro component with static desktop markup and a mobile button that Phase 5 enhances. Convert `CodeBlock` to static code markup with a copy button hookable by Phase 5.
- **Gotcha:** MDX component names are case-sensitive; exported component names must match any future MDX usage.
- **Accept:** A fixture MDX entry or temporary test article renders `<Callout>`, `<PullQuote>`, `<Sidenote>`, and a fenced code block without a React hydration error.
- **Rollback:** Delete `src/components/mdx/`; the article route can temporarily render plain Markdown elements.

### Step 4.3: Map MDX Components Into Rendering — `src/pages/blog/[slug].astro`
- **Why:** Astro content rendering needs explicit component mapping to replace default tags and custom components in MDX.
- **What:** Pass component overrides to `<Content components={{ ... }}>` for `Callout`, `PullQuote`, `Sidenote`, and code block rendering. Keep paragraph/list/blockquote/link typography either through global article CSS or component overrides.
- **Accept:** Built article HTML contains styled `h2`/`h3` IDs, article body typography classes or scoped CSS, and no raw unrendered JSX component tags.
- **Rollback:** Remove the component map and render `<Content />` with default Markdown.

### Step 4.4: Port Related Posts And Footer Actions Shell — `src/components/RelatedPosts.astro`, article footer
- **Why:** Related posts are static and article footer controls need stable markup before client behaviour attaches.
- **What:** Create `RelatedPosts.astro` using `getRelatedPosts()`. Add footer buttons/links for share and bookmark as static HTML with `data-*` attributes for Phase 5 scripts.
- **Accept:** Each article page contains up to three related post links excluding the current slug, plus static share and bookmark controls with accessible labels.
- **Rollback:** Remove related posts and footer controls from the article route; core article content still builds.

### Files
| Action | Path | Notes |
|---|---|---|
| Create | `src/pages/blog/[slug].astro` | Dynamic article route and metadata. |
| Create | `src/components/mdx/Callout.astro` | Static callout component. |
| Create | `src/components/mdx/PullQuote.astro` | Static quote component. |
| Create | `src/components/mdx/Sidenote.astro` | Static plus mobile-enhanced sidenote. |
| Create | `src/components/mdx/CodeBlock.astro` | Static enhanced code block shell. |
| Create | `src/components/RelatedPosts.astro` | Static related post cards. |

---

## Phase 5: Browser Interaction Without React Runtime

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Static pages and article route build in Astro.**
> - **Markup contains stable selectors:** use `data-nav-toggle`, `data-theme-toggle`, `data-share-button`, `data-bookmark-button`, `data-reading-progress`, `data-toc`, `data-code-copy`, and `data-animate`.
> - **Existing React interaction source:** `Navbar.tsx`, `ThemeToggle.tsx`, `ReadingProgress.tsx`, `TableOfContents.tsx`, `ShareButton.tsx`, `BookmarkButton.tsx`, `AnimateOnScroll.tsx`, `CodeBlock.tsx`, and `Sidenote.tsx`.
> - **Pattern/convention to follow:** Keep scripts small, route-agnostic, and loaded only on pages with matching selectors.

### Step 5.1: Add Theme Boot Script — `src/scripts/theme.ts`, `BaseLayout.astro`
- **Why:** Theme state must apply before paint to avoid a light/dark flash, and this is easier as a document-level script than a hydrated React component.
- **What:** Add an inline head script that reads `localStorage.theme`, falls back to `prefers-color-scheme`, and toggles `document.documentElement.classList`. Add a button script that updates class and storage on click.
- **Accept:** In local preview, setting `localStorage.theme = 'dark'` before reload renders `<html class="dark">` before visible content paints.
- **Rollback:** Remove the script imports and theme button `data-*` attributes.

### Step 5.2: Add Mobile Navigation Script — `src/scripts/nav.ts`
- **Why:** The mobile drawer needs Escape handling, focus return, body scroll lock, and backdrop close, but no cross-component state.
- **What:** Implement a DOM script binding to the nav toggle, drawer, close button, and links. Preserve `aria-expanded`, `aria-hidden`, and body overflow behaviour from the React implementation.
- **Accept:** At `390x844`, clicking menu opens the drawer, Escape closes it, focus returns to the trigger, and `document.body.style.overflow` resets after close.
- **Rollback:** Remove `nav.ts` and leave static desktop navigation.

### Step 5.3: Add Article Utility Scripts — `src/scripts/article.ts`
- **Why:** Reading progress, TOC scrollspy, smooth TOC scrolling, share, bookmark, code copy, and sidenote mobile toggles all operate on article DOM and can share one route-scoped script.
- **What:** Implement modules inside `article.ts`: reading progress using `requestAnimationFrame`, TOC extraction from `article h2,h3`, IntersectionObserver active heading, native share/clipboard fallback, bookmark localStorage under `logos-ethos-bookmarks`, copy-code feedback, and mobile sidenote open/close.
- **Gotcha:** DOM queries must no-op on non-article pages so the script can be imported safely or loaded conditionally by the article route.
- **Accept:** On an article page, reading progress changes on scroll, TOC lists all `h2`/`h3`, share copies or opens native share, bookmark persists after reload, and code copy changes button state for 2 seconds.
- **Rollback:** Remove the article script import and keep static article HTML.

### Step 5.4: Add Scroll Animation Script — `src/scripts/animate-on-scroll.ts`
- **Why:** Existing animations depend on adding `is-visible` via IntersectionObserver; the same behaviour can be kept without a React wrapper component.
- **What:** Replace `AnimateOnScroll` wrappers with static `data-animate` attributes and a script that observes those elements, respects `prefers-reduced-motion`, and adds `is-visible`.
- **Accept:** Elements with `data-animate` receive `is-visible` when scrolled into view, and with reduced motion enabled they render visible without transitions.
- **Rollback:** Remove the script and make all animated elements visible by default.

### Step 5.5: Verify React Is Not Shipped — `dist/`, `package.json`
- **Why:** The migration’s primary optimisation is targeted hydration; shipping React after replacing TSX would erase much of the benefit.
- **What:** Build Astro and inspect output for React/Next markers.
- **Accept:** `grep -R "react-dom\\|__NEXT_DATA__\\|_next" dist` returns no matches, and `npm ls next next-mdx-remote react react-dom lucide-react` reports those packages absent after Phase 7 cleanup.

### Files
| Action | Path | Notes |
|---|---|---|
| Create | `src/scripts/theme.ts` | Theme boot and toggle behaviour. |
| Create | `src/scripts/nav.ts` | Mobile drawer behaviour. |
| Create | `src/scripts/article.ts` | Article page behaviours. |
| Create | `src/scripts/animate-on-scroll.ts` | Scroll reveal behaviour. |
| Modify | `src/layouts/BaseLayout.astro` | Load shared scripts with the correct placement. |
| Modify | `src/pages/blog/[slug].astro` | Load article script only on article pages. |

---

## Phase 6: SEO, Static Output, And Deployment

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Astro routes build:** `/`, `/about/`, `/blog/`, and `/blog/[slug]/` exist in `dist/`.
> - **Base layout owns metadata:** page title, description, canonical, Open Graph, Twitter, and theme colour live in Astro.
> - **Astro config has `site` and `trailingSlash: "always"` set.**
> - **Current deploy config:** `netlify.toml` publishes `out/` and caches `/_next/static/*`.
> - **Pattern/convention to follow:** Static hosting only; no SPA fallback.

### Step 6.1: Recreate Global Metadata — `src/layouts/BaseLayout.astro`, page frontmatter
- **Why:** Next’s metadata API disappears in Astro; SEO output must be explicit in HTML.
- **What:** Add default site title, title template handling, description, keywords, author, Open Graph, Twitter card, canonical link, and `lang="vi"`. Each route passes title and description.
- **Accept:** `grep -R "<title>\\|og:title\\|twitter:card\\|canonical" dist/index.html dist/blog/index.html dist/blog/dinh-ly-godel/index.html` shows expected tags.
- **Rollback:** Revert `BaseLayout.astro` metadata changes.

### Step 6.2: Recreate Article JSON-LD — `src/pages/blog/[slug].astro`
- **Why:** Current article pages expose structured data, and losing it is an SEO regression.
- **What:** Emit Article JSON-LD with headline, description, datePublished, image, URL, publisher, articleSection, and timeRequired.
- **Accept:** `grep -R "application/ld+json" dist/blog/dinh-ly-godel/index.html` finds one Article JSON-LD script with the expected slug URL.
- **Rollback:** Remove the JSON-LD script block from the article route.

### Step 6.3: Recreate Robots And Sitemap — `astro.config.mjs`, `src/pages/robots.txt.ts`
- **Why:** Next route handlers generated `robots.txt` and `sitemap.xml`; Astro needs equivalent static output.
- **What:** Use `@astrojs/sitemap` for sitemap generation and create `src/pages/robots.txt.ts` returning allow-all rules plus sitemap URL.
- **Accept:** `npm run build` emits `dist/sitemap-index.xml` or `dist/sitemap.xml` according to `@astrojs/sitemap` output, and `dist/robots.txt` points to the sitemap under `SITE_URL`.
- **Rollback:** Remove `@astrojs/sitemap` integration and `src/pages/robots.txt.ts`.

### Step 6.4: Update Netlify Config — `netlify.toml`
- **Why:** Astro outputs to `dist/`, and old `_next` cache headers are dead config after migration.
- **What:** Change `[build].publish` to `dist`, keep `command = "npm run build"`, replace `/_next/static/*` headers with `/_astro/*`, and retain image cache headers only for files under `public/images/` if that directory gains assets.
- **Gotcha:** Changing publish directory affects deploy immediately after merge.
- **Accept:** `netlify.toml` has `publish = "dist"` and no `_next` header blocks.
- **Rollback:** Restore `netlify.toml` to publish `out/` if Astro deploy validation fails.

### Step 6.5: Add Static Route Verification Script — `scripts/verify-static-output.mjs`
- **Why:** A small route check catches missing output files before deploy without requiring a browser.
- **What:** Create a script that asserts `dist/index.html`, `dist/about/index.html`, `dist/blog/index.html`, each article `index.html`, `dist/robots.txt`, and sitemap output exist, and that no built HTML references `/_next/`.
- **Accept:** `node scripts/verify-static-output.mjs` exits `0` after `npm run build`.
- **Rollback:** Delete the verification script and remove it from package scripts.

### Files
| Action | Path | Notes |
|---|---|---|
| Modify | `src/layouts/BaseLayout.astro` | Global metadata. |
| Modify | `src/pages/blog/[slug].astro` | Article metadata and JSON-LD. |
| Create | `src/pages/robots.txt.ts` | Static robots output. |
| Modify | `astro.config.mjs` | Sitemap integration and site URL. |
| Modify | `netlify.toml` | Publish `dist`, cache `/_astro/*`. |
| Create | `scripts/verify-static-output.mjs` | Static route verification. |

---

## Phase 7: Legacy Deletion And Repo Cleanup

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Astro build passes:** `npm run build` emits `dist/` with public route parity.
> - **Verification passes:** `node scripts/verify-static-output.mjs` exits `0`.
> - **No React/Next output remains in `dist/`:** `grep -R "_next\\|__NEXT_DATA__" dist` returns no matches.
> - **Current legacy areas:** `app/`, root `components/`, root `lib/`, root `content/`, `next.config.ts`, `next-env.d.ts`, Next dependencies, Next scripts, and README claims.
> - **Pattern/convention to follow:** Delete legacy in focused groups and run verification after each group.

### Step 7.1: Remove Next Source Directories — `app/`, `components/`, `lib/`, `content/`
- **Why:** Keeping duplicate implementations invites future edits in the wrong tree and hides whether Astro is the real source of truth.
- **What:** Delete `app/`, old root `components/`, old root `lib/`, and old root `content/` after confirming their functionality exists under `src/`.
- **Gotcha:** Root `components/` and `lib/` are imported by old Next files; delete them only after old Next routes are removed.
- **Accept:** `/usr/bin/find app components lib content -maxdepth 0 -type d` exits nonzero for all four paths, and `npm run build` still exits `0`.
- **Rollback:** Restore deleted directories with `git restore app components lib content`.

### Step 7.2: Remove Next Config And Type Artifacts — `next.config.ts`, `next-env.d.ts`, `.next/`, `out/`
- **Why:** These files and directories are Next-specific and conflict with Astro as the canonical build system.
- **What:** Delete `next.config.ts` and `next-env.d.ts`. Remove local generated `.next/` and `out/` directories from the workspace, leaving `.gitignore` rules for ignored generated output if desired.
- **Accept:** `/usr/bin/find . -maxdepth 1 \( -name 'next.config.ts' -o -name 'next-env.d.ts' -o -name '.next' -o -name 'out' \) -print` prints nothing.
- **Rollback:** Restore tracked files with `git restore next.config.ts next-env.d.ts`; regenerate outputs with `npm run build:next` only if Next scripts still exist.

### Step 7.3: Remove Next And React Dependencies — `package.json`, `package-lock.json`
- **Why:** Dependency cleanup is the maintenance win: no Next runtime, no `next-mdx-remote`, no React types, no `lucide-react`, and no `gray-matter` parser.
- **What:** Remove `next`, `next-mdx-remote`, `react`, `react-dom`, `lucide-react`, `gray-matter`, `eslint-config-next`, `@types/react`, and `@types/react-dom`. Remove `build:next` and `dev:next` scripts after final parity. Keep `@types/node`, `typescript`, `tailwindcss`, fontsource packages, `remark-math`, `rehype-katex`, `rehype-slug`, `katex`, `astro`, and Astro integrations.
- **Gotcha:** If any Astro file imports JSX or React types after this step, `npm run check` fails; that is a useful cleanup signal.
- **Accept:** `npm run build`, `npm run check`, and `npm run lint` exit `0`; `npm ls next next-mdx-remote react react-dom lucide-react gray-matter` reports missing packages.
- **Rollback:** Restore `package.json` and `package-lock.json` from before this step.

### Step 7.4: Update README And Project Metadata — `README.md`, `metadata.json`
- **Why:** The README currently describes Next, React, `next-mdx-remote`, Firebase hosting, and an article inventory that does not match the live files; migration is incomplete if docs point contributors to deleted paths.
- **What:** Rewrite stack badges and Tech Stack to Astro, TypeScript, Tailwind CSS 4, MDX, content collections, and Netlify. Update project tree to `src/pages`, `src/layouts`, `src/components`, `src/content/blog`, and `src/lib`. Update run commands to `npm run dev`, `npm run build`, `npm run preview`, `npm run check`, and `npm run lint`. Remove stale Firebase wording unless a tracked Firebase config is added.
- **Gotcha:** `README.md` is already modified in the working tree; inspect the current diff before editing and preserve user-authored changes unrelated to framework docs.
- **Accept:** `rg -n "Next|next-mdx-remote|App Router|Firebase|out/|next/image" README.md metadata.json package.json netlify.toml` returns no stale claims except historical notes explicitly marked as removed.
- **Rollback:** Restore README and metadata with `git restore README.md metadata.json` if the edit overwrites user content.

### Step 7.5: Fix Agent Instruction Pointer If Tracked — `AGENTS.md`, `RTK.md`
- **Why:** The session instruction references `@RTK.md`, but the baseline scan found no `RTK.md`; leaving a missing instruction pointer is repository hygiene debt.
- **What:** If `AGENTS.md` exists or is tracked, either create a concise `RTK.md` with the repo-specific build/test/deploy commands or update `AGENTS.md` to reference an existing instruction file. If neither file is tracked in the repo, record this as an environment-level issue and do not add product docs for it.
- **Accept:** `/usr/bin/find . -maxdepth 1 \( -name 'AGENTS.md' -o -name 'RTK.md' \) -print` shows either both tracked files with a valid reference, or neither file in the product diff.
- **Rollback:** Restore `AGENTS.md` and remove `RTK.md` if the user wants agent instructions handled separately.

### Files
| Action | Path | Notes |
|---|---|---|
| Delete | `app/` | Next App Router source. |
| Delete | `components/` | Old React components after Astro equivalents exist. |
| Delete | `lib/` | Old `gray-matter` and Next helpers. |
| Delete | `content/` | Old content location after move. |
| Delete | `next.config.ts` | Next static export config. |
| Delete | `next-env.d.ts` | Next type artifact. |
| Modify | `package.json` | Remove Next/React dependencies and transitional scripts. |
| Modify | `package-lock.json` | Lockfile cleanup. |
| Modify | `README.md` | Astro docs and accurate tree. |
| Maybe create | `RTK.md` | Only if repo instruction pointer is tracked and intended. |

---

## Phase 8: Final Verification And Release Readiness

### Context Brief
> **You don't need to read previous phases.** Here's everything you need:
> - **Astro is the only framework:** package dependencies no longer include Next or React.
> - **Build output directory:** `dist/`.
> - **Verification script exists:** `scripts/verify-static-output.mjs`.
> - **Deploy config:** `netlify.toml` publishes `dist/`.
> - **Public route target:** `/`, `/about/`, `/blog/`, all three article routes, `/robots.txt`, and sitemap.

### Step 8.1: Run Full Local Checks — package scripts
- **Why:** Cleanup can pass build while leaving type, lint, or route-output regressions; final readiness needs all checks in one place.
- **What:** Run `npm run check`, `npm run lint`, `npm run build`, and `node scripts/verify-static-output.mjs`.
- **Accept:** All four commands exit `0`.

### Step 8.2: Inspect Built Output For Legacy Markers — `dist/`
- **Why:** The final artifact must not carry Next runtime or dead `_next` paths.
- **What:** Run `grep -R "_next\\|__NEXT_DATA__\\|next/image\\|next-mdx-remote" dist package.json README.md netlify.toml`.
- **Accept:** The command returns no matches.

### Step 8.3: Preview Route Smoke Test — local Astro preview
- **Why:** Static file presence does not catch broken nav, images, dark mode, article scripts, or mobile layout.
- **What:** Run `npm run preview -- --host 127.0.0.1`. Open `/`, `/about/`, `/blog/`, `/blog/dinh-ly-godel/`, `/robots.txt`, and sitemap output. Check desktop and mobile viewport basics.
- **Accept:** Each route returns HTTP 200; mobile nav opens and closes; dark mode persists after reload; article TOC and reading progress update on scroll; share/bookmark buttons respond; images render with non-empty `alt`.
- **Rollback:** Keep the branch unmerged and return to the failed phase indicated by the smoke test.

### Step 8.4: Compare Output Size And JS Budget — `dist/`
- **Why:** The migration is an optimisation project; final signoff needs evidence that the new app ships less client framework code than the Next baseline.
- **What:** Run `du -sh dist`, list JS assets with `/usr/bin/find dist -type f -name '*.js' -printf '%s %p\n' | sort -nr`, and compare against baseline First Load JS and `out/_next` size.
- **Accept:** `dist/` contains no Next shared chunks; route-level JS is limited to Astro/client scripts for actual interactions; the comparison note records baseline vs Astro output.

### Step 8.5: Stage Product Migration Only — git
- **Why:** The workspace contains unrelated tool changes; a clean migration commit must exclude them.
- **What:** Stage only product paths: `astro.config.mjs`, `src/`, `scripts/`, `package.json`, `package-lock.json`, `tsconfig.json`, `netlify.toml`, `README.md`, `.gitignore` if changed, and deleted Next product paths.
- **Gotcha:** Do not stage `.agents/`, `.antigravitycli/`, `.codex/`, or `prototypes/`.
- **Accept:** `git diff --cached --stat` contains only product migration paths and no agent tooling paths.
- **Rollback:** Unstage with `git restore --staged <path>` for any unrelated path.

### Files
| Action | Path | Notes |
|---|---|---|
| Verify | `dist/` | Static output route and legacy marker checks. |
| Verify | `package.json` | Final scripts and dependency set. |
| Verify | `netlify.toml` | Deploy output and cache headers. |
| Verify | `README.md` | Contributor instructions match Astro. |

---

## Mutations
| Date | Change | Reason |
|---|---|---|
| 2026-05-25 | Initial plan created | Provide an implementation path for full Astro migration and legacy cleanup. |

## References
- Astro Next.js migration guide: https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/
- Astro Islands architecture: https://docs.astro.build/en/concepts/islands/
- Astro MDX integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
