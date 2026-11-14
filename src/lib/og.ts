/**
 * Share images (1200×630 PNG) drawn at build time with Satori and resvg, in
 * the site's light theme. Satori cannot read woff2 or variable fonts, so the
 * static Inter files from @fontsource/inter are used here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import type { CategoryTone } from './tones';

const FONT_DIR = path.resolve('node_modules/@fontsource/inter/files');
// Each subset gets its own family name: Satori falls back across families
// glyph by glyph, but keeps only one font per name and weight.
const font = (subset: string, weight: 400 | 600) => ({
  name: `Inter ${subset}`,
  weight,
  style: 'normal' as const,
  data: fs.readFileSync(path.join(FONT_DIR, `inter-${subset}-${weight}-normal.woff`)),
});
const FONTS = [font('latin', 400), font('latin', 600), font('vietnamese', 400), font('vietnamese', 600)];

/** Light-theme values of the colour tokens in global.css. */
const COLOR = {
  bg: '#ffffff',
  fg: '#0a0a0a',
  muted: '#666666',
  border: '#e8e8e8',
  blue: '#2563eb',
  green: '#15803d',
  violet: '#7c3aed',
  red: '#dc2626',
};

interface Card {
  title: string;
  /** Small line under the title: category, date. Omitted on the site card. */
  meta?: { label: string; tone: CategoryTone; date: string };
  site: string;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

function mark(): Node {
  return {
    type: 'svg',
    props: {
      width: 30,
      height: 30,
      viewBox: '0 0 16 16',
      children: [
        { type: 'circle', props: { cx: 8, cy: 8, r: 6.75, fill: 'none', stroke: COLOR.fg, strokeWidth: 1.5 } },
        { type: 'path', props: { d: 'M8 1.25a6.75 6.75 0 0 0 0 13.5z', fill: COLOR.fg } },
      ],
    },
  };
}

/** Three lines at the smallest size hold about 110 characters; longer titles end in an ellipsis. */
function shorten(title: string, max = 110): string {
  if (title.length <= max) return title;
  return `${title.slice(0, title.lastIndexOf(' ', max - 1))}…`;
}

export async function renderCard({ title, meta, site }: Card): Promise<Buffer> {
  const size = title.length > 80 ? 50 : title.length > 50 ? 58 : title.length > 28 ? 66 : 76;
  const tree = h(
    'div',
    {
      // Satori sizes boxes without their padding, so the padding comes off here.
      width: 1200 - 160,
      height: 630 - 144,
      boxSizing: 'content-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      backgroundColor: COLOR.bg,
      fontFamily: '"Inter latin", "Inter vietnamese"',
      color: COLOR.fg,
    },
    [
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 600, letterSpacing: '-0.015em' },
        [mark(), site],
      ),
      h('div', { display: 'flex', flexDirection: 'column', gap: 28 }, [
        h(
          'div',
          {
            display: 'flex',
            fontSize: size,
            fontWeight: 600,
            lineHeight: 1.14,
            letterSpacing: '-0.03em',
            width: 1040,
          },
          shorten(title),
        ),
        meta
          ? h('div', { display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, color: COLOR.muted }, [
              h('div', { width: 14, height: 14, borderRadius: 999, backgroundColor: COLOR[meta.tone] }),
              meta.label,
              h('div', { display: 'flex', color: COLOR.border }, '·'),
              meta.date,
            ])
          : h('div', { display: 'flex' }),
      ]),
    ],
  );
  const svg = await satori(tree as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
