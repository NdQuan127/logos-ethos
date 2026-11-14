/**
 * Build-time wrappers for blocks that need chrome around them in articles:
 * tables get a scroll container, code blocks a header with the language and a
 * copy button. Doing it here keeps the markup in the HTML, so no script has to
 * rebuild it after the page has painted. Runs after Shiki.
 *
 * Markdown images also get `sizes`. Without it Astro assumes an image fills
 * the viewport, so a wide screenshot would download its full original width
 * for a 40rem column. Astro's image step runs after this plugin and reads it.
 */
import type { Element, ElementContent, Root, RootContent } from 'hast';

type Parent = Root | Element;

const LANGUAGES: Record<string, string> = {
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Shell',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  py: 'Python',
  python: 'Python',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  html: 'HTML',
  css: 'CSS',
  md: 'Markdown',
  mdx: 'MDX',
  sql: 'SQL',
  rust: 'Rust',
  go: 'Go',
  haskell: 'Haskell',
  lean: 'Lean',
  tex: 'TeX',
  latex: 'LaTeX',
};

function el(tagName: string, properties: Element['properties'], children: ElementContent[] = []): Element {
  return { type: 'element', tagName, properties, children };
}

/** A Lucide-style 24px stroke icon. Built as hast nodes: the MDX compiler rejects raw HTML here. */
function icon(children: Element[]): Element {
  return el(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '1.75',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ariaHidden: 'true',
    },
    children,
  );
}

/** Copy icon that cross-fades to a check once copied (see .swap in global.css). */
function copyIcon(): Element {
  return el('span', { className: ['swap'], dataSwap: '', ariaHidden: 'true' }, [
    icon([
      el('rect', { width: 14, height: 14, x: '8', y: '8', rx: '2' }),
      el('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }),
    ]),
    icon([el('path', { d: 'M20 6 9 17l-5-5' })]),
  ]);
}

/** The frame draws the border; the box inside scrolls, so its edge fade never fades the border. */
function wrapTable(table: Element): Element {
  return el('div', { className: ['table-frame'] }, [
    el('div', { className: ['table-wrap'], tabIndex: 0, role: 'region', ariaLabel: 'Bảng, cuộn ngang nếu cần' }, [
      table,
    ]),
  ]);
}

function wrapCode(pre: Element): Element {
  const lang = String(pre.properties?.dataLanguage ?? '');
  const label = LANGUAGES[lang] ?? (lang && lang !== 'plaintext' && lang !== 'text' ? lang : '');
  const head = el('div', { className: ['code-head'] }, [
    el('span', { className: ['code-lang'] }, label ? [{ type: 'text', value: label }] : []),
    el(
      'button',
      {
        type: 'button',
        className: ['btn', 'btn-ghost', 'btn-sm', 'btn-icon', 'code-copy'],
        dataCopyCode: '',
        ariaLabel: 'Chép đoạn code',
        dataTip: 'Chép',
      },
      [copyIcon()],
    ),
  ]);
  // The block scrolls on its own; make it reachable and named for keyboard users.
  pre.properties = { ...pre.properties, tabIndex: 0, ariaLabel: label ? `Mã ${label}` : 'Mã' };
  return el('div', { className: ['code-block'] }, [head, pre]);
}

export const PROSE_IMAGE_SIZES = '(min-width: 42rem) 40rem, 100vw';

function walk(parent: Parent) {
  parent.children = parent.children.map((child): RootContent => {
    if (child.type !== 'element') return child;
    if (child.tagName === 'table') return wrapTable(child);
    if (child.tagName === 'pre') return wrapCode(child);
    if (child.tagName === 'img') child.properties.sizes ??= PROSE_IMAGE_SIZES;
    walk(child);
    return child;
  }) as Parent['children'];
}

export function rehypeBlocks() {
  return (tree: Root) => walk(tree);
}
