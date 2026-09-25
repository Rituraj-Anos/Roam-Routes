import type { Package } from "@/lib/types";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const packages: Package[] = [
  {
    id: "pkg-001",
    slug: "darjeeling-sikkim-explorer",
    title: "Darjeeling & Sikkim Explorer",
    region: "Sikkim",
    type: "Cultural",
    durationDays: 7,
    durationNights: 6,
    priceFrom: 24999,
    heroImage: img("1626621341517-bbf3d9990a23", 1600),
    gallery: [
      img("1544634076-a90160ddf44c", 900),
      img("1605640840605-14ac1855827b", 900),
      img("1503220317375-aaad61436b1b", 900),
      img("1558431382-27e303142255", 900),
    ],
    summary:
      "The classic North Bengal circuit — Tiger Hill sunrise, Darjeeling's tea estates and toy train, then across into Sikkim for Gangtok, Tsomgo Lake and the Nathula viewpoint.",
    highlights: [
      "Sunrise over Kanchenjunga from Tiger Hill",
      "Ride the UNESCO Darjeeling Himalayan Railway",
      "Tea-estate walk with tasting",
      "Frozen Tsomgo Lake and Nathula viewpoint (permit included)",
      "Rumtek Monastery and Gangtok ridge walk",
    ],
    inclusions: [
      "6 nights hand-picked hotels & homestays",
      "All transfers in private vehicle",
      "Daily breakfast + 3 dinners",
      "Tsomgo / Nathula permit assistance",
      "English/Hindi-speaking local guide",
    ],
    exclusions: ["Airfare / train to Bagdogra or NJP", "Lunches", "Entry fees at optional sights", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival & Orientation", description: "Pickup from Bagdogra (IXB) or NJP, scenic drive up to Darjeeling, evening at leisure on the Mall.", meals: "Dinner", stay: "Darjeeling hotel" },
      { day: 2, title: "Tiger Hill Sunrise & Tea Country", description: "Pre-dawn drive to Tiger Hill for the Kanchenjunga sunrise, Ghoom Monastery, Batasia Loop, and an afternoon tea-estate walk.", meals: "Breakfast", stay: "Darjeeling hotel" },
      { day: 3, title: "Toy Train & Transfer to Gangtok", description: "Joy ride on the Darjeeling Himalayan Railway, then transfer across into Sikkim to Gangtok.", meals: "Breakfast, Dinner", stay: "Gangtok hotel" },
      { day: 4, title: "Tsomgo Lake & Nathula", description: "Permit-day excursion to Tsomgo (Changu) Lake and the Nathula viewpoint at ~4,300m. Acclimatise and keep it easy.", meals: "Breakfast", stay: "Gangtok hotel" },
      { day: 5, title: "Gangtok Monasteries & Ridge", description: "Rumtek Monastery, the ropeway, and a slow ridge walk through Gangtok's quieter corners.", meals: "Breakfast, Dinner", stay: "Gangtok hotel" },
      { day: 6, title: "Offbeat Village Homestay", description: "Drive to a hillside homestay for a night of home-cooked food and valley views away from the towns.", meals: "Breakfast, Dinner", stay: "Village homestay" },
      { day: 7, title: "Departure", description: "Unhurried breakfast and transfer back to Bagdogra / NJP for your onward journey.", meals: "Breakfast", stay: "—" },
    ],
    reelUrls: ["https://www.instagram.com/reel/placeholder1/"],
    mapEmbed: "https://www.google.com/maps?q=Gangtok,Sikkim&output=embed",
    featured: true,
    status: "published",
    permitNote: "Tsomgo Lake & Nathula permits arranged by us. Nathula stays closed on Mondays and Tuesdays — verify current rules before travel.",
    departures: [
      { id: "dep-1", date: "2026-10-12", totalSeats: 14, bookedSeats: 11, status: "open" },
      { id: "dep-2", date: "2026-11-02", totalSeats: 14, bookedSeats: 6, status: "open" },
      { id: "dep-3", date: "2026-11-23", totalSeats: 14, bookedSeats: 14, status: "sold_out" },
    ],
  },
  {
    id: "pkg-002",
    slug: "dooars-wildlife-safari",
    title: "Dooars Wildlife Safari",
    region: "Dooars",
    type: "Wildlife",
    durationDays: 4,
    durationNights: 3,
    priceFrom: 15999,
    heroImage: img("1544735716-392fe2489ffa", 1600),
    gallery: [img("1564760055775-d63b17a55c44", 900), img("1549366021-9f761d450615", 900), img("1547471080-7cc2caa01a7e", 900)],
    summary:
      "Three days in elephant country — morning jeep safaris at Gorumara and Chapramari, riverside forest stays, and birding along the Murti.",
    highlights: [
      "Morning jeep safari in Gorumara National Park",
      "Watchtower session for rhino & bison sightings",
      "Chapramari forest drive",
      "Riverside stay on the Murti",
      "Tribal village and tea-garden visit",
    ],
    inclusions: ["3 nights forest resort / bungalow", "All safaris & permits", "Daily breakfast + dinner", "Private transfers", "Naturalist guide"],
    exclusions: ["Travel to Bagdogra / NJP", "Lunches", "Camera fees at gates", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival in the Dooars", description: "Pickup from NJP/Bagdogra, drive to Lataguri, evening orientation and a short nature walk.", meals: "Dinner", stay: "Gorumara forest resort" },
      { day: 2, title: "Gorumara Safari", description: "Early jeep safari and watchtower session for rhino, bison and elephant, afternoon at leisure by the river.", meals: "Breakfast, Dinner", stay: "Gorumara forest resort" },
      { day: 3, title: "Chapramari & Villages", description: "Chapramari forest drive, a tea-garden visit and a tribal village interaction.", meals: "Breakfast, Dinner", stay: "Murti riverside resort" },
      { day: 4, title: "Departure", description: "Morning birding, then transfer back to NJP / Bagdogra.", meals: "Breakfast", stay: "—" },
    ],
    mapEmbed: "https://www.google.com/maps?q=Gorumara+National+Park&output=embed",
    featured: true,
    status: "published",
    permitNote: "Core forest zones close during the monsoon breeding season (roughly mid-Jun to mid-Sep).",
    departures: [
      { id: "dep-4", date: "2026-11-08", totalSeats: 12, bookedSeats: 3, status: "open" },
      { id: "dep-5", date: "2026-12-06", totalSeats: 12, bookedSeats: 9, status: "open" },
    ],
  },
  {
    id: "pkg-003",
    slug: "sandakphu-singalila-trek",
    title: "Sandakphu Singalila Trek",
    region: "Darjeeling",
    type: "Trekking",
    durationDays: 6,
    durationNights: 5,
    priceFrom: 19999,
    heroImage: img("1454496522488-7a8e488e8606", 1600),
    gallery: [img("1519681393784-d120267933ba", 900), img("1486870591958-9b9d0d1dda99", 900), img("1464822759023-fed622ff2c3b", 900)],
    summary:
      "The Singalila ridge to Sandakphu (3,636m) — the highest point in West Bengal — with a rare panorama of four of the world's five tallest peaks, including Everest and Kanchenjunga.",
    highlights: [
      "Stand on the highest point in West Bengal",
      "Sleeping-Buddha view of the Kanchenjunga range",
      "Everest, Lhotse & Makalu on a clear morning",
      "Rhododendron forests in spring",
      "Trekker's-hut and homestay nights",
    ],
    inclusions: ["5 nights huts/homestays", "Guide, porter support & permits", "All meals on trek", "Transfers from NJP/Bagdogra to trailhead", "Trek planning briefing"],
    exclusions: ["Personal trekking gear", "Travel insurance", "Anything not listed", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Drive to Maneybhanjang", description: "Transfer from NJP/Bagdogra to the trailhead, gear check and acclimatisation walk.", meals: "Dinner", stay: "Maneybhanjang lodge" },
      { day: 2, title: "Trek to Tumling", description: "Ascend through Singalila National Park, first Kanchenjunga views near Meghma.", meals: "Breakfast, Lunch, Dinner", stay: "Tumling homestay" },
      { day: 3, title: "Tumling to Kalpokhri", description: "Ridge walk along the India–Nepal border past Gairibas to the sacred Kalpokhri lake.", meals: "Breakfast, Lunch, Dinner", stay: "Kalpokhri hut" },
      { day: 4, title: "Summit Sandakphu", description: "Climb to Sandakphu (3,636m) for the Sleeping-Buddha panorama and Everest group on a clear day.", meals: "Breakfast, Lunch, Dinner", stay: "Sandakphu hut" },
      { day: 5, title: "Descend to Gurdum", description: "Long descent through rhododendron and bamboo forest to a warm valley homestay.", meals: "Breakfast, Lunch, Dinner", stay: "Gurdum homestay" },
      { day: 6, title: "Trek out & Departure", description: "Final walk to Sepi, transfer back to NJP / Bagdogra.", meals: "Breakfast", stay: "—" },
    ],
    mapEmbed: "https://www.google.com/maps?q=Sandakphu&output=embed",
    featured: true,
    status: "published",
    permitNote: "Singalila National Park entry permits included. High-altitude trek — a basic fitness level and acclimatisation are essential.",
    departures: [
      { id: "dep-6", date: "2026-10-18", totalSeats: 10, bookedSeats: 7, status: "open" },
      { id: "dep-7", date: "2026-11-15", totalSeats: 10, bookedSeats: 2, status: "open" },
    ],
  },
  {
    id: "pkg-004",
    slug: "kalimpong-homestay-retreat",
    title: "Kalimpong Homestay Retreat",
    region: "Kalimpong",
    type: "Homestay",
    durationDays: 4,
    durationNights: 3,
    priceFrom: 12999,
    heroImage: img("1591793131172-3d0d0b7d7a3a", 1600),
    gallery: [img("1571401835393-8c5f35328320", 900), img("1516483638261-f4dbaf036963", 900), img("1470240731273-7821a6eeb6bd", 900)],
    summary:
      "A slow, rooted stay in the Kalimpong hills — orchid nurseries, old monasteries, home-cooked Lepcha meals and quiet ridge walks well away from the crowds.",
    highlights: [
      "Family-run village homestay",
      "Orchid & cactus nursery visits",
      "Durpin Monastery and the ridge viewpoint",
      "Home-cooked local cuisine",
      "Teesta riverside afternoon",
    ],
    inclusions: ["3 nights homestay", "All home-cooked meals", "Private transfers", "Guided village & nursery walks", "Local host"],
    exclusions: ["Travel to Bagdogra / NJP", "Adventure activities", "Personal expenses", "Tips"],
    itinerary: [
      { day: 1, title: "Arrival & Settle In", description: "Transfer from NJP/Bagdogra to your Kalimpong homestay, welcome tea and an evening ridge stroll.", meals: "Dinner", stay: "Village homestay" },
      { day: 2, title: "Nurseries & Monasteries", description: "Orchid and cactus nurseries, Durpin Monastery and the Deolo hill viewpoint.", meals: "Breakfast, Dinner", stay: "Village homestay" },
      { day: 3, title: "Teesta & Village Life", description: "A relaxed riverside afternoon on the Teesta and time with your host family.", meals: "Breakfast, Dinner", stay: "Village homestay" },
      { day: 4, title: "Departure", description: "Unhurried breakfast, transfer back to NJP / Bagdogra.", meals: "Breakfast", stay: "—" },
    ],
    mapEmbed: "https://www.google.com/maps?q=Kalimpong&output=embed",
    featured: false,
    status: "published",
    departures: [
      { id: "dep-8", date: "2026-10-25", totalSeats: 8, bookedSeats: 4, status: "open" },
      { id: "dep-9", date: "2026-11-29", totalSeats: 8, bookedSeats: 1, status: "open" },
    ],
  },
];

export const getPackage = (slug: string) => packages.find((p) => p.slug === slug);
export const featuredPackages = () => packages.filter((p) => p.featured && p.status === "published");
export const publishedPackages = () => packages.filter((p) => p.status === "published");
export const relatedPackages = (slug: string, region: string) =>
  packages.filter((p) => p.slug !== slug && p.status === "published" && p.region === region).slice(0, 3);
