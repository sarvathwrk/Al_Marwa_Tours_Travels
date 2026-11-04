import type { ComponentProps, SVGProps } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa6';

// UI icons come straight from lucide-react. Lucide has no brand logos, so these three use Font Awesome brand glyphs.
export const WhatsApp = (p: ComponentProps<typeof FaWhatsapp>) => <FaWhatsapp aria-hidden {...p} />;
export const Instagram = (p: ComponentProps<typeof FaInstagram>) => <FaInstagram aria-hidden {...p} />;
export const Facebook = (p: ComponentProps<typeof FaFacebookF>) => <FaFacebookF aria-hidden {...p} />;

/** Rub el Hizb: two overlapping squares forming an eight-point star. The Al Marwa mark. */
export const Star8 = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden {...p}>
    <rect x="5.5" y="5.5" width="13" height="13" />
    <rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
