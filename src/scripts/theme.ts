import { bindOnce } from './bind';

function setTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  document.querySelector('[data-theme-sun]')?.classList.toggle('hidden', dark);
  document.querySelector('[data-theme-moon]')?.classList.toggle('hidden', !dark);
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  button?.setAttribute('aria-label', dark ? 'Bật chế độ sáng' : 'Bật chế độ tối');
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {}
}

export function initTheme() {
  const root = document.documentElement;
  setTheme(root.classList.contains('dark'));

  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button || !bindOnce(button, 'theme')) return;
  button.addEventListener('click', () => setTheme(!root.classList.contains('dark')));
}
