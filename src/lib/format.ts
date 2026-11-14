const pad = (n: number) => String(n).padStart(2, '0');

/** "10.01.2024", set in the mono face. Uses UTC so the label never shifts with the build machine's timezone. */
export function formatDate(date: Date): string {
  return `${pad(date.getUTCDate())}.${pad(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`;
}

/** "10 tháng 1, 2024", for screen readers and prose where digits alone read poorly. */
export function formatLongDate(date: Date): string {
  return `${date.getUTCDate()} tháng ${date.getUTCMonth() + 1}, ${date.getUTCFullYear()}`;
}

const counts = new Intl.NumberFormat('vi');

/** "1.284": Vietnamese groups thousands with a dot. */
export function formatCount(count: number): string {
  return counts.format(count);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const WORDS_PER_MINUTE = 200;

export function readingTime(source: string): number {
  const prose = source
    .replace(/^import .*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}/g, '')
    .trim();

  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
