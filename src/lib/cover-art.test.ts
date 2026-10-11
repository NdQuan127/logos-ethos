import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { coverArt, type Tone } from './cover-art';

const categories: { id: string; tone: Tone }[] = parse(
  fs.readFileSync(new URL('../content/taxonomy/categories.yaml', import.meta.url), 'utf8'),
);

describe('coverArt', () => {
  it('returns the same cover for the same key', () => {
    expect(coverArt('dinh-ly-godel', 'blue')).toEqual(coverArt('dinh-ly-godel', 'blue'));
  });

  it('places the circle differently for different keys', () => {
    const circles = ['dinh-ly-godel', 'cogito-ergo-sum', 'nhap-mon-logic', 'a'].map(
      (key) => coverArt(key, 'blue').circle,
    );
    expect(new Set(circles.map((circle) => JSON.stringify(circle))).size).toBe(circles.length);
  });

  it('keeps the circle near the top right of the 400×400 drawing', () => {
    for (const key of ['x', 'y', 'z', 'dinh-ly-godel']) {
      const { cx, cy, r } = coverArt(key, 'red').circle;
      expect(cx).toBeGreaterThanOrEqual(255);
      expect(cx).toBeLessThanOrEqual(285);
      expect(cy).toBeGreaterThanOrEqual(105);
      expect(cy).toBeLessThanOrEqual(135);
      expect(r).toBeGreaterThanOrEqual(41);
      expect(r).toBeLessThanOrEqual(51);
    }
  });

  it('draws each category with its own motif', () => {
    const motifs = Object.fromEntries(categories.map(({ id, tone }) => [id, coverArt(id, tone).motif]));
    expect(motifs).toEqual({
      'toan-hoc': 'compass',
      'ai-hoc-may': 'network',
      'triet-hoc': 'rings',
      'chinh-tri': 'portico',
    });
  });
});
