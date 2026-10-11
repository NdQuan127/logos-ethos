/** Category tones; each maps to `--cat-<tone>`, `--tab-<tone>` and a cover motif. */
export const TONES = ['blue', 'green', 'violet', 'red'] as const;
export type Tone = (typeof TONES)[number];

/**
 * The line drawing on a generated cover:
 * compass circles (mathematics), a fully connected two-layer network (machine learning),
 * concentric rings (philosophy), a columned portico (politics).
 */
export type CoverMotif = 'compass' | 'network' | 'rings' | 'portico';

const MOTIFS: Record<Tone, CoverMotif> = {
  blue: 'compass',
  green: 'network',
  violet: 'rings',
  red: 'portico',
};

export interface CoverArt {
  motif: CoverMotif;
  /** The filled circle, in the 400×400 viewBox the motifs are drawn in. */
  circle: { cx: number; cy: number; r: number };
}

/** FNV-1a: a stable 32-bit hash of the seed string. */
function hash(text: string): number {
  let h = 2166136261;
  for (const char of text) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** mulberry32: a small seeded generator returning numbers in [0, 1). */
function random(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Shape parameters for one cover. The same key always yields the same cover. */
export function coverArt(key: string, tone: Tone): CoverArt {
  const next = random(hash(key));
  const jitter = (range: number) => Math.round((next() - 0.5) * range);
  return {
    motif: MOTIFS[tone],
    circle: { cx: 270 + jitter(30), cy: 120 + jitter(30), r: 46 + jitter(10) },
  };
}
