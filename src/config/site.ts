/**
 * Site-wide settings. Navigation and footer links live here,
 * so adding a menu item is a one-line change.
 */
import { routes } from '../lib/routes';

interface NavLink {
  href: string;
  label: string;
  /** Path prefixes that mark the link as current. Omit for links that never are. */
  match?: string[];
}

const email = 'contact@logos-ethos.web.app';

export const site = {
  title: 'Logos & Ethos',
  description: 'Sổ tay về những giới hạn của sự hiểu biết.',
  /** The `site` option from astro.config.mjs, which reads SITE_URL. */
  url: import.meta.env.SITE,
  locale: 'vi_VN',
  lang: 'vi',
  email,

  nav: [
    { href: routes.home, label: 'Bài viết', match: ['/blog/'] },
    { href: routes.about, label: 'Giới thiệu', match: ['/about/'] },
  ] satisfies NavLink[],

  footer: [
    { href: routes.rss, label: 'RSS' },
    { href: `mailto:${email}`, label: 'Email' },
    { href: routes.about, label: 'Giới thiệu' },
  ] satisfies NavLink[],
};

/** Whether a nav link is the current section: its own page or any page under its prefixes. */
export function isCurrent(link: NavLink, pathname: string): boolean {
  return pathname === link.href || !!link.match?.some((prefix) => pathname.startsWith(prefix));
}
