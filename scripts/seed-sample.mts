// Placeholder content so every section of the site shows something while the real details are gathered.
// Safe to re-run: each table is only filled when it is empty, and nothing an admin edited is overwritten.
// Replace everything here from /admin before launch.
import { count, eq } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import { db, schema } from './_db.mts';

const isEmpty = async (table: PgTable) => {
  const [row] = await db.select({ n: count() }).from(table);
  return (row?.n ?? 0) === 0;
};

// ---------- contact details: fill only what is still blank ----------
const [settings] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 1));
if (settings) {
  const patch: Partial<typeof schema.siteSettings.$inferInsert> = {};
  if (!settings.email) patch.email = 'info@example.com'; // example.com can never be someone's real inbox
  if (settings.latitude === null || settings.longitude === null) {
    patch.latitude = 13.0827; // Chennai city centre, placeholder office pin
    patch.longitude = 80.2707;
  }
  if (Object.keys(patch).length) {
    await db.update(schema.siteSettings).set(patch).where(eq(schema.siteSettings.id, 1));
    console.log(`contact details: filled ${Object.keys(patch).join(', ')}`);
  }
}

// ---------- Ziyarah package (the HTML lists Ziyarah as a service) ----------
const ziyarah = await db.select({ id: schema.packages.id }).from(schema.packages).where(eq(schema.packages.kind, 'ziyarah')).limit(1);
if (ziyarah.length === 0) {
  await db.insert(schema.packages).values({
    kind: 'ziyarah',
    sort: 4,
    nameEn: 'Makkah & Madinah Ziyarah',
    nameTa: 'மக்கா & மதீனா ஜியாரத்',
    taglineEn: 'Visits to significant Islamic sites in and around the holy cities.',
    taglineTa: 'புனித நகரங்கள் மற்றும் அவற்றைச் சுற்றியுள்ள முக்கிய இஸ்லாமிய இடங்களுக்கான ஜியாரத்.',
    featuresEn: ['Visits to significant Islamic sites', 'Local transport options', 'Tamil-speaking assistance'],
    featuresTa: ['முக்கிய இஸ்லாமிய இடங்களுக்கான பயணங்கள்', 'உள்ளூர் போக்குவரத்து வசதிகள்', 'தமிழில் பயண உதவி'],
  });
  console.log('added a Ziyarah package (price left as "Enquire")');
}

// ---------- numbers (2 of 4 are plain facts, 2 are placeholders) ----------
if (await isEmpty(schema.stats)) {
  await db.insert(schema.stats).values([
    { sort: 1, value: '500+', labelEn: 'Pilgrims assisted', labelTa: 'உதவிய பயணிகள்' }, // placeholder
    { sort: 2, value: '10+', labelEn: 'Years of experience', labelTa: 'ஆண்டுகள் அனுபவம்' }, // placeholder
    { sort: 3, value: '2', labelEn: 'Holy cities: Makkah & Madinah', labelTa: 'புனித நகரங்கள்: மக்கா & மதீனா' },
    { sort: 4, value: '2', labelEn: 'Languages: Tamil & English', labelTa: 'மொழிகள்: தமிழ் & ஆங்கிலம்' },
  ]);
  console.log('added 4 numbers');
}

// ---------- reviews: generic, no personal names ----------
if (await isEmpty(schema.testimonials)) {
  await db.insert(schema.testimonials).values([
    {
      sort: 1,
      name: 'Salem family',
      nameTa: 'சேலம் குடும்பம்',
      detailEn: 'Umrah traveller',
      detailTa: 'உம்ரா பயணி',
      quoteEn: 'The team explained every step in Tamil and answered all our questions before we confirmed.',
      quoteTa: 'ஒவ்வொரு படியையும் தமிழில் விளக்கி, உறுதி செய்வதற்கு முன் எங்கள் எல்லா கேள்விகளுக்கும் பதிலளித்தனர்.',
      rating: 5,
    },
    {
      sort: 2,
      name: 'Coimbatore group',
      nameTa: 'கோயம்புத்தூர் குழு',
      detailEn: 'Group Umrah',
      detailTa: 'குழு உம்ரா',
      quoteEn: 'Visa and flight coordination was clear, and we always knew what to do next.',
      quoteTa: 'விசா மற்றும் விமான ஒருங்கிணைப்பு தெளிவாக இருந்தது; அடுத்து என்ன செய்ய வேண்டும் என்பது எப்போதும் தெரிந்தது.',
      rating: 5,
    },
    {
      sort: 3,
      name: 'Chennai family',
      nameTa: 'சென்னை குடும்பம்',
      detailEn: 'Family Umrah',
      detailTa: 'குடும்ப உம்ரா',
      quoteEn: 'Planning with family felt easy. We received clear details and honest answers.',
      quoteTa: 'குடும்பத்துடன் திட்டமிடுவது எளிதாக இருந்தது. தெளிவான விவரங்களும் நேர்மையான பதில்களும் கிடைத்தன.',
      rating: 4,
    },
  ]);
  console.log('added 3 placeholder reviews');
}

// ---------- founder: obvious placeholder name, no photo, bio reuses the original About text ----------
if (await isEmpty(schema.founder)) {
  await db.insert(schema.founder).values({
    id: 1,
    nameEn: 'Founder Name',
    nameTa: 'நிறுவனர் பெயர்',
    roleEn: 'Founder',
    roleTa: 'நிறுவனர்',
    bioEn:
      'Al Marwa Tours & Travels aims to make Hajj and Umrah travel planning clearer and more comfortable for pilgrims from Tamil Nadu.\n\nWe believe a sacred journey deserves patient guidance, honest information and help in your own language.',
    bioTa:
      'அல் மர்வா டூர்ஸ் & டிராவல்ஸ், தமிழ்நாட்டைச் சேர்ந்த பயணிகளின் ஹஜ் மற்றும் உம்ரா பயணத் திட்டமிடலை தெளிவாகவும் வசதியாகவும் மாற்றுவதை நோக்கமாகக் கொண்டுள்ளது.\n\nபுனிதப் பயணத்திற்கு பொறுமையான வழிகாட்டுதலும் நேர்மையான தகவலும் சொந்த மொழியில் உதவியும் தேவை என்று நாங்கள் நம்புகிறோம்.',
    photoUrl: '',
  });
  console.log('added founder placeholder (no photo)');
}

// ---------- popup offers: statements that are already true of the site ----------
if (await isEmpty(schema.offers)) {
  await db.insert(schema.offers).values([
    {
      sort: 1,
      titleEn: 'Umrah enquiries are open',
      titleTa: 'உம்ரா விசாரணைகள் திறந்துள்ளன',
      bodyEn: 'Message us on WhatsApp for available dates, inclusions and prices.',
      bodyTa: 'கிடைக்கும் தேதிகள், வசதிகள் மற்றும் கட்டணத்திற்கு வாட்ஸ்அப்பில் எழுதுங்கள்.',
    },
    {
      sort: 2,
      titleEn: 'Explore the holy places map',
      titleTa: 'புனிதத் தலங்களின் வரைபடத்தைப் பாருங்கள்',
      bodyEn: 'See Makkah and Madinah ziyarah sites, grouped by category.',
      bodyTa: 'மக்கா மற்றும் மதீனாவின் ஜியாரத் தலங்களை வகைவாரியாகப் பாருங்கள்.',
    },
  ]);
  console.log('added 2 popup offers');
}

console.log('sample content ready. Edit or delete any of it in /admin.');
