import React, { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, BookOpen, HelpCircle } from 'lucide-react';

type CalloutType = 'insight' | 'warning' | 'definition' | 'question';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: ReactNode;
}

const CONFIG: Record<CalloutType, {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    label: string;
}> = {
    insight: {
        icon: Lightbulb,
        color: 'var(--color-academic-yellow)',
        bg: 'rgba(217,164,65,0.07)',
        border: 'var(--color-academic-yellow)',
        label: 'Suy ngẫm',
    },
    warning: {
        icon: AlertTriangle,
        color: 'var(--color-academic-red)',
        bg: 'rgba(166,61,64,0.07)',
        border: 'var(--color-academic-red)',
        label: 'Lưu ý',
    },
    definition: {
        icon: BookOpen,
        color: 'var(--color-academic-blue)',
        bg: 'rgba(43,76,126,0.07)',
        border: 'var(--color-academic-blue)',
        label: 'Định nghĩa',
    },
    question: {
        icon: HelpCircle,
        color: 'var(--color-academic-green)',
        bg: 'rgba(74,124,89,0.07)',
        border: 'var(--color-academic-green)',
        label: 'Câu hỏi',
    },
};

/**
 * Callout — admonition box for MDX content.
 *
 * Usage in MDX:
 * <Callout type="insight" title="Suy ngẫm của Gödel">
 *   Nội dung chú thích...
 * </Callout>
 */
export function Callout({ type = 'insight', title, children }: CalloutProps) {
    const cfg = CONFIG[type];
    const Icon = cfg.icon;
    const displayTitle = title ?? cfg.label;

    return (
        <aside
            role="note"
            className="my-8 rounded-sm overflow-hidden"
            style={{
                borderLeft: `4px solid ${cfg.border}`,
                background: cfg.bg,
            }}
        >
            <div className="px-5 py-4">
                <div
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2 font-semibold"
                    style={{ color: cfg.color }}
                >
                    <Icon size={13} aria-hidden="true" />
                    <span>{displayTitle}</span>
                </div>
                <div className="font-sans text-[var(--foreground)] text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
                    {children}
                </div>
            </div>
        </aside>
    );
}
