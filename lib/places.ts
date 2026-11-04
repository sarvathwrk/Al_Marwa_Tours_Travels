// Holy places shown on /map. Coordinates are approximate (±~100 m). Verify against a
// trusted map source before using for navigation. Tamil text should be reviewed by a native reader.

import type { Bi } from './i18n';

export type { Bi };
export type CityId = 'makkah' | 'madinah';
export type CategoryId = 'mosques' | 'hajj' | 'historic' | 'miqat';

export const CITIES: Record<CityId, { name: Bi; center: [number, number]; zoom: number }> = {
  makkah: { name: { en: 'Makkah', ta: 'மக்கா' }, center: [21.4225, 39.8262], zoom: 12 },
  madinah: { name: { en: 'Madinah', ta: 'மதீனா' }, center: [24.4672, 39.6111], zoom: 12 },
};

export const CATEGORIES: Record<CategoryId, { name: Bi; color: string; icon: string }> = {
  mosques: {
    name: { en: 'Holy mosques', ta: 'புனித மஸ்ஜிதுகள்' },
    color: '#0f3d33',
    icon: '<path d="M4 20v-6a8 8 0 0 1 16 0v6M2 20h20M12 6V3M9.5 20v-3a2.5 2.5 0 0 1 5 0v3"/>',
  },
  hajj: {
    name: { en: 'Hajj sites', ta: 'ஹஜ் தலங்கள்' },
    color: '#9a783d',
    icon: '<path d="M3 20 12 5l9 15zM12 5v15"/>',
  },
  historic: {
    name: { en: 'Historic sites', ta: 'வரலாற்றுத் தலங்கள்' },
    color: '#7a2e3a',
    icon: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M3 10l9-6 9 6z"/>',
  },
  miqat: {
    name: { en: 'Miqat', ta: 'மீகாத்' },
    color: '#1f4e79',
    icon: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  },
};

export type Place = {
  id: string;
  city: CityId;
  category: CategoryId;
  name: Bi;
  blurb: Bi;
  lat: number;
  lng: number;
};

