import { routes } from '../lib/routes';
import { bindOnce } from './bind';
import { readBookmarks } from './bookmarks';

/** The card for one saved post, or undefined if the post no longer exists. */
async function fetchCard(slug: string): Promise<HTMLLIElement | undefined> {
  try {
    const response = await fetch(routes.savedCard(encodeURIComponent(slug)));
    if (!response.ok) return undefined;
    const template = document.createElement('template');
    template.innerHTML = await response.text();
    return template.content.querySelector('li') ?? undefined;
  } catch {
    return undefined;
  }
}

export async function initSaved() {
  const list = document.querySelector<HTMLElement>('[data-saved-list]');
  if (!list || !bindOnce(list, 'saved')) return;

  const cards = (await Promise.all(readBookmarks().map(fetchCard))).filter((card) => card !== undefined);
  // Newest post first, like every other listing.
  cards.sort((a, b) => (b.dataset.savedDate ?? '').localeCompare(a.dataset.savedDate ?? ''));
  list.replaceChildren(...cards);

  const empty = document.querySelector<HTMLElement>('[data-saved-empty]');
  if (empty) empty.hidden = cards.length > 0;

  const status = document.querySelector<HTMLElement>('[data-saved-status]');
  if (status) status.textContent = `${cards.length} bài đã lưu`;
}
