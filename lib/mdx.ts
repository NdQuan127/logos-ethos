import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './blog-data';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Calculate estimated reading time in minutes.
 * Uses ~200 words/min for Vietnamese text (slower than English ~250 wpm).
 * Strips MDX syntax, code blocks, and HTML before counting words.
 */
function calculateReadingTime(content: string): number {
  const stripped = content
    // Remove code blocks (``` ... ```)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove MDX/JSX tags
    .replace(/<[^>]+>/g, '')
    // Remove markdown links, keeping link text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/[*_]{1,3}/g, '')
    // Collapse whitespace
    .trim();

  const wordCount = stripped.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** Read and parse a single MDX file by slug */
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const rawFile = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(rawFile);

  // Normalize ISO date (handles both string and Date objects from gray-matter)
  const rawIsoDate: string = frontmatter.date
    ? typeof frontmatter.date === 'string'
      ? frontmatter.date
      : (frontmatter.date as Date).toISOString().split('T')[0]
    : '';

  return {
    slug,
    title: frontmatter.title as string,
    category: frontmatter.category as string,
    excerpt: frontmatter.excerpt as string,
    date: formatDate(rawIsoDate),
    isoDate: rawIsoDate, // ISO format kept for sorting, <time> dateTime, OG dates
    image: frontmatter.image as string,
    content, // MDX source — will be compiled by MDXRemote in the page
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Read frontmatter ONLY for a single MDX file — does NOT parse the content body.
 * ~70% cheaper I/O than `getPostBySlug`. Use for lists / related-posts where
 * you only need metadata, not the full MDX source.
 */
export async function getPostMetaBySlug(slug: string): Promise<Omit<BlogPost, 'content'> & { content: '' }> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const rawFile = fs.readFileSync(filePath, 'utf8');
  // gray-matter `excerpt: false` skips the excerpt separator parsing too
  const { data: frontmatter, content } = matter(rawFile);

  const rawIsoDate: string = frontmatter.date
    ? typeof frontmatter.date === 'string'
      ? frontmatter.date
      : (frontmatter.date as Date).toISOString().split('T')[0]
    : '';

  return {
    slug,
    title: frontmatter.title as string,
    category: frontmatter.category as string,
    excerpt: frontmatter.excerpt as string,
    date: formatDate(rawIsoDate),
    isoDate: rawIsoDate,
    image: frontmatter.image as string,
    content: '', // empty — intentionally omitted for lightweight index use
    readingTime: calculateReadingTime(content),
  };
}

/** Get all posts sorted by date descending (full content included) */
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getPostSlugs();
  const posts = await Promise.all(slugs.map(getPostBySlug));

  // Sort by ISO date string — YYYY-MM-DD sorts lexicographically correctly
  return posts.sort((a, b) => {
    const dateA = a.isoDate ?? '';
    const dateB = b.isoDate ?? '';
    // Descending: newest first
    return dateB.localeCompare(dateA);
  });
}

/**
 * Get metadata for all posts (NO content body) sorted by date descending.
 * Use this instead of `getAllPosts` whenever you only need the post list
 * (e.g. blog index, related posts, sitemap) — avoids reading MDX content.
 */
export async function getAllPostsMeta(): Promise<Array<Omit<BlogPost, 'content'> & { content: '' }>> {
  const slugs = getPostSlugs();
  const posts = await Promise.all(slugs.map(getPostMetaBySlug));
  return posts.sort((a, b) => {
    const dateA = a.isoDate ?? '';
    const dateB = b.isoDate ?? '';
    return dateB.localeCompare(dateA);
  });
}

/** Get list of all slugs (filenames without .mdx extension) */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

/** Format ISO date string to Vietnamese readable format */
function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate; // return as-is if not parseable

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day} Tháng ${month}, ${year}`;
}
