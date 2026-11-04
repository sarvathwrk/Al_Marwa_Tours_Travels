import { notFound } from 'next/navigation';
import About from '@/components/site/about';
import Contact from '@/components/site/contact';
import FloatingContact from '@/components/site/floating-contact';
import Footer from '@/components/site/footer';
import Gallery from '@/components/site/gallery';
import Hero from '@/components/site/hero';
import OfferPopup from '@/components/site/offer-popup';
import Packages from '@/components/site/packages';
import Quote from '@/components/site/quote';
import Services from '@/components/site/services';
import SiteHeader from '@/components/site/site-header';
import Steps from '@/components/site/steps';
import { getOffers, getPackages, getSettings } from '@/lib/data';
import { isLocale } from '@/lib/i18n';

// Static page, refreshed on admin save (revalidatePath) and at most every 5 minutes.
export const revalidate = 300;

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [packages, offers, settings] = await Promise.all([getPackages(), getOffers(), getSettings()]);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero lang={lang} />
        <Services lang={lang} />
        <About lang={lang} />
        <Packages lang={lang} packages={packages} whatsapp={settings.whatsapp} />
        <Steps lang={lang} />
        <Gallery lang={lang} />
        <Quote lang={lang} />
        <Contact lang={lang} settings={settings} />
      </main>
      <Footer lang={lang} settings={settings} />
      <FloatingContact lang={lang} settings={settings} />
      <OfferPopup offers={offers} />
    </>
  );
}
