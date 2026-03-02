'use client';

import React, { useEffect, useRef, ReactNode } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'scale-up';

interface AnimateOnScrollProps {
    children: ReactNode;
    animation?: Animation;
    /** Delay in milliseconds before animation starts after element is in view */
    delay?: number;
    /** IntersectionObserver threshold (0–1). Default: 0.1 */
    threshold?: number;
    className?: string;
}

/**
 * AnimateOnScroll — wraps children with an IntersectionObserver-driven
 * CSS animation. When the element enters the viewport, the 'is-visible'
 * class is added, triggering the transition defined in globals.css.
 *
 * prefers-reduced-motion is handled in CSS — the utility class sets
 * opacity:1 and transform:none immediately via the media query override.
 */
export function AnimateOnScroll({
    children,
    animation = 'fade-up',
    delay = 0,
    threshold = 0.1,
    className = '',
}: AnimateOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Apply delay, then add visible class
                    const timer = setTimeout(() => {
                        el.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(el); // Animate only once
                    return () => clearTimeout(timer);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, threshold]);

    return (
        <div
            ref={ref}
            className={`animate-on-scroll ${animation} ${className}`}
        >
            {children}
        </div>
    );
}
