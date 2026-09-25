import type { Review, BlogPost, TrustStat, Inquiry } from "@/lib/types";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const trustStats: TrustStat[] = [
  { value: "4.9", label: "Average Google rating" },
  { value: "2,400+", label: "Travellers hosted" },
  { value: "11", label: "Years in North Bengal" },
];

export const whyChooseUs = [
  { title: "Authentic experiences", text: "Itineraries built around real places and real hosts — not a checklist of the same five viewpoints." },
  { title: "Local expertise", text: "Guides who grew up in these hills and know when the peaks come out and when the roads don't." },
  { title: "Trusted stays", text: "Hand-picked homestays and hotels we've stayed in ourselves, vetted every season." },
  { title: "Permit assistance", text: "Tsomgo, Nathula and North Sikkim permits handled for you — one less thing to worry about." },
];

export const reviews: Review[] = [
  { id: "r1", author: "Ananya Sen", rating: 5, source: "Google", featured: true, visible: true, date: "2026-05-14", packageSlug: "darjeeling-sikkim-explorer", text: "Tiger Hill sunrise was unreal and the Nathula permit was handled without a hitch. Our guide knew every tea estate by name." },
  { id: "r2", author: "Rohit Malhotra", rating: 5, source: "Google", featured: true, visible: true, date: "2026-04-02", packageSlug: "dooars-wildlife-safari", text: "Saw rhino and wild elephant on the first safari itself. The riverside resort on the Murti was the highlight for my kids." },
  { id: "r3", author: "Priya Nair", rating: 5, source: "Google", featured: true, visible: true, date: "2026-03-20", packageSlug: "sandakphu-singalila-trek", text: "Sandakphu on a clear morning — four of the tallest peaks in one frame. Well-paced trek and the huts were warmer than expected." },
  { id: "r4", author: "Debjani Roy", rating: 5, source: "Google", featured: false, visible: true, date: "2026-02-11", packageSlug: "kalimpong-homestay-retreat", text: "The homestay felt like family by day two. Best momos of my life, and a ridge view I still think about." },
  { id: "r5", author: "Karan Gupta", rating: 4, source: "Google", featured: false, visible: true, date: "2026-01-28", text: "Great planning and responsive on WhatsApp throughout. Would book again for the Dooars." },
];

export const featuredReviews = () => reviews.filter((r) => r.featured && r.visible);

export const blogPosts: BlogPost[] = [
  {
    slug: "best-time-to-visit-sikkim",
    title: "Best Time to Visit Sikkim: A Month-by-Month Guide",
    excerpt: "Rhododendrons in spring, clear peaks in autumn, snow at Tsomgo in winter — here's how to time your Sikkim trip.",
    coverImage: img("1626621341517-bbf3d9990a23", 1200),
    tag: "Sikkim",
    publishedAt: "2026-06-01",
    readMinutes: 6,
    body: "Sikkim rewards travellers who plan around the season. March to June brings valleys in bloom, with the Lachung–Yumthang rhododendrons peaking in April. October to December delivers the crispest mountain clarity for Nathula and Tsomgo. The monsoon (June–September) turns the hills lush but raises the landslide risk on mountain roads. Whatever the month, permits for Tsomgo, Nathula and North Sikkim need arranging in advance — verify the current rules before you travel.",
  },
  {
    slug: "nathula-pass-permit-guide",
    title: "Nathula Pass Permit Guide: What You Need to Know",
    excerpt: "Who needs a permit, when Nathula is open, and how we handle the paperwork so you don't have to.",
    coverImage: img("1605640840605-14ac1855827b", 1200),
    tag: "Permits",
    publishedAt: "2026-05-18",
    readMinutes: 5,
    body: "Nathula Pass sits at roughly 4,300m on the India–China border and requires a protected-area permit for Indian citizens, arranged through a registered operator. It typically stays closed on Mondays and Tuesdays, and weather can shut the road at short notice in winter. Foreign nationals are generally not permitted. We arrange the permit as part of the Darjeeling & Sikkim Explorer — but always verify current rules and fees before publishing your dates, as these change season to season.",
  },
  {
    slug: "darjeeling-toy-train-guide",
    title: "Riding the Darjeeling Himalayan Railway",
    excerpt: "A practical guide to the UNESCO-listed toy train — joy rides, full journeys and the best photo loops.",
    coverImage: img("1544634076-a90160ddf44c", 1200),
    tag: "Darjeeling",
    publishedAt: "2026-04-22",
    readMinutes: 4,
    body: "The Darjeeling Himalayan Railway, a UNESCO World Heritage Site, is one of the last working hill railways of its kind. Most visitors take the short joy ride between Darjeeling and Ghoom, passing the Batasia Loop with its Kanchenjunga backdrop. Book steam-hauled services early in peak season, they sell out. We fold a joy ride into the Darjeeling & Sikkim Explorer on day three.",
  },
  {
    slug: "dooars-safari-planning",
    title: "Planning a Dooars Jeep Safari",
    excerpt: "Gorumara, Jaldapara or Chapramari? Gate timings, seasons and what you'll actually see.",
    coverImage: img("1544735716-392fe2489ffa", 1200),
    tag: "Dooars",
    publishedAt: "2026-03-30",
    readMinutes: 5,
    body: "The Dooars holds three standout reserves — Gorumara for rhino and bison, Jaldapara for its rhino density and elephant safaris, and Chapramari for dense riverine forest. Safari permits and gate timings are set by the forest department, and core zones close during the monsoon breeding season (roughly mid-June to mid-September). Morning slots offer the best sightings; book early in season as jeep numbers are capped.",
  },
];

export const getBlogPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

/** Seed inquiries for the admin kanban demo. */
export const seedInquiries: Inquiry[] = [
  { id: "inq-1", name: "Meghna Das", whatsapp: "+91 98300 11223", travelDates: "12–18 Oct 2026", pax: 2, packageSlug: "darjeeling-sikkim-explorer", message: "Honeymoon trip, want the Nathula add-on.", status: "New", createdAt: "2026-09-24T09:12:00Z" },
  { id: "inq-2", name: "Arjun Verma", whatsapp: "+91 90070 55441", travelDates: "Early Nov 2026", pax: 4, packageSlug: "dooars-wildlife-safari", message: "Family with two kids, need a resort with a pool.", status: "Contacted", notes: "Sent Murti resort options, awaiting reply.", createdAt: "2026-09-22T14:30:00Z" },
  { id: "inq-3", name: "Sara Thomas", whatsapp: "+91 81450 99872", travelDates: "18 Oct 2026", pax: 3, packageSlug: "sandakphu-singalila-trek", message: "Are the huts heated? First high-altitude trek.", status: "Confirmed", notes: "Advance paid, sent gear checklist.", createdAt: "2026-09-19T11:05:00Z" },
  { id: "inq-4", name: "Nikhil Roy", whatsapp: "+91 98311 22110", travelDates: "Flexible, Dec 2026", pax: 2, message: "Just exploring options for a quiet hill break.", status: "Closed", notes: "Booked elsewhere this time.", createdAt: "2026-09-10T16:45:00Z" },
];
