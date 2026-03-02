'use client';

import React, { useState, useRef, ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    children?: ReactNode;
    className?: string;
    title?: string;
}

/**
 * CodeBlock — enhanced <pre> replacement for MDX code blocks.
 * Registered as the `pre` component in mdxComponents.
 * Features: language label, optional filename, copy-to-clipboard button.
 */
export function CodeBlock({ children, className, title }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    // Extract language from className (e.g. "language-python" → "python")
    const lang = className?.replace(/^language-/, '') ?? '';

    const handleCopy = async () => {
        const text = preRef.current?.textContent ?? '';
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard not available
        }
    };

    return (
        <div className="my-6 rounded-sm overflow-hidden border border-[var(--border-color)]">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-raised)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                    {/* Traffic lights (decorative) */}
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-academic-red)] opacity-60" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-academic-yellow)] opacity-60" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-academic-green)] opacity-60" aria-hidden="true" />
                    {title && (
                        <span className="ml-2 font-mono text-[10px] text-[var(--muted)]">{title}</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {lang && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                            {lang}
                        </span>
                    )}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                        aria-label={copied ? 'Đã sao chép' : 'Sao chép code'}
                    >
                        {copied
                            ? <><Check size={12} className="text-[var(--color-academic-green)]" /><span>Đã chép</span></>
                            : <><Copy size={12} /><span>Sao chép</span></>
                        }
                    </button>
                </div>
            </div>

            {/* Code area */}
            <pre
                ref={preRef}
                className={`overflow-x-auto px-5 py-4 text-sm font-mono leading-relaxed bg-[var(--surface-raised)]/50 ${className ?? ''}`}
            >
                {children}
            </pre>
        </div>
    );
}
