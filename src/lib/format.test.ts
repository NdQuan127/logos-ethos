import { describe, expect, it } from 'vitest';
import { formatDate, isoDate, readingTime } from './format';

describe('formatDate', () => {
  it('writes Vietnamese month labels', () => {
    expect(formatDate(new Date('2024-01-10'))).toBe('10 Tháng 1, 2024');
  });

  it('uses the UTC day, not the local one', () => {
    expect(formatDate(new Date('2024-12-31T23:30:00Z'))).toBe('31 Tháng 12, 2024');
  });
});

describe('isoDate', () => {
  it('keeps only the date part', () => {
    expect(isoDate(new Date('2024-03-05T10:00:00Z'))).toBe('2024-03-05');
  });
});

describe('readingTime', () => {
  const words = (count: number) => Array.from({ length: count }, () => 'chữ').join(' ');

  it('rounds up at 200 words per minute', () => {
    expect(readingTime(words(200))).toBe(1);
    expect(readingTime(words(201))).toBe(2);
  });

  it('is at least one minute', () => {
    expect(readingTime('')).toBe(1);
  });

  it('ignores imports, code blocks, display math and tags', () => {
    const noise = [
      "import Foo from './foo.astro';",
      '```ts\n' + words(500) + '\n```',
      '$$\n' + words(500) + '\n$$',
      '<Theorem title="x">',
    ].join('\n');
    expect(readingTime(noise + '\n' + words(150))).toBe(1);
  });

  it('counts link text but not the URL', () => {
    expect(readingTime(`[${words(3)}](/blog/a-very-long-url/)`)).toBe(1);
  });
});
