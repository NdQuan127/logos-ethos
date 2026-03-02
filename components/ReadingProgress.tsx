'use client';

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * ReadingProgress — thin gradient progress bar fixed at the top of the viewport.
 *
 * - Only appears on article pages (rendered conditionally by the parent).
 * - Progress is calculated against the <article> element's scrollable height,
 *   excluding the navbar and footer, so 100% = end of article content.
 * - Uses `scaleX` (GPU-composited) instead of `width` to avoid layout thrash.
 * - Respects prefers-reduced-motion (instant transitions via CSS).
 */
export function ReadingProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    const update = useCallback(() => {
        const bar = barRef.current;
        if (!bar) return;

        const article = document.querySelector<HTMLElement>('article');
        if (!article) return;

        const { top, height } = article.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // How far the article bottom is above the viewport bottom
        const total = height - windowHeight;
        const scrolled = Math.max(0, -top);
        const progress = total > 0 ? Math.min(scrolled / total, 1) : 0;

        bar.style.transform = `scaleX(${progress})`;
        bar.style.opacity = progress > 0.01 ? '1' : '0';
    }, []);

    useEffect(() => {
        let rafId: number;

        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update(); // Initialize on mount

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
        };
    }, [update]);

    return (
        <div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-[51] h-[3px] pointer-events-none"
        >
            <div
                ref={barRef}
                className="h-full w-full origin-left opacity-0"
                style={{
                    background:
                        'linear-gradient(to right, var(--color-academic-blue), var(--color-academic-red))',
                    transform: 'scaleX(0)',
                    transition:
                        'transform 100ms linear, opacity 300ms ease',
                }}
            />
        </div>
    );
}
