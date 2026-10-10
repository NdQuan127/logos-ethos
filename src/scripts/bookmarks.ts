const storageKey = 'logos-ethos-bookmarks';

export function readBookmarks(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function writeBookmarks(slugs: string[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(slugs));
  } catch {}
}

export function toggleBookmark(slug: string): boolean {
  const current = readBookmarks();
  const saved = current.includes(slug);
  writeBookmarks(saved ? current.filter((item) => item !== slug) : [...current, slug]);
  return !saved;
}
