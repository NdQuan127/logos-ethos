/**
 * Obsidian renders `$$…$$` as display maths wherever it sits, even on one line
 * or straight after a sentence. remark-math reads those cases as inline maths,
 * so notes copied from Obsidian put a block formula inside a paragraph, where
 * it cannot scroll and runs off narrow screens.
 *
 * This splits such a paragraph around each `$$` formula and turns the formula
 * into display maths, so it gets the same scroll box as a fenced `$$` block.
 */
import type { Paragraph, PhrasingContent, Root, RootContent } from 'mdast';
import type { InlineMath, Math } from 'mdast-util-math';
import type { VFile } from 'vfile';

function isDoubleDollar(node: PhrasingContent, source: string): node is InlineMath {
  const start = node.position?.start.offset;
  return node.type === 'inlineMath' && start !== undefined && source.startsWith('$$', start);
}

/** The same hast shape mdast-util-math gives a fenced `$$` block, which rehype-katex reads. */
function display(formula: InlineMath): Math {
  return {
    type: 'math',
    value: formula.value,
    position: formula.position,
    data: {
      hName: 'pre',
      hChildren: [
        {
          type: 'element',
          tagName: 'code',
          properties: { className: ['language-math', 'math-display'] },
          children: [{ type: 'text', value: formula.value }],
        },
      ],
    },
  };
}

/** A paragraph of the given run, without the line breaks that bordered the formula; none if it is blank. */
function paragraph(run: PhrasingContent[]): Paragraph[] {
  const children = run.map((node) => (node.type === 'text' ? { ...node, value: node.value } : node));
  const first = children[0];
  const last = children[children.length - 1];
  if (first?.type === 'text') first.value = first.value.replace(/^\s+/, '');
  if (last?.type === 'text') last.value = last.value.replace(/\s+$/, '');
  const kept = children.filter((node) => !(node.type === 'text' && node.value === ''));
  return kept.length > 0 ? [{ type: 'paragraph', children: kept }] : [];
}

function split(node: Paragraph, source: string): RootContent[] | undefined {
  if (!node.children.some((child) => isDoubleDollar(child, source))) return undefined;
  const out: RootContent[] = [];
  let run: PhrasingContent[] = [];
  for (const child of node.children) {
    if (isDoubleDollar(child, source)) {
      out.push(...paragraph(run), display(child));
      run = [];
    } else {
      run.push(child);
    }
  }
  out.push(...paragraph(run));
  return out;
}

function walk(children: RootContent[], source: string) {
  for (let index = children.length - 1; index >= 0; index--) {
    const child = children[index];
    if (child.type === 'paragraph') {
      const parts = split(child, source);
      if (parts) children.splice(index, 1, ...parts);
    } else if ('children' in child) {
      walk(child.children as RootContent[], source);
    }
  }
}

export function remarkDisplayMath() {
  return (tree: Root, file: VFile) => walk(tree.children, String(file.value));
}
