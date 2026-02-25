import type { MetadataRoute } from 'next';
import { getPostSlugs } from '@/lib/mdx';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getPostSlugs();

  const blogUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...blogUrls,
  ];
}
