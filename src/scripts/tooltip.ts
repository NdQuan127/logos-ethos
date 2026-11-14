/**
 * Tooltips for icon buttons: any element with `data-tip` (and optional `data-kbd`).
 * The first one waits 400ms so passing the pointer over a toolbar shows nothing;
 * while one is open, or just closed, the next opens at once and without animation.
 * Pointer and keyboard focus only; touch screens rely on the visible labels.
 */
const OPEN_DELAY = 400;
const WARM_WINDOW = 300;

let tip: HTMLDivElement | undefined;
let current: HTMLElement | undefined;
let openTimer: number | undefined;
let lastClosed = 0;

function element(): HTMLDivElement {
  if (tip) return tip;
  tip = document.createElement('div');
  tip.className = 'tooltip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.append(tip);
  return tip;
}

async function show(target: HTMLElement, instant: boolean) {
  const el = element();
  current = target;
  el.textContent = target.dataset.tip ?? '';
  if (target.dataset.kbd) {
    const kbd = document.createElement('kbd');
    kbd.className = 'kbd';
    kbd.textContent = target.dataset.kbd;
    el.append(kbd);
  }
  el.toggleAttribute('data-instant', instant);
  // Loaded on the first tooltip, which waits 400ms anyway; pages that never show one skip it.
  const { computePosition, flip, offset, shift } = await import('@floating-ui/dom');
  const { x, y, placement } = await computePosition(target, el, {
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });
  if (current !== target) return;
  el.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
  el.style.setProperty('--origin', placement.startsWith('top') ? 'bottom center' : 'top center');
  el.setAttribute('data-open', '');
}

function hide() {
  window.clearTimeout(openTimer);
  if (!current) return;
  current = undefined;
  lastClosed = performance.now();
  tip?.removeAttribute('data-open');
}

function schedule(target: HTMLElement) {
  if (target === current) return;
  window.clearTimeout(openTimer);
  const warm = !!current || performance.now() - lastClosed < WARM_WINDOW;
  if (warm) {
    void show(target, true);
  } else {
    openTimer = window.setTimeout(() => void show(target, false), OPEN_DELAY);
  }
}

export function initTooltips() {
  if (document.documentElement.dataset.tooltips) return;
  document.documentElement.dataset.tooltips = 'true';
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

  document.addEventListener('pointerover', (event) => {
    if (!fine.matches || event.pointerType !== 'mouse') return;
    const target = (event.target as Element).closest<HTMLElement>('[data-tip]');
    if (target) schedule(target);
    else if (current) hide();
  });
  document.addEventListener('focusin', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('[data-tip]');
    if (target?.matches(':focus-visible')) schedule(target);
  });
  document.addEventListener('focusout', hide);
  document.addEventListener('pointerdown', hide);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide();
  });
  window.addEventListener('scroll', hide, { passive: true });
}
