const root = document.documentElement;

function setTheme(dark: boolean) {
  root.classList.toggle('dark', dark);
  document.querySelector('[data-theme-sun]')?.classList.toggle('hidden', dark);
  document.querySelector('[data-theme-moon]')?.classList.toggle('hidden', !dark);
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  button?.setAttribute('aria-label', dark ? 'Bật chế độ sáng' : 'Bật chế độ tối');
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {}
}

setTheme(root.classList.contains('dark'));

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  setTheme(!root.classList.contains('dark'));
});
