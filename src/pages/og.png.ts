/** The share image for every page that is not an article. */
import { site } from '../config/site';
import { renderCard } from '../lib/og';

export async function GET() {
  const png = await renderCard({ title: site.description, site: site.title });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
