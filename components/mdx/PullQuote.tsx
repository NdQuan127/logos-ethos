import React, { ReactNode } from 'react';

interface PullQuoteProps {
    children: ReactNode;
    author?: string;
}

/**
 * PullQuote — full-width visual emphasis quote for MDX articles.
 * Distinct from standard <blockquote>: no left border, centered,
 * larger text, decorative horizontal rules.
 *
 * Usage in MDX:
 * <PullQuote author="Blaise Pascal">
 *   Toán học là âm nhạc của lý trí.
 * </PullQuote>
 */
export function PullQuote({ children, author }: PullQuoteProps) {
    return (
        <figure className="my-12 mx-auto max-w-2xl text-center">
            <div
                className="w-12 h-px mx-auto mb-6"
                style={{ background: 'var(--accent-primary)' }}
                aria-hidden="true"
            />
            <blockquote className="font-serif text-2xl md:text-3xl italic text-[var(--foreground)] leading-relaxed">
                {children}
            </blockquote>
            {author && (
                <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                    — {author}
                </figcaption>
            )}
            <div
                className="w-12 h-px mx-auto mt-6"
                style={{ background: 'var(--accent-primary)' }}
                aria-hidden="true"
            />
        </figure>
    );
}
