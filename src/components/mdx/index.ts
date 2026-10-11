/**
 * Components available in every MDX post without an import.
 * Register new MDX components here; ArticleLayout passes this map to <Content />.
 */
import Axiom from './Axiom.astro';
import Callout from './Callout.astro';
import Corollary from './Corollary.astro';
import Definition from './Definition.astro';
import Example from './Example.astro';
import Figure from './Figure.astro';
import Lemma from './Lemma.astro';
import Proof from './Proof.astro';
import Proposition from './Proposition.astro';
import PullQuote from './PullQuote.astro';
import Remark from './Remark.astro';
import Sidenote from './Sidenote.astro';
import Term from './Term.astro';
import Theorem from './Theorem.astro';

export const mdxComponents = {
  Axiom,
  Callout,
  Corollary,
  Definition,
  Example,
  Figure,
  Lemma,
  Proof,
  Proposition,
  PullQuote,
  Remark,
  Sidenote,
  Term,
  Theorem,
};
