-- ============================================================
-- RoamAndRoutes — Postgres schema + RLS (PRD §8, §9)
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- Public read on published content; admin-only write;
-- inquiries readable by admins only.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type package_status as enum ('published', 'draft', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type departure_status as enum ('open', 'sold_out');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inquiry_status as enum ('New', 'Contacted', 'Confirmed', 'Closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type admin_role as enum ('owner', 'staff');
exception when duplicate_object then null; end $$;

-- ---------- Admin users (linked to auth.users) ----------
create table if not exists admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role admin_role not null default 'staff',
  created_at timestamptz not null default now()
);

-- Helper: is the current auth user an admin?
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

-- ---------- Packages ----------
create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  region text not null,
  type text not null,
  duration_days int not null,
  duration_nights int not null,
  price_from int not null,
  hero_image text,
  gallery jsonb not null default '[]',
  summary text,
  highlights jsonb not null default '[]',
  inclusions jsonb not null default '[]',
  exclusions jsonb not null default '[]',
  reel_urls jsonb not null default '[]',
  map_embed text,
  permit_note text,
  featured boolean not null default false,
  status package_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Itinerary days ----------
create table if not exists itinerary_days (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references packages (id) on delete cascade,
  day_number int not null,
  title text not null,
  description text,
  meals text,
  stay text,
  images jsonb not null default '[]',
  unique (package_id, day_number)
);

-- ---------- Departures ----------
create table if not exists departures (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references packages (id) on delete cascade,
  date date not null,
  total_seats int not null default 0,
  booked_seats int not null default 0,
  status departure_status not null default 'open'
);

-- ---------- Reviews ----------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references packages (id) on delete set null,
  author text not null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  source text not null default 'Manual',
  featured boolean not null default false,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Media assets ----------
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  package_id uuid references packages (id) on delete set null,
  type text not null default 'photo', -- 'photo' | 'reel_link'
  caption text,
  created_at timestamptz not null default now()
);

-- ---------- Inquiries ----------
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  travel_dates text,
  pax text,
  package_slug text,
  message text,
  status inquiry_status not null default 'New',
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- Blog posts ----------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text,
  cover_image text,
  tag text,
  read_minutes int not null default 5,
  published_at timestamptz
);

-- ---------- Site settings (singleton) ----------
create table if not exists site_settings (
  id int primary key default 1,
  whatsapp_number text,
  contact_email text,
  social_links jsonb not null default '{}',
  seo_defaults jsonb not null default '{}',
  road_status_note text,
  featured_package_ids jsonb not null default '[]',
  constraint singleton check (id = 1)
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table packages       enable row level security;
alter table itinerary_days enable row level security;
alter table departures     enable row level security;
alter table reviews        enable row level security;
alter table media_assets   enable row level security;
alter table inquiries      enable row level security;
alter table blog_posts     enable row level security;
alter table site_settings  enable row level security;
alter table admin_users    enable row level security;

-- Public read on published content -----------------------------
create policy "public read published packages" on packages
  for select using (status = 'published' or is_admin());

create policy "public read itinerary of published" on itinerary_days
  for select using (
    exists (select 1 from packages p where p.id = package_id and (p.status = 'published' or is_admin()))
  );

create policy "public read departures" on departures for select using (true);
create policy "public read visible reviews" on reviews
  for select using (visible = true or is_admin());
create policy "public read media" on media_assets for select using (true);
create policy "public read published blog" on blog_posts
  for select using (published_at is not null or is_admin());
create policy "public read settings" on site_settings for select using (true);

-- Admin-only writes -------------------------------------------
create policy "admin write packages" on packages for all using (is_admin()) with check (is_admin());
create policy "admin write itinerary" on itinerary_days for all using (is_admin()) with check (is_admin());
create policy "admin write departures" on departures for all using (is_admin()) with check (is_admin());
create policy "admin write reviews" on reviews for all using (is_admin()) with check (is_admin());
create policy "admin write media" on media_assets for all using (is_admin()) with check (is_admin());
create policy "admin write blog" on blog_posts for all using (is_admin()) with check (is_admin());
create policy "admin write settings" on site_settings for all using (is_admin()) with check (is_admin());

-- Inquiries: anyone can create (public form), admins read/update ----
create policy "public create inquiry" on inquiries for insert with check (true);
create policy "admin read inquiries" on inquiries for select using (is_admin());
create policy "admin update inquiries" on inquiries for update using (is_admin()) with check (is_admin());

-- Admin users: readable by admins only
create policy "admin read admin_users" on admin_users for select using (is_admin());

-- ---------- updated_at trigger ----------
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_packages_touch on packages;
create trigger trg_packages_touch before update on packages
  for each row execute function touch_updated_at();
