import type { APIRoute, GetStaticPaths } from 'astro';
import { site } from '../../config/site';
import { getPosts, type PostView } from '../../lib/content';
import { renderCard } from '../../lib/og';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: PostView }> = async ({ props: { post } }) => {
  const png = await renderCard({
    title: post.title,
    meta: { label: post.category.name, tone: post.category.tone, date: post.dateLabel },
    site: site.title,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
