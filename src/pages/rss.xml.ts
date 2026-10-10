import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../lib/constants';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    trailingSlash: true,
    customData: '<language>vi</language>',
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      link: post.href,
      pubDate: post.date,
      categories: [post.category.name, ...post.tags.map((tag) => tag.name)],
    })),
  });
}
