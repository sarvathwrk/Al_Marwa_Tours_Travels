import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3009';
  const paths = ['', '/map'];
  return paths.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: `${base}/${lang}${path}`,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${base}/${l}${path}`])) },
    })),
  );
}
