import { bindOnce } from './bind';
import { initCopy } from './copy';
import { initNotes } from './notes';

/** Makes each section heading a link to itself, so readers can share a section. */
function initHeadingLinks() {
  document.querySelectorAll<HTMLElement>('.prose :is(h2, h3)[id]').forEach((heading) => {
    if (heading.closest('.footnotes') || !bindOnce(heading, 'anchor')) return;
    const link = document.createElement('a');
    link.className = 'heading-link';
    link.href = `#${heading.id}`;
    link.append(...Array.from(heading.childNodes));
    heading.append(link);
  });
}

/** Highlights the section being read in the sidebar and slides the marker to it. */
function initTableOfContents() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const marker = document.querySelector<HTMLElement>('[data-toc-marker]');
  if (links.length === 0 || !marker || !bindOnce(marker, 'toc')) return;

  const sections = links
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter((el): el is HTMLElement => !!el);

  let active: HTMLAnchorElement | undefined;
  const setActive = (link: HTMLAnchorElement | undefined) => {
    if (link === active) return;
    active?.removeAttribute('aria-current');
    active = link;
    if (!link) {
      marker.style.opacity = '0';
      return;
    }
    link.setAttribute('aria-current', 'location');
    marker.style.opacity = '1';
    marker.style.height = `${link.offsetHeight}px`;
    marker.style.translate = `0 ${link.offsetTop}px`;
  };

  // The current section is the last heading above a line a third down the screen.
  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight / 3;
    let index = -1;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= line) index = i;
    });
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    setActive(atEnd ? links.at(-1) : links[index]);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  window.addEventListener('resize', () => {
    const link = active;
    active = undefined;
    setActive(link);
  });
  update();
}

/** Opens article images larger than they are shown in a dialog. */
function initZoom() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-zoom]');
  if (!dialog || !bindOnce(dialog, 'zoom')) return;

  // The width attribute holds the source image's width; srcset may have loaded a smaller copy.
  const zoomable = (img: HTMLImageElement) =>
    Math.max(Number(img.getAttribute('width')) || 0, img.naturalWidth) > img.clientWidth * 1.15;

  const prepare = (img: HTMLImageElement) => {
    if (!zoomable(img) || img.dataset.zoomable !== undefined) return;
    img.dataset.zoomable = '';
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Phóng to ảnh: ${img.alt}`);
  };

  const open = (img: HTMLImageElement) => {
    const large = document.createElement('img');
    large.src = img.currentSrc || img.src;
    large.srcset = img.srcset;
    large.sizes = '100vw';
    large.alt = img.alt;
    dialog.replaceChildren(large);
    dialog.showModal();
  };

  document.querySelectorAll<HTMLImageElement>('.prose img').forEach((img) => {
    if (img.complete) prepare(img);
    else img.addEventListener('load', () => prepare(img), { once: true });
    img.addEventListener('click', () => {
      if (img.dataset.zoomable !== undefined) open(img);
    });
    img.addEventListener('keydown', (event) => {
      if (img.dataset.zoomable === undefined || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      open(img);
    });
  });
  window.addEventListener('resize', () => document.querySelectorAll<HTMLImageElement>('.prose img').forEach(prepare));
  dialog.addEventListener('click', () => dialog.close());
}

export function initArticle() {
  initHeadingLinks();
  initTableOfContents();
  initCopy();
  initNotes();
  initZoom();
}
