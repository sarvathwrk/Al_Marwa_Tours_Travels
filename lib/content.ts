import type { Bi } from './i18n';

// Static page copy, English and Tamil side by side so translators can review both at once.
// Dynamic content (packages, offers, contact details) lives in the database.

export const NAV: { id: string; href: string; label: Bi }[] = [
  { id: 'home', href: '', label: { en: 'Home', ta: 'முகப்பு' } },
  { id: 'services', href: '#services', label: { en: 'Services', ta: 'சேவைகள்' } },
  { id: 'packages', href: '#packages', label: { en: 'Packages', ta: 'பேக்கேஜ்கள்' } },
  { id: 'map', href: '/map', label: { en: 'Holy map', ta: 'புனித வரைபடம்' } },
  { id: 'about', href: '#about', label: { en: 'About', ta: 'எங்களைப் பற்றி' } },
  { id: 'contact', href: '#contact', label: { en: 'Contact', ta: 'தொடர்பு' } },
];

export const HERO = {
  title: { en: 'Your Sacred Journey Begins With Al Marwa', ta: 'அல் மர்வாவுடன் உங்கள் புனிதப் பயணம் தொடங்குகிறது' },
  body: {
    en: 'Thoughtful travel assistance for your Hajj and Umrah journey. Let us help you plan your visit to the holy cities of Makkah and Madinah with care.',
    ta: 'உங்கள் ஹஜ் மற்றும் உம்ரா பயணத்திற்கான அக்கறையான பயண ஏற்பாடுகள். மக்கா மற்றும் மதீனா புனித நகரங்களுக்கான பயணத்தை திட்டமிட எங்களுடன் இணைந்திடுங்கள்.',
  },
  primary: { en: 'Explore packages', ta: 'பேக்கேஜ்களைப் பார்க்க' },
  secondary: { en: 'Contact us', ta: 'எங்களைத் தொடர்புகொள்ள' },
  trust: [
    { en: 'Personal assistance', ta: 'தனிப்பட்ட உதவி' },
    { en: 'Tamil-friendly support', ta: 'தமிழில் வழிகாட்டுதல்' },
    { en: 'Journey planning', ta: 'பயணத் திட்டமிடல்' },
  ] satisfies Bi[],
  imageAlt: { en: 'Pilgrims gathered around the Kaaba', ta: 'கஅபாவைச் சுற்றி கூடியிருக்கும் ஹாஜிகள்' },
};

