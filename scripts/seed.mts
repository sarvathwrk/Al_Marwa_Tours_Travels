import { count } from 'drizzle-orm';
import { db, schema } from './_db.mts';

await db
  .insert(schema.siteSettings)
  .values({
    id: 1,
    phoneDisplay: '+91 99435 15474',
    whatsapp: '919943515474',
    addressEn: 'Tamil Nadu, India',
    addressTa: 'தமிழ்நாடு, இந்தியா',
    hoursEn: 'Contact us for current working hours',
    hoursTa: 'அலுவலக நேரத்திற்கு எங்களைத் தொடர்புகொள்ளவும்',
  })
  .onConflictDoNothing();

const [{ n } = { n: 0 }] = await db.select({ n: count() }).from(schema.packages);
if (n > 0) {
  console.log(`packages already has ${n} rows, seed skipped`);
} else {
  // Prices left blank on purpose: the HTML says "Enquire for price". Set them in /admin.
  await db.insert(schema.packages).values([
    {
      kind: 'hajj',
      sort: 1,
      nameEn: 'Hajj Journey',
      nameTa: 'ஹஜ் பயணம்',
      taglineEn: 'Ask about available Hajj travel options and current arrangements.',
      taglineTa: 'கிடைக்கக்கூடிய ஹஜ் பயண விருப்பங்கள் மற்றும் தற்போதைய ஏற்பாடுகள் பற்றி விசாரிக்கவும்.',
      featuresEn: ['Travel and package guidance', 'Visa process information', 'Accommodation and transport details'],
      featuresTa: ['பயண மற்றும் பேக்கேஜ் வழிகாட்டுதல்', 'விசா செயல்முறை தகவல்', 'தங்குமிடம் மற்றும் போக்குவரத்து விவரங்கள்'],
    },
    {
      kind: 'umrah',
      sort: 2,
      featured: true,
      duration: '15 days',
      nameEn: '15-Day Umrah Group',
      nameTa: '15 நாள் உம்ரா குழுப் பயணம்',
      taglineEn: 'A group travel option for pilgrims planning a focused Umrah journey.',
      taglineTa: 'உம்ரா பயணத்தை குழுவாக மேற்கொள்ள விரும்பும் பயணிகளுக்கான திட்டம்.',
      featuresEn: ['Visa and flight coordination', 'Hotel and transport options', 'Tamil food arrangements – confirm details', 'Makkah & Madinah Ziyarah options'],
      featuresTa: ['விசா மற்றும் விமான ஒருங்கிணைப்பு', 'ஹோட்டல் மற்றும் போக்குவரத்து விருப்பங்கள்', 'தமிழக உணவு ஏற்பாடுகள் – விவரங்களை உறுதி செய்யவும்', 'மக்கா மற்றும் மதீனா ஜியாரத் விருப்பங்கள்'],
    },
    {
      kind: 'umrah',
      sort: 3,
      nameEn: 'Custom Umrah Plan',
      nameTa: 'தனிப்பயன் உம்ரா திட்டம்',
      taglineEn: 'Discuss dates and travel preferences for your family or private group.',
      taglineTa: 'உங்கள் குடும்பம் அல்லது தனிப்பட்ட குழுவிற்கான தேதிகள் மற்றும் பயண விருப்பங்களைப் பற்றி பேசுங்கள்.',
      featuresEn: ['Flexible date enquiry', 'Hotel category options', 'Travel assistance'],
      featuresTa: ['நெகிழ்வான தேதி விசாரணை', 'ஹோட்டல் வகை விருப்பங்கள்', 'பயண உதவி'],
    },
  ]);
  console.log('seeded settings + 3 packages');
}
