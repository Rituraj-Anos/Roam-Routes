import type { Homestay } from "@/lib/types";

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

/**
 * Homestays are deliberately a separate category from hotel stays: the booking
 * question, the price band and the reason people choose them are all different.
 */
export const homestays: Homestay[] = [
  {
    slug: "teesta-valley-lepcha-home",
    name: "Teesta Valley Lepcha Home",
    village: "Bong Busty, Kalimpong",
    region: "Kalimpong",
    image: img("1591793131172-3d0d0b7d7a3a"),
    blurb:
      "Four rooms in a working family home above the Teesta, with cardamom drying on the terrace and dinner cooked on a wood stove.",
    rooms: 4,
    pricePerNight: 2400,
    altitude: "1,180 m",
    hostedBy: "The Lepcha family",
    experiences: ["Wood-stove cooking", "Cardamom grove walk", "Teesta riverside afternoon"],
    packageSlug: "kalimpong-homestay-retreat",
  },
  {
    slug: "yuksom-heritage-farmstay",
    name: "Yuksom Heritage Farmstay",
    village: "Yuksom, West Sikkim",
    region: "Sikkim",
    image: img("1605640840605-14ac1855827b"),
    blurb:
      "A farm stay in Sikkim's first capital, ten minutes from Dubdi Monastery and the trailhead for the Goecha La route.",
    rooms: 5,
    pricePerNight: 2800,
    altitude: "1,780 m",
    hostedBy: "Pema and Sonam",
    experiences: ["Organic farm breakfast", "Dubdi Monastery walk", "Trek briefings"],
    packageSlug: "darjeeling-sikkim-explorer",
  },
  {
    slug: "murti-river-forest-home",
    name: "Murti River Forest Home",
    village: "Murti, Dooars",
    region: "Dooars",
    image: img("1564760055775-d63b17a55c44"),
    blurb:
      "Three rooms on the Murti's edge at the boundary of Gorumara, where elephants cross the river at dusk in the dry months.",
    rooms: 3,
    pricePerNight: 3200,
    altitude: "190 m",
    hostedBy: "The Rava community collective",
    experiences: ["Dawn birding walk", "Rava village kitchen", "Gorumara safari transfers"],
    packageSlug: "dooars-wildlife-safari",
  },
  {
    slug: "tumling-ridge-homestay",
    name: "Tumling Ridge Homestay",
    village: "Tumling, Singalila",
    region: "Darjeeling",
    image: img("1454496522488-7a8e488e8606"),
    blurb:
      "A trekker's homestay on the India–Nepal border ridge, with Kanchenjunga filling the dining-room window on a clear morning.",
    rooms: 6,
    pricePerNight: 2200,
    altitude: "2,970 m",
    hostedBy: "The Tamang family",
    experiences: ["Sunrise from the ridge", "Singalila trek staging", "Tongba by the fire"],
    packageSlug: "sandakphu-singalila-trek",
  },
  {
    slug: "takdah-cantonment-bungalow",
    name: "Takdah Cantonment Bungalow",
    village: "Takdah, Darjeeling",
    region: "Darjeeling",
    image: img("1622308644420-b20142dc993c"),
    blurb:
      "A restored colonial bungalow among working tea gardens, quieter than Darjeeling town and forty minutes down the hill from it.",
    rooms: 4,
    pricePerNight: 3400,
    altitude: "1,540 m",
    hostedBy: "The Gurung family",
    experiences: ["Tea estate plucking", "Orchid nursery visit", "Cycling the cantonment roads"],
  },
  {
    slug: "lingee-offbeat-village-stay",
    name: "Lingee Offbeat Village Stay",
    village: "Lingee, South Sikkim",
    region: "Sikkim",
    image: img("1516483638261-f4dbaf036963"),
    blurb:
      "Genuinely off the circuit. Terraced fields, a handful of homes, and no through traffic at all after dark.",
    rooms: 3,
    pricePerNight: 2100,
    altitude: "1,400 m",
    hostedBy: "Deepa and Tashi",
    experiences: ["Terrace farming day", "Village temple walk", "Night-sky viewing"],
  },
];

export const getHomestay = (slug: string) => homestays.find((h) => h.slug === slug);
