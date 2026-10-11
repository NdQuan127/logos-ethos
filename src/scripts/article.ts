import { bindOnce } from './bind';

function initReadingProgress() {
  const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
  const article = document.querySelector<HTMLElement>('article');
  if (!progress || !article || !bindOnce(progress, 'progress')) return;

  const update = () => {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const current = Math.min(Math.max(-rect.top, 0), total);
    progress.style.transform = `scaleX(${total > 0 ? current / total : 0})`;
  };

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking || !progress.isConnected) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
  update();
}

function initTableOfContents() {
  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')).filter((link) =>
    bindOnce(link, 'toc'),
  );
  if (tocLinks.length === 0) return;

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
          item.removeAttribute('aria-current');
        });
        links.forEach((link) => {
          link.setAttribute('aria-current', 'location');
        });
      });
    },
    { rootMargin: '-20% 0px -65% 0px' },
  );
  document.querySelectorAll<HTMLElement>('article h2[id]').forEach((heading) => observer.observe(heading));
}

function initShare() {
  const button = document.querySelector<HTMLButtonElement>('[data-share-button]');
  if (!button || !bindOnce(button, 'share')) return;

  button.addEventListener('click', async () => {
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
    } catch {
      // The reader cancelled the share sheet or clipboard access was denied.
    }
  });
}

function initSidenotes() {
  document.querySelectorAll<HTMLButtonElement>('[data-sidenote-toggle]').forEach((button) => {
    if (!bindOnce(button, 'sidenote')) return;
    button.addEventListener('click', () => {
      const note = button.closest<HTMLElement>('.sidenote');
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      note?.setAttribute('data-open', String(!open));
    });
  });
}

export function initArticle() {
  initReadingProgress();
  initTableOfContents();
  initShare();
  initSidenotes();
}
