-- ============================================================
-- RoamAndRoutes — seed data (mirrors src/data/*.ts)
-- Run after schema.sql. Safe to re-run (upserts on slug).
-- ============================================================

-- Site settings singleton
insert into site_settings (id, whatsapp_number, contact_email, social_links, road_status_note)
values (
  1,
  '919000000000',
  'hello@roamandroutes.in',
  '{"instagram":"https://instagram.com/roamandroutes","facebook":"https://facebook.com/roamandroutes","youtube":"https://youtube.com/@roamandroutes"}',
  'Hill roads clear as of season start. Monsoon advisory Jun–Sep.'
)
on conflict (id) do update
  set whatsapp_number = excluded.whatsapp_number,
      contact_email   = excluded.contact_email,
      social_links    = excluded.social_links;

-- Packages (abbreviated — full itinerary/departures managed in admin)
insert into packages (slug, title, region, type, duration_days, duration_nights, price_from, summary, featured, status, permit_note)
values
  ('darjeeling-sikkim-explorer', 'Darjeeling & Sikkim Explorer', 'Sikkim', 'Cultural', 7, 6, 24999,
   'The classic North Bengal circuit — Tiger Hill sunrise, Darjeeling tea estates and toy train, then Gangtok, Tsomgo Lake and Nathula.', true, 'published',
   'Tsomgo Lake & Nathula permits arranged by us. Nathula closed Mon/Tue — verify current rules.'),
  ('dooars-wildlife-safari', 'Dooars Wildlife Safari', 'Dooars', 'Wildlife', 4, 3, 15999,
   'Three days in elephant country — morning jeep safaris at Gorumara and Chapramari, riverside forest stays.', true, 'published',
   'Core forest zones close during the monsoon breeding season (mid-Jun to mid-Sep).'),
  ('sandakphu-singalila-trek', 'Sandakphu Singalila Trek', 'Darjeeling', 'Trekking', 6, 5, 19999,
   'The Singalila ridge to Sandakphu (3,636m) with a rare panorama of four of the tallest peaks on earth.', true, 'published',
   'Singalila National Park permits included. High-altitude trek — fitness and acclimatisation essential.'),
  ('kalimpong-homestay-retreat', 'Kalimpong Homestay Retreat', 'Kalimpong', 'Homestay', 4, 3, 12999,
   'A slow, rooted stay in the Kalimpong hills — orchid nurseries, monasteries and home-cooked Lepcha meals.', false, 'published', null)
on conflict (slug) do update
  set title = excluded.title, price_from = excluded.price_from, status = excluded.status;

-- Reviews
insert into reviews (author, rating, text, source, featured, visible)
values
  ('Ananya Sen', 5, 'Tiger Hill sunrise was unreal and the Nathula permit was handled without a hitch.', 'Google', true, true),
  ('Rohit Malhotra', 5, 'Saw rhino and wild elephant on the first safari itself. The riverside resort was the highlight.', 'Google', true, true),
  ('Priya Nair', 5, 'Sandakphu on a clear morning — four of the tallest peaks in one frame. Well-paced trek.', 'Google', true, true)
on conflict do nothing;

-- Blog posts
insert into blog_posts (slug, title, excerpt, tag, read_minutes, published_at)
values
  ('best-time-to-visit-sikkim', 'Best Time to Visit Sikkim: A Month-by-Month Guide',
   'Rhododendrons in spring, clear peaks in autumn, snow at Tsomgo in winter.', 'Sikkim', 6, now()),
  ('nathula-pass-permit-guide', 'Nathula Pass Permit Guide: What You Need to Know',
   'Who needs a permit, when Nathula is open, and how we handle the paperwork.', 'Permits', 5, now())
on conflict (slug) do nothing;

-- NOTE: To grant admin access, after creating a Supabase Auth user, run:
--   insert into admin_users (id, email, role)
--   values ('<auth-user-uuid>', 'owner@roamandroutes.in', 'owner');
