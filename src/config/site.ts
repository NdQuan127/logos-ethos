/**
 * Site-wide settings. Navigation, footer links and feature switches live here,
 * so adding a menu item or turning a feature off is a one-line change.
 */
import { routes } from '../lib/routes';

export interface NavLink {
  href: string;
  label: string;
  /** Path prefix that marks the link as current, e.g. '/blog'. Omit for anchors. */
  match?: string;
  /** Hide the link when this feature is switched off. */
  feature?: keyof typeof features;
}

const email = 'contact@logos-ethos.web.app';

const features = {
  /** "Lưu" button on articles and the /da-luu/ page. */
  bookmarks: true,
  rss: true,
};

export const site = {
  title: 'Logos & Ethos',
  shortName: 'L',
  description: 'Về những giới hạn của sự hiểu biết — nơi toán học và triết học cùng đặt câu hỏi cho lý trí.',
  url: import.meta.env.SITE_URL ?? 'https://logos-ethos.netlify.app',
  locale: 'vi_VN',
  lang: 'vi',
  keywords: 'toán học, triết học, logic, Plato, Gödel, Pascal, tư duy, khoa học',
  email,

  /** Posts per page on /blog/. */
  pageSize: 12,

  features,

  nav: [
    { href: '/#tuyen-tap', label: 'Tuyển tập' },
    { href: routes.blog, label: 'Bài viết', match: '/blog' },
    { href: routes.saved, label: 'Đã lưu', match: '/da-luu', feature: 'bookmarks' },
    { href: routes.about, label: 'Về chúng tôi', match: '/about' },
  ] satisfies NavLink[],

  footer: {
    explore: [
      { href: '/#tuyen-tap', label: 'Tuyển tập' },
      { href: routes.blog, label: 'Tất cả bài viết' },
      { href: routes.saved, label: 'Bài đã lưu', feature: 'bookmarks' },
      { href: routes.about, label: 'Về chúng tôi' },
    ] satisfies NavLink[],
    contact: [
      { href: `${routes.about}#contact`, label: 'Liên hệ' },
      { href: `mailto:${email}`, label: 'Email' },
    ] satisfies NavLink[],
  },
};

/** Links whose feature is enabled. */
export function enabledLinks(links: readonly NavLink[]): NavLink[] {
  return links.filter((link) => !link.feature || site.features[link.feature]);
}
