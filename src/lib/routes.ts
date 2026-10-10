/** Every internal URL is built here, so a route only ever changes in one place. */
export const routes = {
  home: '/',
  blog: '/blog/',
  saved: '/da-luu/',
  about: '/about/',
  rss: '/rss.xml',
  post: (slug: string) => `/blog/${slug}/`,
  category: (id: string) => `/blog/chu-de/${id}/`,
  tag: (slug: string) => `/blog/tag/${slug}/`,
  series: (id: string) => `/blog/loat-bai/${id}/`,
};
