/**
 * BlogPost — shared type for MDX-sourced blog articles.
 * The canonical data source is `content/blog/*.mdx` — parsed by `lib/mdx.ts`.
 * This file exists only to export the shared type; no hardcoded post data.
 */
export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;         // Raw MDX source string
  image: string;           // Cover image URL (from frontmatter)

  date: string;            // Formatted display date, e.g. "24 Tháng 2, 2026"
  isoDate?: string;        // ISO 8601 (YYYY-MM-DD) — for sorting, <time dateTime>, OG dates

  readingTime: number;     // Estimated reading time in minutes (Vietnamese ~200 wpm)
}
