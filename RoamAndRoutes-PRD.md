# RoamAndRoutes — Product Requirements Document
North Bengal travel agency website (formerly "Shingolia Hills") · First paying client project

---

## 1. Overview & Goals

**What it is:** A public-facing travel agency website + admin backend for a North Bengal tour operator covering Darjeeling, Sikkim, Dooars, and Kalimpong.

**Primary goal:** Convert visitors into WhatsApp inquiries faster and more credibly than any existing North Bengal competitor. Current competitors (north-bengal.com, northbengaltourism.com, and others) run on thin SEO copy, phone-only booking, and in at least one case unfinished placeholder text. The bar is low — real photography, real itineraries, real reviews, and a self-serve inquiry flow are enough to stand out.

**Secondary goal:** The client (non-technical business owner) manages the entire business — packages, leads, reviews, photos — without calling a developer for routine updates.

---

## 2. Users & Personas

| Persona | Needs |
|---|---|
| **Traveler** (primary) | Browse/compare packages, trust the agency is legitimate, reach a human fast via WhatsApp |
| **Client / Owner** (admin) | Add/edit packages, manage leads, upload photos & reels, update seasonal content |
| **Staff** (optional, later) | Content-only access if the client hires help |

---

## 3. Design System

Reference: Traavellio (Framer marketplace template) — used as **visual/structural inspiration only**, rebranded and rebuilt from scratch in our own Next.js codebase. Nothing is copied wholesale (it's a paid commercial template).

### Colors

| Role | Value | Usage |
|---|---|---|
| Deep teal (heading/accent) | `#012830` → `#033d4a` | Headlines on light sections, filled CTA buttons |
| Near-black | `#000` / `#111` | Hero, footer, "why choose us" section backgrounds |
| Warm cream/white | `#faf8f0` / `#fff` | About, listings, itinerary sections |
| Body text (light bg) | gray `#545454`–`#7d7d7d` | Paragraph copy |
| Body text (dark bg) | white | Hero copy, footer, nav |

Sections alternate **dark → light → dark** down each page. Dark = emotional/photo-led (hero, destination spotlight, trust section). Light = informational (about, listings, itinerary). Keep this rhythm — don't flatten to one background.

### Typography

- **Display font:** Cal Sans (or equivalent rounded geometric sans) — all headlines, package titles, day labels
- **Body font:** Inter — paragraphs, nav, buttons, detail values
- Headlines: large, bold, tight tracking. Body: small, gray, high contrast against headline weight.

### Signature CTA — "Pill-Arrow" button

A pill-shaped text label fused with a separate circular arrow-icon button, same shape everywhere, color-flipped by section (white pill + black arrow on dark backgrounds; teal pill + white arrow on light backgrounds). This is the most repeated UI element on the reference site — treat it as RoamAndRoutes' core CTA component.

### Card patterns to rebuild

| Pattern | Description |
|---|---|
| Tilted photo scatter | 3–4 rounded photos at slight rotation angles, layered over hero/spotlight images — likely animated on load/scroll |
| Package card | Full-bleed photo, rounded corners, semi-transparent duration pill (top-left), title + price below |
| Destination spotlight | Large photo + 2–3 tilted accent thumbnails, name + tagline overlaid bottom-left, arrow-icon link top-right |
| Feature icon-list | Outline icon + bold heading + gray subtext, stacked with thin dividers |
| Trip Details card | Light-gray rounded card, icon+label+value rows (Duration/Departure/Group Size/Price/Inclusions), sticky on scroll, CTA button anchored at bottom |
| Itinerary accordion | Light-gray rows, collapsed by default, "+" to expand each day |
| Trust-stat row | Icon+number pairs (reviews, traveler count) directly under hero CTA |

### Other recurring elements

- Infinite horizontal marquee strip under the hero (emoji + label + dot separator, looping)
- Thin outline icons throughout — never filled
- Trust signals placed at the decision point, not buried on a separate page

---

## 4. Site Map & Page-by-Page Breakdown

Adapted from the reference site's structure, with North Bengal content swapped in.

### 4.1 Home
1. **Hero** (dark) — tilted photo scatter (Darjeeling tea gardens, Sikkim peaks, Dooars wildlife, Kalimpong hills), headline + subhead, Pill-Arrow "Book a Trip" CTA, trust-stat row (reviews / travelers served / years active)
2. **Marquee strip** — 🚗 Transfers & Rentals · ✈️ Custom Tours · 🌍 North Bengal Destinations · 🏔️ Trekking & Homestays · 🎫 Permit Assistance
3. **About intro** (light, two-column) — short "who we are" copy + photo, "Know More" CTA
4. **Featured destinations** (dark) — spotlight cards: Darjeeling, Sikkim, Dooars, Kalimpong
5. **Featured packages** (light) — package cards with duration pill, price, title
6. **Why choose us** (dark) — icon-list: Authentic Experiences, Local Expertise, Trusted Stays, Permit Assistance — next to a real trip photo
7. **Reviews** (light) — real Google reviews, featured ones pulled by admin
8. **Footer** — Pages / Destinations / Legal / Social / WhatsApp

### 4.2 About
Hero + story section, what makes the agency trustworthy (years active, local guides, permits handled), team photo if available.

### 4.3 Destinations (listing)
Grid of destination spotlight cards — Darjeeling, Sikkim, Dooars, Kalimpong — each linking to a destination detail page.

### 4.4 Destination detail (e.g. `/destinations/sikkim`)
Region overview, best season, permit notes (Nathula/Tsomgo), gateway info (Bagdogra/NJP), related packages grid.

### 4.5 Packages / Tours (listing)
Filterable grid (region / duration / budget / type). Each card: photo, duration pill, title, price.

### 4.6 Package detail (e.g. `/tours/darjeeling-sikkim-explorer`)
1. Hero image with title overlay
2. Trip Overview — short descriptive paragraph
3. Trip Details card (sticky) — Duration, Departure dates + seats left, Group Size, Price, Inclusions, **WhatsApp CTA + "Book a Trip"**
4. Trip Highlights — bullet list
5. Detailed Itinerary — day-by-day accordion (Day 1: Arrival & Orientation, Day 2: ..., etc.)
6. Photo gallery
7. Embedded Instagram Reel(s)
8. Google Maps embed
9. Package-specific reviews
10. Related packages

### 4.7 Blog / Destination Guides
SEO content — "Best time to visit Sikkim," "Nathula Pass permit guide," etc. Every competitor is weak here.

### 4.8 Contact / Inquiry
Short form (name, dates, pax, WhatsApp), sticky WhatsApp CTA, map, contact details.

### 4.9 Admin Panel (see Section 7 for full spec)
Dashboard → Packages → Departures → Inquiries → Reviews → Media → Blog → Settings.

---

## 5. Public Site — Functional Requirements (MoSCoW)

**Must have (MVP):**
- Package listing + detail pages (photos, day-by-day itinerary, pricing, inclusions/exclusions, stays info)
- Real reviews pulled from Google
- Instagram Reels embedded per package
- WhatsApp click-to-chat — sticky + inline on every page
- Short inquiry form (name, dates, pax, WhatsApp)
- Google Maps embed per destination
- Mobile-first, full content parity with desktop

**Should have (fast follow):**
- Fixed departure dates with live seat count ("Only 3 spots left")
- Filterable package grid (region/duration/budget/type)
- Trust block near every CTA
- Blog/SEO content

**Could have (later):**
- AI-assisted itinerary suggestions
- Bengali/Hindi/English language toggle
- Save/wishlist packages

---

## 6. North Bengal-Specific Content Requirements

- **Permit info** — Tsomgo (Changu) Lake, Nathula Pass, and parts of North Sikkim require permits even though Sikkim itself generally doesn't for Indian citizens. Surface this on relevant package/destination pages, not just an FAQ.
- **Season calendar per destination** — snowfall months, monsoon closures, best-visit windows
- **Altitude advisory** for high-altitude treks (e.g. Sandakphu)
- **Monsoon/landslide advisory** for hill roads (roughly June–September) — admin should be able to post a current road-status note seasonally
- **Gateway info** — Bagdogra Airport / NJP railway station as standard entry points
- **Dooars wildlife/eco-tourism** — jeep safaris (Gorumara, Jaldapara, Chapramari)
- **Darjeeling tea garden tourism** — tea estate visits/stays as a category
- **Darjeeling Himalayan Railway (toy train)** — UNESCO World Heritage status, worth a featured page
- **Homestay/rural tourism** — Kalimpong/Dooars/offbeat Sikkim villages, separate from hotel stays

Flag: verify current permit rules/fees before publishing — these change.

---

## 7. Admin Panel — Functional Requirements

| Module | Capabilities |
|---|---|
| Package/Itinerary Manager | Create/edit/archive packages; day-by-day itinerary editor (day, description, meals, stay, images); pricing + inclusions/exclusions; region/tag/duration/budget; mark "featured" |
| Departure/Date Manager | Fixed departure dates per package; total vs. booked seats (auto "X spots left"); mark sold out |
| Booking/Inquiry Manager | Inbox/kanban (New → Contacted → Confirmed → Closed); notes per lead; one-click WhatsApp reply; filter by date/package |
| Reviews Manager | Add/edit/hide reviews; manual or Google pull-in; mark "featured" |
| Media Library | Upload to Cloudflare R2; organize by package/destination; paste Instagram Reel URL to attach |
| Content/Blog Manager | Create/edit blog + destination-guide pages |
| Site Settings | WhatsApp number, contact email, social links, homepage featured packages, SEO defaults |
| Notifications | Email (Resend) alert on new inquiry |
| Admin Users & Roles | Owner (full access) + optional Staff (content-only) via Supabase Auth |
| Analytics *(should-have)* | Page views/package, inquiry conversion, traffic sources — start with a Plausible/GA embed rather than custom-built |

---

## 8. Data Model (high-level entities)

- **Package** — title, region, duration, price, inclusions, exclusions, tags, featured, status
- **ItineraryDay** — package_id, day_number, title, description, meals, stay, images[]
- **Departure** — package_id, date, total_seats, seats_booked, status
- **Review** — package_id (nullable), author, rating, text, source, featured, visible
- **MediaAsset** — url (R2), package_id (nullable), type (photo/reel_link), caption
- **Inquiry** — name, whatsapp, travel_dates, pax, package_id (nullable), status, notes, created_at
- **AdminUser** — email, role (owner/staff)
- **BlogPost** — title, slug, body, cover_image, published_at
- **SiteSettings** — singleton: whatsapp_number, contact_email, social_links, seo_defaults

---

## 9. Non-Functional Requirements

- Mobile-first, full parity with desktop content
- Fast Core Web Vitals (Cloudflare Images Transformations for optimization)
- Supabase RLS: public read-only on published content, admin-only write, inquiries admin-readable only
- Booking/inquiry reachable within 3 clicks from any public page
- SEO-friendly URLs and meta per package/blog/destination page

---

## 10. Tech Architecture

Next.js (public site + `/admin` route group, Supabase Auth-protected) · Supabase (Postgres + Auth + RLS) · Cloudflare R2 + Images Transformations (media) · Official Instagram embeds (no self-hosted video) · Google Maps Embed API · Resend (email) · wa.me (WhatsApp deep links) · Netlify (hosting) · Bunny Stream reserved for possible future self-hosted video.

**Design workflow:** Before touching any component, clone and fully read: `google-labs-code/stitch-skills`, `nextlevelbuilder/ui-ux-pro-max-skill`, `pbakaus/impeccable`, and the animation repo (confirm: `freshtechbro/claudedesignskills` vs `motiondivision/motion`). Scaffold via Stitch MCP first, use 21st.dev MCP for animation/interaction polish.

---

## 11. Roadmap / Phases

- **Phase 0 (foundation):** DB schema, admin auth, basic package CRUD
- **Phase 1 (public MVP):** All "Must have" items (Section 5) + package/media/inquiry admin
- **Phase 2:** Reviews manager, departure/seat manager, notifications, blog manager
- **Phase 3:** Roles, analytics, filterable grid, trust block, AI itinerary suggestions later

---

## 12. Open Items

- Animation repo: `freshtechbro/claudedesignskills` (project notes) vs `motiondivision/motion` (standing preference) — unresolved
- Language toggle (Bengali/Hindi/English) — decide before Phase 0, affects data model
- Real destination/package photography — reference site's imagery is licensed stock, not usable
