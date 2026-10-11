import { bindOnce } from './bind';

function setTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  button?.setAttribute('aria-label', dark ? 'Bật chế độ sáng' : 'Bật chế độ tối');
  // The head tags follow the OS scheme; a manual choice must repaint the browser bar too.
  const canvas = getComputedStyle(document.body).backgroundColor;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', canvas));
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {
    // Storage can be blocked; the choice then lasts for this page only.
  }
}

export function initTheme() {
  const root = document.documentElement;
  setTheme(root.classList.contains('dark'));

  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button || !bindOnce(button, 'theme')) return;
  button.addEventListener('click', () => setTheme(!root.classList.contains('dark')));
}