export const SERVICES = {
  title: { en: 'Everything You Need for Your Pilgrimage', ta: 'உங்கள் புனிதப் பயணத்திற்குத் தேவையான சேவைகள்' },
  intro: {
    en: 'From the first enquiry to your return home, we help coordinate the important parts of your journey.',
    ta: 'முதல் விசாரணை முதல் நீங்கள் வீடு திரும்பும் வரை, உங்கள் பயணத்தின் முக்கிய ஏற்பாடுகளை ஒருங்கிணைக்க உதவுகிறோம்.',
  },
  items: [
    {
      icon: 'crescent',
      title: { en: 'Hajj Travel Assistance', ta: 'ஹஜ் பயண உதவி' },
      body: {
        en: 'Enquire about Hajj travel options, arrangements and guidance for the sacred pilgrimage.',
        ta: 'புனித ஹஜ் பயணத்திற்கான பயண வாய்ப்புகள், ஏற்பாடுகள் மற்றும் வழிகாட்டுதல் குறித்து விசாரிக்கவும்.',
      },
    },
    {
      icon: 'cube',
      title: { en: 'Umrah Packages', ta: 'உம்ரா பேக்கேஜ்கள்' },
      body: {
        en: 'Explore group and family Umrah travel options with assistance in planning your itinerary.',
        ta: 'குழு மற்றும் குடும்ப உம்ரா பயண விருப்பங்களைத் தெரிந்து கொண்டு உங்கள் பயணத் திட்டத்தை அமைக்கவும்.',
      },
    },
    {
      icon: 'plane',
      title: { en: 'Visa & Flight Coordination', ta: 'விசா மற்றும் விமான ஏற்பாடுகள்' },
      body: {
        en: 'Guidance and coordination for visa enquiries and flight arrangements through relevant providers.',
        ta: 'சம்பந்தப்பட்ட சேவை நிறுவனங்கள் மூலம் விசா விசாரணைகள் மற்றும் விமான ஏற்பாடுகளுக்கான வழிகாட்டுதல்.',
      },
    },
    {
      icon: 'hotel',
      title: { en: 'Hotel & Transport', ta: 'ஹோட்டல் மற்றும் போக்குவரத்து' },
      body: {
        en: 'Ask us about accommodation and local transport options in Makkah and Madinah.',
        ta: 'மக்கா மற்றும் மதீனாவில் தங்குமிடம் மற்றும் உள்ளூர் போக்குவரத்து வசதிகள் பற்றி எங்களிடம் கேளுங்கள்.',
      },
    },
    {
      icon: 'compass',
      title: { en: 'Ziyarah Visits', ta: 'ஜியாரத் பயணங்கள்' },
      body: {
        en: 'Learn about visits to significant Islamic sites in and around the holy cities.',
        ta: 'புனித நகரங்கள் மற்றும் அவற்றைச் சுற்றியுள்ள முக்கிய இஸ்லாமிய இடங்களுக்கான ஜியாரத் விவரங்களை அறியுங்கள்.',
      },
    },
    {
      icon: 'chat',
      title: { en: 'Tamil-speaking Assistance', ta: 'தமிழில் பயண உதவி' },
      body: {
        en: 'Communicate comfortably in Tamil and get help understanding your travel arrangements.',
        ta: 'தமிழில் எளிதாகப் பேசி, உங்கள் பயண ஏற்பாடுகளைப் புரிந்துகொள்ள உதவி பெறுங்கள்.',
      },
    },
  ],
} as const;

export const ABOUT = {
  title: { en: 'A Meaningful Journey, Planned With Care', ta: 'அக்கறையுடன் திட்டமிடப்படும் அர்த்தமுள்ள பயணம்' },
  body: {
    en: 'At Al Marwa Tours & Travels, our aim is to make your Hajj and Umrah travel planning clearer and more comfortable. We support pilgrims from Tamil Nadu with helpful communication and coordinated travel arrangements.',
    ta: 'அல் மர்வா டூர்ஸ் & டிராவல்ஸில், உங்கள் ஹஜ் மற்றும் உம்ரா பயணத் திட்டமிடலை எளிமையாகவும் வசதியாகவும் மாற்றுவதே எங்கள் நோக்கம். தமிழ்நாட்டைச் சேர்ந்த பயணிகளுக்கு தெளிவான தகவல் மற்றும் ஒருங்கிணைக்கப்பட்ட பயண ஏற்பாடுகள் மூலம் உதவுகிறோம்.',
  },
  checks: [
    { en: 'Friendly enquiry support', ta: 'அன்பான விசாரணை உதவி' },
    { en: 'Clear package information', ta: 'தெளிவான பேக்கேஜ் தகவல்' },
    { en: 'Tamil & English communication', ta: 'தமிழ் மற்றும் ஆங்கிலத் தொடர்பு' },
    { en: 'Group & family enquiries', ta: 'குழு மற்றும் குடும்ப விசாரணைகள்' },
  ] satisfies Bi[],
  cta: { en: 'Speak with our team', ta: 'எங்கள் குழுவுடன் பேசுங்கள்' },
  imageAlt: { en: 'Masjid an-Nabawi in Madinah', ta: 'மதீனாவின் மஸ்ஜிதுன் நபவி' },
};

