import { bindOnce } from './bind';

export function initNav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-nav-drawer]');
  const panel = document.querySelector<HTMLElement>('[data-nav-panel]');
  const backdrop = document.querySelector<HTMLElement>('[data-nav-backdrop]');
  const closeButton = document.querySelector<HTMLButtonElement>('[data-nav-close]');
  const links = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-link]'));
  const menuIcon = document.querySelector<HTMLElement>('[data-nav-menu-icon]');
  const closeIcon = document.querySelector<HTMLElement>('[data-nav-close-icon]');

  function setOpen(open: boolean) {
    if (!toggle || !drawer || !panel || !backdrop) return;

    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.classList.toggle('visible', open);
    drawer.classList.toggle('invisible', !open);
    drawer.classList.toggle('pointer-events-none', !open);
    backdrop.classList.toggle('opacity-100', open);
    backdrop.classList.toggle('opacity-0', !open);
    panel.classList.toggle('translate-x-0', open);
    panel.classList.toggle('translate-x-full', !open);
    menuIcon?.classList.toggle('opacity-0', open);
    menuIcon?.classList.toggle('rotate-90', open);
    menuIcon?.classList.toggle('scale-75', open);
    closeIcon?.classList.toggle('opacity-0', !open);
    closeIcon?.classList.toggle('-rotate-90', !open);
    closeIcon?.classList.toggle('scale-75', !open);
    links.forEach((link) => {
      link.classList.toggle('opacity-100', open);
      link.classList.toggle('translate-x-0', open);
      link.classList.toggle('opacity-0', !open);
      link.classList.toggle('translate-x-4', !open);
    });
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => links[0]?.focus(), 50);
}

if (!toggle || !bindOnce(toggle, 'nav')) return;

toggle.addEventListener('click', () => {
  setOpen(toggle.getAttribute('aria-expanded') !== 'true');
});
closeButton?.addEventListener('click', () => {
  setOpen(false);
  toggle?.focus();
});
backdrop?.addEventListener('click', () => setOpen(false));
links.forEach((link) => link.addEventListener('click', () => setOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setOpen(false);
    toggle.focus();
  }
});
}
