/** Every internal URL is built here, so a route only ever changes in one place. */
export const routes = {
  home: '/',
  about: '/about/',
  /** Internal review page for the design system; not linked, not indexed. */
  rss: '/rss.xml',
  search: '/search.json',
  post: (slug: string) => `/blog/${slug}/`,
  category: (id: string) => `/blog/chu-de/${id}/`,
  tag: (slug: string) => `/blog/tag/${slug}/`,
  /** Share image generated at build time for each post. */
  ogImage: (slug: string) => `/og/${slug}.png`,
  ogImageSite: '/og.png',
};

/** Astro's pagination URLs omit the trailing slash the site uses everywhere else. */
export function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}
