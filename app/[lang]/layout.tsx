import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import '../globals.css';
import { LangProvider } from '@/components/site/lang';
import { fontVars } from '@/lib/fonts';
import { isLocale, LOCALES, tr, type Locale } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const SITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3009';

const COPY = {
  title: {
    en: 'Al Marwa Tours & Travels | Hajj & Umrah',
    ta: 'அல் மர்வா டூர்ஸ் & டிராவல்ஸ் | ஹஜ் & உம்ரா',
  },
  description: {
    en: 'Al Marwa Tours & Travels — Hajj, Umrah and Ziyarah travel assistance from Tamil Nadu, India.',
    ta: 'அல் மர்வா டூர்ஸ் & டிராவல்ஸ் — தமிழ்நாட்டிலிருந்து ஹஜ், உம்ரா மற்றும் ஜியாரத் பயண உதவி.',
  },
} as const;

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const title = tr(lang, COPY.title.en, COPY.title.ta);
  const description = tr(lang, COPY.description.en, COPY.description.ta);
  // Link previews (WhatsApp, Facebook, X) show the full brand logo in the page's language.
  const shareImage = {
    url: `/brand/og-${lang}.png`,
    width: 1200,
    height: 630,
    alt: tr(lang, 'Al Marwa Tours & Travels logo', 'அல் மர்வா டூர்ஸ் & டிராவல்ஸ் லோகோ'),
  };
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${tr(lang, 'Al Marwa Tours & Travels', 'அல் மர்வா டூர்ஸ் & டிராவல்ஸ்')}` },
    description,
    alternates: { canonical: `/${lang}`, languages: { en: '/en', ta: '/ta', 'x-default': '/en' } },
    openGraph: {
      siteName: 'Al Marwa Tours & Travels',
      type: 'website',
      title,
      description,
      locale: lang === 'ta' ? 'ta_IN' : 'en_IN',
      alternateLocale: lang === 'ta' ? 'en_IN' : 'ta_IN',
      images: [shareImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
  };
}

export const viewport: Viewport = { themeColor: '#0a100e' };

// Only ids made of letters, digits and dashes are ever interpolated into the inline snippets.
const safeId = (v: string | undefined) => (v && /^[A-Za-z0-9_-]{3,40}$/.test(v) ? v : null);

function Analytics() {
  if (process.env.NODE_ENV !== 'production') return null;
  const gtm = safeId(process.env.NEXT_PUBLIC_GOOGLETAG);
  const clarity = safeId(process.env.NEXT_PUBLIC_MICROSOFT_CLARITY);
  return (
    <>
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}
      {clarity && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}
    </>
  );
}

export default async function LangLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <html lang={locale} className={fontVars}>
      <body>
        <LangProvider lang={locale}>{children}</LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
