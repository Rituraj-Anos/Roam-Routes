import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getPublishedPosts } from "@/lib/store/queries";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "North Bengal travel guides. Best time to visit Sikkim, Nathula permit rules, the Darjeeling toy train, and Dooars safari planning.",
};

// Published guides come from the live store.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [lead, ...rest] = posts;

  // An empty state is better than a crash when nothing is published yet.
  if (!lead) {
    return (
      <>
        <PageHero
          title="Plan smarter with local knowledge"
          intro="Seasons, permits and practical detail, written by the people who travel these routes every month."
        />
        <Section tone="cream">
          <p className="t-body mx-auto max-w-md text-center text-[var(--color-body)]">
            No guides published yet. Check back shortly.
          </p>
        </Section>
        <ClosingCta />
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Plan smarter with local knowledge"
        intro="Seasons, permits and practical detail, written by the people who travel these routes every month."
        image={lead.coverImage || undefined}
      />

      <Section tone="cream">
        {/* Lead article gets real weight instead of sitting in an even grid */}
        <RevealItem>
          <Link
            href={`/blog/${lead.slug}`}
            className="hover-lift group grid overflow-hidden rounded-[var(--radius-xl2)] bg-[var(--color-paper)] ring-1 ring-[var(--color-line)] lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[20rem]">
              <Image
                src={lead.coverImage}
                alt={lead.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover transition-transform duration-[700ms] ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="t-small font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                {lead.tag}
              </span>
              <h2 className="t-h2 mt-3 text-balance">{lead.title}</h2>
              <p className="t-body mt-3 text-[var(--color-body)]">{lead.excerpt}</p>
              <span className="t-small mt-5 inline-flex items-center gap-1.5 text-[var(--color-body-soft)]">
                <Clock className="size-3.5" strokeWidth={1.5} aria-hidden />
                {lead.readMinutes} min read
              </span>
            </div>
          </Link>
        </RevealItem>

        <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <RevealItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="hover-lift group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl2)] bg-[var(--color-paper)] ring-1 ring-[var(--color-line)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[600ms] ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-[var(--radius-pill)] bg-black/45 px-2.5 py-1 text-[0.75rem] font-medium text-white backdrop-blur-md">
                    {post.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="t-h3 text-balance">{post.title}</h3>
                  <p className="t-small mt-2 line-clamp-2 flex-1 text-[var(--color-body)]">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-4">
                    <span className="t-small inline-flex items-center gap-1.5 text-[var(--color-body-soft)]">
                      <Clock className="size-3.5" strokeWidth={1.5} aria-hidden />
                      {post.readMinutes} min
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 text-[var(--color-teal-700)] transition-transform duration-[240ms] group-hover:rotate-45"
                      strokeWidth={1.75}
                    />
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <ClosingCta />
    </>
  );
}
