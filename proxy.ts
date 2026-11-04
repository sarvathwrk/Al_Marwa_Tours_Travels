import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, LOCALES, type Locale } from './lib/i18n';
import { SESSION_COOKIE, verifyToken } from './lib/token';

function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;

  const ranked = (request.headers.get('accept-language') ?? '')
    .split(',')
    .map((part) => {
      const [tag = '', q] = part.trim().split(';q=');
      const weight = q ? Number(q) : 1;
      return { tag: tag.toLowerCase(), q: Number.isNaN(weight) ? 0 : weight };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split('-')[0] ?? '';
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: optimistic cookie check only. Real checks live in requireAdmin() (lib/session.ts).
  if (pathname.startsWith('/admin')) {
    const claims = await verifyToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (pathname.startsWith('/admin/login')) {
      return claims ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
    }
    return claims ? NextResponse.next() : NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Public site: every page lives under /en or /ta.
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

// Skip Next internals, API routes and anything with a file extension (images, robots.txt, ...).
export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
