import type { Destination } from "@/lib/types";

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

export const destinations: Destination[] = [
  {
    slug: "darjeeling",
    name: "Darjeeling",
    tagline: "Tea gardens, a heritage railway, and Kanchenjunga at dawn",
    heroImage: img("1544634076-a90160ddf44c", 1600),
    thumbs: [img("1622308644420-b20142dc993c", 700), img("1558431382-27e303142255", 700)],
    overview:
      "The Queen of the Hills. Colonial-era tea estates, the UNESCO-listed Darjeeling Himalayan Railway, and first light on Kanchenjunga from Tiger Hill. Best suited to slow, scenic travel and tea-estate stays.",
    bestSeason:
      "March to May and October to November for clear peak views. The monsoon, June to September, brings mist and deep green but also cloud cover.",
    bestWindow: "Mar–May, Oct–Nov",
    gateway: "Bagdogra Airport (IXB) or New Jalpaiguri (NJP), then about 3 hours by road",
    peakMonths: [3, 4, 5, 10, 11],
    avoidMonths: [7, 8],
    altitude: "2,042 m at Darjeeling town",
    advisory:
      "Hill roads can be disrupted by landslides at the height of the monsoon, roughly June to September.",
  },
  {
    slug: "sikkim",
    name: "Sikkim",
    tagline: "High passes, a sacred lake, and monasteries above the cloud line",
    heroImage: img("1626621341517-bbf3d9990a23", 1600),
    thumbs: [img("1605640840605-14ac1855827b", 700), img("1503220317375-aaad61436b1b", 700)],
    overview:
      "From Gangtok's ridgeline energy to the stillness of Tsomgo Lake and the border at Nathula. Sikkim rewards travellers who plan around permits. The Lachung and Yumthang valleys in the north are a spring rhododendron spectacle.",
    bestSeason:
      "March to June for valleys in bloom, October to December for the crispest mountain clarity and reliable road access.",
    bestWindow: "Mar–Jun, Oct–Dec",
    gateway: "Bagdogra (IXB) or NJP, then 4 to 5 hours by road to Gangtok",
    peakMonths: [3, 4, 5, 10, 11, 12],
    avoidMonths: [7, 8],
    altitude: "1,650 m at Gangtok, up to 4,310 m at Nathula",
    permitNote:
      "Tsomgo (Changu) Lake, Nathula Pass and North Sikkim all require permits arranged in advance through a registered operator. We handle the paperwork. Rules and fees change by season, so we confirm them before every departure.",
    advisory:
      "Nathula sits above 4,300 m and needs a day of acclimatisation first. Winter snow can close the road with little notice.",
  },
  {
    slug: "dooars",
    name: "Dooars",
    tagline: "Jeep safaris, riverine forest, and genuine elephant country",
    heroImage: img("1544735716-392fe2489ffa", 1600),
    thumbs: [img("1564760055775-d63b17a55c44", 700), img("1549366021-9f761d450615", 700)],
    overview:
      "The Dooars plains at the foot of the Himalaya hold Gorumara, Jaldapara and Chapramari, home to one-horned rhino, bison and wild elephant. Slow eco-tourism, forest bungalows and early-morning jeep safaris define the region.",
    bestSeason:
      "October to April. Core forest zones close for the monsoon breeding season, roughly mid-June to mid-September.",
    bestWindow: "Oct–Apr",
    gateway: "Bagdogra (IXB) or NJP, then about 2 hours by road to Lataguri",
    peakMonths: [11, 12, 1, 2, 3],
    avoidMonths: [6, 7, 8, 9],
    altitude: "90 to 300 m, lowland plains",
    permitNote:
      "Safari permits and gate timings are set by the forest department and jeep numbers are capped. Morning slots book out first in season.",
    advisory:
      "Core zones are closed mid-June to mid-September. We will not sell you a safari that cannot run.",
  },
  {
    slug: "kalimpong",
    name: "Kalimpong",
    tagline: "Quiet ridgelines, flower nurseries, and family homestays",
    heroImage: img("1591793131172-3d0d0b7d7a3a", 1600),
    thumbs: [img("1571401835393-8c5f35328320", 700), img("1516483638261-f4dbaf036963", 700)],
    overview:
      "A calmer alternative to Darjeeling. Orchid and cactus nurseries, old monasteries, and offbeat village homestays along the Teesta. Works well paired with Darjeeling or as a slow-travel base in its own right.",
    bestSeason:
      "March to May and October to November are ideal, though the lower elevation keeps Kalimpong pleasant for most of the year.",
    bestWindow: "Mar–May, Oct–Nov",
    gateway: "Bagdogra (IXB) or NJP, then about 2.5 hours by road",
    peakMonths: [3, 4, 5, 10, 11],
    avoidMonths: [7],
    altitude: "1,250 m at Kalimpong town",
    advisory:
      "Riverside roads along the Teesta occasionally close for short spells after heavy monsoon rain.",
  },
];

export const getDestination = (slug: string) =>
  destinations.find((d) => d.slug === slug);
