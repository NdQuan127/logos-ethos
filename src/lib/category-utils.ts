export interface CategoryMeta {
  /** CSS colour (a theme-aware custom property) safe to use as text on paper and leather */
  color: string;
  /** Decorative glyph used on typographic covers */
  symbol: string;
  /** One-line description shown next to the category link */
  description: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'Logic học': { color: 'var(--cat-blue)', symbol: '∴', description: 'Nghịch lý và bất toàn' },
  'Nhận thức luận': { color: 'var(--cat-red)', symbol: '?', description: 'Giới hạn của sự hiểu biết' },
  'Đạo đức luận': { color: 'var(--cat-green)', symbol: 'Η', description: 'Lý trí và giá trị sống' },
  'Nghịch lý': { color: 'var(--cat-yellow)', symbol: '∞', description: 'Khi lập luận tự mâu thuẫn' },
  'Triết học': { color: 'var(--cat-red)', symbol: 'Φ', description: 'Những câu hỏi nền tảng' },
  'Toán học': { color: 'var(--cat-blue)', symbol: '∑', description: 'Ngôn ngữ của cấu trúc' },
  'Phương pháp luận': { color: 'var(--cat-green)', symbol: '§', description: 'Lập luận và phân tích' },
};

const DEFAULT_META: CategoryMeta = {
  color: 'var(--accent-primary)',
  symbol: '·',
  description: '',
};

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category] ?? DEFAULT_META;
}

/** ASCII-safe URL segment: "Nhận thức luận" → "nhan-thuc-luan" */
export function categorySlug(category: string): string {
  return category
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryHref(category: string): string {
  return `/blog/chu-de/${categorySlug(category)}/`;
}
