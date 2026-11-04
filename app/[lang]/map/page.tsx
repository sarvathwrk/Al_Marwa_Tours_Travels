import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MapExplorer from '@/components/site/map-explorer';
import SiteHeader from '@/components/site/site-header';
import { MAP_UI } from '@/lib/content';
import { getSettings } from '@/lib/data';
import { bi, isLocale } from '@/lib/i18n';

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<'/[lang]/map'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: bi(lang, MAP_UI.title),
    alternates: { canonical: `/${lang}/map`, languages: { en: '/en/map', ta: '/ta/map', 'x-default': '/en/map' } },
  };
}

export default async function MapPage({ params }: PageProps<'/[lang]/map'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const settings = await getSettings();

  return (
    <>
      <SiteHeader solid />
      <main className="pt-[72px]">
        <MapExplorer whatsapp={settings.whatsapp} />
      </main>
    </>
  );
}
