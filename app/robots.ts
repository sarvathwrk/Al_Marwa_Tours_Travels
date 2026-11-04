import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3009';
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: `${base}/sitemap.xml`,
  };
}
