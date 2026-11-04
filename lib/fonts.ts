import { Amiri, Hanken_Grotesk, Noto_Sans_Tamil } from 'next/font/google';

const amiri = Amiri({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-amiri', display: 'swap' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });
const tamil = Noto_Sans_Tamil({ subsets: ['tamil'], variable: '--font-tamil', display: 'swap' });

export const fontVars = `${amiri.variable} ${hanken.variable} ${tamil.variable}`;
