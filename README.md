# RoamAndRoutes

North Bengal travel agency website — a design-led public site plus a Supabase-backed admin panel. Covers Darjeeling, Sikkim, Dooars and Kalimpong.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. The admin panel is at http://localhost:3000/admin.

> The site runs fully in **demo mode** with no configuration — it reads seeded North Bengal content from `src/data/`. Admin is open in demo mode. Add Supabase keys (below) to enable real auth + persistence.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Environment

Copy `.env.example` to `.env` and fill in as you connect services:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
INQUIRY_NOTIFY_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=919000000000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Everything degrades gracefully: without Supabase the site uses seed data and the admin is open; without Resend, inquiry emails are skipped but the WhatsApp flow always works.

## Database (Supabase)

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql` then `supabase/seed.sql`.
3. Create an Auth user for the owner, then grant admin access:

   ```sql
   insert into admin_users (id, email, role)
   values ('<auth-user-uuid>', 'owner@roamandroutes.in', 'owner');
   ```

4. Add the Supabase URL + keys to `.env`. The `/admin` route group is now gated by real auth (see `src/middleware.ts`).

RLS is configured for public read on published content, admin-only writes, and admin-only inquiry reads.

## Project structure

```
src/
  app/
    (site)/            Public site (home, about, destinations, tours, blog, contact)
    admin/             Admin panel (dashboard, packages, departures, inquiries, reviews, media, blog, settings)
    api/inquiry/       Inquiry intake → Supabase + Resend
  components/
    ui/                Design system (PillArrow, PhotoScatter, Marquee, TripDetailsCard, ItineraryAccordion, …)
    cards/             PackageCard, DestinationSpotlight, ReviewCard
    sections/          Hero, TourFilter, InquiryForm
    layout/            Navbar, Footer
    admin/             AdminShell, PackageEditor, InquiryKanban
  data/                Seed content (destinations, packages, reviews, blog)
  lib/                 site config, utils, types, Supabase clients
supabase/              schema.sql + seed.sql
```

## Design system

- **Colours:** deep teal `#012830`→`#033d4a`, near-black surfaces, warm cream `#faf8f0`. Sections alternate dark → light → dark.
- **Type:** Cal Sans (display) + Inter (body).
- **Signature CTA:** the Pill-Arrow button — a pill label fused with a circular arrow, colour-flipped per section.
- **Motion:** Framer Motion scroll reveals, tilted photo scatter, infinite marquee — all respect `prefers-reduced-motion`.

Tokens live in `src/app/globals.css` under `@theme`.

## Connecting the admin to real data

The admin editors (`PackageEditor`, `InquiryKanban`, settings) manage local state with clearly marked `TODO` seams. To persist, wire each handler to a Supabase call using the server client in `src/lib/supabase/server.ts` (reads) and `src/lib/supabase/admin.ts` (privileged writes).

## Deploy

Hosted on Netlify per the PRD. Set the environment variables in the Netlify dashboard, point the build command to `npm run build`, and connect your Supabase project.

## Notes

- Images currently use Unsplash placeholders. Swap in real photography via the admin Media library (Cloudflare R2) before launch.
- **Verify current permit rules and fees** (Tsomgo, Nathula, North Sikkim) before publishing — these change seasonally.
