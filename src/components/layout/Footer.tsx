import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { site } from "@/lib/site";
import { destinations } from "@/data/destinations";
import { waLink } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const cols = [
  {
    heading: "Explore",
    links: [
      { label: "Tours", href: "/tours" },
      { label: "Destinations", href: "/destinations" },
      { label: "Homestays", href: "/homestays" },
      { label: "Guides", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Regions",
    links: destinations.map((d) => ({
      label: d.name,
      href: `/destinations/${d.slug}`,
    })),
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cancellation policy", href: "/cancellation" },
    ],
  },
];

const socials = [
  { icon: Instagram, href: site.socials.instagram, label: "Instagram" },
  { icon: Facebook, href: site.socials.facebook, label: "Facebook" },
  { icon: Youtube, href: site.socials.youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,0.85fr)]">
          <div>
            <Logo />
            <p className="t-small mt-4 max-w-[19rem] text-white/55">
              {site.description}
            </p>

            <a
              href={waLink(site.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[#1faa53] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <SiWhatsapp className="size-4" aria-hidden />
              WhatsApp us
            </a>

            <dl className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Email</dt>
                <Mail className="size-4 shrink-0 text-white/40" strokeWidth={1.5} aria-hidden />
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="t-small text-white/65 transition-colors hover:text-white"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Based in</dt>
                <MapPin className="size-4 shrink-0 text-white/40" strokeWidth={1.5} aria-hidden />
                <dd className="t-small text-white/65">{site.base}</dd>
              </div>
            </dl>
          </div>

          {cols.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="t-small font-semibold uppercase tracking-[0.14em] text-white/35">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="t-small text-white/65 transition-colors duration-[180ms] hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-5 border-t border-white/8 pt-6 sm:flex-row">
          <p className="t-small text-white/40">
            © {new Date().getFullYear()} {site.name}. {site.hours}.
          </p>
          <ul className="flex items-center gap-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full text-white/55 transition-colors duration-[180ms] hover:bg-white/8 hover:text-white"
                >
                  <s.icon className="size-[1.125rem]" strokeWidth={1.5} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
