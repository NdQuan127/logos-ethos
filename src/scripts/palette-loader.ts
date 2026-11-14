import { isTyping } from './theme';

/**
 * Opens the command palette from Ctrl/⌘ K, "/" or any [data-palette-open]
 * button. The palette (React and cmdk) is only downloaded the first time it is
 * asked for, or when the pointer heads for the search button, so reading an
 * article never pays for it.
 */
let loading: Promise<typeof import('../components/palette/mount')> | undefined;

function load() {
  loading ??= import('../components/palette/mount');
  return loading;
}

async function toggle(forceOpen: boolean) {
  const { mount } = await load();
  if (mount()) return;
  window.dispatchEvent(new Event(forceOpen ? 'palette:open' : 'palette:toggle'));
}

export function initPalette() {
  const root = document.documentElement;
  if (root.dataset.palette) return;
  root.dataset.palette = 'true';

  document.addEventListener('keydown', (event) => {
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === 'k' && !event.altKey && !event.shiftKey) {
      event.preventDefault();
      void toggle(false);
    } else if (event.key === '/' && !mod && !event.altKey && !isTyping(event.target)) {
      event.preventDefault();
      void toggle(true);
    }
  });

  document.addEventListener('click', (event) => {
    if ((event.target as Element).closest('[data-palette-open]')) void toggle(true);
  });

  // Start the download when the pointer or focus reaches a search button.
  const warm = (event: Event) => {
    if ((event.target as Element).closest?.('[data-palette-open]')) void load();
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);
}
