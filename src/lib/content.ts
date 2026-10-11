import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, isoDate, readingTime } from './format';
import { routes } from './routes';
import { slugify } from './slug';

export interface CategoryView {
  id: string;
  name: string;
  description: string;
  /** CSS colour (theme-aware custom property) safe for text on every surface. */
  color: string;
  symbol: string;
  href: string;
}

export interface TagView {
  name: string;
  slug: string;
  href: string;
}

export interface SeriesView {
  id: string;
  title: string;
  description: string;
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
  series?: SeriesView & { order: number };
  featured: boolean;
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
  return {
    id,
    name: data.name,
    description: data.description,
    color: `var(--cat-${data.color})`,
    symbol: data.symbol,
    href: routes.category(id),
  };
}

function toSeriesView(entry: CollectionEntry<'series'>): SeriesView {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    href: routes.series(entry.id),
  };
}

export function toTagView(name: string): TagView {
  const slug = slugify(name);
  return { name, slug, href: routes.tag(slug) };
}

/** Collections are loaded once per production build and reused by every page. */
let cache: Promise<PostView[]> | undefined;

async function loadPosts(): Promise<PostView[]> {
  const [entries, categoryEntries, seriesEntries] = await Promise.all([
    getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft),
    getCollection('categories'),
    getCollection('series'),
  ]);
  const categories = new Map(categoryEntries.map((entry) => [entry.id, toCategoryView(entry)]));
  const series = new Map(seriesEntries.map((entry) => [entry.id, toSeriesView(entry)]));

  return entries
    .map((entry): PostView => {
      const { data } = entry;
      const category = categories.get(data.category.id);
      if (!category) throw new Error(`[${entry.id}] Unknown category "${data.category.id}"`);
      const postSeries = data.series ? series.get(data.series.id) : undefined;
      if (data.series && !postSeries) throw new Error(`[${entry.id}] Unknown series "${data.series.id}"`);

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
        series: postSeries && { ...postSeries, order: data.seriesOrder ?? 0 },
        featured: data.featured,
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

/** The newest post marked `featured`, or the newest post when none is. */
export function pickFeatured(posts: PostView[]): PostView | undefined {
  return posts.find((post) => post.featured) ?? posts[0];
}

/** Categories that have at least one post, most used first. */
export function summarizeCategories(posts: PostView[]): Summary<CategoryView>[] {
  return summarize(posts.map((post) => [post.category.id, post.category]));
}

/** Tags that have at least one post, most used first. */
export function summarizeTags(posts: PostView[]): Summary<TagView>[] {
  return summarize(posts.flatMap((post) => post.tags.map((tag) => [tag.slug, tag] as const)));
}

function summarize<T extends { name?: string; title?: string }>(pairs: (readonly [string, T])[]): Summary<T>[] {
  const counts = new Map<string, Summary<T>>();
  for (const [key, item] of pairs) {
    const current = counts.get(key);
    counts.set(key, { item: current?.item ?? item, count: (current?.count ?? 0) + 1 });
  }
  const label = (item: T) => item.name ?? item.title ?? '';
  return [...counts.values()].sort((a, b) => b.count - a.count || label(a.item).localeCompare(label(b.item), 'vi'));
}

/** Posts of one series in reading order. */
export function getSeriesPosts(posts: PostView[], seriesId: string): PostView[] {
  return posts
    .filter((post) => post.series?.id === seriesId)
    .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}

export async function getAllSeries(): Promise<SeriesView[]> {
  return (await getCollection('series')).map(toSeriesView);
}

/**
 * Related posts ranked by what they share with the current one:
 * same series > shared tags > same category, then newest first.
 */
export function getRelatedPosts(posts: PostView[], current: PostView, limit = 3): PostView[] {
  const tags = new Set(current.tags.map((tag) => tag.slug));

  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      let score = 0;
      if (current.series && post.series?.id === current.series.id) score += 5;
      if (post.category.id === current.category.id) score += 3;
      score += post.tags.filter((tag) => tags.has(tag.slug)).length * 2;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score || b.post.date.getTime() - a.post.date.getTime())
    .slice(0, limit)
    .map(({ post }) => post);
}
