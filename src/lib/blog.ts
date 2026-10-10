import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { categorySlug } from './category-utils';

export interface BlogPostView {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  isoDate: string;
  image?: string;
  readingTime: number;
  body: string;
  entry: CollectionEntry<'blog'>;
}

export function calculateReadingTime(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}/g, '')
    .trim();

  const wordCount = stripped.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function formatVietnameseDate(date: Date): string {
  return `${date.getDate()} Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

function toViewModel(entry: CollectionEntry<'blog'>): BlogPostView {
  const isoDate = entry.data.date.toISOString().slice(0, 10);

  return {
    slug: entry.id.replace(/\.mdx$/, ''),
    title: entry.data.title,
    category: entry.data.category,
    excerpt: entry.data.excerpt,
    date: formatVietnameseDate(entry.data.date),
    isoDate,
    image: entry.data.image,
    readingTime: calculateReadingTime(entry.body ?? ''),
    body: entry.body ?? '',
    entry,
  };
}

export async function getAllPosts(): Promise<BlogPostView[]> {
  const posts = await getCollection('blog');
  return posts
    .map(toViewModel)
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

export interface CategorySummary {
  name: string;
  slug: string;
  count: number;
}

export function summarizeCategories(posts: BlogPostView[]): CategorySummary[] {
  const counts = new Map<string, number>();
  for (const post of posts) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: categorySlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'vi'));
}

export async function getPostSummaries(): Promise<BlogPostView[]> {
  return getAllPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPostView | undefined> {
  const entry = await getEntry('blog', slug);
  return entry ? toViewModel(entry) : undefined;
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3,
): Promise<BlogPostView[]> {
  const posts = await getPostSummaries();

  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({ post, score: post.category === category ? 3 : 0 }))
    .sort((a, b) => b.score - a.score || b.post.isoDate.localeCompare(a.post.isoDate))
    .slice(0, limit)
    .map(({ post }) => post);
}
