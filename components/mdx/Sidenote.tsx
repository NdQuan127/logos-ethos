'use client';

import React, { useState, ReactNode } from 'react';

interface SidenoteProps {
    id: string | number;
    children: ReactNode;
}

/**
 * Sidenote — Tufte-style marginal notes for MDX articles.
 *
 * - Desktop (>= 1024px): floated right side — displays inline next to content.
 * - Mobile (< 1024px): numbered toggle that expands inline.
 *
 * Usage in MDX:
 * Some philosophical claim<Sidenote id="1">This is the explanatory note that appears in the margin on desktop.</Sidenote> that continues here.
 */
export function Sidenote({ id, children }: SidenoteProps) {
    const [open, setOpen] = useState(false);
    const noteId = `sidenote-${id}`;

    return (
        <>
            {/* Superscript reference marker (always visible) */}
            <sup>
                <button
                    id={`sidenote-ref-${id}`}
                    aria-controls={noteId}
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                    className="lg:hidden font-mono text-[0.65rem] text-[var(--accent-primary)] hover:underline cursor-pointer ml-0.5"
                    aria-label={`Chú thích ${id}`}
                >
                    [{id}]
                </button>
                {/* Desktop: non-interactive number — the float below is always shown */}
                <span
                    className="hidden lg:inline font-mono text-[0.65rem] text-[var(--accent-primary)] ml-0.5"
                    aria-hidden="true"
                >
                    [{id}]
                </span>
            </sup>

            {/* Desktop: float to the right margin */}
            <aside
                id={noteId}
                className="hidden lg:block float-right clear-right w-48 ml-6 mb-4 -mr-56 font-sans text-[0.75rem] text-[var(--muted)] leading-relaxed italic"
                style={{ shapeOutside: 'border-box' }}
            >
                <span className="font-mono not-italic text-[var(--accent-primary)] text-[0.65rem] mr-1">
                    [{id}]
                </span>
                {children}
            </aside>

            {/* Mobile: collapsible inline note */}
            {open && (
                <span
                    id={noteId}
                    role="note"
                    className="lg:hidden block mt-2 mb-2 px-3 py-2 border-l-2 border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 font-sans text-sm text-[var(--muted)] italic"
                >
                    {children}
                </span>
            )}
        </>
    );
}