export const PACKAGES = {
  title: { en: 'Explore Our Pilgrimage Packages', ta: 'எங்கள் புனிதப் பயண பேக்கேஜ்கள்' },
  intro: {
    en: 'Package dates, availability, inclusions and prices are confirmed individually. Contact us for the latest details.',
    ta: 'பயணத் தேதிகள், இடங்கள், சேர்க்கப்பட்ட வசதிகள் மற்றும் கட்டணம் தனித்தனியாக உறுதி செய்யப்படும். சமீபத்திய விவரங்களுக்கு எங்களைத் தொடர்புகொள்ளுங்கள்.',
  },
  all: { en: 'All', ta: 'அனைத்தும்' },
  startingFrom: { en: 'Starting from', ta: 'தொடக்கக் கட்டணம்' },
  enquirePrice: { en: 'Enquire for price', ta: 'கட்டணத்திற்கு விசாரிக்கவும்' },
  popular: { en: 'Popular', ta: 'பிரபலமானது' },
  whatsapp: { en: 'Enquire on WhatsApp', ta: 'வாட்ஸ்அப்பில் விசாரிக்க' },
  empty: {
    en: 'We are updating our packages. Message us on WhatsApp for current options.',
    ta: 'பேக்கேஜ்கள் புதுப்பிக்கப்படுகின்றன. தற்போதைய விவரங்களுக்கு வாட்ஸ்அப்பில் தொடர்புகொள்ளுங்கள்.',
  },
  disclaimer: {
    en: 'All package details are subject to confirmation, availability and applicable official requirements. Hajj services are subject to the relevant government and authorized provider processes.',
    ta: 'அனைத்து பேக்கேஜ் விவரங்களும் உறுதி, கிடைக்கும் வசதி மற்றும் பொருந்தும் அதிகாரப்பூர்வ விதிமுறைகளுக்கு உட்பட்டவை. ஹஜ் சேவைகள் சம்பந்தப்பட்ட அரசு மற்றும் அங்கீகரிக்கப்பட்ட சேவை நிறுவன நடைமுறைகளுக்கு உட்பட்டவை.',
  },
  waMessage: (name: string) => ({
    en: `Assalamu Alaikum. I would like to enquire about the ${name} with Al Marwa Tours & Travels.`,
    ta: `அஸ்ஸலாமு அலைக்கும். ${name} குறித்து அல் மர்வா டூர்ஸ் & டிராவல்ஸிடம் விசாரிக்க விரும்புகிறேன்.`,
  }),
};

export const STEPS = {
  title: { en: 'Simple Steps, Personal Support', ta: 'எளிய படிகள், தனிப்பட்ட உதவி' },
  items: [
    {
      title: { en: 'Enquire', ta: 'விசாரிக்கவும்' },
      body: { en: 'Tell us your preferred journey, dates and group size.', ta: 'உங்கள் பயண விருப்பம், தேதிகள் மற்றும் குழு எண்ணிக்கையைத் தெரிவிக்கவும்.' },
    },
    {
      title: { en: 'Review options', ta: 'விருப்பங்களைப் பார்க்கவும்' },
      body: { en: 'We share available options and explain the inclusions.', ta: 'கிடைக்கும் விருப்பங்கள் மற்றும் சேர்க்கப்பட்ட வசதிகளை விளக்குகிறோம்.' },
    },
    {
      title: { en: 'Confirm details', ta: 'விவரங்களை உறுதி செய்யவும்' },
      body: { en: 'Review the itinerary, terms, documents and confirmed price.', ta: 'பயணத் திட்டம், நிபந்தனைகள், ஆவணங்கள் மற்றும் உறுதி செய்யப்பட்ட கட்டணத்தைச் சரிபார்க்கவும்.' },
    },
    {
      title: { en: 'Prepare to travel', ta: 'பயணத்திற்குத் தயாராகுங்கள்' },
      body: { en: 'Receive the next-step guidance for your journey.', ta: 'உங்கள் பயணத்திற்கான அடுத்தகட்ட வழிகாட்டுதலைப் பெறுங்கள்.' },
    },
  ],
} as const;

