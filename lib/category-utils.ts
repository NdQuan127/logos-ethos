/**
 * category-utils.ts — Maps blog post categories to their accent colors.
 * Uses the academic color palette defined in globals.css @theme.
 * Falls back to --accent-primary for unknown categories.
 */

export interface CategoryColor {
    /** CSS variable reference for text/border use */
    color: string;
    /** Hex value for inline style usage */
    hex: string;
}

const CATEGORY_COLORS: Record<string, CategoryColor> = {
    'Logic học': { color: 'var(--color-academic-blue)', hex: '#2B4C7E' },
    'Nhận thức luận': { color: 'var(--color-academic-red)', hex: '#A63D40' },
    'Đạo đức luận': { color: 'var(--color-academic-green)', hex: '#4A7C59' },
    'Nghịch lý': { color: 'var(--color-academic-yellow)', hex: '#D9A441' },
    'Triết học': { color: 'var(--color-academic-red)', hex: '#A63D40' },
    'Toán học': { color: 'var(--color-academic-blue)', hex: '#2B4C7E' },
};

/** Default fallback when category is not in the map */
const DEFAULT_COLOR: CategoryColor = {
    color: 'var(--accent-primary)',
    hex: '#2B4C7E',
};

export function getCategoryColor(category: string): CategoryColor {
    return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}
