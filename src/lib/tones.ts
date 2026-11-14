/** The four category hues; each is a colour token in global.css (`--blue`, …). */
export const TONES = ['blue', 'green', 'violet', 'red'] as const;
export type CategoryTone = (typeof TONES)[number];