export const GALLERY = {
  title: { en: 'A Glimpse of the Holy Cities', ta: 'புனித நகரங்களின் அழகிய காட்சிகள்' },
  intro: {
    en: 'Makkah, Madinah and the moments that make this journey unforgettable.',
    ta: 'மக்கா, மதீனா மற்றும் இந்தப் பயணத்தை மறக்க முடியாததாக மாற்றும் தருணங்கள்.',
  },
} as const;

export const QUOTE = {
  text: { en: '“And proclaim to the people the Hajj…”', ta: '“மக்களிடையே ஹஜ்ஜை அறிவிப்பீராக…”' },
  source: { en: 'Qur’an 22:27', ta: 'திருக்குர்ஆன் 22:27' },
};

export const CONTACT = {
  title: { en: 'Begin Your Journey With Al Marwa', ta: 'அல் மர்வாவுடன் உங்கள் பயணத்தைத் தொடங்குங்கள்' },
  intro: {
    en: 'Send us your enquiry and our team will contact you, or message us directly on WhatsApp.',
    ta: 'உங்கள் விசாரணையை அனுப்புங்கள்; எங்கள் குழு உங்களைத் தொடர்புகொள்ளும். அல்லது நேரடியாக வாட்ஸ்அப்பில் எழுதுங்கள்.',
  },
  cards: {
    phone: { en: 'Call or WhatsApp', ta: 'அழைக்க / வாட்ஸ்அப்' },
    email: { en: 'Email', ta: 'மின்னஞ்சல்' },
    visit: { en: 'Visit us', ta: 'எங்களைச் சந்திக்க' },
  },
  fallbackTitle: { en: 'Prefer to talk now?', ta: 'இப்போதே பேச விரும்புகிறீர்களா?' },
  mapLabel: { en: 'Our office on the map', ta: 'வரைபடத்தில் எங்கள் அலுவலகம்' },
  boxTitle: { en: 'Let’s talk about your journey', ta: 'உங்கள் பயணம் குறித்து பேசுவோம்' },
  boxBody: {
    en: 'For package details, group bookings and travel enquiries, reach us directly.',
    ta: 'பேக்கேஜ் விவரங்கள், குழு முன்பதிவு மற்றும் பயண விசாரணைகளுக்கு எங்களை நேரடியாகத் தொடர்புகொள்ளுங்கள்.',
  },
  form: {
    name: { en: 'Full name', ta: 'முழுப் பெயர்' },
    namePh: { en: 'Your name', ta: 'உங்கள் பெயர்' },
    phone: { en: 'Mobile number', ta: 'கைபேசி எண்' },
    interest: { en: 'Interested in', ta: 'விருப்பமான பயணம்' },
    travellers: { en: 'Number of travellers', ta: 'பயணிகள் எண்ணிக்கை' },
    travellersPh: { en: 'e.g. 4', ta: 'எ.கா. 4' },
    message: { en: 'Message', ta: 'செய்தி' },
    messagePh: { en: 'Preferred month, dates or questions…', ta: 'விருப்பமான மாதம், தேதிகள் அல்லது கேள்விகள்…' },
    submit: { en: 'Send enquiry', ta: 'விசாரணையை அனுப்பவும்' },
    note: {
      en: 'We save your details only so our team can reply to this enquiry. We do not share them.',
      ta: 'இந்த விசாரணைக்குப் பதிலளிப்பதற்காக மட்டுமே உங்கள் விவரங்களைச் சேமிக்கிறோம். அவற்றை பகிர மாட்டோம்.',
    },
    email: { en: 'Email (optional)', ta: 'மின்னஞ்சல் (விருப்பம்)' },
    sending: { en: 'Sending…', ta: 'அனுப்பப்படுகிறது…' },
    successTitle: { en: 'Enquiry received', ta: 'விசாரணை பெறப்பட்டது' },
    waContinue: { en: 'Continue on WhatsApp', ta: 'வாட்ஸ்அப்பில் தொடர' },
    another: { en: 'Send another enquiry', ta: 'மற்றொரு விசாரணை அனுப்ப' },
    waIntro: {
      en: 'Assalamu Alaikum, I would like to enquire with Al Marwa Tours & Travels.',
      ta: 'அஸ்ஸலாமு அலைக்கும். அல் மர்வா டூர்ஸ் & டிராவல்ஸிடம் விசாரிக்க விரும்புகிறேன்.',
    },
    labels: {
      name: { en: 'Name', ta: 'பெயர்' },
      mobile: { en: 'Mobile', ta: 'கைபேசி' },
      interest: { en: 'Interested in', ta: 'விருப்பம்' },
      travellers: { en: 'Number of travellers', ta: 'பயணிகள்' },
      message: { en: 'Message', ta: 'செய்தி' },
      notSpecified: { en: 'Not specified', ta: 'குறிப்பிடப்படவில்லை' },
      shareDetails: { en: 'Please share details.', ta: 'விவரங்களை அனுப்பவும்.' },
    },
  },
};

