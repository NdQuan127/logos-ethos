import { site } from '../config/site';
import { routes } from '../lib/routes';

export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: ${routes.savedCards}\nSitemap: ${site.url}/sitemap-index.xml\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
}
