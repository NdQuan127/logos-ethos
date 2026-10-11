import { bindOnce } from './bind';

/** Mobile menu. The open state lives in `aria-expanded` on the toggle and `data-open` on the drawer; CSS does the rest. */
export function initNav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-nav-drawer]');
  if (!toggle || !drawer || !bindOnce(toggle, 'nav')) return;

  const links = Array.from(drawer.querySelectorAll<HTMLElement>('[data-nav-link]'));
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    drawer.toggleAttribute('data-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) links[0]?.focus();
  };

  const close = () => {
    setOpen(false);
    toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  drawer.querySelector('[data-nav-close]')?.addEventListener('click', close);
  drawer.querySelector('[data-nav-backdrop]')?.addEventListener('click', () => setOpen(false));
  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) close();
  });
}
