'use client';

import React, { useEffect, useState, useCallback, useRef, startTransition } from 'react';
import { ChevronDown, List } from 'lucide-react';

interface Heading {
    id: string;
    text: string;
    level: 2 | 3;
}

interface HeadingListProps {
    headings: Heading[];
    activeId: string;
    onScrollTo: (id: string) => void;
}

// Declared outside to satisfy "react-hooks/static-components" ESLint rule
function HeadingList({ headings, activeId, onScrollTo }: HeadingListProps) {
    return (
        <ul className="space-y-1" role="list">
            {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                    <button
                        onClick={() => onScrollTo(h.id)}
                        className={[
                            'w-full text-left font-mono text-[10px] uppercase tracking-wider leading-relaxed transition-colors duration-150 py-1 cursor-pointer',
                            'line-clamp-2 border-l-2 pl-3',
                            activeId === h.id
                                ? 'border-[var(--accent-primary)] text-[var(--foreground)]'
                                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted)]',
                        ].join(' ')}
                    >
                        {h.text}
                    </button>
                </li>
            ))}
        </ul>
    );
}

/**
 * TableOfContents — extracts h2/h3 headings from the rendered article
 * and renders:
 *  - Desktop (xl+): sticky right-side sidebar with ScrollSpy highlighting
 *  - Mobile (<xl):  collapsible accordion at the top of the article
 */
export function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Extract headings from the DOM after the article renders
    // startTransition: marks as non-urgent to satisfy react-hooks/set-state-in-effect
    useEffect(() => {
        const article = document.querySelector<HTMLElement>('article');
        if (!article) return;

        const els = Array.from(
            article.querySelectorAll<HTMLHeadingElement>('h2, h3')
        );

        const extracted: Heading[] = els.map((el) => ({
            id: el.id,
            text: el.textContent ?? '',
            level: (parseInt(el.tagName[1]) as 2 | 3),
        })).filter((h) => h.id && h.text);

        startTransition(() => {
            setHeadings(extracted);
        });
    }, []);

    // ScrollSpy via IntersectionObserver
    const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
            setActiveId(visible[0].target.id);
        }
    }, []);

    useEffect(() => {
        if (headings.length === 0) return;

        observerRef.current = new IntersectionObserver(onIntersect, {
            rootMargin: '-80px 0px -60% 0px',
            threshold: 0,
        });

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observerRef.current!.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, [headings, onIntersect]);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const offset = 96;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        setMobileOpen(false);
    }, []);

    if (headings.length === 0) return null;

    return (
        <>
            {/* ── Desktop: sticky sidebar (visible xl+) ── */}
            <aside
                aria-label="Mục lục bài viết"
                className="hidden xl:block xl:order-last sticky top-24 w-52 shrink-0 self-start"
            >
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-1.5">
                    <List size={12} aria-hidden="true" />
                    Mục lục
                </p>
                <HeadingList headings={headings} activeId={activeId} onScrollTo={scrollTo} />
            </aside>

            {/* ── Mobile: collapsible accordion (hidden xl+) ── */}
            <div className="xl:hidden mb-8 border border-[var(--border-color)] rounded-sm overflow-hidden">
                <button
                    onClick={() => setMobileOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors bg-[var(--surface-raised)]/30"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-toc"
                >
                    <span className="flex items-center gap-2">
                        <List size={14} aria-hidden="true" />
                        Mục lục
                    </span>
                    <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={`transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {mobileOpen && (
                    <div id="mobile-toc" className="px-4 py-3 border-t border-[var(--border-color)]">
                        <HeadingList headings={headings} activeId={activeId} onScrollTo={scrollTo} />
                    </div>
                )}
            </div>
        </>
    );
}
