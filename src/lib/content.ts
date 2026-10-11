import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Tone } from './cover-art';
import { formatDate, isoDate, readingTime } from './format';
import { routes } from './routes';
import { slugify } from './slug';

export interface CategoryView {
  id: string;
  name: string;
  description: string;
  tone: Tone;
  /** CSS colour (theme-aware custom property) safe for text on every surface. */
  color: string;
  /** Pale paper behind the category chip and its covers; always carries ink text. */
  tab: string;
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
  /** Cover glyph; when unset, covers use the first post's category symbol. */
  symbol?: string;
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
  /** `order` is the 1-based position among published parts; `total` is their number. */
  series?: SeriesView & { order: number; total: number };
  featured: boolean;
  draft: boolean;
  cover?: ImageMetadata;
  coverAlt?: string;
  /** Show a generated cover on the article when there is no `cover` image. */
  artCover: boolean;
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
    tone: data.tone,
    color: `var(--cat-${data.tone})`,
    tab: `var(--tab-${data.tone})`,
    symbol: data.symbol,
    href: routes.category(id),
  };
}

function toSeriesView(entry: CollectionEntry<'series'>): SeriesView {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    symbol: entry.data.symbol,
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
  // A part's number is its position among the parts loaded here, so an unpublished
  // draft leaves no gap ("phần 3/2") between the parts readers can see.
  const seriesParts = new Map<string, CollectionEntry<'blog'>[]>();
  for (const entry of entries) {
    if (entry.data.series)
      seriesParts.set(entry.data.series.id, [...(seriesParts.get(entry.data.series.id) ?? []), entry]);
  }
  for (const parts of seriesParts.values()) parts.sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));

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
        series: postSeries && {
          ...postSeries,
          order: (seriesParts.get(postSeries.id)?.indexOf(entry) ?? 0) + 1,
          total: seriesParts.get(postSeries.id)?.length ?? 1,
        },
        featured: data.featured,
        draft: data.draft,
        cover: data.cover,
        coverAlt: data.coverAlt,
        artCover: data.artCover,
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

/** Posts of one series in reading order. */
export function getSeriesPosts(posts: PostView[], seriesId: string): PostView[] {
  return posts
    .filter((post) => post.series?.id === seriesId)
    .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}

/** Series that have at least one published post. */
export function getActiveSeries(posts: PostView[]): SeriesView[] {
  const series = new Map(posts.flatMap((post) => (post.series ? [[post.series.id, post.series] as const] : [])));
  return [...series.values()];
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
