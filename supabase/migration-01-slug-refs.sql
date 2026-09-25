-- ============================================================
-- Migration 01 — reference packages by slug in reviews and media
--
-- The application works in slugs throughout (URLs, admin forms, the
-- public site). Storing a UUID foreign key here forced a slug->id
-- lookup on every read and write for no benefit, so these two tables
-- now carry package_slug directly.
--
-- Safe to run more than once.
-- ============================================================

-- ---------- reviews ----------
alter table reviews add column if not exists package_slug text;

-- Backfill from the existing uuid reference, if that column is still present.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'package_id'
  ) then
    update reviews r
      set package_slug = p.slug
      from packages p
      where r.package_id = p.id and r.package_slug is null;

    alter table reviews drop column package_id;
  end if;
end $$;

-- ---------- media_assets ----------
alter table media_assets add column if not exists package_slug text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'media_assets' and column_name = 'package_id'
  ) then
    update media_assets m
      set package_slug = p.slug
      from packages p
      where m.package_id = p.id and m.package_slug is null;

    alter table media_assets drop column package_id;
  end if;
end $$;

-- ---------- itinerary_days: reference by slug too ----------
alter table itinerary_days add column if not exists package_slug text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'itinerary_days' and column_name = 'package_id'
  ) then
    update itinerary_days d
      set package_slug = p.slug
      from packages p
      where d.package_id = p.id and d.package_slug is null;

    -- Drop the old policy that depended on package_id before removing it.
    drop policy if exists "public read itinerary of published" on itinerary_days;
    alter table itinerary_days drop column package_id;
  end if;
end $$;

-- Recreate the itinerary read policy against the slug column.
drop policy if exists "public read itinerary of published" on itinerary_days;
create policy "public read itinerary of published" on itinerary_days
  for select using (
    exists (
      select 1 from packages p
      where p.slug = itinerary_days.package_slug
        and (p.status = 'published' or is_admin())
    )
  );

-- Cascade deletes by slug are handled in application code, but index the
-- lookups since every package read touches them.
create index if not exists itinerary_days_package_slug_idx on itinerary_days (package_slug);
create index if not exists reviews_package_slug_idx on reviews (package_slug);
create index if not exists media_assets_package_slug_idx on media_assets (package_slug);
create index if not exists departures_package_slug_idx on departures (package_id);

-- ---------- departures: slug reference ----------
alter table departures add column if not exists package_slug text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'departures' and column_name = 'package_id'
  ) then
    update departures d
      set package_slug = p.slug
      from packages p
      where d.package_id = p.id and d.package_slug is null;

    alter table departures drop column package_id;
  end if;
end $$;

create index if not exists departures_slug_idx on departures (package_slug);

-- ---------- unique day ordering per package ----------
alter table itinerary_days drop constraint if exists itinerary_days_package_id_day_number_key;
create unique index if not exists itinerary_days_slug_day_uniq
  on itinerary_days (package_slug, day_number);
