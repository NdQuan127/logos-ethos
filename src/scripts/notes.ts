import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

/**
 * Footnote numbers and sidenote letters open their note in a small popover.
 * Pointer: opens on hover after a short pause, stays while the pointer is on
 * the note, and a click pins it. Keyboard: Enter toggles it, Escape closes it
 * and returns focus. Touch: a tap toggles it. The footnote link still jumps to
 * the list at the end when scripts are off.
 */
const HOVER_OPEN = 150;
const HOVER_CLOSE = 200;

type Trigger = HTMLElement;

let pop: HTMLElement | undefined;
let owner: Trigger | undefined;
let pinned = false;
let stopUpdate: (() => void) | undefined;
let openTimer: number | undefined;
let closeTimer: number | undefined;

function noteContent(trigger: Trigger): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (trigger.matches('a[data-footnote-ref]')) {
    const id = decodeURIComponent(trigger.getAttribute('href')?.slice(1) ?? '');
    const item = document.getElementById(id);
    if (!item) return fragment;
    const clone = item.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-footnote-backref]').forEach((el) => el.remove());
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    fragment.append(...Array.from(clone.childNodes));
    const jump = document.createElement('a');
    jump.className = 'note-jump';
    jump.href = `#${id}`;
    jump.textContent = 'Xem ở cuối bài ↓';
    fragment.append(jump);
  } else {
    const body = document.getElementById(trigger.dataset.note ?? '');
    if (body) fragment.append(...Array.from(body.cloneNode(true).childNodes));
  }
  return fragment;
}

function popover(): HTMLElement {
  if (pop) return pop;
  pop = document.createElement('span');
  pop.className = 'note-pop raised';
  pop.id = 'note-popover';
  pop.setAttribute('role', 'note');
  pop.addEventListener('pointerenter', () => window.clearTimeout(closeTimer));
  pop.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && !pinned) scheduleClose();
  });
  return pop;
}

function place(trigger: Trigger) {
  const el = popover();
  void computePosition(trigger, el, {
    placement: 'bottom',
    strategy: 'fixed',
    middleware: [offset(8), flip({ padding: 72 }), shift({ padding: 12 })],
  }).then(({ x, y, placement }) => {
    el.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
    el.style.setProperty('--origin', placement.startsWith('top') ? 'bottom center' : 'top center');
  });
}

function open(trigger: Trigger, pin: boolean) {
  window.clearTimeout(openTimer);
  window.clearTimeout(closeTimer);
  pinned = pin || (owner === trigger && pinned);
  if (owner === trigger) return;
  close(false);
  const el = popover();
  el.replaceChildren(noteContent(trigger));
  // Next to its trigger, so Tab moves from the number into the note's links.
  (trigger.closest('sup') ?? trigger).after(el);
  owner = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  trigger.setAttribute('aria-controls', el.id);
  stopUpdate = autoUpdate(trigger, el, () => place(trigger));
  // Commit the closed state first so the opening transition runs.
  void el.offsetWidth;
  el.setAttribute('data-open', '');
}

function close(restoreFocus: boolean) {
  window.clearTimeout(openTimer);
  window.clearTimeout(closeTimer);
  if (!owner || !pop) return;
  const trigger = owner;
  owner = undefined;
  pinned = false;
  stopUpdate?.();
  pop.removeAttribute('data-open');
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger.focus();
}

function scheduleClose() {
  window.clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => close(false), HOVER_CLOSE);
}

export function initNotes() {
  const triggers = Array.from(document.querySelectorAll<Trigger>('.prose a[data-footnote-ref], .prose [data-note]'));
  if (triggers.length === 0 || document.documentElement.dataset.notes) return;
  document.documentElement.dataset.notes = 'true';

  for (const trigger of triggers) {
    trigger.setAttribute('aria-expanded', 'false');
    if (trigger.matches('a')) trigger.setAttribute('aria-label', `Chú thích ${trigger.textContent}`);

    trigger.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(closeTimer);
      if (owner === trigger) return;
      openTimer = window.setTimeout(() => open(trigger, false), owner ? 0 : HOVER_OPEN);
    });
    trigger.addEventListener('pointerleave', (event) => {
      window.clearTimeout(openTimer);
      if (event.pointerType === 'mouse' && owner === trigger && !pinned) scheduleClose();
    });
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      if (owner === trigger && pinned) close(false);
      else open(trigger, true);
    });
  }

  document.addEventListener('pointerdown', (event) => {
    const target = event.target as Node;
    if (owner && !owner.contains(target) && !pop?.contains(target)) close(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && owner) {
      const focusInside = pop?.contains(document.activeElement) || owner === document.activeElement;
      close(!!focusInside);
    }
  });
  document.addEventListener('focusin', (event) => {
    const target = event.target as Node;
    if (owner && !owner.contains(target) && !pop?.contains(target)) close(false);
  });
}
