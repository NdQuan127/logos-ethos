import { describe, expect, it } from 'vitest';
import {
  getNeighbours,
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
  tone: 'blue',
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
    draft: false,
    toc: true,
    sources: [],
    readingTime: 1,
    entry: undefined as never,
    ...rest,
  };
}

describe('getNeighbours', () => {
  it('returns the newer and older post around the current one', () => {
    const [newest, middle, oldest] = [
      post('newest', { day: 9 }),
      post('middle', { day: 5 }),
      post('oldest', { day: 1 }),
    ];
    const posts = [newest, middle, oldest];

    expect(getNeighbours(posts, middle)).toEqual({ newer: newest, older: oldest });
    expect(getNeighbours(posts, newest)).toEqual({ newer: undefined, older: middle });
    expect(getNeighbours(posts, oldest)).toEqual({ newer: middle, older: undefined });
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
