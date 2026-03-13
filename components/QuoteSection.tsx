import React from 'react';

interface QuoteSectionProps {
  quote: string;
  author: string;
}

/**
 * QuoteSection — full-width thematic quote block between page sections.
 * Idea #9: Upgraded with gradient background, decorative quote mark, and
 * author underline accent.
 */
export function QuoteSection({ quote, author }: QuoteSectionProps) {
  return (
    <section
      aria-label="Trích dẫn"
      className="relative overflow-hidden py-24 px-6 text-center isolate"
      style={{
        background: 'var(--quote-section-bg)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      {/* Decorative large opening quote mark */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-6 font-serif leading-none select-none pointer-events-none text-[var(--quote-mark-color)]"
        style={{ fontSize: 'clamp(8rem, 15vw, 14rem)', lineHeight: 1 }}
      >
        &ldquo;
      </span>

      {/* Decorative large closing quote mark */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-6 font-serif leading-none select-none pointer-events-none text-[var(--quote-mark-color)]"
        style={{ fontSize: 'clamp(8rem, 15vw, 14rem)', lineHeight: 1 }}
      >
        &rdquo;
      </span>

      <div className="relative z-10 max-w-2xl mx-auto">
        <blockquote className="font-serif text-[var(--quote-text-color)] italic leading-loose" style={{ fontSize: 'clamp(1.25rem, 1rem + 1.3vw, 2rem)' }}>
          {quote}
        </blockquote>

        <cite className="not-italic block mt-6 font-mono text-xs uppercase tracking-widest text-[var(--quote-author-color)]">
          — {author}
          {/* Decorative underline accent */}
          <span aria-hidden="true" className="block w-8 h-px bg-[var(--quote-rule-color)] mx-auto mt-3" />
        </cite>
      </div>
    </section>
  );
}
