export const PACKAGE_KINDS = ['hajj', 'umrah', 'ziyarah'] as const;
export type PackageKind = (typeof PACKAGE_KINDS)[number];

export const PACKAGE_KIND_LABEL: Record<PackageKind, { en: string; ta: string }> = {
  hajj: { en: 'Hajj', ta: 'ஹஜ்' },
  umrah: { en: 'Umrah', ta: 'உம்ரா' },
  ziyarah: { en: 'Ziyarah', ta: 'ஜியாரத்' },
};

/** Prices are whole rupees. */
export const formatInr = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
