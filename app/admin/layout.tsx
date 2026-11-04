import type { Metadata } from 'next';
import '../globals.css';
import { fontVars } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Admin | Al Marwa Tours & Travels',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body className="bg-mist">{children}</body>
    </html>
  );
}
