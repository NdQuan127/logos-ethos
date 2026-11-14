import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, isoDate, readingTime } from './format';
import { routes } from './routes';
import { slugify } from './slug';

import type { CategoryTone } from './tones';

export type { CategoryTone };

export interface CategoryView {
  id: string;
  name: string;
  description: string;
  tone: CategoryTone;
  href: string;
}

export interface TagView {
  name: string;
  slug: string;
  href: string;
}

export interface PostView {
  slug: string;
  href: string;
  title: string;
  description: string;
  date: Date;
  dateLabel: string;
  isoDate: string;
  updated?: Date;
  updatedLabel?: string;
  updatedIsoDate?: string;
  category: CategoryView;
  tags: TagView[];
  draft: boolean;
  cover?: ImageMetadata;
  coverAlt?: string;
  toc: boolean;
  sources: CollectionEntry<'blog'>['data']['sources'];
  readingTime: number;
  entry: CollectionEntry<'blog'>;
}

export interface Summary<T> {
  item: T;
  count: number;
}

function toCategoryView(entry: CollectionEntry<'categories'>): CategoryView {
  const { id, data } = entry;
  return { id, name: data.name, description: data.description, tone: data.tone, href: routes.category(id) };
}

export function toTagView(name: string): TagView {
  const slug = slugify(name);
  return { name, slug, href: routes.tag(slug) };
}

/** Collections are loaded once per production build and reused by every page. */
let cache: Promise<PostView[]> | undefined;

async function loadPosts(): Promise<PostView[]> {
  const [entries, categoryEntries] = await Promise.all([
    getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft),
    getCollection('categories'),
  ]);
  const categories = new Map(categoryEntries.map((entry) => [entry.id, toCategoryView(entry)]));

  return entries
    .map((entry): PostView => {
      const { data } = entry;
      const category = categories.get(data.category.id);
      if (!category) throw new Error(`[${entry.id}] Unknown category "${data.category.id}"`);

      return {
        slug: entry.id,
        href: routes.post(entry.id),
        title: data.title,
        description: data.description,
        date: data.date,
        dateLabel: formatDate(data.date),
        isoDate: isoDate(data.date),
        updated: data.updated,
        updatedLabel: data.updated && formatDate(data.updated),
        updatedIsoDate: data.updated && isoDate(data.updated),
        category,
        tags: data.tags.map(toTagView),
        draft: data.draft,
        cover: data.cover,
        coverAlt: data.coverAlt,
        toc: data.toc,
        sources: data.sources,
        readingTime: readingTime(entry.body ?? ''),
        entry,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title, 'vi'));
}

/** All published posts, newest first. Drafts are included only in `astro dev`. */
export function getPosts(): Promise<PostView[]> {
  // The dev server must pick up content edits, so only memoise in builds.
  if (import.meta.env.DEV) return loadPosts();
  cache ??= loadPosts();
  return cache;
}

/** Categories that have at least one post, most used first. */
export function summarizeCategories(posts: PostView[]): Summary<CategoryView>[] {
  return summarize(
    posts.map((post) => post.category),
    (category) => category.id,
    (category) => category.name,
  );
}

/** Tags that have at least one post, most used first. */
export function summarizeTags(posts: PostView[]): Summary<TagView>[] {
  return summarize(
    posts.flatMap((post) => post.tags),
    (tag) => tag.slug,
    (tag) => tag.name,
  );
}

/** Each distinct item once with its number of occurrences, most frequent first, then by label. */
function summarize<T>(items: T[], key: (item: T) => string, label: (item: T) => string): Summary<T>[] {
  const counts = new Map<string, Summary<T>>();
  for (const item of items) {
    const current = counts.get(key(item));
    counts.set(key(item), { item: current?.item ?? item, count: (current?.count ?? 0) + 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || label(a.item).localeCompare(label(b.item), 'vi'));
}

/** The posts written just after and just before `current`, by date. */
export function getNeighbours(posts: PostView[], current: PostView): { newer?: PostView; older?: PostView } {
  const index = posts.findIndex((post) => post.slug === current.slug);
  if (index < 0) return {};
  return { newer: posts[index - 1], older: posts[index + 1] };
}
