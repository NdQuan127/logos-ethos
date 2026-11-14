import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';
import { remarkDisplayMath } from './remark-display-math';

const render = (markdown: string) =>
  String(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkDisplayMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeStringify)
      .processSync(markdown),
  );

describe('remarkDisplayMath', () => {
  it('turns a one-line $$ formula on its own into display maths', () => {
    expect(render('Trước.\n\n$$a^2 + b^2 = c^2$$\n\nSau.')).toContain('katex-display');
  });

  it('works inside list items', () => {
    expect(render('- $$x = 1$$')).toContain('katex-display');
  });

  it('splits a paragraph around a $$ formula on the next line, as Obsidian shows it', () => {
    const html = render('Biểu diễn như sau:\n$$x = 1$$');
    expect(html).toContain('<p>Biểu diễn như sau:</p>');
    expect(html).toContain('katex-display');
  });

  it('keeps the text after a mid-sentence $$ formula in its own paragraph', () => {
    const html = render('Ta có $$x = 1$$ ở đây.');
    expect(html).toContain('<p>Ta có</p>');
    expect(html).toContain('katex-display');
    expect(html).toContain('<p>ở đây.</p>');
  });

  it('leaves single-dollar maths inline', () => {
    expect(render('$x = 1$')).not.toContain('katex-display');
  });
});
