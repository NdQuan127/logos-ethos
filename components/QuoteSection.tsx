import React from 'react';
import { Square } from 'lucide-react';

interface QuoteSectionProps {
  quote: string;
  author: string;
}

export function QuoteSection({ quote, author }: QuoteSectionProps) {
  return (
    <section className="w-full py-32 px-6 bg-[var(--foreground)] text-[var(--background)] relative overflow-hidden" aria-label="Trích dẫn">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Square size={24} className="mx-auto mb-8 text-[var(--background)]/50 rotate-45" aria-hidden="true" />
        <blockquote className="font-serif text-3xl md:text-5xl leading-tight italic mb-8">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <cite className="font-mono text-xs tracking-[0.2em] uppercase not-italic opacity-70">
          — {author}
        </cite>
      </div>
    </section>
  );
}
