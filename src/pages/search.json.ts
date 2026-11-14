/** The command palette's index: every published post, fetched the first time the palette opens. */
import { getPosts } from '../lib/content';

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  category: string;
  tone: string;
  date: string;
  tags: string[];
}

export async function GET() {
  const posts = await getPosts();
  const entries: SearchEntry[] = posts.map((post) => ({
    title: post.title,
    description: post.description,
    href: post.href,
    category: post.category.name,
    tone: post.category.tone,
    date: post.dateLabel,
    tags: post.tags.map((tag) => tag.name),
  }));
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
}
