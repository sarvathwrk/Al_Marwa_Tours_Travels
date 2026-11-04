# Al Marwa Tours & Travels

Next.js 16 (App Router) site for Hajj / Umrah / Ziyarah enquiries, in English and Tamil, with a small admin area.

- Public site: `/en`, `/ta` (a bare `/` redirects by saved choice or browser language)
- Holy places map: `/en/map`, `/ta/map` (Leaflet + OpenStreetMap, no API key)
- Admin: `/admin` (login link is in the site footer only)

## Stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS 4 · Neon Postgres · Drizzle ORM · Zod

## Setup

```bash
cp .env.example .env        # fill in POSTGRES_URL and AUTH_SECRET (openssl rand -hex 32)
npm install
npm run db:migrate          # create tables
npm run db:seed             # contact details + 3 starter packages (prices blank)
npm run admin:create -- <username> <password-min-10-chars>
npm run dev                 # http://localhost:3009
```

## Database

Schema lives in `db/schema.ts`. After changing it:

```bash
npm run db:generate         # writes a new SQL file in db/migrations
npm run db:migrate          # applies it
```

Tables: `packages` (INR prices as whole rupees, `NULL` = "Enquire for price"), `site_settings` (single row), `offers`, `admins`.

## Admin

Username and password are stored in the `admins` table (scrypt hash). Manage packages, the offers popup,
contact details and your own login at `/admin`. Five wrong passwords lock that account for 15 minutes.
Forgot the password: `npm run admin:create -- <username> <new-password>` resets it and signs out all sessions.

## i18n

Routes are `app/[lang]/...`. Page copy is in `lib/content.ts` (English and Tamil side by side).
Package, offer and contact content has separate English and Tamil fields in the admin; Tamil falls back to English when blank.

## Checks

```bash
npm run typecheck
npm run build
```
