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

export const ENQUIRY_INTERESTS = ['umrah', 'hajj', 'family_umrah', 'ziyarah', 'other'] as const;
export type EnquiryInterest = (typeof ENQUIRY_INTERESTS)[number];
export const ENQUIRY_INTEREST_LABEL: Record<EnquiryInterest, { en: string; ta: string }> = {
  umrah: { en: 'Umrah', ta: 'உம்ரா' },
  hajj: { en: 'Hajj', ta: 'ஹஜ்' },
  family_umrah: { en: 'Family / Private Umrah', ta: 'குடும்ப / தனிப்பட்ட உம்ரா' },
  ziyarah: { en: 'Ziyarah', ta: 'ஜியாரத்' },
  other: { en: 'Other enquiry', ta: 'மற்ற விசாரணை' },
};

export const ENQUIRY_STATUSES = ['new', 'contacted', 'closed'] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export const ENQUIRY_STATUS_LABEL: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
};
