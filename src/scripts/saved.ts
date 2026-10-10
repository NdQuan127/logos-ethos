import { readBookmarks } from './bookmarks';

const saved = new Set(readBookmarks());
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-saved-slug]'));
let visible = 0;

items.forEach((item) => {
  const show = saved.has(item.dataset.savedSlug ?? '');
  item.hidden = !show;
  if (show) visible += 1;
});

const empty = document.querySelector<HTMLElement>('[data-saved-empty]');
if (empty) empty.hidden = visible > 0;

const status = document.querySelector<HTMLElement>('[data-saved-status]');
if (status) status.textContent = `${visible} bài đã lưu`;
