import { ArrowLeft, Images, Inbox, Package, Settings, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { HERO_IMAGE, unsplash } from '@/lib/images';
import LoginForm from './login-form';

const MANAGES = [
  { icon: Inbox, text: 'Read and reply to new enquiries' },
  { icon: Package, text: 'Update packages, prices and offers' },
  { icon: Images, text: 'Gallery, testimonials and FAQs' },
  { icon: Settings, text: 'Contact details shown across the site' },
];

/** Split screen: brand panel (photo, full logo, what admins can do) beside a large sign-in card. Stacks on mobile. */
export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-mist lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <aside className="relative isolate flex flex-col overflow-hidden bg-kiswa px-6 pb-8 pt-6 text-white sm:px-10 sm:pb-10 lg:px-14 lg:py-12 xl:px-20">
        <Image src={unsplash(HERO_IMAGE, 1600)} alt="" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="-z-20 object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-kiswa via-kiswa/85 to-haram/70" />

        <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-gold hover:text-gold">
          <ArrowLeft aria-hidden className="size-4" />
          Back to website
        </Link>

        <div className="my-auto pt-6 lg:pt-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
          <img
            src="/brand/logo-en-white.svg"
            alt="Al Marwa Tours & Travels"
            width={443.93}
            height={328.33}
            className="h-auto w-full max-w-[150px] sm:max-w-[240px] lg:max-w-[360px]"
          />
          <h1 className="mt-5 font-display text-2xl font-bold leading-tight sm:mt-8 sm:text-4xl xl:text-5xl">Website admin</h1>
          <p className="mt-3 hidden max-w-md text-white/70 sm:block">
            Everything on the Al Marwa website is managed from here, in English and Tamil.
          </p>
          <ul className="mt-8 hidden max-w-md gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {MANAGES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 backdrop-blur-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Icon aria-hidden className="size-[18px]" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 hidden text-xs text-white/45 lg:block">© {new Date().getFullYear()} Al Marwa Tours &amp; Travels</p>
      </aside>

      <div className="hizam lg:hidden" aria-hidden />

      <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:py-12">
        <div className="w-full max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-haram">
            <ShieldCheck aria-hidden className="size-4 text-gold-deep" />
            Admin access only
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold text-haram sm:text-4xl">Welcome back</h2>
          <p className="mt-2 text-muted">Sign in to manage enquiries and website content.</p>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl shadow-haram/5 ring-1 ring-line sm:p-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Forgot your password? Ask the site owner to reset it with <code className="whitespace-nowrap rounded bg-white px-1.5 py-0.5">npm run admin:create</code>.
          </p>
        </div>
      </section>
    </main>
  );
}
