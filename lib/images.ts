export const unsplash = (id: string, width: number, quality = 80) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const HERO_IMAGE = 'photo-1564769625905-50e93615e769';
export const ABOUT_IMAGE = 'photo-1591604129939-f1efa4d9f7fa';

export const waLink = (whatsapp: string, text?: string) =>
  `https://wa.me/${whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const telLink = (phoneDisplay: string) => `tel:${phoneDisplay.replace(/[^\d+]/g, '')}`;
