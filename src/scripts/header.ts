import { bindOnce } from './bind';

/**
 * Shows the header hairline once the page has scrolled and, on articles,
 * fills the progress bar as the reader moves through the <article>.
 */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header || !bindOnce(header, 'header')) return;
  const progress = header.querySelector<HTMLElement>('[data-progress]');
  const article = document.querySelector<HTMLElement>('article');

  let ticking = false;
  const update = () => {
    ticking = false;
    header.toggleAttribute('data-scrolled', window.scrollY > 2);
    if (!progress || !article) return;
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const done = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
    progress.style.scale = `${done} 1`;
  };

  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
}
