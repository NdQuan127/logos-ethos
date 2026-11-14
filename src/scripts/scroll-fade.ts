import { bindOnce } from './bind';

/** Boxes in an article that scroll sideways when their content is wider than the column. */
const SCROLLERS = '.prose :is(.katex-display, .table-wrap, pre)';

/** Sub-pixel layouts leave a scroll range of a pixel or less; that is not overflow. */
const SLACK = 1;

/**
 * Marks which edges of a box still hide content, so CSS can fade them:
 * data-fade is "start", "end" or "both", and absent when everything fits.
 */
function update(box: HTMLElement) {
  const hidden = box.scrollWidth - box.clientWidth;
  const before = box.scrollLeft > SLACK;
  const after = box.scrollLeft < hidden - SLACK;
  const fade = before && after ? 'both' : before ? 'start' : after ? 'end' : '';
  if (fade) box.dataset.fade = fade;
  else delete box.dataset.fade;

  // A formula that overflows must be reachable by keyboard to be scrolled; tables and code already are.
  if (box.classList.contains('katex-display')) {
    if (hidden > SLACK && !box.hasAttribute('tabindex')) {
      box.tabIndex = 0;
      box.setAttribute('role', 'region');
      box.setAttribute('aria-label', 'Công thức, cuộn ngang để xem hết');
    }
  }
}

export function initScrollFade() {
  const boxes = Array.from(document.querySelectorAll<HTMLElement>(SCROLLERS)).filter((box) => bindOnce(box, 'fade'));
  if (boxes.length === 0) return;

  const resize = new ResizeObserver((entries) => entries.forEach((entry) => update(entry.target as HTMLElement)));
  boxes.forEach((box) => {
    update(box);
    box.addEventListener('scroll', () => update(box), { passive: true });
    resize.observe(box);
  });
  // Web fonts change widths after first paint.
  document.fonts?.ready.then(() => boxes.forEach(update));
}
