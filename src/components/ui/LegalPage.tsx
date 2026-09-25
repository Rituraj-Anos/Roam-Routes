import { PageHero } from "./PageHero";
import { Section } from "./Section";
import { site } from "@/lib/site";

/**
 * Policy page scaffold.
 *
 * Uses the same dark header as every other interior page, which keeps the fixed
 * navbar legible: its links are cream, so a page that opened straight onto white
 * would hide them entirely.
 *
 * Copy is plain language over legalese. A policy nobody can read protects nobody.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paras: string[] }[];
}) {
  return (
    <>
      <PageHero title={title} intro={intro} />

      <Section tone="light">
        <article className="mx-auto max-w-[44rem]">
          <p className="t-small text-[var(--color-body-soft)]">
            Last updated {updated}
          </p>

          <div className="mt-8 space-y-9">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="t-h3">{s.heading}</h2>
                <div className="t-body mt-3 space-y-3 text-[var(--color-body)]">
                  {s.paras.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-[var(--radius-xl2)] bg-[var(--color-cream)] p-6 ring-1 ring-[var(--color-line)]">
            <h2 className="t-h3">Questions about this?</h2>
            <p className="t-small mt-2 text-[var(--color-body)]">
              Message us on WhatsApp, or email{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-[var(--color-teal-700)] underline-offset-2 hover:underline"
              >
                {site.email}
              </a>
              . We will answer in plain terms.
            </p>
          </div>
        </article>
      </Section>
    </>
  );
}
