const savedCards = '/da-luu/bai/';

/** Every internal URL is built here, so a route only ever changes in one place. */
export const routes = {
  home: '/',
  blog: '/blog/',
  saved: '/da-luu/',
  /** Card fragments fetched by the saved-posts page; not pages for readers. */
  savedCards,
  savedCard: (slug: string) => `${savedCards}${slug}/`,
  about: '/about/',
  rss: '/rss.xml',
  post: (slug: string) => `/blog/${slug}/`,
  category: (id: string) => `/blog/chu-de/${id}/`,
  tag: (slug: string) => `/blog/tag/${slug}/`,
  series: (id: string) => `/blog/loat-bai/${id}/`,
};

/** Astro's pagination URLs omit the trailing slash the site uses everywhere else. */
export function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}
