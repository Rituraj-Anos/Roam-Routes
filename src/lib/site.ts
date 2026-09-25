/** Central site configuration — surfaced in nav, footer and WhatsApp CTAs. */
export const site = {
  name: "RoamAndRoutes",
  tagline: "North Bengal, up close",
  description:
    "Curated Darjeeling, Sikkim, Dooars and Kalimpong trips. Local guides, stays we have slept in, and permits handled for you.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919000000000",
  email: "hello@roamandroutes.in",
  base: "Siliguri, West Bengal",
  hours: "Every day, 8am to 9pm IST",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  socials: {
    instagram: "https://instagram.com/roamandroutes",
    facebook: "https://facebook.com/roamandroutes",
    youtube: "https://youtube.com/@roamandroutes",
  },
} as const;

/**
 * Primary navigation. Labels name their contents rather than using vague
 * umbrellas, so the destination is predictable before the click.
 */
export const nav = [
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Homestays", href: "/homestays" },
  { label: "Guides", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** The single label used for booking intent everywhere on the site. */
export const BOOK_CTA = "Book a Trip";
