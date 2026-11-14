import { bindOnce } from './bind';

const STORAGE_KEY = 'theme';
const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function stored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Repaints the browser chrome; the head tags only follow the OS scheme. */
function syncChrome(dark: boolean) {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', dark ? 'Bật nền sáng' : 'Bật nền tối');
  });
  const canvas = getComputedStyle(document.body).backgroundColor;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', canvas));
}

/**
 * Flips the theme in one frame. Transitions are suspended while the class
 * changes so hover fades and borders do not animate between palettes; only
 * elements marked [data-swap] (the toggle's icon) keep theirs.
 */
function apply(dark: boolean) {
  root.setAttribute('data-theme-switching', '');
  root.classList.toggle('dark', dark);
  syncChrome(dark);
  // Reading a style forces the new colours to commit before transitions return.
  void getComputedStyle(document.body).backgroundColor;
  setTimeout(() => root.removeAttribute('data-theme-switching'), 1);
}

export function toggleTheme() {
  const dark = !root.classList.contains('dark');
  apply(dark);
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  } catch {
    // Storage can be blocked; the choice then lasts for this page only.
  }
}

/** True when a keystroke belongs to a text field, not to a site shortcut. */
export function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

export function initTheme() {
  syncChrome(root.classList.contains('dark'));

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    if (bindOnce(button, 'theme')) button.addEventListener('click', toggleTheme);
  });

  if (!bindOnce(root, 'theme')) return;

  // Without a saved choice the site follows the OS, including changes made while it is open.
  systemDark.addEventListener('change', (event) => {
    if (!stored()) apply(event.matches);
  });

  // `T` flips the theme. Ignored while typing or with a modifier, so browser shortcuts still work.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 't' && event.key !== 'T') return;
    if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented || event.repeat) return;
    if (isTyping(event.target)) return;
    toggleTheme();
  });
}
