// DEMO DATA for development only: realistic-looking groups, customers, enquiries and newsletter signups.
// Every person here has an email ending in @sample.invalid (a domain that can never receive mail) and every
// group's notes start with "DEMO:", so `npm run db:clear:demo` removes exactly this data and nothing real.
// Safe to re-run: each table is only filled while it has no demo rows.
import { like } from 'drizzle-orm';
import { db, schema } from './_db.mts';

const DEMO = '%@sample.invalid';
const ago = (days: number, hour = 11) => {
  const d = new Date(Date.now() - days * 86_400_000);
  d.setHours(hour, (days * 7) % 60, 0, 0);
  return d;
};

// ---------- groups + customers ----------
const existingCustomers = await db.select({ id: schema.customers.id }).from(schema.customers).where(like(schema.customers.email, DEMO)).limit(1);
if (existingCustomers.length === 0) {
  // Demo groups carry "DEMO:" at the start of their notes so the clear script can find them.
  const groupRows: (typeof schema.travelGroups.$inferInsert)[] = [
    { name: 'Umrah Oct 2026', kind: 'umrah', departureDate: '2026-10-10', returnDate: '2026-10-24', departureCity: 'Chennai', capacity: 40, notes: 'DEMO: completed batch' },
    { name: 'Umrah Dec 2026', kind: 'umrah', departureDate: '2026-12-18', returnDate: '2026-12-30', departureCity: 'Chennai', capacity: 40, notes: 'DEMO: winter holidays batch' },
    { name: 'Ziyarah Jan 2027', kind: 'ziyarah', departureDate: '2027-01-15', returnDate: '2027-01-20', departureCity: 'Chennai', capacity: 30, notes: 'DEMO: Makkah and Madinah ziyarah' },
    { name: 'Umrah Ramadan 2027', kind: 'umrah', departureDate: '2027-02-20', returnDate: '2027-03-06', departureCity: 'Chennai', capacity: 45, notes: 'DEMO: Ramadan batch, most popular' },
    { name: 'Umrah April 2027', kind: 'umrah', departureDate: '2027-04-10', returnDate: '2027-04-24', departureCity: 'Chennai', capacity: 40, notes: 'DEMO: after Eid batch' },
    { name: 'Hajj 2027 Group A', kind: 'hajj', departureDate: '2027-05-12', returnDate: '2027-06-20', departureCity: 'Chennai', capacity: 25, notes: 'DEMO: first Hajj group' },
    { name: 'Hajj 2027 Group B', kind: 'hajj', departureDate: '2027-05-14', returnDate: '2027-06-22', departureCity: 'Chennai', capacity: 25, notes: 'DEMO: second Hajj group, still empty' },
  ];
  const existingGroups = await db.select({ id: schema.travelGroups.id, name: schema.travelGroups.name }).from(schema.travelGroups);
  const missing = groupRows.filter((g) => !existingGroups.some((x) => x.name === g.name));
  if (missing.length) await db.insert(schema.travelGroups).values(missing);
  const groups = await db.select({ id: schema.travelGroups.id, name: schema.travelGroups.name }).from(schema.travelGroups);
  const gid = (name: string) => {
    const g = groups.find((x) => x.name === name);
    if (!g) throw new Error(`group missing: ${name}`);
    return g.id;
  };

  const pkgs = await db.select({ id: schema.packages.id, name: schema.packages.nameEn }).from(schema.packages);
  const pkg = (name: string) => pkgs.find((p) => p.name === name);
  const U = pkg('15-Day Umrah Group');
  const C = pkg('Custom Umrah Plan');
  const H = pkg('Hajj Journey');
  const Z = pkg('Makkah & Madinah Ziyarah');
  const link = (slug: string) => `https://drive.google.com/drive/folders/sample-${slug}`;

  type Row = Omit<typeof schema.customers.$inferInsert, 'packageId' | 'packageName' | 'groupId'> & { p?: { id: number; name: string }; g: string };
  const rows: Row[] = [
    { name: 'Abdul Rahman S', gender: 'male', dateOfBirth: '1978-03-12', phone: '+91 90000 10101', email: 'abdul.rahman@sample.invalid', address: '14, Mosque Street, Melapalayam, Tirunelveli', emergencyContact: 'Fathima Begum (wife) +91 90000 20101', passportNumber: 'M1234501', passportExpiry: '2031-08-14', p: U, g: 'Umrah Ramadan 2027', travellers: 4, visaStatus: 'applied', documentsUrl: link('rahman-family'), totalAmount: 500000, paidAmount: 200000, status: 'documents', notes: 'Family of four. Wants rooms close to the Haram. Parents are senior citizens, wheelchair needed at the airport.', createdAt: ago(34) },
    { name: 'Mohamed Ismail K', gender: 'male', dateOfBirth: '1965-11-02', phone: '+91 90000 10102', email: 'ismail.k@sample.invalid', address: '27, Periya Pallivasal Street, Kayalpattinam, Thoothukudi', emergencyContact: 'Sulthan K (son) +91 90000 20102', passportNumber: 'K7654302', passportExpiry: '2027-06-30', p: U, g: 'Umrah Ramadan 2027', travellers: 2, visaStatus: 'not_started', totalAmount: 250000, paidAmount: 125000, status: 'documents', notes: 'Passport expires mid-2027, ask them to renew before the visa is submitted.', createdAt: ago(29) },
    { name: 'Noorjahan Banu', gender: 'female', dateOfBirth: '1972-07-21', phone: '+91 90000 10103', whatsapp: '+91 90000 30103', email: 'noorjahan.banu@sample.invalid', address: '9, Jinnah Road, Vaniyambadi, Tirupathur', emergencyContact: 'Abdul Latheef (husband) +91 90000 20103', passportNumber: 'N2468103', passportExpiry: '2032-02-10', p: U, g: 'Umrah Ramadan 2027', travellers: 1, visaStatus: 'approved', totalAmount: 125000, paidAmount: 125000, status: 'confirmed', notes: 'Travelling with a women-only group. Fully paid.', createdAt: ago(48) },
    { name: 'Syed Ibrahim', gender: 'male', dateOfBirth: '1983-01-30', phone: '+91 90000 10104', email: 'syed.ibrahim@sample.invalid', address: '56, Town Hall Road, Coimbatore', emergencyContact: 'Nafeesa Syed (wife) +91 90000 20104', passportNumber: 'S1357904', passportExpiry: '2033-09-22', p: C, g: 'Umrah Dec 2026', travellers: 3, visaStatus: 'approved', documentsUrl: link('syed-ibrahim'), totalAmount: 450000, paidAmount: 450000, status: 'confirmed', notes: 'Custom plan: 6 nights Makkah, 6 nights Madinah. Needs a vegetarian-friendly hotel.', createdAt: ago(52) },
    { name: 'Haja Mohideen', gender: 'male', dateOfBirth: '1959-09-09', phone: '+91 90000 10105', email: 'haja.mohideen@sample.invalid', address: '3, Kazimar Street, Madurai', emergencyContact: 'Ameena Beevi (wife) +91 90000 20105', passportNumber: 'H9081705', passportExpiry: '2028-01-05', p: H, g: 'Hajj 2027 Group A', travellers: 2, visaStatus: 'not_started', documentsUrl: link('haja-mohideen'), totalAmount: 1300000, paidAmount: 300000, status: 'documents', notes: 'Second Hajj for the wife. Medical certificate to be collected.', createdAt: ago(41) },
    { name: 'Rukkiya Banu', gender: 'female', dateOfBirth: '1964-04-17', phone: '+91 90000 10106', email: 'rukkiya.banu@sample.invalid', address: '21, Salai Road, Tiruchirappalli', emergencyContact: 'Mohamed Rafi (son) +91 90000 20106', passportNumber: 'R5566106', passportExpiry: '2030-11-19', p: H, g: 'Hajj 2027 Group A', travellers: 1, visaStatus: 'not_started', totalAmount: 650000, paidAmount: 100000, status: 'applied', notes: 'Needs a mahram. Son will travel on the same group; confirm his booking.', createdAt: ago(6) },
    { name: 'Shahul Hameed', gender: 'male', dateOfBirth: '1970-12-01', phone: '+91 90000 10107', email: 'shahul.hameed@sample.invalid', address: '88, Fairlands, Salem', emergencyContact: 'Jainulabdeen (brother) +91 90000 20107', passportNumber: 'S3344107', passportExpiry: '2029-03-30', p: H, g: 'Hajj 2027 Group A', travellers: 2, visaStatus: 'applied', totalAmount: 1300000, paidAmount: 650000, status: 'documents', notes: 'Half payment received by bank transfer.', createdAt: ago(37) },
    { name: 'Zubair Ahmed', gender: 'male', dateOfBirth: '1990-06-25', phone: '+91 90000 10108', whatsapp: '+91 90000 30108', email: 'zubair.ahmed@sample.invalid', address: '12, Big Street, Triplicane, Chennai', emergencyContact: 'Ahmed Basha (father) +91 90000 20108', passportNumber: 'Z7788108', passportExpiry: '2034-04-12', p: U, g: 'Umrah Dec 2026', travellers: 1, visaStatus: 'approved', totalAmount: 125000, paidAmount: 125000, status: 'confirmed', notes: 'First Umrah. Wants a short orientation call before travel.', createdAt: ago(25) },
    { name: 'Ayesha Siddiqa', gender: 'female', dateOfBirth: '1995-02-14', phone: '+91 90000 10109', email: 'ayesha.siddiqa@sample.invalid', address: '45, Frazer Town, Bengaluru', emergencyContact: 'Imran Khan (husband) +91 90000 20109', passportNumber: 'A1122109', passportExpiry: '2027-03-01', p: U, g: 'Umrah Dec 2026', travellers: 2, visaStatus: 'applied', totalAmount: 250000, paidAmount: 125000, status: 'documents', notes: 'Passport expires in March 2027, too close to travel. Must be renewed before the visa goes through.', createdAt: ago(14) },
    { name: 'Basheer Ahmed', gender: 'male', dateOfBirth: '1968-08-08', phone: '+91 90000 10110', email: 'basheer.ahmed@sample.invalid', address: '7, Brough Road, Erode', emergencyContact: 'Sakeena Basheer (wife) +91 90000 20110', passportNumber: 'B6677110', passportExpiry: '2031-10-02', p: Z, g: 'Ziyarah Jan 2027', travellers: 5, visaStatus: 'approved', totalAmount: 125000, paidAmount: 125000, status: 'confirmed', notes: 'Five family members, adding Ziyarah after their Umrah.', createdAt: ago(20) },
    { name: 'Nasreen Banu', gender: 'female', dateOfBirth: '1980-10-10', phone: '+91 90000 10111', email: 'nasreen.banu@sample.invalid', address: '33, Masjid Road, Ambur, Tirupathur', emergencyContact: 'Abdul Salam (husband) +91 90000 20111', p: Z, g: 'Ziyarah Jan 2027', travellers: 3, visaStatus: 'not_started', totalAmount: 75000, paidAmount: 25000, status: 'applied', notes: 'Advance paid. Passport copies to be collected.', createdAt: ago(4) },
    { name: 'Sheik Abdullah', gender: 'male', dateOfBirth: '1975-05-19', phone: '+91 90000 10112', email: 'sheik.abdullah@sample.invalid', address: '60, Kongu Nagar, Tiruppur', p: U, g: 'Umrah April 2027', travellers: 2, visaStatus: 'not_started', totalAmount: 250000, paidAmount: 0, status: 'applied', notes: 'Asked for April dates. Call back next week.', createdAt: ago(2) },
    { name: 'Thameem Ansari', gender: 'male', dateOfBirth: '1962-03-03', phone: '+91 90000 10113', email: 'thameem.ansari@sample.invalid', address: '18, Anna Salai, Chennai', emergencyContact: 'Sabira Ansari (wife) +91 90000 20113', passportNumber: 'T8899113', passportExpiry: '2032-12-15', p: U, g: 'Umrah Oct 2026', travellers: 2, visaStatus: 'approved', totalAmount: 250000, paidAmount: 250000, status: 'completed', notes: 'Returned safely. Very happy, happy to give a review.', createdAt: ago(85) },
    { name: 'Rahmath Nisha', gender: 'female', dateOfBirth: '1969-12-12', phone: '+91 90000 10114', email: 'rahmath.nisha@sample.invalid', address: '5, Goripalayam, Madurai', emergencyContact: 'Mohamed Ali (son) +91 90000 20114', passportNumber: 'R4455114', passportExpiry: '2033-07-07', p: U, g: 'Umrah Oct 2026', travellers: 3, visaStatus: 'approved', totalAmount: 375000, paidAmount: 375000, status: 'completed', notes: 'Travelled with her two sisters.', createdAt: ago(88) },
    { name: 'Kader Mohideen', gender: 'male', dateOfBirth: '1981-07-07', phone: '+91 90000 10115', email: 'kader.mohideen@sample.invalid', address: '102, Race Course Road, Coimbatore', p: U, g: 'Umrah Ramadan 2027', travellers: 2, visaStatus: 'not_started', totalAmount: 250000, paidAmount: 50000, status: 'cancelled', notes: 'Postponed to next year because of work. Refund of ₹25,000 pending.', createdAt: ago(30) },
  ];
  await db.insert(schema.customers).values(rows.map(({ p, g, ...r }) => ({ ...r, groupId: gid(g), packageId: p?.id ?? null, packageName: p?.name ?? '' })));
  console.log(`groups: added ${missing.length}; customers: added ${rows.length} demo customers`);
} else {
  console.log('customers: demo rows already present, skipped');
}

