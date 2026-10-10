import { readBookmarks, toggleBookmark } from './bookmarks';

const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
const article = document.querySelector<HTMLElement>('article');

function updateProgress() {
  if (!progress || !article) return;
  const rect = article.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  const current = Math.min(Math.max(-rect.top, 0), total);
  const pct = total > 0 ? (current / total) * 100 : 0;
  progress.style.transform = `scaleX(${pct / 100})`;
}

let ticking = false;
window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
  },
  { passive: true },
);
updateProgress();

const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
if (tocLinks.length > 0) {
  const byId = new Map<string, HTMLAnchorElement[]>();
  tocLinks.forEach((link) => {
    const id = decodeURIComponent(link.hash.slice(1));
    byId.set(id, [...(byId.get(id) ?? []), link]);
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const links = byId.get(entry.target.id);
        if (!entry.isIntersecting || !links) return;
        tocLinks.forEach((item) => {
          item.classList.remove('text-[var(--accent-primary)]');
          item.removeAttribute('aria-current');
        });
        links.forEach((link) => {
          link.classList.add('text-[var(--accent-primary)]');
          link.setAttribute('aria-current', 'location');
        });
      });
    },
    { rootMargin: '-20% 0px -65% 0px' },
  );
  document.querySelectorAll<HTMLElement>('article h2[id], article h3[id]').forEach((heading) => observer.observe(heading));
}

document.querySelector<HTMLButtonElement>('[data-share-button]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const label = button.querySelector('[data-share-label]');
  const title = button.dataset.shareTitle ?? document.title;
  try {
    if (navigator.share) {
      await navigator.share({ title, url: location.href });
      return;
    }
    await navigator.clipboard.writeText(location.href);
    if (label) label.textContent = 'Đã sao chép!';
    setTimeout(() => {
      if (label) label.textContent = 'Chia sẻ';
    }, 2000);
  } catch {}
});

const bookmarkButton = document.querySelector<HTMLButtonElement>('[data-bookmark-button]');

function renderBookmark() {
  if (!bookmarkButton) return;
  const slug = bookmarkButton.dataset.bookmarkSlug;
  const saved = !!slug && readBookmarks().includes(slug);
  bookmarkButton.setAttribute('aria-pressed', String(saved));
  bookmarkButton.querySelector('[data-bookmark-label]')?.replaceChildren(saved ? 'Đã lưu' : 'Lưu');
  bookmarkButton.querySelector('[data-bookmark-off]')?.classList.toggle('hidden', saved);
  bookmarkButton.querySelector('[data-bookmark-on]')?.classList.toggle('hidden', !saved);
}

bookmarkButton?.addEventListener('click', () => {
  const slug = bookmarkButton.dataset.bookmarkSlug;
  if (!slug) return;
  toggleBookmark(slug);
  renderBookmark();
});
renderBookmark();

document.querySelectorAll<HTMLButtonElement>('[data-sidenote-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const note = button.closest<HTMLElement>('.sidenote');
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    note?.setAttribute('data-open', String(!open));
  });
});
