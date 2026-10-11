import { describe, expect, it } from 'vitest';
import {
  getRelatedPosts,
  getSeriesPosts,
  pickFeatured,
  summarizeCategories,
  summarizeTags,
  toTagView,
  type CategoryView,
  type PostView,
} from './content';

const category = (id: string): CategoryView => ({
  id,
  name: id,
  description: '',
  color: 'var(--cat-blue)',
  symbol: '∀',
  href: `/blog/chu-de/${id}/`,
});

function post(slug: string, options: Partial<PostView> & { day?: number; tagNames?: string[] } = {}): PostView {
  const { day = 1, tagNames = [], ...rest } = options;
  return {
    slug,
    href: `/blog/${slug}/`,
    title: slug,
    description: '',
    date: new Date(Date.UTC(2024, 0, day)),
    dateLabel: '',
    isoDate: '',
    category: category('logic-hoc'),
    tags: tagNames.map(toTagView),
    featured: false,
    draft: false,
    toc: true,
    sources: [],
    readingTime: 1,
    entry: undefined as never,
    ...rest,
  };
}

const series = (order: number) => ({ id: 'bat-toan', title: '', description: '', href: '', order });

describe('getRelatedPosts', () => {
  it('ranks same series, then category, then shared tags, and skips the current post', () => {
    const current = post('current', { series: series(1), tagNames: ['Gödel'] });
    const sameSeries = post('same-series', { category: category('triet-hoc'), series: series(2) });
    const sameCategory = post('same-category');
    const twoTags = post('two-tags', { category: category('triet-hoc'), tagNames: ['Gödel', 'x'] });
    const unrelated = post('unrelated', { category: category('triet-hoc'), day: 9 });

    const related = getRelatedPosts([unrelated, twoTags, sameCategory, sameSeries, current], current, 4);

    expect(related.map((p) => p.slug)).toEqual(['same-series', 'same-category', 'two-tags', 'unrelated']);
  });

  it('breaks ties by newest first and honours the limit', () => {
    const current = post('current');
    const older = post('older', { day: 2 });
    const newer = post('newer', { day: 5 });

    expect(getRelatedPosts([older, newer, current], current, 1).map((p) => p.slug)).toEqual(['newer']);
  });
});

describe('getSeriesPosts', () => {
  it('returns only that series, in reading order', () => {
    const second = post('second', { series: series(2) });
    const first = post('first', { series: series(1) });
    const other = post('other');

    expect(getSeriesPosts([second, other, first], 'bat-toan').map((p) => p.slug)).toEqual(['first', 'second']);
  });
});

describe('pickFeatured', () => {
  it('prefers a featured post, else the first one', () => {
    const a = post('a');
    const b = post('b', { featured: true });
    expect(pickFeatured([a, b])).toBe(b);
    expect(pickFeatured([a])).toBe(a);
    expect(pickFeatured([])).toBeUndefined();
  });
});

describe('summaries', () => {
  it('counts categories, most used first', () => {
    const posts = [post('a'), post('b', { category: category('triet-hoc') }), post('c')];
    expect(summarizeCategories(posts).map(({ item, count }) => [item.id, count])).toEqual([
      ['logic-hoc', 2],
      ['triet-hoc', 1],
    ]);
  });

  it('merges tags by slug and sorts ties alphabetically in Vietnamese', () => {
    const posts = [post('a', { tagNames: ['Đạo đức', 'Ác'] }), post('b', { tagNames: ['Ác'] })];
    expect(summarizeTags(posts).map(({ item, count }) => [item.slug, count])).toEqual([
      ['ac', 2],
      ['dao-duc', 1],
    ]);
  });
});