export const FOOTER = {
  blurb: {
    en: 'Thoughtful travel assistance for your Hajj and Umrah journey. May your journey be blessed.',
    ta: 'உங்கள் ஹஜ் மற்றும் உம்ரா பயணத்திற்கான அக்கறையான பயண உதவி. உங்கள் பயணம் சிறப்பாக அமையட்டும்.',
  },
  quick: { en: 'Quick links', ta: 'விரைவு இணைப்புகள்' },
  services: { en: 'Our services', ta: 'எங்கள் சேவைகள்' },
  contact: { en: 'Contact', ta: 'தொடர்பு' },
  rights: { en: 'All rights reserved.', ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' },
  tagline: { en: 'Hajj & Umrah travel enquiries', ta: 'ஹஜ் மற்றும் உம்ரா பயண விசாரணைகள்' },
  admin: { en: 'Admin login', ta: 'நிர்வாகி உள்நுழைவு' },
};

export const OFFERS_UI = {
  heading: { en: 'Latest offers & updates', ta: 'சமீபத்திய சலுகைகள் & அறிவிப்புகள்' },
  snooze: { en: 'Don’t show for 7 days', ta: '7 நாட்களுக்கு காட்ட வேண்டாம்' },
  cta: { en: 'View packages', ta: 'பேக்கேஜ்களைப் பார்க்க' },
  close: { en: 'Close', ta: 'மூடு' },
};

export const UI = {
  brandSub: { en: 'Tours & Travels', ta: 'டூர்ஸ் & டிராவல்ஸ்' },
  enquire: { en: 'Enquire now', ta: 'விசாரிக்க' },
  switchTo: { en: 'தமிழ்', ta: 'English' },
  switchLabel: { en: 'Switch to Tamil', ta: 'Switch to English' },
  menu: { en: 'Menu', ta: 'மெனு' },
  whatsapp: { en: 'WhatsApp', ta: 'வாட்ஸ்அப்' },
  call: { en: 'Call us', ta: 'அழைக்க' },
  waGeneral: {
    en: 'Assalamu Alaikum, I would like to enquire about Al Marwa Hajj & Umrah services.',
    ta: 'அஸ்ஸலாமு அலைக்கும். அல் மர்வா ஹஜ் & உம்ரா சேவைகள் குறித்து விசாரிக்க விரும்புகிறேன்.',
  },
};

export const MAP_UI = {
  title: { en: 'Holy places in Makkah & Madinah', ta: 'மக்கா & மதீனாவின் புனிதத் தலங்கள்' },
  chooseCategory: { en: 'Choose the category', ta: 'வகையைத் தேர்ந்தெடுக்கவும்' },
  top: { en: 'Places to know', ta: 'அறிய வேண்டிய இடங்கள்' },
  all: { en: 'All categories', ta: 'அனைத்து வகைகள்' },
  directions: { en: 'Open in Google Maps', ta: 'கூகுள் மேப்சில் திறக்க' },
  ask: { en: 'Ask about Ziyarah', ta: 'ஜியாரத் பற்றி விசாரிக்க' },
  attribution: {
    en: 'Locations are approximate. Confirm with your group guide before travelling.',
    ta: 'இடங்கள் தோராயமானவை. பயணிக்கும் முன் உங்கள் குழு வழிகாட்டியிடம் உறுதிசெய்யவும்.',
  },
  waMessage: (place: string) => ({
    en: `Assalamu Alaikum. I would like to know about Ziyarah to ${place} with Al Marwa Tours & Travels.`,
    ta: `அஸ்ஸலாமு அலைக்கும். ${place} ஜியாரத் குறித்து அல் மர்வா டூர்ஸ் & டிராவல்ஸிடம் அறிய விரும்புகிறேன்.`,
  }),
};

export const GALLERY_UI = {
  prev: { en: 'Previous', ta: 'முந்தையது' },
  next: { en: 'Next', ta: 'அடுத்தது' },
  mapCta: { en: 'Explore the holy map', ta: 'புனித வரைபடத்தைப் பாருங்கள்' },
};

export const ABOUT_UI = {
  statsTitle: { en: 'Al Marwa in numbers', ta: 'எண்களில் அல் மர்வா' },
};

export const FOUNDER_UI = { title: { en: 'Meet our founder', ta: 'எங்கள் நிறுவனரை சந்தியுங்கள்' } };

export const TESTIMONIALS_UI = {
  title: { en: 'What our travellers say', ta: 'எங்கள் பயணிகள் கூறுவது' },
  intro: { en: 'Words from pilgrims we have helped plan their journey.', ta: 'பயணத்தைத் திட்டமிட நாங்கள் உதவிய பயணிகளின் வார்த்தைகள்.' },
  rating: { en: 'out of 5', ta: '5-க்கு' },
};

export const FAQ_UI = {
  title: { en: 'Frequently asked questions', ta: 'அடிக்கடி கேட்கப்படும் கேள்விகள்' },
  intro: { en: 'Quick answers before you message us.', ta: 'எங்களுக்கு எழுதும் முன் சில விரைவான பதில்கள்.' },
  ask: { en: 'Still have a question? Ask on WhatsApp', ta: 'இன்னும் கேள்வி உள்ளதா? வாட்ஸ்அப்பில் கேளுங்கள்' },
};

export const NEWSLETTER_UI = {
  title: { en: 'Join our newsletter', ta: 'எங்கள் செய்தி மடலில் இணையுங்கள்' },
  body: { en: 'Be the first to hear about new packages and updates.', ta: 'புதிய பேக்கேஜ்கள் மற்றும் அறிவிப்புகளை முதலில் அறியுங்கள்.' },
  placeholder: { en: 'Enter your email…', ta: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்…' },
  submit: { en: 'Subscribe', ta: 'சந்தா சேர' },
  sending: { en: 'Subscribing…', ta: 'சேர்க்கப்படுகிறது…' },
};

export const SERVICES_UI = { cta: { en: 'Enquire now', ta: 'விசாரிக்க' } };

export const HERO_PHOTOS = [
  { id: 'photo-1591604129939-f1efa4d9f7fa', alt: { en: 'Masjid an-Nabawi in Madinah', ta: 'மதீனாவின் மஸ்ஜிதுன் நபவி' } },
  { id: 'photo-1609599006353-e629aaabfeae', alt: { en: 'The Holy Qur’an', ta: 'திருக்குர்ஆன்' } },
  { id: 'photo-1519817650390-64a93db51149', alt: { en: 'A mosque at golden hour', ta: 'பொன்னிற ஒளியில் ஒரு பள்ளிவாசல்' } },
] satisfies { id: string; alt: { en: string; ta: string } }[];
