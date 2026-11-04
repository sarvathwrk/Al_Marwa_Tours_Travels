import { count } from 'drizzle-orm';
import { unsplash } from '../lib/images';
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
      durationTa: '15 நாட்கள்',
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

const [{ n: galleryCount } = { n: 0 }] = await db.select({ n: count() }).from(schema.galleryItems);
if (galleryCount === 0) {
  // The relevant photos already used on the site, captioned to match what is visible. Admin can replace or add more (https image links).
  await db.insert(schema.galleryItems).values([
    { sort: 1, imageUrl: unsplash('photo-1564769625905-50e93615e769', 1000), captionEn: 'The Kaaba, Makkah', captionTa: 'கஅபா, மக்கா' },
    { sort: 2, imageUrl: unsplash('photo-1591604129939-f1efa4d9f7fa', 1000), captionEn: 'Masjid an-Nabawi, Madinah', captionTa: 'மஸ்ஜிதுன் நபவி, மதீனா' },
    { sort: 3, imageUrl: unsplash('photo-1609599006353-e629aaabfeae', 1000), captionEn: 'The Holy Qur’an', captionTa: 'திருக்குர்ஆன்' },
    { sort: 4, imageUrl: unsplash('photo-1519817650390-64a93db51149', 1000), captionEn: 'A mosque at golden hour', captionTa: 'பொன்னிற ஒளியில் ஒரு பள்ளிவாசல்' },
  ]);
  console.log('seeded 4 gallery photos');
}

const [{ n: faqCount } = { n: 0 }] = await db.select({ n: count() }).from(schema.faqs);
if (faqCount === 0) {
  // Written only from claims already on the original site. Edit freely in /admin.
  await db.insert(schema.faqs).values([
    {
      sort: 1,
      questionEn: 'How do I enquire about a package?',
      questionTa: 'பேக்கேஜ் குறித்து எப்படி விசாரிப்பது?',
      answerEn: 'Message us on WhatsApp or send the enquiry form. Our team will share the available options, inclusions and the confirmed price.',
      answerTa: 'வாட்ஸ்அப்பில் செய்தி அனுப்புங்கள் அல்லது விசாரணைப் படிவத்தை நிரப்புங்கள். கிடைக்கும் விருப்பங்கள், சேர்க்கப்பட்ட வசதிகள் மற்றும் உறுதி செய்யப்பட்ட கட்டணத்தை எங்கள் குழு தெரிவிக்கும்.',
    },
    {
      sort: 2,
      questionEn: 'Why are some prices not listed?',
      questionTa: 'சில பேக்கேஜ்களுக்கு கட்டணம் ஏன் குறிப்பிடப்படவில்லை?',
      answerEn: 'Dates, availability and inclusions are confirmed individually, so we confirm each price with you directly.',
      answerTa: 'தேதிகள், கிடைக்கும் வசதி மற்றும் சேர்க்கப்பட்ட வசதிகள் தனித்தனியாக உறுதி செய்யப்படுவதால், கட்டணத்தை உங்களிடம் நேரடியாக உறுதி செய்கிறோம்.',
    },
    {
      sort: 3,
      questionEn: 'Can I get help in Tamil?',
      questionTa: 'தமிழில் உதவி பெற முடியுமா?',
      answerEn: 'Yes. We communicate in Tamil and English and help you understand your travel arrangements.',
      answerTa: 'முடியும். நாங்கள் தமிழிலும் ஆங்கிலத்திலும் தொடர்புகொண்டு, உங்கள் பயண ஏற்பாடுகளைப் புரிந்துகொள்ள உதவுகிறோம்.',
    },
    {
      sort: 4,
      questionEn: 'Do you help with visa and flights?',
      questionTa: 'விசா மற்றும் விமான ஏற்பாடுகளில் உதவுகிறீர்களா?',
      answerEn: 'We guide and coordinate visa enquiries and flight arrangements through the relevant providers.',
      answerTa: 'சம்பந்தப்பட்ட சேவை நிறுவனங்கள் மூலம் விசா விசாரணைகள் மற்றும் விமான ஏற்பாடுகளுக்கு வழிகாட்டி ஒருங்கிணைக்கிறோம்.',
    },
    {
      sort: 5,
      questionEn: 'Can families or private groups travel together?',
      questionTa: 'குடும்பங்கள் அல்லது தனிப்பட்ட குழுக்கள் சேர்ந்து பயணிக்க முடியுமா?',
      answerEn: 'Yes. Ask about our Custom Umrah Plan for your family or private group, and share your preferred dates.',
      answerTa: 'முடியும். உங்கள் குடும்பம் அல்லது தனிப்பட்ட குழுவுக்கான தனிப்பயன் உம்ரா திட்டம் பற்றி கேளுங்கள்; விருப்பமான தேதிகளைத் தெரிவிக்கவும்.',
    },
    {
      sort: 6,
      questionEn: 'Is Hajj available through you?',
      questionTa: 'ஹஜ் பயணத்தை உங்கள் மூலம் ஏற்பாடு செய்ய முடியுமா?',
      answerEn: 'You can enquire about Hajj travel options. Hajj services are subject to the relevant government and authorized provider processes.',
      answerTa: 'ஹஜ் பயண வாய்ப்புகள் குறித்து விசாரிக்கலாம். ஹஜ் சேவைகள் சம்பந்தப்பட்ட அரசு மற்றும் அங்கீகரிக்கப்பட்ட சேவை நிறுவன நடைமுறைகளுக்கு உட்பட்டவை.',
    },
  ]);
  console.log('seeded 6 FAQs');
}
