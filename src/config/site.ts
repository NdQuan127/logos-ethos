/**
 * Site-wide settings. Navigation and footer links live here,
 * so adding a menu item is a one-line change.
 */
import { routes } from '../lib/routes';

interface NavLink {
  href: string;
  label: string;
  /** Path prefix that marks the link as current, e.g. '/blog'. Omit for anchors. */
  match?: string;
}

const email = 'contact@logos-ethos.web.app';

export const site = {
  title: 'Logos & Ethos',
  shortName: 'L',
  description: 'Ghi chép chậm về toán học, học máy, triết học và chính trị.',
  /** The `site` option from astro.config.mjs, which reads SITE_URL. */
  url: import.meta.env.SITE,
  locale: 'vi_VN',
  lang: 'vi',
  email,

  /** Posts per page on /blog/. */
  pageSize: 12,

  nav: [
    { href: routes.blog, label: 'Bài viết', match: '/blog' },
    { href: routes.about, label: 'Giới thiệu', match: '/about' },
  ] satisfies NavLink[],

  footer: {
    explore: [
      { href: routes.blog, label: 'Tất cả bài viết' },
      { href: routes.about, label: 'Giới thiệu' },
    ] satisfies NavLink[],
    contact: [
      { href: `${routes.about}#contact`, label: 'Liên hệ' },
      { href: `mailto:${email}`, label: 'Email' },
    ] satisfies NavLink[],
  },
};