// ---------- enquiries ----------
const existingEnquiries = await db.select({ id: schema.enquiries.id }).from(schema.enquiries).where(like(schema.enquiries.email, DEMO)).limit(1);
if (existingEnquiries.length === 0) {
  type Enq = typeof schema.enquiries.$inferInsert;
  const e = (x: Omit<Enq, 'ipHash'>): Enq => ({ ...x, ipHash: '' });
  const rows: Enq[] = [
    e({ name: 'Mohammed Yusuf', phone: '+91 90000 10201', email: 'mohammed.yusuf@sample.invalid', interest: 'umrah', travellers: 2, message: 'Assalamu alaikum. We are 2 adults and would like to go for Umrah in April after Eid. Please share dates and price.', locale: 'en', status: 'new', createdAt: ago(1, 9) }),
    e({ name: 'Sulaiman A', phone: '+91 90000 10202', email: 'sulaiman.a@sample.invalid', interest: 'hajj', travellers: 1, message: 'Interested in Hajj 2027. What documents are needed and how do we register?', locale: 'en', status: 'new', createdAt: ago(2, 18) }),
    e({ name: 'அப்துல் காதர்', phone: '+91 90000 10203', email: 'abdul.khader@sample.invalid', interest: 'family_umrah', travellers: 6, message: 'குடும்பத்துடன் உம்ரா செல்ல விரும்புகிறோம். மொத்தம் 6 பேர். ஜனவரி மாதத்தில் தேதிகள் உள்ளனவா?', locale: 'ta', status: 'new', createdAt: ago(3, 14) }),
    e({ name: 'Meeran Maideen', phone: '+91 90000 10204', email: 'meeran.maideen@sample.invalid', interest: 'family_umrah', travellers: 5, message: 'My mother is 72 and needs wheelchair assistance. Is that possible in your package?', locale: 'en', status: 'new', createdAt: ago(0, 8) }),
    e({ name: 'Nazeera Begum', phone: '+91 90000 10205', email: 'nazeera.begum@sample.invalid', interest: 'ziyarah', travellers: 4, message: 'Looking for a Madinah ziyarah add-on for our group of four.', locale: 'en', status: 'contacted', createdAt: ago(7, 12) }),
    e({ name: 'Ilyas Ahmed', phone: '+91 90000 10206', email: 'ilyas.ahmed@sample.invalid', interest: 'umrah', travellers: 1, message: 'Can I join an existing group from Bengaluru?', locale: 'en', status: 'contacted', createdAt: ago(9, 16) }),
    e({ name: 'ஜமீலா பேகம்', phone: '+91 90000 10207', email: 'jameela.begum@sample.invalid', interest: 'umrah', travellers: 2, message: 'ரமலானில் உம்ரா பேக்கேஜ் விலை என்ன? தங்குமிடம் ஹரம் அருகில் கிடைக்குமா?', locale: 'ta', status: 'contacted', createdAt: ago(11, 10) }),
    e({ name: 'Farook Basha', phone: '+91 90000 10208', email: 'farook.basha@sample.invalid', interest: 'other', travellers: null, message: 'Do you help with the visa only?', locale: 'en', status: 'closed', createdAt: ago(20, 15) }),
  ];
  await db.insert(schema.enquiries).values(rows);
  console.log(`enquiries: added ${rows.length} demo enquiries`);
} else {
  console.log('enquiries: demo rows already present, skipped');
}

// ---------- newsletter ----------
const existingSubs = await db.select({ id: schema.subscribers.id }).from(schema.subscribers).where(like(schema.subscribers.email, DEMO)).limit(1);
if (existingSubs.length === 0) {
  const names: [string, 'en' | 'ta'][] = [
    ['ismail.k', 'en'], ['noorjahan.banu', 'ta'], ['zubair.ahmed', 'en'], ['ayesha.siddiqa', 'en'], ['basheer.ahmed', 'ta'],
    ['rahmath.nisha', 'ta'], ['thameem.ansari', 'en'], ['mohammed.yusuf', 'en'], ['jameela.begum', 'ta'], ['sulaiman.a', 'en'],
  ];
  await db.insert(schema.subscribers).values(
    names.map(([n, locale], i) => ({ email: `news.${n}@sample.invalid`, locale, ipHash: '', createdAt: ago(i * 5 + 1, 13) })),
  );
  console.log(`subscribers: added ${names.length} demo subscribers`);
} else {
  console.log('subscribers: demo rows already present, skipped');
}