export const PLACES: Place[] = [
  {
    id: 'masjid-al-haram',
    city: 'makkah',
    category: 'mosques',
    name: { en: 'Masjid al-Haram', ta: 'மஸ்ஜிதுல் ஹராம்' },
    blurb: {
      en: 'The Grand Mosque, home of the Kaaba. Tawaf and Sa’i for Umrah are performed here.',
      ta: 'கஅபாவை உள்ளடக்கிய பெரிய பள்ளிவாசல். உம்ராவுக்கான தவாஃப் மற்றும் ஸஃயீ இங்கே நடைபெறும்.',
    },
    lat: 21.4225,
    lng: 39.8262,
  },
  {
    id: 'jabal-al-noor',
    city: 'makkah',
    category: 'historic',
    name: { en: 'Jabal al-Noor & Cave Hira', ta: 'ஜபலுன் நூர் & ஹிரா குகை' },
    blurb: {
      en: 'The mountain with the cave where the first revelation came to the Prophet ﷺ.',
      ta: 'நபிகள் நாயகம் ﷺ அவர்களுக்கு முதல் வஹீ அருளப்பட்ட குகை அமைந்துள்ள மலை.',
    },
    lat: 21.4574,
    lng: 39.8587,
  },
  {
    id: 'masjid-aisha',
    city: 'makkah',
    category: 'miqat',
    name: { en: 'Masjid Aisha (Tan’im)', ta: 'மஸ்ஜித் ஆயிஷா (தன்யீம்)' },
    blurb: {
      en: 'The closest miqat for pilgrims already in Makkah who wish to perform another Umrah.',
      ta: 'மக்காவில் இருக்கும்போது மற்றொரு உம்ரா செய்ய விரும்புவோர் இஹ்ராம் அணியும் அருகிலுள்ள மீகாத்.',
    },
    lat: 21.4624,
    lng: 39.7704,
  },
  {
    id: 'mina',
    city: 'makkah',
    category: 'hajj',
    name: { en: 'Mina', ta: 'மினா' },
    blurb: {
      en: 'The tent city where pilgrims stay during Hajj and where the Jamarat are located.',
      ta: 'ஹஜ் காலத்தில் ஹாஜிகள் தங்கும் கூடார நகரம்; ஜமராத் இங்கே அமைந்துள்ளது.',
    },
    lat: 21.4133,
    lng: 39.8933,
  },
  {
    id: 'muzdalifah',
    city: 'makkah',
    category: 'hajj',
    name: { en: 'Muzdalifah', ta: 'முஸ்தலிஃபா' },
    blurb: {
      en: 'The open plain between Arafat and Mina where pilgrims spend the night after Arafat.',
      ta: 'அரஃபா மற்றும் மினாவுக்கு இடையிலுள்ள திறந்தவெளி; அரஃபாவுக்குப் பின் ஹாஜிகள் இரவு தங்கும் இடம்.',
    },
    lat: 21.3891,
    lng: 39.9364,
  },
  {
    id: 'arafat',
    city: 'makkah',
    category: 'hajj',
    name: { en: 'Arafat (Jabal ar-Rahmah)', ta: 'அரஃபா (ஜபலுர் ரஹ்மா)' },
    blurb: {
      en: 'The plain where pilgrims stand on the ninth of Dhul Hijjah — the heart of Hajj.',
      ta: 'துல்ஹஜ் ஒன்பதாம் நாள் ஹாஜிகள் தங்கும் சமவெளி — ஹஜ்ஜின் மையம்.',
    },
    lat: 21.3549,
    lng: 39.9841,
  },
  {
    id: 'masjid-an-nabawi',
    city: 'madinah',
    category: 'mosques',
    name: { en: 'Masjid an-Nabawi', ta: 'மஸ்ஜிதுன் நபவி' },
    blurb: {
      en: 'The Prophet’s Mosque, with the Rawdah and the resting place of the Prophet ﷺ.',
      ta: 'நபிகள் நாயகம் ﷺ அவர்களின் பள்ளிவாசல்; ரவ்ளா மற்றும் நபிகளாரின் அடக்கத்தலம் இங்கே உள்ளது.',
    },
    lat: 24.4672,
    lng: 39.6111,
  },
  {
    id: 'quba',
    city: 'madinah',
    category: 'mosques',
    name: { en: 'Quba Mosque', ta: 'குபா மஸ்ஜித்' },
    blurb: {
      en: 'The first mosque built in Islam. Pilgrims often pray two rak‘ahs here.',
      ta: 'இஸ்லாத்தில் கட்டப்பட்ட முதல் பள்ளிவாசல். ஹாஜிகள் இங்கு இரண்டு ரக்அத் தொழுவது வழக்கம்.',
    },
    lat: 24.4393,
    lng: 39.6175,
  },
  {
    id: 'qiblatain',
    city: 'madinah',
    category: 'mosques',
    name: { en: 'Masjid al-Qiblatayn', ta: 'மஸ்ஜிதுல் கிப்லதைன்' },
    blurb: {
      en: 'The mosque of the two qiblas, where the direction of prayer changed toward the Kaaba.',
      ta: 'தொழுகையின் திசை கஅபாவை நோக்கி மாற்றப்பட்ட இரு கிப்லா பள்ளிவாசல்.',
    },
    lat: 24.4849,
    lng: 39.5788,
  },
  {
    id: 'khandaq',
    city: 'madinah',
    category: 'mosques',
    name: { en: 'Masjid al-Fath (Khandaq)', ta: 'மஸ்ஜிதுல் ஃபத்ஹ் (கந்தக்)' },
    blurb: {
      en: 'Beside the site of the Battle of the Trench, among the group known as the Seven Mosques.',
      ta: 'அகழ்ப் போர் நடந்த இடத்தின் அருகில், “ஏழு பள்ளிவாசல்கள்” எனப்படும் தொகுதியில் உள்ளது.',
    },
    lat: 24.4814,
    lng: 39.5936,
  },
  {
    id: 'uhud',
    city: 'madinah',
    category: 'historic',
    name: { en: 'Uhud Battlefield & Martyrs’ Graves', ta: 'உஹுது போர்க்களம் & ஷுஹதாக்கள் அடக்கத்தலம்' },
    blurb: {
      en: 'The site of the Battle of Uhud, where Hamza (RA) and other companions are buried.',
      ta: 'உஹுது போர் நடந்த இடம்; ஹம்ஸா (ரலி) உள்ளிட்ட தோழர்கள் இங்கு அடக்கம் செய்யப்பட்டுள்ளனர்.',
    },
    lat: 24.5004,
    lng: 39.6112,
  },
  {
    id: 'baqi',
    city: 'madinah',
    category: 'historic',
    name: { en: 'Jannat al-Baqi', ta: 'ஜன்னத்துல் பகீஃ' },
    blurb: {
      en: 'The historic cemetery beside Masjid an-Nabawi where many companions and family of the Prophet ﷺ rest.',
      ta: 'மஸ்ஜிதுன் நபவிக்கு அருகிலுள்ள வரலாற்றுப் பூர்வ அடக்கத்தலம்; பல தோழர்களும் நபிகளாரின் குடும்பத்தினரும் இங்கு உள்ளனர்.',
    },
    lat: 24.4668,
    lng: 39.6142,
  },
  {
    id: 'dhul-hulayfah',
    city: 'madinah',
    category: 'miqat',
    name: { en: 'Dhul Hulayfah (Abyar Ali)', ta: 'துல்ஹுலைஃபா (அபியார் அலி)' },
    blurb: {
      en: 'The miqat for pilgrims travelling from Madinah to Makkah, where ihram is worn.',
      ta: 'மதீனாவிலிருந்து மக்கா செல்லும் ஹாஜிகள் இஹ்ராம் அணியும் மீகாத்.',
    },
    lat: 24.4136,
    lng: 39.5428,
  },
];
